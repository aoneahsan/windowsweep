-- Run with psql ON_ERROR_STOP=1 only AFTER BEGIN on the pinned, approved target,
-- AFTER the 1.4 migrations. On any error, the caller must ROLLBACK immediately.
-- Before this file, set six transaction-local values for three pre-existing,
-- reserved-domain throwaway accounts, for example:
--   SET LOCAL windowsweep.rehearsal_referrer = '<uuid>';
--   SET LOCAL windowsweep.rehearsal_referrer_email = '<address>.test';
--   SET LOCAL windowsweep.rehearsal_owner = '<uuid>';
--   SET LOCAL windowsweep.rehearsal_owner_email = '<address>.test';
--   SET LOCAL windowsweep.rehearsal_member = '<uuid>';
--   SET LOCAL windowsweep.rehearsal_member_email = '<address>.test';
--   SET LOCAL windowsweep.rehearsal_tx = 'rollback';
-- No Auth user is created. The caller must ROLLBACK the enclosing transaction.

do $$
declare v_ids uuid[]; v_emails text[]; v_id uuid; v_email text; i integer;
begin
  if current_setting('windowsweep.rehearsal_tx', true) is distinct from 'rollback' then
    raise exception 'This probe requires SET LOCAL inside an explicit rollback transaction';
  end if;
  if current_setting('windowsweep.rehearsal_referrer', true) is null
     or current_setting('windowsweep.rehearsal_owner', true) is null
     or current_setting('windowsweep.rehearsal_member', true) is null then
    raise exception 'Set all rehearsal account ids and emails with SET LOCAL inside BEGIN';
  end if;
  v_ids := array[
    current_setting('windowsweep.rehearsal_referrer')::uuid,
    current_setting('windowsweep.rehearsal_owner')::uuid,
    current_setting('windowsweep.rehearsal_member')::uuid];
  v_emails := array[
    lower(current_setting('windowsweep.rehearsal_referrer_email')),
    lower(current_setting('windowsweep.rehearsal_owner_email')),
    lower(current_setting('windowsweep.rehearsal_member_email'))];
  if v_ids[1] = v_ids[2] or v_ids[1] = v_ids[3] or v_ids[2] = v_ids[3] then
    raise exception 'Rehearsal identities must be distinct'; end if;
  for i in 1..3 loop
    v_id := v_ids[i]; v_email := v_emails[i];
    if v_email !~ '(@example\.(com|net|org)|\.test)$'
       or not exists (select 1 from auth.users u join public.profiles p on p.user_id = u.id
         where u.id = v_id and lower(p.email) = v_email) then
      raise exception 'Rehearsal account % is not the named reserved-domain seed', i;
    end if;
    if exists (select 1 from public.plan_grants where user_id = v_id)
       or exists (select 1 from public.subscriptions where user_id = v_id)
       or exists (select 1 from public.team_members where user_id = v_id)
       or exists (select 1 from public.teams where owner_id = v_id) then
      raise exception 'Rehearsal account % has existing entitlement or Team data', i;
    end if;
  end loop;
  if not exists (select 1 from public.plans where id = 'pro' and rank > 0)
     or not exists (select 1 from public.plans where id = 'team' and fleet_reports) then
    raise exception 'Seeded Pro and Team plans are required for this probe'; end if;
end; $$;

-- 1. A later paid renewal moves a fully banked calendar month after it.
savepoint referral_probe_1;
do $$
declare v_user uuid := current_setting('windowsweep.rehearsal_referrer')::uuid;
  v_now timestamptz := now(); v_grant uuid; v_row record;
begin
  insert into public.subscriptions (user_id,plan_id,interval,seats,status,
    period_start,period_end,amount_cents,currency,polar_order_id)
    values (v_user,'pro','month',1,'active',v_now,v_now+interval '1 month',
      400,'usd','rehearsal-'||gen_random_uuid()::text);
  insert into public.plan_grants (user_id,plan_id,source,seats,months,reason,starts_at,ends_at)
    values (v_user,'pro','referral',1,1,'Rehearsal reward',
      v_now+interval '1 month',v_now+interval '2 months') returning id into v_grant;
  insert into public.subscriptions (user_id,plan_id,interval,seats,status,
    period_start,period_end,amount_cents,currency,polar_order_id)
    values (v_user,'pro','month',1,'active',v_now+interval '1 month',
      v_now+interval '2 months',400,'usd','rehearsal-'||gen_random_uuid()::text);
  select * into v_row from public.plan_grants where id = v_grant;
  if v_row.starts_at <> v_now+interval '2 months'
     or v_row.ends_at <> v_row.starts_at+interval '1 month'
     or v_row.referral_remaining_us <= 0 then
    raise exception 'Probe 1: paid renewal consumed or misplaced a banked month'; end if;
