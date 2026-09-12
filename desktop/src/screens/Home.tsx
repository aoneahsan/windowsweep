/**
 * Home - the number, then what it will touch, then the action.
 *
 * Translated from `desktop/design/windowsweep-click-dummy/index.html`. The class
 * names, the band order and the words are the dummy's; GATE 4 compares the two
 * page by page, so a divergence here is written into the dummy first.
 *
 * 🔴 The number comes from a real `--scan`, never from a guess. Until one has run,
 * the hero says so rather than showing a zero that reads as "nothing to reclaim".
 *
 * THE DUMMY'S FOURTEEN ZONES, and where each one is:
 *   1  window chrome ................... `components/Shell.tsx`
 *   2  the reclaim readout ............. here
 *   3  THE RECLAIM MAP ................. `components/ReclaimMapBand.tsx`
 *   4  drives + developer mode ......... here (`components/HomeDrives.tsx`)
 *   5  the safe run ladder ............. `components/SafeRunLadder.tsx`
 *   6  these need a person ............. `components/NeedsAPerson.tsx`
 *   7  the assurance ................... `components/HomeSafety.tsx`
 *   8  how that is enforced ............ `components/HomeSafety.tsx`
 *   10 the last eight runs ............. `components/LastRuns.tsx`
 *   11 the schedule .................... `components/LastRuns.tsx`
 *   12 sections needing admin .......... `components/AdminNotice.tsx`
 *   13 what leaves this machine ........ here
 *   14 the status bar .................. `components/Shell.tsx`
 *
 * 🔴 THE `pending.drives` DECLARATION IS GONE, because the band and the ring are
 * built. What it said is still half true and worth keeping: the engine's `--json`
 * summary carries no drive and no free-space field at all (`RunSummary` in
 * `lib/cli.ts` has none, and `modules/runner.ps1` emits none). It was the
 * conclusion that was wrong - the figures do not have to come from the engine.
 * Windows answers the capacities through `list_drives`, and the reclaimable slice
 * is attributed from the scan's own target paths, one drive at a time
 * (`lib/drives.ts`). Nothing here is apportioned or seeded.
 *
 * 🔴 EVERY FIGURE ON THIS PAGE READS THE INCLUDED TARGETS, and there is exactly
 * one exception: the map, which draws the whole scan so an excluded tile stays
 * visible, dimmed. The hero, the Reclaim button, the sub-line and the ladder all
 * read `useIncludedScanTargets()` - one derivation, because a figure with several
 * consumers is not fixed when only some of them are, and here the consequence of
 * missing one is a button offering to reclaim bytes the run will refuse.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useIncludedScanTargets, useRunPreferences, useStore } from '../state/store';
import {
  reclaimableBytes,
  reclaimableSectionCount,
  reclaimableTargetCount,
  toMapTargets,
} from '../lib/reclaim';
import { formatBytes } from '../lib/format';
import { newRunId, run, scanArgs, safeBatchArgs } from '../lib/engine';
import { safeRunSections } from '../lib/catalogue';
import { controlState, stateOf } from '../lib/control-state';
import { ReclaimMapBand } from '../components/ReclaimMapBand';
import { SafeRunLadder, type LadderRow } from '../components/SafeRunLadder';
import { NeedsAPerson } from '../components/NeedsAPerson';
import { PrimaryButton } from '../components/PrimaryButton';
import { HomeSafety } from '../components/HomeSafety';
import { HomeDestinations } from '../components/HomeDestinations';
import { LastRuns } from '../components/LastRuns';
import { AdminNotice } from '../components/AdminNotice';
import { DeveloperMode } from '../components/DeveloperMode';
import { HomeDrives } from '../components/HomeDrives';
import { CapacityRing } from '../components/CapacityRing';
import { useDriveRows } from '../lib/drives';
import type { MapTarget } from '../components/ReclaimMap';

/** The product's one visual metaphor, at the hero only - decoration belongs here,
    not on every card. Copied from the dummy's markup. */
