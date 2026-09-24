-- ROLLBACK for 20260924160739_runs_user_started_at_index.sql - REVIEWED, NEVER AUTO-APPLIED.
--
-- It destroys no data: it drops one index and nothing else, and every query the Account screen makes
-- still returns the same rows without it. What it costs is speed - each page of the run list, and its
-- count, goes back to scanning `runs` for one person's rows. Using it is a NEW forward migration, never a
-- re-run of this file, and the schema's `index(...)` line in `src/db/schema/sync.ts` goes in the same
-- change, or the next `drizzle-kit generate` recreates the index.
drop index if exists public.runs_user_id_started_at_idx;
