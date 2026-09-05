/**
 * A DEVELOPMENT-ONLY stand-in for the Rust side.
 *
 * Why it exists: outside a Tauri window there is no `invoke`, so the app shows its
 * engine-error state on every screen and cannot be compared against the click
 * dummy at all. That made GATE 4 parity wait on a Visual Studio Build Tools
 * install, which is an owner action - a design gate blocked on a 5 GB download is
 * the wrong dependency. With this, every screen renders real shapes in an ordinary
 * browser, and the parity pass can run before the Rust half ever compiles.
 *
 * 🔴 It is gated on `import.meta.env.DEV`, which is a BUILD-TIME constant the
 * bundler deletes - never on a runtime environment variable, which would survive
 * into the production bundle with all of this code behind it. The recorded failure
 * is a project that shipped a dev-only gallery route to production with every gate
 * green, because its gate was a runtime string comparison.
 *
 * 🔴 The gate is the DYNAMIC IMPORT in `engine.ts` -> `devEngine()`, not a check
 * inside this file. A static import with gated call sites was measurably not
 * enough: the identifiers were eliminated and these string literals shipped
 * anyway, because the module was still in the graph. Verify it the only way that
 * counts - grep `dist/` for `DEV_MARKER` below, with a control string that must
 * be found.
 *
 * 🔴 It never pretends to delete anything. Every response is a measurement or a
 * dry-run, so a person poking at a browser build cannot lose a file, and nobody
 * can mistake this for the real engine: every log line it emits says so.
 */

import type { RunFinished } from './engine';

const DEV_MARKER = 'windowsweep-dev-fallback-not-the-real-engine';

/**
 * The real catalogue, captured from `windowsweep --list --json` at 1.1.0.
 *
 * Deliberately a captured artefact rather than a hand-written fixture: a
 * hand-written one drifts from the engine and then the screens are laid out
 * against a catalogue that does not exist. Re-capture it with
 * `node bin/windowsweep.js --list --json` when the engine's catalogue changes.
 */
const CATALOGUE_JSON = String.raw`{"tool":"windowsweep","version":"1.1.0","sections":[{"id":0,"key":"health","title":"System health report","tier":"report","admin":false,"batch":"safe","dev":false},{"id":1,"key":"pkg","title":"Package-manager caches (npm, yarn, pnpm, bun, deno, pip, uv, Composer, NuGet, Cargo, Go, pub)","tier":"rebuilds","admin":false,"batch":"safe","dev":true},{"id":2,"key":"build","title":"Build-tool caches (Gradle, Maven, Android, Unity, JetBrains)","tier":"rebuilds","admin":false,"batch":"safe","dev":true},{"id":3,"key":"runners","title":"Test-runner browsers (Cypress, Playwright, Puppeteer) - keep newest","tier":"rebuilds","admin":false,"batch":"safe","dev":true},{"id":4,"key":"avd","title":"Android emulators (AVDs) idle N+ days","tier":"slow","admin":false,"batch":"optin","dev":true},{"id":5,"key":"docker","title":"Docker: dangling images, build cache, unused images older than N days","tier":"rebuilds","admin":false,"batch":"safe","dev":true},{"id":6,"key":"editors","title":"Editor caches (VS Code, Cursor, Windsurf, Visual Studio) + superseded extensions","tier":"rebuilds","admin":false,"batch":"safe","dev":false},{"id":7,"key":"browsers","title":"Browser caches (Chrome, Edge, Brave, Vivaldi, Opera, Chromium, Firefox)","tier":"rebuilds","admin":false,"batch":"safe","dev":false},{"id":8,"key":"apps","title":"Desktop app caches (Discord, Slack, Teams, Zoom, Spotify, Postman, Figma, ...)","tier":"rebuilds","admin":false,"batch":"safe","dev":false},{"id":9,"key":"wincaches","title":"Windows user caches (INetCache, WER, crash dumps, shader caches, UWP temp)","tier":"rebuilds","admin":false,"batch":"safe","dev":false},{"id":10,"key":"temp","title":"User temp files older than N days","tier":"rebuilds","admin":false,"batch":"safe","dev":false},{"id":11,"key":"recycle","title":"Empty the Recycle Bin - PERMANENT","tier":"permanent","admin":false,"batch":"deep","dev":false},{"id":12,"key":"wu","title":"Windows Update + system temp (SoftwareDistribution, Delivery Optimization, Windows\\Temp, CBS logs)","tier":"rebuilds","admin":true,"batch":"safe","dev":false},{"id":13,"key":"cleanmgr","title":"Windows Disk Cleanup engine (cleanmgr, curated handlers)","tier":"rebuilds","admin":true,"batch":"safe","dev":false},{"id":14,"key":"dism","title":"Component store cleanup (DISM StartComponentCleanup) - slow","tier":"rebuilds","admin":true,"batch":"optin","dev":false},{"id":15,"key":"hiberfil","title":"Hibernation file (off / reduced)","tier":"config","admin":true,"batch":"deep","dev":false},{"id":16,"key":"eventlogs","title":"Clear Windows Event Logs - PERMANENT","tier":"permanent","admin":true,"batch":"deep","dev":false},{"id":17,"key":"projects","title":"Stale project build artefacts (node_modules, dist, .next, target, ...)","tier":"rebuilds","admin":false,"batch":"interactive","dev":true},{"id":18,"key":"partials","title":"Partial / orphan downloads -> Recycle Bin","tier":"recycle","admin":false,"batch":"interactive","dev":false},{"id":19,"key":"large","title":"Large stale personal files (Downloads) -> Recycle Bin","tier":"recycle","admin":false,"batch":"interactive","dev":false},{"id":20,"key":"vhdx","title":"Docker Desktop / WSL disk image compaction (stops Docker + WSL)","tier":"config","admin":true,"batch":"deep","dev":true},{"id":21,"key":"diskusage","title":"Disk usage report (largest entries, drives, disk images)","tier":"report","admin":false,"batch":"safe","dev":false},{"id":22,"key":"globals","title":"Globally installed packages audit (npm, pnpm, yarn, bun, deno) - report only","tier":"report","admin":false,"batch":"safe","dev":true},{"id":23,"key":"orphaned","title":"Orphaned application data under AppData -> Recycle Bin","tier":"recycle","admin":false,"batch":"interactive","dev":false},{"id":24,"key":"programs","title":"Installed programs not modified for N+ days - report only","tier":"report","admin":false,"batch":"safe","dev":false},{"id":25,"key":"startup","title":"Startup items audit (Run keys, Startup folders, logon tasks) - report only","tier":"report","admin":false,"batch":"safe","dev":false}],"safe_batch":[0,1,2,3,5,6,7,8,9,10,21],"safe_batch_admin":[12,13],"profiles":{"system":[12,13,14],"minimal":[7,8,9,10],"deep":[0,1,2,3,5,6,7,8,9,10,12,13,14,21],"cache-only":[1,2,3,6,7,8,9],"dev":[1,2,3,4,5,6,17],"audit":[0,21,22,24,25]},"walkthrough":[1,2,3,4,5,6,7,8,9,10,11,17,18,19,23],"walkthrough_admin":[12,13,14]}`;

