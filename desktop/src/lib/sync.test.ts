/**
 * `reconcileSettings` decides whose settings survive when two machines have both changed
 * them (TASK-013). A wrong answer is invisible in every gate: the losing machine's change
 * quietly disappears, or the Sync band offers an Undo for a change that replaced nothing.
 *
 * Newest wins, and the comparison is between INSTANTS. The account row's stamp arrives as
 * PostgREST's `timestamptz` text (`+00:00`, microseconds) while this machine writes
 * `toISOString()` (`Z`), so the two are never compared as strings.
 */
import { describe, expect, it } from 'vitest';
import { reconcileSettings, type SyncedSettings } from './sync';

const settings = (updatedAt: string, theme: string): SyncedSettings => ({
  prefs: { theme },
  developer: false,
  updatedAt,
});

describe('reconcileSettings', () => {
  it('keeps this machine when the account has no settings row yet', () => {
    const local = settings('2026-09-25T10:00:00.000Z', 'light');
    expect(reconcileSettings(local, null)).toEqual({ winner: local, replaced: null });
  });

  it('takes a newer account row and offers this machine back for the undo', () => {
    const local = settings('2026-09-25T10:00:00.000Z', 'light');
    const remote = settings('2026-09-25T10:00:01.000Z', 'dark');
    expect(reconcileSettings(local, remote)).toEqual({ winner: remote, replaced: local });
  });

  it('keeps a newer local copy and replaces nothing', () => {
    const local = settings('2026-09-25T10:00:01.000Z', 'light');
    const remote = settings('2026-09-25T10:00:00.000Z', 'dark');
    expect(reconcileSettings(local, remote)).toEqual({ winner: local, replaced: null });
  });

  it('offers no undo on a tie - the same instant, written by each side in its own format', () => {
    const local = settings('2026-09-25T10:00:00.123Z', 'light');
    const remote = settings('2026-09-25T10:00:00.123456+00:00', 'dark');
    expect(reconcileSettings(local, remote)).toEqual({ winner: local, replaced: null });
  });

  it('compares instants, not text: 10:30 at UTC+5 is older than 09:00 UTC', () => {
    const local = settings('2026-09-25T09:00:00.000Z', 'light');
    const remote = settings('2026-09-25T10:30:00.000+05:00', 'dark');
    expect(reconcileSettings(local, remote)).toEqual({ winner: local, replaced: null });
  });
});
