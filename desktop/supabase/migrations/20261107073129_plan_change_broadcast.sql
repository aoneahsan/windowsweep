-- A plan change is the source of truth in public.subscriptions and public.plan_grants. This
-- broadcast carries only an invalidation signal, on the account's own PRIVATE topic
-- `plans:<user id>`: the desktop window and the website re-read their own plan through RLS
-- when it arrives (realtime-not-polling: a provider's state -> signed webhook -> DB -> Realtime).
-- The payload names nothing; the topic is private, so only that signed-in account may join it.
create or replace function private.broadcast_plan_change()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform realtime.send(
    payload => pg_catalog.jsonb_build_object('schema', 1),
    event => 'plan',
    topic => 'plans:' || new.user_id::text,
    private => true
  );
  return new;
end;
$$;
--> statement-breakpoint
revoke all on function private.broadcast_plan_change()
  from public, anon, authenticated, service_role;
--> statement-breakpoint
create or replace trigger subscriptions_broadcast_plan
  after insert or update on public.subscriptions
  for each row execute function private.broadcast_plan_change();
--> statement-breakpoint
create or replace trigger plan_grants_broadcast_plan
  after insert or update on public.plan_grants
  for each row execute function private.broadcast_plan_change();
--> statement-breakpoint
-- Who may join a plan topic: the account it names, and nobody else. Evaluated once at join.
drop policy if exists "plans topic: own account only" on realtime.messages;
--> statement-breakpoint
create policy "plans topic: own account only"
  on realtime.messages for select
  to authenticated
  using (realtime.topic() = 'plans:' || (select auth.uid())::text);
