-- Custom SQL migration file, put your code below! --
-- The multi-PC report is a bounded server aggregation of the person's run rows.
create or replace function public.my_machines_report(p_days integer default 30)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid; v_plan_id text; v_limit integer; v_since timestamptz;
  v_machines jsonb; v_other integer; v_unattributed jsonb; v_totals jsonb;
begin
  if p_days is null or p_days not between 1 and 365 then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_uid := private.require_account();
  select e.plan_id into v_plan_id from private.plan_for_user(v_uid, now()) e;
  select coalesce((pr.limits_override ->> 'report_machines')::integer, p.report_machines)
    into v_limit from public.plans p
    left join public.profiles pr on pr.user_id = v_uid
    where p.id = coalesce(v_plan_id, 'free');
  if coalesce(v_limit, 0) <= 0 then raise exception 'plan_required' using errcode = 'PT403'; end if;
  v_since := now() - make_interval(days => p_days);
  select coalesce(jsonb_agg(jsonb_build_object('device_id', x.id,
      'last_seen_at', x.last_seen_at, 'runs', x.runs, 'real_runs', x.real_runs,
      'freed_bytes', x.freed_bytes, 'estimated_bytes', x.estimated_bytes,
      'last_run_at', x.last_run_at) order by x.last_seen_at desc), '[]'::jsonb)
    into v_machines from (
      select d.id, d.last_seen_at,
        (select count(*) from public.runs r where r.user_id = v_uid and r.device_id = d.id
          and r.started_at >= v_since) as runs,
        (select count(*) from public.runs r where r.user_id = v_uid and r.device_id = d.id
          and r.started_at >= v_since and not r.dry_run
          and exists (select 1 from unnest(r.sections) s where s not in (0,24,25))) as real_runs,
        (select coalesce(sum(r.freed_bytes), 0) from public.runs r where r.user_id = v_uid
          and r.device_id = d.id and r.started_at >= v_since) as freed_bytes,
        (select coalesce(sum(r.estimated_bytes), 0) from public.runs r where r.user_id = v_uid
          and r.device_id = d.id and r.started_at >= v_since) as estimated_bytes,
        (select max(r.started_at) from public.runs r where r.user_id = v_uid
          and r.device_id = d.id and r.started_at >= v_since) as last_run_at
        from public.devices d where d.user_id = v_uid
        order by d.last_seen_at desc, d.id limit v_limit
    ) x;
  select greatest(0, count(*)::integer - v_limit) into v_other
    from public.devices where user_id = v_uid;
  select jsonb_build_object('runs', count(*),
      'real_runs', count(*) filter (where not dry_run
        and exists (select 1 from unnest(sections) s where s not in (0,24,25))),
      'freed_bytes', coalesce(sum(freed_bytes), 0),
      'estimated_bytes', coalesce(sum(estimated_bytes), 0)) into v_unattributed
    from public.runs where user_id = v_uid and device_id is null and started_at >= v_since;
  select jsonb_build_object('runs', count(*),
      'real_runs', count(*) filter (where not dry_run
        and exists (select 1 from unnest(sections) s where s not in (0,24,25))),
      'freed_bytes', coalesce(sum(freed_bytes), 0),
      'estimated_bytes', coalesce(sum(estimated_bytes), 0)) into v_totals
    from public.runs where user_id = v_uid and started_at >= v_since;
  return jsonb_build_object('days', p_days, 'since', v_since, 'machine_limit', v_limit,
    'machines', v_machines, 'other_machines', v_other,
    'unattributed', v_unattributed, 'totals', v_totals);
end;
$$;
--> statement-breakpoint
revoke all on function public.my_machines_report(integer) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.my_machines_report(integer) to authenticated;
--> statement-breakpoint

-- Opaque keyset cursor over (started_at, run_id); the desktop writes the CSV or
-- JSON file locally, and the server returns only run summary fields.
create or replace function public.export_my_history(p_cursor text default null, p_limit integer default 500)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid; v_plan_id text; v_allowed boolean; v_cursor jsonb;
  v_items jsonb; v_next text; v_count integer;
begin
  if p_limit is null or p_limit not between 1 and 500
     or (p_cursor is not null and length(p_cursor) > 300) then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  if p_cursor is not null then
    begin
      v_cursor := pg_catalog.convert_from(pg_catalog.decode(p_cursor, 'base64'), 'UTF8')::jsonb;
      if v_cursor ->> 't' is null or v_cursor ->> 'id' is null then
        raise exception 'invalid_request' using errcode = 'PT422';
      end if;
      perform (v_cursor ->> 't')::timestamptz;
    exception when others then
      raise exception 'invalid_request' using errcode = 'PT422';
    end;
  end if;
  v_uid := private.require_account();
  select e.plan_id into v_plan_id from private.plan_for_user(v_uid, now()) e;
  select history_export into v_allowed from public.plans where id = coalesce(v_plan_id, 'free');
  if not coalesce(v_allowed, false) then raise exception 'plan_required' using errcode = 'PT403'; end if;
  with page as (
    select r.run_id, r.started_at, r.mode, r.dry_run, r.elevated, r.sections,
      r.freed_bytes, r.estimated_bytes, r.duration_ms, r.device_id
      from public.runs r where r.user_id = v_uid
        and (v_cursor is null or (r.started_at, r.run_id) <
          ((v_cursor ->> 't')::timestamptz, v_cursor ->> 'id'))
      order by r.started_at desc, r.run_id desc limit p_limit
  ) select coalesce(jsonb_agg(to_jsonb(page) order by started_at desc, run_id desc), '[]'::jsonb),
      count(*)::integer into v_items, v_count from page;
  if v_count = p_limit then
    select pg_catalog.encode(pg_catalog.convert_to(jsonb_build_object('t', r.started_at,
      'id', r.run_id)::text, 'UTF8'), 'base64') into v_next
      from public.runs r where r.user_id = v_uid
        and (v_cursor is null or (r.started_at, r.run_id) <
          ((v_cursor ->> 't')::timestamptz, v_cursor ->> 'id'))
      order by r.started_at desc, r.run_id desc offset p_limit - 1 limit 1;
  end if;
  return jsonb_build_object('items', v_items, 'next_cursor', v_next);
end;
$$;
--> statement-breakpoint
revoke all on function public.export_my_history(text, integer) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.export_my_history(text, integer) to authenticated;
