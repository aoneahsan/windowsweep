/**
 * The Report's first band - `report.html:23-41`: the way back to History and which
 * run this is, the run's figure, its meta line, and *Show the JSON*.
 *
 * The breadcrumb names the run by the same exact minute its History row shows, so
 * the row that was clicked and the page it opened read as one thing.
 *
 * 🔴 *Export...* IS DECLARED, NOT BUILT - `pending-wave` (coordinator decision for
 * desktop 1.2.0; the build is product PENDING-TASKS TASK-015). The dummy's export
 * hands the file to the engine's own `--export md|html`; this window may pass neither
 * that flag (`src-tauri/src/args.rs` allowlists no `--export`) nor reveal or save a
 * file (the capability file grants neither). So the dummy's button is drawn DISABLED
 * with its reason beside it, rather than hidden (a quiet drop) or live (a promise the
 * first press breaks). The note names no terminal command on purpose: the command
 * line's `--export` reads its own default reports folder, not this window's per-run
 * folder, so it would not find this report.
 */

import { useId } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from 'react-aria-components';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../../lib/format';
import { exactStamp } from '../../lib/history-dates';
import type { ReportLoad } from '../../lib/report-loader';
import type { HistoryEntry } from '../../state/store';
import { metaLine } from './report-words';

/**
 * The way back to History. `current` names the run by the exact minute its History
 * row shows; with none (a run no longer in the list) the trail is History alone.
 */
export function ReportCrumbs({ current }: { current?: string }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t('report.crumbsLabel')}>
      <ol className="crumbs rep-crumbs">
        <li>
          <Link to="/history" className="lnk">{t('history.title')}</Link>
        </li>
        {current === undefined ? null : (
          <li>
            <span aria-current="page">{current}</span>
          </li>
        )}
      </ol>
    </nav>
  );
}

interface ReportHeaderProps {
  entry: HistoryEntry;
  load: ReportLoad;
  jsonOpen: boolean;
  jsonId: string;
  /** The note explaining why the file cannot be shown, when it cannot. */
  reasonId: string | null;
  onToggleJson: () => void;
}

export function ReportHeader({ entry, load, jsonOpen, jsonId, reasonId, onToggleJson }: ReportHeaderProps) {
  const { t } = useTranslation();
  const exportNoteId = useId();
  const report = load.status === 'ready' ? load.report : null;
  /* The note says "the report file named below", which is true only while there is
     one: it is drawn from the first frame of a read (so nothing moves when the file
     lands) and withdrawn when the file turns out missing or unreadable - there, the
     disabled button is described by that note instead. */
  const exportNoteShown = load.status === 'loading' || load.status === 'ready';
  /* A key omitted rather than set to `undefined` - React Aria's props are exact. */
  const exportDescribedBy = exportNoteShown ? exportNoteId : reasonId;

  /* The report's own total once the file is read, the History record's until then.
     Both are the engine's one number for the run (`$ws.TotalFreed` /
     `$ws.TotalEstimated`), so the swap never changes a digit. */
  const dryRun = report ? report.dryRun : entry.dryRun;
  const bytes = dryRun
    ? (report?.estimatedBytes ?? entry.estimatedBytes)
    : (report?.reclaimedBytes ?? entry.freedBytes);
  const title = t(dryRun ? 'report.titleDryRun' : 'report.titleFreed', { amount: formatBytes(bytes) });

  return (
    <section className="band band-app band-tight">
      <div className="wrap">
        <ReportCrumbs current={exactStamp(entry.startedAt)} />
        <div className="rep-head">
          <div>
            <h1 className="t-xl wide">{title}</h1>
            {/* Held at its own height while the file is read, so nothing moves when it lands. */}
            <p className="t-sm ink-3">{report ? metaLine(report, t) : '\u00a0'}</p>
          </div>
          <div className="rep-actions">
            <div className="rep-buttons">
              {/* `aria-disabled` rather than `disabled` while there is no file to show:
                  it stays reachable, and the note it points at says why. */}
              <button
                className="btn"
                type="button"
                aria-expanded={report ? jsonOpen : undefined}
                aria-controls={report && jsonOpen ? jsonId : undefined}
                aria-disabled={report === null || undefined}
                data-disabled={report === null ? '' : undefined}
                aria-describedby={reasonId ?? undefined}
                onClick={report === null ? undefined : onToggleJson}
              >
                {t('report.showJson')}
              </button>
              {/* `pending-wave`: disabled, and React Aria has no focusable-disabled
                  Button, so the reason sits beside it as visible text and is linked;
                  a disabled button stays in the accessibility tree, so the link is read. */}
              <Button className="btn" isDisabled {...(exportDescribedBy ? { 'aria-describedby': exportDescribedBy } : {})}>
                {t('report.export')}
              </Button>
            </div>
            {exportNoteShown ? (
              <p className="t-xs ink-3 rep-export-note" id={exportNoteId}>{t('report.exportPending')}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
