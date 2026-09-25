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
 * 🔴 A sync failure never blocks a run or the screen. It is logged where it happens
 * (`lib/sync.ts`) and said where the click dummy says it (2026-09-25): the Settings row
 * keeps "Local only" or its last "Synced ..." time and names the step that failed,
 * "N of M runs uploaded" counts only what the account confirmed, and the summaries
 * kept to try again are counted beneath it (`lib/sync-state.ts`).
 *
 * 🔴 WHEN THE ACCOUNT'S NEWER SETTINGS REPLACE THIS MACHINE'S, THIS MACHINE'S SIDE IS
 * KEPT FOR AN UNDO (D40) - unless it was never changed (D41) or nothing actually changes
 * (D42). `noteReplacement` is the one place that decides it.
 */

import { useStore, type HistoryEntry } from '../state/store';
import type { RunSummary } from './cli';
import { configuredFeatures } from './config';
import { currentUser, supabase, type AuthUser } from './auth';
import { errorText, logger } from './logger';
import { AXES, axisValue, type AxisPrefs } from './theme';
import {
  deleteRun,
  fetchSettings,
  pushRun,
  pushSettings,
  readStrippedRun,
  reconcileSettings,
  stripRun,
  type SettingsWrite,
  type SyncedRun,
  type SyncedSettings,
} from './sync';
import { applyQuietly } from './sync-hooks';
import {
  readRunLedger,
  readSettingsStamp,
  writeRunLedger,
  writeSettingsStamp,
  type RunLedger,
} from './sync-local';
import { useSyncStatus, type SettingsStep } from './sync-state';

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
  /* Every step catches its own failures; this is the backstop, and it says so. */
  chain = chain.then(step).catch((error: unknown) => {
    logger.warn('sync: a step failed unexpectedly', { step: 'chain', error: errorText(error) });
  });
  return chain;
}

