/**
 * Tail an ELEVATED child's own log and report out of the run folder.
 *
 * 🔴 WHY THIS EXISTS. `elevation.html` has always said "This window tails the log.
 * You watch it from here." It was not true. The engine's `--elevate` relaunches
 * itself through `Start-Process -Verb RunAs -Wait` (`lib/safety.ps1:524`), so the
 * elevated run is a DIFFERENT process in its own console window: nothing it prints
 * reaches the parent's stdout, and the parent's stdout is the only thing the Rust
 * side streams over `clean:log`. The window showed a handful of lines about asking
 * for permission and then nothing at all, while the work happened out of sight.
 *
 * `read_run_report` and `list_run_files` were both written for exactly this and
 * both had no caller anywhere in `src/` - `list_run_files` says so in its own Rust
 * doc comment: "It exists for the elevated case in particular". This is the caller.
 *
 * 🔴 HOW THE CHILD'S OUTPUT GETS HERE AT ALL. `Invoke-Elevated` passes the parent's
 * whole argument vector to the child, minus `--elevate`, so the child inherits the
 * `--reports-dir` and `--logs-dir` the Rust side pointed at THIS run's folder. Both
 * processes therefore write into one folder, which is what makes a poll possible
 * and is also the trap this module's one rule exists for.
 *
 * 🔴 THE RULE: THE FIRST LOG FILE OBSERVED IS THE PARENT'S, AND IT IS NEVER TAILED.
 * The parent's stdout is already in the pane, line for line, so tailing its log
 * file would print every one of those lines twice. The parent cannot start after
 * its own child, so "first observed" identifies it without parsing anything. The
 * `# Elevated:` header check beside it is the engine's own statement of the same
 * fact and covers the case where this application is itself already running as
 * administrator - `--elevate` is then a no-op, there is no child, and the one file
 * present is both the first observed and elevated, so nothing is tailed and nothing
 * is duplicated.
 */

import { listRunFiles, readReport } from './engine';

/** Slow enough to cost nothing, fast enough that the pane reads as live. */
const POLL_MS = 700;

/** `lib/log.ps1:24` writes this header line into every log it opens. */
const ELEVATED_HEADER = '# Elevated: yes';

export interface RunTail {
  /** Sweep once more, so the last lines the child wrote are not lost, then stop. */
  finish: () => Promise<void>;
}

interface TailState {
  /** File name -> how many complete lines of it have been emitted. */
  emitted: Map<string, number>;
  /** The parent's own log, identified on the first sweep that sees anything. */
  parentLog: string | null;
  running: boolean;
}

function isLog(name: string): boolean {
  return name.toLowerCase().endsWith('.log');
}

async function sweep(
  runId: string,
  state: TailState,
  onLine: (line: string) => void,
): Promise<void> {
  let names: string[];
  try {
    names = await listRunFiles(runId);
  } catch {
    /* The folder does not exist yet, or was removed. Not an error: the run may not
       have started writing. The next sweep asks again. */
    return;
  }

  const logs = names.filter(isLog);
  if (logs.length === 0) return;
  state.parentLog ??= logs[0] ?? null;

  for (const name of logs) {
    if (name === state.parentLog) continue;

    let text: string;
    try {
      text = await readReport(runId, name);
    } catch {
      continue;
    }
    if (!text.includes(ELEVATED_HEADER)) continue;

    /* 🔴 The LAST element is held back on purpose. A line still being written has
       no newline terminating it yet, so emitting it would put half a sentence in
       the pane and then, next sweep, the whole of it again. Splitting on the line
       break and dropping the tail means only complete lines are ever shown. */
    const lines = text.split(/\r?\n/).slice(0, -1);
    const already = state.emitted.get(name) ?? 0;
    for (const line of lines.slice(already)) {
      /* The engine's own header block is credits and metadata that the reader has
         already been told; the run's output starts after it. */
      if (line.trim() === '' || line.startsWith('#')) continue;
      onLine(line);
    }
    state.emitted.set(name, lines.length);
  }
}

/**
 * The three fields of the child's report this pane quotes.
 *
 * Read defensively rather than trusted: this JSON came off disk, was written by a
 * different process, and a missing or wrongly-typed field must produce a quieter
 * line rather than an exception inside a `finally`.
 */
interface ReportTotals {
  total_reclaimed_human?: string;
  steps_run?: number;
  steps_skipped?: number;
}

/**
 * The child wrote its own `report-*.json` (schema 1, `lib/log.ps1` -> `Save-Report`)
 * and no `--json` summary ever reaches this window, so the run's number would
 * otherwise be readable only by opening a file. One line, from the engine's own
 * totals, at the end of the log it belongs to.
 *
 * 🔴 It is the report's OWN human string, not a figure recomputed here. The engine
 * formats bytes its own way and a second formatter would eventually disagree with
 * the file a reader can open.
 */
async function quoteReport(
  runId: string,
  state: TailState,
  onLine: (line: string) => void,
  format: (totals: { amount: string; ran: number; skipped: number }) => string,
): Promise<void> {
  let names: string[];
  try {
    names = await listRunFiles(runId);
  } catch {
    return;
  }
  const reports = names.filter((n) => n.toLowerCase().startsWith('report-'));
  /* Same rule, same reason: the first report in the folder belongs to whichever
     process wrote one first. With no child there is nothing to quote. */
  const child = reports.length > 1 ? (reports[reports.length - 1] ?? null) : null;
  if (child === null || state.emitted.has(child)) return;
  state.emitted.set(child, 1);

  let text: string;
  try {
    text = await readReport(runId, child);
  } catch {
    return;
  }
  let totals: ReportTotals;
  try {
    const doc: unknown = JSON.parse(text);
    if (typeof doc !== 'object' || doc === null) return;
    const maybe: unknown = (doc as { totals?: unknown }).totals;
    if (typeof maybe !== 'object' || maybe === null) return;
    /* No assertion: every field of `ReportTotals` is optional, so an object is
       already assignable to it - and each one is then checked by type below
       rather than trusted. */
    totals = maybe;
  } catch {
    return;
  }
  /* 🔴 Narrowed by TYPE, not coerced. `String(x)` on a field that turned out to be
     an object prints `[object Object]` into the log pane, and `Number(x)` on one
     prints `NaN` - both of which would be this window inventing a fact about
     somebody's elevated run rather than declining to state one. */
  const amount = typeof totals.total_reclaimed_human === 'string' ? totals.total_reclaimed_human : '';
  if (amount === '') return;
  onLine(
    format({
      amount,
      ran: typeof totals.steps_run === 'number' ? totals.steps_run : 0,
      skipped: typeof totals.steps_skipped === 'number' ? totals.steps_skipped : 0,
    }),
  );
}

/**
 * Start tailing. Returns the handle whose `finish()` sweeps once more and stops -
 * the elevated child writes its last lines and its report as it exits, so stopping
 * on the run's own promise without that final read loses the end of the run.
 */
export function tailElevatedRun(
  runId: string,
  onLine: (line: string) => void,
  reportLine: (totals: { amount: string; ran: number; skipped: number }) => string,
): RunTail {
  const state: TailState = { emitted: new Map(), parentLog: null, running: true };

  const timer = window.setInterval(() => {
    if (!state.running) return;
    void sweep(runId, state, onLine);
  }, POLL_MS);

  return {
    finish: async () => {
      state.running = false;
      window.clearInterval(timer);
      await sweep(runId, state, onLine);
      await quoteReport(runId, state, onLine, reportLine);
    },
  };
}
