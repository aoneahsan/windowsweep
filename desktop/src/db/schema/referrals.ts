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
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
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
    voidedAt: timestamp('voided_at', { withTimezone: true }),
    /** The referrer was emailed about this confirmation (once). */
    notifiedAt: timestamp('notified_at', { withTimezone: true }),
    notifyClaimedAt: timestamp('notify_claimed_at', { withTimezone: true }),
    notifyClaimToken: uuid('notify_claim_token'),
    notifyUncertainAt: timestamp('notify_uncertain_at', { withTimezone: true }),
  },
  (t) => [
    check('referrals_not_self', sql`${t.referrerId} <> ${t.inviteeId}`),
    check('referrals_points_nonneg', sql`${t.pointsAwarded} >= 0`),
    check(
      'referrals_confirmed_timestamp',
      sql`${t.status} <> 'confirmed' or ${t.confirmedAt} is not null`
    ),
    check('referrals_pending_timestamp', sql`${t.status} <> 'pending' or ${t.confirmedAt} is null`),
    check('referrals_void_pair', sql`(${t.status} = 'void') = (${t.voidedAt} is not null)`),
    check(
      'referrals_notify_claim_pair',
      sql`(${t.notifyClaimedAt} is null) = (${t.notifyClaimToken} is null)`
    ),
    index('referrals_referrer_idx').on(t.referrerId, t.status, t.confirmedAt),
    index('referrals_reward_grant_idx').on(t.rewardGrantId),
    index('referrals_notify_uncertain_idx')
      .on(t.notifyUncertainAt, t.id)
      .where(sql`${t.notifyUncertainAt} is not null`),
    index('referrals_notify_claimed_idx')
      .on(t.notifyClaimedAt, t.id)
      .where(sql`${t.notifyClaimedAt} is not null`),
  ]
).enableRLS();

/**
 * Named badges are catalogue rows. A referral badge may be earned repeatedly;
 * each award is a separate dated row rather than a set membership.
 */
export const badgeCatalogue = pgTable(
  'badge_catalogue',
  {
    key: text('key').primaryKey().notNull(),
    name: text('name').notNull(),
    family: text('family').notNull().default('referral'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('badge_catalogue_key_format', sql`${t.key} ~ '^[a-z][a-z0-9_]{1,63}$'`),
    check('badge_catalogue_name_len', sql`char_length(${t.name}) between 1 and 80`),
    check('badge_catalogue_family', sql`${t.family} = 'referral'`),
  ]
).enableRLS();

export const referralBadgeAwards = pgTable(
  'referral_badge_awards',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    referralId: uuid('referral_id')
      .notNull()
      .unique()
      .references(() => referrals.id, { onDelete: 'cascade' }),
    badgeKey: text('badge_key')
      .notNull()
      .references(() => badgeCatalogue.key),
    awardedAt: timestamp('awarded_at', { withTimezone: true }).notNull().defaultNow(),
    voidedAt: timestamp('voided_at', { withTimezone: true }),
  },
  (t) => [
    index('referral_badge_awards_user_at_idx').on(t.userId, t.awardedAt),
    index('referral_badge_awards_badge_idx').on(t.badgeKey),
  ]
).enableRLS();

/** Anonymous audit of referral voids; no user id, email, invite code or reason text. */
export const referralVoids = pgTable(
  'referral_voids',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    reasonCode: text('reason_code').notNull(),
    voidedAt: timestamp('voided_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('referral_voids_reason', sql`${t.reasonCode} in ('misuse', 'account_deleted')`),
    index('referral_voids_at_idx').on(t.voidedAt),
  ]
).enableRLS();
