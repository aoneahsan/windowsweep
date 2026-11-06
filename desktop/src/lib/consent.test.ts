/** The legal bar's seen rules (N-001): either half teaches the other, and a decision only moves on. */
import { describe, expect, it } from 'vitest';

import {
  holdsTourHint,
  NOTICE_UNSEEN,
  pageTakesBar,
  planNotice,
  settlePhase,
  type NoticeState,
} from './consent';

const seenHere: NoticeState = { seen: true, seenAt: '2026-11-06T09:00:00.000Z', collected: 3 };
const seenElsewhere = '2026-11-01T08:00:00.000Z';

describe('legal bar seen rules', () => {
  it('shows once per PC when nobody is signed in or the account cannot be read', () => {
    for (const account of [{ kind: 'signed-out' }, { kind: 'unknown' }] as const) {
      expect(planNotice(NOTICE_UNSEEN, account)).toEqual({
        show: true,
        teachDevice: null,
        teachAccount: false,
      });
      expect(planNotice(seenHere, account)).toEqual({
        show: false,
        teachDevice: null,
        teachAccount: false,
      });
    }
  });

  it('lets the account teach a second PC, which then shows nothing', () => {
    expect(planNotice(NOTICE_UNSEEN, { kind: 'read', seenAt: seenElsewhere })).toEqual({
      show: false,
      teachDevice: seenElsewhere,
      teachAccount: false,
    });
  });

  it('lets this PC teach an account that signed in after the bar was seen, and only then', () => {
    expect(planNotice(seenHere, { kind: 'read', seenAt: null })).toEqual({
      show: false,
      teachDevice: null,
      teachAccount: true,
    });
    expect(planNotice(seenHere, { kind: 'read', seenAt: seenElsewhere })).toEqual({
      show: false,
      teachDevice: null,
      teachAccount: false,
    });
  });

  it('owes the bar only when neither half has seen it', () => {
    expect(planNotice(NOTICE_UNSEEN, { kind: 'read', seenAt: null })).toEqual({
      show: true,
      teachDevice: null,
      teachAccount: false,
    });
  });
});

describe('legal bar phase and pages', () => {
  it('decides once, may cancel a bar not yet drawn, and never takes one off the screen', () => {
    expect(settlePhase('deciding', true)).toBe('due');
    expect(settlePhase('deciding', false)).toBe('done');
    expect(settlePhase('due', false)).toBe('done');
    expect(settlePhase('due', true)).toBe('due');
    expect(settlePhase('open', false)).toBe('open');
    expect(settlePhase('done', true)).toBe('done');
  });

  it('never draws on a task page or beside a release notice or block', () => {
    for (const task of ['/splash', '/run', '/picker', '/elevation']) {
      expect(pageTakesBar(task, false)).toBe(false);
    }
    expect(pageTakesBar('/', true)).toBe(false);
    expect(pageTakesBar('/', false)).toBe(true);
    expect(pageTakesBar('/settings', false)).toBe(true);
  });

  it('holds the tour hint until the bar is done, except on a task page that never carries it', () => {
    for (const phase of ['deciding', 'due', 'open'] as const) {
      expect(holdsTourHint(phase, '/')).toBe(true);
    }
    expect(holdsTourHint('done', '/')).toBe(false);
    expect(holdsTourHint('due', '/run')).toBe(false);
  });
});
