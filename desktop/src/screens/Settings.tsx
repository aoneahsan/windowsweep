/**
 * Settings - five tabs, and every control maps to a flag the engine already has.
 *
 * Translated from `settings.html`. 🔴 The tab lives in the URL, not in a bare
 * `useState`, so a tab is linkable and the back button works - the URL-state rule
 * covers tabs explicitly.
 *
 * 🔴 The Privacy tab STATES; it does not offer. The owner removed the opt-out on
 * 2026-09-07, so there is nothing to revoke and the copy says so plainly. A
 * control a person can press that changes nothing is worse than no control.
 *
 * 🔴 General and About live in their own files. This screen is the tab frame; the
 * two tabs with real content in them each outgrew a branch in it, and the 500-line
 * ceiling is the point at which a file is doing too much rather than a number to
 * argue with.
 */

import { useNavigate, useSearch } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';

import { DESTINATIONS, type Destination } from '../lib/consent';
import { configuredFeatures, noDestinationConfigured } from '../lib/config';
import { SettingsGeneral } from '../components/SettingsGeneral';
import { SettingsAbout } from '../components/SettingsAbout';

type Tab = 'general' | 'scanning' | 'notifications' | 'privacy' | 'about';
const TABS: Tab[] = ['general', 'scanning', 'notifications', 'privacy', 'about'];

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

  const features = configuredFeatures();

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
              {tab === 'general' ? <SettingsGeneral /> : null}

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
                            <span>{t(`consent.provider.${p}.name`)}</span>
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
                      <div>{t('consent.neverSentLabel')}</div>
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
                  {/* 🔴 Read per DESTINATION, not from one flag. `settings.noKeys`
                      claims that NO destination is configured, which is only true
                      when all four keys are absent - the old single boolean was
                      `ga4 ?? amplitude ?? clarity ?? sentry`, so a build with one
                      key set reported telemetry as configured and this sentence
                      vanished while three destinations still received nothing.
                      The dummy carries no sentence for a PARTIALLY configured
                      build, so none is invented here - reported instead. */}
                  {noDestinationConfigured(features.telemetry) ? (
                    <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-2)' }}>
                      {t('settings.noKeys')}
                    </p>
                  ) : null}
                </>
              ) : null}

              {tab === 'about' ? <SettingsAbout /> : null}
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
