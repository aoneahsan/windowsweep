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
 * 🔴 The storage key is unchanged, so an existing record written under the old
 * four-boolean shape has no `seen` field and reads as unseen. That is correct
 * rather than unfortunate: what the notice says has materially changed, and the
 * person has not seen the new wording.
 *
 * What survived the change, deliberately: the engine's zero-network fact and the
 * "never sent" list. That list is the whole reason the one line is credible - a
 * notice with nothing checkable in it is just an announcement.
 */

export interface NoticeState {
  /** The notice has been shown and dismissed. Never "the person agreed". */
  seen: boolean;
  seenAt: string | null;
  /** How many collection sentences the notice disclosed when it was seen. */
  collected: number;
}

export const NOTICE_STORAGE_KEY = 'windowsweep:consent';

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
  try {
    const raw = window.localStorage.getItem(NOTICE_STORAGE_KEY);
    if (!raw) return { ...NOTICE_UNSEEN };
    const parsed: unknown = JSON.parse(raw);
    const wrapped = parsed as { v?: unknown };
    const value = (typeof wrapped === 'object' && wrapped !== null && 'v' in wrapped ? wrapped.v : parsed) as
      | Partial<NoticeState>
      | undefined;
    if (typeof value !== 'object' || value === null) return { ...NOTICE_UNSEEN };
    return {
      seen: value.seen === true,
      seenAt: typeof value.seenAt === 'string' ? value.seenAt : null,
      collected: typeof value.collected === 'number' ? value.collected : 0,
    };
  } catch {
    /* An unreadable record reads as unseen: showing the notice once more is a
       smaller cost than a person never seeing it because storage broke. */
    return { ...NOTICE_UNSEEN };
  }
}

/** Record that the notice was shown. Returns what was written. */
export function markNoticeSeen(): NoticeState {
  const state: NoticeState = {
    seen: true,
    seenAt: new Date().toISOString(),
    collected: COLLECTED_KEYS.length,
  };
  try {
    window.localStorage.setItem(NOTICE_STORAGE_KEY, JSON.stringify({ v: state }));
  } catch {
    /* A private window or blocked site data: the notice is shown again next
       launch, which is the harmless direction to fail in. */
  }
  return state;
}
