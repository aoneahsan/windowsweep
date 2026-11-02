-- Custom SQL migration file, put your code below! --
-- One immutable share code per auth identity. No client can write this column.
create or replace function private.new_referral_code()
returns text language plpgsql volatile security definer set search_path = '' as $$
declare v_code text;
begin
  for i in 1..10 loop
    v_code := upper(substr(replace(pg_catalog.gen_random_uuid()::text, '-', ''), 1, 10));
    if not exists (select 1 from public.profiles where referral_code = v_code) then return v_code; end if;
  end loop;
  raise exception 'referral_code_exhausted' using errcode = 'PT503';
end;
$$;
--> statement-breakpoint
revoke all on function private.new_referral_code() from public, anon, authenticated, service_role;
--> statement-breakpoint

-- Replace the existing signup trigger body; preserve owner seeding and display-name derivation.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id, email, display_name, platform_role,
    referral_code, verified_at, referral_eligible_at)
  values (new.id, new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name', '')), ''),
    case when lower(new.email) in ('zaionsmanager@gmail.com', 'aoneahsan@gmail.com')
      then 'superadmin' else 'user' end,
    private.new_referral_code(),
    case when new.email is not null and new.email_confirmed_at is not null then now() else null end,
    case when new.email is not null and new.is_anonymous is false
      then new.created_at else null end)
  on conflict (user_id) do nothing;
  return new;
end;
$$;
--> statement-breakpoint
revoke all on function public.handle_new_user() from public, anon, authenticated, service_role;
--> statement-breakpoint

-- Google linking updates the existing anonymous auth row; the id and its claims stay.
create or replace function public.handle_auth_user_updated()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.email is distinct from old.email or
     new.email_confirmed_at is distinct from old.email_confirmed_at or
     new.is_anonymous is distinct from old.is_anonymous then
    update public.profiles set email = new.email,
      referral_eligible_at = case when new.email is not null and new.is_anonymous is false
        then coalesce(referral_eligible_at,
          case when old.email is null then now() else old.created_at end)
        else referral_eligible_at end,
      verified_at = case when new.email is not null and new.email_confirmed_at is not null
        then coalesce(verified_at, now()) else verified_at end,
      platform_role = case when lower(new.email) in ('zaionsmanager@gmail.com', 'aoneahsan@gmail.com')
        then 'superadmin' else platform_role end
      where user_id = new.id;
    if new.email_confirmed_at is not null then
      perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended('referral-invitee:' || new.id::text, 0));
      perform private.try_confirm_referral(new.id);
    end if;
  end if;
  return new;
end;
$$;
--> statement-breakpoint

revoke all on function public.handle_auth_user_updated() from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger on_auth_user_updated
  after update of email, email_confirmed_at, is_anonymous on auth.users
  for each row execute function public.handle_auth_user_updated();
--> statement-breakpoint

-- Existing signed-in profiles keep their historical age; old anonymous device
-- sessions remain null until their first Google conversion.
update public.profiles p set referral_eligible_at = coalesce(u.created_at, p.created_at)
  from auth.users u where p.user_id = u.id and p.referral_eligible_at is null
    and p.email is not null and u.is_anonymous is false;
--> statement-breakpoint

-- Preserve only an anonymous event/reason ledger when either party's
-- account is removed. The live referral and its user ids still cascade away.
create or replace function private.record_referral_account_deletion()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_referrer uuid;
begin
  insert into public.referral_voids (reason_code)
    select 'account_deleted' from public.referrals r
      where (r.referrer_id = old.id or r.invitee_id = old.id)
      and r.status <> 'void';
  update public.referral_badge_awards a set voided_at = now()
    where a.referral_id in (select r.id from public.referrals r
      where r.referrer_id = old.id or r.invitee_id = old.id)
      and a.voided_at is null;
  update public.referrals r set status = 'void', voided_at = coalesce(r.voided_at, now())
    where r.referrer_id = old.id or r.invitee_id = old.id;
  for v_referrer in select distinct r.referrer_id from public.referrals r
    where r.invitee_id = old.id and r.referrer_id <> old.id loop
    perform private.reconcile_referral_rewards(v_referrer, null, null);
  end loop;
  return old;
end;
$$;
--> statement-breakpoint
revoke all on function private.record_referral_account_deletion()
  from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger on_auth_user_referral_delete
  before delete on auth.users
  for each row execute function private.record_referral_account_deletion();
--> statement-breakpoint

-- Existing Google profiles predate share codes; fill only nulls and keep all prior values.
do $$
declare v_user uuid;
begin
  for v_user in select user_id from public.profiles where referral_code is null order by user_id loop
    update public.profiles set referral_code = private.new_referral_code()
      where user_id = v_user and referral_code is null;
  end loop;
end;
$$;
