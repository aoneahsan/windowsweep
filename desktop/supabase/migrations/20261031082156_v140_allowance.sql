-- Custom SQL migration file, put your code below! --
-- A single source for the monthly counters, registered device and effective limits.
create or replace function public.get_allowance(p_device_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid(); v_anon boolean; v_month text;
  v_plan record; v_plan_id text; v_override jsonb; v_device_limit integer;
  v_account_limit integer; v_device_used integer; v_account_used integer;
  v_left integer;
begin
  if p_device_id is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  if v_uid is null then raise exception 'unauthenticated' using errcode = 'PT401'; end if;
  v_anon := private.is_anon();
  insert into public.devices as d (id, user_id) values (p_device_id, v_uid)
    on conflict (id) do update set last_seen_at = now() where d.user_id = v_uid;
  if not found then raise exception 'device_owned' using errcode = 'PT403'; end if;
  v_month := to_char(now() at time zone 'UTC', 'YYYY-MM');
  if not v_anon then
    select e.plan_id into v_plan_id from private.plan_for_user(v_uid, now()) e;
    select p.limits_override into v_override from public.profiles p where p.user_id = v_uid;
  end if;
  select * into v_plan from public.plans where id = coalesce(v_plan_id, 'free');
  if not found then raise exception 'free_plan_required' using errcode = 'PT409'; end if;
  v_device_limit := coalesce((v_override ->> 'device_real_runs_per_month')::integer,
    v_plan.device_real_runs_per_month,
    (select (value #>> '{}')::integer from public.app_config where key = 'device_real_runs_per_month'), 15);
  v_account_limit := coalesce((v_override ->> 'account_extra_real_runs_per_month')::integer,
    v_plan.account_extra_real_runs_per_month,
    (select (value #>> '{}')::integer from public.app_config where key = 'account_extra_real_runs_per_month'), 15);
  select count(*)::integer into v_device_used from public.run_claims
    where device_id = p_device_id and month = v_month and pool = 'device';
  if not v_anon then
    select count(*)::integer into v_account_used from public.run_claims
      where user_id = v_uid and month = v_month and pool = 'account';
  end if;
  if v_plan.real_runs_unlimited or coalesce((v_override ->> 'real_runs_unlimited')::boolean, false)
    then v_left := null;
  else v_left := greatest(0, v_device_limit - v_device_used) +
    case when v_anon then 0 else greatest(0, v_account_limit - v_account_used) end;
  end if;
  return jsonb_build_object('ok', true, 'month', v_month,
    'resets_at', ((date_trunc('month', now() at time zone 'UTC') + interval '1 month') at time zone 'UTC'),
    'device', jsonb_build_object('used', v_device_used, 'limit', v_device_limit),
    'account', case when v_anon then null else jsonb_build_object('used', v_account_used, 'limit', v_account_limit) end,
    'plan', jsonb_build_object('id', v_plan.id, 'name', v_plan.name,
      'unlimited', v_plan.real_runs_unlimited or coalesce((v_override ->> 'real_runs_unlimited')::boolean, false)),
    'runs_left', v_left, 'is_anonymous', v_anon);
end;
$$;
--> statement-breakpoint
revoke all on function public.get_allowance(uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.get_allowance(uuid) to authenticated;
--> statement-breakpoint

-- Lock the account first, then the PC, so two PCs cannot overspend one account pool.
-- The advisory locks are scoped to this transaction and do not persist after failure.
create or replace function public.claim_run(p_device_id uuid, p_sections smallint[])
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid(); v_allowance jsonb; v_pool public.run_pool;
  v_id uuid; v_anon boolean;
begin
  if p_device_id is null or p_sections is null or cardinality(p_sections) not between 1 and 64
     or array_position(p_sections, null) is not null
     or not (0 <= all(p_sections) and 99 >= all(p_sections)) then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  if v_uid is null then raise exception 'unauthenticated' using errcode = 'PT401'; end if;
  v_anon := private.is_anon();
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('account:' || v_uid::text, 0));
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('device:' || p_device_id::text, 0));
  v_allowance := public.get_allowance(p_device_id);
  if (v_allowance #>> '{plan,unlimited}')::boolean then v_pool := 'plan';
  elsif (v_allowance #>> '{device,used}')::integer < (v_allowance #>> '{device,limit}')::integer
    then v_pool := 'device';
  elsif not v_anon and (v_allowance #>> '{account,used}')::integer < (v_allowance #>> '{account,limit}')::integer
    then v_pool := 'account';
  else
    return jsonb_build_object('ok', false, 'reason', 'limit_reached', 'allowance', v_allowance);
  end if;
  insert into public.run_claims (device_id, user_id, month, pool, sections)
    values (p_device_id, v_uid, v_allowance ->> 'month', v_pool, p_sections)
    returning id into v_id;
  return jsonb_build_object('ok', true, 'claim_id', v_id, 'pool', v_pool,
    'allowance', public.get_allowance(p_device_id));
end;
$$;
--> statement-breakpoint
revoke all on function public.claim_run(uuid, smallint[]) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.claim_run(uuid, smallint[]) to authenticated;
--> statement-breakpoint

-- A one-time transfer of a random install id between anonymous and Google sessions.
create or replace function public.device_handoff_begin(p_device_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_code text;
begin
  if p_device_id is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  if v_uid is null then raise exception 'unauthenticated' using errcode = 'PT401'; end if;
  v_code := replace(pg_catalog.gen_random_uuid()::text, '-', '');
  update public.devices set handoff_code_hash = pg_catalog.encode(pg_catalog.sha256(
    pg_catalog.convert_to(v_code, 'UTF8')), 'hex'),
    handoff_expires_at = now() + interval '15 minutes'
    where id = p_device_id and user_id = v_uid;
  if not found then raise exception 'device_owned' using errcode = 'PT403'; end if;
  return jsonb_build_object('device_id', p_device_id, 'code', v_code, 'expires_in_seconds', 900);
end;
$$;
--> statement-breakpoint
revoke all on function public.device_handoff_begin(uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.device_handoff_begin(uuid) to authenticated;
--> statement-breakpoint

create or replace function public.device_handoff_complete(p_device_id uuid, p_code text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_previous uuid;
begin
  if p_device_id is null or p_code is null or p_code !~ '^[0-9a-f]{32}$' then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  if v_uid is null then raise exception 'unauthenticated' using errcode = 'PT401'; end if;
  update public.devices set user_id = v_uid, handoff_code_hash = null,
    handoff_expires_at = null, last_seen_at = now()
    where id = p_device_id and handoff_code_hash = pg_catalog.encode(
      pg_catalog.sha256(pg_catalog.convert_to(p_code, 'UTF8')), 'hex')
      and handoff_expires_at > now()
    returning user_id into v_previous;
  if not found then raise exception 'handoff_invalid' using errcode = 'PT403'; end if;
  insert into public.admin_audit (actor, action, subject_table, subject_id, before, after)
    values (null, 'device.handoff', 'devices', p_device_id, null,
      jsonb_build_object('transferred_at', now()));
  return jsonb_build_object('device_id', p_device_id);
end;
$$;
--> statement-breakpoint
revoke all on function public.device_handoff_complete(uuid, text) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.device_handoff_complete(uuid, text) to authenticated;
