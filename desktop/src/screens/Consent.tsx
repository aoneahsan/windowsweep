/**
 * Consent - the first-run decision, and a SAFETY SURFACE.
 *
 * 🔴 Humor is off entirely here. Nothing dry, nothing clever, no aside. A person
 * is being asked for permission, and a joke in that moment reads as someone
 * hurrying them past the question.
 *
 * 🔴 Declining is a first-class path, verbally and visually: the two buttons carry
 * equal weight, the app is not degraded, nothing asks again, and every feature
 * including sign-in and sync still works.
 *
 * Translated from `consent.html`. Every string is the dummy's.
 */

import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { CONSENT_PROVIDERS, NO_CONSENT, type ConsentProvider, type ConsentState } from '../lib/consent';

const VENDOR: Record<ConsentProvider, string> = {
  ga4: 'Google Analytics 4',
  amplitude: 'Amplitude',
  clarity: 'Microsoft Clarity',
  sentry: 'Sentry',
};

export function Consent() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setConsent = useStore((s) => s.setConsent);

  const [draft, setDraft] = useState<Record<ConsentProvider, boolean>>({
    ga4: false,
    amplitude: false,
    clarity: false,
    sentry: false,
  });

  const onCount = CONSENT_PROVIDERS.filter((p) => draft[p]).length;

  function finish(accepted: boolean) {
    const next: ConsentState = accepted
      ? { ...draft, answered: true, answeredAt: new Date().toISOString() }
      : { ...NO_CONSENT, answered: true, answeredAt: new Date().toISOString() };
    setConsent(next);
    void navigate({ to: '/' });
  }

  return (
    <div className="app">
      <header className="titlebar" data-tauri-drag-region />
      <div className="shell">
        <main className="content">
          <section className="band band-app">
            <div className="wrap wrap-narrow">
              <p className="caps ink-3">{t('consent.eyebrow')}</p>
              <h1 className="t-xl wide">{t('consent.title')}</h1>
              <p className="lede">{t('consent.lede')}</p>
            </div>
          </section>

          <section className="band band-app band-tight">
            <div className="wrap wrap-narrow">
              <div className="panel pad">
                <div className="fw-row" style={{ marginBottom: 'var(--sp-4)' }}>
                  <h2 className="t-md wide">{t('consent.switchesTitle')}</h2>
                  <button
                    className="btn btn-sm"
                    type="button"
                    style={{ marginInlineStart: 'auto' }}
                    onClick={() => { setDraft({ ga4: true, amplitude: true, clarity: true, sentry: true }); }}
                  >
                    {t('consent.allOn')}
                  </button>
                  <button
                    className="btn btn-sm"
                    type="button"
                    onClick={() => { setDraft({ ga4: false, amplitude: false, clarity: false, sentry: false }); }}
                  >
                    {t('consent.allOff')}
                  </button>
                </div>

                <div className="lst">
                  {CONSENT_PROVIDERS.map((p) => (
                    <div className="lst-i" key={p}>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: 'var(--sp-2)',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span className="t-base">{t(`consent.provider.${p}.name`)}</span>
                          <span className="badge badge-outline">{VENDOR[p]}</span>
                        </div>
                        <div className="t-sm ink-3">{t(`consent.provider.${p}.what`)}</div>
                      </div>
                      <div className="lst-x">
                        <button
                          className="switch"
                          type="button"
                          role="switch"
                          aria-checked={draft[p]}
                          aria-label={t(`consent.provider.${p}.name`)}
                          onClick={() => { setDraft({ ...draft, [p]: !draft[p] }); }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <details className="disclose" style={{ marginTop: 'var(--sp-4)' }}>
                <summary>
                  <span className="disclose-line">{t('consent.detailsSummary')}</span>
                  <span className="disclose-more">{t('consent.detailsMore')}</span>
                </summary>
                <div className="disclose-body">
                  <p>
                    <strong>{t('consent.neverSentLabel')}</strong> {t('consent.neverSent')}
                  </p>
                  <p>{t('consent.eachOne')}</p>
                  <p>{t('consent.decliningIsFine')}</p>
                </div>
              </details>
            </div>
          </section>

          <section className="band band-bleed band-tight">
            <div
              className="wrap wrap-narrow"
              style={{ display: 'flex', gap: 'var(--sp-3)', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <p className="t-sm">
                {onCount === 0
                  ? t('consent.summaryNone')
                  : onCount === CONSENT_PROVIDERS.length
                    ? t('consent.summaryAll')
                    : t('consent.summarySome', { count: onCount, total: CONSENT_PROVIDERS.length })}
              </p>
              {/* 🔴 Equal weight. Both are `btn btn-primary`: a first-class decline
                  cannot be the quieter of two buttons. */}
              <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 'var(--sp-2)' }}>
                <button className="btn btn-primary" type="button" onClick={() => { finish(false); }}>
                  {t('consent.decline')}
                </button>
                <button className="btn btn-primary" type="button" onClick={() => { finish(true); }}>
                  {t('consent.accept')}
                </button>
              </div>
            </div>
          </section>

          <div style={{ height: 'var(--sp-16)' }} />
        </main>
      </div>
    </div>
  );
}
