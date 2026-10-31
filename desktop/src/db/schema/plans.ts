/**
 * The plan set (D56, refined by D62): the registry, the admin fields, the plans given
 * without payment, and the plan requests that stand in for checkout while Polar is
 * dormant (D61, D68).
 *
 * A tier is a ROW and every number on it is an admin field; nothing downstream
 * hardcodes the key set. The plan a person is on is resolved ON READ
 * (`private.effective_plan_id_at`), never stored, so no missed job can extend a paid
 * plan.
 *
 * Writes to every table here go through definer functions with an audit row in the
 * same transaction (`*_v140_admin_*.sql`); the only client write is a person filing
 * their own plan request.
 */

import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  check,
  customType,
  index,
  integer,
  jsonb,
  numeric,
  pgPolicy,
  pgTable,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { anonRole, authenticatedRole, authUsers } from 'drizzle-orm/supabase';
import { billingInterval, grantSource, planRequestStatus } from './enums';
import { ownedBySignedIn } from './rls';

/** PostgreSQL's native union of timestamp ranges records already projected blockers. */
const timestampMultiRange = customType<{ data: string }>({
  dataType: () => 'tstzmultirange',
});

/**
 * The registry. A null run limit means "the app_config default"; `real_runs_unlimited`
 * lifts both pools. `report_machines` is how many PCs a multi-machine report covers
 * (per seat on a per-seat plan); 0 means the plan has no such report.
 */
export const plans = pgTable(
  'plans',
  {
    id: text('id').primaryKey().notNull(),
    name: text('name').notNull(),
    description: text('description').notNull().default(''),
    rank: smallint('rank').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    priceMonthCents: integer('price_month_cents').notNull().default(0),
    priceYearCents: integer('price_year_cents').notNull().default(0),
    perSeat: boolean('per_seat').notNull().default(false),
    minSeats: smallint('min_seats').notNull().default(1),
    realRunsUnlimited: boolean('real_runs_unlimited').notNull().default(false),
    deviceRealRunsPerMonth: integer('device_real_runs_per_month'),
    accountExtraRealRunsPerMonth: integer('account_extra_real_runs_per_month'),
    reportMachines: smallint('report_machines').notNull().default(0),
    schedules: boolean('schedules').notNull().default(false),
    historyExport: boolean('history_export').notNull().default(false),
    fleetReports: boolean('fleet_reports').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    /** Trigger-maintained (`touch_updated_at`); no client holds any write on this table. */
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('plans_id_format', sql`${t.id} ~ '^[a-z][a-z0-9_]{1,31}$'`),
    check('plans_name_len', sql`char_length(${t.name}) between 1 and 40`),
    check('plans_description_len', sql`char_length(${t.description}) <= 300`),
    check('plans_rank_range', sql`${t.rank} between 0 and 1000`),
    check(
      'plans_prices_range',
      sql`${t.priceMonthCents} between 0 and 1000000 and ${t.priceYearCents} between 0 and 10000000`
    ),
    check('plans_min_seats_range', sql`${t.minSeats} between 1 and 1000`),
    check(
      'plans_run_limits_range',
      sql`coalesce(${t.deviceRealRunsPerMonth}, 0) between 0 and 100000 and coalesce(${t.accountExtraRealRunsPerMonth}, 0) between 0 and 100000`
    ),
    check('plans_report_machines_range', sql`${t.reportMachines} between 0 and 1000`),
    /* Rank orders the tiers and breaks no ties: two plans of one rank would make the
       effective plan depend on spelling. */
    uniqueIndex('plans_rank_unique').on(t.rank),

    /* The pricing page reads the registry signed out. Inactive tiers stay readable to
       the definers that resolve a person's plan, never listed publicly. */
    pgPolicy('plans_select_active', {
      for: 'select',
      to: [anonRole, authenticatedRole],
      using: sql`${t.isActive}`,
    }),
  ]
).enableRLS();

/**
 * Admin fields that are not on a plan row: the allowance pools and every referral
 * number, the off switch included. Bounds live on the row and a CHECK enforces them,
 * so no form can store a value the server would misbehave on (a referral threshold of
 * 0 would award a plan on every sign-up).
 */
export const appConfig = pgTable(
  'app_config',
  {
    key: text('key').primaryKey().notNull(),
    value: jsonb('value').notNull(),
    isPublic: boolean('is_public').notNull().default(false),
    minValue: numeric('min_value'),
    maxValue: numeric('max_value'),
    description: text('description').notNull().default(''),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    /** Who last set it. No foreign key: an audit-adjacent fact outlives the admin's account. */
    updatedBy: uuid('updated_by'),
  },
  (t) => [
    check('app_config_key_format', sql`${t.key} ~ '^[a-z][a-z0-9_]{1,63}$'`),
    check('app_config_description_len', sql`char_length(${t.description}) <= 300`),
    check(
      'app_config_bounds',
      sql`jsonb_typeof(${t.value}) <> 'number' or ((${t.minValue} is null or (${t.value} #>> '{}')::numeric >= ${t.minValue}) and (${t.maxValue} is null or (${t.value} #>> '{}')::numeric <= ${t.maxValue}))`
    ),
    pgPolicy('app_config_select_public', {
      for: 'select',
      to: [anonRole, authenticatedRole],
      using: sql`${t.isPublic}`,
    }),
  ]
).enableRLS();

