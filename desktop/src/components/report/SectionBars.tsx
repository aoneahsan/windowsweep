/**
 * *What each section freed* - `report.html:48-49`, `page-report.js` -> `bars`.
 *
 * The dummy's drawing, unit for unit: a 760-wide box, one 22-unit bar per step on a
 * full-width track, the section's number and key on the left and its figure on the
 * right. React draws; `d3-scale` maps bytes to width. The box's height is fixed by
 * how many sections the run attempted, which a written report never changes.
 *
 * 🔴 A ZERO READS AS WHAT HAPPENED. The dummy wrote `skipped` beside every empty
 * bar, including section 21's, which ran and freed nothing by design - so the chart
 * and the table beside it disagreed about the same step. A section that did not run
 * shows its own status word; one that ran and freed nothing shows `0 B`.
 *
 * The table below carries every figure, so the SVG is one `img` with a label rather
 * than a second, worse table.
 */

import { scaleLinear } from 'd3-scale';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../../lib/format';
import { numberedSteps, type ReportStep } from '../../lib/report-file';

/* `page-report.js` -> `bars`: the drawn box, in its own units. */
const W = 760;
const BAR_H = 22;
const GAP = 10;
const LABEL_W = 110;
const VALUE_W = 70;

function zeroLabel(step: ReportStep): string {
  return step.status === 'ran' || step.status === 'dry-run' ? formatBytes(0) : step.status;
}

function barLabel(step: ReportStep, name: string): string {
  return [String(step.section), name].join(' \u00b7 ');
}

export function SectionBars({
  steps,
  dryRun,
  nameOf,
}: {
  steps: readonly ReportStep[];
  dryRun: boolean;
  nameOf: (step: ReportStep) => string;
}) {
  const { t } = useTranslation();
  const rows = numberedSteps(steps);
  const track = W - LABEL_W - VALUE_W;
  const x = scaleLinear()
    .domain([0, Math.max(1, ...rows.map((r) => r.freedBytes))])
    .range([0, track]);
  const height = Math.max(1, rows.length * (BAR_H + GAP));

  return (
    <svg
      className="rep-bars"
      viewBox={['0', '0', String(W), String(height)].join(' ')}
      width="100%"
      role="img"
      aria-label={t(dryRun ? 'report.barsAriaDryRun' : 'report.barsAria')}
    >
      {rows.map((step, i) => {
        const y = i * (BAR_H + GAP);
        const base = y + BAR_H * 0.72;
        return (
          <g key={[step.n, step.section].join('-')}>
            <text className="chart-ax" x={LABEL_W - 10} y={base} textAnchor="end">
              {barLabel(step, nameOf(step))}
            </text>
            <rect x={LABEL_W} y={y} width={track} height={BAR_H} rx="3" fill="var(--c-line)" />
            {step.freedBytes > 0 ? (
              <rect
                x={LABEL_W}
                y={y}
                width={Math.max(3, x(step.freedBytes))}
                height={BAR_H}
                rx="3"
                fill={dryRun ? 'var(--c-ink-3)' : 'var(--c-accent)'}
              />
            ) : null}
            <text className="chart-ax" x={W - 4} y={base} textAnchor="end">
              {step.freedBytes > 0 ? formatBytes(step.freedBytes) : zeroLabel(step)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
