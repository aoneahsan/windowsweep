/**
 * The update gate's one module.
 *
 * The splash screen promises three things happen while it is on screen, and the
 * third - "the updater checks whether a newer build exists" - was copy with
 * nothing behind it: `tauri-plugin-updater` was registered in Rust, `updater:default`
 * was granted in the capability file, and no module under `src/` ever called it.
 * This is that call, in one place, so no screen touches the plugin directly.
 *
 * 🔴 Every Tauri object is resolved INSIDE a function, never during render or at
 * module scope. `check()` reaches `window.__TAURI_INTERNALS__`, which does not
 * exist in an ordinary browser; the recorded failure on this codebase is
 * `Shell.tsx` calling `getCurrentWindow()` during render, which threw on every
 * screen that drew the title bar while typecheck, lint and build stayed green.
 *
 * 🔴 The check is bounded by a DEADLINE as well as by the plugin's own timeout. A
 * request that never settles - a captive portal, a DNS black hole - would
 * otherwise strand a person on a splash screen with no way past it. The gate is a
 * courtesy; reclaiming space has never needed the network, which is what the
 * screen's own disclosure says.
 */

import { check, type Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

import { track } from './analytics';

/** What the check found. `skipped` carries the reason for the report, never for the screen. */
export type UpdateOutcome =
  | { kind: 'available'; handle: UpdateHandle }
  | { kind: 'none' }
  | { kind: 'skipped'; reason: string };

/**
 * The screen's whole view of an update. Narrower than the plugin's `Update` on
 * purpose: a screen needs a version to name and a way to install, and the
 * development stand-in can answer the same shape without pretending to be a
 * `Resource`.
 */
export interface UpdateHandle {
  readonly version: string;
  /**
   * `onProgress` receives 0-100, or `null` when the server sent no
   * `content-length` and the fraction genuinely is not known - a determinate bar
   * drawn from a guess is worse than no bar.
   */
  downloadAndInstall: (onProgress: (percent: number | null) => void) => Promise<void>;
}

/** A few seconds. Long enough for a slow answer, short enough to never feel stuck. */
export const UPDATE_CHECK_TIMEOUT_MS = 4000;

function inTauriWindow(): boolean {
  return '__TAURI_INTERNALS__' in window;
}

/**
 * Resolve the development stand-in, or null.
 *
 * 🔴 A DYNAMIC import behind a build-time constant, exactly as `engine.ts` does
 * it, and for the recorded reason: gating the CALL SITES of a statically imported
 * module still shipped that module's string literals to `dist/`, because the
 * module stayed in the graph. `import.meta.env.DEV` is a literal `false` in a
 * production build, so this function collapses and `dev-updater.ts` is never
 * reached. Verify it by grepping `dist/` for a string unique to that file, with a
 * control string that must be found.
 */
async function devUpdater(): Promise<typeof import('./dev-updater') | null> {
  if (!import.meta.env.DEV) return null;
  if (inTauriWindow()) return null;
  return import('./dev-updater');
}

const TIMED_OUT = Symbol('windowsweep:update-check-deadline');

async function withDeadline<T>(work: Promise<T>, ms: number): Promise<T | typeof TIMED_OUT> {
  let timer = 0;
  const deadline = new Promise<typeof TIMED_OUT>((resolve) => {
    timer = window.setTimeout(() => { resolve(TIMED_OUT); }, ms);
  });
  try {
    return await Promise.race([work, deadline]);
  } finally {
    window.clearTimeout(timer);
  }
}

function handleFor(update: Update): UpdateHandle {
  return {
    version: update.version,
    downloadAndInstall: async (onProgress) => {
      let contentLength = 0;
      let received = 0;
      try {
        await update.downloadAndInstall((event) => {
          if (event.event === 'Started') {
            contentLength = event.data.contentLength ?? 0;
            onProgress(contentLength > 0 ? 0 : null);
            return;
          }
          if (event.event === 'Progress') {
            received += event.data.chunkLength;
            onProgress(contentLength > 0 ? Math.min(100, (received / contentLength) * 100) : null);
            return;
          }
          onProgress(100);
        });
      } catch (error) {
        // Reported here so the screen never names a destination, and rethrown so
        // the screen still owns what the person sees.
        track('update.install.failed', { reason: error instanceof Error ? error.message : String(error) });
        throw error;
      }
    },
  };
}

/**
 * Ask whether a newer build exists.
 *
 * Never throws: every failure - offline, a malformed manifest, a signature that
 * does not verify, a deadline - resolves as `skipped`, because the one thing this
 * must not do is stop the app from starting.
 */
export async function checkForUpdate(timeoutMs: number = UPDATE_CHECK_TIMEOUT_MS): Promise<UpdateOutcome> {
  const dev = await devUpdater();
  if (dev) return dev.devCheckForUpdate();

  // No Tauri window and not a development build: there is no installer to
  // replace, so the honest answer is that there is nothing to offer.
  if (!inTauriWindow()) return { kind: 'none' };

  try {
    const result = await withDeadline(check({ timeout: timeoutMs }), timeoutMs + 1000);
    if (result === TIMED_OUT) {
      track('update.check.skipped', { reason: 'deadline' });
      return { kind: 'skipped', reason: 'deadline' };
    }
    if (!result) return { kind: 'none' };
    track('update.check.available', { version: result.version });
    return { kind: 'available', handle: handleFor(result) };
  } catch (error) {
    // 🔴 Reported through the one consent-gated reporting surface, which scrubs
    // every path before it can leave the machine. There is no logger module in
    // this project and `no-console` is an error, so this is the only channel.
    const reason = error instanceof Error ? error.message : String(error);
    track('update.check.skipped', { reason });
    return { kind: 'skipped', reason };
  }
}

/**
 * Restart into the new build.
 *
 * On Windows the updater's own installer exits this process the moment it
 * launches, so this call is usually never reached there; it is what makes
 * "Install and restart" true on every other platform, and it is harmless where
 * the process is already going away.
 */
export async function restartApp(): Promise<void> {
  if (!inTauriWindow()) return;
  await relaunch();
}
