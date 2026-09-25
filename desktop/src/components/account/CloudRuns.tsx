/**
 * The run summaries this account holds - `account.html`'s `[data-ws-cloud-runs]` and
 * `page-account.js` -> `runs()` (TASK-013; the dummy was amended first).
 *
 * Each row is what the account stores and nothing more - the date, dry-run or real
 * run, how many sections, the bytes - drawn the way History draws a cloud row, with
 * the `summary only` label the screen's own "Never stored" sentence promises.
 *
 * 🔴 TWENTY AT A TIME WITH A KEYSET CURSOR, owner-filtered (`lib/sync.ts` ->
 * `fetchRuns`), and the count beside the button is the database's, from the first
 * page. How many pages are drawn lives in the URL (`?page=2`), replaced rather than
 * pushed, so a reload lands where the person was and Back leaves the screen -
 * History's contract.
 *
 * 🔴 REMOVE ANSWERS AT ITS CONTROL: pending while the delete is in flight, then the
 * row goes and the polite count beside *Load 20 more* changes. A failed remove leaves
 * the row where it is, because it is still stored. Focus never drops to the top of
 * the page: it moves to the row that took this one's place, or to the band's heading
 * when none are left.
 *
 * Drawn only when the account holds at least one summary. The dummy has no empty or
 * failed-read line for this list yet, so nothing is invented in their place - both
 * are returned as NEEDS DECISION with TASK-013.
 */

import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Trans, useTranslation } from 'react-i18next';

import type { AuthUser } from '../../lib/auth';
import { controlState, stateOf } from '../../lib/control-state';
import { formatBytes } from '../../lib/format';
import { exactStamp, relativeDay } from '../../lib/history-dates';
import { sectionCountOf } from '../../lib/history-rows';
import { RUNS_PAGE_SIZE, fetchRuns, type SyncedRun } from '../../lib/sync';
import { removeCloudRun } from '../../lib/sync-session';

/** No page count beyond this is honoured from a URL: ten pages, two hundred rows. */
const MAX_PAGES = 10;

interface Loaded {
  rows: SyncedRun[];
  /** The database's count from the first page, less what was removed here since. */
  total: number;
  /** Where the next page starts, or null when the last one was short. */
  cursor: string | null;
  pages: number;
}

/** Read `?page=`: how many pages of twenty are drawn. Anything unusable is the first. */
function parsePages(raw: unknown): number {
  const value = typeof raw === 'string' ? Number(raw) : raw;
  if (typeof value !== 'number' || !Number.isFinite(value)) return 1;
  return Math.min(MAX_PAGES, Math.max(1, Math.floor(value)));
}

/** The first `pages` pages, in order. Null when not even the first could be read. */
async function readPages(uid: string, pages: number): Promise<Loaded | null> {
  const rows: SyncedRun[] = [];
  let total: number | null = null;
  let cursor: string | null = null;
  let read = 0;
  try {
    do {
      const page = await fetchRuns(uid, read === 0 ? undefined : (cursor ?? undefined));
      rows.push(...page.runs);
      total ??= page.total ?? page.runs.length;
      cursor = page.nextCursor;
      read += 1;
    } while (read < pages && cursor !== null);
  } catch {
    /* a later page that fails keeps what was read; a first one that fails leaves nothing */
  }
  return total === null ? null : { rows, total, cursor, pages: read };
}

