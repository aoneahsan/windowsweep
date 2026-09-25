/**
 * The run summaries this account holds - `account.html`'s `[data-ws-cloud-runs]` and
 * `page-account.js` -> `runs()` (TASK-013; the dummy was amended first, 2026-09-24 and
 * 2026-09-25).
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
 * 🔴 THREE STATES ONCE THE FIRST READ ANSWERS, never one `null` for all of them: the
 * rows, under the line that says what Remove does before it is pressed (SY-06); the
 * empty line when the account holds nothing, the moment after the last Remove included
 * (SY-01); the failed read (SY-02c), in the table's place - read again the next time
 * this screen opens, because the list is read whenever it mounts. While the first read
 * is in flight nothing is drawn: the dummy has no words for it, and it is a moment.
 *
 * 🔴 REMOVE ANSWERS AT ITS CONTROL: pending while the delete is in flight, then the
 * row goes and the polite count beside *Load 20 more* changes. A Remove the account did
 * not confirm leaves the row where it is, with a line under it that interrupts - the
 * person has just acted (SY-02d) - and it goes with that row's next press. Nothing is
 * queued (D39). Focus never drops to the top of the page: it moves to the row that took
 * this one's place, or to the band's heading when none are left.
 */

import { Fragment, useEffect, useId, useRef, useState } from 'react';
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

interface Ready {
  status: 'ready';
  rows: SyncedRun[];
  /** The database's count from the first page, less what was removed here since. */
  total: number;
  /** Where the next page starts, or null when the last one was short. */
  cursor: string | null;
  pages: number;
}

/** The first read answered: the rows, or a first page that could not be read. */
type Loaded = Ready | { status: 'failed' };

/** Read `?page=`: how many pages of twenty are drawn. Anything unusable is the first. */
function parsePages(raw: unknown): number {
  const value = typeof raw === 'string' ? Number(raw) : raw;
  if (typeof value !== 'number' || !Number.isFinite(value)) return 1;
  return Math.min(MAX_PAGES, Math.max(1, Math.floor(value)));
}

/** The first `pages` pages, in order. A later page that fails keeps what was read; a first that fails is `failed`. */
async function readPages(uid: string, pages: number): Promise<Loaded> {
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
    /* logged by `fetchRuns`; what was read stands */
  }
  return total === null ? { status: 'failed' } : { status: 'ready', rows, total, cursor, pages: read };
}

/** The line under a row whose Remove the account did not confirm (SY-02d). */
function RemoveFailedRow() {
  const { t } = useTranslation();
  return (
    <tr>
      <td colSpan={5}>
        <div className="note note-warn" role="alert">
          <span aria-hidden="true">!</span>
          <span className="t-sm">{t('account.sync.failed.remove')}</span>
        </div>
      </td>
    </tr>
  );
}

