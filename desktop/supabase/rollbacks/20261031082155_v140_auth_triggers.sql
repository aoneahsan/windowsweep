-- REVIEWED ROLLBACK; never run directly. Restore the 1.3.2 signup writer while
-- retaining the existing profiles; historical referral codes stay until the
-- separate, destructive schema rollback is explicitly approved.
drop trigger if exists on_auth_user_updated on auth.users;
drop function if exists public.handle_auth_user_updated();
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (user_id, email, display_name, platform_role)
  values (new.id, new.email,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name', '')), ''),
    case when lower(new.email) in ('zaionsmanager@gmail.com', 'aoneahsan@gmail.com')
      then 'superadmin' else 'user' end)
  on conflict (user_id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated, service_role;
drop function if exists private.new_referral_code();
