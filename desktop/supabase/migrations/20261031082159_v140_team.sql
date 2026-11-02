-- Custom SQL migration file, put your code below! --
-- Entitled Team buyers and grantees own one team. Capacity is read from active
-- periods and grants every time, rather than copied into teams.seats.
create or replace function private.ensure_owned_team(p_owner uuid, p_name text default 'Team')
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_team uuid; v_seats integer;
begin
  if p_owner is null or p_name is null or char_length(trim(p_name)) not between 1 and 80 then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  select coalesce(max(seats), 0)::integer into v_seats from (
    select s.seats from public.subscriptions s join public.plans p on p.id = s.plan_id
      where s.user_id = p_owner and p.fleet_reports and s.status = 'active'
        and s.returned_at is null and s.period_start <= now() and s.period_end > now()
    union all
    select g.seats from public.plan_grants g join public.plans p on p.id = g.plan_id
      where g.user_id = p_owner and p.fleet_reports and g.revoked_at is null
        and g.starts_at <= now() and g.ends_at > now()
  ) entitlements;
  if v_seats = 0 then raise exception 'plan_required' using errcode = 'PT403'; end if;
  if exists (select 1 from public.team_members tm join public.teams t on t.id = tm.team_id
      where tm.user_id = p_owner and t.owner_id <> p_owner) then
    raise exception 'already_in_team' using errcode = 'PT409';
  end if;
  insert into public.teams (name, owner_id) values (trim(p_name), p_owner)
    on conflict (owner_id) do nothing returning id into v_team;
  if v_team is null then select id into v_team from public.teams where owner_id = p_owner; end if;
  insert into public.team_members (team_id, user_id, role)
    values (v_team, p_owner, 'owner') on conflict (team_id, user_id) do nothing;
  return v_team;
end;
$$;
--> statement-breakpoint
revoke all on function private.ensure_owned_team(uuid, text) from public, anon, authenticated, service_role;
--> statement-breakpoint

