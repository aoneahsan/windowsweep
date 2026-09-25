/**
 * Settings and run history across machines, through Supabase.
 *
 * 🔴 WHAT IS NEVER SENT: a file path, a folder name, a drive label, a machine
 * name, a Windows user name, or the contents of anything. `stripRun` below is the
 * narrowing, and the schema has no column that could hold one - so the promise is
 * kept twice, once in the client and once by a server that would refuse a wider
 * row from a client that tried.
 *
 * 🔴 AND THE NARROWING CHECKS VALUES, NOT ONLY FIELD NAMES (TASK-013). Picking nine
 * fields keeps `candidates[]`, `targets[]`, `excluded[]` and `log_file` behind; it
 * does not stop a kept STRING carrying something it should not. So each string is
 * held to its own closed vocabulary - the run id to `newRunId`'s stamp-and-suffix,
 * the start to an ISO instant, the mode to the engine's four cleanup words - and a
 * run that fails any of them is not sent at all.
 *
 * 🔴 Every list read is paginated - **limit 20**, keyset by `started_at`, never a
 * whole table. And every query filters on `user_id`, the same column its RLS
 * policy compares: RLS *filters* rather than refuses, so a missing owner filter
 * is a 200 with someone else's rows absent rather than an error, which is
 * invisible to any test asserting 2xx. The filter is what makes the read provable
 * from its own constraints instead of trusting the server to narrow it.
 *
 * 🔴 NO `.upsert()` ON `user_settings`, and that is a hard constraint rather than
 * a preference. PostgREST builds `ON CONFLICT DO UPDATE SET` from every payload
 * key and Postgres checks the privilege at PLAN time; `user_id` is deliberately
 * outside the column-scoped UPDATE grant, so an upsert carrying it is refused
 * outright with `permission denied for table user_settings` - naming the TABLE,
 * not the column, which reads exactly like a broken policy. This inserts and
 * handles `23505`.
 *
 * 🔴 EVERY FAILURE IS LOGGED HERE, AT ITS SOURCE, with the step it happened at and
 * PostgREST's own message (`failure` below) - once, before it is thrown to whichever
 * screen says so in words. The message names a table or a constraint, never a value.
 */

import type { RunSummary } from './cli';
import { supabase } from './auth';
import { logger } from './logger';

/** The only run fields that ever leave the machine. */
export interface SyncedRun {
  runId: string;
  startedAt: string;
  mode: string;
  dryRun: boolean;
  elevated: boolean;
  sections: number[];
  freedBytes: number;
  estimatedBytes: number;
  durationMs: number;
}

export interface SyncedSettings {
  prefs: Record<string, string>;
  developer: boolean;
  updatedAt: string;
}

/** A WRITE with no client is a caller's mistake, not a quiet success to record as synced. */
const NOT_CONFIGURED = 'sync is not configured in this build';

/** The steps a failure is logged against - one per request this module makes. */
type SyncStep = 'settings read' | 'settings write' | 'run list read' | 'run upload' | 'run remove';

/** Log a failure with its step, and hand back the error to throw. */
function failure(step: SyncStep, message: string): Error {
  logger.warn(`sync: ${step} failed`, { step, error: message });
  return new Error(message);
}

/**
 * `lib/engine.ts` -> `newRunId`: a UTC stamp cut to the second, then up to six
 * base-36 characters from `Math.random`. Nothing a person typed and nothing read off
 * the machine. If that format ever changes, runs stop syncing - the safe direction -
 * rather than this pattern being widened to let them through.
 */
const RUN_ID = /^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-[0-9a-z]{1,12}$/;

/** `Date.prototype.toISOString()` - how `state/store.ts` records when a run began. */
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

/**
 * The engine's cleanup modes, and only those. `windowsweep.ps1` gives `$ws.Mode` a
 * literal and nothing else (lines 128-158), and these four are the modes it cleans
 * in (line 301). A profile's NAME goes to `$ws.Profile`, never into the mode.
 */
