/**
 * The one store. Everything the screens share lives here; nothing here reaches
 * for a provider, a network client or the filesystem directly.
 *
 * 🔴 Consent is read at construction and is the gate every destination passes
 * through. Sign-in is never a gate on anything else: every cleanup capability
 * works signed out, and the store models that by keeping `user` beside the rest
 * rather than wrapping the app in it.
 */

import { create } from 'zustand';

import type { Catalogue } from '../lib/catalogue';
import type { Candidate, RunSummary, ProgressEvent } from '../lib/cli';
import type { AuthUser } from '../lib/auth';
import { readConsent, writeConsent, type ConsentState } from '../lib/consent';
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

  /* --- selection -------------------------------------------------------- */
  candidates: Candidate[];
  selectedPaths: Set<string>;
  setCandidates: (rows: Candidate[]) => void;
  toggleCandidate: (path: string) => void;
  setSelection: (paths: string[]) => void;

  /* --- history ---------------------------------------------------------- */
  history: HistoryEntry[];
  addHistory: (entry: HistoryEntry) => void;
  setHistory: (entries: HistoryEntry[]) => void;

  /* --- preferences and consent ------------------------------------------ */
  prefs: AxisPrefs;
  setAxis: (key: string, value: string) => void;
  developer: boolean;
  setDeveloper: (on: boolean) => void;

  consent: ConsentState;
  setConsent: (next: ConsentState) => void;

  /* --- account ---------------------------------------------------------- */
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

const HISTORY_KEY = 'windowsweep:history';
const DEVELOPER_KEY = 'windowsweep:developer';

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
  startRun: (runId) => { set({ phase: 'running', runId, log: [], progress: {}, summary: null }); },
  appendLog: (line) => {
    // The log pane is bounded. A --purge-all run over a large disk produces tens
    // of thousands of lines, and keeping them all is how a window stops repainting.
    const log = [...get().log, { line, at: Date.now() }];
    set({ log: log.length > 2000 ? log.slice(-2000) : log });
  },
  applyProgress: (event) => { set({ progress: { ...get().progress, [event.section]: event } }); },
  finishRun: (summary, failed = false) => {
    set({ phase: failed ? 'failed' : 'done', summary });
  },

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

  consent: readConsent(),
  setConsent: (next) => {
    writeConsent(next);
    set({ consent: next });
  },

  user: null,
  setUser: (user) => { set({ user }); },
}));