create or replace function public.team_create(p_name text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_uid uuid; v_team uuid;
begin
  if p_name is null or char_length(trim(p_name)) not between 1 and 80 then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_uid := private.require_account();
  v_team := private.ensure_owned_team(v_uid, p_name);
  update public.teams set name = trim(p_name) where id = v_team;
  return jsonb_build_object('team_id', v_team, 'name', trim(p_name),
    'seats', private.team_seats(v_team));
end;
$$;
--> statement-breakpoint
revoke all on function public.team_create(text) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.team_create(text) to authenticated;
--> statement-breakpoint

-- The Edge Function sends the mail, then calls team_invite_mark_sent() only on
-- success. An unsent invite can be retried without waiting 24 hours.
create or replace function public.team_invite_prepare(p_email text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_uid uuid; v_team uuid; v_id uuid; v_last timestamptz; v_expires timestamptz;
  v_capacity integer; v_used integer; v_email text; v_claimed timestamptz;
  v_uncertain timestamptz;
  v_token uuid;
begin
  if p_email is null or length(trim(p_email)) not between 3 and 254
     or position('@' in p_email) < 2 then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_uid := private.require_account();
  v_email := lower(trim(p_email));
  select id into v_team from public.teams where owner_id = v_uid;
  if v_team is null then raise exception 'not_team_owner' using errcode = 'PT403'; end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('team:' || v_team::text, 0));
  v_capacity := private.team_seats(v_team);
  if v_capacity = 0 then raise exception 'plan_required' using errcode = 'PT403'; end if;
  if exists (select 1 from public.team_members tm join public.profiles p on p.user_id = tm.user_id
      where tm.team_id = v_team and lower(p.email) = v_email) then
    raise exception 'already_member' using errcode = 'PT409';
  end if;
  select id, last_sent_at, expires_at, send_claimed_at, send_uncertain_at
    into v_id, v_last, v_expires, v_claimed, v_uncertain from public.team_invites
    where team_id = v_team and email = v_email and accepted_at is null for update;
  if v_id is null then
    select (select count(*) from public.team_members where team_id = v_team) +
      (select count(*) from public.team_invites where team_id = v_team
        and accepted_at is null and expires_at > now()) into v_used;
    if v_used >= v_capacity then raise exception 'no_seats' using errcode = 'PT409'; end if;
    insert into public.team_invites (team_id, email, invited_by)
      values (v_team, v_email, v_uid) returning id into v_id;
  else
    if v_expires <= now() then
      select (select count(*) from public.team_members where team_id = v_team) +
        (select count(*) from public.team_invites where team_id = v_team
          and accepted_at is null and expires_at > now()) into v_used;
      if v_used >= v_capacity then raise exception 'no_seats' using errcode = 'PT409'; end if;
      update public.team_invites set expires_at = now() + interval '14 days'
        where id = v_id;
    end if;
  end if;
  if v_uncertain is null and (v_last is null or v_last <= now() - interval '24 hours') and
     v_claimed is null then
    v_token := pg_catalog.gen_random_uuid();
    update public.team_invites set send_claimed_at = now(), send_claim_token = v_token
      where id = v_id;
  end if;
  return jsonb_build_object('invite_id', v_id, 'should_send', v_token is not null,
    'claim_token', v_token);
end;
$$;
--> statement-breakpoint
revoke all on function public.team_invite_prepare(text) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.team_invite_prepare(text) to authenticated;
--> statement-breakpoint

create or replace function public.team_invite_mark_sent(p_invite_id uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_invite_id is null or p_token is null then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.team_invites set last_sent_at = now(), send_claimed_at = null,
    send_claim_token = null where id = p_invite_id and send_claim_token = p_token
      and accepted_at is null and expires_at > now();
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.team_invite_mark_sent(uuid, uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.team_invite_mark_sent(uuid, uuid) to service_role;
--> statement-breakpoint

create or replace function public.team_invite_release_send(p_invite_id uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_invite_id is null or p_token is null then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.team_invites set send_claimed_at = null, send_claim_token = null
    where id = p_invite_id and send_claim_token = p_token;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.team_invite_release_send(uuid, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.team_invite_release_send(uuid, uuid) to service_role;
--> statement-breakpoint

create or replace function public.team_invite_mark_uncertain(p_invite_id uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_invite_id is null or p_token is null then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.team_invites set send_uncertain_at = now(), send_claimed_at = null,
    send_claim_token = null where id = p_invite_id and send_claim_token = p_token;
  return found;
end;
$$;
--> statement-breakpoint
revoke all on function public.team_invite_mark_uncertain(uuid, uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.team_invite_mark_uncertain(uuid, uuid) to service_role;
--> statement-breakpoint

create or replace function public.team_my_invites(p_limit integer default 20,
  p_page integer default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid; v_email text; v_total integer;
begin
  if p_limit is null or p_limit not between 1 and 50
     or p_page is null or p_page not between 0 and 1000 then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  v_uid := private.require_account();
  select lower(email) into v_email from auth.users
    where id = v_uid and email_confirmed_at is not null;
  if v_email is null then return jsonb_build_object('items', '[]'::jsonb,
    'page', p_page, 'limit', p_limit, 'next_page', null); end if;
  select count(*)::integer into v_total from public.team_invites
    where email = v_email and accepted_at is null and expires_at > now();
  return jsonb_build_object('items', (select coalesce(jsonb_agg(x.item
    order by x.created_at desc), '[]'::jsonb) from (
    select i.created_at, jsonb_build_object('invite_id', i.id, 'team_name', t.name,
      'invited_by', p.email, 'expires_at', i.expires_at) as item
      from public.team_invites i join public.teams t on t.id = i.team_id
      left join public.profiles p on p.user_id = i.invited_by
      where i.email = v_email and i.accepted_at is null and i.expires_at > now()
      order by i.created_at desc, i.id desc limit p_limit offset p_limit * p_page) x),
    'page', p_page, 'limit', p_limit,
    'next_page', case when (p_page + 1) * p_limit < v_total then p_page + 1 else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.team_my_invites(integer, integer) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.team_my_invites(integer, integer) to authenticated;
--> statement-breakpoint

create or replace function public.team_accept(p_invite_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_uid uuid; v_email text; v_invite record; v_capacity integer; v_members integer;
begin
  if p_invite_id is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  v_uid := private.require_account();
  select lower(email) into v_email from auth.users
    where id = v_uid and email_confirmed_at is not null;
  if v_email is null then raise exception 'invite_email_mismatch' using errcode = 'PT403'; end if;
  select * into v_invite from public.team_invites where id = p_invite_id for update;
  if not found then raise exception 'invite_not_found' using errcode = 'PT404'; end if;
  if v_invite.accepted_at is not null or v_invite.expires_at <= now() then
    raise exception 'invite_not_found' using errcode = 'PT404';
  end if;
  if v_invite.email <> v_email then raise exception 'invite_email_mismatch' using errcode = 'PT403'; end if;
  if exists (select 1 from public.team_members where user_id = v_uid) then
    raise exception 'already_in_team' using errcode = 'PT409';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('team:' || v_invite.team_id::text, 0));
  v_capacity := private.team_seats(v_invite.team_id);
  if v_capacity = 0 then raise exception 'plan_required' using errcode = 'PT403'; end if;
  select count(*)::integer into v_members from public.team_members where team_id = v_invite.team_id;
  if v_members >= v_capacity then raise exception 'no_seats' using errcode = 'PT409'; end if;
  insert into public.team_members (team_id, user_id, role)
    values (v_invite.team_id, v_uid, 'member');
  update public.team_invites set accepted_at = now(), accepted_by = v_uid where id = p_invite_id;
  return jsonb_build_object('team_id', v_invite.team_id);
end;
$$;
--> statement-breakpoint
revoke all on function public.team_accept(uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.team_accept(uuid) to authenticated;
--> statement-breakpoint

create or replace function public.team_remove(p_user_id uuid default null, p_invite_id uuid default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_uid uuid; v_team uuid; v_owner uuid; v_removed integer;
begin
  if (p_user_id is null) = (p_invite_id is null) then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_uid := private.require_account();
  select tm.team_id, t.owner_id into v_team, v_owner from public.team_members tm
    join public.teams t on t.id = tm.team_id where tm.user_id = v_uid;
  if v_team is null then raise exception 'not_in_team' using errcode = 'PT403'; end if;
  if p_invite_id is not null then
    if v_owner <> v_uid then raise exception 'not_team_owner' using errcode = 'PT403'; end if;
    delete from public.team_invites where id = p_invite_id and team_id = v_team and accepted_at is null;
    get diagnostics v_removed = row_count;
    if v_removed = 0 then raise exception 'invite_not_found' using errcode = 'PT404'; end if;
    return jsonb_build_object('removed', v_removed > 0);
  end if;
  if v_uid <> p_user_id and v_uid <> v_owner then
    raise exception 'not_team_owner' using errcode = 'PT403';
  end if;
  if p_user_id = v_owner then raise exception 'owner_cannot_leave' using errcode = 'PT409'; end if;
  delete from public.team_members where team_id = v_team and user_id = p_user_id;
  get diagnostics v_removed = row_count;
  return jsonb_build_object('removed', v_removed > 0);
end;
$$;
--> statement-breakpoint
revoke all on function public.team_remove(uuid, uuid) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.team_remove(uuid, uuid) to authenticated;
--> statement-breakpoint

-- Every aggregate is scoped to the caller's active team. Both lists are capped;
-- larger fleets request the next page rather than fetching the whole table.
create or replace function public.team_fleet(p_limit integer default 20, p_page integer default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid; v_team record; v_seats integer; v_machine_limit integer;
  v_members jsonb; v_runs jsonb; v_invites jsonb; v_totals jsonb;
begin
  if p_limit is null or p_limit not between 1 and 50 or p_page is null or p_page not between 0 and 1000 then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_uid := private.require_account();
  select t.*, tm.role into v_team from public.team_members tm
    join public.teams t on t.id = tm.team_id where tm.user_id = v_uid;
  if not found then raise exception 'not_in_team' using errcode = 'PT403'; end if;
  v_seats := private.team_seats(v_team.id);
  if v_seats = 0 then raise exception 'plan_required' using errcode = 'PT403'; end if;
  select x.seats * x.report_machines into v_machine_limit from (
    select s.seats, p.report_machines, p.rank, s.period_end as ends_at
      from public.subscriptions s join public.plans p on p.id = s.plan_id and p.fleet_reports
      where s.user_id = v_team.owner_id and s.status = 'active' and s.returned_at is null
        and s.period_start <= now() and s.period_end > now()
    union all
    select g.seats, p.report_machines, p.rank, g.ends_at
      from public.plan_grants g join public.plans p on p.id = g.plan_id and p.fleet_reports
      where g.user_id = v_team.owner_id and g.revoked_at is null
        and g.starts_at <= now() and g.ends_at > now()
  ) x order by x.seats desc, x.rank desc, x.ends_at desc limit 1;
  with member_rows as (
    select tm.user_id, p.email, p.display_name, tm.role,
      (select count(*)::integer from public.devices d where d.user_id = tm.user_id) as machines,
      (select max(r.started_at) from public.runs r where r.user_id = tm.user_id) as last_run_at,
      (select count(*)::integer from public.runs r where r.user_id = tm.user_id
        and r.started_at >= now() - interval '30 days' and not r.dry_run
        and exists (select 1 from unnest(r.sections) s where s not in (0, 24, 25))) as real_runs_30d,
      (select coalesce(sum(r.freed_bytes), 0) from public.runs r where r.user_id = tm.user_id
        and r.started_at >= now() - interval '30 days') as freed_bytes_30d
    from public.team_members tm join public.profiles p on p.user_id = tm.user_id
    where tm.team_id = v_team.id order by tm.joined_at, tm.user_id
    limit p_limit offset p_limit * p_page
  ) select coalesce(jsonb_agg(to_jsonb(m) order by m.user_id), '[]'::jsonb)
      into v_members from member_rows m;
  select coalesce(jsonb_agg(jsonb_build_object('member_id', x.member_id,
      'device_id', x.device_id, 'started_at', x.started_at, 'mode', x.mode,
      'sections', x.sections, 'freed_bytes', x.freed_bytes)
      order by x.started_at desc, x.run_id desc), '[]'::jsonb)
    into v_runs from (
      select r.user_id as member_id, r.device_id, r.started_at, r.mode,
        r.sections, r.freed_bytes, r.run_id
        from public.runs r join public.team_members tm on tm.user_id = r.user_id
        where tm.team_id = v_team.id and r.started_at >= now() - interval '30 days'
        order by r.started_at desc, r.run_id desc limit p_limit offset p_limit * p_page
    ) x;
  if v_team.owner_id = v_uid then
    select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
      into v_invites from (
        select i.id, i.email, i.created_at, i.expires_at from public.team_invites i
        where i.team_id = v_team.id and i.accepted_at is null and i.expires_at > now()
        order by i.created_at desc, i.id desc limit p_limit offset p_limit * p_page) x;
  else v_invites := '[]'::jsonb; end if;
  select jsonb_build_object(
    'members', (select count(*) from public.team_members where team_id = v_team.id),
    'machines', (select count(*) from public.devices d join public.team_members tm on tm.user_id = d.user_id
      where tm.team_id = v_team.id),
    'real_runs_30d', (select count(*) from public.runs r join public.team_members tm on tm.user_id = r.user_id
      where tm.team_id = v_team.id and r.started_at >= now() - interval '30 days'
        and not r.dry_run and exists (select 1 from unnest(r.sections) s where s not in (0,24,25))),
    'freed_bytes_30d', (select coalesce(sum(r.freed_bytes), 0) from public.runs r
      join public.team_members tm on tm.user_id = r.user_id
      where tm.team_id = v_team.id and r.started_at >= now() - interval '30 days'),
    'quiet_machines', (select count(*) from public.devices d
      join public.team_members tm on tm.user_id = d.user_id
      where tm.team_id = v_team.id and d.last_seen_at < now() - interval '30 days')) into v_totals;
  return jsonb_build_object('team', jsonb_build_object('id', v_team.id, 'name', v_team.name,
      'seats', v_seats, 'role', v_team.role, 'machine_limit', v_machine_limit),
    'members', v_members, 'runs', v_runs, 'invites', v_invites, 'totals', v_totals,
    'page', p_page, 'limit', p_limit,
    'next_page', case when (v_totals ->> 'members')::integer > (p_page + 1) * p_limit
       or (select count(*) from public.runs r
         join public.team_members tm on tm.user_id = r.user_id
         where tm.team_id = v_team.id and r.started_at >= now() - interval '30 days')
         > (p_page + 1) * p_limit
       or (v_team.owner_id = v_uid and (select count(*) from public.team_invites i
         where i.team_id = v_team.id and i.accepted_at is null and i.expires_at > now())
         > (p_page + 1) * p_limit)
       then p_page + 1 else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.team_fleet(integer, integer) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.team_fleet(integer, integer) to authenticated;
