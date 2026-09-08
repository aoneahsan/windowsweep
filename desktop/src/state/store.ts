/**
 * The one store. Everything the screens share lives here; nothing here reaches
 * for a provider, a network client or the filesystem directly.
 *
 * 🔴 There is no consent state here any more. The owner removed the opt-out on
 * 2026-09-07, so the first-run record is a "seen the notice" flag that only two
 * places read - the boot route and the notice itself - and it is read straight
 * from `lib/consent.ts` rather than mirrored into shared state nothing observes.
 *
 * 🔴 Sign-in is never a gate on anything: every cleanup capability works signed
 * out, and the store models that by keeping `user` beside the rest rather than
 * wrapping the app in it.
 */

import { useMemo } from 'react';
import { create } from 'zustand';

import { includedOnly, toggleExclusion, usableExclusions } from '../lib/exclusions';
import type { Catalogue } from '../lib/catalogue';
import type { RunPreferences } from '../lib/engine';
import type { Candidate, RunSummary, ProgressEvent, ScanTarget } from '../lib/cli';
import type { AuthUser } from '../lib/auth';
import { readPrefs, writePrefs, applyAllAxes, type AxisPrefs } from '../lib/theme';

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

interface StoreState {
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

  /* --- selection -------------------------------------------------------- */
  candidates: Candidate[];
  selectedPaths: Set<string>;
  setCandidates: (rows: Candidate[]) => void;
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
}

const HISTORY_KEY = 'windowsweep:history';
const EXCLUDED_KEY = 'windowsweep:excludedPaths';
const DEVELOPER_KEY = 'windowsweep:developer';
const IDLE_DAYS_KEY = 'windowsweep:idleDays';
const TEMP_DAYS_KEY = 'windowsweep:tempDays';
const LARGE_FILE_MB_KEY = 'windowsweep:largeFileMb';

/** The engine's own default idle threshold - `lib/config.ps1`, `days = 100`. Not
    exported: nothing outside this module has a reason to know the seed value. */
const DEFAULT_IDLE_DAYS = 100;
/** The range the click dummy's own control offers (`index.html:138`). */
export const MIN_IDLE_DAYS = 7;
export const MAX_IDLE_DAYS = 365;

/** The engine's own temp threshold - `lib/config.ps1`, `tempDays = 3`. */
const DEFAULT_TEMP_DAYS = 3;
export const MIN_TEMP_DAYS = 1;
export const MAX_TEMP_DAYS = 90;

/** The engine's own large-file threshold - `lib/config.ps1`, `largeFileMb = 100`.
    🔴 NOT the dummy's 500: that row is a prototype stub whose input has an empty
    handler (`page-settings.js:106`), while every other default in this store is
    taken from the engine so the number on screen is the number that runs. */
const DEFAULT_LARGE_FILE_MB = 100;
export const MIN_LARGE_FILE_MB = 1;
export const MAX_LARGE_FILE_MB = 100_000;

/** When the run in flight began, so `finishRun` can record how long it took. */
let startedAt = Date.now();

function readLocal<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as { v?: T };
    return parsed.v ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * The engine refuses `--days` unless it is a whole number, and the Rust side
 * refuses a value that looks like a flag, so the one place this value is set is
 * also the place it is made safe to pass. A stored value from an older build - or
 * a hand-edited one - is clamped rather than trusted.
 */
function clampIdleDays(days: number): number {
  if (!Number.isFinite(days)) return DEFAULT_IDLE_DAYS;
  return Math.min(MAX_IDLE_DAYS, Math.max(MIN_IDLE_DAYS, Math.round(days)));
}

/** Same contract as `clampIdleDays`: the engine refuses anything but a whole
    number, and the Rust side refuses a value that looks like a flag. */
function clampWhole(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function writeLocal(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify({ v: value }));
  } catch {
    /* a private window - the session works, it just forgets */
  }
}

