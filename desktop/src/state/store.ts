/**
 * The one store. Everything the screens share lives here; nothing here reaches
 * for a provider, a network client or the filesystem directly.
 *
 * 🔴 There is no consent state here any more. The owner removed the opt-out on
 * 2026-09-07, so the first-run record is a "seen the legal bar" flag that only the
 * bar's own decision reads, straight from `lib/consent.ts`; where the bar stands in
 * a launch lives in `state/notices.ts`, beside the release gate it gives way to.
 *
 * 🔴 Sign-in is never a gate on anything: every cleanup capability works signed
 * out, and the store models that by keeping `user` beside the rest rather than
 * wrapping the app in it.
 */

import { create } from 'zustand';

import { toggleExclusion, usableExclusions } from '../lib/exclusions';
import { usableRoots } from '../lib/roots';
import { withoutSectionOffers } from './offers-reset';
import { readStored, writeStored } from '../lib/storage';
import { interactiveSectionIds, mergeOffers } from '../lib/offers';
import { isCleanupRun } from '../lib/cli';
/* 🔴 The value import is one-way at runtime: `run-mode.ts` only type-imports
   `HistoryEntry` back from here, and a type import is erased, so there is no cycle
   to resolve. Taken rather than inlining `mode !== 'scan'` a fourth time - one
   vocabulary for one fact, which is the rule that module exists for. */
import { isRunRecord } from '../lib/run-mode';
import { noteLocalSettingChanged, noteRunFinished, noteSettingsChanged } from '../lib/sync-hooks';
import { readPrefs, writePrefs, applyAllAxes, dropUrlOverride } from '../lib/theme';
import {
  DEFAULT_IDLE_DAYS,
  DEFAULT_LARGE_FILE_MB,
  DEFAULT_TEMP_DAYS,
  clampIdleDays,
  clampLargeFileMb,
  clampTempDays,
} from './thresholds';

/* The controls' ranges, where every screen that draws one has always imported them. */
export {
  MAX_IDLE_DAYS,
  MAX_LARGE_FILE_MB,
  MAX_TEMP_DAYS,
  MIN_IDLE_DAYS,
  MIN_LARGE_FILE_MB,
  MIN_TEMP_DAYS,
} from './thresholds';

/* The state's shape lives in `store-types.ts`; the public names are re-exported here, where every
   screen has always imported them. */
export type { HistoryEntry, RunLogLine, RunPhase, UpdateOutcome } from './store-types';
import type { HistoryEntry, StoreState } from './store-types';

const HISTORY_KEY = 'windowsweep:history';
/** How many runs are kept. Named rather than a literal in the slice that applies it. */
const HISTORY_LIMIT = 200;
const EXCLUDED_KEY = 'windowsweep:excludedPaths';
const DEVELOPER_KEY = 'windowsweep:developer';
const IDLE_DAYS_KEY = 'windowsweep:idleDays';
const TEMP_DAYS_KEY = 'windowsweep:tempDays';
const LARGE_FILE_MB_KEY = 'windowsweep:largeFileMb';
const ROOT_KEYS = {
  personalRoots: 'windowsweep:personalRoots',
  browserProfileRoots: 'windowsweep:browserProfileRoots',
  tempRoots: 'windowsweep:tempRoots',
} as const;

/** When the run in flight began, so `finishRun` can record how long it took. */
let startedAt = Date.now();

function readLocal<T>(key: string, fallback: T): T {
  return readStored(key, fallback);
}

function writeLocal(key: string, value: unknown): void {
  writeStored(key, value);
}

