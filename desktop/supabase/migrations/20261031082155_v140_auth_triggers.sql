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
  insert into public.profiles (user_id, email, display_name, platform_role, referral_code, verified_at)
  values (new.id, new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name', '')), ''),
    case when lower(new.email) in ('zaionsmanager@gmail.com', 'aoneahsan@gmail.com')
      then 'superadmin' else 'user' end,
    private.new_referral_code(),
    case when new.email is not null and new.email_confirmed_at is not null then now() else null end)
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
     new.email_confirmed_at is distinct from old.email_confirmed_at then
    update public.profiles set email = new.email,
      verified_at = case when new.email is not null and new.email_confirmed_at is not null
        then coalesce(verified_at, now()) else verified_at end,
      platform_role = case when lower(new.email) in ('zaionsmanager@gmail.com', 'aoneahsan@gmail.com')
        then 'superadmin' else platform_role end
      where user_id = new.id;
    if new.email_confirmed_at is not null then perform private.try_confirm_referral(new.id); end if;
  end if;
  return new;
end;
$$;
--> statement-breakpoint
revoke all on function public.handle_auth_user_updated() from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger on_auth_user_updated
  after update of email, email_confirmed_at on auth.users
  for each row execute function public.handle_auth_user_updated();
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
