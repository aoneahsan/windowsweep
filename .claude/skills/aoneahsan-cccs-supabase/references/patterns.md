# Supabase patterns

## RLS policies

```sql
alter table public.posts enable row level security;

create policy "posts are readable by everyone"
  on public.posts for select
  using (true);

create policy "users insert their own posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

create policy "users update their own posts"
  on public.posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);   -- both clauses: `using` gates the row, `with check` gates the new values

create policy "users delete their own posts"
  on public.posts for delete
  using (auth.uid() = author_id);
```

`using` decides which existing rows the operation may touch; `with check` validates the resulting row. An
update policy with only `using` lets a user reassign `author_id` to someone else.

**One policy per operation.** A single `for all` policy is harder to reason about and usually too permissive
somewhere.

## 🔴 Three ways a policy fails that a migration never will (habitforge, 2026-08-16)

All three applied cleanly, passed every static gate, and were found only by requests carrying a real user's
JWT. **A policy is evaluated as the CALLER**, and everything below follows from that one sentence.

1. **A policy naming a function the calling role cannot EXECUTE 403s the WHOLE TABLE**, for everyone,
   including reads that would never have reached that branch. `security definer` changes who runs the BODY,
   never who may invoke it. So: a function called from an RPC → revoke, then grant deliberately; a function
   named in a **policy** → it must be executable by every role the policy applies to.
2. **A policy that reads its own table recurses** — `42P17 infinite recursion detected in policy for
   relation …`. The natural expression of "you are in the same group as this row" re-enters the policy.
   Move the lookup into a `security definer` helper, which runs as the owner and does not re-enter it.
   🔴 Invisible in psql, because `postgres` bypasses RLS — only a JWT request walks the policy.
3. **A policy may not read `auth.users`.** It 403s, and Postgres's HINT proposes
   `GRANT SELECT ON auth.users TO authenticated`, which would expose every account's email to every signed-in
   caller. The caller's own email is already in the JWT: use `auth.email()`. A `security definer` function
   beside it may still read the table — what a FUNCTION may read is not what a POLICY may.

🔴 **And a `citext` column cast to `::text` in a policy compares case-SENSITIVELY.**
`email::text = lower(auth.email())` compares the *stored* spelling against a lowered claim, so a row written
with capitals is invisible to the person it belongs to, for ever, while the definer function next to it
(which lowered both sides) disagrees. Write `email = (select auth.email())::citext`.

🔴 **Probe hygiene, learned the same day:** a probe whose subject still holds a privilege from an earlier
fixture proves nothing about the branch you meant to test — an account left as `superadmin` matched the admin
branch and made a real defect look fixed. And `Prefer: return=representation` reads the row back **inside the
same transaction**, so a column-restricted SELECT grant turns a legal UPDATE into a 403; use
`return=minimal`, or name the columns.

## Role checks without a join per row

```sql
create policy "admins read everything"
  on public.posts for select
  using ( (auth.jwt() ->> 'role') = 'admin' );
```

Reading the role from the JWT avoids a subquery against a `users` table on every row — which is both slow and
easy to get wrong under RLS (the subquery is itself subject to policies).

## Migrations — schema-as-code, not hand-written SQL

🔴 **`supabase migration new` is retired as the default.** The schema lives in `src/db/schema/*.ts`; Drizzle
diffs it and writes the SQL; the Supabase CLI applies it. One folder, one applier, one history.

```bash
# 1. edit src/db/schema/<module>.ts
npx drizzle-kit generate            # offline — needs no DB connection, so it runs before G2 passes
# 2. 🔴 READ the emitted SQL. It IS the migration
npx supabase db push --linked       # the one applier
npx supabase gen types typescript --linked > src/<path>/database.types.ts
```

What Drizzle cannot model — **functions, triggers, `grant`/`revoke`, `comment on`** — is authored with
`npx drizzle-kit generate --custom --name <thing>`, into the same folder under the same history.

