-- 1.4.0: the paired privilege block for every table and the view the previous (generated) migration created,
-- plus the one column grant an existing table gains.
--
-- WHY THIS FILE EXISTS. Drizzle emits no `revoke`, and on Supabase a grant names `anon`, `authenticated` and
-- `service_role` explicitly, so revoking PUBLIC alone leaves theirs standing. RLS filters ROWS; it never removes a
-- GRANT, it never polices TRUNCATE, and a policy never polices a column. Close all four roles, then grant back
-- exactly what each caller does - nothing else.
--
-- THE POSITION THIS FILE TAKES: `service_role` gets NO privilege on any 1.4.0 table. Every server-side write and
-- read (the Edge Functions) goes through a named `security definer` function granted to `service_role` alone, each
-- of which writes its own `admin_audit` row. A leaked secret key can then do only what those functions do, and no
-- TRUNCATE, ad-hoc UPDATE or bulk read exists for it.
--
-- Verify from the catalogs (`has_table_privilege`, `has_column_privilege`, `aclexplode(relacl)`), never from this
-- file: `information_schema` cannot see MAINTAIN.

-- ===========================================================================================================
-- 1. Take everything back first. A column grant layered on a table-wide grant is a silent no-op.
-- ===========================================================================================================
revoke all on table public.plans from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.app_config from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.devices from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.run_claims from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.subscriptions from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.checkout_quotes from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.webhook_events from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.plan_grants from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.plan_requests from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.teams from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.team_members from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.team_invites from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.referrals from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.app_releases from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.latest_app_releases from public, anon, authenticated, service_role;
--> statement-breakpoint

-- Re-assert the table default so this file is self-sufficient on a replay. Idempotent.
alter default privileges in schema public revoke all on tables from public, anon, authenticated, service_role;
--> statement-breakpoint

-- ===========================================================================================================
-- 2. Grant back what clients do directly. Everything else is reached through definer functions.
-- ===========================================================================================================

-- The registry and the public admin fields: the pricing page reads them signed out. RLS narrows to active plans
-- and public config rows.
grant select on table public.plans to anon, authenticated;
--> statement-breakpoint
grant select on table public.app_config to anon, authenticated;
--> statement-breakpoint

-- The release record, through the view only (update flow, layer 2). `app_releases` itself has no client grant;
-- the view reads it as its owner (security_invoker = false) and never exposes `created_by`.
grant select on table public.latest_app_releases to anon, authenticated;
--> statement-breakpoint

-- A person's own PCs (device sessions too): list them, and "Forget this PC". No INSERT or UPDATE: only the
-- allowance functions create a device or move it to another account.
grant select, delete on table public.devices to authenticated;
--> statement-breakpoint

-- Plan requests: the person files and reads their own. `status`, `notify_claimed_at`, `notified_at`, `closed_at`
-- and `closed_by` are out of the INSERT grant, so nobody can file a request that is already closed. There is no
-- UPDATE or DELETE grant: the admin functions close a request, and the account's deletion cascades it.
-- Never `.upsert()` this table (the INSERT grant is column-scoped); insert, and read 23505 as "already pending".
grant select on table public.plan_requests to authenticated;
--> statement-breakpoint
grant insert (user_id, plan_id, interval, seats, note) on table public.plan_requests to authenticated;
--> statement-breakpoint

-- `runs` (existing) gains `device_id`. The other ten columns keep the grant from 20260905162514; this ADDS one
-- column to it. The insert policy checks the id is one of the caller's own PCs.
grant insert (device_id) on table public.runs to authenticated;
--> statement-breakpoint

-- Deliberately NOT granted, each with its reason:
--   user_settings.legal_notice_seen_at  - written only by mark_legal_notice_seen() (one-way, server time)
--   profiles.referral_code, limits_override, welcome_sent_at, verified_at - auth triggers and definers only
--   run_claims, subscriptions, checkout_quotes, webhook_events, plan_grants, teams, team_members, team_invites,
--   referrals, app_releases - definer functions only; the person reads their own through my_plan(),
--   my_referral_status() and the team function, none of which projects another person's id
