-- REVIEWED ROLLBACK; never run directly. First apply the matching RPC rollback.
-- Pending state is implicit, so any admin grant requires forward repair first.
do $$ begin
  if exists (select 1 from public.plan_grants where source = 'admin') then
    raise exception 'grant_email_delivery_data_requires_forward_repair';
  end if;
end; $$;

alter table public.plan_grants drop constraint if exists plan_grants_email_claim_pair;
alter table public.plan_grants drop constraint if exists plan_grants_email_not_sent_uncertain;
drop index if exists public.plan_grants_email_review_idx;
alter table public.plan_grants drop column if exists email_claimed_at;
alter table public.plan_grants drop column if exists email_claim_token;
alter table public.plan_grants drop column if exists email_uncertain_at;
alter table public.plan_grants drop column if exists email_sent_at;
