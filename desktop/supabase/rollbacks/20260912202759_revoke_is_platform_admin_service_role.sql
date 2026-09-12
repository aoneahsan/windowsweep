-- ROLLBACK for 20260912202759_revoke_is_platform_admin_service_role.sql - REVIEWED, NEVER AUTO-APPLIED.
--
-- It destroys nothing and restores a grant nothing uses: `service_role` bypasses RLS, so no policy
-- calls this function as that role, and with the secret key `auth.uid()` is null and the function
-- returns false. Running this only re-opens a reachable, useless privilege - the inconsistency the
-- forward migration closed. Using it is a NEW forward migration, never a re-run of this file.
grant execute on function public.is_platform_admin() to service_role;
