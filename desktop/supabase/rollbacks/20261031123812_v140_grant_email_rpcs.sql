-- REVIEWED ROLLBACK; never run directly. Stop admin grant mail actions first.
drop function if exists public.admin_grant_email_send_request(uuid, text);
drop function if exists public.admin_grant_email_reconcile(uuid, text, text);
drop function if exists public.admin_grant_email_list(integer, integer);
drop function if exists public.grant_email_mark_uncertain(uuid, uuid);
drop function if exists public.grant_email_release_claim(uuid, uuid);
drop function if exists public.grant_email_mark_sent(uuid, uuid);
drop function if exists public.grant_email_claim(uuid);