export const useStore = create<StoreState>()((set, get) => ({
  catalogue: null,
  engineVersion: '',
  engineError: null,
  setCatalogue: (c) => {
    set({ catalogue: c, engineVersion: c.version, engineError: null });
  },
  setEngineError: (message) => {
    set({ engineError: message });
  },

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
  applyProgress: (event) => {
    set({ progress: { ...get().progress, [event.section]: event } });
  },
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
    /* 🔴 D-23: every path that lands a summary lands its candidates, because this
       is the one place they all pass through. A ticked row that is no longer on
       offer is unticked with it, so "Remove these" can never carry a path the
       list no longer shows. */
    const before = {
      candidates: get().candidates,
      offeredSections: get().offeredSections,
      driverReport: get().driverReport,
    };
    const offers = mergeOffers(before, summary, interactiveSectionIds(get().catalogue));
    if (offers !== before) {
      const onOffer = new Set(offers.candidates.map((row) => row.path));
      set({
        ...offers,
        selectedPaths: new Set([...get().selectedPaths].filter((path) => onOffer.has(path))),
      });
    }
    /* A real run has deleted inside every section that ran or failed part-way;
       a refused or skipped section never started, and a dry-run deleted nothing. */
    if (!summary.dry_run && isCleanupRun(summary)) {
      get().spendScanTargets(
        summary.sections
          .filter((step) => step.status === 'ran' || step.status === 'failed')
          .map((step) => step.section)
      );
    }
    /* 🔴 A SCAN IS NOT A HISTORY ROW (TASK-016 item 2). Every summary landed here,
       `--scan` included, and `addHistory` keeps the newest 200 - so pressing Scan
       spent a slot that no screen has ever displayed, and pushed a real run off the
       end of a list that had room for it. The three consumers all filter scans out
       already (`lib/history-rows.ts` -> `cleanupRuns`, `LastRuns`, Report), and the
       click dummy - which owns this screen - has never drawn a scan row: its eight
       seeded runs are `safe batch`, `sections …` and `profile: …`
       (`seed.js` -> `RUNS`). So the dummy specifies FILTER, not a second cap, and
       this is the one place every summary passes through.

       The same test the displays use, from the module that already decides it. */
    if (!isCleanupRun(summary)) return;
    const entry: HistoryEntry = {
      runId: get().runId ?? '',
      startedAt: new Date(startedAt).toISOString(),
      mode: summary.mode,
      dryRun: summary.dry_run,
      elevated: summary.elevated,
      sections: summary.sections.map((s) => s.section),
      freedBytes: summary.freed_bytes,
      estimatedBytes: summary.estimated_bytes,
      durationMs: Math.max(0, Date.now() - startedAt),
    };
    get().addHistory(entry);
    /* Then sync, when this build has it: `lib/sync.ts` -> `stripRun` is the run's only way out. */
    noteRunFinished(summary, entry);
  },

  scanTargets: [],
  scannedAt: null,
  setScanTargets: (rows) => {
    set({ scanTargets: rows, scannedAt: rows.length > 0 ? Date.now() : null });
  },
  spendScanTargets: (sections) => {
    if (sections.length === 0) return;
    const spent = new Set(sections);
    /* 🔴 A real run inside a section the last rehearsal estimated has spent that
       estimate too (D-60) - the button must not go on offering bytes that are gone.
       Every real run reaches here, finished or cancelled; a section it never
       started deleted nothing, and a run elsewhere leaves the estimate standing. */
    if (get().rehearsal?.summary.sections.some((step) => spent.has(step.section)))
      set({ rehearsal: null });
    const rows = get().scanTargets.filter((row) => !spent.has(row.section));
    if (rows.length === get().scanTargets.length) return;
    /* The rows that remain keep their measurement time: they were not touched. */
    set({ scanTargets: rows, scannedAt: rows.length > 0 ? get().scannedAt : null });
  },

  rehearsal: null,
  recordRehearsal: (rehearsal) => {
    set({ rehearsal });
  },

  candidates: [],
  offeredSections: [],
  driverReport: null,
  selectedPaths: new Set<string>(),
  toggleCandidate: (path) => {
    const next = new Set(get().selectedPaths);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    set({ selectedPaths: next });
  },
  setSelection: (paths) => {
    set({ selectedPaths: new Set(paths) });
  },

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
  setSectionSelection: (ids) => {
    set({ sectionSelection: [...ids].sort((a, b) => a - b) });
  },

  /* 🔴 Scan rows an earlier build wrote are dropped on the way in, or the cap stays
     spent for the next 200 runs on every machine that has already used this window
     (TASK-016 item 2). Nothing displays them - all three readers filter scans - so
     this removes no row anybody could see, and it is what makes the fix true of an
     existing install rather than only of a fresh one. */
  history: readLocal<HistoryEntry[]>(HISTORY_KEY, []).filter(isRunRecord),
  addHistory: (entry) => {
    const history = [entry, ...get().history].slice(0, HISTORY_LIMIT);
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
    // An explicit choice ends a URL override on that axis, so the choice shows (D-73).
    dropUrlOverride(key);
    applyAllAxes(prefs);
    set({ prefs });
    noteSettingsChanged();
  },
  /* 🔴 ON UNTIL SOMEONE TURNS IT OFF - D-24, GATE 4 round 7. It read `false`, and
     because this window passes the flag on every run the engine's own
     conservative default never applied: every first-run safe run went out with
     `--not-developer` and offered every toolchain cache in full, under a caption
     saying recent caches are left alone. The engine resolves "flag > saved answer
     > interactive question > conservative default (yes)" (`lib/config.ps1` ->
     `Resolve-DeveloperMode`) and the dummy's `DEFAULT_FACTS` say `true`. A person
     who switched it off has `false` stored, and keeps it. */
  developer: readLocal<boolean>(DEVELOPER_KEY, true),
  setDeveloper: (on) => {
    writeLocal(DEVELOPER_KEY, on);
    set({ developer: on });
    noteSettingsChanged();
  },
  /* 🔴 These three stay on this machine and never sync - but each is a setting, so a
     real change to one ends a standing replacement notice (D40, SY-07's "until you
     change a setting here"). Through `sync-hooks.ts`, so the path stays boot-safe. */
  idleDays: clampIdleDays(readLocal<number>(IDLE_DAYS_KEY, DEFAULT_IDLE_DAYS)),
  setIdleDays: (days) => {
    const value = clampIdleDays(days);
    const changed = value !== get().idleDays;
    writeLocal(IDLE_DAYS_KEY, value);
    set({ idleDays: value, ...(changed ? withoutSectionOffers(get(), [17, 19, 27]) : {}) });
    if (changed) noteLocalSettingChanged();
  },
  tempDays: clampTempDays(readLocal<number>(TEMP_DAYS_KEY, DEFAULT_TEMP_DAYS)),
  setTempDays: (days) => {
    const value = clampTempDays(days);
    const changed = value !== get().tempDays;
    writeLocal(TEMP_DAYS_KEY, value);
    set({ tempDays: value });
    if (changed) noteLocalSettingChanged();
  },
  largeFileMb: clampLargeFileMb(readLocal<number>(LARGE_FILE_MB_KEY, DEFAULT_LARGE_FILE_MB)),
  setLargeFileMb: (mb) => {
    const value = clampLargeFileMb(mb);
    const changed = value !== get().largeFileMb;
    writeLocal(LARGE_FILE_MB_KEY, value);
    set({ largeFileMb: value, ...(changed ? withoutSectionOffers(get(), [19]) : {}) });
    if (changed) noteLocalSettingChanged();
  },
  personalRoots: usableRoots(readLocal<string[]>(ROOT_KEYS.personalRoots, [])),
  browserProfileRoots: usableRoots(readLocal<string[]>(ROOT_KEYS.browserProfileRoots, [])),
  tempRoots: usableRoots(readLocal<string[]>(ROOT_KEYS.tempRoots, [])),
  setRootList: (kind, paths) => {
    const value = usableRoots(paths);
    const changed = value.join('\0') !== get()[kind].join('\0');
    writeLocal(ROOT_KEYS[kind], value);
    set({
      [kind]: value,
      ...(kind === 'personalRoots' && changed ? withoutSectionOffers(get(), [19]) : {}),
    });
    if (changed) noteLocalSettingChanged();
  },

  updateOutcome: 'unknown',
  setUpdateOutcome: (outcome) => {
    set({ updateOutcome: outcome });
  },

  user: null,
  setUser: (user) => {
    set({ user });
  },

  elevationCommand: null,
  setElevationCommand: (line) => {
    set({ elevationCommand: line });
  },
}));
