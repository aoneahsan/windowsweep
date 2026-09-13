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
 * and a scan is a measurement rather than a run (`lib/history-rows.ts`). It is drawn
 * twenty rows at a time from that local list; the rows of other machines arrive with
 * cloud sync, which the `Other machines` chip says plainly is not in this build.
 */

import { useMemo, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

import { useStore } from '../state/store';
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

  const runs = useMemo(() => cleanupRuns(history), [history]);
  const rows = useMemo(() => rowsFor(runs, filter), [runs, filter]);
  const totals = freedTotal(rows);
  const visible = rows.slice(0, page * HISTORY_PAGE_SIZE);

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

  return (
    <>
      <HistoryHeader freedBytes={totals.bytes} runs={totals.runs} />
      <FreedPerRun runs={runs} />
      <HistoryShow filter={filter} onChoose={(f) => { go({ filter: f, page: 1 }); }} />

      <section className="band band-app band-tight">
        <div className="wrap">
          <HistoryTable rows={visible} filter={filter} hasRuns={runs.length > 0} now={now} />
          <HistoryPager
            shown={visible.length}
            total={rows.length}
            onMore={() => { go({ filter, page: page + 1 }); }}
          />
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
