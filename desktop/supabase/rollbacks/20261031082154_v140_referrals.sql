-- REVIEWED ROLLBACK; never run directly. Auth trigger rollback comes first.
drop function if exists public.my_referral_status();
drop function if exists public.referral_claim(text);
drop function if exists private.try_confirm_referral(uuid);
