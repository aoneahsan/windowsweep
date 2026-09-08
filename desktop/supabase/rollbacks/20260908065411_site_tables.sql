-- ROLLBACK for 20260908065411_site_tables.sql — REVIEWED, NEVER AUTO-APPLIED.
--
-- 🔴 DESTRUCTIVE AND UNRECOVERABLE. This deletes every contact request anybody has
-- sent, every profile row (and with it every platform_role assignment), and the whole
-- immutable audit log. `dev IS prod` here — there is no second database holding a copy.
--
-- 🔴 The audit log is the one that cannot be reconstructed. profiles rebuilds itself
-- from auth.users through the signup trigger; admin_audit does not rebuild from anything.
-- Export it before considering this.
drop table if exists public.admin_audit;
drop table if exists public.contact_requests;
drop table if exists public.profiles;
