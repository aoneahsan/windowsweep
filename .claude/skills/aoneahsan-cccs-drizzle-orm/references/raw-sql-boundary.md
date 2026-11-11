# The raw-SQL boundary

## What Drizzle models, and what it does not

| Drizzle owns it — declare in `src/db/schema/` | Drizzle cannot see it — `generate --custom` |
|---|---|
| tables, columns, defaults, constraints | **functions** and procedures |
| indexes (including `gin`, partial, expression) | **triggers** |
| enums | **`grant`** / **`revoke`** |
| views and materialized views | **`comment on`** |
| sequences | `alter default privileges` |
| roles (with `entities.roles`) | extensions, publications, `pg_cron` jobs |
| **RLS policies** (`pgPolicy`) | anything in `auth`, `storage` or `realtime` |

🔴 **On a real project the right-hand column is the majority of the SQL.** Measured across two of the fleet's
projects: 26 tables against 148 functions and 201 grant/revokes; 40 tables against 65 functions and 272
grant/revokes. Anyone who assumes "the ORM owns the schema" will be wrong about most of the file.

## The `--custom` workflow

```bash
npx drizzle-kit generate --custom --name close_posts_privileges
# → supabase/migrations/20260821143500_close_posts_privileges.sql, empty. Hand-write it.
```

It lands in the same folder, gets the same timestamp ordering, and is applied by the same
`supabase db push`. **One folder, one applier, one history** survives the split — that is the whole point of
routing raw SQL through drizzle-kit instead of `supabase migration new`.

## 🔴 The paired privilege block

Drizzle emits **no `revoke`**. A generated `create table` therefore arrives with Postgres's default `PUBLIC`
grants, and `anon` reaches `PUBLIC`. RLS filters rows; it does not remove a grant. So the table is created
open, every gate stays green, and nothing surfaces it.

**Every `create table` migration ships its privilege block** — either appended to the generated file or as a
`--custom` migration generated immediately after it:

```sql
revoke all on table public.posts from public, anon, authenticated;
-- 🔴 service_role is the FOURTH role, and it is the one people forget.
revoke truncate, references, trigger, maintain on table public.posts from service_role;
grant select on table public.posts to anon, authenticated;
grant insert (author_id, title, status), update (title, status) on table public.posts to authenticated;
```

🔴 **`service_role` needs its own line, and omitting it is invisible.** Supabase's default ACL for a new
table in `public` is `arwdDxtm` for `anon`, `authenticated` **and** `service_role` alike (check
`pg_default_acl`). A block that names only the first two leaves `service_role` holding **`TRUNCATE`** — and
`service_role` **bypasses RLS entirely**, while RLS does not police `TRUNCATE` in any case. Keep its
`select/insert/update/delete`: that is the legitimate server-side plane. Withdraw only the four privileges no
application code ever needs.

🔴 **`information_schema.table_privileges` CANNOT SEE `MAINTAIN`** (PG17). It is not in the SQL-standard view,
so a privilege census built from it reports a clean set while the privilege is held. Measured on labflow
2026-08-21: the census said clean, `has_table_privilege('service_role', …, 'MAINTAIN')` said `true` on every
table. **Ask `has_table_privilege`, or read `aclexplode(pg_class.relacl)`** — and wrap `relacl` in
`coalesce(relacl, acldefault('r'::"char", relowner))`, because a table nobody has explicitly granted anything
has a NULL `relacl` and would otherwise be skipped rather than measured.

🔴 **A column grant layered on the default ACL is a silent no-op** — revoke first, then grant narrowly. And
`alter default privileges … revoke … from anon, authenticated` does **not** close the default, because
Postgres grants EXECUTE to **`PUBLIC`** (`~/.claude/rules/data-fetch-budget.md`).

🔴 **A `create table` migration with no companion privilege statement is incomplete, not small.** Treat a
generated file that adds a table and nothing else as unfinished work.

## Functions a policy calls

```sql
create or replace function private.is_team_member(p_team_id bigint)
returns boolean language sql security definer set search_path = '' as $$
  select exists (
    select 1 from public.team_members
    where team_id = p_team_id and user_id = (select auth.uid())   -- 🔴 check the caller INSIDE the body
  );
$$;

revoke execute on function private.is_team_member(bigint) from public, anon, authenticated, service_role;
grant  execute on function private.is_team_member(bigint) to authenticated;
```

`security definer` changes who runs the **body**, never who may **invoke** it. Both statements are required,
and neither is expressible in `schema.ts`.

## 🔴 Three ways a policy fails that a migration never will

All three apply cleanly, pass every static gate, and are found only by a request carrying a real user's JWT.
**A policy is evaluated as the CALLER** — everything below follows from that one sentence. Writing the policy
in `pgPolicy` instead of raw SQL changes none of it.

1. **A policy naming a function the calling role cannot EXECUTE 403s the WHOLE TABLE** — for everyone,
   including reads that would never have reached that branch. A function named in a **policy** must be
   executable by every role the policy applies to.
2. **A policy that reads its own table recurses** — `42P17 infinite recursion detected in policy for
   relation …`. The natural expression of "you are in the same group as this row" re-enters the policy. Move
   the lookup into a `security definer` helper, which runs as the owner and does not re-enter it.
   🔴 Invisible in `psql`, because `postgres` bypasses RLS — only a JWT request walks the policy.
3. **A policy may not read `auth.users`.** It 403s, and Postgres's HINT proposes
   `GRANT SELECT ON auth.users TO authenticated`, which would expose every account's email to every signed-in
   caller. The caller's own email is already in the JWT: use `auth.email()`. A `security definer` function
   beside it may still read the table — **what a FUNCTION may read is not what a POLICY may.**

🔴 **A `citext` column cast to `::text` in a policy compares case-SENSITIVELY.**
`email::text = lower(auth.email())` compares the *stored* spelling against a lowered claim, so a row written
with capitals is invisible to the person it belongs to, for ever, while the definer function next to it
(which lowered both sides) disagrees. Write `email = (select auth.email())::citext`.

## Probe hygiene

- Probe as a **non-admin** test account (`t1+1`/`t1+2`), never as an admin — `isAdmin` short-circuits the
  exact bug you are hunting.
- **Seed first.** A `(200, 0)` result proves nothing; zero rows pass vacuously.
- A forbidden `INSERT` is `403`; a forbidden `UPDATE`/`DELETE` is **`200` with 0 rows**. An assertion that
  only checks for 2xx proves nothing either way.
- A probe whose subject still holds a privilege from an earlier fixture proves nothing about the branch you
  meant to test.
- `Prefer: return=representation` reads the row back **inside the same transaction**, so a column-restricted
  SELECT grant turns a legal UPDATE into a 403. Use `return=minimal`, or name the columns.

## The paired privilege block, as stated in SKILL.md (moved verbatim, 2026-11-02)

🔴 **Every generated `create table` ships a paired privilege block, closing FOUR roles.** Drizzle emits no
`revoke`, so a new table otherwise arrives with Postgres's default `PUBLIC` grants — the exact silent-hole
trap in `~/.claude/rules/data-fetch-budget.md`. 🔴 **`service_role` is the one that gets forgotten**: it
bypasses RLS outright and Supabase's default ACL hands it `TRUNCATE`, which RLS does not police. And
**`information_schema` cannot see `MAINTAIN`**, so a census built from it reports clean while the privilege
is held — ask `has_table_privilege` or `aclexplode`. A `create table` migration with no companion privilege
statement is an incomplete migration, not a small one.