const CLEANUP_MODES: ReadonlySet<string> = new Set(['walkthrough', 'menu', 'all', 'only']);

/** `duration_ms` is a Postgres `integer`; `sections` is `smallint[]`. */
const MAX_DURATION_MS = 2_147_483_647;
const MAX_SECTION = 32_767;

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}

/** Section NUMBERS only - a frozen public contract, never a label. */
function sectionNumbers(value: unknown): number[] | null {
  if (!Array.isArray(value)) return null;
  const out: number[] = [];
  for (const item of value as unknown[]) {
    if (!isCount(item) || item > MAX_SECTION) return null;
    out.push(item);
  }
  return out;
}

/**
 * 🔴 THE ONE GATE a run passes on its way to `pushRun`: nine fields, each held to its
 * vocabulary, copied into a fresh object so nothing else can ride along with it.
 */
function narrowRun(c: Readonly<Record<string, unknown>>): SyncedRun | null {
  const { runId, startedAt, mode, dryRun, elevated, freedBytes, estimatedBytes, durationMs } = c;
  const sections = sectionNumbers(c.sections);
  if (typeof runId !== 'string' || !RUN_ID.test(runId)) return null;
  if (typeof startedAt !== 'string' || !ISO_INSTANT.test(startedAt)) return null;
  if (typeof mode !== 'string' || !CLEANUP_MODES.has(mode)) return null;
  if (typeof dryRun !== 'boolean' || typeof elevated !== 'boolean' || sections === null) return null;
  if (!isCount(freedBytes) || !isCount(estimatedBytes)) return null;
  if (!isCount(durationMs) || durationMs > MAX_DURATION_MS) return null;
  return { runId, startedAt, mode, dryRun, elevated, sections, freedBytes, estimatedBytes, durationMs };
}

/**
 * 🔴 The narrowing. Everything not named here is dropped - candidates, targets,
 * exclusions and the log and report paths included - and what IS named must pass
 * `narrowRun`. `null` means the run is not sent.
 */
export function stripRun(
  summary: RunSummary,
  runId: string,
  startedAt: string,
  durationMs: number,
): SyncedRun | null {
  return narrowRun({
    runId,
    startedAt,
    mode: summary.mode,
    dryRun: summary.dry_run,
    elevated: summary.elevated,
    sections: summary.sections.map((s) => s.section),
    freedBytes: summary.freed_bytes,
    estimatedBytes: summary.estimated_bytes,
    durationMs,
  });
}

/**
 * A stripped run read back from this machine's own storage, to try an upload again.
 * It passes the same gate a second time, so storage edited by hand cannot widen what
 * `pushRun` is handed.
 */
export function readStrippedRun(value: unknown): SyncedRun | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  return narrowRun(value as Record<string, unknown>);
}

interface SettingsRow {
  prefs: Record<string, string> | null;
  developer: boolean;
  settings_updated_at: string;
}

export async function fetchSettings(userId: string): Promise<SyncedSettings | null> {
  const sb = supabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from('user_settings')
    .select('prefs, developer, settings_updated_at')
    // the same column the policy reads
    .eq('user_id', userId)
    .maybeSingle<SettingsRow>();
  if (error) throw failure('settings read', `settings could not be read: ${error.message}`);
  if (!data) return null;
  return {
    prefs: data.prefs ?? {},
    developer: data.developer,
    updatedAt: data.settings_updated_at,
  };
}

/** How a settings write ended: stored, or turned away because the account holds a newer row. */
export type SettingsWrite = 'saved' | 'stale';

/**
 * Write the settings row: insert once, update thereafter.
 *
 * The `23505` branch is not defensive coding around an unlikely case - it is the
 * ordinary path on every machine after the first, and it exists because the
 * upsert that would have replaced it is refused at plan time by the column-scoped
 * UPDATE grant. See the header.
 */
