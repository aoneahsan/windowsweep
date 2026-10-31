-- Manual only, after the matching reflow rollback, in one reviewed transaction.
do $$ begin
  if exists (select 1 from public.plan_grants where source = 'referral') then
    raise exception 'referral_schedule_data_requires_forward_repair';
  end if;
end; $$;

alter table public.plan_grants drop constraint if exists plan_grants_referral_remaining_nonneg;
alter table public.plan_grants drop column if exists referral_blocked_ranges;
alter table public.plan_grants drop column if exists referral_accounted_at;
alter table public.plan_grants drop column if exists referral_remaining_us;
