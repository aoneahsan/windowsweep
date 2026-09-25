/**
 * The two moments the store tells sync about - a settings change and a finished run
 * - and nothing heavier.
 *
 * 🔴 BOOT-SAFE BY CONSTRUCTION. `state/store.ts` imports this at boot, so it imports
 * only the build's configuration and the local records. The Supabase client, and
 * every module that uses it, is reached through a DYNAMIC import - only in a build
 * that has the keys, and only once something has actually happened. A build without
 * keys never loads any of it. (`lib/engine.ts` -> `devEngine` records why a static
 * import behind a condition would not have been enough.)
 *
 * 🔴 Neither function can fail its caller. When the store calls here the run has
 * already finished and been recorded; sync is what follows a run, never a condition
 * of one.
 */

import type { RunSummary } from './cli';
import type { HistoryEntry } from '../state/store';
import { configuredFeatures } from './config';
import { writeSettingsStamp } from './sync-local';

/** How many `applyQuietly` calls are in progress. */
let quiet = 0;

/**
 * Apply settings that came FROM the account through the store's own actions, without
 * those writes reading as a change made here - or every sign-in would re-date the
 * other machine's choice to now and send it straight back as this one's.
 */
export function applyQuietly(apply: () => void): void {
  quiet += 1;
  try {
    apply();
  } finally {
    quiet -= 1;
  }
}

/** A setting changed on this machine: date the change, and hand it on if this build syncs. */
export function noteSettingsChanged(): void {
  if (quiet > 0) return;
  writeSettingsStamp(new Date().toISOString());
  if (!configuredFeatures().sync) return;
  void import('./sync-session').then(
    (session) => session.settingsChanged(),
    () => undefined, // the chunk did not load: nothing syncs, and nothing else is touched
  );
}

/** A run finished and History recorded it - a real run or a dry-run, never a scan. */
export function noteRunFinished(summary: RunSummary, entry: HistoryEntry): void {
  if (!configuredFeatures().sync) return;
  void import('./sync-session').then(
    (session) => session.runFinished(summary, entry),
    () => undefined,
  );
}
