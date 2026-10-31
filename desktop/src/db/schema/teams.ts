/**
 * The Team plan's workspace: Pro for every seat plus the shared fleet report (D56, D69).
 *
 * No client policy on any of the three tables. Every read and write goes through the
 * `team` Edge Function and its definer functions, which take the authenticated caller
 * as `p_actor` and re-check ownership or membership; the fleet report is aggregated
 * in SQL and returns run summaries only, never a path, file, machine or user name.
 */

import { sql } from 'drizzle-orm';
import {
  check,
  index,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';
import { teamRole } from './enums';

/** One team per owner. `seats` comes from the paid order or the grant (minimum on the plan row). */
export const teams = pgTable(
  'teams',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    name: text('name').notNull(),
    ownerId: uuid('owner_id')
      .notNull()
      .unique()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    seats: smallint('seats').notNull().default(3),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    check('teams_name_len', sql`char_length(${t.name}) between 1 and 80`),
    check('teams_seats_range', sql`${t.seats} between 1 and 1000`),
  ]
).enableRLS();

/** Seats in use. One team per account (unique `user_id`) keeps the fleet scope unambiguous. */
export const teamMembers = pgTable(
  'team_members',
  {
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    role: teamRole('role').notNull().default('member'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.teamId, t.userId] })]
).enableRLS();

/**
 * A pending seat. Accepted only by a signed-in account whose VERIFIED email equals
 * `email`; the address is the bearer check, so no token is stored. An invite email
 * goes out for a new invite, or once more per 24 hours (`last_sent_at`).
 */
export const teamInvites = pgTable(
  'team_invites',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    /** No foreign keys on the two actor columns: they are audit-adjacent facts. */
    invitedBy: uuid('invited_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true })
      .notNull()
      .default(sql`now() + interval '14 days'`),
    acceptedAt: timestamp('accepted_at', { withTimezone: true }),
    acceptedBy: uuid('accepted_by'),
    lastSentAt: timestamp('last_sent_at', { withTimezone: true }),
  },
  (t) => [
    check(
      'team_invites_email_format',
      sql`${t.email} = lower(${t.email}) and char_length(${t.email}) between 3 and 254 and position('@' in ${t.email}) > 1`
    ),
    uniqueIndex('team_invites_open_unique')
      .on(t.teamId, t.email)
      .where(sql`${t.acceptedAt} is null`),
    index('team_invites_email_idx').on(t.email),
  ]
).enableRLS();
