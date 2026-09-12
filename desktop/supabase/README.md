# Supabase for the desktop app

Sign-in and sync are the only things in this product that touch a network. The
command-line engine makes no network calls at all, and the desktop window makes
none until a person signs in or accepts a telemetry destination.

**Supabase replaced Firebase on 2026-09-05**, on the owner's standing directive
that Supabase is the default backend for every new project
(`~/.claude/rules/services-integrations.md`). Nothing had been created on Firebase
yet, so the switch cost code and no data.

## What is here

| Path | What it is |
|---|---|
| `../src/db/schema/sync.ts` | 🔴 **The schema, as TypeScript.** Drizzle authors it; the Supabase CLI applies it |
| `../src/db/schema/site.ts` | The marketing site's three tables, in the same home (decision P8-D2) |
| `migrations/*_cynical_ken_ellis.sql` | Generated: the two sync tables, RLS enabled, seven policies |
| `migrations/*_magical_franklin_storm.sql` | Hand-written: the **paired privilege block** |
| `migrations/*_platform_admin_function.sql` | Hand-written: `is_platform_admin()`, the definer every admin policy calls |
| `migrations/*_site_tables.sql` | Generated: `profiles`, `contact_requests`, `admin_audit` + 8 policies |
| `migrations/*_site_privileges_and_triggers.sql` | Hand-written: column-scoped grants, the three triggers |
| `migrations/*_seed_platform_superadmins.sql` | Hand-written: the two fixed owner emails |
| `migrations/*_close_trigger_function_execute.sql` | Hand-written: the per-function revokes, and the correction behind them |
| `migrations/*_delete_my_account_function.sql` | Hand-written: **account deletion** — see below |
| `migrations/*_revoke_is_platform_admin_service_role.sql` | Hand-written: removes `service_role`'s EXECUTE on `is_platform_admin()`, which the older migration's `from public, anon` revoke had left standing. `authenticated` keeps it - every admin policy calls it as the querying user. Verified from `pg_proc` on 2026-09-13: `authenticated=X/postgres` and nothing else beside the owner |
| `rollbacks/` | One reviewed companion per migration. 🔴 Never applied automatically |
| `../drizzle.config.ts` | The three load-bearing keys, each destructive if omitted |

## The data model, in full

```
user_settings   user_id (PK → auth.users) · email · display_name · prefs (jsonb)
                developer · settings_updated_at · last_seen_at · created_at

runs            run_id (PK) · user_id (→ auth.users) · started_at · mode
                dry_run · elevated · sections (smallint[]) · freed_bytes
                estimated_bytes · duration_ms
```

That is the entire model. 🔴 **No path, folder name, drive label, machine name or
user name is stored anywhere** — which is what the Account screen promises. The
promise is kept in two independent places: `stripRun` in `src/lib/sync.ts` narrows
the object before it is sent, and **there is no column here that could hold one**,
so a client that tried would be refused by the server rather than reviewed.

`runs` is append-only. It has no update policy and no update grant, because a run
is a record of something that already happened — an editable one is a record that
can be made to disagree with the log file it was written from.

## Two things that look like detail and are not

🔴 **Drizzle emits no `revoke`, so the privilege block is a separate migration.**
A generated `create table` arrives with Postgres's default grants, and on Supabase
the default ACL names `anon`, `authenticated` and `service_role` explicitly — so
`revoke … from public` alone removes a grant they never used and leaves theirs
standing. RLS filters *rows*; it never removes a *grant*. A `create table`
migration without its privilege block is incomplete, not small.

🔴 **`user_settings` must never be written with `.upsert()`.** PostgREST builds
`ON CONFLICT DO UPDATE SET` from every payload key, and Postgres checks the
privilege at **plan** time. `user_id` is deliberately outside the column-scoped
UPDATE grant, so an upsert carrying it is refused outright with
`permission denied for table user_settings` — naming the *table*, not the column,
which reads exactly like a broken policy. `sync.ts` inserts and handles `23505`.

## Account deletion — `public.delete_my_account()`

Owner decision D14 (2026-09-12). `/privacy` promises a person can delete their
account; this function is the whole server half of that promise, and it is
deliberately one statement:

```sql
delete from auth.users where id = auth.uid();
```

**What goes.** Four foreign keys into `auth.users` are `on delete cascade`, so
that one statement takes `public.profiles`, `public.user_settings`,
`public.runs` and `public.contact_requests` with it, plus the person's
`auth.sessions` and `auth.identities` — which is what makes the account gone
rather than merely unreachable. **The app deletes nothing row by row**, and no
client holds a DELETE grant it would need to.

