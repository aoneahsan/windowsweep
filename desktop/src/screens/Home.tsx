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
 *
 * 🔴 THE HERO IS WHAT IS RECLAIMABLE; THE BUTTON IS WHAT PRESSING IT RECLAIMS. The
 * button runs the safe batch, so its figure starts from `safeRunBytes` - the
 * ladder's own total - and never the hero's, which also counts sections a safe run
 * does not touch (GATE 4 round 7). Since round 9 (D-60) it is the last rehearsal's
 * estimate while that ran with the current arguments, and otherwise "Reclaim up
 * to" a bound: `lib/rehearsal.ts`. "Dry-run first" is that rehearsal.
 *
 * 🔴 AND SINCE ROUND 10 (D-61) THE LADDER CARRIES EXACTLY THAT FIGURE, rung by
 * rung and in its total, because it was making the same promise in plainer words:
 * *"Total a safe run would free 34.2 GB"* two bands under *"Reclaim 1.9 GB"*. The
 * hero is the one figure on this page that still describes what is THERE, which is
 * why it keeps the measured total and is not touched by any of this.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import {
  useIncludedScanTargets,
  useReclaimOffer,
  useRunFigures,
  useRunPreferences,
} from '../state/derived';
import {
  measuredBySection,
  reclaimableBytes,
  reclaimableSectionCount,
  reclaimableTargetCount,
  toMapTargets,
} from '../lib/reclaim';
import { rehearsalFrom } from '../lib/rehearsal';
import { formatBytes } from '../lib/format';
import { scanArgs, safeBatchArgs } from '../lib/engine';
import { useEngineRun } from '../state/use-engine-run';
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
import { HeroFigure } from '../components/HeroFigure';
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
  /* The whole scan - the map's data, and only the map's. */
  const scanTargets = useStore((s) => s.scanTargets);
  /* What a run would actually touch. Every figure below reads this one. */
  const includedTargets = useIncludedScanTargets();
  const excludedPaths = useStore((s) => s.excludedPaths);
  const toggleExcluded = useStore((s) => s.toggleExcluded);
  const clearExclusions = useStore((s) => s.clearExclusions);
  const candidates = useStore((s) => s.candidates);
  const offeredSections = useStore((s) => s.offeredSections);
  const history = useStore((s) => s.history);
  const phase = useStore((s) => s.phase);
  const scannedAt = useStore((s) => s.scannedAt);
  const developer = useStore((s) => s.developer);
  const setDeveloper = useStore((s) => s.setDeveloper);
  const idleDays = useStore((s) => s.idleDays);
  const setIdleDays = useStore((s) => s.setIdleDays);
  const prefs = useRunPreferences();
  const setScanTargets = useStore((s) => s.setScanTargets);
  const recordRehearsal = useStore((s) => s.recordRehearsal);
  const runEngine = useEngineRun();

  /* 🔴 Which action is in flight, not merely whether one is. The pending state
     belongs on the control that was pressed, and the other two have to refuse a
     press while it runs - one engine, one run at a time. */
  const [busy, setBusy] = useState<'scan' | 'dryRun' | 'reclaim' | null>(null);
  const [scanDone, setScanDone] = useState(false);
  const [cleared, setCleared] = useState(false);

  /* 🔴 `measured` is `scannedAt`, not `length > 0`. Once a tile can be clicked
     out, an empty INCLUDED list is a perfectly ordinary state after a real
     measurement - "you excluded everything" - whose true answer is 0.
     🔴 And every figure, word and state on this page that says "measured" keys on
     THIS, never on whether some run left a summary (D-55): a Picker ask is a run,
     and it measures nothing the hero claims. */
  const measured = scannedAt !== null;

  /* One home for this figure, in lib/reclaim.ts - it was computed here AND in
     Shell.tsx, and both copies read a run's result off a scan's summary. */
  const reclaimable = reclaimableBytes(includedTargets, measured);
  /* The Reclaim button's figure: an estimate or a bound, and which (D-60).
     🔴 It is the ladder's total too (D-61). The ladder used to total `safeRunBytes`
     - the measured size on disk - so after a rehearsal the band promised 34.2 GB
     under a button offering 1.9 GB. */
  const offer = useReclaimOffer();
  /* The same rule, per section, for the rungs - and shared with the Run screen's
     waiting rows, which were making the identical claim (D-61). */
  const figures = useRunFigures();
  /* What the scan measured, for the "N targets" line only. */
  const measuredCounts = useMemo(() => measuredBySection(includedTargets), [includedTargets]);

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

  /* The run itself - start, stream, record, and the failure path - is the shared
     `useEngineRun`; what is Home's own is where it goes and what it does to the
     map. The candidates a run offered reach the Picker through `finishRun`. */
  const drive = useCallback(
    async (args: string[], goToRun: boolean) => {
      const result = await runEngine(args, () => { if (goToRun) void navigate({ to: '/run' }); });
      /* 🔴 `targets[]` is filled by `--scan` and empty in every other mode, so
         this only ever ADDS measurements - a dry-run must not blank the map. A real
         run spends the rows of the sections it ran, and `finishRun` does that for
         every screen, so this one no longer clears everything itself. */
      if (result?.summary && result.summary.targets.length > 0) {
        setScanTargets(result.summary.targets);
      }
      return result;
    },
    [runEngine, navigate, setScanTargets],
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

  /* 🔴 THIS PRESS IS THE REHEARSAL (D-60). What it returns is recorded with the
     arguments it ran with - captured here, at the press - so the Reclaim button can
     tell whether the estimate still describes the run it offers. */
  const onDryRun = useCallback(() => {
    setBusy('dryRun');
    void drive(safeBatchArgs({ dryRun: true, ...prefs, excludedPaths }), true)
      .then((result) => {
        const rehearsal = result ? rehearsalFrom({ prefs, excludedPaths, ...result }) : null;
        if (rehearsal) recordRehearsal(rehearsal);
      })
      .finally(() => { setBusy(null); });
  }, [drive, prefs, excludedPaths, recordRehearsal]);

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

  /* The ladder's rungs: the engine's own safe batch, each carrying what a run
     would free from it (D-61, `lib/rehearsal.ts` -> `runFigures`) - the last
     rehearsal's own figure while it still describes this run, otherwise the bound.
     The target count beside it stays the SCAN's: it says what is there.
     Sorted by the figure shown, biggest first, once there is something to sort. */
  const ladderRows = useMemo<LadderRow[]>(() => {
    if (!catalogue) return [];
    const rows = safeRunSections(catalogue).map((section) => ({
      id: section.id,
      key: section.key,
      bytes: figures.bySection.get(section.id) ?? null,
      count: measuredCounts.get(section.id)?.count ?? null,
    }));
    if (figures.bySection.size > 0) rows.sort((a, b) => (b.bytes ?? -1) - (a.bytes ?? -1));
    return rows;
  }, [catalogue, figures, measuredCounts]);

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
            <HeroFigure bytes={reclaimable} />
            {/* 🔴 The dummy's whole sub-line: when it was measured, what it spans,
                and the re-scan beside it (`index.html:48-53`) - or, before a scan,
                its `?empty=1` sentence. There is no third state any more: the one
                that dated no scan was a run's summary standing in for one (D-55). */}
            <p className="hero-sub">
              {minutesAgo === null ? (
                t('home.heroSubUnmeasured')
              ) : (
                <>
                  {t('home.heroSubMeasured', {
                    count: minutesAgo,
                    targets: reclaimableTargetCount(includedTargets, measured),
                    sections: reclaimableSectionCount(includedTargets, measured),
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
              {/* The word follows the measurement, not the last run (D-55): the
                  dummy's before-a-scan Home reads "Scan". */}
              <span className="btn-label">{measured ? t('home.scanAgain') : t('home.scanFirst')}</span>
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
              disabled={running || offer === null}
              state={stateOf(busy === 'reclaim')}
              label={
                offer === null
                  ? t('home.reclaimUnmeasured')
                  : offer.upTo
                    ? t('home.reclaimUpTo', { amount: formatBytes(offer.amount) })
                    : t('home.reclaim', { amount: formatBytes(offer.amount) })
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
              <SafeRunLadder rows={ladderRows} total={offer?.amount ?? null} upTo={offer?.upTo ?? true} />
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
      <NeedsAPerson sections={interactive} candidates={candidates} offeredSections={offeredSections} />

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
