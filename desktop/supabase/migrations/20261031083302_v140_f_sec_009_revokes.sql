-- Custom SQL migration file, put your code below! --
-- F-SEC-009: platform and FilesHub out-of-band objects may be absent from a
-- fresh project, so each targeted revoke is existence-guarded. The event
-- trigger still fires after EXECUTE is revoked from client roles.
do $$
begin
  if pg_catalog.to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable()
      from public, anon, authenticated, service_role;
  end if;
  if pg_catalog.to_regclass('public."fileshub-project-status-check_id_seq"') is not null then
    revoke all on sequence public."fileshub-project-status-check_id_seq"
      from public, anon, authenticated;
  end if;
end;
$$;
--> statement-breakpoint

-- Future sequences land closed. The existing FilesHub keepalive sequence keeps
-- its explicit service_role grant; the table itself is left intact.
alter default privileges for role postgres in schema public
  revoke all on sequences from public, anon, authenticated, service_role;
