ALTER TABLE "plan_grants" ADD COLUMN IF NOT EXISTS "referral_remaining_us" bigint;--> statement-breakpoint
ALTER TABLE "plan_grants" ADD COLUMN IF NOT EXISTS "referral_accounted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "plan_grants" ADD COLUMN IF NOT EXISTS "referral_blocked_ranges" "tstzmultirange";--> statement-breakpoint
do $$ begin
  if not exists (select 1 from pg_catalog.pg_constraint
    where conrelid = 'public.plan_grants'::regclass
      and conname = 'plan_grants_referral_remaining_nonneg') then
    alter table public.plan_grants add constraint plan_grants_referral_remaining_nonneg
      check (referral_remaining_us is null or referral_remaining_us >= 0);
  end if;
end; $$;