function HeroSweep() {
  return (
    <svg className="hero-sweep" viewBox="0 0 480 220" fill="none" aria-hidden="true">
      <path
        d="M-20 176 C 110 176, 120 40, 246 40 S 372 148, 500 62"
        stroke="currentColor"
        strokeWidth="30"
        strokeLinecap="round"
      />
      <path
        d="M-20 214 C 118 214, 128 96, 262 96 S 392 190, 500 118"
        stroke="currentColor"
        strokeWidth="13"
        strokeLinecap="round"
        opacity=".5"
      />
      <path
        d="M-20 240 C 126 240, 136 148, 278 148 S 408 226, 500 168"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        opacity=".3"
      />
    </svg>
  );
}

export function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const catalogue = useStore((s) => s.catalogue);
  const engineError = useStore((s) => s.engineError);
  const summary = useStore((s) => s.summary);
  /* The whole scan - the map's data, and only the map's. */
  const scanTargets = useStore((s) => s.scanTargets);
  /* What a run would actually touch. Every figure below reads this one. */
  const includedTargets = useIncludedScanTargets();
  const excludedPaths = useStore((s) => s.excludedPaths);
  const toggleExcluded = useStore((s) => s.toggleExcluded);
  const clearExclusions = useStore((s) => s.clearExclusions);
  const candidates = useStore((s) => s.candidates);
  const history = useStore((s) => s.history);
  const phase = useStore((s) => s.phase);
  const scannedAt = useStore((s) => s.scannedAt);
  const developer = useStore((s) => s.developer);
  const setDeveloper = useStore((s) => s.setDeveloper);
  const idleDays = useStore((s) => s.idleDays);
  const setIdleDays = useStore((s) => s.setIdleDays);
  const prefs = useRunPreferences();
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);
  const setCandidates = useStore((s) => s.setCandidates);
  const setScanTargets = useStore((s) => s.setScanTargets);

  /* 🔴 Which action is in flight, not merely whether one is. The pending state
     belongs on the control that was pressed, and the other two have to refuse a
     press while it runs - one engine, one run at a time. */
  const [busy, setBusy] = useState<'scan' | 'dryRun' | 'reclaim' | null>(null);
  const [scanDone, setScanDone] = useState(false);
  const [cleared, setCleared] = useState(false);

  /* 🔴 `measured` is `scannedAt`, not `length > 0`. Once a tile can be clicked
     out, an empty INCLUDED list is a perfectly ordinary state after a real
     measurement - "you excluded everything" - and reading it as "nothing has been
     measured" would print the last run's estimate instead of the 0 that is true. */
  const measured = scannedAt !== null;

  /* One home for this figure, in lib/reclaim.ts - it was computed here AND in
     Shell.tsx, and both copies read a run's result off a scan's summary. */
  const reclaimable = reclaimableBytes(summary, includedTargets, measured);

  /* 🔴 ONE load for the two places this page draws a disk: the rails in zone 4 and
     the ring in the hero. Two fetches would let them disagree about the same drive
     for a frame, which is the shape of every one-figure-several-consumers defect
     this file already records. The measurement comes from `includedTargets`, so an
     excluded target stops counting towards its drive exactly as it stops counting
     towards the hero. */
  const { rows: driveRows, loading: drivesLoading } = useDriveRows(includedTargets, measured);

  /* 🔴 `measured N minutes ago` is a RELATIVE time, so it has to be re-rendered or
     it starts lying the moment it is painted. The dummy can print a fixed 4 because
     nothing in it ages; this window ticks instead, every half minute, and only while
     there is a measurement to age. The interval restarts with each new scan, so the
     ticks land on that scan's own minute boundaries.
     🔴 The clock is NOT re-read synchronously when a scan lands - the lint rule
     refuses a setState in an effect body, and it is right that this does not need
     one: a `now` from up to half a minute ago makes the elapsed time NEGATIVE for a
     fresh scan, and the clamp below reads that as 0 minutes, which is what it is. */
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (scannedAt === null) return;
    const tick = window.setInterval(() => { setNow(Date.now()); }, 30_000);
    return () => { window.clearInterval(tick); };
  }, [scannedAt]);
  const minutesAgo = scannedAt === null ? null : Math.max(0, Math.floor((now - scannedAt) / 60_000));

  const drive = useCallback(
    async (args: string[], goToRun: boolean) => {
      const id = newRunId();
      startRun(id);
      if (goToRun) void navigate({ to: '/run' });
      /* 🔴 The rejection path is not hypothetical and it is not rare. The engine
         refuses a run for ordinary reasons - a missing library, a refused path, an
         exit before the summary - and until this try/catch existed every one of
         them left `phase` on 'running' for ever, because the callers below only
         chain `.finally()` and that does not handle a rejection. The reason is
         appended to the log pane, beside the engine's own output. */
      try {
        const result = await run(args, id, {
          onLog: appendLog,
          onProgress: (section, event, status, freedBytes) => {
            applyProgress({ section, event, ...(status ? { status } : {}), ...(freedBytes !== undefined ? { freedBytes } : {}) });
          },
        });
        finishRun(result.summary, result.exitCode > 1);
        if (result.summary) setCandidates(result.summary.candidates);
        /* 🔴 `targets[]` is filled by `--scan` and empty in every other mode, so
           this only ever ADDS measurements - a dry-run must not blank the map.
           A real run is the one case that spends them: those paths have just been
           deleted, and redrawing them afterwards would be a lie. */
        if (result.summary && result.summary.targets.length > 0) {
          setScanTargets(result.summary.targets);
        } else if (result.summary && !result.summary.dry_run) {
          setScanTargets([]);
        }
        return result;
      } catch (e: unknown) {
        appendLog(e instanceof Error ? e.message : String(e));
        finishRun(null, true);
        return null;
      }
    },
    [startRun, navigate, appendLog, applyProgress, finishRun, setCandidates, setScanTargets],
  );

  /* 🔴 The scan carries the SAME preferences the run does (D-8). It used to take
     developer mode alone, so the three thresholds fell back to the engine's own
     `config.json` and a machine where someone had run `windowsweep --days 30` once
     was measured with 30 while this screen showed 100. */
  const onScan = useCallback(() => {
    setBusy('scan');
    void drive(scanArgs({ ...prefs, excludedPaths }), false).finally(() => {
      setBusy(null);
      setScanDone(true);
    });
  }, [drive, prefs, excludedPaths]);

  /* The tick is an acknowledgement, not a state: it says "that finished" and then
     gets out of the way, which is what the dummy's own busy() helper does. The
     hero number changing is the primary answer; this is the one at the control. */
  useEffect(() => {
    if (!scanDone) return;
    const to = window.setTimeout(() => { setScanDone(false); }, 700);
    return () => { window.clearTimeout(to); };
  }, [scanDone]);

  /* Putting every target back is one press with no confirmation, because it can
     only ever WIDEN what a run touches back to the default - and the tick is the
     acknowledgement at the control, in the 700 ms shape `scanDone` already uses.
     The count beside it flips to `nothing excluded` in the same frame, which is
     the answer a screen reader gets from its live region. */
  const onClearExclusions = useCallback(() => {
    clearExclusions();
    setCleared(true);
  }, [clearExclusions]);

  useEffect(() => {
    if (!cleared) return;
    const to = window.setTimeout(() => { setCleared(false); }, 700);
    return () => { window.clearTimeout(to); };
  }, [cleared]);

  const onDryRun = useCallback(() => {
    setBusy('dryRun');
    void drive(safeBatchArgs({ dryRun: true, ...prefs, excludedPaths }), true).finally(() => { setBusy(null); });
  }, [drive, prefs, excludedPaths]);

  const onReclaim = useCallback(() => {
    setBusy('reclaim');
    void drive(safeBatchArgs({ dryRun: false, ...prefs, excludedPaths }), true).finally(() => { setBusy(null); });
  }, [drive, prefs, excludedPaths]);

  /* The map's tiles: one per scanned target, coloured by its section's tier and
     grouped by its section. Every field is the engine's. */
  const mapTargets = useMemo<MapTarget[]>(
    /* 🔴 The WHOLE scan, not the included subset - the one place on this page that
       reads `scanTargets` directly. An excluded tile stays drawn and dims, so what
       a person turned off remains visible rather than silently disappearing
       (`reclaim-map.js` -> `mapDataAll`). Every figure around it reads
       `includedTargets`. */
    () => toMapTargets(catalogue, scanTargets, excludedPaths),
    [catalogue, scanTargets, excludedPaths],
  );

  /* How many of the drawn tiles are kept out, counted from the tiles themselves so
     the number beside the map and the dimming on the map cannot disagree - an
     exclusion root covers everything beneath it, so counting the stored roots
     instead would undercount whenever one root covers several targets. */
  const excludedCount = useMemo(
    () => mapTargets.filter((target) => target.excluded && target.bytes > 0).length,
    [mapTargets],
  );

  /* The ladder's rungs: the engine's own safe batch, with a figure only where a
     scan measured one. Sorted biggest-first once there is something to sort. */
  const ladderRows = useMemo<LadderRow[]>(() => {
    if (!catalogue) return [];
    const bySection = new Map<number, { bytes: number; count: number }>();
    for (const target of includedTargets) {
      if (target.bytes <= 0) continue;
      const acc = bySection.get(target.section) ?? { bytes: 0, count: 0 };
      acc.bytes += target.bytes;
      acc.count += 1;
      bySection.set(target.section, acc);
    }
    const rows = safeRunSections(catalogue, developer).map((section) => {
      const measured = bySection.get(section.id);
      return {
        id: section.id,
        key: section.key,
        bytes: measured?.bytes ?? null,
        count: measured?.count ?? null,
      };
    });
    if (bySection.size > 0) rows.sort((a, b) => (b.bytes ?? -1) - (a.bytes ?? -1));
    return rows;
  }, [catalogue, developer, includedTargets]);

  const interactive = (catalogue?.sections ?? []).filter((s) => s.batch === 'interactive');
  const adminSections = (catalogue?.sections ?? []).filter((s) => s.admin);

  if (engineError) {
    return (
      <section className="band band-app">
        <div className="wrap wrap-narrow">
          <h1 className="t-lg wide">{t('home.engineErrorTitle')}</h1>
          <p className="lede">{t('error.engineMissing')}</p>
          <div className="panel pad" style={{ marginTop: 'var(--sp-4)' }}>
            <p className="t-sm mono">{engineError}</p>
          </div>
        </div>
      </section>
    );
  }

  /* 🔴 One gate for all three buttons: a second press must not be able to start a
     second run, whether the first one is still starting up (`busy`) or already
     streaming (`phase`). Either alone leaves a window where two runs can begin. */
  const running = busy !== null || phase === 'running';

  return (
    <>
      {/* ZONE 2 - the reclaim readout */}
      <section className="band band-app">
        <div className="wrap readout rise">
          <HeroSweep />
          <div>
            <p className="caps ink-3">{t('home.reclaimableNow')}</p>
            <p className="hero-num">
              {reclaimable === null ? (
                <span>{t('home.notMeasured')}</span>
              ) : (
                <>
                  <span>{formatBytes(reclaimable).split(' ')[0]}</span>
                  <span className="unit">{formatBytes(reclaimable).split(' ')[1]}</span>
                </>
              )}
            </p>
            {/* 🔴 The dummy's whole sub-line: when it was measured, what it spans,
                and the re-scan beside it (`index.html:48-53`). The freshness clause
                needs a measurement to be fresh OF - after a real run the targets
                have been spent and the figure comes from the run's own summary, so
                that state keeps the span and drops the clause rather than dating a
                number no scan produced. */}
            <p className="hero-sub">
              {reclaimable === null ? (
                t('home.heroSubUnmeasured')
              ) : (
                <>
                  {minutesAgo === null
                    ? t('home.heroSub', {
                        targets: reclaimableTargetCount(summary, includedTargets, measured),
                        sections: reclaimableSectionCount(summary, includedTargets, measured),
                      })
                    : t('home.heroSubMeasured', {
                        count: minutesAgo,
                        targets: reclaimableTargetCount(summary, includedTargets, measured),
                        sections: reclaimableSectionCount(summary, includedTargets, measured),
                      })}
                  {' · '}
                  {/* The dummy's own acknowledgement for this control is on the
                      Scan button, not on the link: `wire.js:486` hands the pending
                      state to `[data-ws-action="scan"]` when the press came from
                      the link. `onScan` does exactly that here - one handler, so
                      the button beside it goes pending within a frame. */}
                  <button className="link-q" type="button" onClick={onScan} disabled={running}>
                    {t('home.rescan')}
                  </button>
                </>
              )}
            </p>
          </div>
          <div className="hero-actions">
            <button
              className="btn"
              type="button"
              onClick={onScan}
              disabled={running}
              {...controlState(stateOf(busy === 'scan', scanDone))}
            >
              <span className="btn-label">{summary ? t('home.scanAgain') : t('home.scanFirst')}</span>
            </button>
            <button
              className="btn"
              type="button"
              onClick={onDryRun}
              disabled={running}
              {...controlState(stateOf(busy === 'dryRun'))}
            >
              <span className="btn-label">{t('home.dryRunFirst')}</span>
            </button>
            <PrimaryButton
              control="home.reclaim"
              size="lg"
              onPress={onReclaim}
              disabled={running || reclaimable === null}
              state={stateOf(busy === 'reclaim')}
              label={
                reclaimable === null
                  ? t('home.reclaimUnmeasured')
                  : t('home.reclaim', { amount: formatBytes(reclaimable) })
              }
            />
          </div>

          {/* `index.html:65` - the page's only circle, and the last child of the
              readout. It renders itself away until a scan has measured: its centre
              is a percentage OF the reclaimable total, which does not exist before
              one, and the dummy's seed always has data so it owns no words for the
              unmeasured state. The hero above already says "not measured". */}
          <CapacityRing rows={driveRows} />
        </div>
      </section>

      {/* ZONE 3 - the signature element, and the only control on this page that
          changes what a run SKIPS rather than what it does. */}
      <ReclaimMapBand
        targets={mapTargets}
        measured={measured}
        excludedCount={excludedCount}
        onToggleExcluded={toggleExcluded}
        onClearExclusions={onClearExclusions}
        clearedRecently={cleared}
      />

      {/* ZONES 4 + 5 - drives | the safe-run ladder */}
      <section className="band band-app">
        <div className="wrap g12">
          <div className="c7 rise">
            <div className="zone-label">
              <span className="caps">{t('home.drivesTitle')}</span>
            </div>
            <HomeDrives rows={driveRows} loading={drivesLoading} />

            {/* Developer mode sits here rather than in a band of its own: it is
                what decides how much of the ladder beside it there is. */}
            <div className="zone-label" style={{ marginTop: 'var(--sp-6)' }}>
              <span className="caps">{t('home.developerTitle')}</span>
            </div>
            <DeveloperMode
              developer={developer}
              onDeveloper={setDeveloper}
              idleDays={idleDays}
              onIdleDays={setIdleDays}
            />
          </div>

          <div className="c5 rise">
            <div className="zone-label">
              <span className="caps">{t('home.safeRunTitle')}</span>
            </div>
            {catalogue ? (
              <SafeRunLadder rows={ladderRows} measured={measured} />
            ) : (
              /* Reading the catalogue and having an empty safe batch are two
                 different facts, and the ladder must not report the second while
                 the first is still true. */
              <div className="panel pad">
                <p className="t-sm ink-3">{t('common.loading')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ZONE 6 */}
      <NeedsAPerson sections={interactive} candidates={candidates} />

      {/* ZONES 7 + 8 */}
      <HomeSafety />

      {/* ZONES 10 + 11 */}
      <LastRuns history={history} />

      {/* ZONES 12 + 13 - admin and privacy, both on request */}
      <section className="band band-app">
        <div className="wrap rise">
          <AdminNotice sections={adminSections} />

          <HomeDestinations />
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
