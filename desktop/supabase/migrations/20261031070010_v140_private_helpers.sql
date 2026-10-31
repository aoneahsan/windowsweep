-- 1.4.0, migration 1 of 14: the `private` schema and the one helper the generated policies call.
--
-- WHY THIS FILE COMES BEFORE THE GENERATED ONE. Drizzle emits tables and their policies in one file, and a policy
-- that calls a function cannot be created before the function exists. Several 1.4.0 policies, and the tightened
-- write policies on `user_settings`, `runs` and `contact_requests`, call `private.is_anon()`; so it is created here.
-- The replayable order stays functions -> tables + policies -> grants and triggers -> data.
--
-- WHY A `private` SCHEMA. PostgREST exposes `public` (and `graphql_public`) only, so nothing in `private` is ever
-- reachable at `/rest/v1/rpc/...` whatever its ACL says. Helpers that must never be a call plane live here.
-- `authenticated` needs USAGE because an RLS policy expression is evaluated as the querying role.
--
-- Verify from `pg_namespace.nspacl` and `pg_proc.proacl`, never from this file.

create schema if not exists private;
--> statement-breakpoint

revoke all on schema private from public, anon, authenticated, service_role;
--> statement-breakpoint

grant usage on schema private to authenticated;
--> statement-breakpoint

-- Functions created in `private` by `postgres` take this default; there is no competing `supabase_admin` default-ACL
-- row for this schema (unlike `public`, measured 2026-09-08). Every function below still carries its own explicit
-- revoke, because only a function's own `proacl` is evidence.
alter default privileges in schema private revoke execute on functions from public, anon, authenticated, service_role;
--> statement-breakpoint

/*
 * True when the caller is NOT a signed-in account: no user at all, or an anonymous sign-in (a DEVICE SESSION -
 * every desktop install from 1.4.0, D58). The JWT's `is_anonymous` claim is set by Supabase Auth itself and is
 * false for a Google account; a session cannot change it, because the JWT is signed.
 *
 * Not `security definer`: it reads only the caller's own JWT and needs no privilege.
 */
create or replace function private.is_anon()
returns boolean
language sql
stable
set search_path = ''
as $$
  select (select auth.uid()) is null
      or coalesce(((select auth.jwt()) ->> 'is_anonymous')::boolean, false);
$$;
--> statement-breakpoint

comment on function private.is_anon() is
  'True when the caller is not a signed-in account (no user, or an anonymous device session). Called by RLS policies; lives in private so it is no RPC.';
--> statement-breakpoint

revoke all on function private.is_anon() from public, anon, authenticated, service_role;
--> statement-breakpoint

grant execute on function private.is_anon() to authenticated;
