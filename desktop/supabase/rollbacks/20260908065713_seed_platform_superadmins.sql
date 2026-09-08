-- ROLLBACK for 20260908065713_seed_platform_superadmins.sql — REVIEWED, NEVER AUTO-APPLIED.
--
-- 🔴 THIS LOCKS THE OWNER OUT OF HIS OWN ADMIN PANEL. Demoting the two fixed emails
-- leaves the platform with no superadmin, and platform_role is in no GRANT — so there
-- is no API, no admin screen and no client path that could put it back. The only way
-- back in is another out-of-band SQL statement.
--
-- The backfill half is not reversible in any meaningful sense: deleting profile rows
-- would take display names and created_at timestamps with them, and the signup trigger
-- only fires on INSERT so it would never recreate them.
update public.profiles p
   set platform_role = 'user'
  from auth.users u
 where u.id = p.user_id
   and lower(u.email) in ('zaionsmanager@gmail.com', 'aoneahsan@gmail.com')
   and p.platform_role is distinct from 'user';
