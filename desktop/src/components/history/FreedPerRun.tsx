/**
 * *Freed per run* - `history.html:39-49` and `page-history.js` -> `spark`.
 *
 * 🔴 THE FRAME IS FIXED AND THE DOMAIN MOVES, as the panel's own note says: the box
 * is 900 x 90 in its own units whatever the data, so the page never reflows when a
 * run lands. React draws; `d3-scale` and `d3-shape` only calculate (the D3 boundary
 * `LastRuns.tsx` keeps too).
 *
 * 🔴 `[0, peak]`, NOT `[min, max]`. The dummy's first spark normalised between the
 * smallest and largest run, which drew a 2.4 GB run on the baseline as if it had
 * freed nothing. Home's last-runs spark plots the same metric from zero, and one
 * metric keeps one scale on every surface - the dummy was amended to match.
 *
 * Real runs only, oldest on the left: a dry-run freed nothing, so it has no point on
 * a line of what was freed. The table under the chart carries every figure, which is
 * the accessible form of the same data; the SVG is one `img` with its own label.
 */

import { useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import { useTranslation } from 'react-i18next';

import { realRunsOldestFirst } from '../../lib/history-rows';
import type { HistoryEntry } from '../../state/store';

/* `page-history.js` -> `spark`: the drawn box, in its own units. */
const W = 900;
const H = 90;
const PAD = 6;

interface Point {
  key: string;
  cx: number;
  cy: number;
}

export function FreedPerRun({ runs }: { runs: readonly HistoryEntry[] }) {
  const { t } = useTranslation();

  const drawn = useMemo(() => {
    const real = realRunsOldestFirst(runs);
    const peak = Math.max(1, ...real.map((r) => r.freedBytes));
    const x = scaleLinear()
      .domain([0, Math.max(1, real.length - 1)])
      .range([PAD, W - PAD]);
    const y = scaleLinear()
      .domain([0, peak])
      .range([H - PAD, PAD]);
    /* One run has no "across": it sits in the middle of the frame rather than on its edge. */
    const points: Point[] = real.map((r, i) => ({
      key: `${r.runId}-${String(i)}`,
      cx: real.length === 1 ? W / 2 : x(i),
      cy: y(Math.max(0, r.freedBytes)),
    }));
    const path =
      line<Point>()
        .x((p) => p.cx)
        .y((p) => p.cy)(points) ?? '';
    return { points, path };
  }, [runs]);

  return (
    <section className="band band-app band-tight">
      <div className="wrap">
        <div className="panel pad">
          <div className="fw-row hist-chart-head">
            <span className="caps ink-3">{t('history.chartTitle')}</span>
            <span className="t-xs ink-3 hist-chart-note">{t('history.chartNote')}</span>
          </div>
          {drawn.points.length === 0 ? (
            <div className="chart-empty hist-spark">{t('history.chartEmpty')}</div>
          ) : (
            <svg
              className="hist-spark"
              viewBox={`0 0 ${String(W)} ${String(H)}`}
              width="100%"
              height={H}
              role="img"
              aria-label={t('history.chartAria', { count: drawn.points.length })}
            >
              <path
                d={drawn.path}
                fill="none"
                stroke="var(--c-accent)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              {drawn.points.map((p) => (
                <circle key={p.key} cx={p.cx} cy={p.cy} r="3" fill="var(--c-accent)" />
              ))}
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
