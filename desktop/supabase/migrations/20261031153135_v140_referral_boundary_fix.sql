-- A reward starting exactly at now() has consumed no time. It may be banked
-- behind an earlier reward in the same transaction instead of overlapping it.
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
    if v_grant.starts_at < v_now then v_new_start := v_grant.starts_at; end if;
    if v_grant.starts_at >= v_now then
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