export function CloudRuns({ user, onEmptied }: { user: AuthUser; onEmptied: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search: { page?: unknown } = useSearch({ strict: false });
  /* Read once: after this, the pages drawn only grow, and this list writes them back itself. */
  const [wanted] = useState(() => parsePages(search.page));
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [more, setMore] = useState(false);
  const [removing, setRemoving] = useState<ReadonlySet<string>>(() => new Set());
  /* The relative days are read against one clock per visit, as History reads them. */
  const [now] = useState(() => Date.now());
  const baseId = useId();
  const countId = `${baseId}-count`;
  const bodyRef = useRef<HTMLTableSectionElement>(null);
  /** The row index a finished Remove leaves focus at, when that Remove held it. */
  const focusAtRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void readPages(user.uid, wanted).then((result) => {
      if (!cancelled) setLoaded(result);
    });
    return () => {
      cancelled = true;
    };
  }, [user.uid, wanted]);

  useEffect(() => {
    const index = focusAtRef.current;
    if (index === null || !loaded) return;
    focusAtRef.current = null;
    const buttons = bodyRef.current?.querySelectorAll<HTMLButtonElement>('button[data-run]');
    const next = buttons ? buttons[Math.min(index, buttons.length - 1)] : undefined;
    if (next) next.focus();
    else onEmptied();
  }, [loaded, onEmptied]);

  if (!loaded || (loaded.rows.length === 0 && loaded.total === 0)) return null;

  const exhausted = loaded.cursor === null || loaded.rows.length >= loaded.total;

  function onMore() {
    if (!loaded || more || exhausted) return;
    const drawn = loaded.pages;
    setMore(true);
    void fetchRuns(user.uid, loaded.cursor ?? undefined)
      .then((page) => {
        setLoaded((prev) =>
          prev && { rows: [...prev.rows, ...page.runs], total: prev.total, cursor: page.nextCursor, pages: prev.pages + 1 },
        );
        void navigate({ to: '/account', search: { page: drawn + 1 }, replace: true });
      })
      .catch(() => undefined) // the rows stay as they were; the next press reads again
      .finally(() => {
        setMore(false);
      });
  }

  function onRemove(run: SyncedRun, index: number) {
    if (removing.has(run.runId)) return;
    setRemoving((prev) => new Set(prev).add(run.runId));
    void removeCloudRun(user, run.runId)
      .then(() => {
        const button = bodyRef.current?.querySelector(`button[data-run="${run.runId}"]`);
        if (button && button === document.activeElement) focusAtRef.current = index;
        setLoaded((prev) =>
          prev && {
            ...prev,
            rows: prev.rows.filter((r) => r.runId !== run.runId),
            total: Math.max(0, prev.total - 1),
          },
        );
      })
      .catch(() => undefined) // still stored, so the row stays exactly where it is
      .finally(() => {
        setRemoving((prev) => {
          const next = new Set(prev);
          next.delete(run.runId);
          return next;
        });
      });
  }

  return (
    <div style={{ marginTop: 'var(--sp-5)' }}>
      <h3 className="t-base wide">{t('account.runs.title')}</h3>
      <div className="panel hist-table" style={{ marginTop: 'var(--sp-3)' }}>
        <div className="xscroll">
          <table className="tbl">
            <thead>
              <tr>
                <th className="hist-col-when">{t('history.colWhen')}</th>
                <th className="hist-col-mode">{t('history.colMode')}</th>
                <th>{t('history.colSections')}</th>
                <th className="num-cell hist-col-freed">{t('history.colFreed')}</th>
                <th>
                  <span className="visually-hidden">{t('account.runs.remove')}</span>
                </th>
              </tr>
            </thead>
            <tbody ref={bodyRef}>
              {loaded.rows.map((run, i) => {
                const whenId = `${baseId}-${run.runId}`;
                return (
                  <tr key={run.runId}>
                    <td id={whenId}>
                      <div className="t-sm">{relativeDay(run.startedAt, now)}</div>
                      <div className="t-xs ink-3">{exactStamp(run.startedAt)}</div>
                    </td>
                    <td>
                      <span className={run.dryRun ? 'badge badge-outline' : 'badge badge-neutral'}>
                        {t(run.dryRun ? 'history.dryRun' : 'history.realRun')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                        <span className="t-sm ink-3">
                          {t('history.sections', { count: sectionCountOf(run.sections) })}
                        </span>
                        <span className="badge badge-outline">{t('account.runs.summaryOnly')}</span>
                      </div>
                    </td>
                    {/* A dry-run's figure is its estimate, without the accent - History's rule. */}
                    <td className={run.dryRun ? 'num-cell t-sm' : 'num-cell t-sm accent-ink'}>
                      {formatBytes(run.dryRun ? run.estimatedBytes : run.freedBytes)}
                    </td>
                    <td>
                      {/* Identical names, told apart by the row's own When. */}
                      <button
                        className="btn btn-sm btn-ghost"
                        type="button"
                        data-run={run.runId}
                        aria-describedby={whenId}
                        onClick={() => { onRemove(run, i); }}
                        {...controlState(stateOf(removing.has(run.runId)))}
                      >
                        <span className="btn-label">{t('account.runs.remove')}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* `aria-disabled`, not `disabled`, once every row is drawn - HistoryPager's reason:
          the press that finishes the list must not drop the focus it holds. */}
      <div className="pager hist-pager">
        <button
          className="btn btn-sm"
          type="button"
          aria-disabled={exhausted || undefined}
          data-disabled={exhausted ? '' : undefined}
          aria-describedby={countId}
          onClick={exhausted ? undefined : onMore}
          {...controlState(stateOf(more))}
        >
          <span className="btn-label">{t('history.loadMore', { count: RUNS_PAGE_SIZE })}</span>
        </button>
        <span className="t-xs ink-3" id={countId} role="status">
          <Trans
            i18nKey="history.showing"
            values={{ shown: loaded.rows.length, total: loaded.total }}
            components={{ 1: <span className="num" />, 3: <span className="num" /> }}
          />
        </span>
      </div>
    </div>
  );
}
