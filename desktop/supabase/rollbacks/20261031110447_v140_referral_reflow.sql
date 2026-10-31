-- Manual only. Schedule history cannot be undone after a referral reward exists.
do $$ begin
  if exists (select 1 from public.plan_grants where source = 'referral') then
    raise exception 'referral_schedule_data_requires_forward_repair';
  end if;
end; $$;

drop trigger if exists guard_referral_plan_shape on public.plans;
drop trigger if exists team_membership_referral_reflow on public.team_members;
drop trigger if exists subscription_referral_reflow on public.subscriptions;
drop trigger if exists plan_grant_referral_reflow on public.plan_grants;
drop function if exists private.on_team_membership_referral_reflow();
drop function if exists private.guard_referral_plan_shape();
drop function if exists private.on_subscription_referral_reflow();
drop function if exists private.on_plan_grant_reflow();
drop function if exists private.reflow_owner_and_members(uuid);
drop function if exists private.reflow_referral_grants(uuid);

-- Restore the prior rank/end ordering from 20261031082153.
create or replace function private.plan_for_user(p_user uuid, p_at timestamptz default now())
returns table(plan_id text, source text, ends_at timestamptz)
language sql stable security definer set search_path = '' as $$
  with candidates as (
    select s.plan_id, 'payment'::text as source, s.period_end as ends_at
      from public.subscriptions s
      where s.user_id = p_user and s.status = 'active' and s.returned_at is null
        and s.period_start <= p_at and s.period_end > p_at
    union all
    select g.plan_id, g.source::text, g.ends_at
      from public.plan_grants g
      where g.user_id = p_user and g.revoked_at is null
        and g.starts_at <= p_at and g.ends_at > p_at
    union all
    select s.plan_id, 'team'::text, s.period_end
      from public.team_members tm
      join public.teams t on t.id = tm.team_id
      join public.subscriptions s on s.user_id = t.owner_id
      join public.plans p on p.id = s.plan_id and p.fleet_reports
      where tm.user_id = p_user and tm.user_id <> t.owner_id
        and s.status = 'active' and s.returned_at is null
        and s.period_start <= p_at and s.period_end > p_at
    union all
    select g.plan_id, 'team'::text, g.ends_at
      from public.team_members tm
      join public.teams t on t.id = tm.team_id
      join public.plan_grants g on g.user_id = t.owner_id
      join public.plans p on p.id = g.plan_id and p.fleet_reports
      where tm.user_id = p_user and tm.user_id <> t.owner_id
        and g.revoked_at is null
        and g.starts_at <= p_at and g.ends_at > p_at
  )
  select c.plan_id, c.source, c.ends_at from candidates c
    join public.plans p on p.id = c.plan_id
    order by p.rank desc, c.ends_at desc, c.plan_id limit 1;
$$;
revoke all on function private.plan_for_user(uuid, timestamptz)
  from public, anon, authenticated, service_role;

-- Restore the original referral-status response shape.
create or replace function public.my_referral_status()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid; v_rule jsonb; v_confirmed integer; v_pending integer; v_expired integer;
  v_threshold integer; v_cap integer; v_months_used integer; v_enabled boolean; v_window integer;
begin
  v_uid := private.require_account();
  select coalesce((value #>> '{}')::boolean, false) into v_enabled
    from public.app_config where key = 'referral_enabled';
  select (value #>> '{}')::integer into v_threshold from public.app_config where key = 'referral_reward_threshold';
  select (value #>> '{}')::integer into v_cap from public.app_config where key = 'referral_reward_months_cap_per_year';
  select (value #>> '{}')::integer into v_window from public.app_config
    where key = 'referral_claim_window_days';
  if v_window is null then
    raise exception 'referral_window_unconfigured' using errcode = 'PT503'; end if;
  select count(*) filter (where r.status = 'confirmed'),
    count(*) filter (where r.status = 'pending' and
      now() <= p.referral_eligible_at + make_interval(days => v_window)),
    count(*) filter (where r.status = 'pending' and
      now() > p.referral_eligible_at + make_interval(days => v_window))
    into v_confirmed, v_pending, v_expired
    from public.referrals r join public.profiles p on p.user_id = r.invitee_id
    where r.referrer_id = v_uid;
  select coalesce(sum(months), 0)::integer into v_months_used from public.plan_grants
    where user_id = v_uid and source = 'referral' and revoked_at is null
      and created_at >= now() - interval '365 days';
  select jsonb_build_object(
    'points_per_confirmed', (select value from public.app_config where key = 'referral_points_per_confirmed'),
    'threshold', to_jsonb(v_threshold),
    'reward_plan', (select jsonb_build_object('id', p.id, 'name', p.name) from public.plans p
      where p.id = (select value #>> '{}' from public.app_config where key = 'referral_reward_plan')),
    'reward_months', (select value from public.app_config where key = 'referral_reward_months'),
    'cap_months_per_year', to_jsonb(v_cap),
    'claim_window_days', to_jsonb(v_window),
    'signup_window_minutes', (select value from public.app_config where key = 'referral_signup_window_minutes'),
    'badge', (select jsonb_build_object('key', b.key, 'name', b.name)
      from public.badge_catalogue b where b.key =
        (select value #>> '{}' from public.app_config where key = 'referral_badge_key'))) into v_rule;
  return jsonb_build_object('enabled', v_enabled,
    'code', (select referral_code from public.profiles where user_id = v_uid),
    'points', (select coalesce(sum(points_awarded), 0) from public.referrals
      where referrer_id = v_uid and status = 'confirmed'),
    'confirmed', v_confirmed, 'pending', v_pending, 'expired', v_expired,
    'stamps', (select coalesce(jsonb_agg(x.confirmed_at order by x.confirmed_at desc), '[]'::jsonb)
      from (select confirmed_at from public.referrals where referrer_id = v_uid and confirmed_at is not null
        order by confirmed_at desc limit 20) x),
    'badges', (select coalesce(jsonb_agg(x.item order by x.awarded_at desc), '[]'::jsonb) from (
      select a.awarded_at, jsonb_build_object('key', a.badge_key, 'name', b.name,
        'family', b.family, 'awarded_at', a.awarded_at) as item
        from public.referral_badge_awards a
        join public.badge_catalogue b on b.key = a.badge_key
        where a.user_id = v_uid and a.voided_at is null
        order by a.awarded_at desc, a.id desc limit 20) x),
    'rule', v_rule, 'months_granted_last_year', v_months_used,
    'months_earned_total', (select coalesce(sum(g.months), 0)::integer
      from public.plan_grants g where g.user_id = v_uid and g.source = 'referral'
        and g.revoked_at is null),
    'next_reward_in', case when not v_enabled or v_threshold is null or v_cap <= v_months_used
      then null else v_threshold - (v_confirmed % v_threshold) end,
    'rewards', (select coalesce(jsonb_agg(x.item order by x.starts_at desc), '[]'::jsonb) from (
      select g.starts_at, jsonb_build_object('starts_at', g.starts_at, 'ends_at', g.ends_at,
        'banked', g.starts_at > now()) as item
        from public.plan_grants g where g.user_id = v_uid and g.source = 'referral'
          and g.revoked_at is null
        order by g.starts_at desc limit 10) x));
end;
$$;
--> statement-breakpoint
revoke all on function public.my_referral_status() from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.my_referral_status() to authenticated;
