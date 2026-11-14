/**
 * What one offered row IS, read from the fields the engine adds per section (1.5.0, D109, D110).
 *
 * `Add-JsonCandidate -Extra` (`modules/runner.ps1`) appends section-specific fields after the
 * shared ones: 26 says which of three kinds a program is and when it last ran, 27 which of five
 * kinds a leftover is, 30-32 what a row installs or removes. This module is the ONE reader of
 * those fields - `readCandidate` normalises a raw row, and the functions below turn a row into the
 * facts a screen draws - so the Picker, the Sections detail and the selection bar cannot each read
 * `bytes` their own way.
 *
 * 🔴 THE RECLAIM FIGURE NEVER COUNTS AN INSTALL (A4-08). The engine sends the DOWNLOAD size in
 * `bytes` for a Windows Update row and the space FREED for an old driver package, so a sum of
 * `bytes` over an install-mode list would put 87 MB of download into "to reclaim". `reclaimOf` is
 * what a row frees and `downloadOf` what it fetches; nothing else reads `bytes` in install mode.
 */

import type { Candidate, DriverProblem, DriverReport, OldDriver } from './cli';

/** Section 26's three kinds (D109). */
export type ProgramKind = 'desktop' | 'store' | 'broken';
/** Section 27's five kinds - each with its own fate (A4-07). */
export type LeftoverKind = 'folder' | 'shortcut' | 'registry' | 'startup' | 'task';
/**
 * What an install-mode row does (A4-08). 🔴 Never `run`: since A4-15 the engine starts no PC maker's
 * tool - on a ThinkPad its driver-only switch still queued a firmware package - so section 31 offers
 * Windows Update driver installs and old driver packages, and only names the maker's tool in its log.
 */
export type InstallVerb = 'install' | 'remove';

const PROGRAM_KINDS: readonly ProgramKind[] = ['desktop', 'store', 'broken'];
const LEFTOVER_KINDS: readonly LeftoverKind[] = [
  'folder',
  'shortcut',
  'registry',
  'startup',
  'task',
];

/**
 * The install sections whose rows run in the ENGINE's elevated window (D110): installing a Windows
 * update, installing a driver, removing an old driver package.
 * Section 32 is not one - winget runs as the person, and an installer that changes the whole PC
 * shows its own Windows prompt. Keyed by id, which IRON rule 4 freezes (as `DEV_GATED_SECTIONS`).
 */
export const ELEVATED_INSTALL_SECTIONS: ReadonlySet<number> = new Set([30, 31]);

type Raw = Record<string, unknown>;

function text(raw: Raw, key: string): string | undefined {
  const value = raw[key];
  return typeof value === 'string' ? value : undefined;
}

function flag(raw: Raw, key: string): boolean | undefined {
  const value = raw[key];
  return typeof value === 'boolean' ? value : undefined;
}

