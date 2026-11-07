-- Reviewed companion only. Apply as a new forward migration if the plan-change broadcast
-- must be removed; never apply this file directly to production.
drop policy if exists "plans topic: own account only" on realtime.messages;
drop trigger if exists plan_grants_broadcast_plan on public.plan_grants;
drop trigger if exists subscriptions_broadcast_plan on public.subscriptions;
drop function if exists private.broadcast_plan_change();
