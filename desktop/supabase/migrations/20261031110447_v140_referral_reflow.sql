-- A referral grant is one time budget. The snapshot preserves the blocker intervals
-- that were known at the previous accounting point, even after a Team departure.
-- Only non-referral entitlements and earlier referral grants may pause it.
create or replace function private.reflow_referral_grants(p_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_now timestamptz := now(); v_grant record; v_range tstzrange;
  v_blockers tstzmultirange; v_rank integer; v_previous_end timestamptz := now();
  v_from timestamptz; v_to timestamptz; v_elapsed bigint; v_blocked bigint;
  v_remaining bigint; v_left bigint; v_gap bigint; v_cursor timestamptz;
  v_new_start timestamptz; v_new_end timestamptz;
  v_plan_id text;
begin
  if p_user is null then return; end if;
  if not exists (select 1 from auth.users where id = p_user) then return; end if;
  -- Confirmation and voiding already take this lock. Reusing it also serializes
  -- paid renewals and Team changes against the award and the reward ledger.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('referral:' || p_user::text, 0));
  if not exists (select 1 from public.plan_grants g
    where g.user_id = p_user and g.source = 'referral' and g.revoked_at is null
      and g.ends_at > v_now
      and (g.referral_remaining_us > 0 or g.referral_remaining_us is null))
    then return; end if;
  -- Serialize projections against an admin edit of rank/fleet eligibility.
  -- Plan rows are locked in key order; ordinary price and copy edits remain safe.
  for v_plan_id in select p.id from public.plans p order by p.id loop
    perform 1 from public.plans p where p.id = v_plan_id for share;
  end loop;
  for v_grant in
    select g.* from public.plan_grants g
      where g.user_id = p_user and g.source = 'referral' and g.revoked_at is null
      order by g.created_at, g.id for update
  loop
    select p.rank into v_rank from public.plans p where p.id = v_grant.plan_id;
    if v_rank is null then
      raise exception 'referral_plan_missing' using errcode = 'PT503'; end if;
    v_remaining := coalesce(v_grant.referral_remaining_us,
      greatest(0, round(extract(epoch from
        (v_grant.ends_at - greatest(v_grant.starts_at, v_now))) * 1000000)::bigint));
    v_from := greatest(coalesce(v_grant.referral_accounted_at, v_now), v_grant.starts_at);
    v_to := least(v_now, v_grant.ends_at);
    if v_to > v_from and v_remaining > 0 then
      v_elapsed := round(extract(epoch from (v_to - v_from)) * 1000000)::bigint;
      select coalesce(sum(round(extract(epoch from (upper(x.part) - lower(x.part)))
        * 1000000)::bigint), 0) into v_blocked
        from (select b.span * pg_catalog.tstzrange(v_from, v_to, '[)') as part
          from unnest(coalesce(v_grant.referral_blocked_ranges,
            '{}'::pg_catalog.tstzmultirange)) as b(span)) x
        where not isempty(x.part);
      v_remaining := greatest(0, v_remaining - v_elapsed + v_blocked);
    end if;

    if v_remaining = 0 then
      update public.plan_grants set referral_remaining_us = 0,
        referral_accounted_at = v_now,
        referral_blocked_ranges = '{}'::pg_catalog.tstzmultirange
        where id = v_grant.id;
      continue;
    end if;

    -- `range_agg` unions overlaps, so a paid period plus a Team seat pauses
    -- the budget once. Existing inactive/returned rows no longer project future
    -- coverage; their previously projected past is in referral_blocked_ranges.
    select coalesce(pg_catalog.range_agg(x.span), '{}'::pg_catalog.tstzmultirange)
      into v_blockers from (
      select pg_catalog.tstzrange(greatest(v_now, s.period_start), s.period_end, '[)') span
        from public.subscriptions s join public.plans p on p.id = s.plan_id
        where s.user_id = p_user and s.status = 'active' and s.returned_at is null
          and s.period_end > v_now and p.rank >= v_rank
      union all
      select pg_catalog.tstzrange(greatest(v_now, g.starts_at), g.ends_at, '[)')
        from public.plan_grants g join public.plans p on p.id = g.plan_id
        where g.user_id = p_user and g.source <> 'referral' and g.revoked_at is null
          and g.ends_at > v_now and p.rank >= v_rank
      union all
      select pg_catalog.tstzrange(greatest(v_now, s.period_start, tm.joined_at),
        s.period_end, '[)')
        from public.team_members tm join public.teams t on t.id = tm.team_id
        join public.subscriptions s on s.user_id = t.owner_id
        join public.plans p on p.id = s.plan_id
        where tm.user_id = p_user and tm.user_id <> t.owner_id
          and s.status = 'active' and s.returned_at is null
          and s.period_end > v_now and p.fleet_reports and p.rank >= v_rank
      union all
      select pg_catalog.tstzrange(greatest(v_now, g.starts_at, tm.joined_at),
        g.ends_at, '[)')
        from public.team_members tm join public.teams t on t.id = tm.team_id
        join public.plan_grants g on g.user_id = t.owner_id
        join public.plans p on p.id = g.plan_id
        where tm.user_id = p_user and tm.user_id <> t.owner_id
          and g.revoked_at is null and g.ends_at > v_now
          and p.fleet_reports and p.rank >= v_rank
      union all
      select pg_catalog.tstzrange(v_now, v_previous_end, '[)')
        where v_previous_end > v_now
    ) x where not isempty(x.span);

    -- The current grant keeps its past start, so access already used is never
    -- erased. A banked grant may move forward or back as future coverage changes.
    v_new_start := v_now;
    for v_range in select x.span from unnest(v_blockers) as x(span)
      order by lower(x.span) loop
      if upper(v_range) <= v_new_start then continue; end if;
      if lower(v_range) > v_new_start then exit; end if;
      v_new_start := upper(v_range);
    end loop;
    if v_grant.starts_at <= v_now then v_new_start := v_grant.starts_at; end if;
    if v_grant.starts_at > v_now then
      -- A fully banked month uses calendar months at its new start. Once it
      -- begins, its fixed microsecond balance preserves already used time.
      if v_grant.months is null then
        raise exception 'referral_months_missing' using errcode = 'PT503'; end if;
      v_remaining := round(extract(epoch from
        (v_new_start + make_interval(months => v_grant.months) - v_new_start))
        * 1000000)::bigint;
    end if;

    v_cursor := v_now;
    v_left := v_remaining;
    for v_range in select x.span from unnest(v_blockers) as x(span)
      order by lower(x.span) loop
      if upper(v_range) <= v_cursor then continue; end if;
      if lower(v_range) > v_cursor then
        v_gap := round(extract(epoch from (lower(v_range) - v_cursor)) * 1000000)::bigint;
        if v_gap >= v_left then exit; end if;
        v_left := v_left - v_gap;
      end if;
      v_cursor := upper(v_range);
    end loop;
    v_new_end := v_cursor + v_left * interval '1 microsecond';
    if v_new_end <= v_new_start then
      raise exception 'referral_reward_schedule_invalid' using errcode = 'PT503'; end if;
    update public.plan_grants set starts_at = v_new_start, ends_at = v_new_end,
      referral_remaining_us = v_remaining, referral_accounted_at = v_now,
      referral_blocked_ranges = v_blockers where id = v_grant.id;
    if v_grant.starts_at is distinct from v_new_start
       or v_grant.ends_at is distinct from v_new_end then
      insert into public.admin_audit (actor, action, subject_table, subject_id, before, after)
        values (null, 'referral.reward_rescheduled', 'plan_grants', v_grant.id::text,
          jsonb_build_object('starts_at', v_grant.starts_at, 'ends_at', v_grant.ends_at),
          jsonb_build_object('starts_at', v_new_start, 'ends_at', v_new_end));
    end if;
    v_previous_end := greatest(v_previous_end, v_new_end);
  end loop;
