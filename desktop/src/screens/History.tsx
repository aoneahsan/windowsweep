/**
 * History - every run this window has made, newest first. `history.html` +
 * `page-history.js`, band for band (D-41, GATE 4 round 8).
 *
 * Rounds 1-2 closed this screen while it was empty; with data it drew four
 * app-only things the dummy never had and missed most of what the dummy draws. It
 * is now the dummy's frame: the heading with what the real runs freed, *Freed per
 * run*, the sticky `Show` band, the six-column table, and *Load 20 more* with its
 * sentence. The eyebrow, the `Reclaimed` and `Took` columns and the signed-out
 * sentence are gone - the last one also promised that signing in brings other
 * machines' runs, which this build cannot do.
 *
 * 🔴 The filter and the page live in the URL (`?filter=dryRuns&page=2`), replaced
 * rather than pushed, so Back leaves the screen instead of walking every chip; a
 * default is omitted, so `/history` is the unfiltered first page.
 *
 * 🔴 The list is this window's own - `state/store.ts` records a run when it finishes,
 * and a scan is a measurement rather than a run (`lib/history-rows.ts`) - and, while
 * sync is live for a signed-in account, the account's summaries from other machines,
 * read by `lib/history-cloud.ts` and merged newest first (TASK-013). The merge draws
 * only what it can order, so the header's "freed in the last N runs" is true of exactly
 * the rows it sums, and "showing X of Y" counts with the database's own number.
 */

import { useMemo, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { useStore } from '../state/store';
import { configuredFeatures } from '../lib/config';
import { useSyncStatus } from '../lib/sync-state';
import { coveredRows, useCloudRows } from '../lib/history-cloud';
import {
  HISTORY_PAGE_SIZE,
  cleanupRuns,
  freedTotal,
  parseHistoryFilter,
  parseHistoryPage,
  rowsFor,
  type HistoryFilter,
} from '../lib/history-rows';
import { HistoryHeader } from '../components/history/HistoryHeader';
import { FreedPerRun } from '../components/history/FreedPerRun';
import { HistoryShow } from '../components/history/HistoryShow';
import { HistoryTable } from '../components/history/HistoryTable';
import { HistoryPager } from '../components/history/HistoryPager';

export function History() {
  const navigate = useNavigate();
  const history = useStore((s) => s.history);
  const search: { filter?: unknown; page?: unknown } = useSearch({ strict: false });
  const filter = parseHistoryFilter(search.filter);
  const page = parseHistoryPage(search.page);

  /* The relative days are read against one clock per visit; nothing here ages
     inside a minute, and a clock read during render would not be pure. */
  const [now] = useState(() => Date.now());

  const user = useStore((s) => s.user);
  const active = useSyncStatus((s) => s.active);
  const live = configuredFeatures().sync && user !== null && active;

  const runs = useMemo(() => cleanupRuns(history), [history]);
  const local = useMemo(() => rowsFor(runs, filter), [runs, filter]);
  const localIds = useMemo(() => runs.map((r) => r.runId), [runs]);
  const cloud = useCloudRows(live && user ? user.uid : null, filter, localIds);
  const more = cloud.cursor !== null;
  const rows = useMemo(() => coveredRows(local, cloud.rows, more), [local, cloud.rows, more]);
  const totals = freedTotal(rows.map((r) => (r.kind === 'local' ? r.entry : r.run)));
  const visible = rows.slice(0, page * HISTORY_PAGE_SIZE);
  const total = local.length + (cloud.total ?? cloud.rows.length);

  const go = (next: { filter: HistoryFilter; page: number }) => {
    void navigate({
      to: '/history',
      search: {
        ...(next.filter === 'all' ? {} : { filter: next.filter }),
        ...(next.page > 1 ? { page: next.page } : {}),
      },
      replace: true,
    });
  };

  /* The next twenty may need the account's next page first: the merge only draws rows it
     can order, so a page past the covered rows reads more before it can be shown. */
  const onMore = () => {
    if (more && (page + 1) * HISTORY_PAGE_SIZE > rows.length) void cloud.loadMore();
    go({ filter, page: page + 1 });
  };

  return (
    <>
      <HistoryHeader freedBytes={totals.bytes} runs={totals.runs} />
      <FreedPerRun runs={runs} />
      <HistoryShow
        filter={filter}
        onChoose={(f) => {
          go({ filter: f, page: 1 });
        }}
      />

      <section className="band band-app band-tight">
        <div className="wrap">
          <HistoryTable
            rows={visible}
            filter={filter}
            hasRuns={runs.length > 0}
            now={now}
            signedIn={live}
            unread={cloud.failed === 'list'}
          />
          <HistoryPager
            shown={visible.length}
            total={total}
            onMore={onMore}
            pending={cloud.loading && cloud.rows.length > 0}
            failed={cloud.failed === 'listMore'}
          />
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
