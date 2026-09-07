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
 *   4  drives + developer mode ......... here (drives DECLARED, see below)
 *   5  the safe run ladder ............. `components/SafeRunLadder.tsx`
 *   6  these need a person ............. `components/NeedsAPerson.tsx`
 *   7  the assurance ................... `components/HomeSafety.tsx`
 *   8  how that is enforced ............ `components/HomeSafety.tsx`
 *   10 the last eight runs ............. `components/LastRuns.tsx`
 *   11 the schedule .................... `components/LastRuns.tsx` (DECLARED)
 *   12 sections needing admin .......... `components/AdminNotice.tsx`
 *   13 what leaves this machine ........ here
 *   14 the status bar .................. `components/Shell.tsx`
 *
 * 🔴 THE DRIVES BAND AND THE CAPACITY RING ARE DECLARED, NOT BUILT -
 * `pending.drives` (pending-wave). The engine's `--json` summary carries no drive
 * and no free-space field at all (`RunSummary` in `lib/cli.ts` has none, and
 * `modules/runner.ps1` emits none), so there is no measured figure to draw. The
 * dummy's own numbers are seeded (`seed.js:142-146`). Getting real ones needs a
 * new engine field or a new Rust command, and both are frozen for this release.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
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
import { DESTINATIONS, type Destination } from '../lib/consent';
import { ReclaimMapBand } from '../components/ReclaimMapBand';
import { SafeRunLadder, type LadderRow } from '../components/SafeRunLadder';
import { NeedsAPerson } from '../components/NeedsAPerson';
import { HomeSafety } from '../components/HomeSafety';
import { LastRuns } from '../components/LastRuns';
import { AdminNotice } from '../components/AdminNotice';
import type { MapTarget } from '../components/ReclaimMap';

/** Brand names, not copy: they are the same in every language. */
const VENDOR: Record<Destination, string> = {
  ga4: 'Google Analytics 4',
  amplitude: 'Amplitude',
  clarity: 'Microsoft Clarity',
  sentry: 'Sentry',
};

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
  const scanTargets = useStore((s) => s.scanTargets);
  const candidates = useStore((s) => s.candidates);
  const history = useStore((s) => s.history);
  const phase = useStore((s) => s.phase);
  const developer = useStore((s) => s.developer);
  const setDeveloper = useStore((s) => s.setDeveloper);
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

  /* One home for this figure, in lib/reclaim.ts - it was computed here AND in
     Shell.tsx, and both copies read a run's result off a scan's summary. */
  const reclaimable = reclaimableBytes(summary, scanTargets);

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

  const onScan = useCallback(() => {
    setBusy('scan');
    void drive(scanArgs(developer), false).finally(() => {
      setBusy(null);
      setScanDone(true);
    });
  }, [drive, developer]);

  /* The tick is an acknowledgement, not a state: it says "that finished" and then
     gets out of the way, which is what the dummy's own busy() helper does. The
     hero number changing is the primary answer; this is the one at the control. */
  useEffect(() => {
    if (!scanDone) return;
    const to = window.setTimeout(() => { setScanDone(false); }, 700);
    return () => { window.clearTimeout(to); };
  }, [scanDone]);

  const onDryRun = useCallback(() => {
    setBusy('dryRun');
    void drive(safeBatchArgs({ dryRun: true, developer }), true).finally(() => { setBusy(null); });
  }, [drive, developer]);

  const onReclaim = useCallback(() => {
    setBusy('reclaim');
    void drive(safeBatchArgs({ dryRun: false, developer }), true).finally(() => { setBusy(null); });
  }, [drive, developer]);

  /* The map's tiles: one per scanned target, coloured by its section's tier and
     grouped by its section. Every field is the engine's. */
  const mapTargets = useMemo<MapTarget[]>(
    () => toMapTargets(catalogue, scanTargets),
    [catalogue, scanTargets],
  );

  /* The ladder's rungs: the engine's own safe batch, with a figure only where a
     scan measured one. Sorted biggest-first once there is something to sort. */
  const ladderRows = useMemo<LadderRow[]>(() => {
    if (!catalogue) return [];
    const bySection = new Map<number, { bytes: number; count: number }>();
    for (const target of scanTargets) {
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
  }, [catalogue, developer, scanTargets]);

  const measured = scanTargets.length > 0;
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
            <p className="hero-sub">
              {reclaimable === null
                ? t('home.heroSubUnmeasured')
                : t('home.heroSub', {
                    targets: reclaimableTargetCount(summary, scanTargets),
                    sections: reclaimableSectionCount(summary, scanTargets),
                  })}
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
            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={onReclaim}
              disabled={running || reclaimable === null}
              {...controlState(stateOf(busy === 'reclaim'))}
            >
              <span className="btn-label">
                {reclaimable === null
                  ? t('home.reclaimUnmeasured')
                  : t('home.reclaim', { amount: formatBytes(reclaimable) })}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ZONE 3 - the signature element */}
      <ReclaimMapBand targets={mapTargets} measured={measured} />

      {/* ZONES 4 + 5 - drives | the safe-run ladder */}
      <section className="band band-app">
        <div className="wrap g12">
          <div className="c7 rise">
            <div className="zone-label">
              <span className="caps">{t('home.drivesTitle')}</span>
            </div>
            {/* The stated gap that stands where the rails and the ring would be. */}
            <div className="panel pad">
              <p className="t-sm ink-3">{t('pending.drives')}</p>
            </div>

            {/* Developer mode sits here rather than in a band of its own: it is
                what decides how much of the ladder beside it there is. */}
            <div className="zone-label" style={{ marginTop: 'var(--sp-6)' }}>
              <span className="caps">{t('home.developerTitle')}</span>
            </div>
            <div className="panel pad">
              <button
                className="switch"
                type="button"
                role="switch"
                aria-checked={developer}
                aria-label={t('home.developerTitle')}
                onClick={() => { setDeveloper(!developer); }}
              />
              <p className="t-sm">{developer ? t('home.developerOn') : t('home.developerOff')}</p>
              <p className="t-sm ink-3">{t('home.developerNote')}</p>
            </div>
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

          {/* 🔴 The destination ledger - the dummy's zone 13, on request rather
              than in the way. These were four SWITCHES until 2026-09-07; the owner
              removed the opt-out, so each destination is now a stated fact
              carrying an `on` badge. A switch that changes nothing is worse than
              no switch, and this is the surface a person meets in ordinary use
              rather than once at first run. */}
          <details className="disclose">
            <summary>
              <span className="disclose-line">{t('home.privacySummary')}</span>
              <span className="disclose-more">{t('consent.detailsMore')}</span>
            </summary>
            <div className="disclose-body">
              <p>{t('home.privacyIntro')}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {DESTINATIONS.map((d) => (
                  <div
                    key={d}
                    style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-3)' }}
                  >
                    <span className="badge badge-outline">{t('consent.badgeOn')}</span>
                    <div>
                      <div>
                        <span className="t-sm">{t(`consent.provider.${d}.name`)}</span>{' '}
                        <span className="t-xs ink-3">{VENDOR[d]}</span>
                      </div>
                      <div className="t-xs ink-3">{t(`consent.provider.${d}.what`)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p>
                <strong>{t('consent.neverSentLabel')}</strong> {t('consent.neverSent')}
              </p>
              <p>{t('home.privacySignIn')}</p>
            </div>
          </details>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
