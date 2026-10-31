/**
 * Daily, payload-free telemetry budgets. The Edge Function is the only writer.
 * Neither table stores an event name, client id, session id, file path or email.
 */
import { sql } from 'drizzle-orm';
import { check, date, integer, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';

/** One count per UTC day and auth identity, including anonymous device sessions. */
export const analyticsDailyUsage = pgTable(
  'analytics_daily_usage',
  {
    day: date('day', { mode: 'string' }).notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    eventCount: integer('event_count').notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.day, t.userId] }),
    check('analytics_daily_usage_count_bound', sql`${t.eventCount} between 0 and 200`),
  ]
).enableRLS();

/** The global daily cap stops mass anonymous-account creation exhausting quota. */
export const analyticsDailyTotals = pgTable(
  'analytics_daily_totals',
  {
    day: date('day', { mode: 'string' }).primaryKey().notNull(),
    eventCount: integer('event_count').notNull().default(0),
  },
  (t) => [check('analytics_daily_totals_count_bound', sql`${t.eventCount} between 0 and 10000`)]
).enableRLS();
