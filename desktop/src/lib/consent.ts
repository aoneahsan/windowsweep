/**
 * The first-run NOTICE record. It is not consent, and it is not revocable.
 *
 * 🔴 This modelled four per-destination booleans until 2026-09-07, when the owner
 * decided there is no opt-out: *"do not give user option to turn off any of those
 * analytics or anything, it's a free production, just mention we use that to
 * improve the product, with no option to opt out, they can just not use the
 * product if they so not like it"*. So there is nothing to accept, nothing to
 * revoke, and nothing for a screen to gate on. What is left is a flag saying the
 * person has seen the notice, so it is not shown on every launch - the shape
 * `page-consent.js` writes: `{ seen, seenAt, collected }`.
 *
 * 🔴 `seenAt` and `collected` are kept for a reason the dummy states: a later
 * release that changes WHAT is collected can tell whether this person has seen the
 * current wording. They are not decoration.
 *
 * The 1.4.0 legal bar has new Terms wording. A 1.3.2 `windowsweep:consent`
 * acknowledgement does not count as having seen it; the new key starts unseen.
 *
 * What survived the change, deliberately: the engine's zero-network fact and the
 * "never sent" list. That list is the whole reason the one line is credible - a
 * notice with nothing checkable in it is just an announcement.
 */

import { readStored, writeStored } from './storage';

export interface NoticeState {
  /** The notice has been shown and dismissed. Never "the person agreed". */
  seen: boolean;
  seenAt: string | null;
  /** How many collection sentences the notice disclosed when it was seen. */
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
export const DESTINATIONS = ['ga4', 'amplitude', 'clarity', 'sentry'] as const;

export type Destination = (typeof DESTINATIONS)[number];

/**
 * The three sentences the notice's disclosure spells out. They are the same
 * sentences the destination ledger uses for analytics, replay and crashes, read
 * from one place so the two surfaces cannot drift - which is exactly what
 * `page-consent.js` says its own copy of the list is for.
 */
export const COLLECTED_KEYS: readonly string[] = [
  'consent.provider.ga4.what',
  'consent.provider.clarity.what',
  'consent.provider.sentry.what',
];

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

/** Record that the notice was shown. Returns what was written. */
export function markNoticeSeen(): NoticeState {
  const state: NoticeState = {
    seen: true,
    seenAt: new Date().toISOString(),
    collected: COLLECTED_KEYS.length,
  };
  writeStored(NOTICE_STORAGE_KEY, state);
  return state;
}
