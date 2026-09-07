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

import { create } from 'zustand';

import type { Catalogue } from '../lib/catalogue';
import type { Candidate, RunSummary, ProgressEvent, ScanTarget } from '../lib/cli';
import type { AuthUser } from '../lib/auth';
import { readPrefs, writePrefs, applyAllAxes, type AxisPrefs } from '../lib/theme';

export type RunPhase = 'idle' | 'running' | 'done' | 'failed';

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

  /* --- account ---------------------------------------------------------- */
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

const HISTORY_KEY = 'windowsweep:history';
const DEVELOPER_KEY = 'windowsweep:developer';
const IDLE_DAYS_KEY = 'windowsweep:idleDays';

/** The engine's own default idle threshold - `lib/config.ps1`, `days = 100`. Not
    exported: nothing outside this module has a reason to know the seed value. */
const DEFAULT_IDLE_DAYS = 100;
/** The range the click dummy's own control offers (`index.html:138`). */
export const MIN_IDLE_DAYS = 7;
export const MAX_IDLE_DAYS = 365;

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

  user: null,
  setUser: (user) => { set({ user }); },
}));
