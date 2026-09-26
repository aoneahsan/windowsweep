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
 * 🔴 The tablist is named "Settings sections", the dummy's own name for it - it
 * repeated the page heading, which a screen reader had just read (D-35).
 *
 * 🔴 NO STATUS-BAR NOTE HERE, and that is deliberate rather than an omission. The
 * dummy's reads "settings sync when you are signed in", and nothing in this window
 * syncs yet - `lib/sync.ts` has no caller. A note promising it would be the
 * product claiming behaviour it does not have; it arrives with the sync wiring.
 *
 * 🔴 General, Privacy and About live in their own files. This screen is the tab
 * frame; the three tabs with real content in them each outgrew a branch in it, and
 * the 500-line ceiling is the point at which a file is doing too much rather than a
 * number to argue with.
 */

import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { SettingsGeneral } from '../components/SettingsGeneral';
import { SettingsPrivacy } from '../components/SettingsPrivacy';
import { SettingsAbout } from '../components/SettingsAbout';

type Tab = 'general' | 'scanning' | 'notifications' | 'privacy' | 'about';
const TABS: Tab[] = ['general', 'scanning', 'notifications', 'privacy', 'about'];

export function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search: { tab?: Tab } = useSearch({ strict: false });
  const tab: Tab = TABS.includes(search.tab ?? 'general') ? (search.tab ?? 'general') : 'general';

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
            <div className="tablist" role="tablist" aria-label={t('settings.tabsLabel')}>
              {TABS.map((x) => (
                <button
                  className="tab"
                  role="tab"
                  type="button"
                  key={x}
                  aria-selected={tab === x}
                  onClick={() => {
                    void navigate({ to: '/settings', search: { tab: x } });
                  }}
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

              {tab === 'privacy' ? <SettingsPrivacy /> : null}

              {tab === 'about' ? <SettingsAbout /> : null}
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
