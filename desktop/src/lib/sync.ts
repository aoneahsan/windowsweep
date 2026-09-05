/**
 * Settings and run history across machines, through Supabase.
 *
 * 🔴 WHAT IS NEVER SENT: a file path, a folder name, a drive label, a machine
 * name, a Windows user name, or the contents of anything. `stripRun` below is the
 * narrowing, and the schema has no column that could hold one - so the promise is
 * kept twice, once in the client and once by a server that would refuse a wider
 * row from a client that tried.
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
 */

import type { RunSummary } from './cli';
import { supabase } from './auth';

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

/** 🔴 The narrowing. Everything not named here is dropped - candidates and targets included. */
export function stripRun(
  summary: RunSummary,
  runId: string,
  startedAt: string,
  durationMs: number,
): SyncedRun {
  return {
    runId,
    startedAt,
    mode: summary.mode,
    dryRun: summary.dry_run,
    elevated: summary.elevated,
    sections: summary.sections.map((s) => s.section),
    freedBytes: summary.freed_bytes,
    estimatedBytes: summary.estimated_bytes,
    durationMs,
  };
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
  if (error) throw new Error(`settings could not be read: ${error.message}`);
  if (!data) return null;
  return {
    prefs: data.prefs ?? {},
    developer: data.developer,
    updatedAt: data.settings_updated_at,
  };
}

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
): Promise<void> {
  const sb = supabase();
  if (!sb) return;

  const now = new Date().toISOString();
  const insert = await sb.from('user_settings').insert({
    user_id: userId,
    email,
    display_name: displayName,
    prefs: settings.prefs,
    developer: settings.developer,
    settings_updated_at: settings.updatedAt,
    last_seen_at: now,
  });

  if (!insert.error) return;
  // 23505 = unique_violation: the row already exists, which is the normal case.
  if (insert.error.code !== '23505') {
    throw new Error(`settings could not be saved: ${insert.error.message}`);
  }

  // 🔴 `user_id` is NOT in this payload - it is outside the UPDATE grant, and
  // sending it would make Postgres refuse the whole statement at plan time.
  const update = await sb
    .from('user_settings')
    .update({
      email,
      display_name: displayName,
      prefs: settings.prefs,
      developer: settings.developer,
      settings_updated_at: settings.updatedAt,
      last_seen_at: now,
    })
    .eq('user_id', userId);
  if (update.error) throw new Error(`settings could not be saved: ${update.error.message}`);
}

/**
 * Newest wins, and the loser is offered back.
 *
 * 🔴 The undo is not decoration. Two machines editing settings is the ordinary
 * case for this product - one desktop, one laptop - and silently discarding the
 * older side means a person changes a setting, walks to the other machine and
 * finds it reverted with no explanation. The caller shows `replaced` in an undo
 * toast.
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
 * One page of a person's own runs, newest first.
 *
 * Keyset, not offset: `before` is the previous page's oldest `startedAt`. An
 * offset walk re-reads every skipped row, and the cost grows with the history
 * rather than with the page.
 */
export async function fetchRuns(
  userId: string,
  before?: string,
): Promise<{ runs: SyncedRun[]; nextCursor: string | null }> {
  const sb = supabase();
  if (!sb) return { runs: [], nextCursor: null };

  let runsQuery = sb
    .from('runs')
    .select('run_id, started_at, mode, dry_run, elevated, sections, freed_bytes, estimated_bytes, duration_ms')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(RUNS_PAGE_SIZE);
  if (before) runsQuery = runsQuery.lt('started_at', before);

  const { data, error } = await runsQuery;
  if (error) throw new Error(`run history could not be read: ${error.message}`);

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
  };
}

export async function pushRun(userId: string, run: SyncedRun): Promise<void> {
  const sb = supabase();
  if (!sb) return;
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
    throw new Error(`the run could not be saved: ${error.message}`);
  }
}

export async function deleteRun(userId: string, runId: string): Promise<void> {
  const sb = supabase();
  if (!sb) return;
  const { error } = await sb.from('runs').delete().eq('user_id', userId).eq('run_id', runId);
  if (error) throw new Error(`the run could not be removed: ${error.message}`);
}
