-- REVIEWED ROLLBACK; never run directly. Stop admin mail actions first.
drop function if exists public.admin_billing_email_retry(text, text, text);
drop function if exists public.admin_billing_email_reconcile(text, text, text, text);
drop function if exists public.admin_billing_email_list(integer, integer);
drop function if exists public.admin_email_reconcile(text, uuid, text, text);
drop function if exists public.admin_email_uncertain_list(text, integer, integer);
