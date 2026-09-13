/**
 * *Disk, before and after* - `report.html:54-55`, `page-report.js` -> `drives`.
 *
 * Every fixed drive the engine snapshotted when the run began (`disk.before`) beside
 * the same drive when it ended (`disk.after`) - the file's own numbers, never the
 * dummy's arithmetic of free space plus what was reclaimable.
 *
 * 🔴 THE TICK MEANS THE DRIVE GAINED SPACE, and only then. `.state-ok` never renders
 * without its tick, and the tick says "this succeeded"; a drive that lost space
 * during the run - something else wrote to it, or it was a dry-run - gets the
 * figure without a claim.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../../lib/format';
import type { RunReport } from '../../lib/report-file';

/** The used share of a drive after the run, as a CSS width. */
function usedWidth(sizeBytes: number, freeBytes: number): string {
  const used = sizeBytes > 0 ? ((sizeBytes - freeBytes) / sizeBytes) * 100 : 0;
  return String(Math.min(100, Math.max(0, used))) + '%';
}

export function DiskBeforeAfter({ disk }: { disk: RunReport['disk'] }) {
  const { t } = useTranslation();
  return (
    <div className="rep-drives">
      {disk.before.map((before) => {
        const after = disk.after.find((d) => d.drive === before.drive) ?? null;
        const free = after?.freeBytes ?? before.freeBytes;
        const gained = after !== null && after.freeBytes > before.freeBytes;
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
