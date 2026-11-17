---
name: aoneahsan-cccs-drizzle-orm
description: 'Drizzle ORM as the fleet standard for Supabase schema and migrations: TypeScript schema-as-code as the single source of truth, RLS policies declared in it, offline migration generation, and the split with the raw SQL Drizzle cannot model. Use when changing a table, column, index, enum, view or RLS policy; generating, reviewing, applying or rolling back a migration; adopting the standard in a project with hand-written SQL migrations; or choosing an ORM for Postgres.'
metadata:
  author: aoneahsan
  established: 2026-08-21
  decision: owner directive — one ORM, fleet-wide, for migrations/history/control
---

# Drizzle ORM — schema and migrations

**Drizzle authors the schema. The Supabase CLI applies it.** One folder, one applier, one history table.

`src/db/schema/*.ts` is the single source of truth; `drizzle-kit generate` (offline) writes flat timestamped SQL
into `supabase/migrations/`, applied by `supabase db push` and nothing else. Why not Prisma: `OVERVIEW.md`.

## 🔴 FIRST: is this project already adopted?

Check before anything else — **re-running the recipe on an adopted project is the damage**, not the fix.
`ls src/db/schema/` and `grep '^### DONE-' PENDING-TASKS.md docs/DONE-TASKS.md`. A schema folder or a closed
entry means adoption is **finished**: read its evidence record, work the named leftovers, and never re-run
step 1. "Finish the migration" said to an adopted project means *close its open rows*, not *start over*.

## 🔴 Banned

| Banned | Why |
|---|---|
| `drizzle-kit push` | no reviewable SQL, and it proposes dropping objects it does not model |
| `drizzle-kit migrate` | a **second** history table. The Supabase CLI is the only applier |
| `drizzle-orm@rc` · `drizzle-kit@rc` | the beta emits a **directory** per migration, unreadable by the Supabase CLI. 🔴 Supabase's own guide says install `@rc` — **do not.** Stable only: `~/.claude/rules/package-version-known-issues.md` |
| `supabase db reset` | unchanged — dev **is** prod |

## 🔴 Drizzle does not model most of your DDL

It models **tables, columns, indexes, enums, views, sequences, roles and policies**. It does **not** model
**functions, triggers, `grant`/`revoke`, or `comment on`** — which on a real project is the majority of the
SQL. Those are authored with `drizzle-kit generate --custom`, into the same folder under the same history.

🔴 **Every generated `create table` ships a paired privilege block, closing FOUR roles** — Drizzle emits no
`revoke`; 🔴 **`service_role` is the one that gets forgotten** (it holds `TRUNCATE`, which RLS does not police),
and `information_schema` cannot see `MAINTAIN`. Read `references/raw-sql-boundary.md` before any `create table`.

## Data access does not change

`@supabase/supabase-js` stays the client **everywhere** — the browser cannot hold a Postgres connection, and
an Edge Function invoking with the caller's JWT is what keeps RLS applying. **Drizzle is schema, migrations
and types; never the reason a query bypasses a policy.**

Two type surfaces, one origin: `database.types.ts` keeps coming from `supabase gen types typescript`, read
from the live database. **Regenerating it is a required step of every migration.**

## The loop

```bash
# 1. edit src/db/schema/<module>.ts
npx drizzle-kit generate            # offline — no DB connection
# 2. 🔴 READ the emitted SQL. Always. It is the migration
npx supabase db push --linked       # the one applier
npx supabase gen types typescript --linked > src/<path>/database.types.ts
# 3. probe the new policies as a NON-ADMIN against seeded rows — 403/200
```

Raw SQL Drizzle cannot express: `npx drizzle-kit generate --custom --name <thing>`, then hand-write it.

## 🔴 Is the chain replayable? Ask before you need the answer

A chain written into history by `migration repair` has **never run**. If a policy calls a function, the
recipe's file order is circular and the chain cannot apply — measured on the trizlink pilot, which read as
*adopted, 12/14* while unable to execute a single migration. The order that works is
**tables → functions → policies → triggers/grants → data**, with `set check_function_bodies = off` in the
functions file. Details and the replay form of criterion 11: `references/adoption.md`.

🔴 **Census triggers across ALL schemas, never just `public`** — a trigger on `auth.users` is invisible to a
public-bounded census, and replaying without it leaves every future signup without a profile row.

## Rollbacks, honestly

Neither tool generates `down` migrations. Every migration ships a **reviewed**, **never auto-applied** companion
at `supabase/rollbacks/<same-name>.sql`; using one is a new forward migration. Read `references/adoption.md` →
"Rollbacks" before writing one.

## 🔴 NEVER trust `drizzle-kit pull` — two shipped corruption classes

It **silently drops `using`/`withCheck` from every policy after the FIRST on a table** (a SELECT with no `USING`
is `USING (true)`) and **scrambles opclasses on composite indexes**. **Transcribe policies from `pg_policies`,
never from `pull`; strip every `.op()`** unless genuinely intended. Read `references/pull-defects.md` before
any retrofit.

## 🔴 The gate: policy parity against `pg_policies`

An equivalence gate **structurally cannot catch the above**. Diff `drizzle-kit export` against **`pg_policies`**
— pass is **0 missing · 0 mismatched**; 🔴 canonicalise both sides through Postgres, never a hand regex; 🔴 prove
the gate non-vacuous twice. The worked test: `references/pull-defects.md` · step 7b in `references/adoption.md`.

## Going deeper

📋 **Drop-in session prompt** — hand a fresh session the whole job (triage, bans, the five shipped defects,
the 14 criteria, verification, how to close): `~/.claude/rules-detail/drizzle-adoption-prompt.md`.

- `references/adoption.md` — the 13-step retrofit recipe, the **14-row Definition of Done**, why rewriting
  files is **not** re-running them, and the `migration repair` reconciliation.
- `references/pull-defects.md` — the two `pull` corruption classes in full, and the parity gate's worked test.
- `references/schema-authoring.md` — `pgTable`, `.enableRLS()`, `pgPolicy`, the `drizzle-orm/supabase` role
  helpers, and the `(select auth.uid())` wrapping that makes a policy 100x faster on a large table.
- `references/raw-sql-boundary.md` — what Drizzle cannot model, the paired privilege block, and the three
  ways an RLS policy fails that a migration never will.

## Related skills

`aoneahsan-cccs-supabase` (the provisioning gate — 🔴 pass it before any SQL) · `-fileshub-vault` (the
credentials it reads) · `-supabase-edge-functions` · `-data-contract` · `-postgres-multitenancy-rbac` ·
`-ask-the-owner` (a missing credential is a question, never a re-route). Third-party, current API:
`supabase:supabase-postgres-best-practices`.
