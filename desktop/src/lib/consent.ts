/**
 * The legal bar's record on this PC, and the rules that decide when the bar shows (N-001;
 * `legal-notice.md`; desktop `AMENDMENTS-3.md`, 2026-11-06, approved under D90).
 *
 * 🔴 A NOTICE, NOT CONSENT. There is nothing to accept and nothing to revoke: the owner removed the
 * opt-out on 2026-09-07 (*"just mention we use that to improve the product, with no option to opt
 * out"*), and fleet law made the same call for analytics on 2026-10-30. What is stored is that the
 * person has SEEN the bar - written the moment it is drawn, never on dismiss - in the shape
 * `{ seen, seenAt, collected }`.
 *
 * 🔴 ONCE PER PC AND ONCE PER ACCOUNT. This record is the PC's half; `profiles.legal_notice_seen_at`,
 * written only by `mark_legal_notice_seen()`, is the account's. Either side teaches the other
 * (`planNotice`), so a second machine on the same account, or a later sign-in on this one, never
 * brings the bar back.
 *
 * 🔴 WHY A 1.3.2 `windowsweep:consent` RECORD DOES NOT COUNT. It answered the analytics screen of a
 * windowsweep that had no Terms of Service to agree to: the Terms arrived with 1.4.0's plans (D56),
 * and 1.4.0 moved the record to this key so that it started unseen. That key is never read. A record
 * under THIS key written by 1.4.0-1.4.2's first-run screen, which the bar replaces, does count: the
 * notice law never brings a notice back because its words changed.
 *
 * `seenAt` and `collected` are kept so a later release that changes WHAT is collected can tell what
 * this person was told: `collected` is how many destinations the window sent to at that moment.
 */

import { readStored, writeStored } from './storage';

export interface NoticeState {
  /** The bar has been drawn on this PC. Never "the person agreed". */
  seen: boolean;
  seenAt: string | null;
  /** How many destinations the window sent to when the bar was seen. */
  collected: number;
}

export const NOTICE_STORAGE_KEY = 'windowsweep:legal-notice';

export const NOTICE_UNSEEN: NoticeState = { seen: false, seenAt: null, collected: 0 };

/**
 * The destinations the window sends to, in the dummy's own order.
 *
 * 🔴 A stated fact, not a setting. Each one still ships only if its key is
 * present in the build - that is a BUILD fact and never a user choice, which is
 * why `analytics.ts` checks keys and no longer checks a flag.
 */
export const DESTINATIONS = ['ga4', 'amplitude', 'sentry'] as const;

export type Destination = (typeof DESTINATIONS)[number];

export function readNotice(): NoticeState {
  const value = readStored<unknown>(NOTICE_STORAGE_KEY, null);
  if (typeof value !== 'object' || value === null) return { ...NOTICE_UNSEEN };
  const notice = value as Partial<NoticeState>;
  return {
    seen: notice.seen === true,
    seenAt: typeof notice.seenAt === 'string' ? notice.seenAt : null,
    collected: typeof notice.collected === 'number' ? notice.collected : 0,
  };
}

/**
 * Record that the bar was seen on this PC: now, when it is drawn, or at the account's own moment
 * when the account teaches this PC that it was seen elsewhere.
 */
export function markNoticeSeen(seenAt: string = new Date().toISOString()): void {
  writeStored<NoticeState>(NOTICE_STORAGE_KEY, {
    seen: true,
    seenAt,
    collected: DESTINATIONS.length,
  });
}

/** What the signed-in account says about the bar, or that there is no account to ask. */
export type AccountNotice =
  | { kind: 'signed-out' }
  /** Signed in, but the profile could not be read: decided on this PC alone, nothing taught. */
  | { kind: 'unknown' }
  | { kind: 'read'; seenAt: string | null };

export interface NoticePlan {
  /** The bar is owed on the next page that can carry it. */
  show: boolean;
  /** The account saw it elsewhere: this PC records that moment and shows nothing. */
  teachDevice: string | null;
  /** This PC saw it before the account was known: the account is told. */
  teachAccount: boolean;
}

/**
 * The two halves teach each other - the dummy's `app.js` `buildNotices`, with
 * `mark_legal_notice_seen()` in place of its `legalSeen:account:<email>` stand-in.
 */
export function planNotice(device: NoticeState, account: AccountNotice): NoticePlan {
  if (account.kind !== 'read')
    return { show: !device.seen, teachDevice: null, teachAccount: false };
  if (account.seenAt !== null) {
    return { show: false, teachDevice: device.seen ? null : account.seenAt, teachAccount: false };
  }
  return { show: !device.seen, teachDevice: null, teachAccount: device.seen };
}

/** The bar's place in this launch: waiting for the answer, owed, on screen, or finished with. */
export type NoticePhase = 'deciding' | 'due' | 'open' | 'done';

/**
 * A decision only ever moves the phase forward. It is made once, after auth has settled; an answer
 * that arrives later may still cancel a bar that is owed but not yet drawn, and never takes away
 * one that is on screen - the law's "never show and then hide".
 */
export function settlePhase(phase: NoticePhase, show: boolean): NoticePhase {
  if (phase === 'deciding') return show ? 'due' : 'done';
  if (phase === 'due' && !show) return 'done';
  return phase;
}

/**
 * The pages a person opens to do one job, where the bar never draws and nothing is marked: the
 * dummy's task-page list (`run`, `picker`, `elevation`, `splash`; `consent` is retired).
 */
const TASK_ROUTES: ReadonlySet<string> = new Set(['/splash', '/run', '/picker', '/elevation']);

function isTaskRoute(path: string): boolean {
  return TASK_ROUTES.has(path);
}

/**
 * Whether the page on screen can carry the bar: never a task page, and never beside a release
 * notice or block, which takes the bottom-right corner first (AMENDMENTS-3, 2026-10-31).
 */
export function pageTakesBar(path: string, releaseShown: boolean): boolean {
  return !isTaskRoute(path) && !releaseShown;
}

/**
 * Whether a tour hint must wait (D90's main-session call): on every page but a task page, the hint
 * holds until the bar has been decided against or has closed - also while a release surface keeps
 * an owed bar waiting - so two notes never stack. A task page never carries the bar, so its hint
 * does not wait for one.
 */
export function holdsTourHint(phase: NoticePhase, path: string): boolean {
  return phase !== 'done' && !isTaskRoute(path);
}
