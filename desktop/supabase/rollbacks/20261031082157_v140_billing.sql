-- REVIEWED ROLLBACK; never run directly. Disable Polar checkout/webhook first.
-- Restoring the old deletion function removes the live-subscription guard;
-- do this only when there are no uncancelled live subscriptions.
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'delete_my_account() requires an authenticated caller'
    using errcode = '42501'; end if;
  delete from auth.users where id = v_uid;
end;
$$;
revoke all on function public.delete_my_account() from public, anon, authenticated, service_role;
grant execute on function public.delete_my_account() to authenticated;
drop function if exists public.billing_mark_cancelled(uuid, text);
drop function if exists public.my_active_polar_subscription_ids();
drop function if exists public.billing_record_returned(text, text, integer);
drop function if exists public.billing_record_paid(text, text, text, text, text, integer, text);
drop function if exists public.billing_record_quote(text, uuid, text, text, integer, integer, integer);
drop function if exists public.billing_quote(text, text, integer);
