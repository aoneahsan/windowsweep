-- Custom SQL migration file, put your code below! --
-- The quote is computed from the plan row and stored before opening checkout.
create or replace function public.billing_quote(p_plan_id text, p_interval text, p_seats integer default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid; v_plan record; v_seats integer; v_unit integer;
begin
  if p_plan_id is null or p_interval not in ('month', 'year') or
     (p_seats is not null and p_seats < 1) then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_uid := private.require_account();
  select * into v_plan from public.plans where id = p_plan_id and is_active;
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  if v_plan.rank = 0 or (case when p_interval = 'month' then v_plan.price_month_cents
    else v_plan.price_year_cents end) <= 0 then
    raise exception 'not_purchasable' using errcode = 'PT422';
  end if;
  if exists (select 1 from public.team_members where user_id = v_uid) then
    raise exception 'already_in_team' using errcode = 'PT409';
  end if;
  v_seats := case when v_plan.per_seat then coalesce(p_seats, v_plan.min_seats) else 1 end;
  if v_seats < v_plan.min_seats or (not v_plan.per_seat and p_seats is not null and p_seats <> 1) then
    raise exception 'seats_below_minimum' using errcode = 'PT422';
  end if;
  v_unit := case when p_interval = 'month' then v_plan.price_month_cents else v_plan.price_year_cents end;
  return jsonb_build_object('plan_id', v_plan.id, 'plan_name', v_plan.name,
    'interval', p_interval, 'seats', v_seats, 'unit_cents', v_unit,
    'amount_cents', v_unit * v_seats, 'currency', 'usd');
end;
$$;
--> statement-breakpoint
revoke all on function public.billing_quote(text, text, integer) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.billing_quote(text, text, integer) to authenticated;
--> statement-breakpoint

-- Only polar-checkout may record the Polar checkout id, after the hosted checkout exists.
-- The caller's UUID is the already authenticated JWT subject passed by the Edge Function.
create or replace function public.billing_record_quote(p_checkout_id text, p_user uuid,
  p_plan_id text, p_interval text, p_seats integer, p_unit integer, p_amount integer)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_checkout_id is null or length(p_checkout_id) not between 1 and 200 or p_user is null
     or p_plan_id is null or p_interval not in ('month', 'year') or p_seats not between 1 and 1000
     or p_unit <= 0 or p_amount <> p_unit * p_seats then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  if not exists (select 1 from auth.users where id = p_user) then
    raise exception 'not_found' using errcode = 'PT404';
  end if;
  insert into public.checkout_quotes (polar_checkout_id, user_id, plan_id, interval,
    seats, unit_cents, amount_cents, currency)
    values (p_checkout_id, p_user, p_plan_id, p_interval::public.billing_interval,
      p_seats, p_unit, p_amount, 'usd')
    on conflict (polar_checkout_id) do nothing;
end;
$$;
--> statement-breakpoint
revoke all on function public.billing_record_quote(text, uuid, text, text, integer, integer, integer)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.billing_record_quote(text, uuid, text, text, integer, integer, integer)
  to service_role;
--> statement-breakpoint

-- One paid order gives one paid period. The first order is priced from its checkout
-- quote; renewals use the first period's paid amount even after an admin price edit.
create or replace function public.billing_record_paid(p_event_id text, p_order_id text,
  p_checkout_id text, p_subscription_id text, p_customer_id text,
  p_amount integer, p_currency text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_first record; v_quote record; v_start timestamptz; v_end timestamptz;
  v_user uuid; v_plan text; v_interval public.billing_interval; v_seats integer;
  v_expected integer; v_new_id uuid; v_checkout_id text; v_is_renewal boolean := false;
begin
  if p_event_id is null or length(p_event_id) not between 1 and 200
     or p_order_id is null or p_amount is null or p_amount < 0
     or p_currency is null or p_currency !~ '^[a-z]{3}$' then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  insert into public.webhook_events (id, type, order_id, checkout_id, polar_subscription_id)
    values (p_event_id, 'order.paid', p_order_id, p_checkout_id, p_subscription_id)
    on conflict (id) do nothing;
  if not found then return jsonb_build_object('result', 'duplicate'); end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('order:' || p_order_id, 0));
  if exists (select 1 from public.webhook_events where type = 'order.refunded' and order_id = p_order_id)
     or exists (select 1 from public.subscriptions where polar_order_id = p_order_id and returned_at is not null)
    then update public.webhook_events set processed_at = now(), result = 'returned'
      where id = p_event_id;
    return jsonb_build_object('result', 'returned');
  end if;
  if exists (select 1 from public.subscriptions where polar_order_id = p_order_id) then
    update public.webhook_events set processed_at = now(), result = 'duplicate_order' where id = p_event_id;
    return jsonb_build_object('result', 'duplicate_order');
  end if;
  if p_subscription_id is not null then
    select * into v_first from public.subscriptions
      where polar_subscription_id = p_subscription_id order by created_at, id limit 1;
    v_is_renewal := found;
  end if;
  if v_is_renewal then
    v_user := v_first.user_id; v_plan := v_first.plan_id; v_interval := v_first.interval;
    v_seats := v_first.seats; v_expected := v_first.amount_cents;
  else
    select * into v_quote from public.checkout_quotes where polar_checkout_id = p_checkout_id for update;
    if not found then
      update public.webhook_events set processed_at = now(), result = 'unknown_checkout' where id = p_event_id;
      return jsonb_build_object('result', 'unknown_checkout');
    end if;
    if v_quote.used_order_id is not null then
      update public.webhook_events set processed_at = now(), result = 'unknown_checkout' where id = p_event_id;
      return jsonb_build_object('result', 'unknown_checkout');
    end if;
    v_user := v_quote.user_id; v_plan := v_quote.plan_id; v_interval := v_quote.interval;
    v_seats := v_quote.seats; v_expected := v_quote.amount_cents;
    v_checkout_id := v_quote.polar_checkout_id;
  end if;
  if p_amount <> v_expected or p_currency <> 'usd' then
    insert into public.admin_audit (actor, action, subject_table, subject_id, after)
      values (null, 'billing.mismatch', 'webhook_events', p_event_id,
        jsonb_build_object('order_id', p_order_id, 'expected_cents', v_expected, 'paid_cents', p_amount));
    update public.webhook_events set processed_at = now(), result = 'mismatch' where id = p_event_id;
    return jsonb_build_object('result', 'mismatch');
  end if;
  if not exists (select 1 from auth.users where id = v_user) then
    insert into public.admin_audit (actor, action, subject_table, subject_id, after)
      values (null, 'billing.unknown_user', 'webhook_events', p_event_id,
        jsonb_build_object('order_id', p_order_id));
    update public.webhook_events set processed_at = now(), result = 'unknown_user' where id = p_event_id;
    return jsonb_build_object('result', 'unknown_user');
  end if;
  if exists (select 1 from public.plans where id = v_plan and fleet_reports)
     and exists (select 1 from public.team_members tm join public.teams t on t.id = tm.team_id
       where tm.user_id = v_user and t.owner_id <> v_user) then
    insert into public.admin_audit (actor, action, subject_table, subject_id, after)
      values (null, 'billing.team_conflict', 'webhook_events', p_event_id,
        jsonb_build_object('order_id', p_order_id));
    update public.webhook_events set processed_at = now(), result = 'team_conflict' where id = p_event_id;
    return jsonb_build_object('result', 'team_conflict');
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('billing:' || v_user::text, 0));
  select greatest(now(), coalesce(max(period_end), now())) into v_start from public.subscriptions
    where user_id = v_user and plan_id = v_plan and status = 'active' and returned_at is null
      and period_end > now();
  v_end := v_start + case when v_interval = 'month' then interval '1 month' else interval '1 year' end;
  insert into public.subscriptions (user_id, plan_id, interval, seats, status,
    period_start, period_end, amount_cents, currency, polar_order_id,
    polar_subscription_id, polar_customer_id)
    values (v_user, v_plan, v_interval, v_seats, 'active', v_start, v_end,
      p_amount, p_currency, p_order_id, p_subscription_id, p_customer_id)
    returning id into v_new_id;
  if exists (select 1 from public.plans where id = v_plan and fleet_reports) then
    update public.subscriptions set team_id = private.ensure_owned_team(v_user)
      where id = v_new_id;
  end if;
  if v_checkout_id is not null then
    update public.checkout_quotes set used_order_id = p_order_id
      where polar_checkout_id = v_checkout_id;
  end if;
  insert into public.admin_audit (actor, action, subject_table, subject_id, after)
    values (null, 'billing.paid', 'subscriptions', v_new_id::text,
      jsonb_build_object('plan_id', v_plan, 'period_end', v_end, 'seats', v_seats));
  update public.webhook_events set processed_at = now(), result = 'paid' where id = p_event_id;
  insert into public.billing_email_deliveries (event_id, template)
    values (p_event_id, 'windowsweep-plan-confirmed') on conflict do nothing;
  return jsonb_build_object('result', 'paid', 'user_id', v_user,
    'subscription_id', v_new_id, 'plan_id', v_plan, 'period_end', v_end);
