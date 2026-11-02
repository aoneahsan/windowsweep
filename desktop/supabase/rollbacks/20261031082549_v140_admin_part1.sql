-- REVIEWED ROLLBACK; never run directly. Switch the admin UI off first.
drop function if exists public.admin_grants_list(uuid, boolean, text, integer);
drop function if exists public.admin_users_view(uuid);
drop function if exists public.admin_users_list(text, text, integer);
drop function if exists public.admin_stats();
drop function if exists public.admin_grant_revoke(uuid, text);
drop function if exists public.admin_grant_create(uuid, text, timestamptz, timestamptz, integer, text);
drop function if exists public.admin_plans_list(integer, integer);
drop function if exists public.admin_plan_upsert(jsonb, text);
drop function if exists public.admin_override_limits(uuid, jsonb, text);
drop function if exists public.admin_set_plan(uuid, text, timestamptz, integer, text);
drop function if exists private.encode_cursor(timestamptz, text);
drop function if exists private.decode_cursor(text);
drop function if exists private.admin_reason(text);
drop function if exists private.require_admin();
