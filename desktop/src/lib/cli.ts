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
  /**
   * The newest write anywhere under this target, ISO 8601 in UTC
   * (`2026-09-08T07:22:52Z`), or `null` when the tree holds nothing datable.
   *
   * Added to the engine for 1.2.0 and it costs no extra walk: under `--json` the
   * size pass is `Get-DirectoryStats`, which returns the newest stamp out of the
   * SAME enumeration that produces the byte count (`lib/scan.ps1:63-75`). A human
   * `--scan` keeps the faster robocopy path and reports no stamp, which is why
   * this is only ever read from a `--json` run.
   *
   * 🔴 It is the DEEPEST newest file, not the folder's own timestamp - self-test
   * check [18a] asserts exactly that, with a fixture whose newer file is nested,
   * because a walk that stopped at the top level would still look like a working
   * timestamp.
   */
  newest_write_utc: string | null;
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
  /**
   * The paths a `--exclude-path` actually kept out of this run, each named once.
   *
   * 🔴 A REFUSAL, not an intention. The engine records one here only when a
   * deletion reached `Get-ProtectionReason` and was turned away on the user's
   * account (`Add-ExcludedRefusal` is deliberately narrow - a protected-path
   * refusal, which is the tool's own account rather than the user's, never lands
   * in this list). So a `--scan` leaves it empty however many exclusions were
   * passed: measured on this machine, two full scans, one with
   * `--exclude-path C:\...\npm-cache` and one without, produced the same 665
   * targets and an empty `excluded` both times.
   *
   * Always present, empty when nothing was refused.
   */
  excluded: string[];
  log_file: string | null;
  report_file: string | null;
}

/**
 * The scan pseudo-section. `--scan` reports one step with `section: -1`, because
 * the scan is not one of the numbered sections - it is the act of measuring them.
 */
export const SCAN_PSEUDO_SECTION = -1;

/**
 * Whether this summary describes a CLEANUP RUN, as opposed to a `--scan` that only
 * measured.
 *
 * 🔴 Read this before showing anything about "the run". A scan produces a perfectly
 * ordinary summary - `mode: "scan"`, one step with `section: -1`, `freed_bytes: 0` -
 * and a consumer that treats it as a finished cleanup tells the reader a run
 * finished and reclaimed nothing, after they pressed a button that deletes nothing.
 * That shipped: the Run screen showed `FINISHED / Reclaimed 0 B.` and a per-section
 * row reading `-1 · -1 · ran · 0 B` after a read-only scan.
 *
 * It is the same defect as the hero's `Reclaim 0 B`, in a third consumer. The first
 * two were centralised into lib/reclaim.ts and this one survived LOOKING fixed,
 * which is the part worth remembering: a figure with three consumers is not fixed
 * when two of them are.
 */
export function isCleanupRun(summary: RunSummary | null): boolean {
  return summary !== null && summary.mode !== 'scan';
}

/**
 * The folder the engine wrote this run's log into, or null when it has not
 * written one yet.
 *
 * 🔴 Read from the engine's own `log_file`, never assembled from a known layout.
 * The command-line tool logs into one fixed folder under `~\.windowsweep`; this
 * window passes `--logs-dir` per run, so the answer is different for every run
 * and only the engine knows it. Verified against a real `--scan --json` on
 * 2026-09-07: `log_file` is populated in scan mode and honours `--logs-dir`.
 */
export function logDirectory(summary: RunSummary | null): string | null {
  const file = summary?.log_file;
  if (!file) return null;
  const cut = Math.max(file.lastIndexOf('\\'), file.lastIndexOf('/'));
  return cut > 0 ? file.slice(0, cut) : file;
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
    /* 🔴 Mapped rather than passed through, so `newest_write_utc` is `string` or
       `null` and never `undefined`. The bundled engine always emits it, but an
       absent field would otherwise reach the idle derivation as `undefined` and
       be read as a date rather than as "no stamp". */
    targets: Array.isArray(doc.targets) ? doc.targets.map(readTarget) : [],
    refusals: Array.isArray(doc.refusals) ? doc.refusals : [],
    excluded: Array.isArray(doc.excluded) ? doc.excluded.map((p) => String(p)) : [],
    log_file: doc.log_file ?? null,
    report_file: doc.report_file ?? null,
  };
}

/** One `targets[]` row, with the 1.2.0 timestamp normalised to `string | null`. */
function readTarget(raw: ScanTarget): ScanTarget {
  return {
    section: Number(raw.section),
    label: String(raw.label),
    path: String(raw.path),
    bytes: Number(raw.bytes),
    newest_write_utc: typeof raw.newest_write_utc === 'string' ? raw.newest_write_utc : null,
  };
}

/** A day in milliseconds - the unit the engine's own idle gate reasons in. */
const DAY_MS = 86_400_000;

/**
 * How long a target has sat unused, in whole days, or `null` when it has no
 * timestamp to measure from.
 *
 * 🔴 A DERIVATION, not a field. The engine reports an instant
 * (`newest_write_utc`); the click dummy and the engine's own `--days` gate both
 * speak in days, so the conversion happens once, here, beside the field it reads.
 * Clamped at zero because a stamp can be newer than this clock by a second or two
 * and `-0 days idle` is not a thing a reader should ever be shown.
 */
export function idleDaysOf(newestWriteUtc: string | null, now: number = Date.now()): number | null {
  if (!newestWriteUtc) return null;
  const at = Date.parse(newestWriteUtc);
  if (Number.isNaN(at)) return null;
  return Math.max(0, Math.floor((now - at) / DAY_MS));
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
