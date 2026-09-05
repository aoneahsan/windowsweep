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
}

interface LogLine {
  run_id: string;
  line: string;
}

export interface RunHandlers {
  onLog: (line: string) => void;
  onProgress: (section: number, event: 'start' | 'end', status?: string, freedBytes?: number) => void;
}

export function newRunId(): string {
  // Sortable, and safe as a folder name - the Rust side refuses anything else.
  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-').replace('T', '-').slice(0, 19);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${suffix}`;
}

/** Read the section catalogue. Called once at boot; the app has no fallback copy. */
export async function loadCatalogue(): Promise<Catalogue> {
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
): Promise<{ summary: RunSummary | null; exitCode: number }> {
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
    return { summary, exitCode: finished.exit_code };
  } finally {
    for (const off of unlisten) off();
  }
}

/** Read-only. Measures every declared target and deletes nothing. */
export function scanArgs(developer: boolean): string[] {
  return ['--scan', ...(developer ? ['--developer'] : ['--not-developer'])];
}

/** The safe batch, as the engine defines it. `--dry-run` makes it a rehearsal. */
export function safeBatchArgs(options: { dryRun: boolean; developer: boolean; sections?: number[] }): string[] {
  const args: string[] = [];
  if (options.sections && options.sections.length > 0) args.push('--only', options.sections.join(','));
  else args.push('--all');
  args.push('--yes');
  if (options.dryRun) args.push('--dry-run');
  args.push(options.developer ? '--developer' : '--not-developer');
  return args;
}

/**
 * An interactive section, answered in advance by a person who picked the rows.
 * The selection travels as a file of paths rather than as indexes - see
 * `buildSelectFile` for why.
 */
export function selectionArgs(selectFilePath: string, sections: number[], developer: boolean): string[] {
  return [
    '--only',
    sections.join(','),
    '--select-file',
    selectFilePath,
    developer ? '--developer' : '--not-developer',
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
export function elevatedArgs(sections: number[], dryRun: boolean): string[] {
  const args = ['--only', sections.join(','), '--elevate'];
  if (dryRun) args.push('--dry-run');
  else args.push('--yes');
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
