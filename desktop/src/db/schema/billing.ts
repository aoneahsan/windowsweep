/**
 * Polar payments (D61, D67, D70): paid periods, the price quoted at checkout, and
 * webhook idempotency.
 *
 * No client policy and no client grant on any table here. The `polar-checkout` and
 * `polar-webhook` Edge Functions reach them only through definer functions
 * (`*_v140_billing.sql`), and a person sees their own entitlement through `my_plan()`.
 *
 * PRICING (D67). An order is priced against the price RECORDED for it, never the
 * plan row as it stands at payment time: the first order of a checkout against its
 * `checkout_quotes` row, a renewal against the first paid period of the same Polar
 * subscription. An admin's price change therefore applies to new purchases only, and
 * a running subscription renews at the price it started with until it is cancelled.
 */

import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';
import { billingInterval, subscriptionStatus } from './enums';
import { plans } from './plans';
import { teams } from './teams';

/**
 * One row per PAID ORDER: one paid period. A renewal is a new row that starts where
 * the previous one ends, so a returned payment ends exactly the time it paid for.
 */
export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    planId: text('plan_id')
      .notNull()
      .references(() => plans.id),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
    interval: billingInterval('interval').notNull(),
    seats: smallint('seats').notNull().default(1),
    status: subscriptionStatus('status').notNull().default('active'),
    periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
    periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
    /** The order's subtotal before tax, in cents: what this period was paid at. */
    amountCents: integer('amount_cents').notNull(),
    currency: text('currency').notNull(),
    polarOrderId: text('polar_order_id').notNull().unique(),
    polarSubscriptionId: text('polar_subscription_id'),
    polarCustomerId: text('polar_customer_id'),
    /** Set when the bank or Polar returned the payment; the period stops counting at once. */
    returnedAt: timestamp('returned_at', { withTimezone: true }),
    returnedCents: integer('returned_cents'),
    /** Set when the Polar subscription was cancelled through the server (D70), before deletion. */
    cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('subscriptions_period', sql`${t.periodEnd} > ${t.periodStart}`),
    check('subscriptions_seats_range', sql`${t.seats} between 1 and 1000`),
    check('subscriptions_amount_nonneg', sql`${t.amountCents} >= 0`),
    check('subscriptions_currency_format', sql`${t.currency} ~ '^[a-z]{3}$'`),
    check(
      'subscriptions_returned_pair',
      sql`(${t.status} = 'returned') = (${t.returnedAt} is not null)`
    ),
    index('subscriptions_user_period_idx').on(t.userId, t.periodEnd),
    index('subscriptions_team_period_idx').on(t.teamId, t.periodEnd),
    index('subscriptions_polar_sub_idx').on(t.polarSubscriptionId, t.periodStart),
    index('subscriptions_plan_idx').on(t.planId),
  ]
).enableRLS();

/**
 * The price a checkout was created at, recorded by the server when Polar returns the
 * checkout id. The first order of that checkout is priced against this row and takes
 * its account, plan, period and seats from it - never from the order's metadata.
 */
export const checkoutQuotes = pgTable(
  'checkout_quotes',
  {
    polarCheckoutId: text('polar_checkout_id').primaryKey().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    planId: text('plan_id')
      .notNull()
      .references(() => plans.id),
    interval: billingInterval('interval').notNull(),
    seats: smallint('seats').notNull(),
    unitCents: integer('unit_cents').notNull(),
    amountCents: integer('amount_cents').notNull(),
    currency: text('currency').notNull().default('usd'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    /** The order that consumed it; a quote pays for one order only. */
    usedOrderId: text('used_order_id').unique(),
  },
  (t) => [
    check('checkout_quotes_seats_range', sql`${t.seats} between 1 and 1000`),
    check(
      'checkout_quotes_amount',
      sql`${t.unitCents} > 0 and ${t.amountCents} = ${t.unitCents} * ${t.seats}`
    ),
    check('checkout_quotes_currency_format', sql`${t.currency} ~ '^[a-z]{3}$'`),
    index('checkout_quotes_user_created_idx').on(t.userId, t.createdAt),
    index('checkout_quotes_plan_idx').on(t.planId),
  ]
).enableRLS();

/**
 * One row per webhook delivery (`webhook-id`). `order_id` with type `order.refunded`
 * is also the tombstone that stops a late `order.paid` from granting a payment that
 * was already returned.
 */
export const webhookEvents = pgTable(
  'webhook_events',
  {
    id: text('id').primaryKey().notNull(),
    type: text('type').notNull(),
    orderId: text('order_id'),
    receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    result: text('result'),
  },
  (t) => [
    check('webhook_events_id_len', sql`char_length(${t.id}) between 1 and 200`),
    index('webhook_events_received_idx').on(t.receivedAt),
    index('webhook_events_order_idx').on(t.orderId, t.type),
  ]
).enableRLS();
