-- TASK-017: the triage stamps come from the server, and an admin's column grant narrows to `status`.
--
-- Found by RW-116 on 2026-09-25 (the site verified as a person, flow 3): `grant update (status, handled_at,
-- handled_by)` let the admin's browser write both stamps itself. Measured: the stored `handled_at` was
-- 09:48:18.983Z while the audit row of the same write read 09:48:18.738Z - the browser's clock, 245 ms apart -
-- and nothing stopped an admin sending any time, or another admin's id as `handled_by`. The audit row itself
-- was right: its `actor` and `at` are server-side. Owner decision D48 (2026-09-25): "Yes, apply it
-- (Recommended)".
--
-- After this migration an admin writes `status` and nothing else, and the stamps mean what the site has always
-- meant by them - who triaged the request, and when:
--   status changes to 'new'             -> both cleared (a request reopened)
--   status changes to anything else     -> handled_at = now(), handled_by = auth.uid()
--   status unchanged                    -> both pinned to what is stored
-- The pin is what makes the stamps unforgeable by ANY role's write, not only by the grant: a write that does
-- not change the status cannot move them. `now()` is the transaction's time, so the stored `handled_at` equals
-- the audit row's `at` to the microsecond - both are the same statement's `now()`.
--
-- Deliberately NOT `security definer` (it touches only NEW, like `set_updated_at`), and deliberately a BLANKET
-- `before update` with no column list, so no write can dodge it. The audit trigger fires AFTER UPDATE and
-- reads NEW, so it records the server's stamps.

create or replace function public.stamp_contact_request_handled()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status is distinct from old.status then
    if new.status = 'new' then
      new.handled_at := null;
      new.handled_by := null;
    else
      new.handled_at := now();
      new.handled_by := (select auth.uid());
    end if;
  else
    new.handled_at := old.handled_at;
    new.handled_by := old.handled_by;
  end if;
  return new;
end;
$$;
--> statement-breakpoint

create or replace trigger contact_requests_stamp_handled
  before update on public.contact_requests
  for each row
  execute function public.stamp_contact_request_handled();
--> statement-breakpoint

-- Closed explicitly, per function, as `20260908070246_close_trigger_function_execute.sql` measured is the only
-- control that holds on this project (functions created in `public` ignore the default-ACL row). EXECUTE is
-- checked when a trigger is CREATED, not when it fires, so revoking after the trigger exists is safe. The
-- proof is the function's own `proacl`, never the default-ACL row.
revoke execute on function public.stamp_contact_request_handled() from public, anon, authenticated, service_role;
--> statement-breakpoint

-- The grant narrows to `status`. The two stamp columns leave the admin's UPDATE; the admin UPDATE policy still
-- decides WHO, this still decides WHAT. Checked after applying with `has_column_privilege`, and the table-level
-- UPDATE with `has_table_privilege`, because a table-level grant would outrank a column revoke.
revoke update (handled_at, handled_by) on table public.contact_requests from authenticated;
