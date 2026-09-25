/**
 * What sync keeps on THIS machine: two small records, in the `{ v: ... }` shape every
 * other persisted value in this window uses (`state/store.ts` -> `readLocal`).
 *
 * 🔴 BOOT-SAFE - NO RUNTIME IMPORT AT ALL. The store reaches the settings stamp at
 * boot through `sync-hooks.ts`, and nothing on that path may drag the Supabase client
 * in behind it.
 *
 * 1. WHEN THE SETTINGS LAST CHANGED HERE - the local half of newest-wins. It is not
 *    cleared on sign-out: the settings stay on the machine, and so does the fact of
 *    when they were chosen. Absent until the first change a syncing build sees.
 * 2. THE RUN LEDGER - which of this machine's runs the account holds, and which
 *    uploads failed and wait to be tried again. That is a trace of the ACCOUNT, so
 *    `lib/auth.ts` -> `signOut` clears it with the account's other local traces.
 */

const SETTINGS_STAMP_KEY = 'windowsweep:settings-updated-at';
const RUN_LEDGER_KEY = 'windowsweep:sync-runs';

function read(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: unknown };
    return parsed.v ?? null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify({ v: value }));
  } catch {
    /* a private window - the session works, it just forgets */
  }
}

/** When the settings last changed on this machine, or null when no change was recorded. */
export function readSettingsStamp(): string | null {
  const stamp = read(SETTINGS_STAMP_KEY);
  return typeof stamp === 'string' && !Number.isNaN(Date.parse(stamp)) ? stamp : null;
}

export function writeSettingsStamp(iso: string): void {
  write(SETTINGS_STAMP_KEY, iso);
}

export interface RunLedger {
  /** The account this ledger describes. One left by another account reads as empty. */
  uid: string;
  /** Run ids this machine has seen stored in the account - the "3" of "3 of 8 runs uploaded". */
  uploaded: string[];
  /** Stripped runs whose upload failed, kept to try again - re-admitted by `readStrippedRun`. */
  pending: unknown[];
}

export function readRunLedger(uid: string): RunLedger {
  const stored = read(RUN_LEDGER_KEY);
  if (typeof stored !== 'object' || stored === null) return { uid, uploaded: [], pending: [] };
  const { uid: owner, uploaded, pending } = stored as Record<string, unknown>;
  if (owner !== uid) return { uid, uploaded: [], pending: [] };
  return {
    uid,
    uploaded: Array.isArray(uploaded)
      ? (uploaded as unknown[]).filter((id): id is string => typeof id === 'string')
      : [],
    pending: Array.isArray(pending) ? (pending as unknown[]) : [],
  };
}

export function writeRunLedger(ledger: RunLedger): void {
  write(RUN_LEDGER_KEY, ledger);
}

export function clearRunLedger(): void {
  try {
    window.localStorage.removeItem(RUN_LEDGER_KEY);
  } catch {
    /* nothing stored, or storage unavailable */
  }
}
