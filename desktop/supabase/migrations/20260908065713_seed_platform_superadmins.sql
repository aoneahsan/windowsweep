-- The one-off seed: the two fixed owner emails hold `superadmin`.
--
-- 🔴 THIS RUNS OUT OF BAND AND THERE IS NO OTHER WAY IT COULD. `platform_role`
-- appears in no GRANT anywhere in this chain, so PostgREST cannot write it for
-- any caller under any policy - not a user, not an admin, not `service_role`.
-- A migration and the signup trigger are the entire set of writers, by design,
-- and that is what makes the privilege column a privilege rather than a field.
--
-- 🔴 NEVER PUT THIS IN CLIENT CODE, and never in a "make me an admin" endpoint.
-- The two addresses below are the only defaults this fleet has; every other user
-- and role is managed from the admin panel, against rows this seed does not touch.
--
-- Both statements are idempotent and additive - `dev IS prod` here, one hosted
-- project serves both, so a re-run must be a no-op rather than a reset.
--
-- Measured before writing: `select count(*) from auth.users` returned 0, so on
-- this database today both statements affect zero rows and the signup trigger in
-- the previous migration is what will actually do the work. They exist for the
-- two cases that are not today: a replay of the chain against a database that
-- already has users, and an account created between two migrations.

-- ===========================================================================
-- 1. Backfill a profile row for anyone who signed up before the trigger existed.
--
--    The trigger only fires on INSERT, so it can never reach a row that is
--    already there. Without this, an existing user would have no profile, and a
--    missing profile row reads exactly like a user holding no role - the admin
--    policies would answer false for them, silently and for ever.
-- ===========================================================================
insert into public.profiles (user_id, email, display_name, platform_role)
select
  u.id,
  u.email,
  nullif(
    trim(coalesce(
      u.raw_user_meta_data ->> 'full_name',
      u.raw_user_meta_data ->> 'name',
      ''
    )),
    ''
  ),
  case
    when lower(u.email) in ('zaionsmanager@gmail.com', 'aoneahsan@gmail.com')
      then 'superadmin'
    else 'user'
  end
from auth.users u
on conflict (user_id) do nothing;
--> statement-breakpoint

-- ===========================================================================
-- 2. Promote the two fixed emails, whatever role their row currently holds.
--
--    🔴 THE ADDRESS IS READ FROM `auth.users`, NOT FROM `public.profiles.email`.
--    The profiles column is a mirror; the authority for who someone is lives in
--    the auth table. Matching on the mirror would let a stale or absent copy
--    decide who is a superadmin, which is the wrong direction for that mistake
--    to run.
--
--    `is distinct from` rather than `<>` so the statement is a genuine no-op on
--    a re-run instead of rewriting rows and firing the updated_at trigger.
-- ===========================================================================
update public.profiles p
   set platform_role = 'superadmin'
  from auth.users u
 where u.id = p.user_id
   and lower(u.email) in ('zaionsmanager@gmail.com', 'aoneahsan@gmail.com')
   and p.platform_role is distinct from 'superadmin';