export const useStore = create<StoreState>()((set, get) => ({
  catalogue: null,
  engineVersion: '',
  engineError: null,
  setCatalogue: (c) => { set({ catalogue: c, engineVersion: c.version, engineError: null }); },
  setEngineError: (message) => { set({ engineError: message }); },

  phase: 'idle',
  runId: null,
  log: [],
  progress: {},
  summary: null,
  startRun: (runId) => {
    startedAt = Date.now();
    set({ phase: 'running', runId, log: [], progress: {}, summary: null });
  },
  appendLog: (line) => {
    // The log pane is bounded. A --purge-all run over a large disk produces tens
    // of thousands of lines, and keeping them all is how a window stops repainting.
    const log = [...get().log, { line, at: Date.now() }];
    set({ log: log.length > 2000 ? log.slice(-2000) : log });
  },
  applyProgress: (event) => { set({ progress: { ...get().progress, [event.section]: event } }); },
  /**
   * 🔴 A finished run is RECORDED here, and until now no caller ever reached
   * `addHistory`: the History screen and Home's last-eight-runs band both read a
   * list nothing ever wrote, so both were permanently empty whatever you ran.
   *
   * A run with no readable summary is not recorded - there is nothing honest to
   * put in the row - and the mode is the engine's own word for what it did,
   * never a friendly name invented here.
   */
  finishRun: (summary, failed = false) => {
    set({ phase: failed ? 'failed' : 'done', summary });
    if (!summary) return;
    get().addHistory({
      runId: get().runId ?? '',
      startedAt: new Date(startedAt).toISOString(),
      mode: summary.mode,
      dryRun: summary.dry_run,
      elevated: summary.elevated,
      sections: summary.sections.map((s) => s.section),
      freedBytes: summary.freed_bytes,
      estimatedBytes: summary.estimated_bytes,
      durationMs: Math.max(0, Date.now() - startedAt),
    });
  },

  scanTargets: [],
  scannedAt: null,
  setScanTargets: (rows) => { set({ scanTargets: rows, scannedAt: rows.length > 0 ? Date.now() : null }); },

  candidates: [],
  selectedPaths: new Set<string>(),
  setCandidates: (rows) => { set({ candidates: rows, selectedPaths: new Set<string>() }); },
  toggleCandidate: (path) => {
    const next = new Set(get().selectedPaths);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    set({ selectedPaths: next });
  },
  setSelection: (paths) => { set({ selectedPaths: new Set(paths) }); },

  /* 🔴 Read back through `usableExclusions`, which is where a stored value is made
     safe to pass - the same contract `clampIdleDays` has. A path that no longer
     looks like an absolute Windows path is dropped rather than handed to a run,
     because the Rust validator refuses a value beginning `--` and a corrupted
     store must not be able to change what a run does. */
  excludedPaths: usableExclusions(readLocal<string[]>(EXCLUDED_KEY, [])),
  toggleExcluded: (path) => {
    const next = usableExclusions(toggleExclusion(get().excludedPaths, path));
    writeLocal(EXCLUDED_KEY, next);
    set({ excludedPaths: next });
  },
  clearExclusions: () => {
    writeLocal(EXCLUDED_KEY, []);
    set({ excludedPaths: [] });
  },

  /* Section ids, not paths: the Sections screen ticks whole sections and hands
     them to `--only`. Kept in the store rather than the URL because 26 ids in a
     query string is not a link anybody would share. */
  sectionSelection: [],
  toggleSectionSelection: (id) => {
    const current = get().sectionSelection;
    set({
      sectionSelection: current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id].sort((a, b) => a - b),
    });
  },
  setSectionSelection: (ids) => { set({ sectionSelection: [...ids].sort((a, b) => a - b) }); },

  history: readLocal<HistoryEntry[]>(HISTORY_KEY, []),
  addHistory: (entry) => {
    const history = [entry, ...get().history].slice(0, 200);
    writeLocal(HISTORY_KEY, history);
    set({ history });
  },
  setHistory: (entries) => {
    writeLocal(HISTORY_KEY, entries);
    set({ history: entries });
  },

  prefs: readPrefs(),
  setAxis: (key, value) => {
    const prefs = { ...get().prefs, [key]: value };
    writePrefs(prefs);
    applyAllAxes(prefs);
    set({ prefs });
  },
  developer: readLocal<boolean>(DEVELOPER_KEY, false),
  setDeveloper: (on) => {
    writeLocal(DEVELOPER_KEY, on);
    set({ developer: on });
  },
  idleDays: clampIdleDays(readLocal<number>(IDLE_DAYS_KEY, DEFAULT_IDLE_DAYS)),
  setIdleDays: (days) => {
    const value = clampIdleDays(days);
    writeLocal(IDLE_DAYS_KEY, value);
    set({ idleDays: value });
  },
  tempDays: clampWhole(
    readLocal<number>(TEMP_DAYS_KEY, DEFAULT_TEMP_DAYS),
    MIN_TEMP_DAYS,
    MAX_TEMP_DAYS,
    DEFAULT_TEMP_DAYS,
  ),
  setTempDays: (days) => {
    const value = clampWhole(days, MIN_TEMP_DAYS, MAX_TEMP_DAYS, DEFAULT_TEMP_DAYS);
    writeLocal(TEMP_DAYS_KEY, value);
    set({ tempDays: value });
  },
  largeFileMb: clampWhole(
    readLocal<number>(LARGE_FILE_MB_KEY, DEFAULT_LARGE_FILE_MB),
    MIN_LARGE_FILE_MB,
    MAX_LARGE_FILE_MB,
    DEFAULT_LARGE_FILE_MB,
  ),
  setLargeFileMb: (mb) => {
    const value = clampWhole(mb, MIN_LARGE_FILE_MB, MAX_LARGE_FILE_MB, DEFAULT_LARGE_FILE_MB);
    writeLocal(LARGE_FILE_MB_KEY, value);
    set({ largeFileMb: value });
  },

  updateOutcome: 'unknown',
  setUpdateOutcome: (outcome) => { set({ updateOutcome: outcome }); },

  user: null,
  setUser: (user) => { set({ user }); },
}));

