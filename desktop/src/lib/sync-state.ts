/**
 * What the Account screen's Sync band reads: whether sync is running, when settings
 * last round-tripped with the account, and which run ids the account confirmed.
 *
 * Its own small store rather than a slice of `state/store.ts`: nothing else reads it,
 * and only `lib/sync-session.ts` writes it, through the actions beside the state.
 */

import { create } from 'zustand';

interface SyncStatus {
  /** Sync is running in this window for the signed-in account. */
  active: boolean;
  /** When settings last round-tripped with the account, or null before the first success. */
  settingsSyncedAt: number | null;
  /** Run ids the account confirmed it holds - counted against this window's History. */
  uploaded: readonly string[];
  begin: (uploaded: readonly string[]) => void;
  settingsSynced: (at: number) => void;
  setUploaded: (uploaded: readonly string[]) => void;
  end: () => void;
}

export const useSyncStatus = create<SyncStatus>()((set) => ({
  active: false,
  settingsSyncedAt: null,
  uploaded: [],
  begin: (uploaded) => { set({ active: true, settingsSyncedAt: null, uploaded }); },
  settingsSynced: (at) => { set({ settingsSyncedAt: at }); },
  setUploaded: (uploaded) => { set({ uploaded }); },
  end: () => { set({ active: false, settingsSyncedAt: null, uploaded: [] }); },
}));
