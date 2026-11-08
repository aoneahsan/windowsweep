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
import { useStore } from '../state/store';

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
const RESUME_CHECK_MIN_GAP_MS = 60 * 1000;

let lastCheckStartedAt = 0;
let pendingCheck: Promise<UpdateOutcome> | null = null;

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
    timer = window.setTimeout(() => {
      resolve(TIMED_OUT);
    }, ms);
  });
  try {
    return await Promise.race([work, deadline]);
  } finally {
    window.clearTimeout(timer);
  }
}

/**
 * One download per found update, shared by the background stage and a press.
 *
 * The splash's sentence promises "carry on and install it later", so layer 1 must
 * not wait for a press: the moment a check finds a build, it is downloaded in the
 * background (`stageForClose`), and "Install and restart" reuses that download
 * rather than starting a second one against the same updater resource.
 */
function downloaderFor(update: Update) {
  let downloading: Promise<void> | null = null;
  let report: ((percent: number | null) => void) | null = null;
  let contentLength = 0;
  let received = 0;
  return {
    /** Point progress at the screen that is now showing it. */
    reportTo(onProgress: (percent: number | null) => void): void {
      report = onProgress;
      if (downloading && contentLength > 0) {
        onProgress(Math.min(99, (received / contentLength) * 100));
      }
    },
    download(): Promise<void> {
      if (downloading) return downloading;
      const work = update.download((event) => {
        if (event.event === 'Started') {
          contentLength = event.data.contentLength ?? 0;
          report?.(contentLength > 0 ? 0 : null);
          return;
        }
        if (event.event === 'Progress') {
          received += event.data.chunkLength;
          report?.(contentLength > 0 ? Math.min(99, (received / contentLength) * 100) : null);
        }
      });
      downloading = work;
      // A failed download is retried by the next press or check, never by a timer.
      work.catch(() => {
        if (downloading === work) downloading = null;
      });
      return work;
    },
  };
}

const downloaders = new WeakMap<Update, ReturnType<typeof downloaderFor>>();
function downloaderOf(update: Update): ReturnType<typeof downloaderFor> {
  let found = downloaders.get(update);
  if (!found) {
    found = downloaderFor(update);
    downloaders.set(update, found);
  }
  return found;
}

