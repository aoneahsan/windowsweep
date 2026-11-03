import { describe, expect, it } from 'vitest';

import {
  compareSemver,
  decideRelease,
  parseReleaseRecord,
  parseStoredNotice,
  type ReleaseRecord,
  type StoredReleaseNotice,
} from './release-state';

const normal: ReleaseRecord = {
  version: '1.4.1',
  severity: 'normal',
  reason: 'This release fixes the update check.',
  minNativeVersion: null,
};
const stored: StoredReleaseNotice = {
  version: normal.version,
  reason: normal.reason,
  runId: 'earlier-run',
  storedAt: '2026-11-03T08:00:00.000Z',
  dismissed: true,
};

describe('release gate decisions', () => {
  it('compares semver numerically and rejects prerelease or malformed input', () => {
    expect(compareSemver('1.10.0', '1.9.8')).toBe(1);
    expect(compareSemver('1.4.0', '1.4.0')).toBe(0);
    expect(compareSemver('1.3.9', '1.4.0')).toBe(-1);
    expect(compareSemver('1.4.1-beta', '1.4.0')).toBeNull();
    expect(compareSemver('01.4.0', '1.4.0')).toBeNull();
  });

  it('validates the public row and saved notice before either can block', () => {
    expect(
      parseReleaseRecord({
        version: normal.version,
        severity: normal.severity,
        reason: normal.reason,
        min_native_version: null,
      })
    ).toEqual(normal);
    expect(parseReleaseRecord({ version: '1.4.1', severity: 'urgent', reason: '' })).toBeNull();
    expect(parseStoredNotice({ ...stored, version: '1.4.1-beta' })).toBeNull();
  });

  it('fails open when the view has no row or an invalid version', () => {
    expect(decideRelease({ running: '1.4.0', record: null, stored: null, runId: 'run' })).toEqual({
      kind: 'none',
    });
    expect(decideRelease({ running: 'bad', record: normal, stored: null, runId: 'run' })).toEqual({
      kind: 'none',
    });
  });

  it('clears the gate when the running version reached the release', () => {
    expect(decideRelease({ running: '1.4.1', record: normal, stored, runId: 'new-run' })).toEqual({
      kind: 'none',
    });
  });

  it('announces a normal release during the same run and can dismiss its notice', () => {
    expect(
      decideRelease({ running: '1.4.0', record: normal, stored: null, runId: 'run' })
    ).toMatchObject({ kind: 'notice', dismissed: false });
    expect(
      decideRelease({
        running: '1.4.0',
        record: normal,
        stored: { ...stored, runId: 'run' },
        runId: 'run',
      })
    ).toMatchObject({ kind: 'notice', dismissed: true });
  });

  it('blocks a known normal release from the next start, even while offline', () => {
    expect(
      decideRelease({ running: '1.4.0', record: normal, stored, runId: 'new-run' })
    ).toMatchObject({ kind: 'block', fromEarlierStart: true });
    expect(
      decideRelease({ running: '1.4.0', record: null, stored, runId: 'new-run' })
    ).toMatchObject({ kind: 'block', fromEarlierStart: true });
  });

  it('announces a newly published normal version before blocking on a later start', () => {
    const olderStored = { ...stored, version: '1.4.0' };
    const newer = { ...normal, version: '1.4.2' };
    expect(
      decideRelease({ running: '1.3.2', record: newer, stored: olderStored, runId: 'new-run' })
    ).toMatchObject({ kind: 'notice', release: newer, dismissed: false });
  });

  it('keeps a newer saved notice when the server returns an older row', () => {
    const newerStored = { ...stored, version: '1.4.3', reason: 'Update to 1.4.3.' };
    const older = { ...normal, version: '1.4.2' };
    expect(
      decideRelease({ running: '1.4.1', record: older, stored: newerStored, runId: 'new-run' })
    ).toMatchObject({ kind: 'block', release: { version: '1.4.3' } });
    expect(
      decideRelease({ running: '1.4.1', record: normal, stored: newerStored, runId: 'new-run' })
    ).toMatchObject({ kind: 'block', release: { version: '1.4.3' } });
  });

  it('blocks an urgent release immediately and names its reason', () => {
    const urgent = { ...normal, severity: 'urgent' as const };
    expect(decideRelease({ running: '1.4.0', record: urgent, stored: null, runId: 'run' })).toEqual(
      { kind: 'block', release: urgent, fromEarlierStart: false }
    );
  });
});
