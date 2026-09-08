-- The paired privilege block and the three triggers for the site tables created
-- in the previous migration.
--
-- 🔴 WHY THIS FILE EXISTS. Drizzle emits no `revoke`, no `grant`, no function and
-- no trigger, so a generated `create table` arrives carrying whatever the default
-- ACL hands out. RLS filters ROWS; it never removes a GRANT, and policies police
-- rows, never columns. Every column-level rule the schema file states in prose -
-- `platform_role` writable by nobody, `email` written only by the signup trigger,
-- an admin able to touch only the three triage columns - is enforced HERE or it
-- is not enforced anywhere.
--
-- 🔴 `revoke ... from public` ALONE IS NOT ENOUGH ON SUPABASE. Its default ACL
-- names `anon`, `authenticated` and `service_role` explicitly, so revoking PUBLIC
-- removes a grant those three never used and their named grants stand untouched.
-- Name all four, every time.
--
-- Verify the result from `information_schema.role_table_grants` and
-- `information_schema.column_privileges`, never from this file - this describes
-- intent, and intent is exactly what diverges.

-- ===========================================================================
-- 1. Take everything back first.
--
--    The order is load-bearing: a `grant (cols)` layered on a table-wide grant
--    is a SILENT NO-OP, because a grant adds and never subtracts, so the broad
--    one wins and the narrow one reads like protection that is not there.
--
--    `revoke all` also covers TRUNCATE, REFERENCES, TRIGGER and MAINTAIN.
--    RLS does not police TRUNCATE - it is a table-level operation, so no policy
--    runs and every row goes at once. REFERENCES lets a caller point a foreign
--    key at the table and probe row existence through constraint violations, a
--    side channel around the SELECT policy. TRIGGER lets a caller attach code to
--    another person's writes. `service_role` is named on purpose: leaving it out
--    gives the one role that cannot read a single row the ability to erase every
--    table.
-- ===========================================================================
revoke all on table public.profiles from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.contact_requests from public, anon, authenticated, service_role;
--> statement-breakpoint
revoke all on table public.admin_audit from public, anon, authenticated, service_role;
--> statement-breakpoint

-- Re-assert the table default, so this file is self-sufficient on a replay
-- rather than depending on the migration that first set it. Idempotent.
alter default privileges in schema public
  revoke all on tables from public, anon, authenticated, service_role;
--> statement-breakpoint

-- ===========================================================================
-- 2. Grant back exactly what the site does, and nothing else.
--
--    `anon` gets NOTHING on any of the three. Every one of these surfaces is
--    behind sign-in by design - decision P8-D1 - and that is what lets the rate
--    limit and the ownership policy be real instead of a captcha guess.
--
--    `service_role` gets NOTHING either. The site has no server plane: no Edge
--    Function, no secret key, no backend route. A grant nothing legitimately
--    uses is pure blast radius.
-- ===========================================================================

-- profiles ------------------------------------------------------------------
--
-- 🔴 NO INSERT GRANT AT ALL. The `on_auth_user_created` trigger is the only
-- writer of a profile row, which is what stops a client minting one under an id
-- it chose.
--
-- 🔴 `platform_role` IS IN NO GRANT ON ANY LINE OF THIS FILE. Not for a user,
-- not for an admin, not for `service_role`. PostgREST therefore cannot write it
-- for any caller under any policy. This is the ONLY mechanism that holds: a
-- policy decides which rows you may update, and once table-wide UPDATE exists,
-- "your own row" includes your own role. Postgres's own HINT on the resulting
-- refusal - `GRANT UPDATE ON public.profiles TO authenticated` - would undo
-- exactly this. Never follow it.
--
-- 🔴 `email` is likewise out of the UPDATE grant: it mirrors `auth.users.email`
-- and the signup trigger is its single writer. Two writers for one fact means
-- the answer depends on which path wrote last.
--
-- 🔴 `updated_at` is out of the grant AND maintained by a blanket BEFORE UPDATE
-- trigger below. Both halves are required - either alone leaves the invariant
-- client-writable, and RLS cannot police a column.
grant select on table public.profiles to authenticated;
--> statement-breakpoint
grant update (display_name) on table public.profiles to authenticated;
--> statement-breakpoint

-- contact_requests ----------------------------------------------------------
--
-- The sender may set only the three fields a message consists of. `status`,
-- `created_at`, `handled_at` and `handled_by` are out of the INSERT grant, so
-- nobody can file a request that is already handled or backdated. `id` is out
-- too: identity is the server's to assign, from the column default.
--
-- 🔴 CONSEQUENCE, AND IT IS NOT OPTIONAL: never `.upsert()` this table.
-- PostgREST builds `ON CONFLICT DO UPDATE SET` from every payload key and
-- Postgres checks the privilege at PLAN time, so the write is refused before it
-- runs even when nothing conflicts - `permission denied for table
-- contact_requests`, naming the TABLE and not the column, which reads exactly
-- like a broken policy. Insert, and handle `23505`.
grant select on table public.contact_requests to authenticated;
--> statement-breakpoint
grant insert (user_id, subject, message) on table public.contact_requests to authenticated;
--> statement-breakpoint
-- Triage, and only triage. The admin UPDATE policy decides WHO; this decides
-- WHAT. A non-admin holds this same column grant - grants are role-wide - and is
-- stopped by having no UPDATE policy that passes, which surfaces as
-- 200-with-0-rows rather than a refusal. Assert the row count, never the status.
grant update (status, handled_at, handled_by) on table public.contact_requests to authenticated;
--> statement-breakpoint
-- No DELETE grant: nobody deletes a contact request through the API. A sender's
-- rows go when their account does, by the cascade on `user_id`.