/**
 * Every preference a run carries, read in one line.
 *
 * 🔴 Four atomic subscriptions rather than one selector returning an object: a
 * selector that builds a new object every call re-renders on every unrelated store
 * change, and the log pane appends thousands of lines during a purge. Each field
 * here is compared by value, so a screen re-renders when a preference moves and
 * not when the log does.
 *
 * 🔴 The idle window is ONE field with two readers - Home's control and Settings'
 * control set the same `idleDays`, never a copy each. Two copies of a number a
 * person can edit in two places is how a window ends up showing 100 beside a run
 * that used 30.
 */
export function useRunPreferences(): RunPreferences {
  const developer = useStore((s) => s.developer);
  const idleDays = useStore((s) => s.idleDays);
  const tempDays = useStore((s) => s.tempDays);
  const largeFileMb = useStore((s) => s.largeFileMb);
  return { developer, idleDays, tempDays, largeFileMb };
}

/**
 * The measured targets a run would ACTUALLY touch: everything the last `--scan`
 * found, minus what the person has clicked out of it.
 *
 * 🔴 ONE derivation, and it is the one every figure reads - the hero number, the
 * Reclaim button, the safe-run ladder, the Sections table and total, the per-
 * section rows and the status bar. The recorded failure it exists to prevent is
 * `reclaimableBytes`, which lived in two files and was wrong the same way in both;
 * a second copy of this filter would be that defect again, in a place where being
 * wrong means the window promising more than the run delivers.
 *
 * 🔴 THE ONE DELIBERATE EXCEPTION IS HOME'S MAP, which draws the excluded tiles
 * too, dimmed, so "what I turned off" stays visible instead of silently vanishing
 * (`reclaim-map.js` -> `mapDataAll`). It reads `scanTargets` directly and carries
 * the flag per tile; nothing else may.
 */
export function useIncludedScanTargets(): ScanTarget[] {
  const scanTargets = useStore((s) => s.scanTargets);
  const excludedPaths = useStore((s) => s.excludedPaths);
  return useMemo(() => includedOnly(scanTargets, excludedPaths), [scanTargets, excludedPaths]);
}
