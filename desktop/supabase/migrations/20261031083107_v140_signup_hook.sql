-- Custom SQL migration file, put your code below! --
-- Supabase Auth before-user-created hook. The Admin API bypasses hooks; test
-- aliases created through it remain available. Google linking onto an existing
-- anonymous user is an UPDATE, not a signup, and never enters this hook.
-- Event shape and return envelope: https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook
create or replace function public.windowsweep_before_user_created(event jsonb)
returns jsonb language plpgsql stable set search_path = '' as $$
declare v_email text; v_provider text;
begin
  if event is null or jsonb_typeof(event) <> 'object' or
     jsonb_typeof(event -> 'user') <> 'object' then
    return jsonb_build_object('error', jsonb_build_object('http_code', 400,
      'message', 'Invalid sign-up request.'));
  end if;
  if coalesce((event -> 'user' ->> 'is_anonymous')::boolean, false) then return '{}'::jsonb; end if;
  v_provider := event -> 'user' -> 'app_metadata' ->> 'provider';
  if v_provider = 'google' then return '{}'::jsonb; end if;
  v_email := lower(event -> 'user' ->> 'email');
  if v_provider = 'email' and (
      v_email = 'aoneahsan.apps.t1@gmail.com' or
      v_email ~ '^aoneahsan\.apps\.t1\+[0-9]+@gmail\.com$') then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error', jsonb_build_object('http_code', 403,
    'message', 'WindowSweep accounts sign in with Google.'));
end;
$$;
--> statement-breakpoint
revoke all on function public.windowsweep_before_user_created(jsonb)
  from public, anon, authenticated, service_role;
--> statement-breakpoint
grant execute on function public.windowsweep_before_user_created(jsonb) to supabase_auth_admin;
