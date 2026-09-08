-- ROLLBACK for 20260908065528_site_privileges_and_triggers.sql — REVIEWED, NEVER AUTO-APPLIED.
--
-- 🔴 THIS ROLLBACK IS A SECURITY DOWNGRADE, not a neutral undo. It removes the rate
-- limit, the audit trail and the profile-creation trigger while leaving the tables in
-- place and readable. Dropping the triggers alone is the whole risk:
--
--   * without on_auth_user_created, every new signup gets NO profile row, so
--     is_platform_admin() answers false for them for ever and silently;
--   * without contact_requests_rate_limit, one account can fill the inbox;
--   * without contact_requests_audit, an admin's triage leaves no record.
--
-- The grants are deliberately NOT reverted to Supabase's default ACL. There is no
-- version of "undo" here that is safe: restoring the default would hand anon and
-- service_role arwdDxtm on all three tables.
drop trigger if exists contact_requests_audit on public.contact_requests;
drop trigger if exists contact_requests_rate_limit on public.contact_requests;
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists profiles_set_updated_at on public.profiles;

drop function if exists public.audit_contact_request_status();
drop function if exists public.enforce_contact_request_rate_limit();
drop function if exists public.handle_new_user();
drop function if exists public.set_updated_at();
