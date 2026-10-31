-- Custom SQL migration file, put your code below! --
-- A referrer is rewarded only after Auth confirms the invitee's email.
create or replace function private.try_confirm_referral(p_invitee uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_ref record; v_enabled boolean; v_points integer; v_threshold integer;
  v_months integer; v_cap integer; v_year_months integer; v_confirmed integer;
  v_plan text; v_plan_rank integer; v_start timestamptz; v_grant uuid;
begin
  select r.* into v_ref from public.referrals r where r.invitee_id = p_invitee for update;
  if not found then return false; end if;
  if v_ref.status <> 'pending' then return false; end if;
  select coalesce((value #>> '{}')::boolean, false) into v_enabled
    from public.app_config where key = 'referral_enabled';
  if not v_enabled or not exists (
    select 1 from auth.users u where u.id = p_invitee and u.email_confirmed_at is not null
  ) then return false; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('referral:' || v_ref.referrer_id::text, 0));
  select (value #>> '{}')::integer into v_points from public.app_config where key = 'referral_points_per_confirmed';
  select (value #>> '{}')::integer into v_threshold from public.app_config where key = 'referral_reward_threshold';
  select value #>> '{}' into v_plan from public.app_config where key = 'referral_reward_plan';
  select (value #>> '{}')::integer into v_months from public.app_config where key = 'referral_reward_months';
  select (value #>> '{}')::integer into v_cap from public.app_config where key = 'referral_reward_months_cap_per_year';
  update public.referrals set status = 'confirmed', confirmed_at = now(),
    points_awarded = coalesce(v_points, 0) where id = v_ref.id;
  select count(*)::integer into v_confirmed from public.referrals
    where referrer_id = v_ref.referrer_id and status = 'confirmed';
  if v_threshold is null or v_threshold < 1 or v_confirmed % v_threshold <> 0 then return true; end if;
  select coalesce(sum(months), 0)::integer into v_year_months from public.plan_grants
    where user_id = v_ref.referrer_id and source = 'referral'
      and created_at >= now() - interval '365 days';
  if v_cap is null or v_months is null or v_year_months + v_months > v_cap then return true; end if;
  select rank into v_plan_rank from public.plans where id = v_plan and is_active and rank > 0;
  if v_plan_rank is null then
    insert into public.admin_audit (actor, action, subject_table, subject_id, before, after)
      values (null, 'referral.reward_unresolved', 'referrals', v_ref.id, null,
        jsonb_build_object('plan_id', v_plan));
    return true;
  end if;
  select greatest(now(), coalesce(max(x.ends_at), now())) into v_start from (
    select s.period_end as ends_at from public.subscriptions s
      join public.plans p on p.id = s.plan_id and p.rank >= v_plan_rank
      where s.user_id = v_ref.referrer_id and s.status = 'active'
        and s.returned_at is null and s.period_end > now()
    union all
    select g.ends_at from public.plan_grants g
      join public.plans p on p.id = g.plan_id and p.rank >= v_plan_rank
      where g.user_id = v_ref.referrer_id and g.revoked_at is null and g.ends_at > now()
  ) x;
  insert into public.plan_grants (user_id, plan_id, source, seats, months, reason, starts_at, ends_at)
    values (v_ref.referrer_id, v_plan, 'referral', 1, v_months,
      'Confirmed referral reward', v_start, v_start + make_interval(months => v_months))
    returning id into v_grant;
  update public.referrals set reward_grant_id = v_grant where id = v_ref.id;
  insert into public.admin_audit (actor, action, subject_table, subject_id, before, after)
    values (null, 'referral.reward', 'plan_grants', v_grant, null,
      jsonb_build_object('plan_id', v_plan, 'months', v_months));
  return true;
end;
$$;
--> statement-breakpoint
revoke all on function private.try_confirm_referral(uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint

-- Called as the person's JWT by account-welcome. It returns status, never another id.
create or replace function public.referral_claim(p_code text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid; v_referrer uuid; v_window integer; v_verified timestamptz; v_enabled boolean;
begin
  if p_code is null or upper(p_code) !~ '^[A-Z0-9]{10}$' then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_uid := private.require_account();
  if exists (select 1 from public.referrals where invitee_id = v_uid) then
    perform private.try_confirm_referral(v_uid);
    return 'already_recorded';
  end if;
  select coalesce((value #>> '{}')::boolean, false) into v_enabled
    from public.app_config where key = 'referral_enabled';
  if not v_enabled then return 'disabled'; end if;
  select p.user_id into v_referrer from public.profiles p where p.referral_code = upper(p_code);
  if v_referrer is null or v_referrer = v_uid then return 'invalid_code'; end if;
  select verified_at into v_verified from public.profiles where user_id = v_uid;
  if v_verified is null then return 'not_verified'; end if;
  select (value #>> '{}')::integer into v_window from public.app_config where key = 'referral_claim_window_days';
  if now() > v_verified + make_interval(days => coalesce(v_window, 30)) then return 'too_late'; end if;
  insert into public.referrals (referrer_id, invitee_id)
    values (v_referrer, v_uid) on conflict (invitee_id) do nothing;
  if not found then return 'already_recorded'; end if;
  if private.try_confirm_referral(v_uid) then return 'confirmed'; end if;
  return 'pending';
end;
$$;
--> statement-breakpoint
revoke all on function public.referral_claim(text) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.referral_claim(text) to authenticated;
--> statement-breakpoint

create or replace function public.my_referral_status()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid; v_rule jsonb; v_confirmed integer; v_pending integer;
  v_threshold integer; v_cap integer; v_months_used integer; v_enabled boolean;
begin
  v_uid := private.require_account();
  select coalesce((value #>> '{}')::boolean, false) into v_enabled
    from public.app_config where key = 'referral_enabled';
  select (value #>> '{}')::integer into v_threshold from public.app_config where key = 'referral_reward_threshold';
  select (value #>> '{}')::integer into v_cap from public.app_config where key = 'referral_reward_months_cap_per_year';
  select count(*) filter (where status = 'confirmed'), count(*) filter (where status = 'pending')
    into v_confirmed, v_pending from public.referrals where referrer_id = v_uid;
  select coalesce(sum(months), 0)::integer into v_months_used from public.plan_grants
    where user_id = v_uid and source = 'referral' and created_at >= now() - interval '365 days';
  select jsonb_build_object(
    'points_per_confirmed', (select value from public.app_config where key = 'referral_points_per_confirmed'),
    'threshold', to_jsonb(v_threshold),
    'reward_plan', (select jsonb_build_object('id', p.id, 'name', p.name) from public.plans p
      where p.id = (select value #>> '{}' from public.app_config where key = 'referral_reward_plan')),
    'reward_months', (select value from public.app_config where key = 'referral_reward_months'),
    'cap_months_per_year', to_jsonb(v_cap),
    'claim_window_days', (select value from public.app_config where key = 'referral_claim_window_days')) into v_rule;
  return jsonb_build_object('enabled', v_enabled,
    'code', (select referral_code from public.profiles where user_id = v_uid),
    'points', (select coalesce(sum(points_awarded), 0) from public.referrals where referrer_id = v_uid),
    'confirmed', v_confirmed, 'pending', v_pending,
    'stamps', (select coalesce(jsonb_agg(x.confirmed_at order by x.confirmed_at desc), '[]'::jsonb)
      from (select confirmed_at from public.referrals where referrer_id = v_uid and confirmed_at is not null
        order by confirmed_at desc limit 20) x),
    'rule', v_rule, 'months_granted_last_year', v_months_used,
    'next_reward_in', case when not v_enabled or v_threshold is null or v_cap <= v_months_used
      then null else v_threshold - (v_confirmed % v_threshold) end,
    'rewards', (select coalesce(jsonb_agg(x.item order by x.starts_at desc), '[]'::jsonb) from (
      select g.starts_at, jsonb_build_object('starts_at', g.starts_at, 'ends_at', g.ends_at,
        'banked', g.starts_at > now()) as item
        from public.plan_grants g where g.user_id = v_uid and g.source = 'referral'
        order by g.starts_at desc limit 10) x));
end;
$$;
--> statement-breakpoint
revoke all on function public.my_referral_status() from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.my_referral_status() to authenticated;