end; $$;
rollback to savepoint referral_probe_1;
release savepoint referral_probe_1;

-- 2. Team owner renewal shifts the member reward; leaving restores its unused month.
savepoint referral_probe_2;
do $$
declare v_owner uuid := current_setting('windowsweep.rehearsal_owner')::uuid;
  v_member uuid := current_setting('windowsweep.rehearsal_member')::uuid;
  v_now timestamptz := now(); v_team uuid; v_grant uuid; v_row record;
begin
  insert into public.subscriptions (user_id,plan_id,interval,seats,status,
    period_start,period_end,amount_cents,currency,polar_order_id)
    values (v_owner,'team','month',3,'active',v_now,v_now+interval '1 month',
      900,'usd','rehearsal-'||gen_random_uuid()::text);
  v_team := private.ensure_owned_team(v_owner, 'Rehearsal Team');
  insert into public.team_members (team_id,user_id,role) values (v_team,v_member,'member');
  insert into public.plan_grants (user_id,plan_id,source,seats,months,reason,starts_at,ends_at)
    values (v_member,'pro','referral',1,1,'Rehearsal reward',
      v_now+interval '1 month',v_now+interval '2 months') returning id into v_grant;
  insert into public.subscriptions (user_id,plan_id,interval,seats,status,
    period_start,period_end,amount_cents,currency,polar_order_id)
    values (v_owner,'team','month',3,'active',v_now+interval '1 month',
      v_now+interval '2 months',900,'usd','rehearsal-'||gen_random_uuid()::text);
  select * into v_row from public.plan_grants where id = v_grant;
  if v_row.starts_at <> v_now+interval '2 months' then
    raise exception 'Probe 2: owner renewal did not shift member reward'; end if;
  begin
    update public.plans set fleet_reports = false where id = 'team';
    raise exception 'Probe 2: fleet guard did not refuse a blocker change';
  exception when sqlstate 'PT409' then null; end;
  delete from public.team_members where team_id = v_team and user_id = v_member;
  select * into v_row from public.plan_grants where id = v_grant;
  if v_row.starts_at <> v_now or v_row.ends_at <> v_now+interval '1 month' then
    raise exception 'Probe 2: departure did not restore unused member reward'; end if;
end; $$;
rollback to savepoint referral_probe_2;
release savepoint referral_probe_2;

-- 3. Ten already used uncovered days remain used when a new paid period begins.
savepoint referral_probe_3;
do $$
declare v_user uuid := current_setting('windowsweep.rehearsal_referrer')::uuid;
  v_now timestamptz := now(); v_start timestamptz := now()-interval '10 days';
  v_full bigint; v_used bigint; v_grant uuid; v_row record;
begin
  v_full := round(extract(epoch from ((v_start+interval '1 month')-v_start))*1000000)::bigint;
  v_used := round(extract(epoch from (v_now-v_start))*1000000)::bigint;
  insert into public.plan_grants (user_id,plan_id,source,seats,months,reason,starts_at,ends_at)
    values (v_user,'pro','referral',1,1,'Rehearsal reward',
      v_start,v_start+interval '1 month') returning id into v_grant;
  -- Simulate elapsed time without changing the server clock or waiting ten days.
  update public.plan_grants set starts_at=v_start, ends_at=v_start+interval '1 month',
    referral_remaining_us=v_full, referral_accounted_at=v_start,
    referral_blocked_ranges='{}'::tstzmultirange where id=v_grant;
  insert into public.subscriptions (user_id,plan_id,interval,seats,status,
    period_start,period_end,amount_cents,currency,polar_order_id)
    values (v_user,'pro','month',1,'active',v_now,v_now+interval '1 month',
      400,'usd','rehearsal-'||gen_random_uuid()::text);
  select * into v_row from public.plan_grants where id=v_grant;
  if v_row.starts_at <> v_start
     or v_row.referral_remaining_us <> v_full-v_used
     or v_row.ends_at <> v_now+interval '1 month'
       +(v_full-v_used)*interval '1 microsecond' then
    raise exception 'Probe 3: elapsed active reward was lost or regranted'; end if;
  if (select source from private.plan_for_user(v_user, v_now)) <> 'payment' then
    raise exception 'Probe 3: paid source did not win during the pause'; end if;
