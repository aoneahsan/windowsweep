---
name: aoneahsan-cccs-supabase
description: 'Supabase: the hosted-only provisioning gate blocking work when FilesHub holds no credential for the step being run, resolving which hosted project an app belongs to, RLS as the real boundary, migrations and seeding against the one project that serves dev and prod both, and the free-tier multi-account envelope. Use when setting up Supabase, working out which hosted project a codebase belongs to, writing RLS policies, applying migrations, seeding data, deploying an edge function, or choosing between it and Firebase.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/files/prompt-logs.md
---

# Supabase

The alternative backend where Postgres is the better fit — real SQL, joins, and **actual text search**, which
Firestore lacks. Per the stack-override rule, a project that chooses Supabase applies every Firebase-shaped
rule by analogy.

## 🔴 The provisioning gate — no credential, no work

**Hosted-only since 2026-08-06. There is no local stack, and one hosted project serves development AND
production.** The project is created by the **owner** and registered in **FilesHub**; you never create one.

Check the tier the **next step** needs. Presence is not readiness — one blanket check passes now and fails
mid-work:

| Gate | Before | Requires |
|---|---|---|
| **G1** | the app reads or writes | `endpoints.api` + `config.publishable_key` |
| **G2** | a migration, `db push`, any SQL | `has.db_password` + `has.db_url_session_pooler` |
| **G3** | `functions deploy`, `secrets set`, `link` | the **account's** `has_personal_access_token` |

Missing → **BLOCK**: `I NEED THIS FROM YOU:` naming the gate, the exact call and what it returned, options,
recommendation — then **PAUSE** (`aoneahsan-cccs-ask-the-owner`). Block the step, not the session; work that
does not need the missing credential continues.

🔴 **ASK FILESHUB FIRST** — `projects/{slug}/vault` → `supabase` gives `ref`, `url` and (since
`2026.08.28.1`) the **account**; `null` = **no link recorded**, not "none exists". Resolve in order: `docs/PROJECT-CONTEXT.md` → the committed `.env`
`VITE_SUPABASE_URL` → a name match **confirmed once with the owner** → else BLOCK, and record it **both
ways** (`PATCH {"supabase_project_id": <id>}`). Never accept a name match unconfirmed
(`linkedin-automation` vs slug `linkedin-automation-app`), and never invent a ref.

## 🔴 Banned

**`supabase db reset`** — dev *is* prod; it destroys the live database and there is no local copy. Also:
`supabase start`/`stop`/`status`, any `127.0.0.1:54321` URL, wipe-and-reload `seed.sql`, and creating a
project by any means. A `config.toml` with local ports is leftover scaffolding, not configuration.

Migrations are **forward-only, idempotent, additive** (`db push`). A destructive statement — `drop`,
`truncate`, a wide `delete`, a lossy type change — is an **owner decision every time**. Seeds are idempotent
upserts; test-account passwords are read at runtime from `~/.secrets` and **never committed**, because the
disposable database that once made a committed one safe no longer exists.

## 🔴 Schema is TypeScript, not hand-written SQL

**Drizzle authors it; the Supabase CLI applies it** — `src/db/schema/*.ts` is the single source of truth,
`drizzle-kit generate` writes flat timestamped SQL into `supabase/migrations/`, `supabase db push` applies.
One folder, one applier, one history. 🔴 `supabase migration new` + hand-written SQL is **retired** as the
default; it survives only for what Drizzle cannot model — functions, triggers, `grant`/`revoke`, `comment on`
— which goes through `drizzle-kit generate --custom` into the same folder.

`drizzle-kit generate` needs **no database connection**, so schema is authored before G2 passes. Banned:
`drizzle-kit push`, `drizzle-kit migrate`, and the `@rc` line (its migration format breaks the CLI).
🔴 Drizzle emits no `revoke`, so **every generated `create table` ships a paired privilege block** or the
table lands with Postgres's default `PUBLIC` grants.

Full standard, the adoption recipe for a project with existing SQL, and the RLS-in-schema API:
**`aoneahsan-cccs-drizzle-orm`**.

The exact calls, the blocking template and the live registry: `references/provisioning-gate.md`.

## 🔴 RLS is the boundary

**Enable row-level security on every table.** Without it, a public client key reads everything.

🔴 **Use the current keys:** `sb_publishable_…` in public clients and `sb_secret_…` on controlled backends.
Do not ask the owner for the legacy JWT `anon`/`service_role` keys. Existing or self-hosted setups may still
expose the legacy names; migrate deliberately rather than silently rotating them. A secret key authorizes as
PostgreSQL's `service_role`, **bypasses RLS**, and is server-only: never a `VITE_`/`NEXT_PUBLIC_` variable and
never committed outside `~/.secrets/`. Publishable keys are safe to expose only because RLS remains the
boundary.

Verify a policy with a live **403-vs-200 probe as a non-admin** — and since that probe now runs against the
one real database, seed first and keep it read-only unless a write is the point.

## Free tier, multiple accounts

**2 projects per account**, so additional free accounts exist, each with its own organisation, with
`aoneahsan@gmail.com` an owner of every one. 🔴 **Creating either a project or an account is owner-only.**

**Keep every project movable** — the ref and URL live **only** in that app's config, so re-pointing is never
a code change. Free projects **auto-pause at ~7 days idle** and cap at 500 MB; FilesHub runs a keepalive, so
check `keepalive.last_status` before diagnosing a project as broken.

## 🔴 Derive it in SQL; never store it twice

A total, streak, level, rank, point balance or count that is **derivable** from rows is computed by the
database — a view, a generated column, an aggregate, or a trigger-maintained column with **exactly one
writer**. A "convenience mirror" kept in sync by application code is **two writers for one number**, and the
copy is wrong the moment any path forgets it. Nothing detects that: the stale value is still a plausible value,
so every gate stays green while a leaderboard is quietly wrong.

If a mirror is genuinely needed for query performance, it is a trigger-maintained column that is **out of the
client's `UPDATE` grant** and **in the trigger's `UPDATE OF` list** — either half alone leaves the invariant
client-writable, and RLS cannot police a column.

## The rules that carry across

The **read budget** applies unchanged — 20 default, 50 max, keyset pagination (`WHERE id > $cursor LIMIT n`,
never `OFFSET`), server-side filtering, `COUNT(*)` rather than counting rows client-side. Auth stays
Google-only. Storage and email still go to FilesHub, not Supabase Storage.

For RLS policies, migrations and client setup, read `references/patterns.md`.
Living registry (link, never copy): `~/.claude/rules/supabase-provisioning.md`.
