/**
 * The Picker's install mode (sections 30-32, D110), as pure derivations: what the chosen rows add up
 * to, the verb the button takes, the download sentence and the line about rows chosen in the other
 * mode. Transcribed from `picker-install.js` (`tally`, `verb`, `downloadLine`, `kept`).
 *
 * 🔴 These return FACTS, never words. The words live in the catalogue and are chosen in
 * `components/picker-words.ts`, so "Install 2, remove 3" is one translatable sentence per shape and
 * no fragment is ever concatenated. Each fact is read by kind (`lib/candidate-extras.ts`), never by
 * the order of a list.
 *
 * 🔴 Two verbs, never a third (A4-15): no row runs a PC maker's tool. On a ThinkPad its driver-only
 * switch still queued a firmware package, so the engine names that tool and never starts it.
 */

import type { Candidate } from './cli';
import { downloadOf, installVerb, reclaimOf } from './candidate-extras';

/** What a set of chosen install-mode rows adds up to. */
export interface InstallTally {
  count: number;
  install: number;
  remove: number;
  /** Bytes the fetching tools report, summed. */
  knownDownload: number;
  /** 🔴 Rows whose download size no tool reports - counted apart, never as 0 bytes. */
  unknownDownloads: number;
  /** Space the chosen rows free: section 31's old packages, and nothing an install adds. */
  reclaim: number;
  /** The sections the rows belong to, ascending. */
  sections: number[];
  /** Rows of section 30 itself - the Windows updates the bar's first line names. */
  windowsUpdates: number;
  /** Rows Windows Update fetches: section 30's, and 31's driver installs. */
  fetchedByWindowsUpdate: number;
  /** Section 31's driver installs - "Drivers come from Windows Update, one at a time." */
  drivers: number;
  /** Any section 31 row at all, removals included: the firmware and maker-tool lines belong wherever
   *  drivers are chosen. */
  driverRows: number;
  /** Section 32 rows - winget's. */
  winget: number;
}

/** Fold chosen install-mode rows into one tally. */
export function tallyInstall(rows: readonly Candidate[]): InstallTally {
  const tally: InstallTally = {
    count: rows.length,
    install: 0,
    remove: 0,
    knownDownload: 0,
    unknownDownloads: 0,
    reclaim: 0,
    sections: [],
    windowsUpdates: 0,
    fetchedByWindowsUpdate: 0,
    drivers: 0,
    driverRows: 0,
    winget: 0,
  };
  const sections = new Set<number>();
  for (const row of rows) {
    const verb = installVerb(row);
    tally[verb] += 1;
    sections.add(row.section);
    tally.reclaim += reclaimOf(row, true);
    if (row.kind === 'windows-update') tally.windowsUpdates += 1;
    if (row.kind === 'windows-update' || row.kind === 'driver-update') {
      tally.fetchedByWindowsUpdate += 1;
    }
    if (row.kind === 'driver-update') tally.drivers += 1;
    if (row.kind === 'driver-update' || row.kind === 'driver-package') tally.driverRows += 1;
    if (row.kind === 'app-update') tally.winget += 1;
    if (verb !== 'remove') {
      const size = downloadOf(row);
      if (size === null) tally.unknownDownloads += 1;
      else tally.knownDownload += size;
    }
  }
  tally.sections = [...sections].sort((a, b) => a - b);
  return tally;
}

/**
 * The verb the button takes and the confirmation repeats. One kind says it whole; a mixed choice
 * (only section 31 can make one) names both parts with their counts, so the button never says less
 * than the run will do - and never a generic "Apply" that would hide a removal.
 */
export type VerbPhrase =
  | { kind: 'install'; count: number }
  | { kind: 'remove'; count: number }
  | { kind: 'mixed'; install: number; remove: number };

export function verbPhrase(tally: InstallTally): VerbPhrase {
  if (tally.install > 0 && tally.remove > 0) {
    return { kind: 'mixed', install: tally.install, remove: tally.remove };
  }
  if (tally.remove > 0) return { kind: 'remove', count: tally.remove };
  return { kind: 'install', count: tally.install };
}

/** The download, in the four shapes the bar says it. */
export type DownloadPhrase =
  | { kind: 'none' }
  | { kind: 'unknown' }
  | { kind: 'known'; bytes: number }
  | { kind: 'knownPlusUnknown'; bytes: number; unknown: number };

export function downloadPhrase(tally: InstallTally): DownloadPhrase {
  if (tally.knownDownload === 0 && tally.unknownDownloads === 0) return { kind: 'none' };
  if (tally.knownDownload === 0) return { kind: 'unknown' };
  if (tally.unknownDownloads === 0) return { kind: 'known', bytes: tally.knownDownload };
  return { kind: 'knownPlusUnknown', bytes: tally.knownDownload, unknown: tally.unknownDownloads };
}

/** Rows chosen in the OTHER mode, so nobody thinks they were dropped - or included. */
export interface KeptPhrase {
  rows: number;
  /** Ascending. */
  sections: number[];
}

/**
 * 🔴 THE TWO SELECTIONS NEVER MERGE. The bar acts on the mode in view; what was chosen in the other
 * stays chosen and runs separately, and this is the one line that says so. `null` when nothing is.
 */
export function keptPhrase(other: readonly Candidate[]): KeptPhrase | null {
  if (other.length === 0) return null;
  return {
    rows: other.length,
    sections: [...new Set(other.map((row) => row.section))].sort((a, b) => a - b),
  };
}
