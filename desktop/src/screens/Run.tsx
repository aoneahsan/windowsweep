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
 * 🔴 CANCEL IS WIRED, and the `pending.runCancel` declaration is gone. `cancel_run`
 * signals the engine's own child process (`src-tauri/src/cancel.rs`); the control
 * and its reasoning are in `components/RunCancel.tsx`, which is also where the one
 * dummy string this change declines is recorded and why.
 *
 * 🔴 CANCELLED IS NOT STOPPED, and the dummy is explicit about the difference:
 * "Cancelled is a different thing because a person chose it." So a cancelled run
 * does NOT take the failed branch, even though a killed PowerShell reports the same
 * non-zero exit code as one that fell over - the flag comes back from the Rust
 * side, which is the only place the two can be told apart.
 *
 * 🔴 AND A CANCELLED REAL RUN SPENDS ITS MEASUREMENTS. It deleted some of what the
 * last scan measured and there is no summary saying which, so the scan is dropped
 * and the hero reads "not measured" until something measures again. Keeping those
 * rows would leave the window offering to reclaim bytes that are already gone.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useIncludedScanTargets, useRunPreferences, useStore } from '../state/store';
import { formatBytes } from '../lib/format';
import { isCleanupRun } from '../lib/cli';
import { newRunId, run, safeBatchArgs } from '../lib/engine';
import { safeRunSections } from '../lib/catalogue';
import { stateOf } from '../lib/control-state';
import { RunPerSection, perSectionRows } from '../components/RunPerSection';
import { ReclaimMap } from '../components/ReclaimMap';
import { drainMapTargets, reclaimableBytes, toMapTargets } from '../lib/reclaim';
import { PrimaryButton } from '../components/PrimaryButton';
import { RunCancel } from '../components/RunCancel';

