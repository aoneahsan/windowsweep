/**
 * The closed sets of the 1.4.0 schema.
 *
 * The plan KEY is deliberately not here: plans are rows, so a new tier is an admin
 * action and never a migration. Platform roles stay a CHECK on `profiles` (site.ts).
 */

import { pgEnum } from 'drizzle-orm/pg-core';

/** Which monthly pool paid for a real run. */
export const runPool = pgEnum('run_pool', ['device', 'account', 'plan']);

/** The billing period of a paid order. */
export const billingInterval = pgEnum('billing_interval', ['month', 'year']);

/** A paid period: active until it ends by time, or returned by the bank or Polar. */
export const subscriptionStatus = pgEnum('subscription_status', ['active', 'returned']);

/** Where a plan given without payment came from. A plan request grants nothing (D68). */
export const grantSource = pgEnum('grant_source', ['admin', 'referral']);

/** A member's role inside a team: a product role, never a platform role. */
export const teamRole = pgEnum('team_role', ['owner', 'member']);

/** A referral is pending until verified, confirmed when rewarded, or voided after misuse. */
export const referralStatus = pgEnum('referral_status', ['pending', 'confirmed', 'void']);

/** A plan request stays pending until it is emailed a pay link (D68) or an admin closes it. */
export const planRequestStatus = pgEnum('plan_request_status', ['pending', 'notified', 'closed']);

/** The surfaces a release record can gate (update flow, layer 2). */
export const releasePlatform = pgEnum('release_platform', ['desktop', 'web', 'docs']);

/** A client reads the channel its build names; a verification reads `test`. */
export const releaseChannel = pgEnum('release_channel', ['production', 'test']);

/** Urgent blocks now; normal is announced now and blocks from the next start. */
export const releaseSeverity = pgEnum('release_severity', ['urgent', 'normal']);
