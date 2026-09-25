/**
 * What the Account screen's Sync band reads - and Home's one line about it: whether
 * sync is running, when settings last round-tripped with the account, which step of
 * a settings round-trip failed, which run ids the account confirmed, how many summaries
 * wait to be tried again, and the settings the account's newer ones replaced.
 *
 * Its own small store rather than a slice of `state/store.ts`: nothing outside sync
 * reads it but those two screens, and only `lib/sync-session.ts` and
 * `lib/sync-hooks.ts` write it, through the actions beside the state.
 *
 * 🔴 BOOT-SAFE: zustand is its only runtime import (`SyncedSettings` is a type, and
 * erased), so Home can read `replaced` without loading the Supabase client.
 *
 * 🔴 `replaced` LIVES IN MEMORY ONLY (D40, 2026-09-24). The notice it drives stands on
 * the Sync band's Settings row and on Home until the next settings change on this
 * machine or sign-out, and closing windowsweep ends it because nothing stores it - the
 * owner took that option over "also kept across restarts".
 */

import { create } from 'zustand';

import type { SyncedSettings } from './sync';

/** Which half of a settings round-trip failed: reading the account's row, or writing this machine's. */
export type SettingsStep = 'read' | 'write';

interface SyncStatus {
  /** Sync is running in this window for the signed-in account. */
  active: boolean;
  /** When settings last round-tripped with the account, or null before the first success. */
  settingsSyncedAt: number | null;
  /** The step of the last settings round-trip that failed, until one succeeds (SY-02a). */
  settingsFailed: SettingsStep | null;
  /** Run ids the account confirmed it holds - counted against this window's History. */
  uploaded: readonly string[];
  /** Stripped summaries this machine keeps to try again (SY-02b). */
  pending: number;
  /** This machine's settings, as they were before the account's newer ones replaced them (SY-03). */
  replaced: SyncedSettings | null;
  begin: (uploaded: readonly string[], pending: number) => void;
  settingsSynced: (at: number) => void;
  failSettings: (step: SettingsStep) => void;
  setUploaded: (uploaded: readonly string[]) => void;
  setRuns: (uploaded: readonly string[], pending: number) => void;
  /** Keep what the account replaced - unless a replacement already stands: the first is kept. */
  captureReplaced: (replaced: SyncedSettings) => void;
  endReplacement: () => void;
  end: () => void;
}

type Status = Pick<SyncStatus, 'active' | 'settingsSyncedAt' | 'settingsFailed' | 'uploaded' | 'pending' | 'replaced'>;

/** Nothing running, nothing failed, nothing waiting, nothing replaced - before sign-in and after sign-out. */
const IDLE: Status = {
  active: false,
  settingsSyncedAt: null,
  settingsFailed: null,
  uploaded: [],
  pending: 0,
  replaced: null,
};

export const useSyncStatus = create<SyncStatus>()((set, get) => ({
  ...IDLE,
  begin: (uploaded, pending) => { set({ ...IDLE, active: true, uploaded, pending }); },
  /* A round-trip that moves the "Synced ..." time clears either failure line. */
  settingsSynced: (at) => { set({ settingsSyncedAt: at, settingsFailed: null }); },
  failSettings: (step) => { set({ settingsFailed: step }); },
  setUploaded: (uploaded) => { set({ uploaded }); },
  setRuns: (uploaded, pending) => { set({ uploaded, pending }); },
  /* 🔴 A second replacement while one stands never overwrites the first, so Undo still
     puts this machine's OWN settings back - not the account's older row that a stale
     write-back applied in between. */
  captureReplaced: (replaced) => { if (get().replaced === null) set({ replaced }); },
  endReplacement: () => { if (get().replaced !== null) set({ replaced: null }); },
  end: () => { set(IDLE); },
}));
