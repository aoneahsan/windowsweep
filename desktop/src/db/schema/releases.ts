/**
 * The update flow's layer 2 (`aoneahsan-cccs-update-flow` `references/contract.md`):
 * an admin-published release record that every surface checks at start, every 15
 * minutes and when it comes back into view.
 *
 * `app_releases` has NO client policy and no client grant. Clients read the public
 * view `latest_app_releases` - the latest row per platform and channel, without
 * `created_by` - and admins publish through `publish_app_release(...)`, which writes
 * the row and its `admin_audit` row in one transaction. A release is never edited (a
 * trigger refuses any UPDATE); a mistake is corrected by publishing a newer row.
 */

import { sql } from 'drizzle-orm';
import { check, index, pgTable, pgView, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { releaseChannel, releasePlatform, releaseSeverity } from './enums';

/** Strict `x.y.z`: no prerelease, no build metadata, no leading zeros. */
const SEMVER = sql.raw(`'^(0|[1-9][0-9]{0,5})\\.(0|[1-9][0-9]{0,5})\\.(0|[1-9][0-9]{0,5})$'`);

export const appReleases = pgTable(
  'app_releases',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    platform: releasePlatform('platform').notNull(),
    channel: releaseChannel('channel').notNull(),
    /** The version a person must reach. */
    version: text('version').notNull(),
    severity: releaseSeverity('severity').notNull(),
    /** Shown on the block screen and the notice: plain words, written for the person. */
    reason: text('reason').notNull(),
    /** Set when only a new binary covers the release. */
    minNativeVersion: text('min_native_version'),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull().defaultNow(),
    /** The publishing admin. No foreign key: the record outlives that admin's account. */
    createdBy: uuid('created_by').notNull(),
  },
  (t) => [
    check('app_releases_version_format', sql`${t.version} ~ ${SEMVER}`),
    check(
      'app_releases_min_native_format',
      sql`${t.minNativeVersion} is null or ${t.minNativeVersion} ~ ${SEMVER}`
    ),
    check('app_releases_reason_len', sql`char_length(${t.reason}) between 1 and 280`),
    index('app_releases_latest_idx').on(t.platform, t.channel, t.publishedAt),
  ]
).enableRLS();

/**
 * The one row per platform and channel a client reads (`eq platform`, `eq channel`,
 * `limit 1`). `security_invoker = false` on purpose: the view reads `app_releases` as
 * its owner, so the table needs no client policy, and the view exposes exactly these
 * columns - never `created_by`. SELECT on it is granted to `anon` and `authenticated`
 * in the privilege migration.
 */
export const latestAppReleases = pgView('latest_app_releases', {
  id: uuid('id'),
  platform: releasePlatform('platform'),
  channel: releaseChannel('channel'),
  version: text('version'),
  severity: releaseSeverity('severity'),
  reason: text('reason'),
  minNativeVersion: text('min_native_version'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
})
  .with({ securityInvoker: false })
  .as(
    sql`select distinct on (r.platform, r.channel) r.id, r.platform, r.channel, r.version, r.severity, r.reason, r.min_native_version, r.published_at from public.app_releases r order by r.platform, r.channel, r.published_at desc, r.id desc`
  );
