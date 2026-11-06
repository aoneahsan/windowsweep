/**
 * The shape of the one store (`state/store.ts`), kept apart so that file stays under the 500-line
 * ceiling. Types only: nothing here runs, so importing it costs nothing at boot. `store.ts`
 * re-exports the public names, where every screen has always imported them.
 */

import type { Catalogue } from '../lib/catalogue';
import type { Rehearsal } from '../lib/rehearsal';
import type { Candidate, ProgressEvent, RunSummary, ScanTarget } from '../lib/cli';
import type { AuthUser } from '../lib/auth';
import type { AxisPrefs } from '../lib/theme';

export type RunPhase = 'idle' | 'running' | 'done' | 'failed';

/**
 * What the updater reported at boot. 'none' is the ONLY value that licenses an
 * "up to date" claim: 'available' and 'later' mean a newer build exists, and
 * 'skipped' means the question was never answered.
 */
export type UpdateOutcome = 'unknown' | 'none' | 'available' | 'later' | 'skipped';

export interface RunLogLine {
  line: string;
  at: number;
}

export interface HistoryEntry {
  runId: string;
  startedAt: string;
  mode: string;
  dryRun: boolean;
  elevated: boolean;
  sections: number[];
  freedBytes: number;
  estimatedBytes: number;
  durationMs: number;
}

export interface StoreState {
  /* --- the engine ------------------------------------------------------- */
  catalogue: Catalogue | null;
  engineVersion: string;
  engineError: string | null;
  setCatalogue: (c: Catalogue) => void;
  setEngineError: (message: string) => void;

  /* --- the current run -------------------------------------------------- */
  phase: RunPhase;
  runId: string | null;
  log: RunLogLine[];
  progress: Record<number, ProgressEvent>;
  summary: RunSummary | null;
  startRun: (runId: string) => void;
  appendLog: (line: string) => void;
  applyProgress: (event: ProgressEvent) => void;
  finishRun: (summary: RunSummary | null, failed?: boolean) => void;

  /* --- what a scan measured ---------------------------------------------
     🔴 Held apart from `summary`, which every run replaces. `targets[]` is
     populated by `--scan` and empty in every other mode, so reading the map and
     the Reclaimable column off the live summary meant a dry-run blanked both.
     A real run DOES spend them, and `setScanTargets([])` says so. */
  scanTargets: ScanTarget[];
  /**
   * When those targets were measured, or null when nothing has been.
   *
   * 🔴 Stamped here rather than at the call site, so it cannot disagree with the
   * rows it describes: one setter, one timestamp. Clearing the rows clears it,
   * because after a real run those measurements have been spent and a time that
   * outlived its figures would be a stale "measured 2 minutes ago" over nothing.
   * Deliberately NOT persisted - a measurement is only true of this session.
   */
  scannedAt: number | null;
  setScanTargets: (rows: ScanTarget[]) => void;
  /**
   * Drop the rows of the sections a real run has just worked on.
   *
   * 🔴 PER SECTION (GATE 4 round 7, owner item 3a). A real run from the Sections
   * screen used to leave Home counting - and offering to reclaim - what that run
   * had just deleted, because only Home's own Reclaim cleared the measurements,
   * and that cleared all of them. What a run touched is known to the section; what
   * it did not touch is still measured, and stays.
   */
  spendScanTargets: (sections: readonly number[]) => void;
  /**
   * The last "Dry-run first", with the arguments it ran with (D-60,
   * `lib/rehearsal.ts`). Kept apart from `summary` for the reason `scanTargets` is:
   * every run replaces the summary, and a Picker ask must not erase the estimate
   * the Reclaim button carries. Session-only, like the scan it sits beside.
   */
  rehearsal: Rehearsal | null;
  recordRehearsal: (rehearsal: Rehearsal) => void;

  /* --- what the interactive sections offered, and what a person ticked ----
     Written by `finishRun` alone, from every run's summary - see
     `lib/offers.ts` for why that is per section and never per run. */
  candidates: Candidate[];
  offeredSections: number[];
  selectedPaths: Set<string>;
  toggleCandidate: (path: string) => void;
  setSelection: (paths: string[]) => void;