🔴 **Drizzle emits no `revoke`.** A generated `create table` arrives with Postgres's default `PUBLIC` grants
and `anon` reaches `PUBLIC`, so **every `create table` migration ships a paired privilege block** or the
table is created open with every gate green.

🔴 **`supabase db reset` is BANNED and is NOT part of this flow.** It used to be the real test — replaying the
whole chain against a disposable local database proved the schema reconstructs from scratch. That database no
longer exists: `db reset` now drops and rebuilds the **live** one, and there is no copy to restore from.

What replaces it: **review the SQL before pushing**, keep every statement **idempotent and additive**, and
correct a mistake with a **new forward migration** rather than a rewind. On a project adopting the standard
over existing SQL, the proof that `schema.ts` matches reality is **two gates, not one**: a structural diff
with policies **excluded**, and a separate **policy-parity check against `pg_policies`**. 🔴 A single
"`generate` emits nothing" gate is decorative on the policy half — `drizzle-kit pull` writes both the schema
and the snapshot that diff compares, with the identical loss, so it agrees with itself.

Full standard, the RLS-in-schema API and the adoption recipe: **`aoneahsan-cccs-drizzle-orm`**.

## Client setup

`@supabase/supabase-js` stays the data-access client **everywhere** — Drizzle is schema, migrations and
types, never the reason a query bypasses a policy.

```ts
// Publishable key. Public by design — RLS is the boundary.
export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,   // sb_publishable_… — not the legacy JWT anon key
);
```

```ts
// Server only — never in a browser bundle, never committed outside ~/.secrets/
const admin = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!); // sb_secret_…
```

`Database` still comes from `supabase gen types typescript`, read from the **live** database — which is what
keeps it un-driftable from Drizzle's own inferred types. Regenerating it is a required step of every
migration.

## Queries within the budget

```ts
const { data, error } = await supabase
  .from('posts')
  .select('id, title, created_at, author:profiles(display_name)')   // the join Firestore cannot do
  .eq('status', 'published')
  .order('created_at', { ascending: false })
  .limit(20);                                                        // never unbounded
```

Keyset pagination:

```ts
.gt('created_at', cursor).order('created_at').limit(20)   // not .range() for deep pages
```

`.range()` is offset-based — fine for page two, wasteful at page fifty.

Counting:

```ts
const { count } = await supabase
  .from('posts')
  .select('*', { count: 'exact', head: true })   // head: true — no rows transferred
  .eq('status', 'published');
```

## Text search — the reason to be here

```sql
alter table public.posts add column search_vector tsvector
  generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body,''))) stored;

create index posts_search_idx on public.posts using gin(search_vector);
```

```ts
.textSearch('search_vector', query, { type: 'websearch' })
```

A generated column plus a GIN index gives real ranked search — the capability whose absence pushes
search-heavy features off Firestore.

## Capturing keys safely

```bash
supabase projects api-keys --project-ref <ref> -o json > /tmp/keys.json
# move the service_role value into ~/.secrets/<project>/ and delete the temp file
```

Never echo the service_role key to a terminal, a log, or chat.

## 🔴 There is no local stack (2026-08-06)

`supabase start` / `status` / `stop` and **`supabase db reset`** are **banned**. Every project runs against
**one hosted project** that serves development and production both, so a reset destroys live data and there is
no local copy to restore from.

```bash
npx drizzle-kit generate        # scaffold from schema.ts, review, then:
npx supabase db push --linked   # forward-only, idempotent, additive
```

Nothing runs until the gate for that step passes — see `provisioning-gate.md`.

## Measured on windowsweep, 2026-11-07

- **Prove an admin RPC on production without leaving a row:** a `DO` block that sets `request.jwt.claims`, runs
  `set local role authenticated`, calls the RPCs, then `raise exception 'PROBE_RESULT %'` carrying the result. Everything
  rolls back, and the result comes back in the error message.
- **CLI 3:** `supabase db push --remote=<ref> --dry-run`, then without it, with `SUPABASE_ACCESS_TOKEN` and
  `SUPABASE_DB_PASSWORD` in the environment (never a flag). No Docker, no `link`.
