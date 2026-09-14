/**
 * *Disk, before and after* - `report.html:54-55`, `page-report.js` -> `drives`.
 *
 * Every fixed drive the engine snapshotted when the run began (`disk.before`) beside
 * the same drive when it ended (`disk.after`) - the file's own numbers, never the
 * dummy's arithmetic of free space plus what was reclaimable.
 *
 * 🔴 THE TICK MEANS THE RUN GAINED THE DRIVE SPACE, and only then. `.state-ok` never
 * renders without its tick, and the tick says "this succeeded"; a drive that lost space
 * during the run - something else wrote to it - gets the figure without a claim.
 *
 * 🔴 AND A DRY-RUN NEVER TICKS (D-56, GATE 4 round 9). A rehearsal changes no drive at
 * all, so free space that ROSE while it ran is someone else's doing - measured: C:
 * gained 6.9 MB from other activity during a 112 s dry-run and read `✓ 8.3 GB free`
 * over `was 8.3 GB`. The dummy never ticks one (`page-report.js`: `gained = !DRY && …`).
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../../lib/format';
import type { RunReport } from '../../lib/report-file';

/** The used share of a drive after the run, as a CSS width. */
function usedWidth(sizeBytes: number, freeBytes: number): string {
  const used = sizeBytes > 0 ? ((sizeBytes - freeBytes) / sizeBytes) * 100 : 0;
  return String(Math.min(100, Math.max(0, used))) + '%';
}

export function DiskBeforeAfter({ disk, dryRun }: { disk: RunReport['disk']; dryRun: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="rep-drives">
      {disk.before.map((before) => {
        const after = disk.after.find((d) => d.drive === before.drive) ?? null;
        const free = after?.freeBytes ?? before.freeBytes;
        const gained = !dryRun && after !== null && after.freeBytes > before.freeBytes;
        return (
          <div className="drive" key={before.drive}>
            <span className="drive-name">{before.drive}</span>
            <div className="cap" aria-hidden="true">
              <i className="cap-seg cap-used" style={{ width: usedWidth(before.sizeBytes, free) }} />
            </div>
            <div className="t-xs rep-drive-fig">
              <div className={gained ? 'num state-ok' : 'num'}>
                {t('report.driveFree', { amount: formatBytes(free) })}
              </div>
              {after !== null ? (
                <div className="num t-2xs ink-3">{t('report.driveWas', { amount: formatBytes(before.freeBytes) })}</div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
