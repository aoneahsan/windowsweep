/**
 * The machine contract with the cleanup engine.
 *
 * 🔴 This module PARSES. It reimplements nothing. Every path the app shows, every
 * byte count, every refusal comes from the engine's own `--json` document; the app
 * never decides what is safe to delete, never walks a directory, and never
 * duplicates a finder. `--json`, `candidates[]`, `targets[]` and the `##windowsweep`
 * progress lines were added to the CLI in 1.1.0 for exactly this consumer.
 *
 * Shapes are transcribed from `modules/runner.ps1` -> `Get-JsonSummary` and
 * `Get-CatalogueJson`, and from `Get-MachineProgressLine`.
 */

/** One section's outcome inside a run summary. */
export interface RunSectionResult {
  section: number;
  status: string;
  freed_bytes: number;
}

/** A row a section offers for selection - section 17/18/19/23 populate this. */
export interface Candidate {
  section: number;
  index: number;
  path: string;
  bytes: number;
  idle_days: number | null;
  project: string | null;
}

/** A declared target with its size on disk, produced by `--scan`. */
export interface ScanTarget {
  section: number;
  label: string;
  path: string;
  bytes: number;
}

/** The whole `--json` document. The engine writes exactly one stdout line. */
export interface RunSummary {
  tool: string;
  version: string;
  mode: string;
  dry_run: boolean;
  elevated: boolean;
  developer: boolean | string;
  freed_bytes: number;
  estimated_bytes: number;
  sections: RunSectionResult[];
  /** Always present, empty when nothing was collected - the engine guarantees the shape. */
  candidates: Candidate[];
  /** Always present, empty when nothing was scanned. */
  targets: ScanTarget[];
  refusals: unknown[];
  log_file: string | null;
  report_file: string | null;
}

/** A parsed `##windowsweep` progress line. `end` carries status and freed bytes. */
export interface ProgressEvent {
  section: number;
  event: 'start' | 'end';
  status?: string;
  freedBytes?: number;
}

const PROGRESS = /^##windowsweep section=(\d+) event=(start|end)(?: status=(\S+) freed_bytes=(\d+))?$/;

/**
 * Parse one line of the engine's stderr. Returns null for anything that is not a
 * progress line, which is most of it: stderr also carries the human log.
 *
 * The engine promises these on stderr and only in `--json` mode, so stdout stays
 * exactly one JSON line. Reading progress from the log text instead would couple
 * the app to wording that is free to change.
 */
export function parseProgressLine(line: string): ProgressEvent | null {
  const m = PROGRESS.exec(line.trim());
  if (!m) return null;
  const section = Number(m[1]);
  if (m[2] === 'start') return { section, event: 'start' };
  return {
    section,
    event: 'end',
    status: m[3] ?? 'unknown',
    freedBytes: Number(m[4] ?? 0),
  };
}

/**
 * Parse the single stdout line `--json` produces.
 *
 * 🔴 Throws rather than returning a partial object: a summary the app cannot read
 * is a bug in one of the two halves, and a half-parsed run silently reporting
 * "0 bytes reclaimed" is worse than an error the user can report.
 */
export function parseRunSummary(stdout: string): RunSummary {
  const line = stdout
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('{'))
    .pop();
  if (!line) throw new Error('the engine produced no JSON summary line');

  const raw: unknown = JSON.parse(line);
  if (typeof raw !== 'object' || raw === null) throw new Error('the JSON summary was not an object');
  const doc = raw as Partial<RunSummary>;
  if (doc.tool !== 'windowsweep') throw new Error(`unexpected tool in summary: ${String(doc.tool)}`);

  return {
    tool: doc.tool,
    version: String(doc.version ?? ''),
    mode: String(doc.mode ?? ''),
    dry_run: Boolean(doc.dry_run),
    elevated: Boolean(doc.elevated),
    developer: doc.developer ?? false,
    freed_bytes: Number(doc.freed_bytes ?? 0),
    estimated_bytes: Number(doc.estimated_bytes ?? 0),
    sections: Array.isArray(doc.sections) ? doc.sections : [],
    candidates: Array.isArray(doc.candidates) ? doc.candidates : [],
    targets: Array.isArray(doc.targets) ? doc.targets : [],
    refusals: Array.isArray(doc.refusals) ? doc.refusals : [],
    log_file: doc.log_file ?? null,
    report_file: doc.report_file ?? null,
  };
}

/** Exit codes the engine documents. Anything else is unexpected and shown as such. */
export const EXIT = {
  ok: 0,
  partial: 1,
  refused: 2,
  usage: 3,
} as const;

/**
 * Group candidates by section, preserving the engine's own ordering inside each
 * group. The picker screen renders from this; it never re-sorts by size, because
 * the engine's order encodes its own idle-day reasoning.
 */
export function candidatesBySection(candidates: Candidate[]): Map<number, Candidate[]> {
  const out = new Map<number, Candidate[]>();
  for (const c of candidates) {
    const list = out.get(c.section);
    if (list) list.push(c);
    else out.set(c.section, [c]);
  }
  return out;
}

/**
 * Build the body of a `--select-file`: one full path per line, UTF-8.
 *
 * 🔴 This is the mechanism a GUI uses, not `--select`. `--select` takes 1-based
 * INDEXES against one prompt's list and is consumed as a QUEUE, one value per
 * interactive section in the order they happen to run (lib/ui.ps1 -> Read-MultiSelect),
 * so a front end using it would have to predict both the ordering and the exact
 * numbering the engine will produce. `--select-file` is matched by path,
 * case-insensitively, against whatever each prompt actually offers - it cannot
 * drift out of alignment, and a line that matches nothing is reported rather than
 * silently selecting the wrong row.
 */
export function buildSelectFile(selected: Candidate[]): string {
  const eol = String.fromCharCode(13, 10);  // the engine reads the file on Windows PowerShell 5.1
  const seen = new Set<string>();
  const lines: string[] = [];
  for (const c of selected) {
    const key = c.path.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(c.path);
  }
  return lines.length > 0 ? lines.join(eol) + eol : '';
}
