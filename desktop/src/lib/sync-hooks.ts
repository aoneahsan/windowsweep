/**
 * The moments the store tells sync about - a settings change, a finished run - and
 * nothing heavier.
 *
 * 🔴 BOOT-SAFE BY CONSTRUCTION. `state/store.ts` imports this at boot, so it imports
 * only the build's configuration, the local records, the sync status store (zustand,
 * already loaded by the store itself) and the logger. The Supabase client, and every
 * module that uses it, is reached through a DYNAMIC import - only in a build that has
 * the keys, and only once something has actually happened. A build without keys never
 * loads any of it. (`lib/engine.ts` -> `devEngine` records why a static import behind
 * a condition would not have been enough.)
 *
 * 🔴 None of these can fail its caller. When the store calls here the run has already
 * finished and been recorded; sync is what follows a run, never a condition of one.
 *
 * 🔴 A CHANGE MADE HERE ENDS THE REPLACEMENT NOTICE (D40), and it ends it in the same
 * frame as the change - the Sync band's Settings row and Home's line say "until you
 * change a setting here", and a notice outliving the change it describes would be the
 * sentence going false while it is on screen. That includes the three settings that
 * stay on this machine (`noteLocalSettingChanged`): they do not sync, but they are
 * settings, and the line names no exception.
 */

import type { RunSummary } from './cli';
import type { HistoryEntry } from '../state/store';
import { configuredFeatures } from './config';
import { errorText, logger } from './logger';
import { writeSettingsStamp } from './sync-local';
import { useSyncStatus } from './sync-state';

/** How many `applyQuietly` calls are in progress. */
let quiet = 0;

/**
 * Apply settings that came FROM the account through the store's own actions, without
 * those writes reading as a change made here - or every sign-in would re-date the
 * other machine's choice to now and send it straight back as this one's, and end the
 * very notice that says it happened.
 */
export function applyQuietly(apply: () => void): void {
  quiet += 1;
  try {
    apply();
  } finally {
    quiet -= 1;
  }
}

/** The sync session's chunk did not load: nothing syncs, nothing else is touched, and the log says so. */
function chunkFailed(error: unknown): void {
  logger.warn('sync: the sync module did not load', { step: 'load', error: errorText(error) });
}

/** A synced setting changed on this machine: date the change, end any notice, and hand it on if this build syncs. */
export function noteSettingsChanged(): void {
  if (quiet > 0) return;
  writeSettingsStamp(new Date().toISOString());
  useSyncStatus.getState().endReplacement();
  if (!configuredFeatures().sync) return;
  void import('./sync-session').then((session) => session.settingsChanged(), chunkFailed);
}

/**
 * The idle window, the temp window or the large-file threshold changed. They stay on
 * this machine and are never sent, but a change to one still ends a standing
 * replacement notice (D40, SY-07's "until you change a setting here").
 */
export function noteLocalSettingChanged(): void {
  useSyncStatus.getState().endReplacement();
}

/** A run finished and History recorded it - a real run or a dry-run, never a scan. */
export function noteRunFinished(summary: RunSummary, entry: HistoryEntry): void {
  if (!configuredFeatures().sync) return;
  void import('./sync-session').then((session) => session.runFinished(summary, entry), chunkFailed);
}
