/**
 * History's rows from OTHER machines - the account's run summaries this window did not
 * make - and how they merge with this window's own (TASK-013, `page-history.js`).
 *
 * 🔴 THE DATABASE DOES THE NARROWING. `fetchRuns` leaves out every run id this window
 * holds (`excluding`) and, on the Dry-runs chip, every real run (`dryRunsOnly`), so the
 * first page's count is the account's own answer for that chip - never a number worked
 * out from rows read (`~/.claude/rules/data-fetch-budget.md`).
 *
 * 🔴 A MERGED LIST SHOWS ONLY WHAT IT CAN ORDER. The account's rows arrive newest first,
 * twenty at a time, keyset on `started_at`. While more pages exist, a local row OLDER
 * than the oldest account row read so far could be outranked by a row not read yet - so
 * it waits (`coveredRows`) instead of being drawn out of order. Everything drawn is then
 * provably the newest rows across both sources, which is what lets the header say
 * "freed in the last N runs" of exactly those rows.
 *
 * 🔴 A FAILED READ IS NOT AN EMPTY ACCOUNT. The first page failing leaves the account's
 * rows unknown: the table heads its list with SY-02c's first line, and on the Other
 * machines chip that line stands alone - an unreadable account must never read as an
 * empty one. It is tried again the next time the screen opens.
 *
 * ⚠️ One stated limit: the account stores no machine id, by design (no machine name is
 * ever synced), so "another machine" means "not in this window's History". A run this
 * machine uploaded that has since aged out of History's 200-run cap reads as another
 * machine's. The alternative - a per-machine id in the schema - is a new stored field,
 * and the Account screen promises the fields it lists are the whole of it.
 */

import { useCallback, useEffect, useState } from 'react';

import type { HistoryEntry } from '../state/store';
import type { HistoryFilter } from './history-rows';
import { fetchRuns, type SyncedRun } from './sync';

/** One row of History's table: this window's own record, or another machine's summary. */
export type HistoryRow =
  | { kind: 'local'; entry: HistoryEntry; at: number }
  | { kind: 'cloud'; run: SyncedRun; at: number };

/** What History has read of the account's rows for the chip in view. */
export interface CloudRows {
  rows: readonly SyncedRun[];
  /** The next page's keyset cursor, or null when every row has been read. */
  cursor: string | null;
  /** The account's own count for this chip, from the first page; null until it answers. */
  total: number | null;
  /** Which read failed: the first page (`list`) or a later one (`listMore`). */
  failed: 'list' | 'listMore' | null;
  /** A read is in flight. */
  loading: boolean;
}

const NONE: CloudRows = { rows: [], cursor: null, total: null, failed: null, loading: false };

/** Whether a chip lists the account's rows at all - every chip but This machine does. */
export function listsAccountRows(filter: HistoryFilter): boolean {
  return filter !== 'thisMachine';
}

/**
 * This window's rows for `filter` merged with the account's, newest first, cut at the
 * oldest account row read while more pages remain (see the module header).
 *
 * @param local - this window's records already narrowed to the chip (`rowsFor`).
 * @param cloud - the account's rows read so far for the chip.
 * @param more - whether the account holds rows not read yet.
 */
export function coveredRows(
  local: readonly HistoryEntry[],
  cloud: readonly SyncedRun[],
  more: boolean
): HistoryRow[] {
  const merged: HistoryRow[] = [
    ...local.map((entry): HistoryRow => ({
      kind: 'local',
      entry,
      at: Date.parse(entry.startedAt),
    })),
    ...cloud.map((run): HistoryRow => ({ kind: 'cloud', run, at: Date.parse(run.startedAt) })),
  ].sort((a, b) => b.at - a.at);
  if (!more || cloud.length === 0) return merged;
  const oldestRead = Math.min(...cloud.map((run) => Date.parse(run.startedAt)));
  return merged.filter((row) => row.at >= oldestRead);
}

/**
 * The account's rows for the chip in view, read when sync is live for `uid`.
 *
 * @param uid - the signed-in account, or null (nothing is read).
 * @param filter - the chip; This machine reads nothing.
 * @param localIds - the run ids this window holds, left out by the database.
 */
export function useCloudRows(
  uid: string | null,
  filter: HistoryFilter,
  localIds: readonly string[]
): CloudRows & { loadMore: () => Promise<void> } {
  /* 🔴 THE RESULT IS KEYED BY ITS REQUEST, so a result for another chip, account or local
     list is never used - and the effect sets state only when a read answers, never as a
     synchronous reset, which would draw one stale frame between chips. */
  const [stored, setStored] = useState<(CloudRows & { key: string }) | null>(null);
  const idsKey = localIds.join(',');
  const key = uid !== null && listsAccountRows(filter) ? `${uid}|${filter}|${idsKey}` : null;

  useEffect(() => {
    if (key === null || uid === null) return;
    let cancelled = false;
    fetchRuns(uid, undefined, {
      excluding: idsKey ? idsKey.split(',') : [],
      dryRunsOnly: filter === 'dryRuns',
    })
      .then((page) => {
        if (!cancelled)
          setStored({
            key,
            rows: page.runs,
            cursor: page.nextCursor,
            total: page.total,
            failed: null,
            loading: false,
          });
      })
      .catch(() => {
        /* logged by `fetchRuns`; the table says it in words */
        if (!cancelled) setStored({ key, ...NONE, failed: 'list' });
      });
    return () => {
      cancelled = true;
    };
  }, [key, uid, filter, idsKey]);

  const current = key !== null && stored?.key === key ? stored : null;

  const loadMore = useCallback(async () => {
    if (
      uid === null ||
      key === null ||
      current === null ||
      current.cursor === null ||
      current.loading
    )
      return;
    const cursor = current.cursor;
    const mine = (s: typeof stored) => s !== null && s.key === key;
    setStored((s) => (mine(s) && s ? { ...s, loading: true, failed: null } : s));
    try {
      const page = await fetchRuns(uid, cursor, {
        excluding: idsKey ? idsKey.split(',') : [],
        dryRunsOnly: filter === 'dryRuns',
      });
      setStored((s) =>
        mine(s) && s
          ? { ...s, rows: [...s.rows, ...page.runs], cursor: page.nextCursor, loading: false }
          : s
      );
    } catch {
      /* logged by `fetchRuns`: the rows read stand, and the pager's line says so */
      setStored((s) => (mine(s) && s ? { ...s, loading: false, failed: 'listMore' } : s));
    }
  }, [uid, key, filter, idsKey, current]);

  if (key === null) return { ...NONE, loadMore };
  if (current === null) return { ...NONE, loading: true, loadMore };
  return {
    rows: current.rows,
    cursor: current.cursor,
    total: current.total,
    failed: current.failed,
    loading: current.loading,
    loadMore,
  };
}
