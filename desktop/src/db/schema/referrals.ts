/**
 * The referral ledger (D56; contract in `aoneahsan-cccs-plans-entitlements`
 * `references/referral-programme.md`).
 *
 * CONFIRMED BY A REAL SIGNAL, NEVER BY A CLICK: a row is recorded by `referral_claim`
 * (called from `account-welcome`) and turns `confirmed` only inside
 * `private.try_confirm_referral`, which reads `auth.users.email_confirmed_at` and is
 * fired by the `auth.users` triggers. Every number it uses is an `app_config` row read
 * at award time, the off switch included.
 *
 * No client policy and no client grant: a person reads counts and dates through
 * `my_referral_status()`, which never projects who joined. Both people's rows go with
 * either account (the settled deletion scope, 2026-10-31).
 */

import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';
import { referralStatus } from './enums';
import { planGrants } from './plans';

export const referrals = pgTable(
  'referrals',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    referrerId: uuid('referrer_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    /** One referral per invitee, ever, for as long as the account exists. */
    inviteeId: uuid('invitee_id')
      .notNull()
      .unique()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    status: referralStatus('status').notNull().default('pending'),
    pointsAwarded: integer('points_awarded').notNull().default(0),
    /** The reward this confirmation completed, if it completed one. */
    rewardGrantId: uuid('reward_grant_id').references(() => planGrants.id, {
      onDelete: 'set null',
    }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    /** The referrer was emailed about this confirmation (once). */
    notifiedAt: timestamp('notified_at', { withTimezone: true }),
  },
  (t) => [
    check('referrals_not_self', sql`${t.referrerId} <> ${t.inviteeId}`),
    check('referrals_points_nonneg', sql`${t.pointsAwarded} >= 0`),
    check(
      'referrals_confirmed_pair',
      sql`(${t.status} = 'confirmed') = (${t.confirmedAt} is not null)`
    ),
    index('referrals_referrer_idx').on(t.referrerId, t.status, t.confirmedAt),
    index('referrals_reward_grant_idx').on(t.rewardGrantId),
  ]
).enableRLS();