export async function pushSettings(
  userId: string,
  email: string,
  displayName: string | null,
  settings: SyncedSettings,
): Promise<SettingsWrite> {
  const sb = supabase();
  if (!sb) throw failure('settings write', NOT_CONFIGURED);

  const now = new Date().toISOString();
  /* An address the session did not carry is left out, never written as '' over the stored one. */
  const who = { ...(email ? { email } : {}), display_name: displayName };
  const insert = await sb.from('user_settings').insert({
    user_id: userId,
    ...who,
    prefs: settings.prefs,
    developer: settings.developer,
    settings_updated_at: settings.updatedAt,
    last_seen_at: now,
  });

  if (!insert.error) return 'saved';
  // 23505 = unique_violation: the row already exists, which is the normal case.
  if (insert.error.code !== '23505') {
    throw failure('settings write', `settings could not be saved: ${insert.error.message}`);
  }

  // 🔴 `user_id` is NOT in this payload - it is outside the UPDATE grant, and
  // sending it would make Postgres refuse the whole statement at plan time.
  const update = await sb
    .from('user_settings')
    .update(
      {
        ...who,
        prefs: settings.prefs,
        developer: settings.developer,
        settings_updated_at: settings.updatedAt,
        last_seen_at: now,
      },
      { count: 'exact' },
    )
    .eq('user_id', userId)
    /* 🔴 NEVER OVER A NEWER ROW. Between this machine reading the account and writing
       it, another machine may have written a later change - and newest wins, so that
       row stands and the caller takes it instead. Nothing would SAY so: an update the
       filter excludes is a 200 with 0 rows, which is why the count is read. */
    .lte('settings_updated_at', settings.updatedAt);
  if (update.error) throw failure('settings write', `settings could not be saved: ${update.error.message}`);
  return update.count === 1 ? 'saved' : 'stale';
}

/**
 * Newest wins, and the loser is offered back.
 *
 * 🔴 The undo is not decoration. Two machines editing settings is the ordinary
 * case for this product - one desktop, one laptop - and silently discarding the
 * older side means a person changes a setting, walks to the other machine and
 * finds it reverted with no explanation. The caller keeps `replaced` for the
 * Account screen's Sync band, which states the replacement on its Settings row with
 * an Undo beside it, and for Home's one line while it stands (D40,
 * `lib/sync-session.ts` -> `noteReplacement`). The app has no toast.
 */
export function reconcileSettings(
  local: SyncedSettings,
  remote: SyncedSettings | null,
): { winner: SyncedSettings; replaced: SyncedSettings | null } {
  if (!remote) return { winner: local, replaced: null };
  if (Date.parse(remote.updatedAt) > Date.parse(local.updatedAt)) {
    return { winner: remote, replaced: local };
  }
  return { winner: local, replaced: null };
}

export const RUNS_PAGE_SIZE = 20;

interface RunRow {
  run_id: string;
  started_at: string;
  mode: string;
  dry_run: boolean;
  elevated: boolean;
  sections: number[];
  freed_bytes: number;
  estimated_bytes: number;
  duration_ms: number;
}

/**
 * What one list reads of the account's runs, narrowed BY THE DATABASE - so the count
 * the first page carries is the list's own, never a number worked out from the rows.
 */
export interface RunsFilter {
  /**
   * Run ids to leave out: History passes the runs this window holds, so what comes back
   * came from another machine. Each id is held to `newRunId`'s vocabulary on the way
   * into the query, so a hand-edited History cannot write the filter's syntax.
   */
  excluding?: readonly string[];
  /** Dry-runs only - History's `Dry-runs` chip. */
  dryRunsOnly?: boolean;
}

/** One page of runs, the cursor to the next, and - on the first page only - how many there are. */
export interface RunsPage {
  runs: SyncedRun[];
  nextCursor: string | null;
  total: number | null;
}

