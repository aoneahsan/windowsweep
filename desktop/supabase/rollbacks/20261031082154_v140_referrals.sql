-- REVIEWED ROLLBACK; never run directly. Auth trigger rollback comes first.
drop trigger if exists on_referral_insert_confirm on public.referrals;
drop function if exists private.on_referral_insert_confirm();
drop function if exists private.reconcile_referral_rewards(uuid, uuid, uuid);
drop function if exists public.email_mark_referral_uncertain(uuid, uuid);
drop function if exists public.email_mark_welcome_uncertain(uuid, uuid);
drop function if exists public.email_release_referral_notification(uuid, uuid);
drop function if exists public.email_mark_referral_notified(uuid, uuid);
drop function if exists public.email_claim_referral_notification(uuid);
drop function if exists public.email_release_welcome(uuid, uuid);
drop function if exists public.email_mark_welcome_sent(uuid, uuid);
drop function if exists public.email_claim_welcome(uuid);
drop function if exists public.my_referral_status();
drop function if exists public.referral_claim(text);
drop function if exists private.try_confirm_referral(uuid);
