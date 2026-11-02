-- Custom SQL migration file, put your code below! --
-- Shared 1.4.0 entitlements. These helpers are absent from PostgREST's exposed schemas.
-- The account gate is repeated in public entry points even when a caller is a service role.
create or replace function private.require_account()
returns uuid language plpgsql stable set search_path = '' as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'unauthenticated' using errcode = 'PT401'; end if;
  if private.is_anon() then raise exception 'signed_in_required' using errcode = 'PT403'; end if;
  return v_uid;
end;
$$;
--> statement-breakpoint
revoke all on function private.require_account() from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function private.require_account() to authenticated;
--> statement-breakpoint

-- Highest ranked active entitlement. An inactive catalog row remains effective for an
-- existing paid period or grant; deactivation stops only new purchases.
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
--> statement-breakpoint
revoke all on function private.plan_for_user(uuid, timestamptz) from public, anon, authenticated, service_role;
--> statement-breakpoint

-- The capacity is derived from the owner's current Team entitlement, never teams.seats.
create or replace function private.team_seats(p_team uuid, p_at timestamptz default now())
returns integer language sql stable security definer set search_path = '' as $$
  select coalesce(max(seats), 0)::integer from (
    select s.seats from public.teams t join public.subscriptions s on s.user_id = t.owner_id
      join public.plans p on p.id = s.plan_id and p.fleet_reports
      where t.id = p_team and s.status = 'active' and s.returned_at is null
        and s.period_start <= p_at and s.period_end > p_at
    union all
    select g.seats from public.teams t join public.plan_grants g on g.user_id = t.owner_id
      join public.plans p on p.id = g.plan_id and p.fleet_reports
      where t.id = p_team and g.revoked_at is null
        and g.starts_at <= p_at and g.ends_at > p_at
  ) active_seats;
$$;
--> statement-breakpoint
revoke all on function private.team_seats(uuid, timestamptz) from public, anon, authenticated, service_role;
--> statement-breakpoint

create or replace function public.my_plan()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid(); v_anon boolean; v_plan record;
  v_plan_id text; v_source text; v_ends timestamptz;
  v_next_id text; v_next_end timestamptz;
  v_team jsonb; v_request jsonb; v_upcoming jsonb; v_downgrade jsonb;
begin
  if v_uid is null then raise exception 'unauthenticated' using errcode = 'PT401'; end if;
  v_anon := private.is_anon();
  if not v_anon then
    select e.plan_id, e.source, e.ends_at into v_plan_id, v_source, v_ends
      from private.plan_for_user(v_uid, now()) e;
  end if;
  select * into v_plan from public.plans where id = coalesce(v_plan_id, 'free');
  if not found then raise exception 'free_plan_required' using errcode = 'PT409'; end if;
  if v_ends is not null then
    -- Carry a contiguous stretch of the same tier through banked periods.
    for i in 1..50 loop
      select e.plan_id, e.ends_at into v_next_id, v_next_end
        from private.plan_for_user(v_uid, v_ends) e;
      exit when v_next_id is distinct from v_plan.id or v_next_end <= v_ends;
      v_ends := v_next_end;
    end loop;
    select jsonb_build_object('id', p.id, 'name', p.name) into v_downgrade
      from public.plans p where p.id = coalesce(v_next_id, 'free') and p.rank < v_plan.rank;
  end if;
  if not v_anon then
    select jsonb_build_object('id', t.id, 'name', t.name, 'role', tm.role,
      'seats', private.team_seats(t.id)) into v_team
      from public.team_members tm join public.teams t on t.id = tm.team_id
      where tm.user_id = v_uid limit 1;
    select jsonb_build_object('id', r.id, 'plan_id', r.plan_id, 'interval', r.interval,
      'seats', r.seats, 'created_at', r.created_at) into v_request
      from public.plan_requests r where r.user_id = v_uid and r.status = 'pending'
      order by r.created_at desc limit 1;
    select coalesce(jsonb_agg(x.item order by x.starts_at), '[]'::jsonb) into v_upcoming from (
      select g.starts_at, jsonb_build_object('plan_id', g.plan_id, 'plan_name', p.name,
        'source', g.source, 'starts_at', g.starts_at, 'ends_at', g.ends_at) as item
        from public.plan_grants g join public.plans p on p.id = g.plan_id
        where g.user_id = v_uid and g.revoked_at is null and g.starts_at > now()
        order by g.starts_at limit 10
    ) x;
  end if;
  return jsonb_build_object(
    'is_anonymous', v_anon,
    'plan', jsonb_build_object('id', v_plan.id, 'name', v_plan.name, 'rank', v_plan.rank,
      'real_runs_unlimited', v_plan.real_runs_unlimited, 'report_machines', v_plan.report_machines,
      'schedules', v_plan.schedules, 'history_export', v_plan.history_export,
      'fleet_reports', v_plan.fleet_reports),
    'source', coalesce(v_source, 'free'), 'ends_at', v_ends,
    'downgrades_to', v_downgrade, 'upcoming', coalesce(v_upcoming, '[]'::jsonb),
    'limits_override', (select p.limits_override from public.profiles p where p.user_id = v_uid),
    'team', v_team, 'pending_request', v_request);
end;
$$;
--> statement-breakpoint
revoke all on function public.my_plan() from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.my_plan() to authenticated;
--> statement-breakpoint

-- The notice is one-way and uses server time; no client receives UPDATE on this column.
create or replace function public.mark_legal_notice_seen()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_uid uuid; v_seen timestamptz;
begin
  v_uid := private.require_account();
  update public.profiles set legal_notice_seen_at = coalesce(legal_notice_seen_at, now())
    where user_id = v_uid returning legal_notice_seen_at into v_seen;
  if v_seen is null then raise exception 'not_found' using errcode = 'PT404'; end if;
  return jsonb_build_object('legal_notice_seen_at', v_seen);
end;
$$;
--> statement-breakpoint
revoke all on function public.mark_legal_notice_seen() from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.mark_legal_notice_seen() to authenticated;
--> statement-breakpoint

-- A plan request cannot be used to request Free, an inactive tier, or a seat
-- count that checkout itself would refuse. The request grants no entitlement.
create or replace function private.validate_plan_request()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_uid uuid; v_plan record;
begin
  if new.plan_id is null or new.interval is null or new.seats is null then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_uid := private.require_account();
  if new.user_id is distinct from v_uid then
    raise exception 'forbidden' using errcode = 'PT403';
  end if;
  select * into v_plan from public.plans where id = new.plan_id and is_active;
  if not found then raise exception 'invalid_plan' using errcode = 'PT422'; end if;
  if v_plan.rank = 0 or (case when new.interval = 'month' then v_plan.price_month_cents
    else v_plan.price_year_cents end) <= 0 then
    raise exception 'not_purchasable' using errcode = 'PT422';
  end if;
  if new.seats < v_plan.min_seats or (not v_plan.per_seat and new.seats <> 1) then
    raise exception 'seats_below_minimum' using errcode = 'PT422';
  end if;
  return new;
end;
$$;
--> statement-breakpoint
revoke all on function private.validate_plan_request() from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger plan_requests_validate_before_insert
  before insert on public.plan_requests for each row execute function private.validate_plan_request();
