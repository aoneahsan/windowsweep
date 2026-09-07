/**
 * Sections - the whole catalogue, read from the engine.
 *
 * Translated from `sections.html`. 🔴 Every row comes from `--list --json`; there
 * is no hard-coded list anywhere in this app, so a section added to the engine
 * appears here with no app change. That is the entire reason the flag exists.
 *
 * The filter and the search live in the URL, not in a bare `useState`, so a
 * filtered view is linkable and the back button works.
 *
 * 🔴 THE DUMMY'S TIER VOCABULARY IS THE VOCABULARY. The app had substituted
 * `Everything` / `Needs administrator` / `You pick` for the dummy's `All 26` /
 * `Needs admin` / `Needs a person` and dropped `Deep`, `Developer` and the search
 * box entirely. The substitution was the defect, not the labels: the dummy owns
 * the words. `All {{count}}` is the one live number - the count comes from the
 * catalogue, inside the dummy's own sentence, so a 27th section moves it.
 *
 * 🔴 Every section is listed whatever developer mode says, because the dummy's
 * own header promises all of them and gives `Developer` its own filter and its
 * own `dev` badge. Developer mode decides what a RUN touches, not what the
 * catalogue admits to having.
 */

import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import type { Catalogue, Section } from '../lib/catalogue';
import { newRunId, run, safeBatchArgs } from '../lib/engine';
import { formatBytes } from '../lib/format';
import { SectionsTable } from '../components/SectionsTable';
import { SectionSelbar } from '../components/SectionSelbar';

type Filter = 'all' | 'safe' | 'interactive' | 'admin' | 'deep' | 'report' | 'dev';

/** `sections.html:46-52`, in the dummy's own order. */
const FILTERS: Filter[] = ['all', 'safe', 'interactive', 'admin', 'deep', 'report', 'dev'];

function matches(section: Section, filter: Filter, catalogue: Catalogue): boolean {
  switch (filter) {
    case 'safe':
      return catalogue.safe_batch.includes(section.id) || catalogue.safe_batch_admin.includes(section.id);
    case 'interactive':
      return section.batch === 'interactive';
    case 'admin':
      return section.admin;
    case 'deep':
      return section.batch === 'deep';
    case 'report':
      return section.tier === 'report';
    case 'dev':
      return section.dev;
    default:
      return true;
  }
}

