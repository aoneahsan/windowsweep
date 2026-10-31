-- Custom SQL migration file, put your code below! --
create or replace function public.admin_config_get()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_admin();
  return jsonb_build_object('items', (select coalesce(jsonb_agg(to_jsonb(c) order by c.key), '[]'::jsonb)
    from public.app_config c));
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_config_get() from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_config_get() to authenticated;
--> statement-breakpoint

create or replace function public.admin_config_set(p_key text, p_value jsonb, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid; v_old record; v_number numeric; v_months integer; v_cap integer;
begin
  if p_key is null or p_value is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  select * into v_old from public.app_config where key = p_key for update;
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  if jsonb_typeof(p_value) <> jsonb_typeof(v_old.value) then
    raise exception 'invalid_value' using errcode = 'PT422';
  end if;
  if jsonb_typeof(p_value) = 'number' then
    if (p_value #>> '{}') !~ '^[0-9]+$' then
      raise exception 'invalid_value' using errcode = 'PT422'; end if;
    v_number := (p_value #>> '{}')::numeric;
    if (v_old.min_value is not null and v_number < v_old.min_value)
      or (v_old.max_value is not null and v_number > v_old.max_value) then
      raise exception 'out_of_bounds' using errcode = 'PT422'; end if;
  end if;
  if p_key = 'referral_reward_plan' and not exists (
    select 1 from public.plans where id = p_value #>> '{}' and is_active and rank > 0) then
    raise exception 'invalid_plan' using errcode = 'PT422'; end if;
  if p_key in ('referral_reward_months', 'referral_reward_months_cap_per_year') then
    select case when p_key = 'referral_reward_months' then v_number::integer
      else (value #>> '{}')::integer end into v_months
      from public.app_config where key = 'referral_reward_months';
    select case when p_key = 'referral_reward_months_cap_per_year' then v_number::integer
      else (value #>> '{}')::integer end into v_cap
      from public.app_config where key = 'referral_reward_months_cap_per_year';
    if v_cap <> 0 and v_cap < v_months then
      raise exception 'out_of_bounds' using errcode = 'PT422'; end if;
  end if;
  update public.app_config set value = p_value, updated_at = now(), updated_by = v_admin
    where key = p_key;
  insert into public.admin_audit (actor, action, subject_table, subject_id, before, after)
    values (v_admin, 'config.update', 'app_config', p_key,
      jsonb_build_object('value', v_old.value),
      jsonb_build_object('value', p_value, 'reason', p_reason));
  return jsonb_build_object('key', p_key, 'value', p_value);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_config_set(text, jsonb, text) from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_config_set(text, jsonb, text) to authenticated;
--> statement-breakpoint

create or replace function public.admin_requests_list(p_status text default null,
  p_cursor text default null, p_limit integer default 20)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_cursor jsonb; v_items jsonb := '[]'::jsonb; v_count integer := 0;
  v_row record; v_last timestamptz; v_last_id text;
begin
  if p_limit is null or p_limit not between 1 and 50 or
     (p_status is not null and p_status not in ('pending','notified','closed')) then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  v_cursor := private.decode_cursor(p_cursor);
  perform private.require_admin();
  for v_row in select r.*, p.email as user_email from public.plan_requests r
    join public.profiles p on p.user_id = r.user_id
    where (p_status is null or r.status::text = p_status)
      and (v_cursor is null or (r.created_at, r.id::text) <
        ((v_cursor ->> 't')::timestamptz, v_cursor ->> 'id'))
    order by r.created_at desc, r.id desc limit p_limit loop
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'id', v_row.id, 'user_id', v_row.user_id, 'user_email', v_row.user_email,
      'plan_id', v_row.plan_id, 'interval', v_row.interval, 'seats', v_row.seats,
      'note', v_row.note, 'status', v_row.status, 'created_at', v_row.created_at,
      'notified_at', v_row.notified_at, 'closed_at', v_row.closed_at,
      'closed_by', v_row.closed_by));
    v_count := v_count + 1; v_last := v_row.created_at; v_last_id := v_row.id::text;
  end loop;
  return jsonb_build_object('items', v_items,
    'next_cursor', case when v_count = p_limit then private.encode_cursor(v_last, v_last_id) else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_requests_list(text, text, integer)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_requests_list(text, text, integer) to authenticated;
--> statement-breakpoint

-- Claim an email batch with a ten-minute lease; the Edge Function sends the mail
-- and marks only successful deliveries. A failed send releases its claim.
create or replace function public.admin_requests_claim(p_cursor text default null,
  p_limit integer default 20)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_cursor jsonb; v_admin uuid; v_items jsonb := '[]'::jsonb;
  v_row record; v_last timestamptz; v_last_id text; v_count integer := 0;
begin
  if p_limit is null or p_limit not between 1 and 20 then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  v_cursor := private.decode_cursor(p_cursor);
  v_admin := private.require_admin();
  for v_row in select r.*, p.email as user_email from public.plan_requests r
    join public.profiles p on p.user_id = r.user_id
    where r.status = 'pending' and p.email is not null
      and (r.notify_claimed_at is null or r.notify_claimed_at < now() - interval '10 minutes')
      and (v_cursor is null or (r.created_at, r.id::text) <
        ((v_cursor ->> 't')::timestamptz, v_cursor ->> 'id'))
    order by r.created_at desc, r.id desc limit p_limit for update of r skip locked loop
    update public.plan_requests set notify_claimed_at = now() where id = v_row.id;
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'id', v_row.id, 'user_id', v_row.user_id, 'user_email', v_row.user_email,
      'plan_id', v_row.plan_id, 'interval', v_row.interval, 'seats', v_row.seats));
    v_count := v_count + 1; v_last := v_row.created_at; v_last_id := v_row.id::text;
  end loop;
  return jsonb_build_object('items', v_items,
    'next_cursor', case when v_count = p_limit then private.encode_cursor(v_last, v_last_id) else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_requests_claim(text, integer)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_requests_claim(text, integer) to authenticated;
--> statement-breakpoint

create or replace function public.admin_request_mark_notified(p_request_id uuid, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid; v_status public.plan_request_status;
begin
  if p_request_id is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  select status into v_status from public.plan_requests where id = p_request_id for update;
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  if v_status = 'notified' or v_status = 'closed' then
    return jsonb_build_object('id', p_request_id, 'status', v_status);
  end if;
  update public.plan_requests set status = 'notified', notified_at = now(), notify_claimed_at = null
    where id = p_request_id and status = 'pending' and notify_claimed_at is not null;
  if not found then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  insert into public.admin_audit (actor, action, subject_table, subject_id, after)
    values (v_admin, 'plan_request.notify_open', 'plan_requests', p_request_id::text,
      jsonb_build_object('notified_at', now(), 'reason', p_reason));
  return jsonb_build_object('id', p_request_id, 'status', 'notified');
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_request_mark_notified(uuid, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_request_mark_notified(uuid, text) to authenticated;
--> statement-breakpoint

create or replace function public.admin_request_release_claim(p_request_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_request_id is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.require_admin();
  update public.plan_requests set notify_claimed_at = null
    where id = p_request_id and status = 'pending';
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_request_release_claim(uuid)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_request_release_claim(uuid) to authenticated;
--> statement-breakpoint

create or replace function public.admin_request_close(p_request_id uuid, p_reason text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid; v_status public.plan_request_status;
begin
  if p_request_id is null then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  perform private.admin_reason(p_reason);
  v_admin := private.require_admin();
  select status into v_status from public.plan_requests where id = p_request_id for update;
  if not found then raise exception 'not_found' using errcode = 'PT404'; end if;
  if v_status = 'closed' then return jsonb_build_object('id', p_request_id, 'status', 'closed'); end if;
  if v_status <> 'notified' then raise exception 'invalid_request' using errcode = 'PT422'; end if;
  update public.plan_requests set status = 'closed', closed_at = now(), closed_by = v_admin
    where id = p_request_id;
  insert into public.admin_audit (actor, action, subject_table, subject_id, after)
    values (v_admin, 'plan_request.close', 'plan_requests', p_request_id::text,
      jsonb_build_object('closed_at', now(), 'reason', p_reason));
  return jsonb_build_object('id', p_request_id, 'status', 'closed');
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_request_close(uuid, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_request_close(uuid, text) to authenticated;
--> statement-breakpoint

create or replace function private.refuse_release_edit()
returns trigger language plpgsql set search_path = '' as $$
begin
  raise exception 'release_immutable' using errcode = 'PT409';
end;
$$;
--> statement-breakpoint
revoke all on function private.refuse_release_edit() from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger app_releases_immutable
  before update or delete on public.app_releases
  for each row execute function private.refuse_release_edit();
--> statement-breakpoint

create or replace function public.publish_app_release(p_platform text, p_channel text,
  p_version text, p_severity text, p_reason text, p_min_native_version text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_admin uuid; v_previous text; v_release record;
  v_semver text := '^(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})\.(0|[1-9][0-9]{0,5})$';
begin
  if p_platform not in ('desktop','web','docs') or p_channel not in ('production','test')
     or p_version is null or p_version !~ v_semver
     or p_severity not in ('urgent','normal')
     or p_reason is null or char_length(trim(p_reason)) not between 1 and 280
     or (p_min_native_version is not null and p_min_native_version !~ v_semver) then
    raise exception 'invalid_request' using errcode = 'PT422';
  end if;
  v_admin := private.require_admin();
  select version into v_previous from public.app_releases
    where platform::text = p_platform and channel::text = p_channel
    order by published_at desc, id desc limit 1;
  insert into public.app_releases (platform, channel, version, severity,
    reason, min_native_version, created_by)
    values (p_platform::public.release_platform, p_channel::public.release_channel,
      p_version, p_severity::public.release_severity, trim(p_reason), p_min_native_version,
      v_admin) returning * into v_release;
  insert into public.admin_audit (actor, action, subject_table, subject_id, after)
    values (v_admin, 'release.publish', 'app_releases', v_release.id::text,
      to_jsonb(v_release));
  return jsonb_build_object('release', to_jsonb(v_release) - 'created_by',
    'previous_version', v_previous);
end;
$$;
--> statement-breakpoint
revoke all on function public.publish_app_release(text, text, text, text, text, text)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.publish_app_release(text, text, text, text, text, text)
  to authenticated;
--> statement-breakpoint

create or replace function public.admin_releases_list(p_platform text default null,
  p_channel text default null, p_cursor text default null, p_limit integer default 20)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_cursor jsonb; v_items jsonb := '[]'::jsonb; v_count integer := 0;
  v_row record; v_last timestamptz; v_last_id text;
begin
  if p_limit is null or p_limit not between 1 and 50
     or (p_platform is not null and p_platform not in ('desktop','web','docs'))
     or (p_channel is not null and p_channel not in ('production','test')) then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  v_cursor := private.decode_cursor(p_cursor);
  perform private.require_admin();
  for v_row in select r.*, p.email as created_by_email from public.app_releases r
    left join public.profiles p on p.user_id = r.created_by
    where (p_platform is null or r.platform::text = p_platform)
      and (p_channel is null or r.channel::text = p_channel)
      and (v_cursor is null or (r.published_at, r.id::text) <
        ((v_cursor ->> 't')::timestamptz, v_cursor ->> 'id'))
    order by r.published_at desc, r.id desc limit p_limit loop
    v_items := v_items || jsonb_build_array((to_jsonb(v_row) - 'created_by' - 'created_by_email') ||
      jsonb_build_object('created_by', coalesce(v_row.created_by_email, v_row.created_by::text)));
    v_count := v_count + 1; v_last := v_row.published_at; v_last_id := v_row.id::text;
  end loop;
  return jsonb_build_object('items', v_items,
    'next_cursor', case when v_count = p_limit then private.encode_cursor(v_last, v_last_id) else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_releases_list(text, text, text, integer)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_releases_list(text, text, text, integer) to authenticated;
--> statement-breakpoint

create or replace function public.admin_audit_list(p_action text default null,
  p_cursor text default null, p_limit integer default 20)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_cursor jsonb; v_items jsonb := '[]'::jsonb; v_count integer := 0;
  v_row record; v_last timestamptz; v_last_id text;
begin
  if p_limit is null or p_limit not between 1 and 50 or
     (p_action is not null and length(p_action) > 100) then
    raise exception 'invalid_request' using errcode = 'PT422'; end if;
  v_cursor := private.decode_cursor(p_cursor);
  perform private.require_admin();
  for v_row in select a.*, p.email as actor_email from public.admin_audit a
    left join public.profiles p on p.user_id = a.actor
    where (p_action is null or a.action = p_action)
      and (v_cursor is null or (a.at, a.id::text) <
        ((v_cursor ->> 't')::timestamptz, v_cursor ->> 'id'))
    order by a.at desc, a.id desc limit p_limit loop
    v_items := v_items || jsonb_build_array((to_jsonb(v_row) - 'actor' - 'actor_email') ||
      jsonb_build_object('actor', coalesce(v_row.actor_email,
        case when v_row.actor is null then 'system' else v_row.actor::text end)));
    v_count := v_count + 1; v_last := v_row.at; v_last_id := v_row.id::text;
  end loop;
  return jsonb_build_object('items', v_items,
    'next_cursor', case when v_count = p_limit then private.encode_cursor(v_last, v_last_id) else null end);
end;
$$;
--> statement-breakpoint
revoke all on function public.admin_audit_list(text, text, integer)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.admin_audit_list(text, text, integer) to authenticated;
