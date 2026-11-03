/** The release gate's pure version and persistence decisions. */

export type ReleaseSeverity = 'normal' | 'urgent';

export interface ReleaseRecord {
  version: string;
  severity: ReleaseSeverity;
  reason: string;
  minNativeVersion: string | null;
}

export interface StoredReleaseNotice {
  version: string;
  reason: string;
  runId: string;
  storedAt: string;
  dismissed: boolean;
}

export type ReleaseDecision =
  | { kind: 'none' }
  | { kind: 'notice'; release: ReleaseRecord; dismissed: boolean }
  | { kind: 'block'; release: ReleaseRecord; fromEarlierStart: boolean };

const SEMVER = /^(0|[1-9]\d{0,5})\.(0|[1-9]\d{0,5})\.(0|[1-9]\d{0,5})$/;

/** Invalid versions return null, so unknown data can never block the app. */
export function compareSemver(a: string, b: string): number | null {
  const left = SEMVER.exec(a);
  const right = SEMVER.exec(b);
  if (!left || !right) return null;
  for (let i = 1; i <= 3; i += 1) {
    const difference = Number(left[i]) - Number(right[i]);
    if (difference !== 0) return Math.sign(difference);
  }
  return 0;
}

/** Validate the untyped public view row before using it as a release gate. */
export function parseReleaseRecord(value: unknown): ReleaseRecord | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (typeof row.version !== 'string' || compareSemver(row.version, row.version) === null) {
    return null;
  }
  if (row.severity !== 'normal' && row.severity !== 'urgent') return null;
  if (typeof row.reason !== 'string' || row.reason.trim().length === 0 || row.reason.length > 280) {
    return null;
  }
  if (row.min_native_version !== null && typeof row.min_native_version !== 'string') return null;
  if (
    typeof row.min_native_version === 'string' &&
    compareSemver(row.min_native_version, row.min_native_version) === null
  ) {
    return null;
  }
  return {
    version: row.version,
    severity: row.severity,
    reason: row.reason.trim(),
    minNativeVersion: row.min_native_version,
  };
}

/** Reject corrupt or obsolete local storage, including old records without a run identity. */
export function parseStoredNotice(value: unknown): StoredReleaseNotice | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (typeof row.version !== 'string' || compareSemver(row.version, row.version) === null) {
    return null;
  }
  if (
    typeof row.reason !== 'string' ||
    row.reason.trim().length === 0 ||
    row.reason.length > 280 ||
    typeof row.runId !== 'string' ||
    row.runId.length === 0 ||
    typeof row.storedAt !== 'string' ||
    Number.isNaN(Date.parse(row.storedAt)) ||
    typeof row.dismissed !== 'boolean'
  ) {
    return null;
  }
  return {
    version: row.version,
    reason: row.reason,
    runId: row.runId,
    storedAt: row.storedAt,
    dismissed: row.dismissed,
  };
}

/** Decide from the latest valid row and any normal notice saved on this machine. */
export function decideRelease({
  running,
  record,
  stored,
  runId,
}: {
  running: string;
  record: ReleaseRecord | null;
  stored: StoredReleaseNotice | null;
  runId: string;
}): ReleaseDecision {
  if (compareSemver(running, running) === null) return { kind: 'none' };
  const recordOrder = record ? compareSemver(running, record.version) : null;
  const validRecord = recordOrder === null ? null : record;
  const storedOrder = stored ? compareSemver(running, stored.version) : null;
  const storedIsNewer = storedOrder !== null && storedOrder < 0;
  const usableRecord = validRecord && recordOrder !== null && recordOrder < 0 ? validRecord : null;
  if (!usableRecord && (!stored || !storedIsNewer)) return { kind: 'none' };

  let release: ReleaseRecord;
  if (
    usableRecord &&
    (!storedIsNewer || !stored || (compareSemver(usableRecord.version, stored.version) ?? 0) >= 0)
  )
    release = usableRecord;
  else if (stored) {
    release = {
      version: stored.version,
      severity: 'normal',
      reason: stored.reason,
      minNativeVersion: null,
    };
  } else return { kind: 'none' };
  if (release.severity === 'urgent') {
    return { kind: 'block', release, fromEarlierStart: false };
  }
  if (stored && storedIsNewer && stored.version === release.version && stored.runId !== runId) {
    return { kind: 'block', release, fromEarlierStart: true };
  }
  return {
    kind: 'notice',
    release,
    dismissed: stored?.version === release.version && stored.runId === runId && stored.dismissed,
  };
}
