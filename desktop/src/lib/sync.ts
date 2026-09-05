/**
 * Settings and run history across machines, over the Firestore REST API.
 *
 * 🔴 WHAT IS NEVER SENT: a file path, a folder name, a drive label, a machine
 * name, a user name, or the contents of anything. A synced run is a date, a mode,
 * a duration, a section list and two byte counts. The consent screen states that;
 * `stripRun` is where it is kept, and the shape below is deliberately narrow
 * enough that adding a path would mean changing this type.
 *
 * 🔴 Every list read is paginated - limit 20 with a page token, never a whole
 * collection. A run history that fetched everything would grow without bound and
 * cost the reader their quota to render a screen showing twenty rows.
 *
 * 🔴 Every list query carries the filter its security rule reads. The rule allows
 * a document whose parent is the caller's own uid; the query is scoped to that
 * same path, so it proves its rule from its own filters rather than relying on
 * the server to filter for it.
 */

import type { RunSummary } from './cli';
import { validToken, type AuthUser } from './auth';

const FIRESTORE = 'https://firestore.googleapis.com/v1';

export interface SyncConfig {
  projectId: string | undefined;
  apiKey: string | undefined;
}

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

/** 🔴 The narrowing. Everything not named here is dropped, including candidates and targets. */
export function stripRun(summary: RunSummary, runId: string, startedAt: string, durationMs: number): SyncedRun {
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

type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { arrayValue: { values: FirestoreValue[] } }
  | { mapValue: { fields: Record<string, FirestoreValue> } };

function toValue(v: unknown): FirestoreValue {
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (typeof v === 'number') return { integerValue: String(Math.trunc(v)) };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
  if (typeof v === 'object' && v !== null) {
    return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, toValue(x)])) } };
  }
  return { stringValue: String(v) };
}

function fromValue(v: FirestoreValue): unknown {
  if ('stringValue' in v) return v.stringValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(fromValue);
  return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, fromValue(x)]));
}

function toFields(obj: Record<string, unknown>): Record<string, FirestoreValue> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toValue(v)]));
}

async function request(
  config: SyncConfig,
  user: AuthUser,
  path: string,
  init: RequestInit = {},
): Promise<unknown> {
  if (!config.projectId || !config.apiKey) throw new Error('sync is not configured in this build');
  const fresh = await validToken(user, config.apiKey);
  const url = `${FIRESTORE}/projects/${config.projectId}/databases/(default)/documents/${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${fresh.idToken}`,
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`sync failed (${res.status})`);
  return res.json();
}

export async function fetchSettings(config: SyncConfig, user: AuthUser): Promise<SyncedSettings | null> {
  const doc = (await request(config, user, `users/${user.uid}`)) as
    | { fields?: Record<string, FirestoreValue> }
    | null;
  if (!doc?.fields?.['settings']) return null;
  const settings = fromValue(doc.fields['settings']) as Record<string, unknown>;
  return {
    prefs: (settings['prefs'] as Record<string, string>) ?? {},
    developer: settings['developer'] === true,
    updatedAt: String(fromValue(doc.fields['settingsUpdatedAt'] ?? { stringValue: '' })),
  };
}

export async function pushSettings(config: SyncConfig, user: AuthUser, settings: SyncedSettings): Promise<void> {
  await request(
    config,
    user,
    `users/${user.uid}?updateMask.fieldPaths=settings&updateMask.fieldPaths=settingsUpdatedAt&updateMask.fieldPaths=email&updateMask.fieldPaths=lastSeenAt`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        fields: toFields({
          settings: { prefs: settings.prefs, developer: settings.developer },
          settingsUpdatedAt: settings.updatedAt,
          email: user.email,
          lastSeenAt: new Date().toISOString(),
        }),
      }),
    },
  );
}

/**
 * Newest wins, and the loser is offered back.
 *
 * 🔴 The undo is not decoration. Two machines editing settings is the ordinary
 * case for this product - one desktop, one laptop - and silently discarding the
 * older side means a person changes a setting, walks to the other machine and
 * finds it reverted with no explanation. The caller shows the returned
 * `replaced` value in an undo toast.
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

export async function fetchRuns(
  config: SyncConfig,
  user: AuthUser,
  pageToken?: string,
): Promise<{ runs: SyncedRun[]; nextPageToken: string | null }> {
  const params = new URLSearchParams({
    pageSize: String(RUNS_PAGE_SIZE),
    orderBy: 'startedAt desc',
  });
  if (pageToken) params.set('pageToken', pageToken);
  const body = (await request(config, user, `users/${user.uid}/runs?${params.toString()}`)) as
    | { documents?: { fields: Record<string, FirestoreValue> }[]; nextPageToken?: string }
    | null;
  return {
    runs: (body?.documents ?? []).map((d) => fromValue({ mapValue: { fields: d.fields } }) as SyncedRun),
    nextPageToken: body?.nextPageToken ?? null,
  };
}

export async function pushRun(config: SyncConfig, user: AuthUser, run: SyncedRun): Promise<void> {
  await request(config, user, `users/${user.uid}/runs?documentId=${encodeURIComponent(run.runId)}`, {
    method: 'POST',
    body: JSON.stringify({ fields: toFields(run as unknown as Record<string, unknown>) }),
  });
}

export async function deleteRun(config: SyncConfig, user: AuthUser, runId: string): Promise<void> {
  await request(config, user, `users/${user.uid}/runs/${encodeURIComponent(runId)}`, { method: 'DELETE' });
}
