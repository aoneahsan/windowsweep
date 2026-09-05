/**
 * Sections - the whole catalogue, read from the engine.
 *
 * Translated from `sections.html`. 🔴 Every row comes from `--list --json`; there
 * is no hard-coded list anywhere in this app, so a section added to the engine
 * appears here with no app change. That is the entire reason the flag exists.
 *
 * The filter lives in the URL, not in a bare `useState`, so a filtered view is
 * linkable and the back button works.
 */

import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { PERMANENT_TIERS, RECYCLE_TIERS, type Section } from '../lib/catalogue';

type Filter = 'all' | 'safe' | 'admin' | 'interactive' | 'report';

function matches(section: Section, filter: Filter): boolean {
  switch (filter) {
    case 'safe':
      return section.batch === 'safe' && !section.admin;
    case 'admin':
      return section.admin;
    case 'interactive':
      return section.batch === 'interactive';
    case 'report':
      return section.tier === 'report';
    default:
      return true;
  }
}

const FILTERS: Filter[] = ['all', 'safe', 'admin', 'interactive', 'report'];

export function Sections() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const catalogue = useStore((s) => s.catalogue);
  const developer = useStore((s) => s.developer);
  const search: { filter?: Filter } = useSearch({ strict: false });
  const filter: Filter = FILTERS.includes(search.filter ?? 'all') ? (search.filter ?? 'all') : 'all';

  const rows = (catalogue?.sections ?? [])
    .filter((s) => developer || !s.dev)
    .filter((s) => matches(s, filter));

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <p className="caps ink-3">{t('sections.eyebrow')}</p>
          <h1 className="t-xl wide">{t('sections.title', { count: catalogue?.sections.length ?? 0 })}</h1>
          <p className="lede">{t('sections.lede')}</p>

          <div className="chipfield" style={{ marginTop: 'var(--sp-4)' }}>
            {FILTERS.map((f) => (
              <button
                className="chip"
                type="button"
                key={f}
                aria-pressed={filter === f}
                onClick={() => { void navigate({ to: '/sections', search: { filter: f } }); }}
              >
                {t(`sections.filter.${f}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-well band-tight">
        <div className="wrap">
          <div className="xscroll" style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>{t('sections.colId')}</th>
                  <th>{t('sections.colKey')}</th>
                  <th>{t('sections.colWhat')}</th>
                  <th>{t('sections.colNeeds')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((s) => (
                  <tr key={s.id}>
                    <td className="num">{s.id}</td>
                    <td className="mono">{s.key}</td>
                    <td>
                      {s.title}
                      {PERMANENT_TIERS.has(s.tier) ? (
                        <span className="badge badge-danger" style={{ marginInlineStart: 'var(--sp-2)' }}>
                          {t('sections.permanent')}
                        </span>
                      ) : null}
                      {RECYCLE_TIERS.has(s.tier) ? (
                        <span className="badge badge-outline" style={{ marginInlineStart: 'var(--sp-2)' }}>
                          {t('sections.recycleBin')}
                        </span>
                      ) : null}
                    </td>
                    <td>
                      {s.admin ? <span className="badge badge-danger">{t('sections.admin')}</span> : null}
                      {s.batch === 'interactive' ? (
                        <span className="badge badge-warn">{t('sections.youPick')}</span>
                      ) : null}
                      {s.dev ? <span className="badge badge-outline">{t('sections.developer')}</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 ? <p className="t-sm ink-3">{t('sections.emptyFilter')}</p> : null}
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
