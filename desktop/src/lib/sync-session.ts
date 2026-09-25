/**
 * Sync, running: what happens on sign-in, on a settings change, after a finished run
 * and on sign-out. Loaded on demand - by `sync-hooks.ts` and the Account screen -
 * never at boot, and never in a build without the Supabase keys.
 *
 * 1. SIGN-IN, OR A SESSION AN EARLIER LAUNCH LEFT: read the account's settings, keep
 *    the newer side (`reconcileSettings`), write the result back - which is also what
 *    refreshes "Last seen" - then retry any upload an earlier session could not finish.
 * 2. A LATER SETTINGS CHANGE: one write per settled change, debounced.
 * 3. A FINISHED RUN: `pushRun(stripRun(...))`. 🔴 `stripRun` is the only way a run
 *    reaches the network; a failed upload is kept already stripped, and tried again.
 * 4. SIGN-OUT stops all of it. Nothing local is deleted here - the settings and the
 *    History stay on the machine, and `lib/auth.ts` -> `signOut` clears only the
 *    account's own traces.
 *
 * 🔴 A sync failure never blocks a run or the screen. It surfaces where the click
 * dummy shows sync state, in the dummy's words: the settings row reads "Local only"
 * until a first round-trip succeeds and its "Synced ..." time stops moving after one
 * fails, and "N of M runs uploaded" counts only what the account confirmed.
 */

import { useStore, type HistoryEntry } from '../state/store';
import type { RunSummary } from './cli';
import { configuredFeatures } from './config';
import { currentUser, supabase, type AuthUser } from './auth';
import { AXES, axisValue, type AxisPrefs } from './theme';
import {
  deleteRun,
  fetchSettings,
  pushRun,
  pushSettings,
  readStrippedRun,
  reconcileSettings,
  stripRun,
  type SyncedRun,
  type SyncedSettings,
} from './sync';
import { applyQuietly } from './sync-hooks';
import { readRunLedger, readSettingsStamp, writeRunLedger, writeSettingsStamp } from './sync-local';
import { useSyncStatus } from './sync-state';

/** One settled change, one write: clicking through the palettes is one push, not six. */
const SETTINGS_DEBOUNCE_MS = 1500;
/** Uploads kept to try again - bounded, so months offline cannot grow the record without end. */
const PENDING_LIMIT = 50;
/** Run ids remembered as stored - the bound of the History they are counted against. */
const UPLOADED_LIMIT = 200;
/** The stamp of settings this machine never recorded a change to. */
const NEVER = new Date(0).toISOString();
/** The store's own default for developer mode (D-24, `state/store.ts`). */
const DEVELOPER_DEFAULT = true;

/** The account sync is running for in this window, or null. */
let runningFor: string | null = null;
let pushTimer: number | null = null;
let signOutWatch: { unsubscribe: () => void } | null = null;
/** Every step that reads and writes the account or the ledger runs after the one before it. */
let chain: Promise<void> = Promise.resolve();

function serially(step: () => Promise<void> | void): Promise<void> {
  chain = chain.then(step).catch(() => undefined);
  return chain;
}

/** Only the registry's axes, each at one of its own values - a closed vocabulary out, and in. */
function narrowPrefs(prefs: Readonly<Record<string, unknown>>): AxisPrefs {
  const out: AxisPrefs = {};
  for (const axis of AXES) {
    const value = prefs[axis.key];
    if (typeof value === 'string' && axis.values.some((v) => v.value === value)) out[axis.key] = value;
  }
  return out;
}

function localSettings(): SyncedSettings {
  const { prefs, developer } = useStore.getState();
  return { prefs: narrowPrefs(prefs), developer, updatedAt: readSettingsStamp() ?? NEVER };
}

/** Settings nobody chose: every axis at its default, and developer mode as it ships. */
function untouched(settings: SyncedSettings): boolean {
  return (
    settings.developer === DEVELOPER_DEFAULT &&
    AXES.every((axis) => axisValue(settings.prefs, axis.key) === axis.def)
  );
}

/** Make the account's settings this machine's, through the store's own actions. */
function applySettings(settings: SyncedSettings): void {
  const incoming = narrowPrefs(settings.prefs);
  const store = useStore.getState();
  applyQuietly(() => {
    for (const axis of AXES) {
      const next = incoming[axis.key] ?? axis.def;
      if (axisValue(store.prefs, axis.key) !== next) store.setAxis(axis.key, next);
    }
    if (store.developer !== settings.developer) store.setDeveloper(settings.developer);
  });
  writeSettingsStamp(settings.updatedAt);
}

/** Write `settings` to the account - and when a newer row is already there, take it instead. */
async function save(user: AuthUser, settings: SyncedSettings): Promise<void> {
  const outcome = await pushSettings(user.uid, user.email, user.displayName, settings);
  if (runningFor !== user.uid) return;
  if (outcome === 'stale') {
    const fresher = await fetchSettings(user.uid);
    if (runningFor !== user.uid) return;
    if (fresher) applySettings(fresher);
  }
  useSyncStatus.getState().settingsSynced(Date.now());
}

/**
 * The sign-in step: newest wins between this machine and the account.
 *
 * 🔴 A machine that never recorded a change carries the epoch, so the account's dated
 * choice beats it - a second machine starts where the first left off. When such a
 * machine WINS (the account holds no row yet, or only an undated one), its settings
 * are either untouched - and stay undated, so they can never outrank a real choice
 * made elsewhere - or were chosen before this build kept a stamp, and are dated now,
 * the first time they are recorded.
 */
