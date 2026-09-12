/**
 * THE RECLAIM MAP - windowsweep desktop's signature element.
 *
 * Translated from `desktop/design/windowsweep-click-dummy/reclaim-map.js`, whose
 * header comment carries the reasoning. The four rules it states are kept here:
 *
 * 🔴 REAL `d3.treemap()` from `d3-hierarchy`, never SVG assembled from strings. A
 * fake chart becomes a fake chart in every page that copies the precedent.
 *
 * 🔴 THE RENDERED BOX DOES NOT CHANGE WITH THE DATA. Constant viewBox, constant
 * scale RANGE; only the domain responds. It DOES change with the VIEWPORT, which
 * is a different thing and is required: a 1000x340 landscape treemap squeezed into
 * a narrow column is unreadable and leaves dead frame under the tiles.
 *
 * 🔴 THE ZERO STATE IS DESIGNED, not left blank - a signature element that renders
 * as an empty rectangle destroys the product's argument on first paint.
 *
 * 🔴 TWO CHANNELS, TWO VARIABLES, each canonical - the dummy's own rule
 * (`reclaim-map.js:36-49`): HUE is the tier, how risky removing it is; LIGHTNESS
 * is how long the cache has sat unused. The second channel had no data source
 * until the 1.2.0 engine started reporting `targets[].newest_write_utc`, and every
 * tile took the tier's `hi` end - which is what the dummy's own `idleScale`
 * degenerates to when the idle range carries no information. It now carries the
 * engine's own measurement, converted to days once in `cli.ts` -> `idleDaysOf`.
 * The domain is re-solved from THIS data on every render, so a machine whose
 * oldest cache is 60 days still gets the full ramp instead of eight
 * indistinguishable pale tiles.
 *
 * 🔴 A tile is a CONTROL on Home and inert on Run. Clicking it adds the target to
 * the exclusion set every run passes as `--exclude-path`; the Run screen's map is
 * draining what is already going, so it takes no `onToggle` and renders no
 * affordance. That is the dummy's `opts.interactive !== false`, kept.
 *
 * 🔴 THE MAP IS ONE TAB STOP, AND THE KEYBOARD PATH IS THE TABLE (TASK-009).
 * Every tile used to carry `tabIndex={0}`, `role="button"` and an `aria-label`
 * inside an `<svg role="img">`. `role="img"` makes its subtree presentational, so
 * all 28 names were computed and then discarded while all 28 tab stops remained -
 * 28 of Home's 58 focusable stops, 48% of the page, announcing roughly nothing.
 * The svg is now the single stop, carrying the summary label; the tiles are
 * `tabIndex={-1}`; and `ReclaimMapTable` grew a labelled switch per row, which is
 * how a target is kept out of the run without a pointer. Decided 2026-09-08 under
 * the agent's design authority and written into `reclaim-map.js` first.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hierarchy, treemap, treemapSquarify, type HierarchyRectangularNode } from 'd3-hierarchy';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import type { SectionTier } from '../lib/catalogue';
import {
  buildRoot,
  fitText,
  frameFor,
  idleScaleFor,
  PAD_TOP,
  tierColour,
  type Leaf,
  type MapNode,
  type MapTarget,
} from './reclaim-map-model';

/* Re-exported so every existing importer keeps one obvious place to reach for the
   map's public shape; the definition lives beside the geometry that uses it. */
export type { MapTarget } from './reclaim-map-model';
export { ReclaimMapTable } from './ReclaimMapTable';

/**
 * The defs the tiles reference: a hatch for the one tier that cannot be undone,
 * and a lit top edge so a tile reads as material rather than a flat swatch.
 * `reclaim-map.js:300-328`.
 */
function Defs() {
  return (
    <defs>
      <pattern id="wsHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="2" height="6" fill="oklch(0 0 0 / .34)" />
      </pattern>
      <linearGradient id="wsSheen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="color-mix(in oklab, var(--c-ink) 13%, transparent)" />
        <stop offset="100%" stopColor="transparent" />
      </linearGradient>
    </defs>
  );
}

/** What the tooltip needs, lifted out so the pointer handler stays cheap. */
interface Tip {
  x: number;
  y: number;
  path: string;
  bytes: number;
  section: number;
  tier: SectionTier;
  idleDays: number | null;
  excluded: boolean;
}

