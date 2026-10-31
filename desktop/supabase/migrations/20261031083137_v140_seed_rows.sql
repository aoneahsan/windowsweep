-- Custom SQL migration file, put your code below! --
-- Idempotent first install. Existing rows are left to the admin surface: a
-- migration replay never rewrites prices, limits or the referral off switch.
insert into public.plans (id, name, description, rank, is_active,
  price_month_cents, price_year_cents, per_seat, min_seats,
  real_runs_unlimited, device_real_runs_per_month, account_extra_real_runs_per_month,
  report_machines, schedules, history_export, fleet_reports)
values
  ('free', 'Free', '', 0, true, 0, 0, false, 1, false, 15, 15, 0, false, false, false),
  ('pro', 'Pro', '', 10, true, 400, 3600, false, 1, true, null, null, 5, true, true, false),
  ('team', 'Team', '', 20, true, 300, 3000, true, 3, true, null, null, 5, true, true, true)
on conflict (id) do nothing;
--> statement-breakpoint

insert into public.app_config (key, value, is_public, min_value, max_value, description)
values
  ('device_real_runs_per_month', '15'::jsonb, true, 0, 100000, ''),
  ('account_extra_real_runs_per_month', '15'::jsonb, true, 0, 100000, ''),
  ('referral_enabled', 'true'::jsonb, true, null, null, ''),
  ('referral_points_per_confirmed', '10'::jsonb, true, 0, 1000, ''),
  ('referral_reward_threshold', '3'::jsonb, true, 1, 100, ''),
  ('referral_reward_plan', '"pro"'::jsonb, true, null, null, ''),
  ('referral_reward_months', '1'::jsonb, true, 1, 12, ''),
  ('referral_reward_months_cap_per_year', '4'::jsonb, true, 0, 12, ''),
  ('referral_claim_window_days', '30'::jsonb, true, 1, 365, '')
on conflict (key) do nothing;