export function RunScreen() {
  const { t } = useTranslation();
  const phase = useStore((s) => s.phase);
  const log = useStore((s) => s.log);
  const progress = useStore((s) => s.progress);
  const summary = useStore((s) => s.summary);
  const catalogue = useStore((s) => s.catalogue);
  /* 🔴 The INCLUDED targets. This screen's map is the dummy's "What is going"
     band, and a target kept out of the run is not going - so it belongs neither in
     the drain nor in the per-section figures beside it. Home's map is the one
     place excluded tiles are still drawn, dimmed. */
  const scanTargets = useIncludedScanTargets();
  const scannedAt = useStore((s) => s.scannedAt);
  const developer = useStore((s) => s.developer);
  const prefs = useRunPreferences();
  const excludedPaths = useStore((s) => s.excludedPaths);
  const runId = useStore((s) => s.runId);
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);
  const setScanTargets = useStore((s) => s.setScanTargets);

  const [starting, setStarting] = useState(false);
  /* 🔴 Local, and transient by design. It is the outcome of the run in this
     window, not a shareable state - a URL carrying `cancelled` would restore a
     word about a run that is not running. It is cleared by the next Start. */
  const [cancelled, setCancelled] = useState(false);

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

  /* 🔴 D-22: THE HERO AND ITS PROGRESS LINE, and the dummy's real value for them.
     The GATE 4 report recorded the dummy's idle hero as `0 B`, which is what
     `run.html`'s STATIC markup says - but `wire.js`'s shared `refresh()` runs on
     every page and calls `paintHero(db.derive.reclaimable())`, so the RENDERED
     dummy shows the reclaimable total (29.73 GB on its seed), and only
     `page-run.js` replaces it with the freed figure once a run starts. Read out of
     the loaded page over CDP rather than out of the source - which is the same
     lesson D-21 exists for, one file away.

     So: what is there to reclaim, until a run starts spending it. `not measured`
     when nothing has been scanned is this app's own honest state - the dummy's
     seed always has data, so it never renders it - and it is the word Home and
     the rail already use for the same figure. */
  const freedSoFar = Object.values(progress).reduce(
    (total, p) => total + (p.event === 'end' ? (p.freedBytes ?? 0) : 0),
    0,
  );
  const measured = reclaimableBytes(summary, scanTargets, scannedAt !== null);
  /* 🔴 A CANCELLED RUN'S HERO IS THE SUM OF THE SECTIONS THE ENGINE SAID IT
     FINISHED, and `not measured` when that sum is zero.
     Those `##windowsweep ... event=end freed_bytes=N` lines are complete facts:
     the section ran to its end and reported what it freed. The section that was
     cut off mid-way reported nothing and may still have deleted files, so the true
     total is at least this and possibly more. At zero the honest answer is not
     `0 B` - which asserts nothing was reclaimed, and the engine's own log in the
     run folder may say otherwise - it is that this window did not measure it. */
  const heroBytes = cancelled
    ? (freedSoFar > 0 ? freedSoFar : null)
    : isCleanupRun(summary) && summary
      ? (summary.dry_run ? summary.estimated_bytes : summary.freed_bytes)
      : phase === 'running'
        ? freedSoFar
        : measured;

  /* Elapsed from the engine's own first and last line rather than a stopwatch
     this screen keeps: the log is what the run actually did, and it stops growing
     when the run stops, which freezes the figure at the right value with no timer
     left running. */
  const firstAt = log[0]?.at ?? null;
  const lastAt = log.length > 0 ? (log[log.length - 1]?.at ?? null) : null;
  const [clock, setClock] = useState(() => Date.now());
  useEffect(() => {
    if (phase !== 'running') return;
    const tick = window.setInterval(() => { setClock(Date.now()); }, 1000);
    return () => { window.clearInterval(tick); };
  }, [phase]);
  const elapsedMs =
    firstAt === null ? null : (phase === 'running' ? clock : (lastAt ?? firstAt)) - firstAt;

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
    setCancelled(false);
    const id = newRunId();
    startRun(id);
    void run(safeBatchArgs({ dryRun: false, ...prefs, excludedPaths }), id, {
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
        setCancelled(r.cancelled);
        /* 🔴 A CANCELLED RUN IS NOT A FAILED ONE. A killed PowerShell reports the
           same non-zero exit code as one that fell over, so the code alone cannot
           tell them apart and the flag from the Rust side is the only thing that
           can. Without this the screen would say "The run stopped before it
           finished" over somebody's own deliberate choice. */
        finishRun(r.summary, r.exitCode > 1 && !r.cancelled);
        /* Those targets have just been deleted; redrawing them would be a lie.
           🔴 A cancelled run has no summary at all - it never reached the line that
           writes one - and it is exactly the case where some of the measured
           targets are gone and nothing says which. So the measurements are dropped
           on that path too, and the hero falls back to "not measured" rather than
           promising bytes that may already have been reclaimed. */
        if (r.cancelled || (r.summary && !r.summary.dry_run)) setScanTargets([]);
      })
      .catch((e: unknown) => {
        appendLog(e instanceof Error ? e.message : String(e));
        finishRun(null, true);
      })
      .finally(() => { setStarting(false); });
  }, [queue.length, startRun, prefs, excludedPaths, appendLog, applyProgress, finishRun, setScanTargets]);

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
            {/* 🔴 `cancelled` is tested BEFORE `notRunYet`. A cancelled run leaves
                no readable summary, so `isCleanupRun` is false and the eyebrow
                would otherwise read `Ready to run` over a run somebody had just
                stopped - the same ordering trap a `--scan` summary already sprang
                on this block once. */}
            <p className="caps ink-3">
              {phase === 'running'
                ? t('run.eyebrowRunning')
                : phase === 'failed'
                  ? t('run.eyebrowFailed')
                  : cancelled
                    ? t('run.eyebrowCancelled')
                    : notRunYet
                      ? t('run.eyebrowReady')
                      : t('run.eyebrowDone')}
            </p>
            {/* 🔴 The dummy's hero, which this screen did not have (D-22). The
                number is `.hero-num` with the unit in its own `.unit` span - the
                same shape Home uses, because it is the same component in the
                dummy. */}
            <p className="hero-num">
              {heroBytes === null ? (
                <span>{t('home.notMeasured')}</span>
              ) : (
                <>
                  <span>{formatBytes(heroBytes).split(' ')[0]}</span>
                  <span className="unit">{formatBytes(heroBytes).split(' ')[1]}</span>
                </>
              )}
            </p>
            {/* `run.html:30-34` - done, of the total, then the elapsed clause.
                🔴 The total is the number of rows the per-section band below is
                showing, NOT the queue's length. It used to be `queue.length` and
                the hero read `11 of 7 sections` while eleven rows sat underneath
                it - found by reading the rendered DOM, which is the only place
                the two numbers appear together.

                Why they disagreed: `done` counts the engine's own `end` events,
                while `queue` is `safeRunSections(catalogue, developer)`, and
                `catalogue.ts` drops every `dev` section when developer mode is
                off. But the ENGINE only skips a dev section for ids 4, 17 and 20
                (`modules/runner.ps1:105`), and none of those is in the safe batch
                - so the engine ran all eleven while the app's denominator dropped
                four. Two rules for one quantity.

                `rows` comes from `perSectionRows`, which already derives the set
                from the reported sections and falls back to the queue before a
                run starts. Taking the denominator from there means the hero and
                the band cannot disagree, because there is now one rule. */}
            <p className="hero-sub">
              {t('run.progress', { done, total: rows.length })}
              {' · '}
              {elapsedMs === null || (notRunYet && phase !== 'running')
                ? t('run.notStarted')
                : t('run.elapsed', { seconds: Math.max(0, Math.round(elapsedMs / 1000)) })}
            </p>
            {/* 🔴 Order matters here and got it wrong once: `summary` was tested
                BEFORE the idle case, so a scan's summary - which is truthy -
                reached `titleDone` and announced `Reclaimed 0 B.` The idle test
                has to come first, because a scan leaves a summary behind.

                🔴 The IDLE branch is gone, and deliberately. It rendered
                `run.idleHint` - the dummy's own idle LOG line - as this screen's
                heading, and it was only ever standing in for the hero above,
                which did not exist. Now that the hero is here, keeping the
                stand-in would print the substitute and the thing it substituted
                for, one under the other. */}
            {phase === 'running' || phase === 'failed' || !notRunYet ? (
              <h1 className="t-xl wide">
                {phase === 'running'
                  ? t('run.titleRunning', { done })
                  : phase === 'failed'
                    ? t('run.titleFailed')
                    : summary
                      ? summary.dry_run
                        ? t('run.titleDryRun', { amount: formatBytes(summary.estimated_bytes) })
                        : t('run.titleDone', { amount: formatBytes(summary.freed_bytes) })
                      : t('run.titleUnknown')}
              </h1>
            ) : null}
            {/* 🔴 A failed run used to fall through to `run.titleUnknown` - "The run
                finished." over a run that never started. The dummy had no word for this
                state at all: it carried Ready, Running, Finished and Cancelled, and
                Cancelled is a different thing because a person chose it. The failed state
                was written into run.html first (reachable as run.html?failed=1) and these
                are its words. */}
            {phase === 'failed' ? <p className="lede">{t('run.failedNote')}</p> : null}
            {/* 🔴 SHOWN ONLY WHEN A SECTION ACTUALLY FINISHED. The sentence is the
                dummy's, and it is true of the sections the engine reported: that
                much HAD already been freed. With nothing reported it would read
                "0 B had already been freed", which is a claim - the run was killed
                mid-section and files may well have gone. Then the only thing said
                is the Rust side's own reason next to the button, which claims no
                quantity at all. */}
            {cancelled && freedSoFar > 0 ? (
              <p className="lede">{t('run.cancelledNote', { amount: formatBytes(freedSoFar) })}</p>
            ) : null}
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
            <RunCancel runId={runId} running={phase === 'running'} />
            <PrimaryButton
              control="run.start"
              size="lg"
              onPress={onStart}
              disabled={inFlight || queue.length === 0}
              state={stateOf(starting)}
              label={t('run.start')}
            />
          </div>
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

      {/* 🔴 WHAT THE RUN ACTUALLY KEPT, from the engine's own `excluded[]`.
          This is the outcome, not the intention: the map band on Home counts what
          was ASKED for, and this counts what the engine turned away when a
          deletion reached the chokepoint. They can legitimately differ - an
          excluded folder nothing tried to delete never appears here - and showing
          the request as though it were the result is exactly the shape of lie this
          feature exists to prevent. Empty after a `--scan`, always, because a scan
          never reaches the chokepoint. */}
      {summary && summary.excluded.length > 0 ? (
        <section className="band band-app band-tight">
          <div className="wrap rise">
            <div className="zone-label">
              <span className="caps">{t('run.excludedTitle')}</span>
              <span className="t-sm ink-3" style={{ flex: 'none' }}>
                {t('run.excludedHint', { count: summary.excluded.length })}
              </span>
            </div>
            <div className="panel pad">
              <ul
                style={{
                  margin: 0,
                  paddingInlineStart: 'var(--sp-5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--sp-1)',
                }}
              >
                {summary.excluded.map((path) => (
                  <li className="mono t-xs" key={path} style={{ wordBreak: 'break-all' }}>
                    {path}
                  </li>
                ))}
              </ul>
            </div>
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