**What stays, on purpose.** `public.admin_audit` is not user-owned: it records
what an *admin* did, and its `actor` column carries no foreign key, as does
`contact_requests.handled_by`. An audit trail a person can erase by deleting
their own account is not an audit trail.

**Who may execute it.** `authenticated`, and nobody else — not `anon`, not
`service_role`, not PUBLIC. It takes **no argument** and reads only
`auth.uid()`, so which account it deletes is not an input a caller supplies and
therefore not one a caller can forge; there is no admin path to deleting
somebody else's account, and when one is wanted it will be its own function with
its own gate rather than a widened grant on this one.

🔴 **The `raise` is the authentication step and it must stay inside the body.**
`delete … where id = auth.uid()` with a null uid matches zero rows and
*succeeds* — PostgREST would answer `204` and a caller who was never signed in
would be told their account was deleted. The function raises `42501` first.

### Verify it — from `pg_proc`, and then for real

Catalogue, over the Management API (which runs as `postgres`). Measured
2026-09-12, immediately after `supabase db push --linked`:

```sql
select p.proname, pg_get_userbyid(p.proowner) as owner, p.prosecdef,
       p.proconfig::text, p.proacl::text,
       has_function_privilege('anon', p.oid, 'EXECUTE')          as anon_exec,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_exec,
       has_function_privilege('service_role', p.oid, 'EXECUTE')  as svc_exec
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.proname = 'delete_my_account';
```

```
owner postgres · prosecdef t · proconfig {"search_path=\"\""} · lanname plpgsql
proacl {postgres=X/postgres,authenticated=X/postgres}
anon_exec f · auth_exec t · svc_exec f
```

🔴 **`proacl` is the only proof, and it is not optional reading.** A function
created in `public` on this project is born `proacl = NULL`, which is EXECUTE to
PUBLIC — the `alter default privileges` in migration `20260908065314` has no
effect here, because a second `pg_default_acl` row granted by `supabase_admin`
covers the same `(schema, object type)`. `pg_default_acl` reads closed either
way. Every function added to this schema carries its own explicit revoke.

Behaviour, over PostgREST against a **seeded** throwaway user — a `(200, 0)` on
an empty database passes vacuously, so the rows have to exist first. Measured
2026-09-12 on `aoneahsan.apps.t1+2@gmail.com` (created confirmed through
`POST /auth/v1/admin/users`, seeded one row in each of the four cascading
tables, deleted by its own call, nothing left behind):

| Caller | `POST /rest/v1/rpc/delete_my_account` |
|---|---|
| publishable key only (`anon`) | **401** `42501 permission denied for function delete_my_account` |
| publishable key as `apikey` **and** bearer | **401** `42501`, same message |
| secret key (`service_role`) | **403** `42501`, same message |
| the user's own JWT | **204 No Content** |
| `postgres`, no JWT — reaches the body | `42501 delete_my_account() requires an authenticated caller` |

The 401/403 split is PostgREST's: the same refusal is `401` when the request
carried no JWT and `403` when it carried one. Both are the **grant** refusing at
the door, before the body runs; the last row is the only one that reaches the
`raise`, which is why it is probed separately rather than assumed.

Counts for that user, before the call and after it: `auth.users` 1 → **0**,
`profiles` 1 → **0** (the signup trigger had made it), `user_settings` 1 → **0**,
`runs` 1 → **0**, `contact_requests` 1 → **0**, `auth.identities` 1 → **0**.
`admin_audit` was 0 throughout and is untouched.

⚠️ One honest gap in that run: `auth.sessions` was counted **0 before the
sign-in** and **0 after the delete**, so the session the password grant created
was never counted while it existed — the table's 0 afterwards is real, the
transition is not measured. What the sessions claim rests on instead is the
catalogue: `sessions_user_id_fkey` reads `confdeltype = 'c'`, as do the seven
other `auth.*` foreign keys into `auth.users`.

## Applying it

🔴 **`supabase db push` is the ONE applier.** Never `drizzle-kit push` (applies
with no reviewable SQL) and never `drizzle-kit migrate` (a second history table).

```bash
yarn db:generate                       # offline - needs NO database connection
                                       # 🔴 then READ the emitted SQL. It IS the migration
npx supabase db push --linked
```

The equivalence gate is what proves the two agree: after a push, `yarn db:generate`
must produce **"No schema changes, nothing to migrate"**. A residual statement is
either a `schema.ts` defect — fix the file, never the database — or a documented
lossless difference. Nothing proceeds past a diff nobody has explained.

## The project — created, linked, applied

