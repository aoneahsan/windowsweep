-- Account deletion: ONE statement, and the cascades finish it.
--
-- Owner decision D14 (2026-09-12), "build it". `/privacy` already promises a
-- person can delete their account and names what goes with it; until this file
-- there was nothing behind that sentence, and the site's `/account` shipped the
-- control disabled with the reason visible. This is the whole server half.
--
-- 🔴 WHY IT IS ONE STATEMENT. Every user-owned table references `auth.users`
-- with `on delete cascade`. Read from `pg_constraint` rather than from the
-- schema files (2026-09-12, ref nlmetjyytgwaxcliusuo): `confdeltype = 'c'` on
-- `public.profiles`, `public.user_settings`, `public.runs` and
-- `public.contact_requests`, and on all eight `auth.*` tables that reference it
-- - sessions, identities, mfa_factors, one_time_tokens, oauth_authorizations,
-- oauth_consents, webauthn_challenges, webauthn_credentials. So the delete below
-- takes the sessions with it, which is what makes the account actually gone
-- rather than merely unreachable. The app deletes NOTHING row by row: a client
-- loop would be one network failure away from a half-deleted account, and every
-- row it walked would need its own DELETE grant that nothing else wants to exist.
--
-- 🔴 WHAT DOES NOT GO, AND WHY THAT IS CORRECT. `public.admin_audit` is not
-- user-owned - it records what an ADMIN did, and its `actor` column deliberately
-- carries no foreign key, as does `contact_requests.handled_by`. An audit trail
-- a person can erase by deleting their own account is not an audit trail. The
-- person's own contact requests DO go, because `user_id` is theirs and it
-- cascades; what survives is the fact that somebody triaged them.
--
-- 🔴 WHY AN RPC UNDER RLS RATHER THAN AN EDGE FUNCTION OR THE SERVICE KEY. A
-- function holding the service key IS the security boundary, so it would have to
-- re-implement authentication and authorization itself, correctly, forever. Here
-- there is nothing to get wrong: the function takes NO ARGUMENT and can only
-- ever read `auth.uid()`, so "which account" is not an input a caller supplies
-- and therefore not an input a caller can forge. Authorization is structural.
--
-- 🔴 WHY `security definer`. `auth.users` is owned by `supabase_auth_admin`;
-- neither `authenticated` nor `anon` holds DELETE on it and neither should. The
-- function is owned by `postgres` (checked: `has_table_privilege('postgres',
-- 'auth.users','DELETE')` is true and `postgres` holds `rolbypassrls`, which
-- matters because `auth.users` has RLS enabled). A definer function is a second
-- call plane that skips every control living in a route - which is why the
-- explicit revoke below is part of this file and not a later tidy-up.
--
-- 🔴 THE NULL CHECK IS THE AUTHENTICATION STEP AND IT MUST BE INSIDE THE BODY.
-- `delete from auth.users where id = auth.uid()` with a null uid matches zero
-- rows and SUCCEEDS: PostgREST would answer `204 No Content` and a caller who
-- was never signed in would be told their account was deleted. A refusal that
-- reads as success is worse than no check at all, so the house ordered gate -
-- shape, then authentication, then authorization, then business validity, then
-- the database - is written out here: there is no shape to validate (no
-- argument), authentication is the `42501` below, authorization is structural
-- (there is only ever one row it could touch, the caller's own), there is no
-- business rule, and only then does it reach the table.
--
-- 🔴 `set search_path = ''`, so every name below is schema-qualified or it does
-- not resolve. Without it a definer function resolves against whatever schema
-- the caller put first. `check_function_bodies` is deliberately NOT turned off:
-- unlike `is_platform_admin()`, nothing here is created before the objects it
-- names, and a plpgsql body is not name-resolved at creation anyway - so the
-- file replays from zero against a fresh Supabase project as written.
--
-- Verify all of this from `pg_proc` - `proacl`, `prosecdef`, `proconfig` - never
-- from this file, and verify the DELETE itself from a seeded throwaway user over
-- PostgREST, never from the push output.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'delete_my_account() requires an authenticated caller'
      using errcode = '42501';
  end if;

  delete from auth.users where id = v_uid;
end;
$$;
--> statement-breakpoint

comment on function public.delete_my_account() is
  'Deletes the CALLER''S OWN account: one delete from auth.users where id = auth.uid(), after which ON DELETE CASCADE removes their data - public.profiles, public.user_settings, public.runs and public.contact_requests - and their auth sessions and identities. public.admin_audit is NOT user-owned and stays, and contact_requests.handled_by carries no foreign key, so who triaged a request survives that admin deleting their own account. Takes no argument and reads only auth.uid(), so it can never delete somebody else. Raises 42501 when auth.uid() is null, because the bare delete would match zero rows and return success to a caller who was never signed in. EXECUTE is granted to authenticated and to nothing else - verify from pg_proc.proacl, not from the migration.';
--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- The privilege block. This is not a formality on this project.
--
-- 🔴 A NEW FUNCTION IN `public` IS BORN `proacl = NULL` HERE, WHICH IS EXECUTE
-- TO PUBLIC - measured three ways on 2026-09-08 and written into
-- `20260908070246_close_trigger_function_execute.sql`. The
-- `alter default privileges ... revoke execute on functions from public, anon,
-- authenticated, service_role` in `20260908065314` has NO EFFECT, because a
-- second `pg_default_acl` row granted by `supabase_admin` covers the same
-- (schema, object type) and is not ours to change. `pg_default_acl` reads closed
-- either way, so it is not evidence of anything.
--
-- 🔴 AND UNLIKE THE FOUR TRIGGER FUNCTIONS THAT FILE CLOSED, THIS ONE IS LIVE.
-- Those return `trigger`, so Postgres refuses to call them directly and
-- PostgREST never advertises them - a latent hole. This function returns void,
-- takes no argument, and PostgREST exposes it at POST
-- /rest/v1/rpc/delete_my_account the moment it exists. Born unrevoked, `anon`
-- could reach it. It would then raise 42501 on the null uid rather than delete
-- anything, so the hole would be one of reachability rather than of loss - but
-- "it fails safely inside" is a defence that survives exactly as long as nobody
-- edits the body.
--
-- `service_role` is revoked with the rest on purpose. A backend holding the
-- secret key has no `sub` claim, so `auth.uid()` is null and the call could only
-- ever raise; revoking makes that a privilege refusal at the door instead of an
-- error from inside a function it should not have reached. Deleting somebody
-- else's account is an admin operation that does not exist yet, and when it does
-- it will be its own function with its own argument and its own gate - never a
-- widened grant on this one.
-- ---------------------------------------------------------------------------
revoke all on function public.delete_my_account()
  from public, anon, authenticated, service_role;
--> statement-breakpoint

grant execute on function public.delete_my_account() to authenticated;