/**
 * One page of a person's own runs, newest first.
 *
 * Keyset, not offset: `before` is the previous page's oldest `startedAt`. An
 * offset walk re-reads every skipped row, and the cost grows with the history
 * rather than with the page.
 *
 * The FIRST page also says how many there are, counted by the database - never by
 * reading the rows (`~/.claude/rules/data-fetch-budget.md`). Later pages carry
 * `total: null`: the count is the first page's answer, and asking again per page
 * would pay for the same number twenty rows at a time.
 *
 * `filter` narrows the rows and that count together, server-side. Its exclusion list
 * is bounded by History's own cap of 200 runs, which keeps the query string in the
 * low kilobytes.
 */
export async function fetchRuns(userId: string, before?: string, filter: RunsFilter = {}): Promise<RunsPage> {
  const sb = supabase();
  if (!sb) return { runs: [], nextCursor: null, total: 0 };

  let runsQuery = sb
    .from('runs')
    .select(
      'run_id, started_at, mode, dry_run, elevated, sections, freed_bytes, estimated_bytes, duration_ms',
      before ? {} : { count: 'exact' },
    )
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(RUNS_PAGE_SIZE);
  if (before) runsQuery = runsQuery.lt('started_at', before);
  const excluded = (filter.excluding ?? []).filter((id) => RUN_ID.test(id));
  if (excluded.length > 0) runsQuery = runsQuery.not('run_id', 'in', `(${excluded.join(',')})`);
  if (filter.dryRunsOnly) runsQuery = runsQuery.eq('dry_run', true);

  const { data, error, count } = await runsQuery;
  if (error) throw failure('run list read', `run history could not be read: ${error.message}`);

  const rows = (data ?? []) as RunRow[];
  const runs: SyncedRun[] = rows.map((r) => ({
    runId: r.run_id,
    startedAt: r.started_at,
    mode: r.mode,
    dryRun: r.dry_run,
    elevated: r.elevated,
    sections: r.sections,
    freedBytes: r.freed_bytes,
    estimatedBytes: r.estimated_bytes,
    durationMs: r.duration_ms,
  }));

  // A full page means there may be more; a short page is the end.
  const last = runs.at(-1);
  return {
    runs,
    nextCursor: runs.length === RUNS_PAGE_SIZE && last ? last.startedAt : null,
    total: before ? null : count,
  };
}

/**
 * Store one run. 🔴 Its only argument is a `SyncedRun`, and the only producers of
 * one are `stripRun` and `readStrippedRun` - both through `narrowRun`. The row is
 * built here from the nine named fields, so no other property of the object can
 * reach the request either.
 */
export async function pushRun(userId: string, run: SyncedRun): Promise<void> {
  const sb = supabase();
  if (!sb) throw failure('run upload', NOT_CONFIGURED);
  const { error } = await sb.from('runs').insert({
    run_id: run.runId,
    user_id: userId,
    started_at: run.startedAt,
    mode: run.mode,
    dry_run: run.dryRun,
    elevated: run.elevated,
    sections: run.sections,
    freed_bytes: run.freedBytes,
    estimated_bytes: run.estimatedBytes,
    duration_ms: run.durationMs,
  });
  // A re-sync of a run already stored is not an error worth surfacing.
  if (error && error.code !== '23505') {
    throw failure('run upload', `the run could not be saved: ${error.message}`);
  }
}

/**
 * Remove one run summary from the account. Owner-filtered like every read here.
 *
 * 0 rows affected is not an error: it is what a row another machine removed a
 * moment ago looks like, and the account is then without it - the outcome asked for.
 * RLS answers the same 200-with-0-rows when the session and `userId` disagree, which
 * the caller rules out by passing the signed-in account's own id.
 */
export async function deleteRun(userId: string, runId: string): Promise<void> {
  const sb = supabase();
  if (!sb) throw failure('run remove', NOT_CONFIGURED);
  const { error } = await sb.from('runs').delete().eq('user_id', userId).eq('run_id', runId);
  if (error) throw failure('run remove', `the run could not be removed: ${error.message}`);
}
