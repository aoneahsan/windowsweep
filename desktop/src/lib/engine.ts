/**
 * The browser side of the engine bridge.
 *
 * One place builds an argument list, one place listens to the three channels the
 * Rust side emits. A screen calls `runSafeBatch` or `scan`; no screen assembles
 * flags of its own, because a flag assembled at a call site is a flag that can
 * disagree with the sentence printed above the button.
 */

import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';

import { parseCatalogue, type Catalogue } from './catalogue';
import { parseProgressLine, parseRunSummary, type Candidate, type RunSummary } from './cli';

/* 🔴 The argument builders moved to `engine-args.ts` when this file crossed the
   project's 500-line ceiling, and are re-exported from here so every existing
   importer keeps one obvious place to reach for "what this window runs". The
   reasoning moved with them, unchanged. */
export {
  commandLine,
  elevatedArgs,
  safeBatchArgs,
  scanArgs,
  scheduleArgs,
  selectionArgs,
  type RunPreferences,
} from './engine-args';

export interface RunFinished {
  run_id: string;
  exit_code: number;
  stdout: string;
  /**
   * True when this run ended because someone pressed Cancel.
   *
   * 🔴 NOT derivable from the exit code, which is the whole reason the Rust side
   * carries it: a killed PowerShell reports a non-zero code exactly like one that
   * failed, and the two need opposite words on screen. It is also what tells the
   * missing `--json` summary apart from the silent-total-failure the guard in
   * `run_clean` exists to catch - a cancelled run has no summary because a person
   * stopped it, which is that guard's own condition met deliberately.
   */
  cancelled: boolean;
}

interface LogLine {
  run_id: string;
  line: string;
}

export interface RunHandlers {
  onLog: (line: string) => void;
  onProgress: (section: number, event: 'start' | 'end', status?: string, freedBytes?: number) => void;
}

/**
 * Resolve the development stand-in, or null.
 *
 * 🔴 A DYNAMIC import behind a build-time constant, not a static one. The first
 * version imported `./dev-engine` at the top of this file and gated only the call
 * sites; Vite eliminated the branches, so `devRun` and `isDevFallback` were gone
 * from `dist/` - and the module's string literals were still there, because it was
 * still in the module graph. Two of five needles present, with a control proving
 * the grep worked. `import.meta.env.DEV` is a literal `false` in a production
 * build, so this whole function collapses and the module is never reached.
 *
 * The lesson generalises past this file: verify a dev-only surface by grepping the
 * OUTPUT for a string unique to it, and include a control that must be found.
 */
async function devEngine(): Promise<typeof import('./dev-engine') | null> {
  if (!import.meta.env.DEV) return null;
  if ('__TAURI_INTERNALS__' in window) return null;
  return import('./dev-engine');
}

