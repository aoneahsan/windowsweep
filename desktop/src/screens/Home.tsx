/**
 * Home - the number, then what it will touch, then the action.
 *
 * Translated from `desktop/design/windowsweep-click-dummy/index.html`. The class
 * names, the band order and the words are the dummy's; GATE 4 compares the two
 * page by page, so a divergence here is written into the dummy first.
 *
 * 🔴 The number comes from a real `--scan`, never from a guess. Until one has run,
 * the hero says so rather than showing a zero that reads as "nothing to reclaim".
 */

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { formatBytes } from '../lib/format';
import { newRunId, run, scanArgs, safeBatchArgs } from '../lib/engine';
import { safeRunSections } from '../lib/catalogue';
import { controlState, stateOf } from '../lib/control-state';
import { DESTINATIONS, type Destination } from '../lib/consent';

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
  const phase = useStore((s) => s.phase);
  const developer = useStore((s) => s.developer);
  const setDeveloper = useStore((s) => s.setDeveloper);
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);
  const setCandidates = useStore((s) => s.setCandidates);

  /* 🔴 Which action is in flight, not merely whether one is. The pending state
     belongs on the control that was pressed, and the other two have to refuse a
     press while it runs - one engine, one run at a time. */
  const [busy, setBusy] = useState<'scan' | 'dryRun' | 'reclaim' | null>(null);
  const [scanDone, setScanDone] = useState(false);

  const reclaimable = summary
    ? summary.estimated_bytes > 0
      ? summary.estimated_bytes
      : summary.freed_bytes
    : null;

  const drive = useCallback(
    async (args: string[], goToRun: boolean) => {
      const id = newRunId();
      startRun(id);
      if (goToRun) void navigate({ to: '/run' });
      const result = await run(args, id, {
        onLog: appendLog,
        onProgress: (section, event, status, freedBytes) => {
          applyProgress({ section, event, ...(status ? { status } : {}), ...(freedBytes !== undefined ? { freedBytes } : {}) });
        },
      });
      finishRun(result.summary, result.exitCode > 1);
      if (result.summary) setCandidates(result.summary.candidates);
      return result;
    },
    [startRun, navigate, appendLog, applyProgress, finishRun, setCandidates],
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

  const safeSections = catalogue ? safeRunSections(catalogue, developer) : [];
  /* 🔴 One gate for all three buttons: a second press must not be able to start a
     second run, whether the first one is still starting up (`busy`) or already
     streaming (`phase`). Either alone leaves a window where two runs can begin. */
  const running = busy !== null || phase === 'running';

  return (
    <>
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
              {summary
                ? t('home.heroSub', {
                    targets: summary.targets.length,
                    sections: summary.sections.length,
                  })
                : t('home.heroSubUnmeasured')}
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

      <section className="band band-app">
        <div className="wrap g12">
          <div className="c7 rise">
            <div className="zone-label">
              <span className="caps">{t('home.safeRunTitle')}</span>
            </div>
            <div className="panel pad">
              {safeSections.length === 0 ? (
                <p className="t-sm ink-3">{t('common.loading')}</p>
              ) : (
                <div className="lst">
                  {safeSections.map((s) => (
                    <div className="lst-i" key={s.id}>
                      <span className="num t-sm ink-3">{s.id}</span>
                      <div style={{ flex: 1 }}>
                        <div className="t-base">{s.key}</div>
                        <div className="t-sm ink-3">{s.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="c5 rise">
            <div className="zone-label">
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
        </div>
      </section>

      {/* The assurance band: reassurance delivered as a specific refusal, never as
          an adjective. Its wording is the dummy's, verbatim. */}
      <section className="band band-bleed band-tight">
        <div className="wrap rise">
          <p className="assure">{t('home.assure')}</p>
        </div>
      </section>

      {/* 🔴 The destination ledger - the dummy's zone 13, on request rather than
          in the way. These were four SWITCHES until 2026-09-07; the owner removed
          the opt-out, so each destination is now a stated fact carrying an `on`
          badge. A switch that changes nothing is worse than no switch, and this is
          the surface a person meets in ordinary use rather than once at first run. */}
      <section className="band band-app">
        <div className="wrap rise">
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
