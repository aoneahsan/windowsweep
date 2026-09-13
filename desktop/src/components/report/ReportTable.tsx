/**
 * The per-section table - `report.html:62-80`, `page-report.js` -> `table`.
 *
 * `#`, the section's key, the engine's status word, what it freed, and the engine's
 * own `note` for the step (`lib/log.ps1` -> `Add-ReportStep`) - the column the app
 * used to fill with the catalogue's title, which is what a section TOUCHES, not what
 * happened to it. A step with no note says so with a dash rather than a blank.
 *
 * For a dry-run the figures are estimates: the column says `Would free` and the
 * numbers go without the accent, as a dry-run's figure does in History.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../../lib/format';
import { numberedSteps, type ReportStep } from '../../lib/report-file';
import { statusBadge } from './report-words';

const DASH = '\u2014';

export function ReportTable({
  steps,
  dryRun,
  nameOf,
}: {
  steps: readonly ReportStep[];
  dryRun: boolean;
  nameOf: (step: ReportStep) => string;
}) {
  const { t } = useTranslation();
  return (
    <div className="panel rep-table">
      <div className="xscroll">
        <table className="tbl">
          <thead>
            <tr>
              <th className="rep-col-id">{t('report.colId')}</th>
              <th className="rep-col-section">{t('report.colSection')}</th>
              <th className="rep-col-status">{t('report.colStatus')}</th>
              <th className="num-cell rep-col-freed">{t(dryRun ? 'report.colFreedDryRun' : 'report.colFreed')}</th>
              <th>{t('report.colNote')}</th>
            </tr>
          </thead>
          <tbody>
            {numberedSteps(steps).map((step) => (
              <tr key={[step.n, step.section].join('-')}>
                <td className="num t-sm ink-3">{step.section}</td>
                <td>
                  <span className="t-sm rep-key">{nameOf(step)}</span>
                </td>
                <td>
                  <span className={statusBadge(step.status)}>{step.status}</span>
                </td>
                <td className={step.freedBytes > 0 && !dryRun ? 'num-cell t-sm accent-ink' : 'num-cell t-sm'}>
                  {step.freedBytes > 0 ? formatBytes(step.freedBytes) : DASH}
                </td>
                <td className="t-sm ink-3">{step.note !== '' ? step.note : DASH}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
