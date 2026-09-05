/**
 * Splash - three things happen here and none of them touches the disk.
 *
 * Translated from `splash.html`. The disclosure says exactly what runs, because a
 * progress bar with no explanation on a tool that deletes files is the wrong first
 * impression: the reader's first question is "what is it doing?", and the answer
 * is "reading its own catalogue".
 *
 * 🔴 The route exists for the real boot, not for decoration. It shows while the
 * catalogue is being read and moves on by itself; a person is never made to watch
 * an animation finish.
 */

import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { readConsent } from '../lib/consent';

const STEPS: [string, number][] = [
  ['splash.step.engine', 18],
  ['splash.step.catalogue', 46],
  ['splash.step.update', 78],
  ['splash.step.ready', 100],
];

export function Splash() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const catalogue = useStore((s) => s.catalogue);
  const engineError = useStore((s) => s.engineError);

  /* The step is DERIVED, not stored. It was a `useState` set from inside an
     effect, which the react-hooks rule correctly rejected: nothing here is state
     the app owns, it is a reading of two values it already has. The effect that
     remains does the one thing an effect is for - leaving for another route. */
  const step = engineError ? 1 : catalogue ? 3 : 0;

  useEffect(() => {
    if (step !== 3) return;
    const to = window.setTimeout(() => {
      // First run answers the consent question; after that, straight to Home.
      void navigate({ to: readConsent().answered ? '/' : '/consent' });
    }, 450);
    return () => { window.clearTimeout(to); };
  }, [step, navigate]);

  const [, width] = STEPS[step] ?? STEPS[0]!;

  return (
    <div className="app">
      <header className="titlebar" data-tauri-drag-region />
      <div className="shell">
        <main className="content">
          <section
            className="band band-app"
            style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}
          >
            <div className="wrap wrap-narrow" style={{ textAlign: 'center' }}>
              <div className="hero-ring" aria-hidden="true" />
              <p className="caps ink-3">{t('app.name')}</p>
              <h1 className="t-2xl wide" style={{ marginBlock: 'var(--sp-2) var(--sp-4)' }}>
                {t('splash.wordmark')}
              </h1>

              <div className="prog" style={{ maxWidth: '22rem', marginInline: 'auto' }}>
                <i className="prog-fill" style={{ width: `${String(width)}%` }} />
              </div>
              <p
                className="t-sm ink-3"
                style={{ marginTop: 'var(--sp-3)' }}
                role="status"
                aria-live="polite"
              >
                {t(STEPS[step]?.[0] ?? 'splash.step.engine')}
              </p>

              <details className="disclose" style={{ marginTop: 'var(--sp-8)', textAlign: 'start' }}>
                <summary>
                  <span className="disclose-line">{t('splash.detailsSummary')}</span>
                  <span className="disclose-more">{t('consent.detailsMore')}</span>
                </summary>
                <div className="disclose-body">
                  <p>{t('splash.detailsWhat')}</p>
                  <p>{t('splash.detailsNothing')}</p>
                </div>
              </details>
            </div>
          </section>

          {engineError ? (
            <section className="band band-app band-tight">
              <div className="wrap wrap-narrow">
                <div className="note note-warn">
                  <span aria-hidden="true">⚠</span>
                  <span>{t('error.engineMissing')}</span>
                </div>
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
