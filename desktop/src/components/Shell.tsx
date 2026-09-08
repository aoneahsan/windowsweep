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
import { Link, useRouterState, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
/* 🔴 `getCurrentWindow` is imported lazily, inside the handler. Calling it during
   render reads `window.__TAURI_INTERNALS__`, which does not exist outside a Tauri
   window - so every screen that renders this title bar threw, while Splash and
   Consent (which do not) were fine. A browser pass found it; no static gate could,
   because the call is perfectly typed and the module resolves. A title bar has no
   reason to resolve the window object before someone presses one of its buttons. */

import { Icon, type IconName } from './Icon';
import { ThemePanel } from './ThemePanel';
import { useIncludedScanTargets, useRunPreferences, useStore } from '../state/store';
import { reclaimableBytes, reclaimableSectionCount } from '../lib/reclaim';
import { formatBytes } from '../lib/format';
import { logDirectory } from '../lib/cli';
import { commandLine, safeBatchArgs } from '../lib/engine';
import { filterSections, SECTION_FILTERS, type SectionFilter } from '../lib/catalogue';

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

type WindowAction = 'minimize' | 'toggleMaximize' | 'close';

async function windowAction(action: WindowAction): Promise<void> {
  try {
    const { getCurrentWindow } = await import('@tauri-apps/api/window');
    const win = getCurrentWindow();
    if (action === 'minimize') await win.minimize();
    else if (action === 'toggleMaximize') await win.toggleMaximize();
    else await win.close();
  } catch {
    /* No Tauri window - a development build in an ordinary browser. The buttons
       are inert there rather than throwing, which is the honest behaviour: there
       is no window for them to act on. */
  }
}

/**
 * 🔴 The classes here are the dummy's, and that is not cosmetic. The first
 * translation invented `tb-name`, `tb-spacer`, `tb-btn` and `tb-close`, none of
 * which exists in `shell.css` - so all four controls had no hover, no press and no
 * close-red, and the whole title bar was four dead-looking buttons. `tb-title`,
 * `wincontrols`, `wc` and `wc-close` are the real vocabulary.
 *
 * 🔴 `tb-interactive` is `-webkit-app-region: no-drag`. The title bar itself is
 * the drag region, so a control inside it WITHOUT that class can be swallowed by
 * the drag in a real window - a button that looks live and never fires.
 */
/**
 * The wordmark's sweep, transcribed from `app.js`'s title-bar builder. Decorative,
 * so it is `aria-hidden`; the name beside it is the accessible one.
 */
function TitleMark() {
  return (
    <svg className="tb-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 17c4.5 0 5-9 10-9s5.5 6 10 6"
        stroke="var(--c-accent)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M2 21c4.5 0 5-6 10-6s5.5 4 10 4"
        stroke="var(--c-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  );
}

function Titlebar({ onOpenTheme }: { onOpenTheme: () => void }) {
  const { t } = useTranslation();
  const version = useStore((s) => s.engineVersion);
  return (
    <header className="titlebar" data-tauri-drag-region>
      <TitleMark />
      <span className="tb-title">{t('app.name')}</span>
      {/* The ENGINE's version, which is what the dummy's badge carries - the one
          number a person can check against the command-line tool. */}
      <span className="badge badge-outline mono">{version || '-'}</span>
      <div className="wincontrols tb-interactive">
        <button className="btn btn-ghost btn-sm" type="button" onClick={onOpenTheme} aria-label={t('theme.title')}>
          <Icon name="sun" />
        </button>
      </div>
      <div className="wincontrols tb-interactive">
        <button className="wc" type="button" onClick={() => { void windowAction('minimize'); }} aria-label={t('window.minimise')}>
          <Icon name="min" size={13} />
        </button>
        <button className="wc" type="button" onClick={() => { void windowAction('toggleMaximize'); }} aria-label={t('window.maximise')}>
          <Icon name="max" size={13} />
        </button>
        <button className="wc wc-close" type="button" onClick={() => { void windowAction('close'); }} aria-label={t('window.close')}>
          <Icon name="close" size={13} />
        </button>
      </div>
    </header>
  );
}

function Rail() {
  const { t } = useTranslation();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const summary = useStore((s) => s.summary);
  const catalogue = useStore((s) => s.catalogue);

  /* Read from lib/reclaim.ts, not recomputed. This copy and Home's disagreed with
     the map and the ladder on the same screen: after a scan both showed 0 B. */
  const scanTargets = useIncludedScanTargets();
  const scannedAt = useStore((s) => s.scannedAt);
  const bytes = reclaimableBytes(summary, scanTargets, scannedAt !== null);
  const reclaimable = bytes === null ? '-' : formatBytes(bytes);
  const sectionCount = reclaimableSectionCount(summary, scanTargets, scannedAt !== null);

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

interface StatusNote {
  text: string;
  /** A path or a command line, which the dummy sets in mono and dims to .8. */
  machine?: boolean;
}

/**
 * The status bar's middle slot, which the click dummy gives a different fact on
 * every screen. Three of them are live, so they are derived here rather than
 * passed down: a screen renders INSIDE this shell and cannot hand its chrome a
 * prop.
 *
 *  - Home     `index.html:307` a logs path
 *  - Sections `sections.html:114` `N of 26 shown`
 *  - Run      `run.html:129` the command line this window runs
 *
 * 🔴 Each one calls the same function its screen calls. The count comes from
 * `filterSections`, which is what the Sections table itself renders from, and the
 * command comes from `safeBatchArgs`, which is what the Start button actually
 * runs - a status bar that recomputed either would be free to disagree with the
 * screen above it, which is precisely how `reclaimableBytes` went wrong twice.
 */
function useRouteStatusNote(): StatusNote | null {
  const { t } = useTranslation();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const search: { filter?: SectionFilter; q?: string } = useSearch({ strict: false });
  const summary = useStore((s) => s.summary);
  const catalogue = useStore((s) => s.catalogue);
  const prefs = useRunPreferences();
  /* 🔴 The command line in the status bar claims to be the whole invocation, so it
     carries the exclusions the run carries. Built from `safeBatchArgs`, the same
     function the Start button calls - a status bar that assembled its own flags
     would be free to disagree with the run happening above it. */
  const excludedPaths = useStore((s) => s.excludedPaths);

  if (path === '/') {
    /* 🔴 The engine's own `log_file`, not the command-line tool's fixed folder.
       `run_clean` passes `--logs-dir` per run (`src-tauri/src/engine.rs`), so this
       window's logs are NOT under `~\.windowsweep\logs` and printing that would be
       a path the reader could not find anything at. Before the first run there is
       nothing to point at, and it says so. */
    const dir = logDirectory(summary);
    return dir ? { text: dir, machine: true } : { text: t('app.logsPending') };
  }

  if (path === '/sections') {
    if (!catalogue) return null;
    const filter: SectionFilter = SECTION_FILTERS.includes(search.filter ?? 'all')
      ? (search.filter ?? 'all')
      : 'all';
    return {
      text: t('sections.shownCount', {
        shown: filterSections(catalogue, filter, search.q ?? '').length,
        total: catalogue.sections.length,
      }),
    };
  }

  if (path === '/run') {
    return {
      text: commandLine(safeBatchArgs({ dryRun: false, ...prefs, excludedPaths })),
      machine: true,
    };
  }

  return null;
}

function StatusBar({ note }: { note?: string }) {
  const { t } = useTranslation();
  const version = useStore((s) => s.engineVersion);
  const derived = useRouteStatusNote();
  const shown: StatusNote | null = note ? { text: note } : derived;
  return (
    <footer className="statusbar">
      <span className="dot" aria-hidden="true" />
      <span>{t('app.engine', { version: version || '-' })}</span>
      {shown ? (
        <span
          className={shown.machine ? 'only-wide sb-note mono' : 'only-wide sb-note'}
          {...(shown.machine ? { style: { opacity: 0.8 } } : {})}
        >
          {shown.text}
        </span>
      ) : null}
    </footer>
  );
}

/**
 * 🔴 `rail` is how Splash and Consent drop the navigation and keep everything
 * else. They rendered their own bare `.app` + empty `.titlebar` before, which
 * left the theme control - the ONE appearance control, owed on every route at
 * every width - missing on 2 of 11 routes while the dummy carries it on all of
 * them. The rail is what those two screens must not have, because nothing is
 * navigable yet; the title bar and status bar are not.
 */
export function Shell({
  children,
  statusNote,
  rail = true,
}: {
  children: React.ReactNode;
  statusNote?: string;
  rail?: boolean;
}) {
  const [themeOpen, setThemeOpen] = useState(false);
  return (
    <div className="app">
      <Titlebar onOpenTheme={() => { setThemeOpen(true); }} />
      {/* 🔴 `shell-bare` is load-bearing, not cosmetic. `.shell` is a two-column
          grid whose first column is `auto`, which sizes to MAX-CONTENT - with the
          rail gone, the content column collapses to the width of its widest line
          and every band's background stops there. It is visible in the dummy's own
          splash and consent pages, where the band ends mid-window. */}
      <div className={rail ? 'shell' : 'shell shell-bare'}>
        {rail ? <Rail /> : null}
        <main className="content">{children}</main>
      </div>
      <StatusBar {...(statusNote ? { note: statusNote } : {})} />
      <ThemePanel open={themeOpen} onClose={() => { setThemeOpen(false); }} />
    </div>
  );
}
