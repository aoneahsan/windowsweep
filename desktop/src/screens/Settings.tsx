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

import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { DESTINATIONS, type Destination } from '../lib/consent';
import { configuredFeatures, REPO_URL, SUPPORT_URL } from '../lib/config';
import { openExternal } from '../lib/links';
import { controlState, stateOf } from '../lib/control-state';

type Tab = 'general' | 'scanning' | 'notifications' | 'privacy' | 'about';
const TABS: Tab[] = ['general', 'scanning', 'notifications', 'privacy', 'about'];

/** The two external links the About tab offers. */
type Link = 'source' | 'support';

const VENDOR: Record<Destination, string> = {
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

  const developer = useStore((s) => s.developer);
  const setDeveloper = useStore((s) => s.setDeveloper);
  const features = configuredFeatures();

  const [opening, setOpening] = useState<Link | null>(null);
  const [opened, setOpened] = useState<Link | null>(null);

  const openLink = useCallback((which: Link, href: string) => {
    setOpening(which);
    void openExternal(href)
      .then(() => { setOpened(which); })
      .catch(() => {
        /* 🔴 Caught rather than dropped: `void promise.finally()` still leaves an
           unhandled rejection, and outside a Tauri window there is no opener at
           all. The control returns to idle and claims nothing, because the dummy
           carries no sentence for a browser that would not open - reported. */
      })
      .finally(() => { setOpening(null); });
  }, []);

  /* The tick says "handed to your browser" and then gets out of the way. */
  useEffect(() => {
    if (opened === null) return;
    const to = window.setTimeout(() => { setOpened(null); }, 900);
    return () => { window.clearTimeout(to); };
  }, [opened]);

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
                  {/* 🔴 The ten theme axes were duplicated here and the dummy forbids it:
                      page-settings.js says "The theme axes are NOT duplicated here: they
                      live in the one theme control, reachable from the title bar on every
                      screen." Two controls for one setting is also what frontend rule 11
                      rules out. They were the only controls on this screen with no engine
                      flag behind them, which is why the README could not honestly say every
                      control here maps to one. ThemePanel.tsx is that one control. */}
                </div>
              ) : null}

              {tab === 'scanning' || tab === 'notifications' ? (
                <div className="panel pad">
                  <p className="t-sm ink-3">{t('pending.body')}</p>
                </div>
              ) : null}

              {tab === 'privacy' ? (
                <>
                  {/* 🔴 Four SWITCHES until 2026-09-07. The owner removed the
                      opt-out, so this panel states what is collected and says
                      plainly that there is no switch. A control a person can
                      press that changes nothing is worse than no control: it is a
                      promise the product does not keep. */}
                  <div className="note note-info">
                    <span aria-hidden="true">i</span>
                    <span className="t-sm">
                      <Trans i18nKey="consent.lede" components={{ 1: <strong /> }} />
                    </span>
                  </div>
                  <div className="lst">
                    {DESTINATIONS.map((p) => (
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
                          <span className="badge badge-outline">{t('consent.badgeOn')}</span>
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
                  <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-3)' }}>
                    {t('consent.noSwitch')}
                  </p>
                  {/* A BUILD fact, not a setting: no key is configured here, so
                      nothing is actually sent from this build. */}
                  {!features.telemetry ? (
                    <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-2)' }}>
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
                    {/* 🔴 Handing a URL to the system browser takes a moment and
                        the app window does not change, so without a state on the
                        control the press is invisible - and `void openExternal()`
                        also dropped its rejection on the floor. */}
                    <button
                      className="btn btn-sm"
                      type="button"
                      onClick={() => { openLink('source', REPO_URL); }}
                      disabled={opening !== null}
                      {...controlState(stateOf(opening === 'source', opened === 'source'))}
                    >
                      <span className="btn-label">{t('settings.source')}</span>
                    </button>
                    <button
                      className="btn btn-sm"
                      type="button"
                      onClick={() => { openLink('support', SUPPORT_URL); }}
                      disabled={opening !== null}
                      {...controlState(stateOf(opening === 'support', opened === 'support'))}
                    >
                      <span className="btn-label">{t('settings.support')}</span>
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