function whole(raw: Raw, key: string): number | undefined {
  const value = raw[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

/** The optional string extras, copied only when the engine sent a string. */
const TEXT_EXTRAS = [
  'label',
  'modified',
  'root',
  'skip_reason',
  'kind',
  'strategy',
  'ran',
  'publisher',
  'version',
  'uninstaller',
  'target',
  'kb',
  'category',
  'severity',
  'driver_class',
  'driver_provider',
  'driver_date',
  'provider',
  'class',
  'date',
  'id',
  'available',
  'source',
] as const;

/** The optional boolean extras, copied only when the engine sent a boolean. */
const FLAG_EXTRAS = ['selectable', 'needs_admin', 'reboot_likely', 'optional', 'running'] as const;

/**
 * One raw `candidates[]` entry as a `Candidate`, or `null` when it cannot be a row at all.
 *
 * 🔴 A row needs a numeric `section` and a non-empty `path`: the screen keys rows by path and the
 * selection file matches by path, so a row without one could be ticked and never act. Every other
 * field is copied only when it has the type `Candidate` declares, and is otherwise absent -
 * never `undefined` written in, never a number where text is drawn. `idle_days` below zero is the
 * engine's "no age" (`-IdleDays -1`) and becomes `null`, the one spelling the screens test for.
 */
export function readCandidate(value: unknown): Candidate | null {
  if (typeof value !== 'object' || value === null) return null;
  const raw = value as Raw;
  const section = whole(raw, 'section');
  const path = text(raw, 'path');
  if (section === undefined || !path) return null;
  const idle = whole(raw, 'idle_days');
  const project = text(raw, 'project');
  const row: Candidate = {
    section,
    index: whole(raw, 'index') ?? 0,
    path,
    bytes: Math.max(0, whole(raw, 'bytes') ?? 0),
    idle_days: idle === undefined || idle < 0 ? null : idle,
    project: project ?? null,
  };
  const mutable = row as unknown as Raw;
  for (const key of TEXT_EXTRAS) {
    const v = text(raw, key);
    if (v !== undefined) mutable[key] = v;
  }
  for (const key of FLAG_EXTRAS) {
    const v = flag(raw, key);
    if (v !== undefined) mutable[key] = v;
  }
  const reason = text(raw, 'reason');
  if (reason === 'large' || reason === 'old' || reason === 'both') row.reason = reason;
  const basis = text(raw, 'age_basis');
  if (basis === 'write' || basis === 'write+access') row.age_basis = basis;
  return row;
}

/** One `driver_report.problems[]` entry, or null when it is not one. */
function readProblem(value: unknown): DriverProblem | null {
  if (typeof value !== 'object' || value === null) return null;
  const raw = value as Raw;
  const name = text(raw, 'name');
  const code = whole(raw, 'code');
  if (!name || code === undefined) return null;
  return { name, code, problem: text(raw, 'problem') ?? '' };
}

/** One `driver_report.oldest[]` entry, or null when it is not one. */
function readOldDriver(value: unknown): OldDriver | null {
  if (typeof value !== 'object' || value === null) return null;
  const raw = value as Raw;
  const device = text(raw, 'device');
  if (!device) return null;
  return {
    device,
    provider: text(raw, 'provider') ?? '',
    version: text(raw, 'version') ?? '',
    date: text(raw, 'date') ?? '',
  };
}

/** Section 31's report blocks, or `null` when the summary carries none (see `DriverReport`). */
export function readDriverReport(value: unknown): DriverReport | null {
  if (typeof value !== 'object' || value === null) return null;
  const raw = value as Raw;
  const list = <T>(key: string, read: (v: unknown) => T | null): T[] => {
    const items = raw[key];
    if (!Array.isArray(items)) return [];
    return items.flatMap((item: unknown) => {
      const r = read(item);
      return r ? [r] : [];
    });
  };
  return { problems: list('problems', readProblem), oldest: list('oldest', readOldDriver) };
}

/**
 * Section 26's kind. A row with no `kind` is a desktop program - every 26 row before 1.5.0 was one -
 * and a kind this app does not know is `null`, so no badge claims something the engine did not say.
 */
export function programKind(row: Candidate): ProgramKind | null {
  if (row.kind === undefined) return 'desktop';
  return PROGRAM_KINDS.find((k) => k === row.kind) ?? null;
}

/**
 * Section 27's kind. A folder row carries no `kind` (`modules/leftovers.ps1`), and an unknown one is
 * `null`: its fate line would otherwise promise the Recycle Bin for something that may not go there.
 */
export function leftoverKind(row: Candidate): LeftoverKind | null {
  if (row.kind === undefined) return 'folder';
  return LEFTOVER_KINDS.find((k) => k === row.kind) ?? null;
}

/** What an install-mode row does: remove an old driver package, or install. */
export function installVerb(row: Candidate): InstallVerb {
  return row.kind === 'driver-package' ? 'remove' : 'install';
}

/**
 * What the fetching tool will download for one install-mode row: bytes, or `null` when the tool
 * reports no size (winget never does; a Windows Update row may not). 🔴 Unknown is `null`, never 0,
 * so a total can say "plus 1 of unknown size" instead of quietly counting it as nothing. A row that
 * downloads nothing - an old driver package is deleted, not fetched - is 0.
 */
export function downloadOf(row: Candidate): number | null {
  if (installVerb(row) === 'remove') return 0;
  if (row.kind === 'windows-update' || row.kind === 'driver-update') {
    return row.bytes > 0 ? row.bytes : null;
  }
  return null;
}

/**
 * The space one row frees. 🔴 In install mode only an old driver package frees any - an install row
 * adds 0 by construction, so no figure labelled "to reclaim" can ever carry a download.
 *
 * @param install - the row belongs to an install section (`isInstallSection`).
 */
export function reclaimOf(row: Candidate, install: boolean): number {
  if (!install) return row.bytes;
  return installVerb(row) === 'remove' ? row.bytes : 0;
}

/** Section 26's Ran in whole days, or `null` for `none`, `-` or a missing value (drawn as a dash). */
export function ranDays(row: Candidate): number | null {
  const match = /^(\d+)d$/.exec(row.ran ?? '');
  return match ? Number(match[1]) : null;
}

/**
 * The path as a person reads it. The engine's selection-file spelling stays in `row.path` and is
 * what is written and matched; only the drawing changes: a startup entry `<key>::<value>` reads as
 * the registry path `<key>\<value>`, and a task `task:<path>` as Task Scheduler's own `<path>`.
 */
export function displayPath(row: Candidate): string {
  if (row.kind === 'startup') return row.path.replace('::', '\\');
  if (row.kind === 'task' && row.path.startsWith('task:')) return row.path.slice('task:'.length);
  return row.path;
}

/**
 * Whether choosing this row makes the run ask for the engine's elevated window (`--elevate`).
 *
 * @param sectionAdmin - the catalogue's `admin` for the row's section: 27 relaunches elevated even
 *   to list, so every one of its rows does.
 */
export function needsElevatedRun(row: Candidate, sectionAdmin: boolean): boolean {
  if (sectionAdmin) return true;
  if (ELEVATED_INSTALL_SECTIONS.has(row.section)) return true;
  if (row.section !== 26) return false;
  /* A machine-wide program needs it; an engine older than 1.5.0 sent no flag, and then the
     registry hive it was read from is the same fact. */
  return row.needs_admin ?? row.path.startsWith('HKEY_LOCAL_MACHINE');
}
