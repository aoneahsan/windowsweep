/**
 * Settings - five tabs, and every control maps to a flag the engine already has.
 *
 * Translated from `settings.html`. 🔴 The tab lives in the URL, not in a bare
 * `useState`, so a tab is linkable and the back button works - the URL-state rule
 * covers tabs explicitly.
 *
 * 🔴 The Privacy tab is where a destination is REVOKED, and revoking has to stop
 * it immediately. A loaded third-party script cannot be unloaded, so the only
 * honest way to stop one is to write the new record and reload the window; that is
 * what `revoke` does, and the copy says so.
 */

import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { CONSENT_PROVIDERS, type ConsentProvider } from '../lib/consent';
import { AXES, axisValue } from '../lib/theme';
import { configuredFeatures, REPO_URL, SUPPORT_URL } from '../lib/config';
import { openExternal } from '../lib/links';

type Tab = 'general' | 'scanning' | 'notifications' | 'privacy' | 'about';
const TABS: Tab[] = ['general', 'scanning', 'notifications', 'privacy', 'about'];

const VENDOR: Record<ConsentProvider, string> = {
  ga4: 'Google Analytics 4',
  amplitude: 'Amplitude',
  clarity: 'Microsoft Clarity',
  sentry: 'Sentry',
};

export function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search: { tab?: Tab } = useSearch({ strict: false });
  const tab: Tab = TABS.includes(search.tab ?? 'general') ? (search.tab ?? 'general') : 'general';

  const prefs = useStore((s) => s.prefs);
  const setAxis = useStore((s) => s.setAxis);
  const developer = useStore((s) => s.developer);
  const setDeveloper = useStore((s) => s.setDeveloper);
  const consent = useStore((s) => s.consent);
  const setConsent = useStore((s) => s.setConsent);
  const features = configuredFeatures();

  function revoke(provider: ConsentProvider, on: boolean) {
    setConsent({ ...consent, [provider]: on, answered: true, answeredAt: new Date().toISOString() });
    // 🔴 A script already loaded cannot be unloaded. Reloading with the new
    // record written is the only way "revoking stops it immediately" is true.
    if (!on) window.location.reload();
  }

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <h1 className="t-xl wide">{t('settings.title')}</h1>
          <p className="t-sm ink-3">{t('settings.lede')}</p>
        </div>
      </section>

      <section className="band band-app">
        <div className="wrap">
          <div className="tabs">
            <div className="tablist" role="tablist" aria-label={t('settings.title')}>
              {TABS.map((x) => (
                <button
                  className="tab"
                  role="tab"
                  type="button"
                  key={x}
                  aria-selected={tab === x}
                  onClick={() => { void navigate({ to: '/settings', search: { tab: x } }); }}
                >
                  {t(`settings.tab.${x}`)}
                </button>
              ))}
            </div>

            <div className="tabpanel" role="tabpanel" tabIndex={0}>
              {tab === 'general' ? (
                <div className="lst">
                  <div className="lst-i">
                    <div style={{ flex: 1 }}>
                      <div className="t-base">{t('home.developerTitle')}</div>
                      <div className="t-sm ink-3">
                        {developer ? t('home.developerOn') : t('home.developerOff')}
                      </div>
                    </div>
                    <div className="lst-x">
                      <button
                        className="switch"
                        type="button"
                        role="switch"
                        aria-checked={developer}
                        aria-label={t('home.developerTitle')}
                        onClick={() => { setDeveloper(!developer); }}
                      />
                    </div>
                  </div>
                  {AXES.map((axis) => (
                    <div className="lst-i" key={axis.key}>
                      <div style={{ flex: 1 }}>
                        <div className="t-base">{t(axis.labelKey)}</div>
                      </div>
                      <div className="lst-x">
                        <div className="seg" role="radiogroup" aria-label={t(axis.labelKey)}>
                          {axis.values.map((v) => (
                            <button
                              className="seg-opt"
                              type="button"
                              role="radio"
                              key={v.value}
                              aria-checked={axisValue(prefs, axis.key) === v.value}
                              onClick={() => { setAxis(axis.key, v.value); }}
                            >
                              <span>{t(`theme.value.${v.value}`, v.label)}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {tab === 'scanning' || tab === 'notifications' ? (
                <div className="panel pad">
                  <p className="t-sm ink-3">{t('pending.body')}</p>
                </div>
              ) : null}

              {tab === 'privacy' ? (
                <>
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
                            aria-checked={consent[p]}
                            aria-label={t(`consent.provider.${p}.name`)}
                            onClick={() => { revoke(p, !consent[p]); }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="lst-i" style={{ marginTop: 'var(--sp-4)' }}>
                    <div style={{ flex: 1 }}>
                      <div className="t-base">{t('consent.neverSentLabel')}</div>
                      <div className="t-sm ink-3">{t('consent.neverSent')}</div>
                    </div>
                    <div className="lst-x">
                      <span className="badge badge-ok">{t('settings.refused')}</span>
                    </div>
                  </div>
                  {!features.telemetry ? (
                    <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-3)' }}>
                      {t('settings.noKeys')}
                    </p>
                  ) : null}
                </>
              ) : null}

              {tab === 'about' ? (
                <div className="panel pad">
                  <p className="t-sm">{t('settings.about')}</p>
                  <div
                    style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap', marginTop: 'var(--sp-3)' }}
                  >
                    <button className="btn btn-sm" type="button" onClick={() => { void openExternal(REPO_URL); }}>
                      {t('settings.source')}
                    </button>
                    <button className="btn btn-sm" type="button" onClick={() => { void openExternal(SUPPORT_URL); }}>
                      {t('settings.support')}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
