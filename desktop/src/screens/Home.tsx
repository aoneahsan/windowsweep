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

import { useCallback, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { formatBytes } from '../lib/format';
import { newRunId, run, scanArgs, safeBatchArgs } from '../lib/engine';
import { safeRunSections } from '../lib/catalogue';

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

  const [busy, setBusy] = useState<'scan' | null>(null);

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
    void drive(scanArgs(developer), false).finally(() => { setBusy(null); });
  }, [drive, developer]);

  const onDryRun = useCallback(() => {
    void drive(safeBatchArgs({ dryRun: true, developer }), true);
  }, [drive, developer]);

  const onReclaim = useCallback(() => {
    void drive(safeBatchArgs({ dryRun: false, developer }), true);
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
            <button className="btn" type="button" onClick={onScan} disabled={busy === 'scan' || phase === 'running'}>
              <span className="btn-label">{summary ? t('home.scanAgain') : t('home.scanFirst')}</span>
            </button>
            <button className="btn" type="button" onClick={onDryRun} disabled={phase === 'running'}>
              <span className="btn-label">{t('home.dryRunFirst')}</span>
            </button>
            <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={onReclaim}
              disabled={phase === 'running' || reclaimable === null}
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

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
