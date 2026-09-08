/**
 * The hero's capacity ring. `index.html:65`, `wire.js` -> `renderRing`.
 *
 * One concentric band per drive: the dimmed part is what is in use, the accent arc
 * is the part of that a run could give back. It is the page's only circle, which
 * is most of why the hero's right half stops reading as dead space.
 *
 * 🔴 REAL `d3-shape`, not a hand-rolled path, and a CONSTANT viewBox - the same
 * rule the treemap and the sparkline already follow here: the drawn box never
 * resizes with the data, so arriving numbers cannot shift the layout around them.
 *
 * 🔴 IT DRAWS ONLY ONCE A SCAN HAS MEASURED. The dummy's seed always has data, so
 * it never renders an unmeasured ring and owns no words for one - and the centre
 * of this ring is a percentage OF the reclaimable total, which does not exist
 * before a scan. Rather than invent a sentence the dummy has not approved, the
 * ring is absent until there is something true to put in the middle of it; the
 * hero beside it already says "not measured" and explains why. Reported as a dummy
 * question rather than answered here.
 *
 * 🔴 Every colour is a token, so the one theme control reaches this the way it
 * reaches everything else. A hex here would be invisible to it.
 */

import { useTranslation } from 'react-i18next';
import { arc } from 'd3-shape';

import { formatBytes } from '../lib/format';
import { totalBytesOf, type DriveRow } from '../lib/drives';

/** The dummy's own geometry (`wire.js` -> `renderRing`), kept to the pixel. */
const SIZE = 260;
const CENTRE = SIZE / 2;
const TAU = Math.PI * 2;
const GAP = 0.055;
const OUTER = 116;
const BAND = 19;
const PAD = 7;

const TRACK_FILL = 'color-mix(in oklab, var(--c-ink) 9%, transparent)';
const USED_FILL = 'color-mix(in oklab, var(--c-ink) 26%, transparent)';

/** One arc's path, with the dummy's 3px corner rounding. */
function arcPath(inner: number, outer: number, start: number, end: number): string {
  return (
    arc().cornerRadius(3)({
      innerRadius: inner,
      outerRadius: outer,
      startAngle: start,
      endAngle: end,
    }) ?? ''
  );
}

export function CapacityRing({ rows }: { rows: DriveRow[] }) {
  const { t } = useTranslation();

  const total = totalBytesOf(rows);
  /* 🔴 `null` propagates rather than becoming 0. A drive with no measurement is
     not a drive with nothing on it, and summing nulls as zeroes would draw a
     confident 0.0% over a machine nobody has scanned. */
  const measuredRows = rows.filter((row) => row.reclaimableBytes !== null);
  if (rows.length === 0 || total <= 0 || measuredRows.length !== rows.length) return null;

  const reclaimable = rows.reduce((sum, row) => sum + (row.reclaimableBytes ?? 0), 0);
  const percent = ((reclaimable / total) * 100).toFixed(1);

  return (
    <div className="hero-ring">
      <svg
        className="ring-svg"
        viewBox={`0 0 ${String(SIZE)} ${String(SIZE)}`}
        role="img"
        aria-label={t('home.ringAria', {
          reclaimable: formatBytes(reclaimable),
          percent,
          total: formatBytes(total),
          count: rows.length,
        })}
      >
        {rows.map((row, i) => {
          const outer = OUTER - i * (BAND + PAD);
          const inner = outer - BAND;
          const used = Math.max(0, row.totalBytes - row.freeBytes);
          const recl = Math.min(Math.max(0, row.reclaimableBytes ?? 0), used);
          /* The reclaimable arc comes OUT of the used arc, never beside it: the
             space is already occupied, and drawing it as a fourth region past the
             full sweep would say the disk holds more than it does. */
          const usedFrac = (used - recl) / row.totalBytes;
          const reclFrac = recl / row.totalBytes;
          const sweep = TAU - GAP * 2;

          return (
            <g key={row.letter}>
              <path
                d={arcPath(inner, outer, GAP, TAU - GAP)}
                transform={`translate(${String(CENTRE)},${String(CENTRE)})`}
                fill={TRACK_FILL}
              />
              <path
                d={arcPath(inner, outer, GAP, GAP + sweep * usedFrac)}
                transform={`translate(${String(CENTRE)},${String(CENTRE)})`}
                fill={USED_FILL}
              />
              <path
                className="ring-recl"
                d={arcPath(inner, outer, GAP + sweep * usedFrac, GAP + sweep * (usedFrac + reclFrac))}
                transform={`translate(${String(CENTRE)},${String(CENTRE)})`}
                fill="var(--c-accent)"
              />
              {/* A `<title>`, not a drawn letter: the Drives band directly below is
                  the labelled view, and three letters stacked in the 12 o'clock gap
                  read as a stray list rather than as part of the ring. */}
              <title>
                {t('home.ringArcTitle', {
                  letter: row.letter,
                  free: formatBytes(row.freeBytes),
                  total: formatBytes(row.totalBytes),
                  reclaimable: formatBytes(row.reclaimableBytes ?? 0),
                })}
              </title>
            </g>
          );
        })}

        <text
          x={CENTRE}
          y={CENTRE + 2}
          textAnchor="middle"
          fontSize="31"
          fontFamily="var(--ff-display)"
          fontWeight="700"
          fill="var(--c-accent-ink)"
        >
          {`${percent}%`}
        </text>
        <text
          x={CENTRE}
          y={CENTRE + 19}
          textAnchor="middle"
          fontSize="9.5"
          letterSpacing="1.1"
          fill="var(--c-ink-3)"
        >
          {t('home.ringCaption')}
        </text>
      </svg>
    </div>
  );
}