function handleFor(update: Update): UpdateHandle {
  return {
    version: update.version,
    downloadAndInstall: async (onProgress) => {
      const downloader = downloaderOf(update);
      try {
        downloader.reportTo(onProgress);
        await downloader.download();
        // Downloading is harmless during a cleanup. Installing is not: on
        // Windows the installer exits the app, so wait until the run settles.
        await waitForQuietMoment();
        await update.install({ restartAfterInstall: true });
        onProgress(100);
      } catch (error) {
        // Reported here so the screen never names a destination, and rethrown so
        // the screen still owns what the person sees.
        track('update.install.failed', {
          reason: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
    },
  };
}

/** The version already downloaded and waiting for the window to close. */
let stagedVersion: string | null = null;
let closeHookFor: Update | null = null;

/**
 * Layer 1 without a click: download now, install when the window closes.
 *
 * Closing is the quiet moment the splash names ("install it later"): the installer
 * runs with no restart, so the next start is the new build and nothing interrupts
 * a person mid-task. A run in progress is never cut short - its close goes ahead
 * on the old build, and the download waits for the next close or the next start.
 *
 * 🔴 THE CLOSE HOOK IS ARMED WHEN THE UPDATE IS FOUND, NOT WHEN ITS DOWNLOAD ENDS
 * (ISSUE-004). The splash calls the version ready the moment the check finds it, so
 * a window closed while the download was still running closed without installing,
 * and the installed 1.4.3 proved it: the update came one start late. A close now
 * waits for the download already under way (`armCloseInstall`).
 */
async function stageForClose(update: Update): Promise<void> {
  if (stagedVersion === update.version) return;
  stagedVersion = update.version;
  closeHookFor = update;
  // Started before the hook is armed, so a press on "Install and restart" always finds
  // this download already running and reuses it.
  const downloading = downloaderOf(update).download();
  try {
    await armCloseInstall();
    await downloading;
    track('update.staged', { version: update.version });
  } catch (error) {
    stagedVersion = null;
    if (closeHookFor === update) closeHookFor = null;
    track('update.stage.failed', {
      reason: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * How long a close waits for a download it finds under way. The window has already
 * gone; past this the app closes without installing, and the next start downloads
 * again, as it did before 1.4.5. An update is a few megabytes, so the ceiling is for
 * a stalled network, not a slow one.
 */
const CLOSE_WAIT_MS = 60 * 1000;

let closeHookArmed = false;
async function armCloseInstall(): Promise<void> {
  if (closeHookArmed) return;
  closeHookArmed = true;
  const { getCurrentWindow } = await import('@tauri-apps/api/window');
  const win = getCurrentWindow();
  await win.onCloseRequested(async (event) => {
    const update = closeHookFor;
    if (!update || useStore.getState().phase === 'running') return;
    event.preventDefault();
    try {
      // The window goes at once, as asked; a download still under way finishes behind
      // it. The same promise the splash's progress reads, so nothing downloads twice.
      await win.hide();
      const downloaded = await withDeadline(downloaderOf(update).download(), CLOSE_WAIT_MS);
      if (downloaded === TIMED_OUT) {
        track('update.close.deadline', { version: update.version });
      } else {
        // On Windows the installer takes this process with it; no relaunch is asked for.
        await update.install({ restartAfterInstall: false });
      }
    } catch (error) {
      track('update.install.failed', {
        reason: error instanceof Error ? error.message : String(error),
      });
    }
    // Reached only when the installer did not end the process: close as asked.
    await win.destroy();
  });
}

function waitForQuietMoment(): Promise<void> {
  if (useStore.getState().phase !== 'running') return Promise.resolve();
  return new Promise((resolve) => {
    const unsubscribe = useStore.subscribe((state) => {
      if (state.phase === 'running') return;
      unsubscribe();
      resolve();
    });
    // The run can finish between the first read and the subscription.
    if (useStore.getState().phase !== 'running') {
      unsubscribe();
      resolve();
    }
  });
}

/**
 * Ask whether a newer build exists.
 *
 * Never throws: every failure - offline, a malformed manifest, a signature that
 * does not verify, a deadline - resolves as `skipped`, because the one thing this
 * must not do is stop the app from starting.
 */
async function performUpdateCheck(
  timeoutMs: number = UPDATE_CHECK_TIMEOUT_MS
): Promise<UpdateOutcome> {
  try {
    const dev = await devUpdater();
    if (dev) return await dev.devCheckForUpdate();

    // No Tauri window and not a development build: there is no installer to
    // replace, so the honest answer is that there is nothing to offer.
    if (!inTauriWindow()) return { kind: 'none' };

    const result = await withDeadline(check({ timeout: timeoutMs }), timeoutMs + 1000);
    if (result === TIMED_OUT) {
      track('update.check.skipped', { reason: 'deadline' });
      return { kind: 'skipped', reason: 'deadline' };
    }
    if (!result) return { kind: 'none' };
    track('update.check.available', { version: result.version });
    void stageForClose(result);
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

/** Share one network request between Splash and lifecycle events. */
export function checkForUpdate(
  timeoutMs: number = UPDATE_CHECK_TIMEOUT_MS
): Promise<UpdateOutcome> {
  if (pendingCheck) return pendingCheck;
  lastCheckStartedAt = Date.now();
  const work = performUpdateCheck(timeoutMs);
  pendingCheck = work;
  const clearPending = () => {
    if (pendingCheck === work) pendingCheck = null;
  };
  void work.then(clearPending, clearPending);
  return work;
}

/**
 * Recheck when the window resumes or reconnects. Release publication itself is
 * signalled by the separate release-record channel, with no periodic requests.
 */
export function watchForUpdates(
  onOutcome: (outcome: UpdateOutcome) => void,
  checkOnStart = true
): () => void {
  let active = true;
  const checkAndReport = () => {
    void checkForUpdate().then((outcome) => {
      if (active) onOutcome(outcome);
    });
  };
  if (checkOnStart) checkAndReport();
  const onResume = () => {
    if (document.visibilityState !== 'visible') return;
    if (Date.now() - lastCheckStartedAt < RESUME_CHECK_MIN_GAP_MS) return;
    checkAndReport();
  };
  document.addEventListener('visibilitychange', onResume);
  window.addEventListener('focus', onResume);
  window.addEventListener('online', checkAndReport);
  return () => {
    active = false;
    document.removeEventListener('visibilitychange', onResume);
    window.removeEventListener('focus', onResume);
    window.removeEventListener('online', checkAndReport);
  };
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
  await waitForQuietMoment();
  await relaunch();
}
