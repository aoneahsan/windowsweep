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
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { authUsers } from 'drizzle-orm/supabase';
import { teamRole } from './enums';

/** One team per owner. Seat capacity derives from the active paid period or grant. */
export const teams = pgTable(
  'teams',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    name: text('name').notNull(),
    ownerId: uuid('owner_id')
      .notNull()
      .unique()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [check('teams_name_len', sql`char_length(${t.name}) between 1 and 80`)]
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
    sendClaimedAt: timestamp('send_claimed_at', { withTimezone: true }),
    sendClaimToken: uuid('send_claim_token'),
    sendUncertainAt: timestamp('send_uncertain_at', { withTimezone: true }),
  },
  (t) => [
    check(
      'team_invites_email_format',
      sql`${t.email} = lower(${t.email}) and char_length(${t.email}) between 3 and 254 and position('@' in ${t.email}) > 1`
    ),
    check(
      'team_invites_send_claim_pair',
      sql`(${t.sendClaimedAt} is null) = (${t.sendClaimToken} is null)`
    ),
    uniqueIndex('team_invites_open_unique')
      .on(t.teamId, t.email)
      .where(sql`${t.acceptedAt} is null`),
    index('team_invites_email_idx').on(t.email),
    index('team_invites_send_uncertain_idx')
      .on(t.sendUncertainAt, t.id)
      .where(sql`${t.sendUncertainAt} is not null`),
    index('team_invites_send_claimed_idx')
      .on(t.sendClaimedAt, t.id)
      .where(sql`${t.sendClaimedAt} is not null`),
  ]
).enableRLS();