`docs/MANUAL-TASKS.md` row 23 **landed on 2026-09-07**. It needed two steps
because all 7 registered accounts held 2 projects each — the free-tier limit, 14
of 14 slots used — so the owner created an eighth account first.

| | |
|---|---|
| ref | `nlmetjyytgwaxcliusuo` |
| region | `ap-south-1` |
| account | FilesHub id 8, `aoneahsan.amp.p1@gmail.com` |
| Postgres | 17.6.1 (so migration 2's `MAINTAIN` is valid — it arrived in PG 17) |

🔴 **Resolve the ref from the FilesHub vault, never from this table.** The vault
is the source; a table in a file is a snapshot, and a wrong ref migrates someone
else's database. `GET /projects/windowsweep/vault` → the `supabase` block.

Both migrations were applied with `supabase db push --linked` on 2026-09-07 and
verified from the catalogs (below), not from these files.

## Row 15 is what still blocks sign-in

🔴 **Google is not enabled** — `GET /auth/v1/settings` reports
`external.google: false`. Supabase owns the OAuth redirect, so it needs a **Web**
client whose authorised redirect URI is
`https://nlmetjyytgwaxcliusuo.supabase.co/auth/v1/callback`, with its id and
secret entered in Supabase's own Auth → Providers form. The app never sees
either — it asks Supabase for a provider URL and gets a code back on its loopback
listener.

So `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` stay **empty** even
though the database is ready: filling them would make `configuredFeatures()`
advertise sign-in that cannot complete. Sign-in and sync remain compiled and
dormant, the Account screen says so instead of failing on press, and every
cleanup feature works exactly as it does now.

## Verify against the database, never against these files

These files describe intent, and intent is exactly what diverges. After a push:

```sql
-- grants: no app table should show arwd for anon
select table_name, grantee, string_agg(privilege_type, ',' order by privilege_type)
from information_schema.role_table_grants
where table_schema = 'public' and grantee in ('anon','authenticated','service_role')
group by table_name, grantee order by table_name;

-- policies: read them from pg_policies, never from a drizzle-kit pull
select tablename, policyname, cmd, qual, with_check from pg_policies
where schemaname = 'public' order by tablename, policyname;
```

🔴 `drizzle-kit pull` silently drops `using`/`with check` from every policy after
the first on a table, and a SELECT policy with no `USING` is `USING (true)` — so
every artefact it writes carries the same loss and no gate built from them can see
it. This project is greenfield, so `pull` never runs; the note is here so it stays
that way.

### Which instrument, and one that does not work

🔴 **There is no `psql` on this machine, and `supabase db query --linked` returns
403** on CLI 2.107.0 (`Your account does not have the necessary privileges to
access this endpoint`) — while the Management API endpoint it wraps answers the
identical query as `postgres`. Use the endpoint directly:

```
POST https://api.supabase.com/v1/projects/<ref>/database/query
Authorization: Bearer <sbp_ PAT from the FilesHub ACCOUNT vault>
{"query":"select ..."}
```

🔴 **And it is the wrong instrument for the other question.** It runs as
`postgres`, which holds `rolbypassrls`, so it proves what the schema *is* and
nothing about whether a policy *holds*. Two questions, two instruments: catalogs
over the Management API; behaviour over PostgREST with a real user's JWT, against
**seeded** rows — a `(200, 0)` on an empty table passes vacuously.

### Two objects in `public` that are NOT ours

Both were verified on 2026-09-07 and neither is a hole. Recorded so the next
session neither panics nor "fixes" them.

- **`fileshub-project-status-check`** — FilesHub's keepalive table, which is what
  stops the free project auto-pausing at ~7 days idle. RLS is enabled with **0
  policies** and `anon`/`authenticated` hold **no grant on it**, so nothing but a
  `bypassrls` role reads it. `service_role` holds `arwdDxtm`. Leave it alone:
  revoking would break the keepalive.
- **`rls_auto_enable()`** — a `SECURITY DEFINER` **event trigger** function
  (`ensure_rls`, on `ddl_command_end`) that enables RLS on any new `public` table.
  Its ACL grants `EXECUTE` to PUBLIC, so Supabase's advisors raise two WARNs
  claiming `anon` can call it at `/rest/v1/rpc/rls_auto_enable`. 🔴 **That is a
  false positive, and it was probed rather than assumed:** the call returns
  `400 0A000 cannot display a value of type event_trigger` for both `anon` and
  `authenticated` — it never enters the body — and PostgREST does not advertise it
  in the OpenAPI surface at all. Its only effect is to *enable* RLS. A
  `revoke execute … from public, anon, authenticated` would silence the advisors;
  it is not applied here because the function is not ours and a migration
  referencing it would not replay against a fresh database.
