# Schema authoring

Stable line only — `drizzle-orm` `^0.45`, `drizzle-kit` `~0.31`. 🔴 Never `@rc`
(`~/.claude/rules/package-version-known-issues.md`).

## `drizzle.config.ts`

```ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  // 🔴 THE BARREL, NEVER THE FOLDER — see the note below. This line said
  //    './src/db/schema' until 2026-08-21 and labflow copied it verbatim.
  schema: './src/db/schema/index.ts',     // barrel; one file per module beside it
  out: './supabase/migrations',           // the folder `supabase db push` already reads
  migrations: {
    prefix: 'supabase',                   // 🔴 emits 20260821143000_name.sql — the CLI's own format
  },
  entities: {
    roles: { provider: 'supabase' },      // 🔴 without this, drizzle-kit proposes DROPping
  },                                      //    anon / authenticated / service_role
  schemaFilter: ['public'],               // 🔴 keeps auth, storage, realtime out of the diff
  dbCredentials: {
    url: process.env.SUPABASE_DB_URL!,    // session pooler; supplied at command time, never committed
  },
  breakpoints: true,
  strict: true,
  verbose: true,
});
```

🔴 **Three of these are load-bearing and silently destructive if omitted.** Without `entities.roles.provider`
drizzle-kit does not know Supabase's roles are pre-existing and generates `DROP ROLE authenticated`. Without
`schemaFilter` it diffs the `auth` and `storage` schemas Supabase owns. Without `migrations.prefix` the files
are named `0000_name.sql`, which `supabase db push` will not accept as a version.

🔴 **`prefix` cannot be mixed within one folder.** A project that has ever generated with a different prefix
must settle on one before generating again.

🔴 **`schema` points at the BARREL, and this file taught the wrong thing until 2026-08-21.** Pointed at the
folder, drizzle-kit loads `index.ts` *and* every module it re-exports, registering each declaration twice.
The symptom is `Warning: duplicated view name across public schema`, which reads like a schema fault and is a
config fault — and `adoption.md`'s breakage table has always said so, so the two files disagreed.

⚠️ **It is LATENT, which is why it survives review.** With no views in the schema the re-export yields the
same object identities, so `drizzle-kit export` emits each table exactly once and everything looks fine — it
dies the day the schema gains its first `pgView`. **So criterion 5 is checked by READING `drizzle.config.ts`,
never by observing that `generate` or `export` succeeded.** Found on labflow 2026-08-21, where the project's
own task record asserted the config was already correct.

## The connection URL

Only `pull`, `push` and `studio` need it — `generate`, `check` and `export` are offline. Fetch it from the
FilesHub vault at command time (`aoneahsan-cccs-fileshub-vault`), never commit it, never pass it as a
`--flag` (it lands in the process list):

```bash
SUPABASE_DB_URL='postgresql://postgres.<ref>:<url-encoded-password>@aws-0-<region>.pooler.supabase.com:5432/postgres' \
  npx drizzle-kit generate
```

🔴 `db.<ref>.supabase.co` is **IPv6-only** and will not resolve on an IPv4 network — use the session pooler.
🔴 **The node `postgres` driver needs `ssl: 'require'` against the pooler.** Without it it CONNECT_TIMEOUTs
after ~45s — which reads like a network or credentials fault, except `psql` negotiates TLS itself and
connects fine on the identical URL. When the two disagree, the driver is the one that is wrong.
🔴 A stored `db_url_*` may still carry the literal `[YOUR-PASSWORD]`; substitute the real password
**percent-encoded**, or you get `28P01` and blame the vault.

## A table, complete

```ts
import { sql } from 'drizzle-orm';
import { index, pgEnum, pgPolicy, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { anonRole, authenticatedRole, authUsers } from 'drizzle-orm/supabase';

export const postStatus = pgEnum('post_status', ['draft', 'published', 'archived']);

export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    authorId: uuid('author_id')
      .notNull()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    status: postStatus('status').notNull().default('draft'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('posts_author_id_idx').on(t.authorId),                    // 🔴 index every RLS-referenced column
    index('posts_status_created_at_idx').on(t.status, t.createdAt.desc()),

    pgPolicy('posts_select_published', {
      for: 'select',
      to: anonRole,
      using: sql`${t.status} = 'published'`,
    }),
    pgPolicy('posts_select_own', {
      for: 'select',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${t.authorId}`,
    }),
    pgPolicy('posts_insert_own', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: sql`(select auth.uid()) = ${t.authorId}`,
    }),
    pgPolicy('posts_update_own', {
      for: 'update',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${t.authorId}`,            // gates WHICH rows
      withCheck: sql`(select auth.uid()) = ${t.authorId}`,        // gates the RESULTING row
    }),
    pgPolicy('posts_delete_own', {
      for: 'delete',
      to: authenticatedRole,
      using: sql`(select auth.uid()) = ${t.authorId}`,
    }),
  ],
);
```

**Write column names explicitly** (`uuid('author_id')`) rather than relying on a casing setting. The mapping
then lives in the schema file, survives a config change, and reads the same as the SQL it produces.

## 🔴 `(select auth.uid())`, never bare `auth.uid()`

A bare call is evaluated **once per row** — a million rows, a million calls. Wrapped in a scalar subquery it
is evaluated once and cached: **5–10x faster, and 100x+ on a large table**
(`supabase:supabase-postgres-best-practices` → `security-rls-performance`). The `authUid()` helper in
`drizzle-orm/supabase` already wraps it; a hand-written `sql` fragment does not, and that is the one people
get wrong.

## RLS on, with no policies

Adding any policy enables RLS automatically. **A table with no policies does not**, and that is the case that
matters — a table nothing may read directly is the one where a missing `ENABLE ROW LEVEL SECURITY` is
invisible:

```ts
export const auditLog = pgTable('audit_log', { /* … */ }).enableRLS();   // deny-all, reached only by a definer function
```

🔴 In the 1.0 beta this was renamed `pgTable.withRLS(...)`. On the stable line it is `.enableRLS()`. If you
find `withRLS` in a project, someone installed `@rc`.

## `drizzle-orm/supabase` exports

| Export | Is |
|---|---|
| `anonRole`, `authenticatedRole`, `serviceRole`, `postgresRole`, `supabaseAuthAdminRole` | the pre-existing roles, marked `.existing()` so drizzle never tries to create them |
| `authUsers` | the `auth.users` table, for foreign keys |
| `authUid(column)` | `(select auth.uid() = <column>)` — pre-wrapped |
| `realtimeMessages`, `realtimeTopic` | for policies on the realtime plane |

Attaching a policy to a table you do not define: `pgPolicy('…', { … }).link(realtimeMessages)`.

## Full-text search

The generated column plus GIN index is expressible in schema-as-code, and it is the capability that puts a
project on Postgres in the first place:

```ts
searchVector: tsvector('search_vector').generatedAlwaysAs(
  (): SQL => sql`to_tsvector('english', coalesce(${posts.title}, '') || ' ' || coalesce(${posts.body}, ''))`,
),
// and in the extras array:
index('posts_search_idx').using('gin', t.searchVector),
```

## The read budget is unchanged

Nothing here relaxes `~/.claude/rules/data-fetch-budget.md`. Every list read is still paginated — 20 default,
50 hard max — the database still filters, sorts and counts, and keyset pagination still beats `OFFSET` at
depth. Drizzle changes who writes the DDL, not how much data crosses the wire.
