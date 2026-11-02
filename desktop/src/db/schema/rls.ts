/**
 * Row-level policy predicates shared by the 1.4.0 tables, and the two existing ones
 * whose write policies 1.4.0 narrows.
 *
 * Every `auth.*` call sits inside a sub-select, so the planner evaluates it once per
 * statement instead of once per candidate row.
 *
 * `private.is_anon()` is created by the custom migration that runs BEFORE the
 * generated one (`*_v140_private_helpers.sql`), because a policy that calls a
 * function cannot be created before the function exists.
 *
 * Anonymous sign-ins are on from 1.4.0 (D58): every desktop install holds an
 * `authenticated` JWT whose `is_anonymous` claim is true. Such a DEVICE SESSION may
 * use its allowance and its own device row and nothing else; account data (settings,
 * synced runs, contact and plan requests) needs a signed-in account.
 */

import { sql, type SQL } from 'drizzle-orm';
import type { AnyPgColumn } from 'drizzle-orm/pg-core';

/** The caller owns the row. */
export const ownedBy = (column: AnyPgColumn): SQL => sql`(select auth.uid()) = ${column}`;

/** The caller is a signed-in account, not a device session. */
export const signedIn: SQL = sql`(select private.is_anon()) is false`;

/** The caller owns the row AND is a signed-in account. */
export const ownedBySignedIn = (column: AnyPgColumn): SQL =>
  sql`${ownedBy(column)} and ${signedIn}`;
