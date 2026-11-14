import { describe, expect, it } from 'vitest';

import type { Candidate } from './cli';
import { readCandidate } from './candidate-extras';
import { downloadPhrase, keptPhrase, tallyInstall, verbPhrase } from './install-mode';

const MB = 1024 ** 2;
const GB = 1024 ** 3;

function row(section: number, extra: Record<string, unknown>): Candidate {
  const r = readCandidate({
    section,
    index: 1,
    path: `p${String(Math.random())}`,
    bytes: 0,
    ...extra,
  });
  if (!r) throw new Error('fixture did not parse');
  return r;
}

/* Section 31 as the dummy seeds it (seed.js, after A4-15): two driver installs and three old
   packages - the mixed choice whose button reads "Install 2, remove 3". No row runs a maker's tool. */
const SECTION_31 = [
  row(31, { kind: 'driver-update', bytes: 448 * MB, label: 'Intel Corporation - Display' }),
  row(31, { kind: 'driver-update', bytes: 21 * MB, label: 'Realtek Semiconductor Corp. - MEDIA' }),
  row(31, { kind: 'driver-package', bytes: 1.12 * GB }),
  row(31, { kind: 'driver-package', bytes: 1.19 * GB }),
  row(31, { kind: 'driver-package', bytes: 38 * MB }),
];

describe('the install-mode tally', () => {
  it('names both parts of a mixed choice, so the button never says less than the run does', () => {
    const tally = tallyInstall(SECTION_31);
    expect(verbPhrase(tally)).toEqual({ kind: 'mixed', install: 2, remove: 3 });
    expect(tally.drivers).toBe(2);
    expect(tally.driverRows).toBe(5);
    expect(tally.fetchedByWindowsUpdate).toBe(2);
    expect(tally.sections).toEqual([31]);
  });

  it('counts an unknown download apart, never as 0 bytes', () => {
    const tally = tallyInstall([...SECTION_31, row(31, { kind: 'driver-update', bytes: 0 })]);
    expect(tally.knownDownload).toBe(469 * MB);
    expect(tally.unknownDownloads).toBe(1);
    expect(downloadPhrase(tally)).toEqual({
      kind: 'knownPlusUnknown',
      bytes: 469 * MB,
      unknown: 1,
    });
  });

  it('reclaims only what old packages free - a Windows Update download never reaches it', () => {
    const tally = tallyInstall([
      ...SECTION_31,
      row(30, { kind: 'windows-update', bytes: 87 * MB }),
    ]);
    expect(tally.reclaim).toBe(1.12 * GB + 1.19 * GB + 38 * MB);
    expect(tally.windowsUpdates).toBe(1);
  });

  it('says one kind whole', () => {
    const updates = tallyInstall([
      row(30, { kind: 'windows-update', bytes: 0 }),
      row(30, { kind: 'windows-update', bytes: 87 * MB }),
    ]);
    expect(verbPhrase(updates)).toEqual({ kind: 'install', count: 2 });
    expect(downloadPhrase(updates)).toEqual({
      kind: 'knownPlusUnknown',
      bytes: 87 * MB,
      unknown: 1,
    });

    const apps = tallyInstall([row(32, { kind: 'app-update' }), row(32, { kind: 'app-update' })]);
    expect(downloadPhrase(apps)).toEqual({ kind: 'unknown' });
    expect(apps.winget).toBe(2);

    const old = tallyInstall(SECTION_31.slice(2));
    expect(verbPhrase(old)).toEqual({ kind: 'remove', count: 3 });
    expect(downloadPhrase(old)).toEqual({ kind: 'none' });
  });

  it('names rows chosen in the other mode once, with their sections', () => {
    expect(keptPhrase([])).toBeNull();
    expect(keptPhrase([row(26, {}), row(17, {}), row(26, {})])).toEqual({
      rows: 3,
      sections: [17, 26],
    });
  });
});
