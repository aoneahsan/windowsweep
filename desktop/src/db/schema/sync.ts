/**
 * The whole synced data model, as TypeScript. Drizzle authors it; the Supabase
 * CLI applies it.
 *
 * 🔴 WHAT NEVER LEAVES THE MACHINE: a file path, a folder name, a drive label, a
 * machine name, a Windows user name, or the contents of anything. The Account
 * screen states that, and this file is what makes it enforceable rather than a
 * promise - there is no column here that could hold one. `stripRun` in
 * `src/lib/sync.ts` narrows the object before it is sent; this narrows what the
 * database could accept even from a client that tried.
 *
 * 🔴 The row-level policies live here (Drizzle models policies). The `grant` and
 * `revoke` do NOT - Drizzle emits no revoke at all, so a generated `create table`
 * would arrive with Postgres's default PUBLIC grants and `anon` reaches PUBLIC.
 * The paired privilege block is a `drizzle-kit generate --custom` migration in
 * the same folder under the same history. RLS filters rows; it does not remove a
 * grant, and policies police rows, never columns.
 */

import { sql } from 'drizzle-orm';
import {
  bigint,
  boolean,
  integer,
  jsonb,
  pgPolicy,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { authUsers, authenticatedRole } from 'drizzle-orm/supabase';

/** One row per person. The primary key IS their auth id, so there is no join. */
export const userSettings = pgTable(
  'user_settings',
  {
    userId: uuid('user_id')
      .primaryKey()
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    email: text('email'),
    displayName: text('display_name'),
    /** The ten appearance axes, as the client stores them. Opaque to the server. */
    prefs: jsonb('prefs').notNull().default(sql`'{}'::jsonb`),
    developer: boolean('developer').notNull().default(false),
    /** Newest-wins reconciliation compares this, and the loser is offered back. */
    settingsUpdatedAt: timestamp('settings_updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    /** Refreshed when this window syncs, so a machine no longer used reads as such. */
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  () => [
    pgPolicy('user_settings_select_own', {
      for: 'select',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = user_id`,
    }),
    pgPolicy('user_settings_insert_own', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: sql`(select auth.uid()) = user_id`,
    }),
    pgPolicy('user_settings_update_own', {
      for: 'update',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = user_id`,
      withCheck: sql`(select auth.uid()) = user_id`,
    }),
    pgPolicy('user_settings_delete_own', {
      for: 'delete',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = user_id`,
    }),
  ],
).enableRLS();

/**
 * One row per run. Created once and never updated - a run is a record of
 * something that already happened, so an editable one is a record that can be
 * made to disagree with the log file it was written from. There is deliberately
 * no update policy.
 */
export const runs = pgTable(
  'runs',
  {
    /** The client's own run id, which is also its report folder name. */
    runId: text('run_id').primaryKey().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
    /** `all`, `scan`, `profile: dev` - the engine's own vocabulary, never invented. */
    mode: text('mode').notNull(),
    dryRun: boolean('dry_run').notNull(),
    elevated: boolean('elevated').notNull(),
    /** Section NUMBERS only. A section number is a frozen public contract. */
    sections: smallint('sections').array().notNull(),
    /* 🔴 bigint WITHOUT minValue/maxValue. `maxValue: 9223372036854775807`
       exceeds Number.MAX_SAFE_INTEGER, reaches both the snapshot and the SQL
       already rounded, and Postgres then refuses the CREATE TABLE. `mode: 'number'`
       is safe here because a byte count from one disk cannot approach 2^53. */
    freedBytes: bigint('freed_bytes', { mode: 'number' }).notNull().default(0),
    estimatedBytes: bigint('estimated_bytes', { mode: 'number' }).notNull().default(0),
    durationMs: integer('duration_ms').notNull().default(0),
  },
  () => [
    pgPolicy('runs_select_own', {
      for: 'select',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = user_id`,
    }),
    pgPolicy('runs_insert_own', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: sql`(select auth.uid()) = user_id`,
    }),
    /* No update policy, deliberately. A run row is append-only. */
    pgPolicy('runs_delete_own', {
      for: 'delete',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = user_id`,
    }),
  ],
).enableRLS();
