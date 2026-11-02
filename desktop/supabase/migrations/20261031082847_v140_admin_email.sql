-- Admin reconciliation of uncertain transactional mail.
-- Unknown FilesHub outcomes require a human to inspect the mail job. Lists are
-- bounded and expose only the address needed for that reconciliation.
create or replace function public.admin_email_uncertain_list(p_kind text,
  p_limit integer default 20, p_page integer default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_total integer; v_items jsonb;
begin
  if p_kind is null or p_kind not in ('welcome', 'referral', 'team_invite', 'plan_request')
    or p_limit is null or p_limit not between 1 and 50
    or p_page is null or p_page not between 0 and 1000 then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.require_admin();
  if p_kind = 'welcome' then
    select count(*)::integer into v_total from public.profiles
      where welcome_uncertain_at is not null or welcome_claimed_at <= now() - interval '10 minutes';
    select coalesce(jsonb_agg(to_jsonb(x) order by x.review_at desc), '[]'::jsonb)
      into v_items from (select user_id as id, email,
        coalesce(welcome_uncertain_at, welcome_claimed_at) as review_at,
        case when welcome_uncertain_at is not null then 'uncertain' else 'claimed' end as state
        from public.profiles where welcome_uncertain_at is not null
          or welcome_claimed_at <= now() - interval '10 minutes'
        order by review_at desc, user_id desc limit p_limit offset p_limit * p_page) x;
  elsif p_kind = 'referral' then
    select count(*)::integer into v_total from public.referrals
      where notify_uncertain_at is not null or notify_claimed_at <= now() - interval '10 minutes';
    select coalesce(jsonb_agg(to_jsonb(x) order by x.review_at desc), '[]'::jsonb)
      into v_items from (select r.id, p.email,
        coalesce(r.notify_uncertain_at, r.notify_claimed_at) as review_at,
        case when r.notify_uncertain_at is not null then 'uncertain' else 'claimed' end as state
        from public.referrals r join public.profiles p on p.user_id = r.referrer_id
        where r.notify_uncertain_at is not null
          or r.notify_claimed_at <= now() - interval '10 minutes'
        order by review_at desc, r.id desc limit p_limit offset p_limit * p_page) x;
  elsif p_kind = 'team_invite' then
    select count(*)::integer into v_total from public.team_invites
      where send_uncertain_at is not null or send_claimed_at <= now() - interval '10 minutes';
    select coalesce(jsonb_agg(to_jsonb(x) order by x.review_at desc), '[]'::jsonb)
      into v_items from (select id, email,
        coalesce(send_uncertain_at, send_claimed_at) as review_at,
        case when send_uncertain_at is not null then 'uncertain' else 'claimed' end as state
        from public.team_invites where send_uncertain_at is not null
          or send_claimed_at <= now() - interval '10 minutes'
        order by review_at desc, id desc limit p_limit offset p_limit * p_page) x;
  else
    select count(*)::integer into v_total from public.plan_requests
      where notify_uncertain_at is not null or notify_claimed_at <= now() - interval '10 minutes';
    select coalesce(jsonb_agg(to_jsonb(x) order by x.review_at desc), '[]'::jsonb)
      into v_items from (select r.id, p.email,
        coalesce(r.notify_uncertain_at, r.notify_claimed_at) as review_at,
        case when r.notify_uncertain_at is not null then 'uncertain' else 'claimed' end as state
        from public.plan_requests r join public.profiles p on p.user_id = r.user_id
        where r.notify_uncertain_at is not null
          or r.notify_claimed_at <= now() - interval '10 minutes'
        order by review_at desc, r.id desc limit p_limit offset p_limit * p_page) x;
  end if;
  return jsonb_build_object('kind', p_kind, 'items', v_items, 'page', p_page,
    'limit', p_limit, 'total', v_total,
    'next_page', case when (p_page + 1) * p_limit < v_total then p_page + 1 else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_email_uncertain_list(text, integer, integer)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_email_uncertain_list(text, integer, integer) to authenticated;
--> statement-breakpoint

create or replace function public.admin_email_reconcile(p_kind text, p_id uuid,
  p_outcome text, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid;
begin
  if p_kind is null or p_kind not in ('welcome', 'referral', 'team_invite', 'plan_request')
    or p_id is null or p_outcome is null or p_outcome not in ('sent', 'retry') then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  if p_kind = 'welcome' then
    update public.profiles set welcome_uncertain_at = null,
      welcome_claimed_at = null, welcome_claim_token = null,
      welcome_sent_at = case when p_outcome = 'sent' then now() else welcome_sent_at end
      where user_id = p_id and (welcome_uncertain_at is not null
        or welcome_claimed_at <= now() - interval '10 minutes');
  elsif p_kind = 'referral' then
    update public.referrals set notify_uncertain_at = null,
      notify_claimed_at = null, notify_claim_token = null,
      notified_at = case when p_outcome = 'sent' then now() else notified_at end
      where id = p_id and (notify_uncertain_at is not null
        or notify_claimed_at <= now() - interval '10 minutes');
  elsif p_kind = 'team_invite' then
    update public.team_invites set send_uncertain_at = null,
      send_claimed_at = null, send_claim_token = null,
      last_sent_at = case when p_outcome = 'sent' then now() else last_sent_at end
      where id = p_id and (send_uncertain_at is not null
        or send_claimed_at <= now() - interval '10 minutes');
  else
    update public.plan_requests set notify_uncertain_at = null,
      notify_claimed_at = null, notify_claim_token = null,
      status = case when p_outcome = 'sent' then 'notified'::public.plan_request_status else status end,
      notified_at = case when p_outcome = 'sent' then now() else notified_at end
      where id = p_id and status = 'pending' and (notify_uncertain_at is not null
        or notify_claimed_at <= now() - interval '10 minutes');
  end if;
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  insert into public.admin_audit (actor, action, subject_table, subject_id, after)
    values (v_admin, 'email.reconcile', p_kind, p_id::text,
      jsonb_build_object('outcome', p_outcome, 'reason', p_reason));
  return jsonb_build_object('kind', p_kind, 'id', p_id, 'outcome', p_outcome);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_email_reconcile(text, uuid, text, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_email_reconcile(text, uuid, text, text) to authenticated;
--> statement-breakpoint

create or replace function public.admin_billing_email_list(p_limit integer default 20,
  p_page integer default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_total integer;
begin
  if p_limit is null or p_limit not between 1 and 50 or
     p_page is null or p_page not between 0 and 1000 then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.require_admin();
  select count(*)::integer into v_total from public.billing_email_deliveries;
  return jsonb_build_object('items', (select coalesce(jsonb_agg(to_jsonb(x)
    order by x.created_at desc), '[]'::jsonb) from (
      select d.event_id, d.template, d.created_at, d.claimed_at,
        d.uncertain_at, d.sent_at, d.recipient_missing_at, d.unavailable_at, pr.email,
        case when d.unavailable_at is not null then 'unavailable'
          when d.sent_at is not null then 'sent'
          when d.recipient_missing_at is not null then 'recipient_missing'
          when d.uncertain_at is not null then 'uncertain'
          when d.claimed_at is not null then 'claimed' else 'pending' end as state
        from public.billing_email_deliveries d
        left join public.webhook_events e on e.id = d.event_id
        left join lateral (
          select s.user_id, 1 as priority, s.created_at from public.subscriptions s
            where s.polar_order_id = e.order_id
          union all
          select s.user_id, 2, s.created_at from public.subscriptions s
            where e.polar_subscription_id is not null
              and s.polar_subscription_id = e.polar_subscription_id
          union all
          select q.user_id, 3, q.created_at from public.checkout_quotes q
            where e.checkout_id is not null and q.polar_checkout_id = e.checkout_id
          order by priority, created_at desc limit 1
        ) recipient on true
        left join public.profiles pr on pr.user_id = recipient.user_id
        order by d.created_at desc, d.event_id desc, d.template desc
        limit p_limit offset p_limit * p_page) x),
    'page', p_page, 'limit', p_limit, 'total', v_total,
    'next_page', case when (p_page + 1) * p_limit < v_total then p_page + 1 else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_billing_email_list(integer, integer)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_billing_email_list(integer, integer) to authenticated;
--> statement-breakpoint

create or replace function public.admin_billing_email_reconcile(p_event_id text,
  p_template text, p_outcome text, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid;
begin
  if p_event_id is null or length(p_event_id) not between 1 and 200
    or p_template is null or p_template not in
      ('windowsweep-plan-confirmed', 'windowsweep-payment-returned')
    or p_outcome is null or p_outcome not in ('sent', 'retry', 'unavailable') then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  update public.billing_email_deliveries set uncertain_at = null,
    claimed_at = null, claim_token = null,
    recipient_missing_at = case when p_outcome = 'retry' then null else recipient_missing_at end,
    unavailable_at = case when p_outcome = 'unavailable' then now() else unavailable_at end,
    sent_at = case when p_outcome = 'sent' then now() else sent_at end
    where event_id = p_event_id and template = p_template and sent_at is null
      and unavailable_at is null and (uncertain_at is not null
        or recipient_missing_at is not null or claimed_at <= now() - interval '10 minutes');
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  insert into public.admin_audit (actor, action, subject_table, subject_id, after)
    values (v_admin, 'billing.email_reconcile', 'billing_email_deliveries', p_event_id,
      jsonb_build_object('template', p_template, 'outcome', p_outcome, 'reason', p_reason));
  return jsonb_build_object('event_id', p_event_id, 'template', p_template,
    'outcome', p_outcome);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_billing_email_reconcile(text, text, text, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_billing_email_reconcile(text, text, text, text) to authenticated;
--> statement-breakpoint

create or replace function public.admin_billing_email_retry(p_event_id text,
  p_template text, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid;
begin
  if p_event_id is null or length(p_event_id) not between 1 and 200 or
     p_template is null or p_template not in
       ('windowsweep-plan-confirmed', 'windowsweep-payment-returned') then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  if not exists (select 1 from public.billing_email_deliveries
      where event_id = p_event_id and template = p_template and sent_at is null
        and claimed_at is null and uncertain_at is null) then
    raise exception 'not_ready' using errcode = 'PT409'; end if;
  insert into public.admin_audit (actor, action, subject_table, subject_id, after)
    values (v_admin, 'billing.email_retry', 'billing_email_deliveries', p_event_id,
      jsonb_build_object('template', p_template, 'reason', p_reason));
  return jsonb_build_object('event_id', p_event_id, 'template', p_template);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_billing_email_retry(text, text, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_billing_email_retry(text, text, text) to authenticated;
