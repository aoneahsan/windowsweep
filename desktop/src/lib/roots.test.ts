import { describe, expect, it } from 'vitest';

import { usableRoots } from './roots';
import { parseRunSummary } from './cli';
import { safeBatchArgs } from './engine-args';

describe('declared scan roots', () => {
  it('keeps only distinct absolute Windows folders that survive the CLI separator', () => {
    expect(
      usableRoots([
        ' C:\\Data ',
        'c:\\data',
        'D:\\Archive',
        'C:\\bad;D:\\other',
        '--yes',
        'C:\\line\nnext',
      ])
    ).toEqual(['C:\\Data', 'D:\\Archive']);
  });

  it('passes an explicit empty list, so CLI config cannot widen the desktop scope', () => {
    const args = safeBatchArgs({
      dryRun: true,
      excludedPaths: [],
      developer: false,
      idleDays: 100,
      tempDays: 3,
      largeFileMb: 100,
      personalRoots: [],
      browserProfileRoots: [],
      tempRoots: [],
    });
    for (const flag of ['--personal-roots', '--browser-profile-roots', '--temp-roots']) {
      expect(args[args.indexOf(flag) + 1]).toBe('');
    }
  });

  it('preserves refusal rows and root verdicts from the engine summary', () => {
    const summary = parseRunSummary(
      JSON.stringify({
        tool: 'windowsweep',
        candidates: [
          {
            section: 19,
            index: 0,
            path: 'C:\\Downloads\\secret.txt',
            bytes: 10,
            idle_days: 200,
            project: null,
            selectable: false,
            skip_reason: 'protected',
          },
        ],
        personal_roots: [{ path: 'C:\\Windows', accepted: false, reason: 'system folder' }],
        access_live_volumes: ['C:'],
      })
    );
    expect(summary.candidates[0]?.selectable).toBe(false);
    expect(summary.personal_roots[0]?.accepted).toBe(false);
    expect(summary.access_live_volumes).toEqual(['C:']);
  });
});
