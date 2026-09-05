import { defineConfig } from 'drizzle-kit';

/**
 * Drizzle authors the schema; the Supabase CLI applies it.
 *
 * 🔴 `drizzle-kit generate` is OFFLINE - it needs no database connection at all,
 * which is why the schema can be written before a Supabase project exists. Only
 * `supabase db push` is gated on credentials, and it is the ONE applier: one
 * folder, one applier, one history table.
 *
 * 🔴 Banned, and each for a reason that has cost a session:
 *   - `drizzle-kit push`    applies with no reviewable SQL, and reconciles
 *                           against objects it does not model
 *   - `drizzle-kit migrate` a second history table beside Supabase's own
 *   - the `@rc` / 1.0-beta line: it emits a DIRECTORY per migration, which the
 *     Supabase CLI cannot read, so `db push` reports success having applied
 *     nothing. Pinned to `drizzle-kit ~0.31` + `drizzle-orm ^0.45`.
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/*.ts',

  /* 🔴 The CLI's own folder and filename format, so drizzle's output lands where
     `supabase db push` already looks and `supabase_migrations.schema_migrations`
     stays the only history. Without `prefix: 'supabase'` the files are
     `0000_name.sql`, which `db push` will not accept as a version. */
  out: './supabase/migrations',
  migrations: { prefix: 'supabase' },

  /* 🔴 Three load-bearing keys. Each one is silently destructive if omitted:

     - `entities.roles.provider: 'supabase'` - without it, drizzle-kit does not
       know `authenticated` and `anon` are Supabase's, and generates
       `DROP ROLE authenticated`.
     - `schemaFilter: ['public']` - without it, it diffs the `auth` and `storage`
       schemas Supabase owns and proposes changes to them.
     - `migrations.prefix` - above. */
  entities: { roles: { provider: 'supabase' } },
  schemaFilter: ['public'],

  verbose: true,
  strict: true,
});
