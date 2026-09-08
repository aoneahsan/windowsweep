/**
 * The marketing site's tables (`windowsweep-web`), on the SAME hosted Supabase
 * project as the desktop app - decision P8-D2: the schema keeps one home, here,
 * and the site reads generated types from it. One auth pool, one database, one
 * migration history.
 *
 * 🔴 WHAT THIS FILE OWNS AND WHAT IT DOES NOT. Drizzle models tables, columns,
 * indexes, CHECK constraints and row-level POLICIES. It emits no `grant`, no
 * `revoke`, no function and no trigger - so three things this security model
 * depends on live in `--custom` migrations in the same folder under the same
 * history:
 *
 *   1. `public.is_platform_admin()`      the definer function every admin policy
 *                                        below calls. It is created in the
 *                                        migration BEFORE this one, because a
 *                                        policy that calls a function cannot be
 *                                        created before the function exists.
 *   2. the paired privilege block         `revoke` then `grant (cols)`. A
 *                                        `grant (cols)` layered on Supabase's
 *                                        default ACL is a SILENT NO-OP - a grant
 *                                        adds and never subtracts, so the broad
 *                                        one wins.
 *   3. the three triggers                 profile creation on `auth.users`, the
 *                                        contact-request rate limit, and the
 *                                        audit row.
 *
 * 🔴 POLICIES POLICE ROWS, NEVER COLUMNS. Every column-level rule stated in the
 * comments here - `platform_role` writable by nobody, `email` written only by
 * the signup trigger, an admin able to touch only `status`/`handled_at`/
 * `handled_by` - is enforced by the GRANT, not by anything in this file. Read
 * the privilege-block migration beside it, and verify both from
 * `information_schema.column_privileges`, never from either file's text.
 */

import { sql } from 'drizzle-orm';
import { check, index, jsonb, pgPolicy, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authUsers, authenticatedRole } from 'drizzle-orm/supabase';

/** `(select ...)` so the planner evaluates the definer call ONCE per statement
 *  rather than once per candidate row. Unwrapped, an admin listing the inbox
 *  pays one function call per row in the table. */
const isPlatformAdmin = sql`(select public.is_platform_admin())`;

/**
 * One row per person, keyed by their auth id. Created by the `on_auth_user_created`
 * trigger on `auth.users` - the client never inserts one, and holds no INSERT
 * grant on this table at all.
 *
 * 🔴 `platform_role` IS WRITABLE BY NOBODY THROUGH THE API. It is out of every
 * grant, so PostgREST cannot write it under any policy, for any caller, admin or
 * not. It changes only out of band: the signup trigger stamps `superadmin` for
 * the two fixed owner emails, and anything else is a reviewed SQL statement. RLS
 * cannot defend this - a policy decides which ROWS you may update, and once
 * table-wide UPDATE exists "your own row" includes your own role. That exact
 * shape shipped a live escalation on a sibling project.
 *
 * 🔴 `email` is written only by the signup trigger, from `auth.users.email`.
 * It is a mirror with exactly ONE writer, which is what keeps it from disagreeing
 * with the identity it copies. It exists because PostgREST cannot read the `auth`
 * schema, so this is the only way the account page shows an address and the only
 * way the admin users list shows one at all.
 */
