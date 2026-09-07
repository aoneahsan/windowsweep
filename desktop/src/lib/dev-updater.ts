/**
 * A DEVELOPMENT-ONLY stand-in for the update check.
 *
 * Why it exists: the update band is approved design that only appears when a
 * published release is newer than the running build, so in an ordinary browser -
 * where GATE 4's screenshot pairs are taken - it could never be seen at all. The
 * click dummy makes the same argument about its own offline state: "The offline
 * branch is a real state, so it is reachable rather than described". This makes
 * both branches reachable, driven by the same query string the dummy uses.
 *
 *   ?offline=1   the check cannot reach the network - the skipped note
 *   ?update=0    no update - boot straight through
 *   (default)    an update is ready, the dummy's own demo version
 *
 * 🔴 Gated exactly like `dev-engine.ts`: the gate is the DYNAMIC import in
 * `updater.ts`, behind `import.meta.env.DEV`, which the bundler deletes. A static
 * import with gated call sites was measurably not enough on this codebase - the
 * identifiers were eliminated and the string literals shipped anyway. Verify with
 * `grep -rl DEV_UPDATER_MARKER dist/` returning nothing, plus a control string
 * that must be found.
 *
 * 🔴 It installs nothing. `downloadAndInstall` moves a bar and resolves; the
 * restart is a no-op outside a Tauri window, so nobody can mistake this for the
 * real updater.
 */

import type { UpdateHandle, UpdateOutcome } from './updater';

const DEV_UPDATER_MARKER = 'windowsweep-dev-updater-not-a-real-release';

/** The version the click dummy shows on this band. `demo-data`, per its own ledger. */
const DEMO_VERSION = '1.2.0';

function flag(name: string): string | null {
  // Hash history keeps the app's route after `#`, so a flag may sit in either
  // half of the URL. Both are read rather than guessing which one was typed.
  const search = new URLSearchParams(window.location.search);
  if (search.has(name)) return search.get(name);
  const hash = window.location.hash;
  const q = hash.indexOf('?');
  if (q === -1) return null;
  return new URLSearchParams(hash.slice(q + 1)).get(name);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => { window.setTimeout(resolve, ms); });
}

function devHandle(): UpdateHandle {
  return {
    version: DEMO_VERSION,
    downloadAndInstall: async (onProgress) => {
      for (let percent = 0; percent <= 100; percent += 8) {
        onProgress(percent);
        await delay(120);
      }
      onProgress(100);
    },
  };
}

export async function devCheckForUpdate(): Promise<UpdateOutcome> {
  // The real check costs a round trip; this one costs enough to be seen.
  await delay(420);

  if (flag('offline') === '1') {
    return { kind: 'skipped', reason: DEV_UPDATER_MARKER };
  }
  if (flag('update') === '0') {
    return { kind: 'none' };
  }
  return { kind: 'available', handle: devHandle() };
}
