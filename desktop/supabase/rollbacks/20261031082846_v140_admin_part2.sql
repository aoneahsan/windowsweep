-- REVIEWED ROLLBACK; never run directly. Stop admin release/config/request flows first.
drop function if exists public.admin_referral_void(uuid, text);
drop function if exists public.admin_badges_create(text, text, text);
drop function if exists public.admin_badges_list(integer, integer);
drop function if exists public.admin_audit_list(text, text, integer);
drop function if exists public.admin_releases_list(text, text, text, integer);
drop function if exists public.publish_app_release(text, text, text, text, text, text);
drop trigger if exists app_releases_immutable on public.app_releases;
drop function if exists private.refuse_release_edit();
drop function if exists public.admin_request_close(uuid, text);
drop function if exists public.admin_request_mark_uncertain(uuid, uuid);
drop function if exists public.admin_request_release_claim(uuid, uuid);
drop function if exists public.admin_request_mark_notified(uuid, uuid, text);
drop function if exists public.admin_requests_claim(text, integer);
drop function if exists public.admin_requests_list(text, text, integer);
drop function if exists public.admin_config_set(text, jsonb, text);
drop function if exists public.admin_config_get(integer, integer);