/**
 * A plan given without a payment (an admin grant, a referral reward), with its
 * provenance: source, who granted it, why, the window, and any revocation. A grant
 * runs alongside paid time and never shortens it; a referral reward EXTENDS (it
 * starts when the person's current time on that plan or a higher one ends).
 *
 * No client policy: a person sees their own entitlement through `my_plan()`, which
 * never projects an administrator's id or reason.
 */
export const planGrants = pgTable(
  'plan_grants',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    planId: text('plan_id')
      .notNull()
      .references(() => plans.id),
    source: grantSource('source').notNull(),
    /** Seats for a per-seat plan (the grantee's team is created or resized to match). */
    seats: smallint('seats').notNull().default(1),
    /** Months a referral reward added; counted against the rolling cap. Null for admin grants. */
    months: smallint('months'),
    /** No foreign key, like `admin_audit.actor`: who granted it survives that admin's deletion. */
    grantedBy: uuid('granted_by'),
    reason: text('reason').notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull().defaultNow(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    /** Unspent referral time in microseconds; a later entitlement pauses this budget. */
    referralRemainingUs: bigint('referral_remaining_us', { mode: 'number' }),
    /** Last instant at which the referral time budget was accounted. */
    referralAccountedAt: timestamp('referral_accounted_at', { withTimezone: true }),
    /** The blocker projection used to account elapsed time on the next transition. */
    referralBlockedRanges: timestampMultiRange('referral_blocked_ranges'),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    revokedBy: uuid('revoked_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('plan_grants_window', sql`${t.endsAt} > ${t.startsAt}`),
    check('plan_grants_reason_len', sql`char_length(${t.reason}) between 1 and 500`),
    check('plan_grants_seats_range', sql`${t.seats} between 1 and 1000`),
    check('plan_grants_months_range', sql`${t.months} is null or ${t.months} between 1 and 12`),
    check(
      'plan_grants_referral_remaining_nonneg',
      sql`${t.referralRemainingUs} is null or ${t.referralRemainingUs} >= 0`
    ),
    index('plan_grants_user_ends_idx').on(t.userId, t.endsAt),
    index('plan_grants_created_idx').on(t.createdAt, t.id),
    index('plan_grants_plan_idx').on(t.planId),
  ]
).enableRLS();

/**
 * "Request this plan", in place of the pay button while checkout is dormant (D61).
 * A request grants nothing (D68): when checkout opens, an admin's `requests.notify_open`
 * emails each pending request a link to pay, and the request closes as `notified`.
 *
 * One pending request per person, by the partial unique index. The person files and
 * reads their own; `status` and every stamp are outside the INSERT grant.
 */
export const planRequests = pgTable(
  'plan_requests',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .default(sql`auth.uid()`)
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    planId: text('plan_id')
      .notNull()
      .references(() => plans.id),
    interval: billingInterval('interval').notNull(),
    seats: smallint('seats').notNull().default(1),
    /** The person's own words. Never copied into an audit row. */
    note: text('note'),
    status: planRequestStatus('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    /** Set while one `notify_open` batch is sending, so two admins never email a request twice. */
    notifyClaimedAt: timestamp('notify_claimed_at', { withTimezone: true }),
    notifyClaimToken: uuid('notify_claim_token'),
    notifyUncertainAt: timestamp('notify_uncertain_at', { withTimezone: true }),
    notifiedAt: timestamp('notified_at', { withTimezone: true }),
    closedAt: timestamp('closed_at', { withTimezone: true }),
    /** No foreign key: who closed a request survives that admin's deletion. */
    closedBy: uuid('closed_by'),
  },
  (t) => [
    check('plan_requests_seats_range', sql`${t.seats} between 1 and 1000`),
    check(
      'plan_requests_note_len',
      sql`${t.note} is null or char_length(${t.note}) between 1 and 1000`
    ),
    check(
      'plan_requests_notify_claim_pair',
      sql`(${t.notifyClaimedAt} is null) = (${t.notifyClaimToken} is null)`
    ),
    uniqueIndex('plan_requests_one_pending_idx')
      .on(t.userId)
      .where(sql`${t.status} = 'pending'`),
    index('plan_requests_status_created_idx').on(t.status, t.createdAt, t.id),
    index('plan_requests_user_created_idx').on(t.userId, t.createdAt),
    index('plan_requests_plan_idx').on(t.planId),
    index('plan_requests_notify_uncertain_idx')
      .on(t.notifyUncertainAt, t.id)
      .where(sql`${t.notifyUncertainAt} is not null`),
    index('plan_requests_notify_claimed_idx')
      .on(t.notifyClaimedAt, t.id)
      .where(sql`${t.notifyClaimedAt} is not null`),

    pgPolicy('plan_requests_insert_own', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: ownedBySignedIn(t.userId),
    }),
    pgPolicy('plan_requests_select_own', {
      for: 'select',
      to: authenticatedRole,
      using: ownedBySignedIn(t.userId),
    }),
  ]
).enableRLS();
