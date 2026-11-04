-- An atomic one-way mark avoids losing hints when two devices show different pages.
-- The caller can affect only its own profile. The route key contains no private data.
create or replace function public.mark_tour_hint(p_key text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if (select auth.uid()) is null then
    raise exception 'Sign in to save a tour hint' using errcode = '42501';
  end if;
  if p_key is null or length(p_key) > 80 or p_key !~ '^/[a-z0-9/_-]*$' then
    raise exception 'Invalid tour route' using errcode = '22023';
  end if;

  update public.profiles
     set tour_hinted = tour_hinted || jsonb_build_object(p_key, true)
   where user_id = (select auth.uid())
   returning tour_hinted into result;
  if result is null then
    raise exception 'Profile unavailable' using errcode = 'P0002';
  end if;
  return result;
end;
$$;

revoke all on function public.mark_tour_hint(text) from public, anon, authenticated, service_role;
grant execute on function public.mark_tour_hint(text) to authenticated;
