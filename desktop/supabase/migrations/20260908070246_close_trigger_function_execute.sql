-- 🔴 A CORRECTION. Migration `20260908065314_platform_admin_function.sql` ends
-- with `alter default privileges in schema public revoke execute on functions
-- from public, anon, authenticated, service_role` and its comment claims that
-- makes the next function "born closed". IT DOES NOT, ON THIS PROJECT, AND THE
-- CLAIM WAS WRONG. Forward-only, so that file is left exactly as it ran; this
-- one carries the truth and the fix.
--
-- MEASURED, NOT INFERRED (ref nlmetjyytgwaxcliusuo, PostgreSQL 17.6, 2026-09-08).
-- Immediately after that migration applied:
--
--   pg_default_acl (public, function, granting role postgres)
--     -> {postgres=X/postgres}            -- PUBLIC gone. Reads as closed.
--
--   the three trigger functions created one migration later
--     -> proacl = NULL                     -- i.e. the BUILT-IN default
--        has_function_privilege('anon', ..., 'EXECUTE')          = true
--        has_function_privilege('authenticated', ..., 'EXECUTE') = true
--
-- A throwaway function created afterwards came out `proacl = NULL` / anon true
-- as well, and so did a second probe issued as `alter default privileges FOR
-- ROLE postgres ... revoke execute on functions from public`, and a third issued
-- under `set role postgres`. Three forms, three probes, same answer: the
-- pg_default_acl row exists, and functions created in `public` ignore it.
--
-- 🔴 SO THE STANDING RULE GETS A SHARPER EDGE HERE. "Name PUBLIC, not just anon
-- and authenticated" is necessary and it is NOT sufficient on a Supabase
-- project: a second default-ACL row granted by `supabase_admin` covers the same
-- (schema, object type) and is not ours to change. The only control that
-- measurably holds is an EXPLICIT `revoke execute on function <fn>(<args>)`,
-- written per function, and the only proof is the function's own `proacl` -
-- never the pg_default_acl row, which looks closed either way.
--
-- HONEST SEVERITY, because overclaiming is its own failure: this is a latent
-- hole rather than a live one. All four functions below return `trigger`, and
-- Postgres refuses to invoke such a function directly ("trigger functions can
-- only be called as triggers"); PostgREST also excludes them from its schema
-- cache, so there is no `POST /rest/v1/rpc/...` for any of them today. What was
-- actually wrong was the CLAIM: a comment asserting a control that is not there
-- is how the next reader stops checking, and the next function added to this
-- schema - one that does NOT return `trigger` - would have been born reachable
-- by `anon` with nothing to announce it.

-- ===========================================================================
-- Sweep what exists. A trigger fires its function through the trigger
-- mechanism, which checks EXECUTE when the trigger is CREATED and not when it
-- fires - so revoking here removes the call plane and changes no behaviour.
-- Verified after applying: every one of these reads false for anon AND for
-- authenticated, and all four triggers still fire.
-- ===========================================================================
revoke execute on function public.set_updated_at()
  from public, anon, authenticated, service_role;
--> statement-breakpoint

revoke execute on function public.handle_new_user()
  from public, anon, authenticated, service_role;
--> statement-breakpoint

revoke execute on function public.enforce_contact_request_rate_limit()
  from public, anon, authenticated, service_role;
--> statement-breakpoint

revoke execute on function public.audit_contact_request_status()
  from public, anon, authenticated, service_role;
--> statement-breakpoint

-- `is_platform_admin()` is deliberately NOT in that list. It is the one function
-- here a browser legitimately reaches: an RLS policy expression is evaluated as
-- the querying user, so `authenticated` must hold EXECUTE or every admin policy
-- fails closed. It stays revoked from `public` and `anon`, it takes no argument,
-- and it can only ever answer for `auth.uid()` - so the rpc/ plane it exposes
-- tells a caller one thing they already know about themselves.

-- ===========================================================================
-- 🔴 THE RULE FOR EVERY FUNCTION ADDED TO `public` AFTER THIS ONE.
--
-- Write the explicit revoke in the same migration that creates it, then read
-- back its `proacl`. Do not rely on the default-privileges statement in
-- migration `20260908065314`; it is left in place because removing it would be
-- a rewrite of an applied migration, not because it works.
-- ===========================================================================
comment on schema public is
  'Application schema. FUNCTION EXECUTE IS NOT CLOSED BY DEFAULT HERE - measured 2026-09-08: a new function is born proacl=NULL, i.e. EXECUTE to PUBLIC, despite the pg_default_acl row for (public, function) reading {postgres=X/postgres}. A second default-ACL row granted by supabase_admin covers the same object type and is not ours to change. Every function added to this schema must carry its own explicit revoke, and must be verified from pg_proc.proacl rather than from pg_default_acl.';
