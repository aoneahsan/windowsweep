import { describe, expect, it } from 'vitest';

import { parseRunSummary } from './cli';
import {
  displayPath,
  downloadOf,
  installVerb,
  leftoverKind,
  needsElevatedRun,
  programKind,
  ranDays,
  readCandidate,
  readDriverReport,
  reclaimOf,
} from './candidate-extras';

const MB = 1024 ** 2;

describe('readCandidate - the 1.5.0 extras, typed or absent', () => {
  it('keeps the extras the engine sends with their declared types', () => {
    const row = readCandidate({
      section: 26,
      index: 3,
      path: 'appx:Microsoft.SkypeApp_15.150.3125.0_x64__kzf8qxf38zg5c',
      bytes: 334432883,
      idle_days: -1,
      project: '',
      label: 'Skype',
      kind: 'store',
      strategy: 'store',
      needs_admin: false,
      ran: '-',
      publisher: 'Skype',
      version: '15.150.3125.0',
    });
    expect(row).toMatchObject({
      section: 26,
      label: 'Skype',
      kind: 'store',
      needs_admin: false,
      ran: '-',
      idle_days: null,
      project: '',
    });
  });

  it('drops an extra of the wrong type instead of drawing it', () => {
    const row = readCandidate({
      section: 32,
      index: 1,
      path: 'winget:Git.Git',
      bytes: 0,
      idle_days: -1,
      ran: 12,
      running: 'yes',
      needs_admin: 1,
      source: 'winget',
    });
    expect(row).not.toBeNull();
    expect(row && 'ran' in row).toBe(false);
    expect(row && 'running' in row).toBe(false);
    expect(row && 'needs_admin' in row).toBe(false);
    expect(row?.source).toBe('winget');
  });

  it('refuses a row with no path or no section, which nothing could choose or match', () => {
    expect(readCandidate({ section: 26, path: '' })).toBeNull();
    expect(readCandidate({ path: 'C:\\x' })).toBeNull();
    expect(readCandidate('C:\\x')).toBeNull();
  });

  it('reaches every candidate through parseRunSummary', () => {
    const summary = parseRunSummary(
      JSON.stringify({
        tool: 'windowsweep',
        candidates: [
          { section: 30, index: 1, path: 'wu:abc', bytes: 87 * MB, kind: 'windows-update' },
          { section: 30, path: '' },
        ],
        driver_report: {
          problems: [{ name: 'Unknown USB Device', code: 43, problem: 'stopped' }, { code: 1 }],
          oldest: [{ device: 'Synaptics SMBus Driver', version: '19.0.12.98', date: '2018-03-26' }],
        },
      })
    );
    expect(summary.candidates).toHaveLength(1);
    expect(summary.driver_report?.problems).toEqual([
      { name: 'Unknown USB Device', code: 43, problem: 'stopped' },
    ]);
    expect(summary.driver_report?.oldest[0]?.provider).toBe('');
  });

  it('reads an absent driver report as null, never as an empty promise', () => {
    expect(readDriverReport(undefined)).toBeNull();
    expect(parseRunSummary(JSON.stringify({ tool: 'windowsweep' })).driver_report).toBeNull();
  });
});

describe('what a row is', () => {
  const row = (extra: Record<string, unknown>) => {
    const r = readCandidate({ section: 31, index: 1, path: 'p', bytes: 0, ...extra });
    if (!r) throw new Error('fixture did not parse');
    return r;
  };

  it('names 26 and 27 kinds, and never invents one it does not know', () => {
    expect(programKind(row({}))).toBe('desktop');
    expect(programKind(row({ kind: 'broken' }))).toBe('broken');
    expect(programKind(row({ kind: 'plugin' }))).toBeNull();
    expect(leftoverKind(row({}))).toBe('folder');
    expect(leftoverKind(row({ kind: 'task' }))).toBe('task');
    expect(leftoverKind(row({ kind: 'service' }))).toBeNull();
  });

  it('takes the verb from the kind - install or remove, never a run (A4-15)', () => {
    expect(installVerb(row({ kind: 'driver-update' }))).toBe('install');
    expect(installVerb(row({ kind: 'driver-package' }))).toBe('remove');
    expect(installVerb(row({ kind: 'app-update' }))).toBe('install');
  });

  it('reads a Windows Update size as a download and an unknown one as null, never 0', () => {
    expect(downloadOf(row({ kind: 'windows-update', bytes: 87 * MB }))).toBe(87 * MB);
    expect(downloadOf(row({ kind: 'windows-update', bytes: 0 }))).toBeNull();
    expect(downloadOf(row({ kind: 'app-update' }))).toBeNull();
    expect(downloadOf(row({ kind: 'driver-package', bytes: 38 * MB }))).toBe(0);
  });

  it('counts only what an old driver package frees as reclaim in install mode', () => {
    expect(reclaimOf(row({ kind: 'windows-update', bytes: 87 * MB }), true)).toBe(0);
    expect(reclaimOf(row({ kind: 'driver-package', bytes: 38 * MB }), true)).toBe(38 * MB);
    expect(reclaimOf(row({ bytes: 147 * MB }), false)).toBe(147 * MB);
  });

  it('reads Ran in days only when the engine measured it', () => {
    expect(ranDays(row({ ran: '233d' }))).toBe(233);
    expect(ranDays(row({ ran: 'none' }))).toBeNull();
    expect(ranDays(row({ ran: '-' }))).toBeNull();
    expect(ranDays(row({}))).toBeNull();
  });

  it('draws startup and task paths as a person reads them, and leaves the rest alone', () => {
    expect(displayPath(row({ kind: 'startup', path: 'HKEY_CURRENT_USER\\Run::Tray' }))).toBe(
      'HKEY_CURRENT_USER\\Run\\Tray'
    );
    expect(displayPath(row({ kind: 'task', path: 'task:\\Vendor\\Update check' }))).toBe(
      '\\Vendor\\Update check'
    );
    expect(displayPath(row({ kind: 'store', path: 'appx:Pkg_1.0' }))).toBe('appx:Pkg_1.0');
  });

  it('elevates 27, 30 and 31, a machine-wide program, and never 32', () => {
    expect(needsElevatedRun(row({ section: 27 }), true)).toBe(true);
    expect(needsElevatedRun(row({ section: 30 }), false)).toBe(true);
    expect(needsElevatedRun(row({ section: 31, kind: 'driver-package' }), false)).toBe(true);
    expect(needsElevatedRun(row({ section: 32, needs_admin: true }), false)).toBe(false);
    expect(needsElevatedRun(row({ section: 26, needs_admin: true }), false)).toBe(true);
    expect(needsElevatedRun(row({ section: 26, kind: 'store', needs_admin: false }), false)).toBe(
      false
    );
    expect(needsElevatedRun(row({ section: 26, path: 'HKEY_LOCAL_MACHINE\\X' }), false)).toBe(true);
  });
});
