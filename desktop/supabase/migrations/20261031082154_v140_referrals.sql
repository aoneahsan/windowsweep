-- Custom SQL migration file, put your code below! --
-- A referrer is rewarded only after Auth confirms the invitee's email.
create or replace function private.try_confirm_referral(p_invitee uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_ref record; v_enabled boolean; v_points integer; v_threshold integer;
  v_months integer; v_cap integer; v_year_months integer; v_confirmed integer;
  v_plan text; v_plan_rank integer; v_start timestamptz; v_grant uuid;
  v_badge_key text; v_window integer; v_eligible timestamptz; v_auth_verified timestamptz;
begin
  select r.* into v_ref from public.referrals r where r.invitee_id = p_invitee for update;
  if not found then return false; end if;
  if v_ref.status <> 'pending' then return false; end if;
  select coalesce((value #>> '{}')::boolean, false) into v_enabled
    from public.app_config where key = 'referral_enabled';
  if not v_enabled then return false; end if;
  select p.referral_eligible_at, u.email_confirmed_at into v_eligible, v_auth_verified
    from public.profiles p join auth.users u on u.id = p.user_id where u.id = p_invitee;
  if v_eligible is null or v_auth_verified is null then return false; end if;
  select (value #>> '{}')::integer into v_window
    from public.app_config where key = 'referral_claim_window_days';
  if v_window is null then
    raise exception 'referral_window_unconfigured' using errcode = 'PT503'; end if;
  if now() > v_eligible + make_interval(days => v_window) then return false; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('referral:' || v_ref.referrer_id::text, 0));
  select (value #>> '{}')::integer into v_points from public.app_config where key = 'referral_points_per_confirmed';
  select (value #>> '{}')::integer into v_threshold from public.app_config where key = 'referral_reward_threshold';
  select value #>> '{}' into v_plan from public.app_config where key = 'referral_reward_plan';
  select (value #>> '{}')::integer into v_months from public.app_config where key = 'referral_reward_months';
  select (value #>> '{}')::integer into v_cap from public.app_config where key = 'referral_reward_months_cap_per_year';
  select value #>> '{}' into v_badge_key from public.app_config where key = 'referral_badge_key';
  if not exists (select 1 from public.badge_catalogue b
    where b.key = v_badge_key and b.family = 'referral' and b.is_active) then
    raise exception 'referral_badge_unresolved' using errcode = 'PT503';
  end if;
  update public.referrals set status = 'confirmed', confirmed_at = now(),
    points_awarded = coalesce(v_points, 0) where id = v_ref.id;
  insert into public.referral_badge_awards (user_id, referral_id, badge_key, awarded_at)
    values (v_ref.referrer_id, v_ref.id, v_badge_key, now());
  select count(*)::integer into v_confirmed from public.referrals
    where referrer_id = v_ref.referrer_id and status = 'confirmed';
  if v_threshold is null or v_threshold < 1 or v_confirmed % v_threshold <> 0 then return true; end if;
  select coalesce(sum(months), 0)::integer into v_year_months from public.plan_grants
    where user_id = v_ref.referrer_id and source = 'referral'
      and revoked_at is null
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
    union all
    select s.period_end from public.team_members tm
      join public.teams t on t.id = tm.team_id
      join public.subscriptions s on s.user_id = t.owner_id
      join public.plans p on p.id = s.plan_id and p.rank >= v_plan_rank and p.fleet_reports
      where tm.user_id = v_ref.referrer_id and tm.user_id <> t.owner_id
        and s.status = 'active' and s.returned_at is null
        and s.period_start <= now() and s.period_end > now()
    union all
    select g.ends_at from public.team_members tm
      join public.teams t on t.id = tm.team_id
      join public.plan_grants g on g.user_id = t.owner_id
      join public.plans p on p.id = g.plan_id and p.rank >= v_plan_rank and p.fleet_reports
      where tm.user_id = v_ref.referrer_id and tm.user_id <> t.owner_id
        and g.revoked_at is null and g.starts_at <= now() and g.ends_at > now()
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

-- A new claim may be recorded after Google has already verified the email.
-- The trigger, not the client RPC, checks that Auth signal and awards it.
create or replace function private.on_referral_insert_confirm()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('referral-invitee:' || new.invitee_id::text, 0));
  perform private.try_confirm_referral(new.invitee_id);
  return new;
end;
$$;
--> statement-breakpoint
revoke all on function private.on_referral_insert_confirm()
  from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger on_referral_insert_confirm
  after insert on public.referrals
  for each row execute function private.on_referral_insert_confirm();
--> statement-breakpoint

-- Called as the person's JWT by account-welcome. It returns status, never another id.
create or replace function public.referral_claim(p_code text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid; v_referrer uuid; v_eligible timestamptz; v_signup_minutes integer;
  v_enabled boolean;
  v_status public.referral_status;
begin
  if p_code is null or upper(p_code) !~ '^[A-Z0-9]{10}$' then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_uid := private.require_account();
  if exists (select 1 from public.referrals where invitee_id = v_uid) then
    return 'already_recorded';
  end if;
  select coalesce((value #>> '{}')::boolean, false) into v_enabled
    from public.app_config where key = 'referral_enabled';
  if not v_enabled then return 'disabled'; end if;
  select p.user_id into v_referrer from public.profiles p where p.referral_code = upper(p_code);
  if v_referrer is null or v_referrer = v_uid then return 'invalid_code'; end if;
  select referral_eligible_at into v_eligible from public.profiles where user_id = v_uid;
  select (value #>> '{}')::integer into v_signup_minutes
    from public.app_config where key = 'referral_signup_window_minutes';
  if v_signup_minutes is null then
    raise exception 'referral_window_unconfigured' using errcode = 'PT503'; end if;
  if v_eligible is null or now() > v_eligible + make_interval(mins => v_signup_minutes)
    then return 'too_late'; end if;
  insert into public.referrals (referrer_id, invitee_id)
    values (v_referrer, v_uid) on conflict (invitee_id) do nothing;
  if not found then return 'already_recorded'; end if;
  select status into v_status from public.referrals where invitee_id = v_uid;
  if v_status = 'confirmed' then return 'confirmed'; end if;
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
--> statement-breakpoint

-- Mail claims are service-role only. A short lease makes parallel or retried
-- account-welcome calls choose one sender; a token prevents stale completion.
create or replace function public.email_claim_welcome(p_user uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_profile record; v_token uuid;
begin
  if p_user is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  select p.* into v_profile from public.profiles p join auth.users u on u.id = p.user_id
    where p.user_id = p_user and p.email is not null and u.email_confirmed_at is not null
    for update of p;
  if not found or v_profile.welcome_sent_at is not null or
     v_profile.welcome_uncertain_at is not null or
     v_profile.welcome_claimed_at is not null then return null; end if;
  v_token := pg_catalog.gen_random_uuid();
  update public.profiles set welcome_claimed_at = now(), welcome_claim_token = v_token
    where user_id = p_user;
  return jsonb_build_object('user_id', p_user, 'email', v_profile.email,
    'display_name', v_profile.display_name, 'claim_token', v_token);
end;
$$;
--> statement-breakpoint
revoke all on function public.email_claim_welcome(uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.email_claim_welcome(uuid) to service_role;
--> statement-breakpoint

create or replace function public.email_mark_welcome_sent(p_user uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_user is null or p_token is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.profiles set welcome_sent_at = now(), welcome_claimed_at = null,
    welcome_claim_token = null where user_id = p_user and welcome_sent_at is null
      and welcome_claim_token = p_token;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.email_mark_welcome_sent(uuid, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.email_mark_welcome_sent(uuid, uuid) to service_role;
--> statement-breakpoint

create or replace function public.email_release_welcome(p_user uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_user is null or p_token is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.profiles set welcome_claimed_at = null, welcome_claim_token = null
    where user_id = p_user and welcome_sent_at is null and welcome_claim_token = p_token;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.email_release_welcome(uuid, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.email_release_welcome(uuid, uuid) to service_role;
--> statement-breakpoint

create or replace function public.email_mark_welcome_uncertain(p_user uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_user is null or p_token is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.profiles set welcome_uncertain_at = now(), welcome_claimed_at = null,
    welcome_claim_token = null where user_id = p_user and welcome_sent_at is null
      and welcome_claim_token = p_token;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.email_mark_welcome_uncertain(uuid, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.email_mark_welcome_uncertain(uuid, uuid) to service_role;
--> statement-breakpoint

create or replace function public.email_claim_referral_notification(p_invitee uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_ref record; v_token uuid; v_email text;
begin
  if p_invitee is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  select * into v_ref from public.referrals where invitee_id = p_invitee for update;
  if not found or v_ref.status <> 'confirmed' or v_ref.notified_at is not null or
     v_ref.notify_uncertain_at is not null or
     v_ref.notify_claimed_at is not null then return null; end if;
  select email into v_email from public.profiles where user_id = v_ref.referrer_id;
  if v_email is null then return null; end if;
  v_token := pg_catalog.gen_random_uuid();
  update public.referrals set notify_claimed_at = now(), notify_claim_token = v_token
    where id = v_ref.id;
  return jsonb_build_object('referral_id', v_ref.id, 'claim_token', v_token,
    'email', v_email, 'points', v_ref.points_awarded,
    'total_points', (select coalesce(sum(points_awarded), 0) from public.referrals
      where referrer_id = v_ref.referrer_id and status = 'confirmed'),
    'confirmed', (select count(*) from public.referrals
      where referrer_id = v_ref.referrer_id and status = 'confirmed'),
    'threshold', (select value from public.app_config where key = 'referral_reward_threshold'),
    'reward_plan', (select p.name from public.plans p where p.id =
      (select value #>> '{}' from public.app_config where key = 'referral_reward_plan')),
    'reward_months', (select value from public.app_config where key = 'referral_reward_months'),
    'rewarded', v_ref.reward_grant_id is not null);
end;
$$;
--> statement-breakpoint
revoke all on function public.email_claim_referral_notification(uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.email_claim_referral_notification(uuid) to service_role;
--> statement-breakpoint

create or replace function public.email_mark_referral_notified(p_referral uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_referral is null or p_token is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.referrals set notified_at = now(), notify_claimed_at = null,
    notify_claim_token = null where id = p_referral and status = 'confirmed'
      and notified_at is null and notify_claim_token = p_token;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.email_mark_referral_notified(uuid, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.email_mark_referral_notified(uuid, uuid) to service_role;
--> statement-breakpoint

create or replace function public.email_release_referral_notification(p_referral uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_referral is null or p_token is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.referrals set notify_claimed_at = null, notify_claim_token = null
    where id = p_referral and notified_at is null and notify_claim_token = p_token;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.email_release_referral_notification(uuid, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.email_release_referral_notification(uuid, uuid) to service_role;
--> statement-breakpoint

create or replace function public.email_mark_referral_uncertain(p_referral uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_referral is null or p_token is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.referrals set notify_uncertain_at = now(), notify_claimed_at = null,
    notify_claim_token = null where id = p_referral and status = 'confirmed'
      and notified_at is null and notify_claim_token = p_token;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.email_mark_referral_uncertain(uuid, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.email_mark_referral_uncertain(uuid, uuid) to service_role;
--> statement-breakpoint

-- Reconcile referral-earned months after a referral is voided. Historical paid
-- subscriptions and admin grants are never touched.
create or replace function private.reconcile_referral_rewards(p_referrer uuid,
  p_actor uuid, p_void_referral uuid)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_grant record; v_threshold integer; v_months integer; v_cap integer;
  v_confirmed integer; v_allowed integer; v_rolling_allowed integer;
  v_total integer; v_rolling integer; v_revoked integer := 0;
begin
  if p_referrer is null then return 0; end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('referral:' || p_referrer::text, 0));
  select (value #>> '{}')::integer into v_threshold from public.app_config
    where key = 'referral_reward_threshold';
  select (value #>> '{}')::integer into v_months from public.app_config
    where key = 'referral_reward_months';
  select (value #>> '{}')::integer into v_cap from public.app_config
    where key = 'referral_reward_months_cap_per_year';
  if v_threshold is null or v_threshold < 1 or v_months is null or v_cap is null then
    raise exception 'referral_rule_unconfigured' using errcode = 'PT503'; end if;
  select count(*)::integer into v_confirmed from public.referrals
    where referrer_id = p_referrer and status = 'confirmed';
  v_allowed := (v_confirmed / v_threshold) * v_months;
  v_rolling_allowed := least(v_cap, v_allowed);
  select coalesce(sum(months), 0)::integer,
    coalesce(sum(months) filter (where created_at >= now() - interval '365 days'), 0)::integer
    into v_total, v_rolling from public.plan_grants
    where user_id = p_referrer and source = 'referral' and revoked_at is null;
  while v_total > v_allowed or v_rolling > v_rolling_allowed loop
    select g.id, g.months, g.created_at into v_grant from public.plan_grants g
      where g.user_id = p_referrer and g.source = 'referral' and g.revoked_at is null
        and (v_rolling <= v_rolling_allowed or g.created_at >= now() - interval '365 days')
      order by case when g.starts_at > now() then 2 when g.ends_at > now() then 1 else 0 end desc,
        g.created_at desc, g.id desc limit 1 for update;
    if not found then
      raise exception 'referral_reward_reconcile_failed' using errcode = 'PT503'; end if;
    update public.plan_grants set revoked_at = now(), revoked_by = p_actor
      where id = v_grant.id;
    v_total := v_total - coalesce(v_grant.months, 0);
    if v_grant.created_at >= now() - interval '365 days' then
      v_rolling := v_rolling - coalesce(v_grant.months, 0); end if;
    v_revoked := v_revoked + 1;
    insert into public.admin_audit (actor, action, subject_table, subject_id, after)
      values (p_actor, 'referral.reward_revoked', 'plan_grants', v_grant.id::text,
        jsonb_build_object('reason_code', 'referral_void',
          'void_referral_id', p_void_referral));
  end loop;
  return v_revoked;
end;
$$;
--> statement-breakpoint
revoke all on function private.reconcile_referral_rewards(uuid, uuid, uuid)
  from public, anon, authenticated, service_role;
