/**
 * History's rows - which records the screen lists, how the `Show` filter narrows
 * them, how many are drawn, and what the header totals. Pure: the screen owns the
 * URL and the words, this module owns the arithmetic.
 *
 * 🔴 A SCAN IS A MEASUREMENT, NOT A RUN, and it is left out here. The store records
 * every summary the engine lands, `--scan` included (`state/store.ts` ->
 * `finishRun`), but a scan deletes nothing and frees nothing: listed, it would put a
 * `0 B` row beside every real run and a dip in *Freed per run* for every press of
 * Scan. The test is `lib/run-mode.ts` -> `isRunRecord`, the one Home's last-runs
 * band uses, so the two lists of runs cannot disagree about what a run is - and the
 * click dummy, which owns this screen, has never drawn a scan row.
 *
 * The mode's WORDS (D-44) are `run-mode.ts` -> `runModeLabel` too, for the same
 * reason: one vocabulary for one fact, on every screen that names a run.
 */

import type { HistoryEntry } from '../state/store';
import { SCAN_PSEUDO_SECTION } from './cli';
import { isRunRecord } from './run-mode';

/** The four chips in the `Show` band, in the dummy's order. The first is the default. */
export const HISTORY_FILTERS = ['all', 'thisMachine', 'otherMachines', 'dryRuns'] as const;
export type HistoryFilter = (typeof HISTORY_FILTERS)[number];

/** The page the dummy promises: twenty at a time, never the whole table. */
export const HISTORY_PAGE_SIZE = 20;

/** No page count beyond this is honoured from a URL; past the list, every row shows anyway. */
const MAX_PAGES = 50;

/** Read the `filter` search param. Anything unknown is the default, not an error. */
export function parseHistoryFilter(raw: unknown): HistoryFilter {
  return HISTORY_FILTERS.find((f) => f === raw) ?? 'all';
}

/**
 * Read the `page` search param - how many pages of twenty are drawn. The router
 * hands a number for `?page=2`; a string or a fraction is read as the nearest
 * whole page, and anything unusable is the first page.
 */
export function parseHistoryPage(raw: unknown): number {
  const value = typeof raw === 'string' ? Number(raw) : raw;
  if (typeof value !== 'number' || !Number.isFinite(value)) return 1;
  return Math.min(MAX_PAGES, Math.max(1, Math.floor(value)));
}

/** The records History lists - real runs and dry-runs, never a scan - newest first. */
export function cleanupRuns(history: readonly HistoryEntry[]): HistoryEntry[] {
  return history.filter(isRunRecord);
}

/**
 * This window's own rows one chip shows.
 *
 * `otherMachines` holds none of them by definition: another machine's rows are the
 * account's, read by `lib/history-cloud.ts` and merged in by the screen (TASK-013).
 */
export function rowsFor(runs: readonly HistoryEntry[], filter: HistoryFilter): HistoryEntry[] {
  if (filter === 'otherMachines') return [];
  if (filter === 'dryRuns') return runs.filter((r) => r.dryRun);
  return [...runs];
}

/**
 * The header's figure: what the REAL runs among `rows` freed, and how many there
 * were. A dry-run deleted nothing, so it adds to neither - the dummy computes the
 * same two numbers over the same filtered list (`page-history.js` -> `paint`).
 */
export function freedTotal(rows: readonly { dryRun: boolean; freedBytes: number }[]): {
  bytes: number;
  runs: number;
} {
  let bytes = 0;
  let runs = 0;
  for (const r of rows) {
    if (r.dryRun) continue;
    bytes += Math.max(0, r.freedBytes);
    runs += 1;
  }
  return { bytes, runs };
}

/** The real runs, OLDEST first - the order *Freed per run* reads left to right. */
export function realRunsOldestFirst(runs: readonly HistoryEntry[]): HistoryEntry[] {
  return runs.filter((r) => !r.dryRun).reverse();
}

/** How many numbered sections a record names - the scan's pseudo-section is not one. */
export function sectionCountOf(ids: readonly number[]): number {
  return new Set(ids.filter((id) => id !== SCAN_PSEUDO_SECTION)).size;
}
