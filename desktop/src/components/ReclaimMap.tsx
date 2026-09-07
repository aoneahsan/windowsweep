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
 * 🔴 One channel, not two. The dummy shades each tile by how long the cache has
 * been idle, interpolating between the tier's own two ends. `--scan` reports a
 * size per target and no age, so that channel has no data: every tile therefore
 * takes the tier's `hi` end, which is exactly what the dummy's own `idleScale`
 * degenerates to when the idle range carries no information (`reclaim-map.js:165`
 * - `hi > lo` false, so `mixFor` returns 100). The gap is declared in the UI, in
 * `ReclaimMapBand`, rather than papered over with an invented age.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hierarchy, treemap, treemapSquarify, type HierarchyRectangularNode } from 'd3-hierarchy';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import type { SectionTier } from '../lib/catalogue';

/** One target, as the map needs it. Every field comes from the engine. */
export interface MapTarget {
  section: number;
  /** The section's own key from the catalogue - the engine's vocabulary. */
  sectionKey: string;
  tier: SectionTier;
  label: string;
  path: string;
  bytes: number;
}

interface Leaf {
  name: string;
  path: string;
  value: number;
  section: number;
  tier: SectionTier;
  children?: undefined;
}
interface Group {
  name: string;
  section: number;
  tier: SectionTier;
  path?: undefined;
  value?: undefined;
  children: Leaf[];
}
interface Root {
  name: string;
  path?: undefined;
  value?: undefined;
  section?: undefined;
  tier?: undefined;
  children: Group[];
}
type MapNode = Root | Group | Leaf;

/** Room for the section label strip. `reclaim-map.js:34`. */
const PAD_TOP = 19;

/** Portrait below 700px, landscape above. `reclaim-map.js:31-33`. */
function frameFor(px: number): { w: number; h: number } {
  return px > 0 && px < 700 ? { w: 620, h: 760 } : { w: 1000, h: 340 };
}

/**
 * Interpolate between the tier's OWN two ends, never toward the page surface -
 * mixing toward the background is what produced mud. `reclaim-map.js:56-59`.
 */
function tierColour(tier: SectionTier, pct: number): string {
  return `color-mix(in oklab, var(--c-tier-${tier}-hi) ${String(pct)}%, var(--c-tier-${tier}-lo))`;
}

/** `reclaim-map.js:66-70`. */
function fitText(text: string, widthPx: number, fontPx: number): string {
  const max = Math.floor((widthPx - 12) / (fontPx * 0.56));
  if (max < 3) return '';
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

function buildRoot(targets: MapTarget[]): Root {
  const groups = new Map<number, MapTarget[]>();
  for (const target of targets) {
    if (target.bytes <= 0) continue;
    const list = groups.get(target.section);
    if (list) list.push(target);
    else groups.set(target.section, [target]);
  }
  return {
    name: 'reclaimable',
    children: [...groups.entries()].map(([section, list]) => ({
      name: list[0]?.sectionKey ?? String(section),
      section,
      tier: list[0]?.tier ?? 'rebuilds',
      children: list.map((t) => ({
        name: t.label,
        path: t.path,
        value: t.bytes,
        section: t.section,
        tier: t.tier,
      })),
    })),
  };
}

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
}

export function ReclaimMap({ targets, measured }: { targets: MapTarget[]; measured: boolean }) {
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
    });
  }, []);

  const groups = laid?.children ?? [];
  const leaves = laid?.leaves() ?? [];

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
        aria-label={t('home.mapAria', {
          targets: leaves.length,
          sections: groups.length,
          amount: formatBytes(laid.value ?? 0),
        })}
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
          const sub = w > 54 && h > 42 ? fitText(formatBytes(leaf.value), w, 10) : '';

          return (
            <g
              className="tm-tile"
              key={leaf.path}
              onMouseMove={(e) => { onMove(e, leaf); }}
              onMouseLeave={() => { setTip(null); }}
            >
              {/* 🔴 pct 100: the tier's `hi` end. See the file header - the idle
                  channel has no data source, so this is the dummy's own
                  degenerate branch rather than a different design. */}
              <rect
                className="fill"
                x={node.x0}
                y={node.y0}
                width={w}
                height={h}
                rx={2}
                fill={tierColour(leaf.tier, 100)}
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
            {/* `reclaim-map.js:115-117`, minus the idle clause the engine cannot fill. */}
            {t('home.mapTipMeta', {
              amount: formatBytes(tip.bytes),
              section: tip.section,
              tier: tip.tier,
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * The accessible table carrying the same data - the primary accessible
 * representation, not a consolation prize. `reclaim-map.js:402-429`.
 *
 * The dummy's fifth column is Idle (days); the engine reports no age per target,
 * so it is absent here and declared beside the map.
 */
export function ReclaimMapTable({ targets }: { targets: MapTarget[] }) {
  const { t } = useTranslation();
  const rows = targets.filter((x) => x.bytes > 0);
  return (
    <table className="tbl">
      <thead>
        <tr>
          <th>{t('home.mapColSection')}</th>
          <th>{t('home.mapColTarget')}</th>
          <th>{t('home.mapColPath')}</th>
          <th className="num-cell">{t('home.mapColSize')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.path}>
            <td>{row.sectionKey}</td>
            <td>{row.label}</td>
            <td className="mono t-2xs">{row.path}</td>
            <td className="num-cell">{formatBytes(row.bytes)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