  /* --- targets kept out of every run -------------------------------------
     🔴 Absolute paths, each one a `targets[].path` the engine printed, and every
     run passes them as `--exclude-path` (`lib/engine.ts`). The engine protects
     each one AND everything beneath it, so this is a small set even when it
     covers a lot of disk.

     🔴 Persisted rather than URL state, on the same reasoning `sectionSelection`
     records: this is a standing decision that must survive a restart, and 665
     paths in a query string is not a link anybody would share. It goes through
     the same `readLocal`/`writeLocal` pair as every other persisted value in this
     store - the project's one storage seam - rather than a second mechanism
     nothing else here uses.

     🔴 What it is NOT: a claim about what happened. The engine decides what is
     actually refused and reports it back in `summary.excluded`, which is what the
     Run screen shows. This set is the request; that array is the outcome. */
  excludedPaths: string[];
  toggleExcluded: (path: string) => void;
  clearExclusions: () => void;

  /* --- which sections the Sections screen has ticked --------------------- */
  sectionSelection: number[];
  toggleSectionSelection: (id: number) => void;
  setSectionSelection: (ids: number[]) => void;

  /* --- history ---------------------------------------------------------- */
  history: HistoryEntry[];
  addHistory: (entry: HistoryEntry) => void;
  setHistory: (entries: HistoryEntry[]) => void;

  /* --- preferences ------------------------------------------------------- */
  prefs: AxisPrefs;
  setAxis: (key: string, value: string) => void;
  developer: boolean;
  setDeveloper: (on: boolean) => void;
  /**
   * The idle window in days - the engine's `--days N`, whose own default is 100
   * (`lib/config.ps1` -> Get-DefaultConfig). A file goes only when its newest
   * timestamp is at least this old, so lowering it includes more caches.
   *
   * 🔴 The app passes it on every run rather than only when it differs from 100:
   * the engine would otherwise read its own saved config, which a person may have
   * changed from the command line, and this window would be showing one number
   * while the run used another.
   */
  idleDays: number;
  setIdleDays: (days: number) => void;
  /**
   * The temp-folder idle window - the engine's `--temp-days N`, default 3
   * (`lib/config.ps1` -> Get-DefaultConfig). %TEMP% and the Windows temp folders
   * turn over far faster than a package cache, which is why they get their own
   * threshold rather than sharing the one above.
   */
  tempDays: number;
  setTempDays: (days: number) => void;
  /**
   * What section 19 counts as a large file - the engine's `--large-file-mb N`,
   * default 100.
   *
   * 🔴 The flag is `--large-file-mb`. The click dummy's consequence line says
   * `--large-mb`, which is not a flag the engine answers to at all
   * (`windowsweep.ps1:171`), so the app states the real one - reported for the
   * dummy to be corrected.
   */
  largeFileMb: number;
  setLargeFileMb: (mb: number) => void;
  personalRoots: string[];
  browserProfileRoots: string[];
  tempRoots: string[];
  setRootList: (
    kind: 'personalRoots' | 'browserProfileRoots' | 'tempRoots',
    paths: string[]
  ) => void;

  /* --- what the boot update check found ---------------------------------
     🔴 Recorded so the About tab can say "up to date" only when the check
     actually said so. 'unknown' is the honest starting value and the one a
     skipped check leaves behind: this window cannot ask the update server twice
     just to label a badge, and a badge printed from a guess is worse than an
     absent one. */
  updateOutcome: UpdateOutcome;
  setUpdateOutcome: (outcome: UpdateOutcome) => void;

  /* --- account ---------------------------------------------------------- */
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;

  /* --- the Elevation screen's command line, for the status bar -----------
     🔴 The dummy puts it in the status bar's middle slot (`elevation.html`
     `[data-ws-text="elevateCmd"]`), and that bar is chrome the screen renders
     inside - it cannot be handed a prop. The line is built from the screen's own
     choice, so the screen publishes it here and the shell reads it; null when the
     screen is not mounted. (D-29.) */
  elevationCommand: string | null;
  setElevationCommand: (line: string | null) => void;
}
