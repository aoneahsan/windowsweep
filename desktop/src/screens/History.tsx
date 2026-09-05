/**
 * History - what has run on this machine, newest first.
 *
 * Translated from `history.html`. The Mode column uses the ENGINE's own
 * vocabulary - `safe batch`, `profile: dev`, or an explicit section list - because
 * the five friendly names the dummy used to carry existed nowhere in the engine,
 * which meant a person could not match a row here to anything they could type.
 *
 * 🔴 The filter lives in the URL. Local runs come from this machine's own store;
 * rows from other machines only appear when signed in, and the empty state says
 * which of the two you are looking at rather than showing one blank table.
 */

import { useNavigate, useSearch } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { formatBytes, formatDateTime, formatDuration } from '../lib/format';

type Filter = 'all' | 'thisMachine' | 'dryRuns';
const FILTERS: Filter[] = ['all', 'thisMachine', 'dryRuns'];

export function History() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const history = useStore((s) => s.history);
  const user = useStore((s) => s.user);
  const search: { filter?: Filter } = useSearch({ strict: false });
  const filter: Filter = FILTERS.includes(search.filter ?? 'all') ? (search.filter ?? 'all') : 'all';

  const rows = history.filter((r) => (filter === 'dryRuns' ? r.dryRun : true));

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap">
          <p className="caps ink-3">{t('history.eyebrow')}</p>
          <h1 className="t-xl wide">{t('history.title')}</h1>
          <div className="chipfield" style={{ marginTop: 'var(--sp-4)' }}>
            {FILTERS.map((f) => (
              <button
                className="chip"
                type="button"
                key={f}
                aria-pressed={filter === f}
                onClick={() => { void navigate({ to: '/history', search: { filter: f } }); }}
              >
                {t(`history.filter.${f}`)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-well band-tight">
        <div className="wrap">
          {rows.length === 0 ? (
            <div className="panel pad">
              <p className="t-base">{t('history.emptyTitle')}</p>
              <p className="t-sm ink-3">{t('history.emptyBody')}</p>
            </div>
          ) : (
            <div className="xscroll" style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>{t('history.colWhen')}</th>
                    <th>{t('history.colMode')}</th>
                    <th>{t('history.colSections')}</th>
                    <th>{t('history.colReclaimed')}</th>
                    <th>{t('history.colTook')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.runId}>
                      <td>{formatDateTime(r.startedAt)}</td>
                      <td>
                        {r.mode}
                        {r.dryRun ? (
                          <span className="badge badge-outline" style={{ marginInlineStart: 'var(--sp-2)' }}>
                            {t('history.dryRun')}
                          </span>
                        ) : null}
                        {r.elevated ? (
                          <span className="badge badge-danger" style={{ marginInlineStart: 'var(--sp-2)' }}>
                            {t('sections.admin')}
                          </span>
                        ) : null}
                      </td>
                      <td className="num">{r.sections.length}</td>
                      <td className="num">
                        {formatBytes(r.dryRun ? r.estimatedBytes : r.freedBytes)}
                      </td>
                      <td className="num">{formatDuration(r.durationMs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!user ? (
            <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-3)' }}>
              {t('history.signedOutNote')}
            </p>
          ) : null}
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
