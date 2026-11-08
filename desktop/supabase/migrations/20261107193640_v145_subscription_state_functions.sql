-- ISSUE-003: a cancellation made in Polar's customer portal reaches the account.
--
-- polar-webhook forwards subscription.canceled, subscription.uncanceled and
-- subscription.revoked here, with the subscription's own state from the payload. The
-- newest state by Polar's modified_at wins; an older or repeated delivery is recorded
-- and changes nothing. my_plan() then says whether a paid plan renews, and both
-- clients choose "renewing on" or "until" from that alone.

-- The state table has no client privilege at all: only the definer functions below
-- read or write it (the same rule as every billing table, `billing.ts`).
revoke all on table public.billing_subscription_states from public, anon, authenticated, service_role;
--> statement-breakpoint

-- One meaning of "renews", shared by the webhook's write and my_plan()'s read. A
-- subscription renews while Polar still means to charge it: active, trialing or past
-- due (Polar retries a failed payment), with no cancellation at the period's end, and
-- not ended.
create or replace function private.subscription_renews(p_status text,
  p_cancel_at_period_end boolean, p_ended_at timestamptz)
returns boolean language sql immutable set search_path = '' as $$
  select p_status in ('active', 'trialing', 'past_due')
    and not coalesce(p_cancel_at_period_end, false) and p_ended_at is null;
$$;
--> statement-breakpoint
revoke all on function private.subscription_renews(text, boolean, timestamptz)
  from public, anon, authenticated, service_role;
--> statement-breakpoint

create or replace function public.billing_record_subscription_state(p_event_id text,
  p_event_type text, p_subscription_id text, p_status text, p_cancel_at_period_end boolean,
  p_canceled_at timestamptz, p_ended_at timestamptz, p_modified_at timestamptz)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_rows integer; v_renews boolean; v_periods integer := 0;
begin
  if p_event_id is null or length(p_event_id) not between 1 and 200
     or p_event_type is null or p_event_type not in
       ('subscription.canceled', 'subscription.uncanceled', 'subscription.revoked')
     or p_subscription_id is null or length(p_subscription_id) not between 1 and 200
     or p_status is null or length(p_status) not between 1 and 40
     or p_cancel_at_period_end is null or p_modified_at is null then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  insert into public.webhook_events (id, type, polar_subscription_id)
    values (p_event_id, p_event_type, p_subscription_id)
    on conflict (id) do nothing;
  if not found then return jsonb_build_object('result', 'duplicate'); end if;
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('subscription:' || p_subscription_id, 0));
  insert into public.billing_subscription_states as st (polar_subscription_id, status,
      cancel_at_period_end, canceled_at, ended_at, modified_at)
    values (p_subscription_id, p_status, p_cancel_at_period_end, p_canceled_at, p_ended_at,
      p_modified_at)
    on conflict (polar_subscription_id) do update set status = excluded.status,
      cancel_at_period_end = excluded.cancel_at_period_end,
      canceled_at = excluded.canceled_at, ended_at = excluded.ended_at,
      modified_at = excluded.modified_at, updated_at = now()
      where st.modified_at < excluded.modified_at;
  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    update public.webhook_events set processed_at = now(), result = 'stale' where id = p_event_id;
    return jsonb_build_object('result', 'stale');
  end if;
  -- The paid periods follow, so the account-deletion path (my_active_polar_subscription_ids)
  -- and the admin view read the same answer as my_plan(). Each changed row broadcasts
  -- plans:<user> through subscriptions_broadcast_plan, and both clients re-read.
  v_renews := private.subscription_renews(p_status, p_cancel_at_period_end, p_ended_at);
  if v_renews then
    update public.subscriptions set cancelled_at = null
      where polar_subscription_id = p_subscription_id and status = 'active'
        and period_end > now() and cancelled_at is not null;
  else
    update public.subscriptions set cancelled_at = coalesce(p_canceled_at, now())
      where polar_subscription_id = p_subscription_id and status = 'active'
        and period_end > now() and cancelled_at is null;
  end if;
  get diagnostics v_periods = row_count;
  update public.webhook_events set processed_at = now(),
      result = case when v_renews then 'renews' else 'ends' end
    where id = p_event_id;
  return jsonb_build_object('result', case when v_renews then 'renews' else 'ends' end,
    'periods', v_periods);
end;
$$;
--> statement-breakpoint
revoke all on function public.billing_record_subscription_state(text, text, text, text, boolean,
  timestamptz, timestamptz, timestamptz) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.billing_record_subscription_state(text, text, text, text,
  boolean, timestamptz, timestamptz, timestamptz) to service_role;
--> statement-breakpoint

-- my_plan(), as in 20261031082153_v140_core_functions.sql, plus `renews`.
create or replace function public.my_plan()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid(); v_anon boolean; v_plan record;
  v_plan_id text; v_source text; v_ends timestamptz;
  v_next_id text; v_next_end timestamptz;
  v_team jsonb; v_request jsonb; v_upcoming jsonb; v_downgrade jsonb;
  v_renews boolean;
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
  -- ISSUE-003: a paid plan renews only when the period that ends the stretch is an
  -- active Polar subscription that nobody has cancelled - not here (account deletion)
  -- and not in Polar (the newest subscription state the webhook recorded). A stretch
  -- that ends on a grant does not renew either. Null for every other source.
  if v_source = 'payment' then
    select (s.polar_subscription_id is not null and s.cancelled_at is null
        and coalesce(private.subscription_renews(st.status, st.cancel_at_period_end,
          st.ended_at), true))
      into v_renews
      from public.subscriptions s
      left join public.billing_subscription_states st
        on st.polar_subscription_id = s.polar_subscription_id
      where s.user_id = v_uid and s.plan_id = v_plan.id and s.status = 'active'
        and s.returned_at is null and s.period_end = v_ends
      order by (s.cancelled_at is null) desc, s.created_at desc limit 1;
    v_renews := coalesce(v_renews, false);
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
    'source', coalesce(v_source, 'free'), 'ends_at', v_ends, 'renews', v_renews,
    'downgrades_to', v_downgrade, 'upcoming', coalesce(v_upcoming, '[]'::jsonb),
    'limits_override', (select p.limits_override from public.profiles p where p.user_id = v_uid),
    'team', v_team, 'pending_request', v_request);
end;
$$;
--> statement-breakpoint
revoke all on function public.my_plan() from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.my_plan() to authenticated;