const SAFE = [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 21];

/** Plausible sizes, so a treemap and a table have real proportions to lay out. */
const BYTES: Record<number, number> = {
  0: 0, 1: 4.21e9, 2: 1.13e9, 3: 8.4e8, 5: 6.9e9, 6: 3.02e8,
  7: 7.4e9, 8: 3.73e8, 9: 8.1e7, 10: 9.4e8, 21: 0,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => { window.setTimeout(resolve, ms); });
}

/**
 * Answer a `run_clean` the way the Rust side would, including the stderr stream.
 * `emit` receives one line at a time so the Run screen exercises its real
 * subscription path rather than a shortcut.
 */
export async function devRun(
  args: string[],
  runId: string,
  emit: (channel: 'clean:log' | 'clean:progress', line: string) => void,
): Promise<RunFinished> {
  if (args.includes('--list')) {
    return { run_id: runId, exit_code: 0, stdout: CATALOGUE_JSON };
  }

  const scan = args.includes('--scan');
  const dryRun = args.includes('--dry-run');
  const only = args.includes('--only') ? args[args.indexOf('--only') + 1] : null;
  const sections = only
    ? only.split(',').flatMap((part) => {
        const [a, b] = part.split('-').map(Number);
        if (a === undefined) return [];
        return b === undefined ? [a] : Array.from({ length: b - a + 1 }, (_, i) => a + i);
      })
    : SAFE;

  emit('clean:log', `windowsweep 1.1.0 - ${DEV_MARKER}`);
  emit('clean:log', 'nothing on this machine is read, measured or deleted by this stand-in');

  let total = 0;
  for (const id of sections) {
    emit('clean:progress', `##windowsweep section=${String(id)} event=start`);
    await delay(90);
    const bytes = BYTES[id] ?? 0;
    const status = bytes > 0 ? 'ran' : 'skipped';
    total += bytes;
    emit('clean:log', `> section ${String(id)}: ${status}`);
    emit(
      'clean:progress',
      `##windowsweep section=${String(id)} event=end status=${status} freed_bytes=${String(bytes)}`,
    );
  }

  const summary = {
    tool: 'windowsweep',
    version: '1.1.0',
    mode: scan ? 'scan' : 'all',
    // 🔴 Always a rehearsal. This stand-in has no path that reports a real deletion.
    dry_run: true,
    elevated: false,
    developer: args.includes('--developer'),
    freed_bytes: 0,
    estimated_bytes: total,
    sections: sections.map((id) => ({
      section: id,
      status: (BYTES[id] ?? 0) > 0 ? 'ran' : 'skipped',
      freed_bytes: 0,
    })),
    candidates:
      only && sections.some((s) => [17, 18, 19, 23].includes(s))
        ? [
            { section: 17, index: 1, path: 'C:\\dev\\old-api\\node_modules', bytes: 1.9e9, idle_days: 214, project: 'old-api' },
            { section: 17, index: 2, path: 'C:\\dev\\prototype\\node_modules', bytes: 8.2e8, idle_days: 402, project: 'prototype' },
            { section: 18, index: 1, path: 'C:\\Users\\example\\Downloads\\installer.part', bytes: 4.1e8, idle_days: 61, project: null },
          ]
        : [],
    targets: sections.map((id) => ({
      section: id,
      label: `section ${String(id)}`,
      path: `C:\\example\\section-${String(id)}`,
      bytes: BYTES[id] ?? 0,
    })),
    refusals: [],
    log_file: null,
    report_file: null,
  };

  if (dryRun || scan) emit('clean:log', 'this was a rehearsal - nothing was written');
  return { run_id: runId, exit_code: 0, stdout: JSON.stringify(summary) };
}
