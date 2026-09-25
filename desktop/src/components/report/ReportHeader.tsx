/**
 * The Report's first band - `report.html:23-41`: the way back to History and which
 * run this is, the run's figure, its meta line, and *Show the JSON*.
 *
 * The breadcrumb names the run by the same exact minute its History row shows, so
 * the row that was clicked and the page it opened read as one thing.
 *
 * 🔴 *Export...* IS BUILT (TASK-015), and the declaration that stood here is gone.
 * It was `pending-wave` on the reasoning that this window could pass neither the
 * engine's `--export` flag nor reveal a file. Both halves turned out to be about
 * HOW rather than whether: `src-tauri/src/export.rs` runs the engine's own export
 * with a FIXED argument vector, so nothing goes on the webview's flag allowlist,
 * and it reveals the result from Rust, so no capability is granted to the webview
 * either. The window still converts nothing - `modules/reports.ps1` writes both
 * files, which is what keeps an exported report and this page from drifting apart.
 *
 * 🔴 The acknowledgement is AT THE CONTROL, and the words are the dummy's. This app
 * ships no toast component; the dummy delivers this sentence as one
 * (`page-report.js` -> `reportExport`) and here it is a `role="status"` line beside
 * the button, which is the placement `ScheduleSwitch` already records for exactly
 * this trade. A refusal is the ENGINE'S OWN, verbatim, for the reason recorded
 * there: the reasons are the engine's and paraphrasing one would put this window's
 * words over the engine's fact.
 */

import { useCallback, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../../lib/format';
import { exportRunReports } from '../../lib/engine';
import { controlState, stateOf } from '../../lib/control-state';
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
          <Link to="/history" className="lnk">
            {t('history.title')}
          </Link>
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

export function ReportHeader({
  entry,
  load,
  jsonOpen,
  jsonId,
  reasonId,
  onToggleJson,
}: ReportHeaderProps) {
  const { t } = useTranslation();
  const report = load.status === 'ready' ? load.report : null;

  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  /* The engine's own refusal, held so it can be printed unchanged. */
  const [exportFailed, setExportFailed] = useState<string | null>(null);

  /* 🔴 The state flips BEFORE the await, so the control answers the press within a
     frame rather than when PowerShell gets round to it - §12's 100 ms, and the
     reason `controlState` exists. The previous outcome is cleared at the same
     moment: a tick left over from the last export would be answering this press. */
  const onExport = useCallback(() => {
    if (report === null || exporting) return;
    setExporting(true);
    setExported(false);
    setExportFailed(null);
    exportRunReports(entry.runId)
      .then(() => {
        setExported(true);
      })
      .catch((e: unknown) => {
        setExportFailed(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        setExporting(false);
      });
  }, [report, exporting, entry.runId]);

  /* The report's own total once the file is read, the History record's until then.
     Both are the engine's one number for the run (`$ws.TotalFreed` /
     `$ws.TotalEstimated`), so the swap never changes a digit. */
  const dryRun = report ? report.dryRun : entry.dryRun;
  const bytes = dryRun
    ? (report?.estimatedBytes ?? entry.estimatedBytes)
    : (report?.reclaimedBytes ?? entry.freedBytes);
  const title = t(dryRun ? 'report.titleDryRun' : 'report.titleFreed', {
    amount: formatBytes(bytes),
  });

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
              {/* 🔴 The `.btn-label` span is not decoration: `.btn[data-state]` fades
                  that span and draws the spinner over it, so a button without one has
                  no pending paint at all. It wraps the same word in the same place -
                  the dummy's own convention on every control that shows a state.
                  Disabled while there is no file to export; the reason beside it is
                  the one the unreadable case already prints, and a disabled button
                  stays in the accessibility tree so the link is read. */}
              <button
                className="btn"
                type="button"
                disabled={report === null || exporting}
                aria-describedby={reasonId ?? undefined}
                onClick={onExport}
                {...controlState(stateOf(exporting, exported))}
              >
                <span className="btn-label">{t('report.export')}</span>
              </button>
            </div>
            {/* 🔴 Polite, at the control, in the same slot the declaration used to
                occupy - so the band's height does not move between the two. */}
            <p role="status" className="t-xs ink-3 rep-export-note">
              {exported ? t('report.exportDone') : ''}
            </p>
            {exportFailed === null ? null : (
              <p
                role="alert"
                className="t-xs rep-export-note"
                style={{ color: 'var(--c-warn-ink)' }}
              >
                {exportFailed}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
