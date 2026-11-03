-- Reviewed companion only. Apply as a new forward migration if the release
-- broadcast must be removed; never apply this file directly to production.
drop trigger if exists app_releases_broadcast_insert on public.app_releases;
drop function if exists private.broadcast_app_release();