async function reconcile(user: AuthUser): Promise<void> {
  try {
    const remote = await fetchSettings(user.uid);
    if (runningFor !== user.uid) return;
    let { winner } = reconcileSettings(localSettings(), remote);
    if (remote && winner === remote) {
      applySettings(remote);
    } else if (winner.updatedAt === NEVER && !untouched(winner)) {
      winner = { ...winner, updatedAt: new Date().toISOString() };
      writeSettingsStamp(winner.updatedAt);
    }
    await save(user, winner);
  } catch {
    /* Shown, not thrown: the settings row keeps what was last true. */
  }
}

/** Upload what waits, then what just finished - oldest first, stopping at the first failure. */
async function upload(uid: string, fresh: readonly SyncedRun[]): Promise<void> {
  const ledger = readRunLedger(uid);
  const waiting = ledger.pending
    .map((kept) => readStrippedRun(kept))
    .filter((run): run is SyncedRun => run !== null);
  if (waiting.length === 0 && fresh.length === 0) return;

  const stored = new Set(ledger.uploaded);
  const seen = new Set<string>();
  const failed: SyncedRun[] = [];
  for (const run of [...waiting, ...fresh]) {
    if (stored.has(run.runId) || seen.has(run.runId)) continue;
    seen.add(run.runId);
    if (failed.length > 0 || runningFor !== uid) {
      failed.push(run);
      continue;
    }
    try {
      await pushRun(uid, run);
      stored.add(run.runId);
    } catch {
      failed.push(run);
    }
  }

  /* Signed out meanwhile: `signOut` cleared the ledger, and it must stay cleared. */
  if (runningFor !== uid) return;
  const uploaded = [...stored].slice(-UPLOADED_LIMIT);
  writeRunLedger({ uid, uploaded, pending: failed.slice(-PENDING_LIMIT) });
  useSyncStatus.getState().setUploaded(uploaded);
}

/** Stop when the session ends anywhere - this window's sign-out, or a refresh the account refused. */
function watchSignOut(): void {
  if (signOutWatch) return;
  const sb = supabase();
  if (!sb) return;
  const { data } = sb.auth.onAuthStateChange((event) => {
    if (event !== 'SIGNED_OUT') return;
    /* Deferred: the SDK is still inside its own auth lock while it notifies. */
    window.setTimeout(() => {
      stopSync();
      useStore.getState().setUser(null);
    }, 0);
  });
  signOutWatch = data.subscription;
}

/** Start syncing for `user` - on sign-in, or when a session from an earlier launch is found. */
export async function startSync(user: AuthUser): Promise<void> {
  if (!configuredFeatures().sync || runningFor === user.uid) return;
  if (runningFor !== null) stopSync();
  runningFor = user.uid;
  useSyncStatus.getState().begin(readRunLedger(user.uid).uploaded);
  watchSignOut();
  await serially(() => reconcile(user));
  await serially(() => upload(user.uid, []));
}

/** Stop syncing. Clears nothing on disk - `lib/auth.ts` -> `signOut` owns that. */
export function stopSync(): void {
  runningFor = null;
  if (pushTimer !== null) window.clearTimeout(pushTimer);
  pushTimer = null;
  signOutWatch?.unsubscribe();
  signOutWatch = null;
  useSyncStatus.getState().end();
}

/**
 * The signed-in account - restoring a session an earlier launch left into the store -
 * with sync started for it. Null when this build does not sync or nobody is signed in.
 */
export async function restoreSync(): Promise<AuthUser | null> {
  if (!configuredFeatures().sync) return null;
  let user = useStore.getState().user;
  if (!user) {
    const restored = await currentUser().catch(() => null);
    if (!restored) return null;
    user = useStore.getState().user ?? restored;
    if (useStore.getState().user === null) useStore.getState().setUser(user);
  }
  void startSync(user);
  return user;
}

/** A setting changed here (`sync-hooks.ts` dated it): one write once the changes settle. */
export async function settingsChanged(): Promise<void> {
  const user = await restoreSync();
  if (!user) return;
  if (pushTimer !== null) window.clearTimeout(pushTimer);
  pushTimer = window.setTimeout(() => {
    pushTimer = null;
    void serially(async () => {
      if (runningFor !== user.uid) return;
      try {
        await save(user, localSettings());
      } catch {
        /* the settings row keeps its last good time */
      }
    });
  }, SETTINGS_DEBOUNCE_MS);
}

/** A run finished and History recorded it. Signed out, nothing leaves the machine. */
export async function runFinished(summary: RunSummary, entry: HistoryEntry): Promise<void> {
  const user = await restoreSync();
  if (!user) return;
  /* 🔴 THE ONLY PATH A RUN TAKES TO THE NETWORK: nine fields, each checked, or nothing. */
  const run = stripRun(summary, entry.runId, entry.startedAt, entry.durationMs);
  if (!run) return;
  await serially(() => upload(user.uid, [run]));
}

/**
 * Remove one run summary from the account - the Account screen's Remove. Rejects when
 * the account may still hold it, so the row stays where the person can see it.
 */
export async function removeCloudRun(user: AuthUser, runId: string): Promise<void> {
  await deleteRun(user.uid, runId);
  await serially(() => {
    if (runningFor !== user.uid) return;
    const ledger = readRunLedger(user.uid);
    if (!ledger.uploaded.includes(runId)) return;
    const uploaded = ledger.uploaded.filter((id) => id !== runId);
    writeRunLedger({ ...ledger, uploaded });
    useSyncStatus.getState().setUploaded(uploaded);
  });
}
