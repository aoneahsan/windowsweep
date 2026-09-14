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

import { useStore } from '../state/store';
import { useIncludedScanTargets, useReclaimOffer, useRunFigures, useRunPreferences } from '../state/derived';
import { useElapsedMs } from '../state/use-elapsed';
import { formatBytes } from '../lib/format';
import { isCleanupRun } from '../lib/cli';
import { newRunId, run, safeBatchArgs } from '../lib/engine';
import { safeRunSections } from '../lib/catalogue';
import { stateOf } from '../lib/control-state';
import { RunPerSection, perSectionRows } from '../components/RunPerSection';
import { ReclaimMap } from '../components/ReclaimMap';
import { drainMapTargets, toMapTargets } from '../lib/reclaim';
import { PrimaryButton } from '../components/PrimaryButton';
import { HeroFigure } from '../components/HeroFigure';
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
  const prefs = useRunPreferences();
  const excludedPaths = useStore((s) => s.excludedPaths);
  const runId = useStore((s) => s.runId);
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);
  const spendScanTargets = useStore((s) => s.spendScanTargets);

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

     So: what the run below would reclaim, until it starts spending it. `not
     measured` when nothing has been scanned is this app's own honest state - the
     dummy's seed always has data, so it never renders it - and it is the word Home
     and the rail already use for the same figure.

     🔴 "WHAT THE RUN WOULD RECLAIM" IS THE SAFE BATCH, NOT THE SCAN. This read the
     whole scan's total, so the hero said `READY TO RUN 53.6 GB` above a Start
     button whose run the per-section rows expected to free 11.5 GB. It is
     the Reclaim button's figure now, the ladder's total its starting point.
     (GATE 4 round 7, decided by the main session.)

     🔴 AND AT REST IT IS THE BUTTON'S FIGURE, WORDS INCLUDED (D-60, round 9): the
     last rehearsal's estimate while that ran with the current arguments, otherwise
     "up to" the bound - `run.html`'s own "up to" variant. Once a run starts, the
     hero counts what the engine reported freed, which is no bound. */
  const freedSoFar = Object.values(progress).reduce(
    (total, p) => total + (p.event === 'end' ? (p.freedBytes ?? 0) : 0),
    0,
  );
  const offer = useReclaimOffer();
  /* 🔴 D-61: the waiting rows below carry the same figure this hero does, per
     section - they were the measured sizes on disk, so eleven rows queued 34.3 GB
     under a hero reading the engine's own 1.9 GB estimate for that same run. */
  const figures = useRunFigures();
  /* 🔴 And the band says which of the two it is showing, ONLY AT REST: once
     anything has run, the rows are the engine's own reports of what happened, not
     a description of what a run would free. Same test as the eyebrow's, `cancelled`
     first for the reason recorded there. */
  const perSectionBasis = cancelled || !notRunYet || phase === 'running'
    ? null
    : (figures.upTo ? 'bound' : 'estimate');
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
        : (offer?.amount ?? null);
  const heroUpTo = !cancelled && !isCleanupRun(summary) && phase !== 'running' && offer?.upTo === true;

  /* Elapsed from the engine's own log rather than a stopwatch this screen keeps -
     `state/use-elapsed.ts`, where the reasoning moved with it. */
  const elapsedMs = useElapsedMs(log, phase);

  /* The queue the band lists: the engine's own safe batch, which is exactly what
     the Start button below runs - whole, whatever developer mode says, because the
     engine runs it whole (`lib/catalogue.ts` -> `safeRunSections`). */
  const queue = useMemo(
    () => (catalogue ? safeRunSections(catalogue).map((s) => s.id) : []),
    [catalogue],
  );

  const rows = useMemo(
    () =>
      perSectionRows({
        catalogue,
        queue,
        progress,
        results: summary?.sections ?? [],
        scanTargets,
        figures: figures.bySection,
        labels: {
          queued: t('run.statusQueued'),
          running: t('run.statusRunning'),
          done: t('run.statusDone'),
        },
      }),
    [catalogue, queue, progress, summary, scanTargets, figures, t],
  );

  /* The draining map's tiles: the targets of the sections the band below lists,
     minus every section that has finished.
     🔴 NOT THE WHOLE SCAN. "What is going" drew every measured target, so on this
     machine it showed section 4's 20 GB of emulator images - an opt-in section the
     safe run never touches - under a hero reading what the run frees. A tile that
     can never leave, on a map whose hint is "Tiles leave as each section finishes",
     is the same claim as a button offering more than its action delivers (GATE 4
     round 7). The dummy could not show it: every seeded target sits in the safe
     batch. Reading `rows` keeps map, band and hero on one rule - the safe batch
     before a run, the sections the engine reported once one has run. */
  const rowIds = useMemo(() => new Set(rows.map((row) => row.id)), [rows]);
  const drainTargets = useMemo(
    () => drainMapTargets(toMapTargets(catalogue, scanTargets.filter((x) => rowIds.has(x.section))), progress),
    [catalogue, scanTargets, rowIds, progress],
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
        /* A completed run's sections are spent by `finishRun` from its summary.
           🔴 A cancelled run has no summary at all - it never reached the line that
           writes one - so the sections the engine reported STARTING are spent
           here: each may have deleted part of what it measured, and nothing says
           how much. A section that never started is untouched and stays counted. */
        if (r.cancelled) spendScanTargets(Object.keys(useStore.getState().progress).map(Number));
      })
      .catch((e: unknown) => {
        appendLog(e instanceof Error ? e.message : String(e));
        finishRun(null, true);
      })
      .finally(() => { setStarting(false); });
  }, [queue.length, startRun, prefs, excludedPaths, appendLog, applyProgress, finishRun, spendScanTargets]);

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
            {/* 🔴 The dummy's hero, which this screen did not have (D-22) - the
                same component Home uses, because it is one in the dummy. */}
            <HeroFigure bytes={heroBytes} upTo={heroUpTo} />
            {/* `run.html:30-34` - done, of the total, then the elapsed clause.
                🔴 The total is the number of rows the per-section band below is
                showing, NOT the queue's length. It used to be `queue.length` and
                the hero read `11 of 7 sections` while eleven rows sat underneath
                it - found by reading the rendered DOM, which is the only place
                the two numbers appear together.

                Why they disagreed: `done` counts the engine's own `end` events,
                while `queue` came from a `safeRunSections` that dropped every
                `dev` section when developer mode was off. But the ENGINE only
                skips a dev section for ids 4, 17 and 20 (`modules/runner.ps1:105`),
                and none of those is in the safe batch - so the engine ran all
                eleven while the app's denominator dropped four. Two rules for one
                quantity. (That rule is gone from `safeRunSections` too now.)

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
          <RunPerSection rows={rows} basis={perSectionBasis} />

          <div className="c7 rise">
            {/* `run.html:80-83` - the dummy's heading and its sub-line, verbatim
                (D-30). */}
            <div className="zone-label">
              <span className="caps">{t('run.logTitle')}</span>
              <span className="t-sm ink-3">{t('run.logHint')}</span>
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
              {/* The dummy's own lines (`page-run.js:25-32`): a bare row inheriting
                  `.logview`'s mono type, and at rest its idle line, dimmed - not a
                  sentence of this app's.

                  🔴 AT REST IS AT REST (D-50, GATE 4 round 8). The store keeps the log
                  of the last engine session, whatever it was - a Home scan leaves its
                  lines, this machine's paths and drive table among them - and they
                  used to sit here under "not started". Until this window starts a run
                  (running, failed, or a cleanup run finished) the pane shows the
                  dummy's idle line, as the hero above it shows its idle state. */}
              {log.length === 0 || (notRunYet && phase !== 'running' && phase !== 'failed') ? (
                <div className="l-dim">{t('run.idleHint')}</div>
              ) : (
                log.map((entry, i) => (
                  <div key={`${String(entry.at)}-${String(i)}`}>{entry.line}</div>
                ))
              )}
            </div>
            {/* `run.html:85-94` - the window displays the engine's own reporting and
                does none of the deleting. The sentence is the dummy's, verbatim. */}
            <details className="disclose" style={{ marginTop: 'var(--sp-3)' }}>
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