end;
$$;
--> statement-breakpoint
revoke all on function public.billing_record_paid(text, text, text, text, text, integer, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.billing_record_paid(text, text, text, text, text, integer, text)
  to service_role;
--> statement-breakpoint

create or replace function public.billing_record_returned(p_event_id text, p_order_id text,
  p_returned_cents integer, p_checkout_id text, p_subscription_id text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if p_event_id is null or length(p_event_id) not between 1 and 200
     or p_order_id is null or p_returned_cents is null or p_returned_cents < 0 then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  insert into public.webhook_events (id, type, order_id, checkout_id,
    polar_subscription_id, returned_cents)
    values (p_event_id, 'order.refunded', p_order_id, p_checkout_id,
      p_subscription_id, p_returned_cents)
    on conflict (id) do nothing;
  if not found then return jsonb_build_object('result', 'duplicate'); end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('order:' || p_order_id, 0));
  update public.subscriptions set status = 'returned', returned_at = now(),
    returned_cents = p_returned_cents,
    period_end = greatest(period_start + interval '1 microsecond', now())
    where polar_order_id = p_order_id and returned_at is null returning id into v_id;
  if v_id is not null then
    insert into public.admin_audit (actor, action, subject_table, subject_id, after)
      values (null, 'billing.returned', 'subscriptions', v_id::text,
        jsonb_build_object('order_id', p_order_id, 'returned_cents', p_returned_cents));
  end if;
  insert into public.billing_email_deliveries (event_id, template)
    values (p_event_id, 'windowsweep-payment-returned') on conflict do nothing;
  update public.webhook_events set processed_at = now(), result = 'returned' where id = p_event_id;
  return jsonb_build_object('result', 'returned', 'subscription_id', v_id);
end;
$$;
--> statement-breakpoint
revoke all on function public.billing_record_returned(text, text, integer, text, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.billing_record_returned(text, text, integer, text, text) to service_role;
--> statement-breakpoint

-- The delete-account Edge Function reads these under the caller's JWT, cancels each
-- one with Polar, then marks only successfully cancelled ids through the server key.
create or replace function public.my_active_polar_subscription_ids(p_limit integer default 20)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid;
begin
  if p_limit is null or p_limit not between 1 and 50 then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  v_uid := private.require_account();
  -- Delete-account repeatedly reads page one AFTER each successful cancellation
  -- marks its id, so mutations cannot skip a later id.
  return jsonb_build_object('items', (select coalesce(jsonb_agg(x.polar_subscription_id
      order by x.polar_subscription_id), '[]'::jsonb) from (
    select distinct s.polar_subscription_id from public.subscriptions s
      where s.user_id = v_uid and s.polar_subscription_id is not null
        and s.cancelled_at is null and s.status = 'active' and s.period_end > now()
      order by s.polar_subscription_id limit p_limit) x));
end;
$$;
--> statement-breakpoint
revoke all on function public.my_active_polar_subscription_ids(integer) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.my_active_polar_subscription_ids(integer) to authenticated;
--> statement-breakpoint

create or replace function public.billing_mark_cancelled(p_user uuid, p_subscription_id text)
returns integer language plpgsql security definer set search_path = '' as $$
declare v_count integer;
begin
  if p_user is null or p_subscription_id is null or length(p_subscription_id) not between 1 and 200 then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  update public.subscriptions set cancelled_at = coalesce(cancelled_at, now())
    where user_id = p_user and polar_subscription_id = p_subscription_id
      and status = 'active' and period_end > now();
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;
--> statement-breakpoint
revoke all on function public.billing_mark_cancelled(uuid, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.billing_mark_cancelled(uuid, text) to service_role;
--> statement-breakpoint

-- Direct RPC deletion cannot bypass cancellation. Account-owned rows cascade;
-- run_claims.user_id is SET NULL so the anonymous monthly counts remain.
create or replace function public.delete_my_account()
returns void language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'unauthenticated' using errcode = 'PT401'; end if;
  if exists (select 1 from public.subscriptions s where s.user_id = v_uid
      and s.status = 'active' and s.period_end > now()
      and s.polar_subscription_id is not null and s.cancelled_at is null) then
    raise exception 'subscription_active' using errcode = 'PT409';
  end if;
  delete from auth.users where id = v_uid;
end;
$$;
--> statement-breakpoint
revoke all on function public.delete_my_account() from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.delete_my_account() to authenticated;
--> statement-breakpoint

-- A processed billing event owns a separately claimable mail delivery.
create or replace function public.billing_email_claim(p_event_id text, p_template text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_delivery record; v_sub record; v_token uuid; v_now_plan text;
begin
  if p_event_id is null or length(p_event_id) not between 1 and 200 or
     p_template is null or p_template not in
       ('windowsweep-plan-confirmed', 'windowsweep-payment-returned') then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  select * into v_delivery from public.billing_email_deliveries
    where event_id = p_event_id and template = p_template for update;
  if not found or v_delivery.sent_at is not null or v_delivery.uncertain_at is not null
     or v_delivery.claimed_at is not null or v_delivery.recipient_missing_at is not null
     or v_delivery.unavailable_at is not null then return null; end if;
  select x.*, p.name as plan_name, pr.email, e.returned_cents as event_returned_cents
    into v_sub from public.webhook_events e
    join lateral (
      select 1 as priority, s.user_id, s.plan_id, s.interval, s.seats,
        s.amount_cents, s.currency, s.period_start, s.period_end, s.created_at
        from public.subscriptions s where s.polar_order_id = e.order_id
      union all
      select 2, s.user_id, s.plan_id, s.interval, s.seats,
        s.amount_cents, s.currency, s.period_start, s.period_end, s.created_at
        from public.subscriptions s where e.polar_subscription_id is not null
          and s.polar_subscription_id = e.polar_subscription_id
      union all
      select 3, q.user_id, q.plan_id, q.interval, q.seats,
        q.amount_cents, q.currency, null::timestamptz, null::timestamptz, q.created_at
        from public.checkout_quotes q where e.checkout_id is not null
          and q.polar_checkout_id = e.checkout_id
    ) x on true
    join public.plans p on p.id = x.plan_id
    join public.profiles pr on pr.user_id = x.user_id and pr.email is not null
    where e.id = p_event_id order by x.priority, x.created_at desc limit 1;
  if not found then
    update public.billing_email_deliveries set recipient_missing_at = now()
      where event_id = p_event_id and template = p_template;
    return null;
  end if;
  select coalesce((select p.name from private.plan_for_user(v_sub.user_id) ep
      join public.plans p on p.id = ep.plan_id),
    (select name from public.plans where id = 'free'))
    into v_now_plan;
  v_token := pg_catalog.gen_random_uuid();
  update public.billing_email_deliveries set claimed_at = now(), claim_token = v_token
    where event_id = p_event_id and template = p_template;
  return jsonb_build_object('event_id', p_event_id, 'template', p_template,
    'claim_token', v_token, 'email', v_sub.email, 'plan_name', v_sub.plan_name,
    'plan_id', v_sub.plan_id, 'interval', v_sub.interval, 'amount_cents', v_sub.amount_cents,
    'returned_cents', v_sub.event_returned_cents, 'currency', v_sub.currency,
    'seats', v_sub.seats, 'period_start', v_sub.period_start,
    'period_end', v_sub.period_end, 'plan_now', v_now_plan);
end;
$$;
--> statement-breakpoint
revoke all on function public.billing_email_claim(text, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.billing_email_claim(text, text) to service_role;
--> statement-breakpoint

create or replace function public.billing_email_mark_sent(p_event_id text,
  p_template text, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_event_id is null or p_template is null or p_token is null then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.billing_email_deliveries set sent_at = now(), claimed_at = null,
    claim_token = null where event_id = p_event_id and template = p_template
      and claim_token = p_token and uncertain_at is null and sent_at is null;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.billing_email_mark_sent(text, text, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.billing_email_mark_sent(text, text, uuid) to service_role;
--> statement-breakpoint

create or replace function public.billing_email_release_claim(p_event_id text,
  p_template text, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_event_id is null or p_template is null or p_token is null then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.billing_email_deliveries set claimed_at = null, claim_token = null
    where event_id = p_event_id and template = p_template and claim_token = p_token
      and uncertain_at is null and sent_at is null;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.billing_email_release_claim(text, text, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.billing_email_release_claim(text, text, uuid) to service_role;
--> statement-breakpoint

create or replace function public.billing_email_mark_uncertain(p_event_id text,
  p_template text, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_event_id is null or p_template is null or p_token is null then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.billing_email_deliveries set uncertain_at = now(), claimed_at = null,
    claim_token = null where event_id = p_event_id and template = p_template
      and claim_token = p_token and sent_at is null;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.billing_email_mark_uncertain(text, text, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.billing_email_mark_uncertain(text, text, uuid) to service_role;
