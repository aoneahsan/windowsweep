/**
 * Run - the log as it arrives, section by section, with the number at the end.
 *
 * Translated from `run.html`. The engine's own log is shown rather than a
 * paraphrase of it: the point of this screen is that a person can see exactly
 * what the tool said, in the order it said it, and find the same text in the log
 * file afterwards.
 *
 * 🔴 The dummy's layout here is `Per section` beside `Log`, in one `g12` row, and
 * the app had neither the band nor the two controls above it - so the progress
 * events Rust was already routing to `clean:progress` had nowhere to render, and
 * the screen could only be reached by starting a run somewhere else.
 *
 * 🔴 CANCEL IS DECLARED, NOT WIRED - `pending.runCancel` (pending-wave). Stopping
 * a run in flight means signalling the engine process from the Rust side, and this
 * build carries no command that does it. The control keeps the dummy's position
 * and is disabled, with the reason beside it: a button that looked as though it
 * had cancelled and had not is the worse of the two.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { formatBytes } from '../lib/format';
import { isCleanupRun } from '../lib/cli';
import { newRunId, run, safeBatchArgs } from '../lib/engine';
import { safeRunSections } from '../lib/catalogue';
import { controlState, stateOf } from '../lib/control-state';
import { RunPerSection, perSectionRows } from '../components/RunPerSection';
import { ReclaimMap } from '../components/ReclaimMap';
import { drainMapTargets, toMapTargets } from '../lib/reclaim';

export function RunScreen() {
  const { t } = useTranslation();
  const phase = useStore((s) => s.phase);
  const log = useStore((s) => s.log);
  const progress = useStore((s) => s.progress);
  const summary = useStore((s) => s.summary);
  const catalogue = useStore((s) => s.catalogue);
  const scanTargets = useStore((s) => s.scanTargets);
  const developer = useStore((s) => s.developer);
  const idleDays = useStore((s) => s.idleDays);
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);
  const setScanTargets = useStore((s) => s.setScanTargets);

  const [starting, setStarting] = useState(false);

  const tailRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    tailRef.current?.scrollTo({ top: tailRef.current.scrollHeight });
  }, [log.length]);

  /* Nothing has been started in this session: `idle` with no summary and no log.
     Distinct from a run that finished without a readable summary. */
  /* 🔴 A `--scan` summary is NOT a run. It arrives with mode "scan", one step at
     section -1 and freed_bytes 0, and it writes log lines - so the old test
     (`summary === null && log.length === 0`) went false after a scan and this
     screen announced `FINISHED / Reclaimed 0 B.` to someone who had pressed a
     button that deletes nothing. isCleanupRun() is the one place that decides. */
  /* 🔴 NOT `phase === 'idle'`. A scan is an engine invocation like any other, so
     it goes running -> done and leaves `phase` at 'done' - which is why the first
     attempt at this fix still announced `FINISHED / Reclaimed 0 B.` after a scan.
     Verified by driving the app rather than by reading the edit. The phase says
     whether the ENGINE is busy; only the summary says whether a CLEANUP happened,
     and the running and failed cases are already handled ahead of this one. */
  const notRunYet = !isCleanupRun(summary);

  const done = Object.values(progress).filter((p) => p.event === 'end').length;
  const running = Object.values(progress).find((p) => p.event === 'start' && progress[p.section]?.event !== 'end');

  /* The queue the band lists: the engine's own safe batch, which is exactly what
     the Start button below runs. */
  const queue = useMemo(
    () => (catalogue ? safeRunSections(catalogue, developer).map((s) => s.id) : []),
    [catalogue, developer],
  );

  /* The draining map's tiles: every scanned target whose section has not finished. */
  const drainTargets = useMemo(
    () => drainMapTargets(toMapTargets(catalogue, scanTargets), progress),
    [catalogue, scanTargets, progress],
  );

  const rows = useMemo(
    () =>
      perSectionRows({
        catalogue,
        queue,
        progress,
        results: summary?.sections ?? [],
        scanTargets,
        labels: {
          queued: t('run.statusQueued'),
          running: t('run.statusRunning'),
          done: t('run.statusDone'),
        },
      }),
    [catalogue, queue, progress, summary, scanTargets, t],
  );

  const onStart = useCallback(() => {
    if (queue.length === 0) return;
    setStarting(true);
    const id = newRunId();
    startRun(id);
    void run(safeBatchArgs({ dryRun: false, developer, idleDays }), id, {
      onLog: appendLog,
      onProgress: (section, event, status, freedBytes) => {
        applyProgress({
          section,
          event,
          ...(status ? { status } : {}),
          ...(freedBytes !== undefined ? { freedBytes } : {}),
        });
      },
    })
      .then((r) => {
        finishRun(r.summary, r.exitCode > 1);
        /* Those targets have just been deleted; redrawing them would be a lie. */
        if (r.summary && !r.summary.dry_run) setScanTargets([]);
      })
      .catch((e: unknown) => {
        appendLog(e instanceof Error ? e.message : String(e));
        finishRun(null, true);
      })
      .finally(() => { setStarting(false); });
  }, [queue.length, startRun, developer, idleDays, appendLog, applyProgress, finishRun, setScanTargets]);

  const inFlight = starting || phase === 'running';

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap readout">
          <div>
            {/* 🔴 The never-run state said `Finished` and `The run finished.` on a
                screen whose own log pane said `Nothing has run yet.` - the app
                contradicting itself on first open, because "not running" and
                "finished" were the same branch. The dummy's eyebrow for this state
                is `Ready to run`, and the heading is the sentence the dummy already
                uses for it. */}
            <p className="caps ink-3">
              {phase === 'running'
                ? t('run.eyebrowRunning')
                : phase === 'failed'
                  ? t('run.eyebrowFailed')
                  : notRunYet
                    ? t('run.eyebrowReady')
                    : t('run.eyebrowDone')}
            </p>
            <h1 className="t-xl wide">
              {/* 🔴 Order matters here and got it wrong once: `summary` was tested
                  BEFORE the idle case, so a scan's summary - which is truthy -
                  reached `titleDone` and announced `Reclaimed 0 B.` The idle test
                  has to come first, because a scan leaves a summary behind. */}
              {phase === 'running'
                ? t('run.titleRunning', { done })
                : phase === 'failed'
                  ? t('run.titleFailed')
                  : notRunYet
                    ? t('run.idleHint')
                    : summary
                      ? summary.dry_run
                        ? t('run.titleDryRun', { amount: formatBytes(summary.estimated_bytes) })
                        : t('run.titleDone', { amount: formatBytes(summary.freed_bytes) })
                      : t('run.titleUnknown')}
            </h1>
            {/* 🔴 A failed run used to fall through to `run.titleUnknown` - "The run
                finished." over a run that never started. The dummy had no word for this
                state at all: it carried Ready, Running, Finished and Cancelled, and
                Cancelled is a different thing because a person chose it. The failed state
                was written into run.html first (reachable as run.html?failed=1) and these
                are its words. */}
            {phase === 'failed' ? <p className="lede">{t('run.failedNote')}</p> : null}
            {summary?.dry_run ? <p className="lede">{t('run.dryRunNote')}</p> : null}
            {running && catalogue ? (
              <p className="t-sm ink-3">
                {t('run.currentSection', {
                  id: running.section,
                  title: catalogue.sections.find((s) => s.id === running.section)?.title ?? '',
                })}
              </p>
            ) : null}
          </div>

          {/* `run.html:37-40` - Cancel then Start, at the end of the readout. */}
          <div
            style={{
              display: 'flex',
              gap: 'var(--sp-2)',
              marginInlineStart: 'auto',
              alignItems: 'center',
            }}
          >
            <button className="btn" type="button" disabled>
              <span className="btn-label">{t('run.cancel')}</span>
            </button>
            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={onStart}
              disabled={inFlight || queue.length === 0}
              {...controlState(stateOf(starting))}
            >
              <span className="btn-label">{t('run.start')}</span>
            </button>
          </div>
        </div>
        {/* The stated gap that goes with the disabled control above. */}
        <div className="wrap">
          <p className="t-xs ink-3">{t('pending.runCancel')}</p>
        </div>
      </section>

      {/* The dummy's "What is going" band (`run.html:60-68`) - the SAME map as Home's,
          draining. Its hint is the whole idea: a tile leaves when the engine reports
          that section's `end`, never at `start`, because a tile that vanished on start
          would claim the space back before it was freed. Shown only while there is
          something to drain, which is what the dummy's own idle state does. */}
      {drainTargets.length > 0 ? (
        <section className="band band-well">
          <div className="wrap rise">
            <div className="zone-label">
              <span className="caps">{t('run.drainTitle')}</span>
              <span className="t-sm ink-3" style={{ flex: 'none' }}>{t('run.drainHint')}</span>
            </div>
            <ReclaimMap targets={drainTargets} measured />
          </div>
        </section>
      ) : null}

      <section className="band band-app">
        <div className="wrap g12">
          <RunPerSection rows={rows} />

          <div className="c7 rise">
            <div className="zone-label">
              <span className="caps">{t('run.logTitle')}</span>
            </div>
            {/* 🔴 `logview` - the dummy's class, which carries the well background,
                the monospace size, the fixed height and the scroll. The app invented
                `logpane`, which exists in no stylesheet, so the one surface a person
                watches while something irreversible happens was an unstyled div.
                `role="log"` with `aria-live="off"` is the dummy's own wiring:
                announcing every line of a purge would be an assault, so the region
                is readable on demand and `aria-busy` says work is ongoing. */}
            <div
              className="logview"
              ref={tailRef}
              role="log"
              aria-live="off"
              aria-busy={phase === 'running'}
            >
              {log.length === 0 ? (
                <p className="t-sm ink-3">{t('run.logEmpty')}</p>
              ) : (
                log.map((entry, i) => (
                  <div className="t-sm mono" key={`${String(entry.at)}-${String(i)}`}>
                    {entry.line}
                  </div>
                ))
              )}
            </div>
            {/* `run.html:85-94` - the window displays the engine's own reporting and
                does none of the deleting. The sentence is the dummy's, verbatim. */}
            <details className="disclose">
              <summary>
                <span className="disclose-line">{t('run.provenanceSummary')}</span>
                <span className="disclose-more">{t('consent.detailsMore')}</span>
              </summary>
              <div className="disclose-body">
                <p>{t('run.provenanceBody')}</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
