-- REVIEWED DESTRUCTIVE ROLLBACK; never run directly. Owner approval required.
-- All 1.4.0 paid periods, grants, devices, claims, referrals, teams and releases
-- would be lost. Export/verify retention first; run only after later RPC rollbacks.
drop view if exists public.latest_app_releases;
drop table if exists public.billing_email_deliveries;
drop table if exists public.webhook_events;
drop table if exists public.checkout_quotes;
drop table if exists public.subscriptions;
drop table if exists public.referral_badge_awards;
drop table if exists public.referral_voids;
drop table if exists public.referrals;
drop table if exists public.badge_catalogue;
drop table if exists public.team_invites;
drop table if exists public.team_members;
drop table if exists public.teams;
drop table if exists public.plan_requests;
drop table if exists public.plan_grants;
drop table if exists public.plans;
drop table if exists public.app_config;
drop table if exists public.run_claims;
alter table public.runs drop column if exists device_id;
drop table if exists public.devices;
drop table if exists public.app_releases;
alter table public.profiles drop column if exists legal_notice_seen_at;
alter table public.profiles drop column if exists verified_at;
alter table public.profiles drop column if exists referral_eligible_at;
alter table public.profiles drop column if exists welcome_sent_at;
alter table public.profiles drop column if exists welcome_claimed_at;
alter table public.profiles drop column if exists welcome_claim_token;
alter table public.profiles drop column if exists limits_override;
alter table public.profiles drop column if exists referral_code;
drop index if exists public.profiles_created_idx;
alter policy contact_requests_insert_own on public.contact_requests
  to authenticated with check ((select auth.uid()) = user_id);
alter policy runs_insert_own on public.runs
  to authenticated with check ((select auth.uid()) = user_id);
alter policy user_settings_insert_own on public.user_settings
  to authenticated with check ((select auth.uid()) = user_id);
alter policy user_settings_update_own on public.user_settings
  to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
drop type if exists public.billing_interval;
drop type if exists public.grant_source;
drop type if exists public.plan_request_status;
drop type if exists public.referral_status;
drop type if exists public.release_channel;
drop type if exists public.release_platform;
drop type if exists public.release_severity;
drop type if exists public.run_pool;
drop type if exists public.subscription_status;
drop type if exists public.team_role;
