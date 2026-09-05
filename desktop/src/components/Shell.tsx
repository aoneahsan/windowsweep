/**
 * The window chrome: title bar, navigation rail, status bar and the theme panel's
 * toggle. Written once and rendered around every route, because hand-copying a
 * live layer per screen is the click-dummy pitfall that shipped four silent
 * defects in one prototype.
 *
 * 🔴 The words here come from the approved click dummy, through `t()`. A label is
 * changed in the dummy first and copied here second.
 */

import { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getCurrentWindow } from '@tauri-apps/api/window';

import { Icon, type IconName } from './Icon';
import { ThemePanel } from './ThemePanel';
import { useStore } from '../state/store';
import { formatBytes } from '../lib/format';

interface NavGroup {
  group: string;
}
interface NavLink {
  to: string;
  labelKey: string;
  icon: IconName;
}
type NavEntry = NavGroup | NavLink;

const NAV: NavEntry[] = [
  { group: 'nav.group.clean' },
  { to: '/', labelKey: 'nav.home', icon: 'home' },
  { to: '/sections', labelKey: 'nav.sections', icon: 'list' },
  { to: '/picker', labelKey: 'nav.picker', icon: 'user' },
  { to: '/run', labelKey: 'nav.run', icon: 'play' },
  { group: 'nav.group.records' },
  { to: '/history', labelKey: 'nav.history', icon: 'clock' },
  { to: '/report', labelKey: 'nav.report', icon: 'doc' },
  { group: 'nav.group.you' },
  { to: '/account', labelKey: 'nav.account', icon: 'user' },
  { to: '/settings', labelKey: 'nav.settings', icon: 'gear' },
  { to: '/elevation', labelKey: 'nav.elevation', icon: 'backend' },
];

function isGroup(entry: NavEntry): entry is NavGroup {
  return 'group' in entry;
}

function Titlebar({ onOpenTheme }: { onOpenTheme: () => void }) {
  const { t } = useTranslation();
  const win = getCurrentWindow();
  return (
    <header className="titlebar" data-tauri-drag-region>
      <span className="tb-name">{t('app.name')}</span>
      <div className="tb-spacer" />
      <button className="tb-btn" type="button" onClick={onOpenTheme} aria-label={t('theme.title')}>
        <Icon name="sun" />
      </button>
      <button className="tb-btn" type="button" onClick={() => void win.minimize()} aria-label={t('window.minimise')}>
        <Icon name="min" />
      </button>
      <button className="tb-btn" type="button" onClick={() => void win.toggleMaximize()} aria-label={t('window.maximise')}>
        <Icon name="max" />
      </button>
      <button className="tb-btn tb-close" type="button" onClick={() => void win.close()} aria-label={t('window.close')}>
        <Icon name="close" />
      </button>
    </header>
  );
}

function Rail() {
  const { t } = useTranslation();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const summary = useStore((s) => s.summary);
  const catalogue = useStore((s) => s.catalogue);

  const reclaimable = summary
    ? formatBytes(summary.estimated_bytes > 0 ? summary.estimated_bytes : summary.freed_bytes)
    : '-';
  const sectionCount = summary?.sections.length ?? 0;

  return (
    <nav className="rail" aria-label={t('nav.label')}>
      {NAV.map((entry, i) =>
        isGroup(entry) ? (
          <div className="rail-group caps" key={`g${String(i)}`}>
            {t(entry.group)}
          </div>
        ) : (
          <Link
            className="rail-item"
            key={entry.to}
            to={entry.to}
            {...(path === entry.to ? { 'aria-current': 'page' as const } : {})}
          >
            <Icon name={entry.icon} />
            <span>{t(entry.labelKey)}</span>
            {entry.to === '/sections' && catalogue ? (
              <span className="rail-badge">{catalogue.sections.length}</span>
            ) : null}
          </Link>
        ),
      )}

      {/* The rail had ~500px of dead space below the nav; this readout uses it and
          keeps the number in view on every screen, not only Home. */}
      <div className="rail-foot">
        <span className="caps ink-3">{t('home.reclaimable')}</span>
        <span className="num t-md wide accent-ink">{reclaimable}</span>
        <span className="t-xs ink-3">{t('home.acrossSections', { count: sectionCount })}</span>
      </div>
    </nav>
  );
}

function StatusBar({ note }: { note?: string }) {
  const { t } = useTranslation();
  const version = useStore((s) => s.engineVersion);
  return (
    <footer className="statusbar">
      <span className="dot" aria-hidden="true" />
      <span>{t('app.engine', { version: version || '-' })}</span>
      {note ? <span className="only-wide">{note}</span> : null}
    </footer>
  );
}

export function Shell({ children, statusNote }: { children: React.ReactNode; statusNote?: string }) {
  const [themeOpen, setThemeOpen] = useState(false);
  return (
    <div className="app">
      <Titlebar onOpenTheme={() => { setThemeOpen(true); }} />
      <div className="shell">
        <Rail />
        <main className="content">{children}</main>
      </div>
      <StatusBar {...(statusNote ? { note: statusNote } : {})} />
      <ThemePanel open={themeOpen} onClose={() => { setThemeOpen(false); }} />
    </div>
  );
}