export const profiles = pgTable(
  'profiles',
  {
    userId: uuid('user_id')
      .primaryKey()
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    /** Mirrored from `auth.users.email` by the signup trigger. Not in any grant. */
    email: text('email'),
    /** The one field the person owns. In the UPDATE grant; nothing else here is. */
    displayName: text('display_name'),
    /** 🔴 Out of every grant. See the note above - this is a privilege column. */
    platformRole: text('platform_role').notNull().default('user'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    /** Trigger-maintained by `set_updated_at`, and out of the UPDATE grant.
     *  Both halves are required: either one alone leaves it client-writable. */
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('profiles_platform_role_check', sql`${t.platformRole} in ('superadmin', 'admin', 'user')`),

    pgPolicy('profiles_select_own', {
      for: 'select',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${t.userId}`,
    }),
    /* Admins read every profile - the admin users list. There is deliberately no
       admin UPDATE policy: an admin edits nobody's profile through the API. */
    pgPolicy('profiles_select_admin', {
      for: 'select',
      to: authenticatedRole,
      using: isPlatformAdmin,
    }),
    /* Update your own row. The GRANT narrows this to `display_name` alone. */
    pgPolicy('profiles_update_own', {
      for: 'update',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${t.userId}`,
      withCheck: sql`(select auth.uid()) = ${t.userId}`,
    }),
    /* No INSERT policy and no INSERT grant: the signup trigger is the only
       writer, so a client cannot mint a profile row under an id it chose.
       No DELETE policy either - a profile dies with its `auth.users` row, by
       cascade, which is what account deletion already does. */
  ],
).enableRLS();

/**
 * A message from a signed-in person to the owner. Sign-in is required (decision
 * P8-D1), which is what lets the rate limit and the ownership policy be real
 * instead of a captcha guess.
 *
 * 🔴 `subject` and `message` are NOT NULL, and that is what makes their CHECKs
 * enforce anything: a CHECK constraint evaluating to NULL PASSES, so
 * `char_length(message) between 10 and 4000` accepts a null message outright
 * unless the column refuses one first.
 *
 * 🔴 NEVER `.upsert()` this table. PostgREST builds `ON CONFLICT DO UPDATE SET`
 * from every payload key and Postgres checks the privilege at PLAN time, so an
 * upsert against a column-scoped UPDATE grant is refused before it runs -
 * `permission denied for table contact_requests`, naming the TABLE and not the
 * column, which reads exactly like a broken policy. Insert, and handle `23505`.
 */
export const contactRequests = pgTable(
  'contact_requests',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    /** Out of the INSERT grant - a sender cannot file a request already handled. */
    status: text('status').notNull().default('new'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    handledAt: timestamp('handled_at', { withTimezone: true }),
    /* 🔴 No foreign key on `handled_by`, deliberately, and none on
       `admin_audit.actor` either. Who handled a request is an audit-adjacent
       fact; a cascade from `auth.users` would erase the answer the moment that
       admin's account went away. `user_id` DOES cascade, because that half is
       the sender's own data and account deletion must take it. */
    handledBy: uuid('handled_by'),
  },
  (t) => [
    check('contact_requests_subject_len_check', sql`char_length(${t.subject}) <= 120`),
    check(
      'contact_requests_message_len_check',
      sql`char_length(${t.message}) between 10 and 4000`,
    ),
    check('contact_requests_status_check', sql`${t.status} in ('new', 'handled', 'archived')`),

    /* Serves the sender's own list AND the rate-limit trigger's count. Plain
       ascending on purpose: Postgres scans an index backwards for `order by
       created_at desc` just as well, and drizzle-kit 0.31 has measured defects
       around DESC and opclasses in composite index definitions. */
    index('contact_requests_user_created_idx').on(t.userId, t.createdAt),
    /* The admin inbox, filtered by status. */
    index('contact_requests_status_created_idx').on(t.status, t.createdAt),

    pgPolicy('contact_requests_insert_own', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: sql`(select auth.uid()) = ${t.userId}`,
    }),
    pgPolicy('contact_requests_select_own', {
      for: 'select',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${t.userId}`,
    }),
    pgPolicy('contact_requests_select_admin', {
      for: 'select',
      to: authenticatedRole,
      using: isPlatformAdmin,
    }),
    /* Triage. The GRANT narrows it to `status`, `handled_at`, `handled_by`; this
       policy decides WHO, the grant decides WHAT. A non-admin has no UPDATE
       policy that passes, so their update matches zero rows and returns
       200-with-0-rows rather than a refusal - assert the row count, never the
       status code. */
    pgPolicy('contact_requests_update_admin', {
      for: 'update',
      to: authenticatedRole,
      using: isPlatformAdmin,
      withCheck: isPlatformAdmin,
    }),
    /* No DELETE policy and no DELETE grant: nobody deletes a contact request
       through the API. A sender's rows go when their account does, by cascade. */
  ],
).enableRLS();

/**
 * The immutable admin audit log. Rows arrive ONLY from the
 * `audit_contact_request_status` trigger, which is `security definer` and
 * therefore writes without needing - or having - any INSERT grant to hand out.
 *
 * 🔴 NOBODY HOLDS INSERT, UPDATE OR DELETE ON THIS TABLE. That is the whole
 * point and it is the grant, not a policy, that does it. A tamper-evident chain
 * over a forgeable insert is a chain of custody with no custody: a sibling
 * project shipped an audit table `authenticated` could write, and one statement
 * attributed an action to somebody else while every integrity check still read
 * INTACT. Append-only and tamper-evident are different properties.
 */
export const adminAudit = pgTable(
  'admin_audit',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    /** Null means the change was made out of band in SQL rather than by a
     *  signed-in admin - the only path that has no `auth.uid()` to record. */
    actor: uuid('actor'),
    action: text('action').notNull(),
    subjectTable: text('subject_table').notNull(),
    subjectId: text('subject_id').notNull(),
    before: jsonb('before'),
    after: jsonb('after'),
    at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('admin_audit_at_idx').on(t.at),
    index('admin_audit_subject_idx').on(t.subjectTable, t.subjectId),

    /* Read-only, admins only. There is no insert, update or delete policy
       because there is no insert, update or delete grant - a policy for a
       privilege nobody holds would only read as though one did. */
    pgPolicy('admin_audit_select_admin', {
      for: 'select',
      to: authenticatedRole,
      using: isPlatformAdmin,
    }),
  ],
).enableRLS();
