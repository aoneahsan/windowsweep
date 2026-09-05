-- The paired privilege block for the two tables created in the previous migration.
--
-- 🔴 WHY THIS FILE EXISTS. Drizzle emits no `revoke` at all, so a generated
-- `create table` arrives carrying Postgres's default grants, and on Supabase the
-- default ACL names `anon`, `authenticated` and `service_role` explicitly
-- (`arwdDxtm`). RLS filters ROWS; it never removes a GRANT, and policies police
-- rows, never columns. A `create table` migration without its privilege block is
-- incomplete, not small.
--
-- 🔴 `revoke ... from public` ALONE IS NOT ENOUGH HERE. It removes a grant those
-- three roles never used, and their named grants stand untouched. Name all four.
--
-- Verify the result from `information_schema.role_table_grants`, never from this
-- file - this describes intent, and intent is exactly what diverges.

-- ---------------------------------------------------------------------------
-- 1. Take everything back first. The order matters: a `grant (cols)` layered on
--    a table-wide grant is a silent no-op, because a grant adds and never
--    subtracts, so the broad one wins.
-- ---------------------------------------------------------------------------
revoke all on table public.user_settings from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.runs from public, anon, authenticated, service_role;
--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- 2. Grant back exactly what the desktop app does.
--
--    `anon` gets NOTHING on either table. Nothing in this product is public: a
--    signed-out person uses every cleanup feature locally and syncs nothing.
-- ---------------------------------------------------------------------------

-- user_settings: the client reads its own row, creates it once, and updates the
-- three fields it owns.
--
-- 🔴 `user_id` is deliberately OUT of the update grant. It is the primary key AND
-- the value every policy compares against, so a client able to rewrite it could
-- move its row under another account.
--
-- 🔴 CONSEQUENCE, AND IT IS NOT OPTIONAL: the client must NOT use `.upsert()` on
-- this table. PostgREST builds `ON CONFLICT DO UPDATE SET` from every payload
-- key and Postgres checks the privilege at PLAN time, so an upsert whose payload
-- carries `user_id` is refused outright - `permission denied for table
-- user_settings`, naming the TABLE and not the column, which reads exactly like a
-- broken policy. `src/lib/sync.ts` inserts and handles `23505` instead.
grant select on table public.user_settings to authenticated;
--> statement-breakpoint
grant insert (user_id, email, display_name, prefs, developer, settings_updated_at, last_seen_at)
  on table public.user_settings to authenticated;
--> statement-breakpoint
grant update (email, display_name, prefs, developer, settings_updated_at, last_seen_at)
  on table public.user_settings to authenticated;
--> statement-breakpoint
grant delete on table public.user_settings to authenticated;
--> statement-breakpoint

-- runs: append-only. No UPDATE grant of any kind, matching the deliberately
-- absent update policy - a run is a record of something that already happened.
grant select on table public.runs to authenticated;
--> statement-breakpoint
grant insert (run_id, user_id, started_at, mode, dry_run, elevated, sections,
              freed_bytes, estimated_bytes, duration_ms)
  on table public.runs to authenticated;
--> statement-breakpoint
grant delete on table public.runs to authenticated;
--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- 3. Stop the NEXT table inheriting the default.
--
-- 🔴 `alter default privileges` is PER-GRANTING-ROLE. Run as `postgres` it does
--    not touch the `supabase_admin` default, so a table created through the
--    Studio table editor re-acquires everything. Tables from these migrations are
--    covered; one made in Studio needs the revoke re-applied by hand.
-- ---------------------------------------------------------------------------
alter default privileges in schema public
  revoke all on tables from public, anon, authenticated, service_role;
--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- 4. TRUNCATE, REFERENCES, TRIGGER and MAINTAIN, explicitly.
--
--    RLS does not police TRUNCATE - it is a TABLE-level operation, so no policy
--    runs and every row goes at once. REFERENCES lets a caller point a foreign
--    key at the table and probe row existence through constraint violations, a
--    side channel around the SELECT policy. TRIGGER lets a caller attach code to
--    another person's writes. `service_role` is included on purpose: leaving it
--    out gives the one role that cannot read a single row the ability to erase
--    every table.
--
--    Step 1 already covers these on both tables; this is the default-privileges
--    half, and it is the half that governs whatever is created next.
-- ---------------------------------------------------------------------------
alter default privileges in schema public
  revoke truncate, references, trigger, maintain on tables
  from public, anon, authenticated, service_role;