export function newRunId(): string {
  // Sortable, and safe as a folder name - the Rust side refuses anything else.
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '-').slice(0, 19);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${suffix}`;
}

/**
 * Read the section catalogue. Called once at boot.
 *
 * In a DEVELOPMENT build running outside a Tauri window there is no `invoke`, so
 * the stand-in answers instead - see `dev-engine.ts` for why that exists and why
 * its gate is a build-time constant. In production the branch does not exist.
 */
export async function loadCatalogue(): Promise<Catalogue> {
  const dev = await devEngine();
  if (dev) {
    const stub = await dev.devRun(['--list', '--json'], newRunId(), () => undefined);
    return parseCatalogue(stub.stdout);
  }
  const finished = await invoke<RunFinished>('run_clean', {
    request: { runId: newRunId(), args: ['--list', '--json'] },
  });
  return parseCatalogue(finished.stdout);
}

/**
 * Run the engine and stream its output. Resolves with the parsed summary.
 *
 * 🔴 The listeners are attached BEFORE the command is invoked. Attaching them
 * afterwards loses every line the engine emits in the gap, and on a fast section
 * that gap is the whole section.
 */
export async function run(
  args: string[],
  runId: string,
  handlers: RunHandlers,
): Promise<{ summary: RunSummary | null; exitCode: number; cancelled: boolean }> {
  const dev = await devEngine();
  if (dev) {
    const finished = await dev.devRun(args, runId, (channel, line) => {
      if (channel === 'clean:log') handlers.onLog(line);
      else {
        const parsed = parseProgressLine(line);
        if (parsed) handlers.onProgress(parsed.section, parsed.event, parsed.status, parsed.freedBytes);
      }
    });
    return {
      summary: parseRunSummary(finished.stdout),
      exitCode: finished.exit_code,
      cancelled: finished.cancelled,
    };
  }

  const unlisten: UnlistenFn[] = [];
  unlisten.push(
    await listen<LogLine>('clean:log', (e) => {
      if (e.payload.run_id === runId) handlers.onLog(e.payload.line);
    }),
  );
  unlisten.push(
    await listen<LogLine>('clean:progress', (e) => {
      if (e.payload.run_id !== runId) return;
      const parsed = parseProgressLine(e.payload.line);
      if (parsed) handlers.onProgress(parsed.section, parsed.event, parsed.status, parsed.freedBytes);
    }),
  );

  try {
    const finished = await invoke<RunFinished>('run_clean', { request: { runId, args } });
    let summary: RunSummary | null = null;
    try {
      summary = parseRunSummary(finished.stdout);
    } catch {
      // The run happened; only its summary was unreadable. The report file is
      // still on disk, so this is reported as such rather than as a failed run.
      summary = null;
    }
    return { summary, exitCode: finished.exit_code, cancelled: finished.cancelled };
  } finally {
    for (const off of unlisten) off();
  }
}

/**
 * What Cancel did, in the Rust side's own words. Shape from
 * `src-tauri/src/cancel.rs` -> `CancelOutcome`.
 *
 * 🔴 `reason` IS THE SENTENCE THE WINDOW SHOWS, and it is deliberately not a key
 * in this app's catalogue. Which of the four things happened - a process was
 * signalled, the run had already ended, it ended in the same instant, or it is
 * being carried out by an elevated window this app cannot reach - is known only on
 * the Rust side, and `cancel.rs` says so in its own comment: the reason is written
 * there "so the reason and the fact cannot drift apart". Keying it here would put
 * the decision in one file and the words in another, which is exactly how a window
 * ends up printing the elevated sentence over an ordinary finished run.
 */
export interface CancelOutcome {
  run_id: string;
  /** True only when a process was actually signalled. */
  cancelled: boolean;
  /** True when the work was handed to an elevated window, which cannot be stopped. */
  elevated: boolean;
  reason: string;
}

/**
 * Ask the Rust side to stop a run this window started.
 *
 * 🔴 This never throws for "there was nothing to stop" - that is an OUTCOME, not
 * an error, and it carries its own sentence. It rejects only when the process was
 * found and could not be signalled, which is the one case a person needs to be
 * told about differently.
 *
 * There is no development stand-in. Outside a Tauri window nothing was ever
 * spawned, so there is no child to kill and inventing an outcome would be the
 * stand-in claiming it stopped something.
 */
export async function cancelRun(runId: string): Promise<CancelOutcome> {
  return invoke<CancelOutcome>('cancel_run', { runId });
}

/**
 * Write the paths a person ticked into this run's own folder, and hand back the
 * path to give `--select-file`.
 *
 * 🔴 The FILE is how a selection travels, not a list of indexes. The engine
 * matches these lines against each interactive section's candidates by PATH
 * (`lib/ui.ps1` -> `Resolve-SelectedPaths`), so a row that moved between the scan
 * and the run matches nothing rather than matching whatever is now in its place -
 * which is the difference between deleting nothing and deleting the wrong thing.
 *
 * The Rust side owns the encoding and the refusals: no BOM, CRLF, and a hard
 * refusal for any path carrying a line break, a NUL or a leading `#`
 * (`src-tauri/src/runs.rs` -> `render_select_file`). It also chooses the file
 * name, so nothing sent from here decides where this lands.
 */
export async function writeSelectFile(runId: string, paths: string[]): Promise<string> {
  return invoke<string>('write_select_file', { runId, paths });
}

/**
 * Read one file out of a run's own folder, by name.
 *
 * 🔴 Its caller is `run-tail.ts`, and until that existed this function had none
 * anywhere in `src/` - dead code since it was written, on a screen whose own copy
 * promised the thing it would have made true. `src-tauri/src/engine.rs` confines it
 * to the run folder and refuses any name carrying a separator, so the webview names
 * a run and a file, never a path.
 */
export async function readReport(runId: string, fileName: string): Promise<string> {
  return invoke<string>('read_run_report', { runId, fileName });
}

/**
 * The reports and logs a run has produced so far, by name.
 *
 * The sibling of `readReport`: that one reads a file the caller can already name,
 * this one is how the caller learns the names. The elevated child chooses its own
 * file names - `lib/log.ps1:9` stamps them with its own PID - so there is no other
 * way for this window to find them.
 */
export async function listRunFiles(runId: string): Promise<string[]> {
  return invoke<string[]>('list_run_files', { runId });
}

export async function appVersion(): Promise<string> {
  return invoke<string>('app_version');
}

/** Candidates the last run offered, ready for the picker. */
export function candidatesOf(summary: RunSummary | null): Candidate[] {
  return summary?.candidates ?? [];
}
