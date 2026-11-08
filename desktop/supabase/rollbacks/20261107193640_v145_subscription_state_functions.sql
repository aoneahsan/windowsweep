-- Reviewed companion only. Apply as a new forward migration if the subscription-state
-- handling must be removed; never apply this file directly to production.
-- my_plan() goes back to its 20261031082153 body: re-run that file's my_plan() block and
-- its revoke and grant, which drops `renews` from the result.
drop function if exists public.billing_record_subscription_state(text, text, text, text, boolean,
  timestamptz, timestamptz, timestamptz);
drop function if exists private.subscription_renews(text, boolean, timestamptz);
