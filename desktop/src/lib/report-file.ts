/**
 * The report FILE - schema 1, the JSON the engine writes beside every run
 * (`lib/log.ps1` -> `Save-Report`) - read as the Report screen renders it.
 *
 * 🔴 WHY THE FILE AND NOT THE `--json` SUMMARY. The summary on stdout carries three
 * fields per section (`section`, `status`, `freed_bytes`) and is kept in memory for
 * one session. The file carries what the approved screen draws and the summary
 * drops: each step's `note`, `disk.before` and `disk.after`, and the run's own
 * duration - and it outlives the session, so a run chosen from History months later
 * still has its report. The screen's own disclosure promises "this window renders
 * that file", and this module is what makes that sentence true.
 *
 * Read defensively rather than trusted, as `run-tail.ts` reads the same file: it
 * came off disk and was written by a different process, so a missing or
 * wrongly-typed field becomes an empty value here, never an exception in a screen.
 */

/** One `steps[]` entry. `section` is -1 for a scan's single pseudo-step. */
export interface ReportStep {
  n: number;
  section: number;
  title: string;
  status: string;
  freedBytes: number;
  note: string;
}

/** One fixed drive in `disk.before` or `disk.after` (`lib/log.ps1` -> `Get-DriveSnapshot`). */
export interface DriveSnapshot {
  drive: string;
  sizeBytes: number;
  freeBytes: number;
}

export interface RunReport {
  mode: string;
  dryRun: boolean;
  /** The engine's own measurement of the run, in whole seconds. */
  durationSeconds: number | null;
  /** The log this run wrote; the report sits in the same folder (see `reportPathOf`). */
  logFile: string | null;
  disk: { before: DriveSnapshot[]; after: DriveSnapshot[] };
  steps: ReportStep[];
  reclaimedBytes: number;
  estimatedBytes: number;
}

function record(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function num(value: unknown): number {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? (value as unknown[]) : [];
}

function drives(value: unknown): DriveSnapshot[] {
  return list(value).map((raw) => {
    const d = record(raw);
    return { drive: str(d.drive), sizeBytes: num(d.size_bytes), freeBytes: num(d.free_bytes) };
  }).filter((d) => d.drive !== '');
}

/** The engine writes UTF-8 without a BOM; a copy edited by hand may carry one. */
export function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

/**
 * Parse a report file. Throws only when the text is not a JSON object at all - a
 * file that cannot be read as a report is reported as such, not drawn as zeroes.
 */
export function parseReport(text: string): RunReport {
  const raw: unknown = JSON.parse(stripBom(text));
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new Error('the report file is not a JSON object');
  }
  const doc = record(raw);
  const meta = record(doc.meta);
  const disk = record(doc.disk);
  const totals = record(doc.totals);
  const duration = typeof meta.duration_seconds === 'number' ? meta.duration_seconds : null;
  return {
    mode: str(meta.mode),
    dryRun: meta.dry_run === true,
    durationSeconds: duration !== null && Number.isFinite(duration) ? duration : null,
    logFile: typeof meta.log_file === 'string' && meta.log_file !== '' ? meta.log_file : null,
    disk: { before: drives(disk.before), after: drives(disk.after) },
    steps: list(doc.steps).map((rawStep, i) => {
      const s = record(rawStep);
      return {
        n: typeof s.n === 'number' ? s.n : i + 1,
        section: typeof s.section === 'number' ? s.section : -1,
        title: str(s.title),
        status: str(s.status),
        freedBytes: Math.max(0, num(s.freed_bytes)),
        note: str(s.note),
      };
    }),
    reclaimedBytes: Math.max(0, num(totals.total_reclaimed_bytes)),
    estimatedBytes: Math.max(0, num(totals.total_estimated_bytes)),
  };
}

/** The numbered sections of a run, without a scan's pseudo-step. */
export function numberedSteps(steps: readonly ReportStep[]): ReportStep[] {
  return steps.filter((s) => s.section >= 0);
}

export interface StepCounts {
  attempted: number;
  ran: number;
  skipped: number;
  refused: number;
  failed: number;
}

/**
 * The meta line's counts, straight off `steps[]`.
 *
 * `ran` counts `ran` and `dry-run`, the engine's own grouping (`Save-Report`'s
 * `steps_run`). The engine lumps everything else into `steps_skipped`; the screen
 * names a refusal and a failure separately because a run that refused or failed
 * something has to say so in the same line (S-129) - so an unrecognised status is
 * counted as skipped, which keeps the four parts adding up to `attempted`.
 */
export function stepCounts(steps: readonly ReportStep[]): StepCounts {
  const out: StepCounts = { attempted: 0, ran: 0, skipped: 0, refused: 0, failed: 0 };
  for (const s of numberedSteps(steps)) {
    out.attempted += 1;
    if (s.status === 'ran' || s.status === 'dry-run') out.ran += 1;
    else if (s.status === 'refused') out.refused += 1;
    else if (s.status === 'failed') out.failed += 1;
    else out.skipped += 1;
  }
  return out;
}

/**
 * Which `report-*.json` in a run's folder is the report. Normally there is one; an
 * elevated child writes its own beside the parent's log, and its stamp sorts after
 * anything the parent wrote, so the last name is the run's final word.
 */
export function pickReportFile(names: readonly string[]): string | null {
  const reports = names.filter((n) => /^report-.*\.json$/i.test(n)).sort();
  return reports.length > 0 ? (reports[reports.length - 1] ?? null) : null;
}

/** Where a path's last folder separator is - a Windows `\` or a `/` - or -1. */
function lastSeparator(path: string): number {
  return Math.max(path.lastIndexOf('\\'), path.lastIndexOf('/'));
}

/** The last segment of a Windows or POSIX path, or null for none. */
export function fileNameOf(path: string | null): string | null {
  if (!path) return null;
  const cut = lastSeparator(path);
  const name = cut >= 0 ? path.slice(cut + 1) : path;
  return name === '' ? null : name;
}

/**
 * Where the report lives on disk, for *Where this file lives*.
 *
 * 🔴 Composed from two things the engine and the Rust side state, never from a
 * layout this file assumes: the folder of the engine's own `meta.log_file`, and the
 * name `list_run_files` returned. The two sit in one folder by construction -
 * `run_clean` passes the SAME run folder as both `--reports-dir` and `--logs-dir`
 * (`src-tauri/src/engine.rs`). With no log recorded, only the name is claimed.
 */
export function reportPathOf(logFile: string | null, fileName: string): string {
  if (!logFile) return fileName;
  const cut = lastSeparator(logFile);
  if (cut <= 0) return fileName;
  return `${logFile.slice(0, cut)}${logFile.charAt(cut)}${fileName}`;
}