/** Only the registry's axes, each at one of its own values - a closed vocabulary out, and in. */
function narrowPrefs(prefs: Readonly<Record<string, unknown>>): AxisPrefs {
  const out: AxisPrefs = {};
  for (const axis of AXES) {
    const value = prefs[axis.key];
    if (typeof value === 'string' && axis.values.some((v) => v.value === value))
      out[axis.key] = value;
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

/** Whether two sides differ in any value that syncs - an axis, or developer mode. */
function differs(a: SyncedSettings, b: SyncedSettings): boolean {
  return (
    a.developer !== b.developer ||
    AXES.some((axis) => axisValue(a.prefs, axis.key) !== axisValue(b.prefs, axis.key))
  );
}

/**
 * The account's settings are about to replace this machine's: keep this machine's side
 * for the Undo (SY-03) - but not when it was never changed, which is a fresh machine
 * taking what the Account screen promises, "So a second machine starts where you left
 * off" (D41); and not when no value would change, which is the same choice made on two
 * machines separately and a win on the date alone (D42). A second replacement while one
 * stands keeps the first (`captureReplaced`).
 */
function noteReplacement(replaced: SyncedSettings, applied: SyncedSettings): void {
  if (untouched(replaced) || !differs(replaced, applied)) return;
  useSyncStatus.getState().captureReplaced(replaced);
}

/** Make `settings` this machine's through the store's own actions - one per value that differs. */
function putSettings(settings: SyncedSettings): void {
  const incoming = narrowPrefs(settings.prefs);
  const store = useStore.getState();
  for (const axis of AXES) {
    const next = incoming[axis.key] ?? axis.def;
    if (axisValue(store.prefs, axis.key) !== next) store.setAxis(axis.key, next);
  }
  if (store.developer !== settings.developer) store.setDeveloper(settings.developer);
}

/** Make the account's settings this machine's, quietly: they are not a change made here. */
function applySettings(settings: SyncedSettings): void {
  applyQuietly(() => {
    putSettings(settings);
  });
  writeSettingsStamp(settings.updatedAt);
}

/** A settings round-trip failed at `step` - the Settings row names it (SY-02a); `lib/sync.ts` logged it. */
function settingsFailed(uid: string, step: SettingsStep): void {
  if (runningFor === uid) useSyncStatus.getState().failSettings(step);
}

/**
 * Write `settings` to the account - and when a newer row is already there, take it instead.
 *
 * `accountsOwn` says `settings` IS the account's row, just applied. A write that fails
 * then is not shown: the account already holds those values, and both sides agree - so
 * the round-trip counts, and the row's time moves (SY-02a). Any other failure is kept
 * against the step it happened at.
 */
async function save(user: AuthUser, settings: SyncedSettings, accountsOwn: boolean): Promise<void> {
  let outcome: SettingsWrite;
  try {
    outcome = await pushSettings(user.uid, user.email, user.displayName, settings);
  } catch {
    if (!accountsOwn) settingsFailed(user.uid, 'write');
    else if (runningFor === user.uid) useSyncStatus.getState().settingsSynced(Date.now());
    return;
  }
  if (runningFor !== user.uid) return;
  if (outcome === 'stale') {
    let fresher: SyncedSettings | null;
    try {
      fresher = await fetchSettings(user.uid);
    } catch {
      settingsFailed(user.uid, 'read');
      return;
    }
    if (runningFor !== user.uid) return;
    if (fresher) {
      /* The account turned this write away for a newer row - often a change made here
         seconds ago, on a machine whose clock runs behind. It is replaced, and said. */
      noteReplacement(localSettings(), fresher);
      applySettings(fresher);
    }
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
  let remote: SyncedSettings | null;
  try {
    remote = await fetchSettings(user.uid);
  } catch {
    /* Nothing was applied: this machine keeps its own, and the row says the read failed. */
    settingsFailed(user.uid, 'read');
    return;
  }
  if (runningFor !== user.uid) return;
  const { winner, replaced } = reconcileSettings(localSettings(), remote);
  if (remote && winner === remote) {
    if (replaced) noteReplacement(replaced, remote);
    applySettings(remote);
    await save(user, remote, true);
    return;
  }
  let mine = winner;
  if (mine.updatedAt === NEVER && !untouched(mine)) {
    mine = { ...mine, updatedAt: new Date().toISOString() };
    writeSettingsStamp(mine.updatedAt);
  }
  await save(user, mine, false);
}

/** The stripped runs a ledger keeps waiting, each re-admitted by the gate, in the order they wait. */
function waitingRuns(ledger: RunLedger): SyncedRun[] {
  return ledger.pending
    .map((kept) => readStrippedRun(kept))
    .filter((run): run is SyncedRun => run !== null);
}

/** How many summaries the ledger still owes the account - the count SY-02b states. */
function pendingCount(ledger: RunLedger): number {
  const stored = new Set(ledger.uploaded);
  return new Set(
    waitingRuns(ledger)
      .map((run) => run.runId)
      .filter((id) => !stored.has(id))
  ).size;
}

/** Upload what waits, then what just finished - oldest first, stopping at the first failure. */
async function upload(uid: string, fresh: readonly SyncedRun[]): Promise<void> {
  const ledger = readRunLedger(uid);
  const waiting = waitingRuns(ledger);
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
      /* logged by `pushRun`; kept, stripped, to try again */
      failed.push(run);
    }
  }

  /* Signed out meanwhile: `signOut` cleared the ledger, and it must stay cleared. */
  if (runningFor !== uid) return;
  const uploaded = [...stored].slice(-UPLOADED_LIMIT);
  const pending = failed.slice(-PENDING_LIMIT);
  writeRunLedger({ uid, uploaded, pending });
  useSyncStatus.getState().setRuns(uploaded, pending.length);
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
  const ledger = readRunLedger(user.uid);
  useSyncStatus.getState().begin(ledger.uploaded, pendingCount(ledger));
  watchSignOut();
  await serially(() => reconcile(user));
  await serially(() => upload(user.uid, []));
}

/** Stop syncing - which also ends a replacement notice (D40). Clears nothing on disk: `signOut` owns that. */
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
    const restored = await currentUser().catch((error: unknown) => {
      logger.warn('sync: the saved session could not be read', {
        step: 'session',
        error: errorText(error),
      });
      return null;
    });
    if (!restored) return null;
    user = useStore.getState().user ?? restored;
    if (useStore.getState().user === null) useStore.getState().setUser(user);
  }
  void startSync(user);
  return user;
}

/** A setting changed here (`sync-hooks.ts` dated it, and ended any notice): one write once the changes settle. */
export async function settingsChanged(): Promise<void> {
  const user = await restoreSync();
  if (!user) return;
  if (pushTimer !== null) window.clearTimeout(pushTimer);
  pushTimer = window.setTimeout(() => {
    pushTimer = null;
    void serially(async () => {
      if (runningFor !== user.uid) return;
      await save(user, localSettings(), false);
    });
  }, SETTINGS_DEBOUNCE_MS);
}

/**
 * Put back the settings the account's replaced - the Sync band's Undo (SY-03).
 *
 * 🔴 Through the store's own setters and OUTSIDE `applyQuietly`, so the change is dated
 * now and sent like any other made here. Left undated, the next start would apply the
 * account's side again without a word, and the disclosure's promise would break with
 * nobody told. Being a change, it ends the notice.
 */
export function undoReplacement(): void {
  const { replaced } = useSyncStatus.getState();
  if (!replaced) return;
  putSettings(replaced);
  useSyncStatus.getState().endReplacement();
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
 * the account may still hold it, so the row stays where the person can see it (D39:
 * the person presses again; nothing is queued).
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
