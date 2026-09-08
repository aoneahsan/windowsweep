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
 * The user's exclusions, as flags.
 *
 * 🔴 ONE place builds these and every argument builder below calls it, because
 * `--exclude-path` is the flag whose failure mode is a person believing a folder
 * is protected when it is not. It is repeatable, which the engine supports
 * (`windowsweep.ps1:170`) and the Rust validator walks rather than deduplicates
 * (`src-tauri/src/args.rs`), so one flag per path is correct.
 *
 * 🔴 It is passed on the read-only `--scan` too. Measured on this machine rather
 * than assumed: two full scans, one with `--exclude-path` and one without, both
 * reported the same 665 targets and an empty `excluded[]`, because a scan never
 * reaches the deletion chokepoint. So it is inert there - and passing it anyway
 * keeps the rule "every invocation carries the exclusions" with no exception for a
 * future call site to get wrong, and keeps the command line in the status bar the
 * whole invocation.
 */
function excludeArgs(excludedPaths: readonly string[]): string[] {
  return excludedPaths.flatMap((path) => ['--exclude-path', path]);
}

/** Read-only. Measures every declared target and deletes nothing. */
export function scanArgs(developer: boolean, excludedPaths: readonly string[]): string[] {
  return [
    '--scan',
    ...(developer ? ['--developer'] : ['--not-developer']),
    ...excludeArgs(excludedPaths),
  ];
}

/**
 * Every preference the Settings screen can set, in one object.
 *
 * 🔴 All three are REQUIRED, deliberately. Optional fields would let a call site
 * forget one, and a forgotten flag means the engine silently falls back to its own
 * `config.json` - so the window would show one number beside a run that used
 * another. TypeScript refusing the call is the only reliable guard, because
 * nothing at runtime can tell a deliberate omission from a missed one.
 */
export interface RunPreferences {
  developer: boolean;
  idleDays: number;
  tempDays: number;
  largeFileMb: number;
}

/**
 * The safe batch, as the engine defines it. `--dry-run` makes it a rehearsal.
 *
 * 🔴 `--days` is passed on EVERY run, never only when it differs from the
 * engine's default of 100. The engine falls back to its own `config.json` when
 * the flag is absent, and a person who has run `windowsweep --days 30` once has
 * changed that file - so the window would be showing 100 beside a run that used
 * 30. Passing it always makes the number on the screen the number that runs.
 *
 * 🔴 `--temp-days` and `--large-file-mb` join it for exactly the same reason, now
 * that the Settings screen can set both. A control that sets a value the run does
 * not receive is a control that lies, and this is the one place that can be true
 * or false for all three at once. `--large-file-mb` governs section 19, which
 * `--yes` never auto-answers - so on a safe batch it is inert rather than wrong,
 * and it is still passed so the command line on screen is the whole invocation.
 */
export function safeBatchArgs(options: {
  dryRun: boolean;
  sections?: number[];
  /**
   * 🔴 REQUIRED, for the same reason the three preferences above are: a call site
   * that could omit the exclusions is a call site that will, and the result is a
   * person watching a folder they marked kept get deleted. TypeScript refusing the
   * call is the only reliable guard - nothing at runtime can tell an empty set
   * from a forgotten one.
   */
  excludedPaths: readonly string[];
} & RunPreferences): string[] {
  const args: string[] = [];
  if (options.sections && options.sections.length > 0) args.push('--only', options.sections.join(','));
  else args.push('--all');
  args.push('--yes');
  if (options.dryRun) args.push('--dry-run');
  args.push(options.developer ? '--developer' : '--not-developer');
  args.push('--days', String(options.idleDays));
  args.push('--temp-days', String(options.tempDays));
  args.push('--large-file-mb', String(options.largeFileMb));
  args.push(...excludeArgs(options.excludedPaths));
  return args;
}

/**
 * The same invocation as a line a person could type, for the status bar.
 *
 * 🔴 Built from the argument list that actually runs, never from a sentence: a
 * hand-written string is free to drift from the flags, and the whole point of the
 * line is that it is what this window does.
 *
 * Two honest omissions, both plumbing the Rust side adds per run and neither of
 * them a mode: `--no-color`, and the `--reports-dir` / `--logs-dir` pair pointing
 * at that run's own folder (`src-tauri/src/engine.rs` -> `run_clean`). `--json`
 * is included because it is what makes the summary readable, and it is prepended
 * there in exactly this position.
 */
export function commandLine(args: string[]): string {
  return ['windowsweep', '--json', ...args].join(' ');
}

/**
 * An interactive section, answered in advance by a person who picked the rows.
 * The selection travels as a file of paths rather than as indexes - see
 * `buildSelectFile` for why.
 */
export function selectionArgs(
  selectFilePath: string,
  sections: number[],
  developer: boolean,
  excludedPaths: readonly string[],
): string[] {
  return [
    '--only',
    sections.join(','),
    '--select-file',
    selectFilePath,
    developer ? '--developer' : '--not-developer',
    ...excludeArgs(excludedPaths),
  ];
}

/**
 * Sections that need an elevated window.
 *
 * 🔴 `--elevate` is the ENGINE's flag. It opens the second window and Windows
 * shows the prompt. This application never requests elevation for itself, which
 * is what the Elevation screen tells the reader, and this is the line that makes
 * it true.
 */
export function elevatedArgs(
  sections: number[],
  dryRun: boolean,
  developer: boolean,
  excludedPaths: readonly string[],
): string[] {
  const args = ['--only', sections.join(','), '--elevate'];
  if (dryRun) args.push('--dry-run');
  else args.push('--yes');
  /* 🔴 This was the one run path of four that did NOT carry the answer, so the
     engine fell back to its own saved config while the window showed a switch. It
     matters here specifically: the Elevation screen selects every admin section and
     section 20 carries `Dev = $true`, so an elevated run really can include a
     dev-flagged section - and it would have used a different answer from the one on
     screen. Found by a docs writer checking a sentence I had asserted, not by a
     gate; scanArgs, safeBatchArgs and selectionArgs always passed it. */
  args.push(developer ? '--developer' : '--not-developer');
  /* 🔴 The elevated run is the one that matters most for this flag: it runs as
     administrator over Windows Update, the component store and the event logs, so
     a forgotten exclusion here is the largest blast radius of the four paths. It is
     also the path the `--developer` defect above lived on, for exactly the same
     reason - a builder nobody looks at twice. */
  args.push(...excludeArgs(excludedPaths));
  return args;
}

export async function readReport(runId: string, fileName: string): Promise<string> {
  return invoke<string>('read_run_report', { runId, fileName });
}

export async function appVersion(): Promise<string> {
  return invoke<string>('app_version');
}

/** Candidates the last run offered, ready for the picker. */
export function candidatesOf(summary: RunSummary | null): Candidate[] {
  return summary?.candidates ?? [];
}