export function Sections() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const catalogue = useStore((s) => s.catalogue);
  const developer = useStore((s) => s.developer);
  const scanTargets = useStore((s) => s.scanTargets);
  const selection = useStore((s) => s.sectionSelection);
  const toggleSectionSelection = useStore((s) => s.toggleSectionSelection);
  const setSectionSelection = useStore((s) => s.setSectionSelection);
  const startRun = useStore((s) => s.startRun);
  const appendLog = useStore((s) => s.appendLog);
  const applyProgress = useStore((s) => s.applyProgress);
  const finishRun = useStore((s) => s.finishRun);

  const search: { filter?: Filter; q?: string } = useSearch({ strict: false });
  const filter: Filter = FILTERS.includes(search.filter ?? 'all') ? (search.filter ?? 'all') : 'all';
  const query = (search.q ?? '').trim().toLowerCase();

  const [busy, setBusy] = useState<'dry' | 'run' | null>(null);
  const [blocked, setBlocked] = useState<string | null>(null);

  /* Memoised because `go` closes over it: a fresh array literal every render
     makes the callback's dependency list change every render too. */
  const all = useMemo(() => catalogue?.sections ?? [], [catalogue]);
  const rows = catalogue
    ? all
        .filter((s) => matches(s, filter, catalogue))
        .filter((s) => {
          if (!query) return true;
          return `${s.key} ${s.title} ${String(s.id)}`.toLowerCase().includes(query);
        })
    : [];

  const bytesOf = useCallback(
    (id: number): number | null => {
      const targets = scanTargets.filter((x) => x.section === id);
      if (targets.length === 0) return null;
      return targets.reduce((sum, x) => sum + x.bytes, 0);
    },
    [scanTargets],
  );

  const total = useMemo(
    () => scanTargets.reduce((sum, x) => sum + x.bytes, 0),
    [scanTargets],
  );

  /* One place starts a run, so the two buttons cannot disagree about the flags. */
  const go = useCallback(
    (dryRun: boolean) => {
      if (!dryRun) {
        const interactive = all.filter((s) => selection.includes(s.id) && s.batch === 'interactive');
        if (interactive.length > 0) {
          setBlocked(t('sections.selBlocked', { ids: interactive.map((s) => s.id).join(', ') }));
          return;
        }
      }
      setBlocked(null);
      setBusy(dryRun ? 'dry' : 'run');
      const id = newRunId();
      startRun(id);
      void navigate({ to: '/run' });
      void run(safeBatchArgs({ dryRun, developer, sections: selection }), id, {
        onLog: appendLog,
        onProgress: (section, event, status, freedBytes) => {
          applyProgress({
            section,
            event,
            ...(status ? { status } : {}),
            ...(freedBytes !== undefined ? { freedBytes } : {}),
          });
        },
      })
        .then((r) => { finishRun(r.summary, r.exitCode > 1); })
        .catch((e: unknown) => {
          appendLog(e instanceof Error ? e.message : String(e));
          finishRun(null, true);
        })
        .finally(() => { setBusy(null); });
    },
    /* The two setState functions are stable, so listing them costs nothing and
       is what the React Compiler infers - a mismatch there disables optimisation
       for the whole component. */
    [all, selection, t, startRun, navigate, developer, appendLog, applyProgress,
      finishRun, setBusy, setBlocked],
  );

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-4)', alignItems: 'flex-end' }}>
            <div>
              <p className="caps ink-3">{t('sections.eyebrow')}</p>
              <h1 className="t-xl wide">{t('sections.title')}</h1>
              <p className="t-sm ink-3">{t('sections.lede')}</p>
            </div>
            <div style={{ marginInlineStart: 'auto', textAlign: 'end' }}>
              <p className="num t-xl wide accent-ink">
                {scanTargets.length === 0 ? t('sections.totalUnmeasured') : formatBytes(total)}
              </p>
              <p className="t-sm ink-3">{t('sections.totalNote')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="band band-well band-tight" style={{ position: 'sticky', top: 0, zIndex: 4 }}>
        <div className="wrap">
          {/* 🔴 `fchip` inside `filters`, which is what the dummy uses here.
              `chip`/`chipfield` is its protected-PATH token: it has NO pressed
              state, so the active filter was indistinguishable from the others,
              and its hover turns danger-red - reading as "press to remove" on a
              control that selects. The class was the whole defect. */}
          <div className="filters">
            <span className="caps ink-3" style={{ marginInlineEnd: 'var(--sp-2)' }}>
              {t('sections.show')}
            </span>
            {FILTERS.map((f) => (
              <button
                className="fchip"
                type="button"
                key={f}
                aria-pressed={filter === f}
                onClick={() => { void navigate({ to: '/sections', search: { filter: f, q: search.q } }); }}
              >
                {f === 'all' ? t('sections.filter.all', { count: all.length }) : t(`sections.filter.${f}`)}
              </button>
            ))}
            <input
              className="field"
              type="search"
              placeholder={t('sections.searchPlaceholder')}
              value={search.q ?? ''}
              style={{ maxWidth: '16rem', marginInlineStart: 'auto' }}
              /* 🔴 `replace`, or every keystroke becomes a history entry and the
                 back button walks the search box backwards one character at a
                 time. The filter chips push properly; typing does not. */
              onChange={(e) => {
                void navigate({
                  to: '/sections',
                  search: { filter, q: e.target.value },
                  replace: true,
                });
              }}
            />
          </div>
        </div>
      </section>

      <section className="band band-app band-tight">
        <div className="wrap">
          <div className="panel" style={{ overflow: 'visible' }}>
            <div className="xscroll" style={{ overflowX: 'auto' }}>
              <SectionsTable
                rows={rows}
                scanTargets={scanTargets}
                selection={selection}
                onToggleSelect={toggleSectionSelection}
              />
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="panel pad" style={{ marginTop: 'var(--sp-4)', textAlign: 'center' }}>
              <p className="t-md wide">{t('sections.emptyTitle')}</p>
              <p className="t-xs ink-3">{t('sections.emptyBody', { count: all.length })}</p>
            </div>
          ) : null}

          <details className="disclose" style={{ marginTop: 'var(--sp-4)' }}>
            <summary>
              <span className="disclose-line">{t('sections.policySummary')}</span>
              <span className="disclose-more">{t('consent.detailsMore')}</span>
            </summary>
            <div className="disclose-body">
              {/* The four policy names are emphasised inside one sentence, so the
                  markup lives in the catalogue value where a translator can move
                  it - the same form `consent.lede` uses. */}
              <p>
                <Trans
                  i18nKey="sections.policyBody"
                  components={{ 1: <strong />, 3: <strong />, 5: <strong />, 7: <strong /> }}
                />
              </p>
            </div>
          </details>
        </div>
      </section>

      <SectionSelbar
        selection={selection}
        sections={all}
        bytesOf={bytesOf}
        busy={busy}
        blocked={blocked}
        onClear={() => { setSectionSelection([]); setBlocked(null); }}
        onDryRun={() => { go(true); }}
        onRun={() => { go(false); }}
      />

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
