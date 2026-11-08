-- Reviewed companion only. Apply as a new forward migration if the subscription state table
-- must be removed, after 20261107193640's rollback; never apply this file directly to production.
drop table if exists public.billing_subscription_states;
