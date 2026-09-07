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
| `migrations/*_cynical_ken_ellis.sql` | Generated: the two tables, RLS enabled, seven policies |
| `migrations/*_magical_franklin_storm.sql` | Hand-written: the **paired privilege block** |
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
