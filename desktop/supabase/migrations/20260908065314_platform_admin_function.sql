-- The one function every admin policy in the site schema calls.
--
-- 🔴 WHY THIS FILE COMES BEFORE THE TABLES. A policy that calls a function
-- cannot be created before the function exists, and drizzle emits tables and
-- their policies together in one file. So the replayable order is
-- functions -> tables+policies -> triggers/grants -> data, and this is the
-- functions step. `check_function_bodies = off` is what lets a function
-- reference `public.profiles` one migration before that table is created; with
-- it on, this file fails on a replay from zero and only on a replay from zero,
-- which is the worst place for a chain to break.
--
-- 🔴 WHY A DEFINER FUNCTION AT ALL. `profiles` needs an "admins read every row"
-- policy, and that policy must ask what role the CALLER holds - which lives in
-- `profiles`. Reading the table from inside its own policy is
-- `42P17 infinite recursion detected in policy for relation "profiles"`. A
-- `security definer` function owned by the table owner reads it without policies
-- applying, which is the only thing that breaks the cycle.
--
-- 🔴 AND A DEFINER FUNCTION IS A SECOND CALL PLANE. Anything holding EXECUTE can
-- reach it at `POST /rest/v1/rpc/is_platform_admin`, skipping every control that
-- lives in a route. Two things make that safe here rather than merely accepted:
-- it takes NO ARGUMENT and reads only `auth.uid()`, so it can answer exactly one
-- question - "am I an admin?" - which the caller already knows, and can never be
-- turned into an oracle about somebody else; and it is revoked from `public` and
-- `anon` below. It stays granted to `authenticated` because an RLS policy
-- expression is evaluated as the querying user, so revoking it there would not
-- harden the policy - it would break it.
--
-- Verify all of this from `pg_proc.proacl`, never from this file.

set check_function_bodies = off;
--> statement-breakpoint

create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
-- 🔴 An empty search_path means every name below is schema-qualified or it does
-- not resolve. Without it, a definer function is resolvable against whatever
-- schema the caller put first.
set search_path = ''
as $$
  select exists (
    select 1
      from public.profiles p
     where p.user_id = (select auth.uid())
       and p.platform_role in ('admin', 'superadmin')
  );
$$;
--> statement-breakpoint

comment on function public.is_platform_admin() is
  'True when the CALLER holds admin or superadmin in public.profiles. Takes no argument on purpose: it can only ever answer for auth.uid(), so exposing it over rpc/ leaks nothing. Read by the admin policies on profiles, contact_requests and admin_audit.';
--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Close the PUBLIC default, then grant back the one role that needs it.
--
-- 🔴 `revoke ... from anon, authenticated` ALONE DOES NOTHING HERE. Postgres
-- grants EXECUTE to PUBLIC on every new function from its own built-in default,
-- and `anon` reaches it THROUGH PUBLIC rather than by name - so a revoke naming
-- only those two reads like hardening and changes nothing at all. The leading
-- `=X/postgres` in `proacl` is that grant; it is what must disappear.
-- ---------------------------------------------------------------------------
revoke execute on function public.is_platform_admin() from public, anon;
--> statement-breakpoint

grant execute on function public.is_platform_admin() to authenticated;
--> statement-breakpoint

-- ---------------------------------------------------------------------------
-- Stop the NEXT function being born reachable.
--
-- The trigger functions in the following migrations are all `security definer`
-- and none of them should be callable by a browser; a trigger fires them through
-- the trigger mechanism, which checks EXECUTE when the trigger is CREATED and
-- not when it fires, so they need no grant to work. This is what makes "no grant"
-- the default they inherit instead of a line somebody must remember to write.
--
-- 🔴 `alter default privileges` is PER-GRANTING-ROLE. Run as `postgres` it does
-- not touch the `supabase_admin` default, so anything Supabase itself creates in
-- `public` is unaffected - and a function written in the SQL editor as another
-- role would need the revoke re-applied by hand.
--
-- 🔴 Prove this worked from the NEXT function's `proacl`, never from the
-- `pg_default_acl` row - PUBLIC's grant is implicit and does not appear there at
-- all, so that row looks closed whether or not it is.
-- ---------------------------------------------------------------------------
alter default privileges in schema public
  revoke execute on functions from public, anon, authenticated, service_role;