end;
$$;
--> statement-breakpoint
revoke all on function private.reflow_referral_grants(uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint

-- Owners can have up to 1,000 seats. Only members who actually hold a live
-- referral grant are visited, and each person's advisory lock is independent.
create or replace function private.reflow_owner_and_members(p_owner uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_member uuid; v_last uuid := '00000000-0000-0000-0000-000000000000';
  v_seen boolean;
begin
  if p_owner is null or not exists (select 1 from auth.users where id = p_owner)
    then return; end if;
  perform private.reflow_referral_grants(p_owner);
  loop
    v_seen := false;
    for v_member in
      select distinct tm.user_id from public.teams t
        join public.team_members tm on tm.team_id = t.id
        join public.plan_grants g on g.user_id = tm.user_id
        where t.owner_id = p_owner and tm.user_id > v_last
          and tm.user_id <> p_owner and g.source = 'referral'
          and g.revoked_at is null and g.ends_at > now()
          and (g.referral_remaining_us > 0 or g.referral_remaining_us is null)
        order by tm.user_id limit 50
    loop
      v_seen := true; v_last := v_member;
      perform private.reflow_referral_grants(v_member);
    end loop;
    exit when not v_seen;
  end loop;
end;
$$;
--> statement-breakpoint
revoke all on function private.reflow_owner_and_members(uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint

create or replace function private.on_plan_grant_reflow()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if new.source = 'referral' then
      update public.plan_grants set
        referral_remaining_us = round(extract(epoch from (new.ends_at - new.starts_at))
          * 1000000)::bigint,
        referral_accounted_at = now(),
        referral_blocked_ranges = '{}'::pg_catalog.tstzmultirange
        where id = new.id and referral_remaining_us is null;
      perform private.reflow_owner_and_members(new.user_id);
    else
      perform private.reflow_owner_and_members(new.user_id);
    end if;
    return new;
  end if;
  if tg_op = 'DELETE' then
    perform private.reflow_owner_and_members(old.user_id);
    return old;
  end if;
  -- A reflow changes only the time window and accounting columns, so it cannot
  -- call itself. A revocation or admin grant edit does need a new projection.
  if old.source = 'referral' and new.source = 'referral' then
    if old.revoked_at is distinct from new.revoked_at
       or old.user_id is distinct from new.user_id
       or old.plan_id is distinct from new.plan_id then
      perform private.reflow_owner_and_members(old.user_id);
      if new.user_id is distinct from old.user_id then
        perform private.reflow_owner_and_members(new.user_id); end if;
    end if;
  elsif old.user_id is distinct from new.user_id then
    perform private.reflow_owner_and_members(old.user_id);
    perform private.reflow_owner_and_members(new.user_id);
  elsif old.plan_id is distinct from new.plan_id
     or old.starts_at is distinct from new.starts_at
     or old.ends_at is distinct from new.ends_at
     or old.revoked_at is distinct from new.revoked_at
     or old.source is distinct from new.source then
    perform private.reflow_owner_and_members(new.user_id);
  end if;
  return new;
end;
$$;
--> statement-breakpoint
revoke all on function private.on_plan_grant_reflow()
  from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger plan_grant_referral_reflow
  after insert or update or delete on public.plan_grants
  for each row execute function private.on_plan_grant_reflow();
--> statement-breakpoint

create or replace function private.on_subscription_referral_reflow()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'DELETE' then
    perform private.reflow_owner_and_members(old.user_id);
    return old;
  end if;
  if tg_op = 'INSERT' then
    perform private.reflow_owner_and_members(new.user_id);
    return new;
  end if;
  if old.user_id is distinct from new.user_id then
    perform private.reflow_owner_and_members(old.user_id);
    perform private.reflow_owner_and_members(new.user_id);
  elsif old.plan_id is distinct from new.plan_id
     or old.period_start is distinct from new.period_start
     or old.period_end is distinct from new.period_end
     or old.status is distinct from new.status
     or old.returned_at is distinct from new.returned_at then
    perform private.reflow_owner_and_members(new.user_id);
  end if;
  return new;
end;
$$;
--> statement-breakpoint
revoke all on function private.on_subscription_referral_reflow()
  from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger subscription_referral_reflow
  after insert or update or delete on public.subscriptions
  for each row execute function private.on_subscription_referral_reflow();
--> statement-breakpoint

create or replace function private.on_team_membership_referral_reflow()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op <> 'INSERT' then
    perform private.reflow_referral_grants(old.user_id);
  end if;
  if tg_op <> 'DELETE' then
    perform private.reflow_referral_grants(new.user_id);
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
--> statement-breakpoint
revoke all on function private.on_team_membership_referral_reflow()
  from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger team_membership_referral_reflow
  after insert or update or delete on public.team_members
  for each row execute function private.on_team_membership_referral_reflow();
--> statement-breakpoint

-- A paused referral row may overlap a current paid or Team period in storage.
-- The stronger source wins ties in rank until its period ends.
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
      from public.team_members tm join public.teams t on t.id = tm.team_id
      join public.subscriptions s on s.user_id = t.owner_id
      join public.plans p on p.id = s.plan_id and p.fleet_reports
      where tm.user_id = p_user and tm.user_id <> t.owner_id
        and s.status = 'active' and s.returned_at is null
        and s.period_start <= p_at and s.period_end > p_at
    union all
    select g.plan_id, 'team'::text, g.ends_at
      from public.team_members tm join public.teams t on t.id = tm.team_id
      join public.plan_grants g on g.user_id = t.owner_id
      join public.plans p on p.id = g.plan_id and p.fleet_reports
      where tm.user_id = p_user and tm.user_id <> t.owner_id
        and g.revoked_at is null and g.starts_at <= p_at and g.ends_at > p_at
  )
  select c.plan_id, c.source, c.ends_at from candidates c
    join public.plans p on p.id = c.plan_id
    order by p.rank desc,
      case c.source when 'payment' then 4 when 'team' then 3
        when 'admin' then 2 when 'referral' then 1 else 0 end desc,
      c.ends_at desc, c.plan_id limit 1;
$$;
--> statement-breakpoint
revoke all on function private.plan_for_user(uuid, timestamptz)
  from public, anon, authenticated, service_role;
--> statement-breakpoint

-- Plan names, prices and limits remain editable. A rank or fleet toggle that
-- changes a recorded reward's blocker must wait until that reward is consumed.
-- This bounds admin writes instead of silently remapping many live schedules.
create or replace function private.guard_referral_plan_shape()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if old.rank is not distinct from new.rank
     and old.fleet_reports is not distinct from new.fleet_reports then return new; end if;
  if exists (
    select 1 from public.plan_grants r join public.plans rp on rp.id = r.plan_id
      where r.source = 'referral' and r.revoked_at is null and r.ends_at > now()
        and r.referral_remaining_us > 0
        and (
          (r.plan_id = old.id and
            (old.rank is distinct from new.rank
              or old.fleet_reports is distinct from new.fleet_reports))
          or (
            (old.rank >= rp.rank) is distinct from (new.rank >= rp.rank)
            and (exists (select 1 from public.subscriptions s
                where s.user_id = r.user_id and s.plan_id = old.id
                  and s.status = 'active' and s.returned_at is null
                  and s.period_end > now())
              or exists (select 1 from public.plan_grants b
                where b.user_id = r.user_id and b.plan_id = old.id
                  and b.source <> 'referral' and b.revoked_at is null
                  and b.ends_at > now()))
          )
          or (
            (old.fleet_reports and old.rank >= rp.rank) is distinct from
              (new.fleet_reports and new.rank >= rp.rank)
            and exists (select 1 from public.team_members tm
              join public.teams t on t.id = tm.team_id
              where tm.user_id = r.user_id and tm.user_id <> t.owner_id
                and (exists (select 1 from public.subscriptions s
                  where s.user_id = t.owner_id and s.plan_id = old.id
                    and s.status = 'active' and s.returned_at is null
                    and s.period_end > now())
                  or exists (select 1 from public.plan_grants b
                    where b.user_id = t.owner_id and b.plan_id = old.id
                      and b.revoked_at is null and b.ends_at > now())))
          )
        ) limit 1
  ) then
    raise exception 'referral_rewards_block_plan_shape_change' using errcode = 'PT409';
  end if;
  return new;
end;
$$;
--> statement-breakpoint
revoke all on function private.guard_referral_plan_shape()
  from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger guard_referral_plan_shape
  before update of rank, fleet_reports on public.plans
  for each row execute function private.guard_referral_plan_shape();
--> statement-breakpoint

-- A grant that began before a later renewal is paused, not newly banked.
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
        from public.referral_badge_awards a join public.badge_catalogue b on b.key = a.badge_key
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
        'banked', g.starts_at > now(),
        'paused', g.starts_at <= now() and g.ends_at > now()
          and coalesce(g.referral_blocked_ranges @> now(), false)) as item
        from public.plan_grants g where g.user_id = v_uid and g.source = 'referral'
          and g.revoked_at is null order by g.starts_at desc limit 10) x));
end;
$$;
--> statement-breakpoint
revoke all on function public.my_referral_status() from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.my_referral_status() to authenticated;
--> statement-breakpoint

-- Safe on an empty 1.4 launch, and idempotent if a partial test setup already
-- created rewards. Past coverage before this migration cannot be reconstructed.
update public.plan_grants set
  referral_remaining_us = greatest(0, round(extract(epoch from
    (ends_at - greatest(starts_at, now()))) * 1000000)::bigint),
  referral_accounted_at = now(),
  referral_blocked_ranges = '{}'::pg_catalog.tstzmultirange
  where source = 'referral' and referral_remaining_us is null;
--> statement-breakpoint
do $$
declare v_user uuid;
begin
  for v_user in select distinct user_id from public.plan_grants
    where source = 'referral' and revoked_at is null order by user_id
  loop perform private.reflow_referral_grants(v_user); end loop;
end;
$$;
--> statement-breakpoint