-- admin_audit ---------------------------------------------------------------
--
-- 🔴 SELECT AND NOTHING ELSE, FOR ANYONE. No INSERT, no UPDATE, no DELETE, to
-- any role, on any line. Rows arrive only from the `security definer` trigger
-- below, which writes as the table owner and so needs no grant to exist for it.
-- A tamper-evident chain over a forgeable insert is a chain of custody with no
-- custody: append-only and tamper-evident are different properties, and only the
-- write grant defends the claim that an entry is TRUE.
grant select on table public.admin_audit to authenticated;
--> statement-breakpoint

-- ===========================================================================
-- 3. Triggers.
--
--    All of these are fired by the trigger mechanism, which checks EXECUTE when
--    the trigger is CREATED and not when it fires. Combined with the default
--    revoke in the function migration, they are therefore reachable by nothing
--    at `POST /rest/v1/rpc/...` - they are not a second call plane, and their
--    `proacl` is what proves it.
-- ===========================================================================

-- 3a. profiles.updated_at ---------------------------------------------------
--
-- Deliberately NOT `security definer`: it touches only NEW and needs no
-- privilege of its own. And deliberately a BLANKET `before update` with no
-- column list, so there is no write that can dodge it - an `update of <cols>`
-- list is exactly how a trigger-maintained column stays stale when the column
-- itself is the one being written.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
--> statement-breakpoint

create or replace trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();
--> statement-breakpoint

-- 3b. the profile row, created at signup -------------------------------------
--
-- 🔴 THIS TRIGGER LIVES ON `auth.users`, IN THE `auth` SCHEMA. A census bounded
-- to `public` cannot see it, and replaying the chain without it leaves every
-- future signup with no profile row - which means no role, which means the admin
-- policies answer false for everyone, silently. When auditing triggers, query
-- across ALL schemas.
--
-- It stamps `superadmin` for the two fixed owner emails at the moment their row
-- appears. That is the entire seeding path for the role: `platform_role` is in
-- no grant, so there is no API through which it could be set instead.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, email, display_name, platform_role)
  values (
    new.id,
    new.email,
    nullif(
      trim(coalesce(
        new.raw_user_meta_data ->> 'full_name',
        new.raw_user_meta_data ->> 'name',
        ''
      )),
      ''
    ),
    case
      when lower(new.email) in ('zaionsmanager@gmail.com', 'aoneahsan@gmail.com')
        then 'superadmin'
      else 'user'
    end
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;
--> statement-breakpoint

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
--> statement-breakpoint

-- 3c. the contact-request rate limit -----------------------------------------
--
-- Five per person per rolling hour; the sixth is refused.
--
-- 🔴 IT COUNTS `auth.uid()`, NOT `new.user_id`, AND THAT IS THE POINT. A BEFORE
-- INSERT trigger fires before the policy's WITH CHECK is evaluated, so a caller
-- who put somebody else's id in `user_id` would - if this counted `new.user_id` -
-- get a 429 or a 403 depending on how many requests THAT person had filed in the
-- last hour. Their own insert fails either way, but the difference in the two
-- refusals is an oracle about a stranger. Counting the caller removes it.
--
-- A null `auth.uid()` means the insert is not coming through PostgREST at all -
-- `anon` holds no INSERT grant, and an authenticated JWT always carries `sub` -
-- so it is a reviewed SQL or service-role statement, a plane this does not
-- govern.
--
-- `security definer` so the count is the true count: it must not shrink because
-- somebody later narrows the SELECT policy.
--
-- SQLSTATE `PT429` is PostgREST's own convention - a `PTxxx` code sets the HTTP
-- status to xxx - so the browser sees 429 rather than a generic 400.
create or replace function public.enforce_contact_request_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor uuid := (select auth.uid());
  recent integer;
begin
  if actor is null then
    return new;
  end if;

  select count(*) into recent
    from public.contact_requests c
   where c.user_id = actor
     and c.created_at > now() - interval '1 hour';

  if recent >= 5 then
    raise exception 'Too many contact requests: 5 per hour. Please try again later.'
      using errcode = 'PT429';
  end if;

  return new;
end;
$$;
--> statement-breakpoint

create or replace trigger contact_requests_rate_limit
  before insert on public.contact_requests
  for each row
  execute function public.enforce_contact_request_rate_limit();
--> statement-breakpoint

-- 3d. the audit row ----------------------------------------------------------
--
-- Fires on any change to the three columns an admin is able to write - which is
-- every change an admin can make to this table, because the column grant above
-- allows nothing else. Narrowing this to `status` alone would leave a rewrite of
-- `handled_by` unaudited, and `handled_by` is who is answerable for the message.
--
-- `security definer` is what lets it write to a table holding no INSERT grant
-- for anybody. That asymmetry is the design: the only way a row lands here is
-- this function, so an entry cannot be forged by the person it names.
create or replace function public.audit_contact_request_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.admin_audit (actor, action, subject_table, subject_id, before, after)
  values (
    (select auth.uid()),
    case
      when old.status is distinct from new.status then 'contact_request.status_changed'
      else 'contact_request.triaged'
    end,
    'contact_requests',
    old.id::text,
    jsonb_build_object(
      'status', old.status,
      'handled_at', old.handled_at,
      'handled_by', old.handled_by
    ),
    jsonb_build_object(
      'status', new.status,
      'handled_at', new.handled_at,
      'handled_by', new.handled_by
    )
  );

  return null;
end;
$$;
--> statement-breakpoint

create or replace trigger contact_requests_audit
  after update on public.contact_requests
  for each row
  when (
    old.status is distinct from new.status
    or old.handled_at is distinct from new.handled_at
    or old.handled_by is distinct from new.handled_by
  )
  execute function public.audit_contact_request_status();
