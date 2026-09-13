/**
 * What a finished run was, in the words the dummy uses for it - never the engine's
 * raw `mode`.
 *
 * 🔴 D-44 (GATE 4 round 8). The engine's `--json` summary says `mode: "all"`,
 * `"only"` or `"scan"`, and the window printed that as it was - Home's last-runs
 * line read `… · 2 sections · only`. The dummy names the same runs `safe batch`
 * and `sections 1, 2, 3, 6, 7, 8` (`seed.js` `RUNS`), so the reader sees what ran
 * rather than which flag ran it.
 *
 * `--profile` reaches the summary as `only` too (`windowsweep.ps1`, `Read-Arguments`),
 * so a profile run is named by the sections it resolved to; this window never
 * starts one. A scan is not a run at all - it measures and deletes nothing - so it
 * has no name here and callers leave it out of a list of runs (`isRunRecord`).
 */

import type { TFunction } from 'i18next';

import type { HistoryEntry } from '../state/store';

/** The summary's `section: -1` step is the scan's own row, never a numbered section. */
const SCAN_STEP = -1;

/** A record of a run - a cleanup or its rehearsal - as opposed to a read-only scan. */
export function isRunRecord(entry: Pick<HistoryEntry, 'mode'>): boolean {
  return entry.mode !== 'scan';
}

/**
 * `safe batch` for `--all`; `section 23` / `sections 17, 19` for `--only`, from the
 * sections the run actually reported. Any other mode is printed as the engine gave
 * it, so a new one shows up in plain sight rather than as a blank.
 */
export function runModeLabel(entry: Pick<HistoryEntry, 'mode' | 'sections'>, t: TFunction): string {
  if (entry.mode === 'all') return t('home.runModeSafeBatch');
  if (entry.mode === 'only') {
    const ids = entry.sections.filter((id) => id !== SCAN_STEP);
    return t('home.runModeSections', { count: ids.length, list: ids.join(', ') });
  }
  return entry.mode;
}