export function CloudRuns({ user, onEmptied }: { user: AuthUser; onEmptied: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search: { page?: unknown } = useSearch({ strict: false });
  /* Read once: after this, the pages drawn only grow, and this list writes them back itself. */
  const [wanted] = useState(() => parsePages(search.page));
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [more, setMore] = useState<'idle' | 'pending' | 'failed'>('idle');
  const [removing, setRemoving] = useState<ReadonlySet<string>>(() => new Set());
  const [unconfirmed, setUnconfirmed] = useState<ReadonlySet<string>>(() => new Set());
  /* The relative days are read against one clock per visit, as History reads them. */
  const [now] = useState(() => Date.now());
  const baseId = useId();
  const countId = `${baseId}-count`;
  const noteId = `${baseId}-note`;
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

  if (!loaded) return null;

  const heading = <h3 className="t-base wide">{t('account.runs.title')}</h3>;

  if (loaded.status === 'failed') {
    return (
      <div style={{ marginTop: 'var(--sp-5)' }}>
        {heading}
        <div className="note note-warn" role="status" style={{ marginTop: 'var(--sp-3)' }}>
          <span aria-hidden="true">!</span>
          <span className="t-sm">{t('account.sync.failed.list')}</span>
        </div>
      </div>
    );
  }

  if (loaded.rows.length === 0 && loaded.total === 0) {
    return (
      <div style={{ marginTop: 'var(--sp-5)' }}>
        {heading}
        <div className="panel pad" style={{ marginTop: 'var(--sp-3)' }}>
          <p className="t-sm ink-3">{t('account.runs.empty')}</p>
        </div>
      </div>
    );
  }

  const list = loaded;
  const exhausted = list.cursor === null || list.rows.length >= list.total;

  function onMore() {
    if (more === 'pending' || exhausted) return;
    const drawn = list.pages;
    setMore('pending');
    void fetchRuns(user.uid, list.cursor ?? undefined)
      .then((page) => {
        setLoaded((prev) =>
          prev?.status === 'ready'
            ? { ...prev, rows: [...prev.rows, ...page.runs], cursor: page.nextCursor, pages: prev.pages + 1 }
            : prev,
        );
        setMore('idle');
        void navigate({ to: '/account', search: { page: drawn + 1 }, replace: true });
      })
      /* logged by `fetchRuns`: the rows stay as they were, the line says so, and the
         next press reads again */
      .catch(() => { setMore('failed'); });
  }

  function forget(set: ReadonlySet<string>, runId: string): ReadonlySet<string> {
    if (!set.has(runId)) return set;
    const next = new Set(set);
    next.delete(runId);
    return next;
  }

  function onRemove(run: SyncedRun, index: number) {
    if (removing.has(run.runId)) return;
    /* the line under this row goes with its next press */
    setUnconfirmed((prev) => forget(prev, run.runId));
    setRemoving((prev) => new Set(prev).add(run.runId));
    void removeCloudRun(user, run.runId)
      .then(() => {
        const button = bodyRef.current?.querySelector(`button[data-run="${run.runId}"]`);
        if (button && button === document.activeElement) focusAtRef.current = index;
        setLoaded((prev) =>
          prev?.status === 'ready'
            ? { ...prev, rows: prev.rows.filter((r) => r.runId !== run.runId), total: Math.max(0, prev.total - 1) }
            : prev,
        );
      })
      /* still stored, so the row stays exactly where it is - and says so under it */
      .catch(() => { setUnconfirmed((prev) => new Set(prev).add(run.runId)); })
      .finally(() => { setRemoving((prev) => forget(prev, run.runId)); });
  }

  return (
    <div style={{ marginTop: 'var(--sp-5)' }}>
      {heading}
      {/* SY-06: said before the first Remove is pressed, and only while there is one. */}
      {list.rows.length > 0 ? (
        <p className="t-sm ink-3" id={noteId} style={{ marginTop: 'var(--sp-2)' }}>
          {t('account.runs.removeNote')}
        </p>
      ) : null}
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
              {list.rows.map((run, i) => {
                const whenId = `${baseId}-${run.runId}`;
                return (
                  <Fragment key={run.runId}>
                    <tr>
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
                        {/* Identical names, told apart by the row's own When, and every one
                            told what it does by SY-06 above the table. */}
                        <button
                          className="btn btn-sm btn-ghost"
                          type="button"
                          data-run={run.runId}
                          aria-describedby={`${whenId} ${noteId}`}
                          onClick={() => { onRemove(run, i); }}
                          {...controlState(stateOf(removing.has(run.runId)))}
                        >
                          <span className="btn-label">{t('account.runs.remove')}</span>
                        </button>
                      </td>
                    </tr>
                    {unconfirmed.has(run.runId) ? <RemoveFailedRow /> : null}
                  </Fragment>
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
          {...controlState(stateOf(more === 'pending'))}
        >
          <span className="btn-label">{t('history.loadMore', { count: RUNS_PAGE_SIZE })}</span>
        </button>
        <span className="t-xs ink-3" id={countId} role="status">
          <Trans
            i18nKey="history.showing"
            values={{ shown: list.rows.length, total: list.total }}
            components={{ 1: <span className="num" />, 3: <span className="num" /> }}
          />
        </span>
        {/* SY-02c, a later page: beside the button, whose count stays. It interrupts,
            because the person has just pressed. */}
        {more === 'failed' ? (
          <span className="t-sm" role="alert" style={{ marginInlineStart: 'var(--sp-2)' }}>
            {t('account.sync.failed.listMore')}
          </span>
        ) : null}
      </div>
    </div>
  );
}