end; $$;
rollback to savepoint referral_probe_3;
release savepoint referral_probe_3;

-- 4. Multiple rewards serialize; each fully banked reward remains a calendar month.
savepoint referral_probe_4;
do $$
declare v_user uuid := current_setting('windowsweep.rehearsal_referrer')::uuid;
  v_now timestamptz := now(); v_first uuid; v_second uuid; a record; b record;
begin
  insert into public.plan_grants (user_id,plan_id,source,seats,months,reason,starts_at,ends_at)
    values (v_user,'pro','referral',1,1,'Rehearsal reward',v_now,v_now+interval '1 month')
    returning id into v_first;
  insert into public.plan_grants (user_id,plan_id,source,seats,months,reason,starts_at,ends_at)
    values (v_user,'pro','referral',1,1,'Rehearsal reward',v_now,v_now+interval '1 month')
    returning id into v_second;
  select * into a from public.plan_grants where id in (v_first,v_second)
    order by starts_at limit 1;
  select * into b from public.plan_grants where id in (v_first,v_second)
    order by starts_at desc limit 1;
  if b.starts_at <> a.ends_at or b.ends_at <> b.starts_at+interval '1 month' then
    raise exception 'Probe 4: referral months did not stack'; end if;
end; $$;
rollback to savepoint referral_probe_4;
release savepoint referral_probe_4;

-- 5. Refund and grant revocation remove future blockers without losing reward.
savepoint referral_probe_5;
do $$
declare v_user uuid := current_setting('windowsweep.rehearsal_referrer')::uuid;
  v_now timestamptz := now(); v_paid uuid; v_reward uuid; v_admin uuid; v_row record;
begin
  insert into public.subscriptions (user_id,plan_id,interval,seats,status,
    period_start,period_end,amount_cents,currency,polar_order_id)
    values (v_user,'pro','month',1,'active',v_now,v_now+interval '1 month',
      400,'usd','rehearsal-'||gen_random_uuid()::text) returning id into v_paid;
  insert into public.plan_grants (user_id,plan_id,source,seats,months,reason,starts_at,ends_at)
    values (v_user,'pro','referral',1,1,'Rehearsal reward',
      v_now+interval '1 month',v_now+interval '2 months') returning id into v_reward;
  update public.subscriptions set status='returned', returned_at=v_now,
    returned_cents=400, period_end=v_now+interval '1 microsecond' where id=v_paid;
  select * into v_row from public.plan_grants where id=v_reward;
  if v_row.starts_at <> v_now or v_row.ends_at <> v_now+interval '1 month' then
    raise exception 'Probe 5: refund did not release banked reward'; end if;
  insert into public.plan_grants (user_id,plan_id,source,seats,reason,starts_at,ends_at)
    values (v_user,'pro','admin',1,'Rehearsal blocker',v_now,v_now+interval '1 month')
    returning id into v_admin;
  select * into v_row from public.plan_grants where id=v_reward;
  if v_row.ends_at <> (v_now+interval '1 month')+
       v_row.referral_remaining_us*interval '1 microsecond' then
    raise exception 'Probe 5: admin grant did not pause reward'; end if;
  update public.plan_grants set revoked_at=v_now where id=v_admin;
  select * into v_row from public.plan_grants where id=v_reward;
  if v_row.ends_at <> v_now+interval '1 month' then
    raise exception 'Probe 5: revocation did not restore reward'; end if;
end; $$;
rollback to savepoint referral_probe_5;
release savepoint referral_probe_5;

-- 6. Rank edits affecting a live reward fail closed with the documented code.
savepoint referral_probe_6;
do $$
declare v_user uuid := current_setting('windowsweep.rehearsal_referrer')::uuid;
  v_now timestamptz := now();
begin
  insert into public.plan_grants (user_id,plan_id,source,seats,months,reason,starts_at,ends_at)
    values (v_user,'pro','referral',1,1,'Rehearsal reward',v_now,v_now+interval '1 month');
  begin
    update public.plans set rank=rank+1 where id='pro';
    raise exception 'Probe 6: rank guard did not refuse the change';
  exception when sqlstate 'PT409' then null; end;
end; $$;
rollback to savepoint referral_probe_6;
release savepoint referral_probe_6;

-- A passing script leaves no fixture rows. The caller still rolls back BEGIN.