export function ReclaimMap({
  targets,
  measured,
  onToggle,
}: {
  targets: MapTarget[];
  measured: boolean;
  /**
   * Called with a target's path when its tile is activated. Omitted on the Run
   * screen, where the tiles are a drain animation rather than a control -
   * `opts.interactive !== false` in the dummy.
   */
  onToggle?: (path: string) => void;
}) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [tip, setTip] = useState<Tip | null>(null);

  /* The frame follows the VIEWPORT. A ResizeObserver rather than a window
     listener, because the content column changes width when the rail collapses
     and the window has not moved. */
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    setWidth(node.clientWidth);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => { observer.disconnect(); };
  }, []);

  const frame = frameFor(width);

  const laid = useMemo(() => {
    const root = buildRoot(targets);
    if (root.children.length === 0) return null;
    const h = hierarchy<MapNode>(root, (d) => d.children)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    treemap<MapNode>()
      .tile(treemapSquarify.ratio(frame.w > frame.h ? 1.4 : 0.8))
      .size([frame.w, frame.h])
      .paddingOuter(2)
      .paddingTop(PAD_TOP)
      .paddingInner(2)
      .round(true)(h);
    return h as HierarchyRectangularNode<MapNode>;
  }, [targets, frame.w, frame.h]);

  const onMove = useCallback((event: React.MouseEvent, leaf: Leaf) => {
    const box = rootRef.current?.getBoundingClientRect();
    if (!box) return;
    setTip({
      x: event.clientX - box.left + 14,
      y: event.clientY - box.top + 14,
      path: leaf.path,
      bytes: leaf.value,
      section: leaf.section,
      tier: leaf.tier,
      idleDays: leaf.idleDays,
      excluded: leaf.excluded,
    });
  }, []);

  const groups = laid?.children ?? [];
  const leaves = laid?.leaves() ?? [];
  /* Derived from `laid`, not from `leaves`: `leaves()` builds a fresh array on
     every render, so a memo keyed on it would recompute every render. `laid` only
     changes when the data or the frame does, which is exactly when the ramp's
     domain can change. */
  const idleScale = useMemo(
    () => idleScaleFor((laid?.leaves() ?? []).map((node) => node.data as Leaf)),
    [laid],
  );

  /* What the drawn tiles hold that a run will NOT take, so the label can subtract
     it rather than quoting a total the hero disagrees with. Zero on the Run
     screen, whose targets are already the included ones. */
  const excludedBytes = useMemo(
    () =>
      (laid?.leaves() ?? [])
        .map((node) => node.data as Leaf)
        .reduce((total, leaf) => (leaf.excluded ? total + leaf.value : total), 0),
    [laid],
  );

  /* 🔴 ONE `tm-frame` node for every state, not one per branch. Two sibling
     branches each carrying `ref={rootRef}` looked equivalent and were not: React
     unmounts one and mounts the other, the ResizeObserver stays attached to the
     node that left, and `width` freezes at whatever it was when the map was
     empty - so the first scan could lay the treemap out against a stale frame.
     Switching only the children keeps the observed node identical. */
  return (
    <div className="tm-frame" ref={rootRef} onMouseLeave={() => { setTip(null); }}>
      {/* 🔴 The zero state and the unmeasured state are two different things and
          the app has both. The dummy only has the first, because its numbers are
          seeded and there is no "before a scan" for it. */}
      {!laid ? (
        <div className="tm-empty-note">
          <p className="t-lg wide">{measured ? t('home.mapZeroTitle') : t('home.mapUnmeasuredTitle')}</p>
          <p className="t-sm ink-2" style={{ maxWidth: '30rem' }}>
            {measured ? t('home.mapZeroBody') : t('home.mapUnmeasuredBody')}
          </p>
        </div>
      ) : (
      <svg
        className="tm-svg"
        viewBox={`0 0 ${String(frame.w)} ${String(frame.h)}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        /* 🔴 ONE stop for the whole map, carrying the summary below. Before
           TASK-009 this element was not focusable and its 28 tiles each were, so
           the page had 28 nameless stops and the one thing with a name was
           unreachable. */
        tabIndex={0}
        /* 🔴 The dummy's sentence, verbatim, whenever nothing is excluded - which
           is every state the dummy specifies. The second form is app-side copy for
           a state it has no equivalent for, and it exists because the map draws
           the excluded tiles too: `laid.value` therefore includes bytes the run
           will refuse, and a reader who only gets this label would be told a total
           the hero above contradicts. Sighted readers see the dimming; this is the
           same fact, said. */
        aria-label={
          excludedBytes > 0
            ? t('home.mapAriaExcluded', {
                targets: leaves.length,
                sections: groups.length,
                amount: formatBytes((laid.value ?? 0) - excludedBytes),
                excludedAmount: formatBytes(excludedBytes),
              })
            : t('home.mapAria', {
                targets: leaves.length,
                sections: groups.length,
                amount: formatBytes(laid.value ?? 0),
              })
        }
      >
        <Defs />

        {/* the section frames and their label strips */}
        {groups.map((group) => {
          const w = group.x1 - group.x0;
          const h = group.y1 - group.y0;
          if (w < 4 || h < 4) return null;
          const label = fitText(
            `${group.data.name}  ·  ${formatBytes(group.value ?? 0)}`,
            w,
            10.5,
          );
          const labelled = w > 62 && h > PAD_TOP + 6;
          return (
            <g key={`g${String(group.data.section ?? group.data.name)}`}>
              <rect
                x={group.x0}
                y={group.y0}
                width={w}
                height={h}
                rx={3}
                fill="none"
                stroke="var(--c-line)"
                strokeWidth={1}
              />
              {labelled ? (
                <>
                  <rect
                    className="tm-group-chip"
                    x={group.x0 + 3}
                    y={group.y0 + 2.5}
                    width={Math.min(w - 6, 168)}
                    height={14}
                    rx={3}
                    fill="color-mix(in oklab, var(--c-ink) 7%, transparent)"
                  />
                  <text
                    x={group.x0 + 6}
                    y={group.y0 + 13}
                    className="tm-label"
                    fontSize="10.5"
                    fill="var(--c-ink-3)"
                  >
                    {label}
                  </text>
                </>
              ) : null}
            </g>
          );
        })}

        {/* the tiles */}
        {leaves.map((node) => {
          const leaf = node.data as Leaf;
          const w = node.x1 - node.x0;
          const h = node.y1 - node.y0;
          if (w < 2 || h < 2) return null;

          const name = w > 54 && h > 26 ? fitText(leaf.name, w, 11) : '';
          /* `reclaim-map.js:262-266` - size and age when both fit, size alone
             when they do not. A target with no stamp keeps the size-only form
             rather than printing an invented age. */
          const full =
            leaf.idleDays === null
              ? formatBytes(leaf.value)
              : t('home.mapTileMeta', { amount: formatBytes(leaf.value), days: leaf.idleDays });
          const short = formatBytes(leaf.value);
          const sub =
            w > 54 && h > 42 ? (fitText(full, w, 10) === full ? full : fitText(short, w, 10)) : '';

          const toggle = onToggle ? () => { onToggle(leaf.path); } : undefined;

          return (
            <g
              className="tm-tile"
              key={leaf.path}
              data-excluded={leaf.excluded ? 'true' : 'false'}
              /* 🔴 -1, never 0, and no `role="button"` or `aria-label` with it.
                 Those three together inside `role="img"` are what produced 28
                 nameless tab stops: the names were computed and discarded by the
                 presentational subtree while the stops survived. -1 rather than
                 omitted so a tile can still be focused programmatically without
                 ever entering the tab order. The keyboard equivalent of this
                 control is the switch on the matching table row. */
              tabIndex={-1}
              onMouseMove={(e) => { onMove(e, leaf); }}
              onMouseLeave={() => { setTip(null); }}
              /* The pointer path only. A key handler here would be code that can
                 never run, because nothing can focus a tile from the keyboard. */
              onClick={toggle}
            >
              {/* The second channel: the tier's own two ends, interpolated by how
                  long this target has sat unused. `reclaim-map.js:224-225`. */}
              <rect
                className="fill"
                x={node.x0}
                y={node.y0}
                width={w}
                height={h}
                rx={2}
                fill={tierColour(leaf.tier, idleScale(leaf.idleDays))}
              />
              {h > 14 ? (
                <rect
                  className="sheen"
                  x={node.x0}
                  y={node.y0}
                  width={w}
                  height={Math.min(h * 0.55, 34)}
                  rx={4}
                  fill="url(#wsSheen)"
                  pointerEvents="none"
                />
              ) : null}
              {leaf.tier === 'permanent' ? (
                <rect
                  x={node.x0}
                  y={node.y0}
                  width={w}
                  height={h}
                  rx={2}
                  fill="url(#wsHatch)"
                  pointerEvents="none"
                />
              ) : null}
              {name ? (
                <text
                  x={node.x0 + 6}
                  y={node.y0 + 15}
                  className="tm-label"
                  fontSize="11"
                  fill="var(--c-ink)"
                >
                  {name}
                </text>
              ) : null}
              {sub ? (
                <text
                  x={node.x0 + 6}
                  y={node.y0 + 29}
                  className="tm-sub"
                  fontSize="10"
                  fill="var(--c-ink)"
                  opacity=".74"
                >
                  {sub}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      )}

      {tip ? (
        <div className="tm-tip" style={{ left: `${String(tip.x)}px`, top: `${String(tip.y)}px` }}>
          <div className="mono" style={{ wordBreak: 'break-all' }}>{tip.path}</div>
          <div className="t-xs ink-3" style={{ marginTop: '2px' }}>
            {/* `reclaim-map.js:115-117`, whole: size, idle, section, tier, and the
                EXCLUDED clause when this tile has been clicked out of the run. The
                idle clause is dropped rather than guessed for a target the engine
                gave no timestamp for. */}
            {tip.idleDays === null
              ? t('home.mapTipMeta', {
                  amount: formatBytes(tip.bytes),
                  section: tip.section,
                  tier: tip.tier,
                })
              : t('home.mapTipMetaIdle', {
                  amount: formatBytes(tip.bytes),
                  days: tip.idleDays,
                  section: tip.section,
                  tier: tip.tier,
                })}
            {tip.excluded ? t('home.mapTipExcluded') : ''}
          </div>
        </div>
      ) : null}
    </div>
  );
}
