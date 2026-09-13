/**
 * Report - one run, rendered from the file the engine wrote. `report.html` +
 * `page-report.js`, band for band (D-42, GATE 4 round 8).
 *
 * 🔴 ANY RUN, NOT ONLY THE LAST. `?view=<run id>` names the run - History's open
 * link sets it - and with no `view` the screen shows the newest run in the history,
 * which is what Home's "Open the report" means. It used to read the in-memory summary
 * alone, so every History row opened the same page and a restart left it empty.
 *
 * 🔴 IT RENDERS THE FILE. The summary a run leaves in memory has three fields per
 * section; the report file (`lib/report-file.ts`) has what this screen draws - each
 * step's note, the disks before and after, the engine's own duration. So the meta
 * line, *What each section freed*, *Disk, before and after*, the table and *Where
 * this file lives* all come from that file, read once through the Rust side's
 * run-folder confinement (`lib/report-loader.ts`). The heading can be drawn from the
 * History record while the file is read, because both carry the engine's one number.
 *
 * Gone, because the dummy never drew them: the `The last run` eyebrow, the `Key`,
 * `Reclaimed` and `What it touches` columns (the key heads `Section`; the engine's
 * note replaces the catalogue's title), and the path sentence under the table, which
 * the disclosure now carries.
 */

import { useId, useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { cleanupRuns } from '../lib/history-rows';
import { fileNameOf, reportPathOf, type ReportStep } from '../lib/report-file';
import { useRunReport, type ReportLoad } from '../lib/report-loader';
import { ReportHeader } from '../components/report/ReportHeader';
import { ReportJson } from '../components/report/ReportJson';
import { ReportEmpty } from '../components/report/ReportEmpty';
import { SectionBars } from '../components/report/SectionBars';
import { DiskBeforeAfter } from '../components/report/DiskBeforeAfter';
import { ReportTable } from '../components/report/ReportTable';
import { ReportWhere } from '../components/report/ReportWhere';
import { stepKey } from '../components/report/report-words';

/** Read `?view=`. The router hands a string for a run id, or a number if one ever looked like one. */
function parseView(raw: unknown): string | null {
  if (typeof raw === 'string' && raw !== '') return raw;
  if (typeof raw === 'number' && Number.isFinite(raw)) return String(raw);
  return null;
}

/** The run is on record but its file cannot be shown - said once, where the bands would be. */
function ReportUnreadable({ id, load }: { id: string; load: ReportLoad }) {
  const { t } = useTranslation();
  return (
    <section className="band band-app band-tight">
      <div className="wrap">
        <div className="note note-warn" id={id} role="status">
          <span aria-hidden="true">!</span>
          <span className="t-sm">
            {t(load.status === 'missing' ? 'report.fileMissing' : 'report.fileFailed')}
            {load.status === 'failed' ? <span className="t-xs ink-3 rep-reason">{load.reason}</span> : null}
          </span>
        </div>
      </div>
    </section>
  );
}

export function Report() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const history = useStore((s) => s.history);
  const catalogue = useStore((s) => s.catalogue);
  const lastRunId = useStore((s) => s.runId);
  const lastReportFile = useStore((s) => s.summary?.report_file ?? null);
  const search: { view?: unknown; open?: unknown } = useSearch({ strict: false });
  const jsonId = useId();
  const reasonId = useId();

  const runs = useMemo(() => cleanupRuns(history), [history]);
  const view = parseView(search.view);
  const entry = view === null ? (runs[0] ?? null) : (runs.find((r) => r.runId === view) ?? null);
  /* The run that just finished names its file in its summary; any other is listed. */
  const knownFile = entry !== null && entry.runId === lastRunId ? fileNameOf(lastReportFile) : null;
  const load = useRunReport(entry?.runId ?? null, knownFile);
  const jsonOpen = search.open === 'json';

  if (entry === null || load === null) return <ReportEmpty notFound={view !== null} />;

  const ready = load.status === 'ready' ? load : null;
  const unreadable = load.status === 'missing' || load.status === 'failed';
  const nameOf = (step: ReportStep) => stepKey(step, catalogue);

  /* The JSON panel's open state is in the URL like every other disclosure of state
     a person would expect to survive; replaced, so Back leaves the report. */
  const toggleJson = () => {
    void navigate({
      to: '/report',
      search: { ...(view === null ? {} : { view }), ...(jsonOpen ? {} : { open: 'json' }) },
      replace: true,
    });
  };

  return (
    <>
      <ReportHeader
        entry={entry}
        load={load}
        jsonOpen={jsonOpen}
        jsonId={jsonId}
        reasonId={unreadable ? reasonId : null}
        onToggleJson={toggleJson}
      />
      {ready && jsonOpen ? <ReportJson id={jsonId} fileName={ready.fileName} raw={ready.raw} /> : null}
      {unreadable ? <ReportUnreadable id={reasonId} load={load} /> : null}

      {ready ? (
        <>
          <section className="band band-app band-tight">
            <div className="wrap">
              <div className="g12">
                <div className="c9">
                  <div className="panel pad">
                    <span className="caps ink-3">
                      {t(ready.report.dryRun ? 'report.barsTitleDryRun' : 'report.barsTitle')}
                    </span>
                    <SectionBars steps={ready.report.steps} dryRun={ready.report.dryRun} nameOf={nameOf} />
                  </div>
                </div>
                <div className="c3">
                  <div className="well pad rep-disk">
                    <span className="caps ink-3">{t('report.diskTitle')}</span>
                    <DiskBeforeAfter disk={ready.report.disk} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="band band-app band-tight">
            <div className="wrap">
              <ReportTable steps={ready.report.steps} dryRun={ready.report.dryRun} nameOf={nameOf} />
            </div>
          </section>

          <ReportWhere path={reportPathOf(ready.report.logFile, ready.fileName)} />
        </>
      ) : null}

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
