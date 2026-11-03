-- A release record is the source of truth. This public broadcast carries only
-- an invalidation signal; clients re-read the bounded latest_app_releases view.
-- Public matches the desktop and docs release channels, which need no account.
create or replace function private.broadcast_app_release()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform realtime.send(
    payload => pg_catalog.jsonb_build_object('schema', 1),
    event => 'release',
    topic => 'releases:' || new.platform::text || ':' || new.channel::text,
    private => false
  );
  return new;
end;
$$;
--> statement-breakpoint
revoke all on function private.broadcast_app_release()
  from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger app_releases_broadcast_insert
  after insert on public.app_releases
  for each row execute function private.broadcast_app_release();
