/**
 * A PC and the real runs claimed on it (the monthly allowance, D56/D62).
 *
 * WHAT A DEVICE ROW CAN HOLD: a random install id the app generated once, who it
 * belongs to now, and when it was first and last seen. There is no column for a
 * machine name, host name, Windows version or any label a person types, and none may
 * be added - the product promises that a machine name never leaves the machine, and a
 * free-text label is exactly where one would be typed.
 *
 * Rows are written only by the definer functions in `*_v140_allowance.sql`
 * (`get_allowance`, `claim_run`, `device_handoff_*`); a client may read its own
 * devices and delete one ("Forget this PC"). Device sessions (anonymous JWTs) get
 * these rights too, because the allowance is per device.
 */

import { sql } from 'drizzle-orm';
import {
  check,
  index,
  pgPolicy,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { authenticatedRole, authUsers } from 'drizzle-orm/supabase';
import { runPool } from './enums';
import { ownedBy } from './rls';

/** A PC, keyed by the random id the app keeps in its data directory. */
export const devices = pgTable(
  'devices',
  {
    id: uuid('id').primaryKey().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    /** SHA-256 (hex) of a one-time hand-over code; the code itself is never stored. */
    handoffCodeHash: text('handoff_code_hash'),
    handoffExpiresAt: timestamp('handoff_expires_at', { withTimezone: true }),
  },
  (t) => [
    check(
      'devices_handoff_pair',
      sql`(${t.handoffCodeHash} is null) = (${t.handoffExpiresAt} is null)`
    ),
    check(
      'devices_handoff_hash_format',
      sql`${t.handoffCodeHash} is null or ${t.handoffCodeHash} ~ '^[0-9a-f]{64}$'`
    ),
    /* The machine report and the admin view: one person's PCs, most recently seen first. */
    index('devices_user_seen_idx').on(t.userId, t.lastSeenAt),

    pgPolicy('devices_select_own', {
      for: 'select',
      to: authenticatedRole,
      using: ownedBy(t.userId),
    }),
    /* "Forget this PC". Its claims stay and keep counting for the device pool. */
    pgPolicy('devices_delete_own', {
      for: 'delete',
      to: authenticatedRole,
      using: ownedBy(t.userId),
    }),
    /* No INSERT or UPDATE policy: only the allowance functions create a device or move it. */
  ]
).enableRLS();

/**
 * One row per REAL run claimed (dry runs, scans and reports never claim), counted per
 * device and per account per UTC month.
 *
 * `device_id` has NO foreign key, and `user_id` is cleared rather than cascaded when an
 * account is deleted (D71): the row then holds only the random install id, the month,
 * the pool and the section numbers, and it keeps counting for that PC, so deleting an
 * account cannot reset a machine's monthly allowance.
 *
 * No client policy: the counts reach clients only through `get_allowance`, and rows
 * arrive only through `claim_run`.
 */
export const runClaims = pgTable(
  'run_claims',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    deviceId: uuid('device_id').notNull(),
    userId: uuid('user_id').references(() => authUsers.id, { onDelete: 'set null' }),
    /** The UTC month, 'YYYY-MM': the allowance boundary. */
    month: text('month').notNull(),
    pool: runPool('pool').notNull(),
    /** Section NUMBERS, a frozen add-only public contract; generous bound so a new section needs no migration. */
    sections: smallint('sections').array().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('run_claims_month_format', sql`${t.month} ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'`),
    check(
      'run_claims_sections_valid',
      sql`cardinality(${t.sections}) between 1 and 64 and array_position(${t.sections}, null) is null and 0 <= all (${t.sections}) and 99 >= all (${t.sections})`
    ),
    index('run_claims_device_month_idx').on(t.deviceId, t.month, t.pool),
    index('run_claims_user_month_idx').on(t.userId, t.month, t.pool),
  ]
).enableRLS();
