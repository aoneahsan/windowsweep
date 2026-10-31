-- Custom SQL migration file, put your code below! --
-- Every administrative RPC performs its own role check. Edge routing alone is
-- insufficient for a security-definer function exposed through PostgREST.
create or replace function private.require_admin()
returns uuid language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid;
begin
  v_uid := private.require_account();
  if not exists (select 1 from public.profiles p where p.user_id = v_uid
      and p.platform_role in ('admin', 'superadmin')) then
    raise exception 'forbidden' using errcode = 'PT403';
  end if;
  return v_uid;
end;
$$;
--> statement-breakpoint
revoke all on function private.require_admin() from public, anon, authenticated, service_role;
--> statement-breakpoint

create or replace function private.admin_reason(p_reason text)
returns text language plpgsql immutable set search_path = '' as $$
begin
  if p_reason is null or char_length(trim(p_reason)) not between 1 and 500 then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  return trim(p_reason);
end;
$$;
--> statement-breakpoint
revoke all on function private.admin_reason(text) from public, anon, authenticated, service_role;
--> statement-breakpoint

create or replace function public.admin_set_plan(p_user uuid, p_plan text,
  p_ends_at timestamptz, p_seats integer, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid; v_plan record; v_grant uuid; v_before jsonb;
begin
  if p_user is null or p_plan is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  if not exists (select 1 from public.profiles where user_id = p_user and email is not null) then
    raise exception 'not_found' using errcode = 'PT404';
  end if;
  select * into v_plan from public.plans where id = p_plan;
  if not found then raise exception 'invalid_plan' using errcode = 'PT422'; end if;
  if p_plan = 'free' then
    update public.plan_grants set revoked_at = now(), revoked_by = v_admin
      where user_id = p_user and source = 'admin' and revoked_at is null and ends_at > now();
  else
    if p_ends_at is null or p_ends_at <= now() then
      raise exception 'invalid_request' using errcode = 'PT422';
    end if;
    if p_seats is null then p_seats := v_plan.min_seats; end if;
    if p_seats < v_plan.min_seats or (not v_plan.per_seat and p_seats <> 1) then
      raise exception 'invalid_request' using errcode = 'PT422';
    end if;
    insert into public.plan_grants (user_id, plan_id, source, seats, granted_by,
      reason, ends_at) values (p_user, p_plan, 'admin', p_seats, v_admin, p_reason, p_ends_at)
      returning id into v_grant;
    if v_plan.fleet_reports then perform private.ensure_owned_team(p_user); end if;
  end if;
  insert into public.admin_audit (actor, action, subject_table, subject_id, before, after)
    values (v_admin, 'user.plan', 'profiles', p_user::text, v_before,
      jsonb_build_object('plan_id', p_plan, 'grant_id', v_grant, 'reason', p_reason));
  return jsonb_build_object('plan_id', p_plan);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_set_plan(uuid, text, timestamptz, integer, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_set_plan(uuid, text, timestamptz, integer, text)
  to authenticated;
--> statement-breakpoint

create or replace function public.admin_override_limits(p_user uuid, p_overrides jsonb, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid; v_before jsonb; v_key text; v_value jsonb;
begin
  if p_user is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  if p_overrides is not null and jsonb_typeof(p_overrides) <> 'object' then
    raise exception 'invalid_override' using errcode = 'PT422';
  end if;
  if p_overrides is not null then
    for v_key, v_value in select key, value from jsonb_each(p_overrides) loop
      if v_key = 'real_runs_unlimited' then
        if jsonb_typeof(v_value) <> 'boolean' then
          raise exception 'invalid_override' using errcode = 'PT422'; end if;
      elsif v_key in ('device_real_runs_per_month', 'account_extra_real_runs_per_month', 'report_machines') then
        if jsonb_typeof(v_value) <> 'number' or (v_value #>> '{}') !~ '^[0-9]+$'
           or (v_value #>> '{}')::numeric > case when v_key = 'report_machines' then 1000 else 100000 end
          then raise exception 'invalid_override' using errcode = 'PT422'; end if;
      else raise exception 'invalid_override' using errcode = 'PT422'; end if;
    end loop;
  end if;
  v_admin := private.require_admin();
  select limits_override into v_before from public.profiles
    where user_id = p_user and email is not null for update;
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  update public.profiles set limits_override = p_overrides where user_id = p_user;
  insert into public.admin_audit (actor, action, subject_table, subject_id, before, after)
    values (v_admin, 'user.limits', 'profiles', p_user::text,
      jsonb_build_object('limits_override', v_before),
      jsonb_build_object('limits_override', p_overrides, 'reason', p_reason));
  return jsonb_build_object('limits_override', p_overrides);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_override_limits(uuid, jsonb, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_override_limits(uuid, jsonb, text) to authenticated;
--> statement-breakpoint

create or replace function public.admin_plan_upsert(p_plan jsonb, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid; v_id text; v_before jsonb; v_after jsonb; v_exists boolean;
begin
  if p_plan is null or jsonb_typeof(p_plan) <> 'object' then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_id := p_plan ->> 'id';
  if v_id is null or v_id !~ '^[a-z][a-z0-9_]{1,31}$' or exists (
    select 1 from jsonb_object_keys(p_plan) k where k not in ('id','name','description','rank',
      'is_active','price_month_cents','price_year_cents','per_seat','min_seats',
      'real_runs_unlimited','device_real_runs_per_month','account_extra_real_runs_per_month',
      'report_machines','schedules','history_export','fleet_reports')) then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  select to_jsonb(p), true into v_before, v_exists from public.plans p where id = v_id for update;
  if not coalesce(v_exists, false) then
    if p_plan ->> 'name' is null or p_plan ->> 'rank' is null then
      raise exception 'invalid_request' using errcode = 'PT422';
    end if;
    insert into public.plans (id, name, description, rank, is_active,
      price_month_cents, price_year_cents, per_seat, min_seats,
      real_runs_unlimited, device_real_runs_per_month, account_extra_real_runs_per_month,
      report_machines, schedules, history_export, fleet_reports)
    values (v_id, p_plan ->> 'name', coalesce(p_plan ->> 'description', ''),
      (p_plan ->> 'rank')::smallint, coalesce((p_plan ->> 'is_active')::boolean, true),
      coalesce((p_plan ->> 'price_month_cents')::integer, 0),
      coalesce((p_plan ->> 'price_year_cents')::integer, 0),
      coalesce((p_plan ->> 'per_seat')::boolean, false),
      coalesce((p_plan ->> 'min_seats')::smallint, 1),
      coalesce((p_plan ->> 'real_runs_unlimited')::boolean, false),
      (p_plan ->> 'device_real_runs_per_month')::integer,
      (p_plan ->> 'account_extra_real_runs_per_month')::integer,
      coalesce((p_plan ->> 'report_machines')::smallint, 0),
      coalesce((p_plan ->> 'schedules')::boolean, false),
      coalesce((p_plan ->> 'history_export')::boolean, false),
      coalesce((p_plan ->> 'fleet_reports')::boolean, false));
  else
    if v_id = 'free' and p_plan ? 'is_active' and (p_plan ->> 'is_active')::boolean is false then
      raise exception 'free_plan_required' using errcode = 'PT409';
    end if;
    update public.plans as p set
      name = case when p_plan ? 'name' then p_plan ->> 'name' else p.name end,
      description = case when p_plan ? 'description' then p_plan ->> 'description' else p.description end,
      rank = case when p_plan ? 'rank' then (p_plan ->> 'rank')::smallint else p.rank end,
      is_active = case when p_plan ? 'is_active' then (p_plan ->> 'is_active')::boolean else p.is_active end,
      price_month_cents = case when p_plan ? 'price_month_cents' then (p_plan ->> 'price_month_cents')::integer else p.price_month_cents end,
      price_year_cents = case when p_plan ? 'price_year_cents' then (p_plan ->> 'price_year_cents')::integer else p.price_year_cents end,
      per_seat = case when p_plan ? 'per_seat' then (p_plan ->> 'per_seat')::boolean else p.per_seat end,
      min_seats = case when p_plan ? 'min_seats' then (p_plan ->> 'min_seats')::smallint else p.min_seats end,
      real_runs_unlimited = case when p_plan ? 'real_runs_unlimited' then (p_plan ->> 'real_runs_unlimited')::boolean else p.real_runs_unlimited end,
      device_real_runs_per_month = case when p_plan ? 'device_real_runs_per_month' then (p_plan ->> 'device_real_runs_per_month')::integer else p.device_real_runs_per_month end,
      account_extra_real_runs_per_month = case when p_plan ? 'account_extra_real_runs_per_month' then (p_plan ->> 'account_extra_real_runs_per_month')::integer else p.account_extra_real_runs_per_month end,
      report_machines = case when p_plan ? 'report_machines' then (p_plan ->> 'report_machines')::smallint else p.report_machines end,
      schedules = case when p_plan ? 'schedules' then (p_plan ->> 'schedules')::boolean else p.schedules end,
      history_export = case when p_plan ? 'history_export' then (p_plan ->> 'history_export')::boolean else p.history_export end,
      fleet_reports = case when p_plan ? 'fleet_reports' then (p_plan ->> 'fleet_reports')::boolean else p.fleet_reports end,
      updated_at = now()
      where p.id = v_id;
  end if;
  select to_jsonb(p) into v_after from public.plans p where id = v_id;
  insert into public.admin_audit (actor, action, subject_table, subject_id, before, after)
    values (v_admin, case when v_exists then 'plan.update' else 'plan.create' end,
      'plans', v_id, v_before, v_after || jsonb_build_object('reason', p_reason));
  return jsonb_build_object('plan', v_after);
exception when check_violation or not_null_violation or invalid_text_representation or numeric_value_out_of_range then
  raise exception 'invalid_value' using errcode = 'PT422';
when unique_violation then
  raise exception 'invalid_value' using errcode = 'PT422';
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_plan_upsert(jsonb, text) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_plan_upsert(jsonb, text) to authenticated;
--> statement-breakpoint

create or replace function public.admin_plans_list(p_limit integer default 20,
  p_page integer default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_total integer;
begin
  if p_limit is null or p_limit not between 1 and 50 or
     p_page is null or p_page not between 0 and 1000 then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.require_admin();
  select count(*)::integer into v_total from public.plans;
  return jsonb_build_object('items', (select coalesce(jsonb_agg(to_jsonb(p) order by p.rank), '[]'::jsonb)
    from (select * from public.plans order by rank, id
      limit p_limit offset p_limit * p_page) p),
    'page', p_page, 'limit', p_limit, 'total', v_total,
    'next_page', case when (p_page + 1) * p_limit < v_total then p_page + 1 else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_plans_list(integer, integer) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_plans_list(integer, integer) to authenticated;
--> statement-breakpoint

create or replace function public.admin_grant_create(p_user uuid, p_plan text,
  p_starts_at timestamptz, p_ends_at timestamptz, p_seats integer, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid; v_plan record; v_id uuid; v_start timestamptz;
begin
  if p_user is null or p_plan is null or p_ends_at is null then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  if not exists (select 1 from public.profiles where user_id = p_user and email is not null) then
    raise exception 'not_found' using errcode = 'PT404'; end if;
  select * into v_plan from public.plans where id = p_plan and is_active and rank > 0;
  if not found then raise exception 'invalid_plan' using errcode = 'PT422'; end if;
  v_start := coalesce(p_starts_at, now());
  if p_ends_at <= v_start then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  if p_seats is null then p_seats := v_plan.min_seats; end if;
  if p_seats < v_plan.min_seats or (not v_plan.per_seat and p_seats <> 1) then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  insert into public.plan_grants (user_id, plan_id, source, seats, granted_by,
    reason, starts_at, ends_at)
    values (p_user, p_plan, 'admin', p_seats, v_admin, p_reason, v_start, p_ends_at)
    returning id into v_id;
  if v_plan.fleet_reports and v_start <= now() then perform private.ensure_owned_team(p_user); end if;
  insert into public.admin_audit (actor, action, subject_table, subject_id, after)
    values (v_admin, 'grant.create', 'plan_grants', v_id::text,
      jsonb_build_object('user_id', p_user, 'plan_id', p_plan,
        'starts_at', v_start, 'ends_at', p_ends_at, 'seats', p_seats, 'reason', p_reason));
  return jsonb_build_object('id', v_id);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_grant_create(uuid, text, timestamptz, timestamptz, integer, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_grant_create(uuid, text, timestamptz, timestamptz, integer, text)
  to authenticated;
--> statement-breakpoint

create or replace function public.admin_grant_revoke(p_grant_id uuid, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid; v_before jsonb; v_after jsonb;
begin
  if p_grant_id is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  select to_jsonb(g) into v_before from public.plan_grants g where id = p_grant_id for update;
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  update public.plan_grants set revoked_at = coalesce(revoked_at, now()),
    revoked_by = coalesce(revoked_by, v_admin) where id = p_grant_id;
  select to_jsonb(g) into v_after from public.plan_grants g where id = p_grant_id;
  insert into public.admin_audit (actor, action, subject_table, subject_id, before, after)
    values (v_admin, 'grant.revoke', 'plan_grants', p_grant_id::text,
      v_before, v_after || jsonb_build_object('reason', p_reason));
  return jsonb_build_object('id', p_grant_id, 'revoked_at', v_after -> 'revoked_at');
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_grant_revoke(uuid, text) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_grant_revoke(uuid, text) to authenticated;
--> statement-breakpoint

create or replace function private.decode_cursor(p_cursor text)
returns jsonb language plpgsql immutable set search_path = '' as $$
declare v_value jsonb;
begin
  if p_cursor is null then return null; end if;
  if length(p_cursor) > 300 then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  begin
    v_value := pg_catalog.convert_from(pg_catalog.decode(p_cursor, 'base64'), 'UTF8')::jsonb;
    if v_value ->> 't' is null or v_value ->> 'id' is null then
      raise exception 'invalid_request' using errcode = 'PT422';
    end if;
    perform (v_value ->> 't')::timestamptz;
  exception when others then raise exception 'invalid_request' using errcode = 'PT422'; end;
  return v_value;
end;
$$;
--> statement-breakpoint
revoke all on function private.decode_cursor(text) from public, anon, authenticated, service_role;
--> statement-breakpoint

create or replace function private.encode_cursor(p_at timestamptz, p_id text)
returns text language sql immutable set search_path = '' as $$
  select pg_catalog.encode(pg_catalog.convert_to(jsonb_build_object('t', p_at,
    'id', p_id)::text, 'UTF8'), 'base64');
$$;
--> statement-breakpoint
revoke all on function private.encode_cursor(timestamptz, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint

create or replace function public.admin_stats()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_month text := to_char(now() at time zone 'UTC', 'YYYY-MM');
begin
  perform private.require_admin();
  return jsonb_build_object('month', v_month,
    'accounts', (select count(*) from public.profiles where email is not null),
    'device_sessions', (select count(*) from public.profiles where email is null),
    'devices', (select count(*) from public.devices),
    'paying_accounts', (select count(distinct user_id) from public.subscriptions
      where status = 'active' and returned_at is null and period_end > now()),
    'active_grants', (select count(*) from public.plan_grants
      where revoked_at is null and starts_at <= now() and ends_at > now()),
    'pending_requests', (select count(*) from public.plan_requests where status = 'pending'),
    'real_runs_this_month', (select count(*) from public.run_claims where month = v_month),
    'runs_by_pool', (select coalesce(jsonb_object_agg(pool, total), '{}'::jsonb) from (
      select pool, count(*) as total from public.run_claims where month = v_month group by pool) x),
    'synced_runs_30d', (select count(*) from public.runs where started_at >= now() - interval '30 days'),
    'confirmed_referrals', (select count(*) from public.referrals where status = 'confirmed'));
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_stats() from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_stats() to authenticated;
--> statement-breakpoint

create or replace function public.admin_users_list(p_query text default null,
  p_cursor text default null, p_limit integer default 20)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_cursor jsonb; v_items jsonb := '[]'::jsonb; v_count integer := 0;
  v_last timestamptz; v_last_id text; v_row record; v_plan text;
begin
  if p_limit is null or p_limit not between 1 and 50 or
     (p_query is not null and length(p_query) > 100) then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  v_cursor := private.decode_cursor(p_cursor);
  perform private.require_admin();
  for v_row in select p.* from public.profiles p where p.email is not null
    and (p_query is null or position(lower(p_query) in lower(p.email)) > 0
      or position(lower(p_query) in lower(coalesce(p.display_name, ''))) > 0)
    and (v_cursor is null or (p.created_at, p.user_id::text) <
      ((v_cursor ->> 't')::timestamptz, v_cursor ->> 'id'))
    order by p.created_at desc, p.user_id desc limit p_limit loop
    select e.plan_id into v_plan from private.plan_for_user(v_row.user_id, now()) e;
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'id', v_row.user_id, 'email', v_row.email, 'display_name', v_row.display_name,
      'role', v_row.platform_role, 'plan_id', coalesce(v_plan, 'free'),
      'devices', (select count(*) from public.devices where user_id = v_row.user_id),
      'real_runs_this_month', (select count(*) from public.run_claims
        where user_id = v_row.user_id and month = to_char(now() at time zone 'UTC', 'YYYY-MM')),
      'joined_at', v_row.created_at, 'verified', v_row.verified_at is not null));
    v_count := v_count + 1; v_last := v_row.created_at; v_last_id := v_row.user_id::text;
  end loop;
  return jsonb_build_object('items', v_items,
    'next_cursor', case when v_count = p_limit then private.encode_cursor(v_last, v_last_id) else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_users_list(text, text, integer)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_users_list(text, text, integer) to authenticated;
--> statement-breakpoint

create or replace function public.admin_users_view(p_user uuid)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_profile record; v_plan_id text; v_source text; v_ends timestamptz;
  v_plan record; v_next_id text; v_next_end timestamptz;
  v_downgrade jsonb; v_upcoming jsonb; v_team jsonb; v_request jsonb;
  v_month text := to_char(now() at time zone 'UTC', 'YYYY-MM');
begin
  if p_user is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.require_admin();
  select * into v_profile from public.profiles where user_id = p_user and email is not null;
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  select e.plan_id, e.source, e.ends_at into v_plan_id, v_source, v_ends
    from private.plan_for_user(p_user, now()) e;
  select * into v_plan from public.plans where id = coalesce(v_plan_id, 'free');
  if not found then raise exception 'free_plan_required' using errcode = 'PT409'; end if;
  if v_ends is not null then
    for i in 1..50 loop
      select e.plan_id, e.ends_at into v_next_id, v_next_end
        from private.plan_for_user(p_user, v_ends) e;
      exit when v_next_id is distinct from v_plan.id or v_next_end <= v_ends;
      v_ends := v_next_end;
    end loop;
    select jsonb_build_object('id', p.id, 'name', p.name) into v_downgrade
      from public.plans p where p.id = coalesce(v_next_id, 'free') and p.rank < v_plan.rank;
  end if;
  select jsonb_build_object('id', t.id, 'name', t.name, 'role', tm.role,
    'seats', private.team_seats(t.id)) into v_team
    from public.team_members tm join public.teams t on t.id = tm.team_id
    where tm.user_id = p_user limit 1;
  select jsonb_build_object('id', r.id, 'plan_id', r.plan_id, 'interval', r.interval,
    'seats', r.seats, 'created_at', r.created_at) into v_request
    from public.plan_requests r where r.user_id = p_user and r.status = 'pending'
    order by r.created_at desc limit 1;
  select coalesce(jsonb_agg(x.item order by x.starts_at), '[]'::jsonb) into v_upcoming from (
    select g.starts_at, jsonb_build_object('plan_id', g.plan_id, 'plan_name', p.name,
      'source', g.source, 'starts_at', g.starts_at, 'ends_at', g.ends_at) as item
      from public.plan_grants g join public.plans p on p.id = g.plan_id
      where g.user_id = p_user and g.revoked_at is null and g.starts_at > now()
      order by g.starts_at limit 10
  ) x;
  return jsonb_build_object(
    'profile', to_jsonb(v_profile),
    'plan', jsonb_build_object('is_anonymous', false,
      'plan', jsonb_build_object('id', v_plan.id, 'name', v_plan.name, 'rank', v_plan.rank,
        'real_runs_unlimited', v_plan.real_runs_unlimited, 'report_machines', v_plan.report_machines,
        'schedules', v_plan.schedules, 'history_export', v_plan.history_export,
        'fleet_reports', v_plan.fleet_reports),
      'source', coalesce(v_source, 'free'), 'ends_at', v_ends,
      'downgrades_to', v_downgrade, 'upcoming', coalesce(v_upcoming, '[]'::jsonb),
      'limits_override', v_profile.limits_override,
      'team', v_team, 'pending_request', v_request),
    'devices', (select coalesce(jsonb_agg(to_jsonb(x) order by x.last_seen_at desc), '[]'::jsonb)
      from (select id, created_at, last_seen_at from public.devices where user_id = p_user
        order by last_seen_at desc limit 50) x),
    'subscriptions', (select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
      from (select id, plan_id, interval, seats, status, period_start, period_end,
        amount_cents, currency, returned_at, cancelled_at, created_at
        from public.subscriptions where user_id = p_user order by created_at desc limit 20) x),
    'grants', (select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
      from (select id, plan_id, source, seats, granted_by, reason, starts_at,
        ends_at, revoked_at, created_at from public.plan_grants
        where user_id = p_user order by created_at desc limit 20) x),
    'real_runs_this_month', (select jsonb_build_object('device', count(*) filter (where pool = 'device'),
      'account', count(*) filter (where pool = 'account'),
      'plan', count(*) filter (where pool = 'plan')) from public.run_claims
      where user_id = p_user and month = v_month),
    'referrals', (select jsonb_build_object('confirmed', count(*) filter (where status = 'confirmed'),
      'pending', count(*) filter (where status = 'pending'),
      'points', coalesce(sum(points_awarded) filter (where status = 'confirmed'), 0))
      from public.referrals where referrer_id = p_user),
    'requests', (select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
      from (select id, plan_id, interval, seats, status, created_at, notified_at, closed_at
        from public.plan_requests where user_id = p_user order by created_at desc limit 10) x));
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_users_view(uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_users_view(uuid) to authenticated;
--> statement-breakpoint

create or replace function public.admin_grants_list(p_user uuid default null,
  p_active_only boolean default false, p_cursor text default null, p_limit integer default 20)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_cursor jsonb; v_items jsonb := '[]'::jsonb; v_count integer := 0;
  v_row record; v_last timestamptz; v_last_id text;
begin
  if p_limit is null or p_limit not between 1 and 50 then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  v_cursor := private.decode_cursor(p_cursor);
  perform private.require_admin();
  for v_row in select g.*, p.email as user_email,
      coalesce(a.email, case when g.granted_by is null then 'system' else g.granted_by::text end)
        as granted_by_label
    from public.plan_grants g join public.profiles p on p.user_id = g.user_id
      left join public.profiles a on a.user_id = g.granted_by
    where (p_user is null or g.user_id = p_user)
      and (not coalesce(p_active_only, false) or
        (g.revoked_at is null and g.starts_at <= now() and g.ends_at > now()))
      and (v_cursor is null or (g.created_at, g.id::text) <
        ((v_cursor ->> 't')::timestamptz, v_cursor ->> 'id'))
    order by g.created_at desc, g.id desc limit p_limit loop
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'id', v_row.id, 'user_id', v_row.user_id, 'user_email', v_row.user_email,
      'plan_id', v_row.plan_id, 'source', v_row.source, 'seats', v_row.seats,
      'granted_by', v_row.granted_by_label, 'reason', v_row.reason,
      'starts_at', v_row.starts_at, 'ends_at', v_row.ends_at,
      'revoked_at', v_row.revoked_at, 'revoked_by', v_row.revoked_by,
      'created_at', v_row.created_at));
    v_count := v_count + 1; v_last := v_row.created_at; v_last_id := v_row.id::text;
  end loop;
  return jsonb_build_object('items', v_items,
    'next_cursor', case when v_count = p_limit then private.encode_cursor(v_last, v_last_id) else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_grants_list(uuid, boolean, text, integer)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_grants_list(uuid, boolean, text, integer) to authenticated;
