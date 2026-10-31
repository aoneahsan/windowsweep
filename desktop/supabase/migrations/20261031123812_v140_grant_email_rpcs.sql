-- One grant has one at-most-once mail attempt. A stale or uncertain claim
-- requires a human decision; it is never recycled automatically.
create function public.grant_email_claim(p_grant uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_claim record;
begin
  if p_grant is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.plan_grants g set email_claimed_at = now(),
    email_claim_token = gen_random_uuid()
    from public.profiles pr, public.plans p
    where g.id = p_grant and g.source = 'admin' and g.revoked_at is null
      and g.email_claimed_at is null and g.email_uncertain_at is null
      and g.email_sent_at is null and pr.user_id = g.user_id
      and pr.email is not null and pr.email <> '' and p.id = g.plan_id
    returning g.id, g.email_claim_token, pr.email, p.name as plan_name,
      g.seats, g.ends_at into v_claim;
  if not found then return null; end if;
  return jsonb_build_object('id', v_claim.id, 'claim_token', v_claim.email_claim_token,
    'email', v_claim.email, 'plan_name', v_claim.plan_name,
    'seats', v_claim.seats, 'ends_at', v_claim.ends_at);
end;
$$;
--> statement-breakpoint
revoke all on function public.grant_email_claim(uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.grant_email_claim(uuid) to service_role;
--> statement-breakpoint

create function public.grant_email_mark_sent(p_grant uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_grant is null or p_token is null then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.plan_grants set email_sent_at = now(), email_claimed_at = null,
    email_claim_token = null where id = p_grant and email_claim_token = p_token
      and email_claimed_at is not null and email_uncertain_at is null
      and email_sent_at is null;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.grant_email_mark_sent(uuid, uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.grant_email_mark_sent(uuid, uuid) to service_role;
--> statement-breakpoint

create function public.grant_email_release_claim(p_grant uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_grant is null or p_token is null then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.plan_grants set email_claimed_at = null, email_claim_token = null
    where id = p_grant and email_claim_token = p_token and email_claimed_at is not null
      and email_uncertain_at is null and email_sent_at is null;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.grant_email_release_claim(uuid, uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.grant_email_release_claim(uuid, uuid) to service_role;
--> statement-breakpoint

create function public.grant_email_mark_uncertain(p_grant uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_grant is null or p_token is null then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.plan_grants set email_uncertain_at = now()
    where id = p_grant and email_claim_token = p_token and email_claimed_at is not null
      and email_uncertain_at is null and email_sent_at is null;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.grant_email_mark_uncertain(uuid, uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.grant_email_mark_uncertain(uuid, uuid) to service_role;
--> statement-breakpoint

create function public.admin_grant_email_list(p_limit integer default 20,
  p_page integer default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_total integer; v_items jsonb;
begin
  if p_limit is null or p_limit not between 1 and 50 or p_page is null
    or p_page not between 0 and 1000 then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.require_admin();
  select count(*)::integer into v_total from public.plan_grants g
    where g.source = 'admin' and g.revoked_at is null and g.email_sent_at is null
      and (g.email_claimed_at is null or g.email_uncertain_at is not null
        or g.email_claimed_at <= now() - interval '10 minutes');
  select coalesce(jsonb_agg(to_jsonb(x) order by x.review_at desc, x.id desc), '[]'::jsonb)
    into v_items from (select g.id, pr.email, p.name as plan_name, g.seats,
      g.ends_at, coalesce(g.email_uncertain_at, g.email_claimed_at, g.created_at) as review_at,
      case when g.email_uncertain_at is not null then 'uncertain'
        when g.email_claimed_at is not null then 'claimed' else 'pending' end as state
      from public.plan_grants g
      left join public.profiles pr on pr.user_id = g.user_id
      join public.plans p on p.id = g.plan_id
      where g.source = 'admin' and g.revoked_at is null and g.email_sent_at is null
        and (g.email_claimed_at is null or g.email_uncertain_at is not null
          or g.email_claimed_at <= now() - interval '10 minutes')
      order by review_at desc, g.id desc limit p_limit offset p_limit * p_page) x;
  return jsonb_build_object('kind', 'grant', 'items', v_items, 'page', p_page,
    'limit', p_limit, 'total', v_total,
    'next_page', case when (p_page + 1) * p_limit < v_total then p_page + 1 else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_grant_email_list(integer, integer) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_grant_email_list(integer, integer) to authenticated;
--> statement-breakpoint

create function public.admin_grant_email_reconcile(p_grant uuid,
  p_outcome text, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid;
begin
  if p_grant is null or p_outcome is null or p_outcome not in ('sent', 'retry') then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  update public.plan_grants set email_uncertain_at = null,
    email_claimed_at = null, email_claim_token = null,
    email_sent_at = case when p_outcome = 'sent' then now() else email_sent_at end
    where id = p_grant and source = 'admin' and revoked_at is null
      and email_sent_at is null and (email_uncertain_at is not null
        or email_claimed_at <= now() - interval '10 minutes');
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  insert into public.admin_audit (actor, action, subject_table, subject_id, after)
    values (v_admin, 'email.reconcile', 'plan_grants', p_grant::text,
      jsonb_build_object('kind', 'grant', 'outcome', p_outcome, 'reason', p_reason));
  return jsonb_build_object('kind', 'grant', 'id', p_grant, 'outcome', p_outcome);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_grant_email_reconcile(uuid, text, text) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_grant_email_reconcile(uuid, text, text) to authenticated;
--> statement-breakpoint

create function public.admin_grant_email_send_request(p_grant uuid, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid;
begin
  if p_grant is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  perform 1 from public.plan_grants where id = p_grant and source = 'admin'
    and revoked_at is null and email_claimed_at is null
    and email_uncertain_at is null and email_sent_at is null for update;
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  insert into public.admin_audit (actor, action, subject_table, subject_id, after)
    values (v_admin, 'email.grant_send', 'plan_grants', p_grant::text,
      jsonb_build_object('reason', p_reason));
  return jsonb_build_object('id', p_grant);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_grant_email_send_request(uuid, text) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_grant_email_send_request(uuid, text) to authenticated;
