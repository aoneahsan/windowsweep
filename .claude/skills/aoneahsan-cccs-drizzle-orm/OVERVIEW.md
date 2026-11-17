# Overview — `aoneahsan-cccs-drizzle-orm`

## Purpose

One ORM, fleet-wide, so that a Supabase schema change is a **reviewable TypeScript diff** rather than a
hand-written SQL file nobody can compare against anything. It exists because the projects it governs had 159
migration files, no typed schema, no snapshot history, and no way to tell whether the code's idea of the
database matched the database.

## The decision it records

**Drizzle ORM + drizzle-kit**, stable line only. Chosen over Prisma and Kysely on evidence measured
2026-08-21:

| | Drizzle | Prisma | Kysely |
|---|---|---|---|
| installed size | ~10 MB | **78 MB** | small |
| shadow database for migrations | not needed | 🔴 **required** by `migrate dev` | n/a |
| generate a migration offline | 🔴 **yes** | no | no |
| schema-as-code diffing | yes | yes | no — hand-written up/down |
| RLS policies in the schema | yes | poor | no |
| Deno / Edge Functions | yes | no | yes |

**Prisma is disqualified by the hosted-only law, not by preference.** `migrate dev` needs a shadow database;
there is no local Postgres and no throwaway project. Kysely is a query builder, not a migration authority.

## What this skill does

- Fixes the architecture: **one folder, one applier, one history** — `drizzle-kit generate` writes into
  `supabase/migrations/`, `supabase db push` applies, `supabase_migrations.schema_migrations` records.
- Draws the **split-ownership line** between what Drizzle models and the functions, triggers, grants and
  comments it does not — and routes the remainder through `generate --custom` in the same folder.
- 🔴 Requires a **paired privilege block** on every generated `create table`, because Drizzle emits no
  `revoke` and a bare new table carries Postgres's default `PUBLIC` grants.
- Keeps `@supabase/supabase-js` as the data-access client everywhere, so **RLS stays the boundary** and
  Drizzle is never the reason a query skips a policy.
- Supplies the **equivalence gate** — the only available proof that `schema.ts` matches a live database once
  replay-from-scratch became unverifiable.
- States the **rollback position honestly**: no generated `down` migrations, a reviewed never-auto-applied
  companion file, and a destructive revert as an owner decision every time.
- Carries the **adoption recipe** for a project that already has hand-written migrations, including why
  rewriting the files is not re-running them.

## When it gets invoked

- Adding or changing a table, column, index, enum, view or RLS policy on any Supabase project.
- Generating, reviewing, applying or reverting a migration.
- Adopting the standard in a project whose migrations are hand-written SQL.
- Deciding whether a change belongs in `schema.ts` or in a `--custom` SQL migration.
- Choosing an ORM, or being asked why this one.

## Where it applies

Every Supabase-backed project the owner owns. Client and marked-private projects follow their own decision
(`~/.claude/rules/client-projects.md`).

## Sources

Owner directive 2026-08-21 (*"make sure we have ORM and it's as best implemented and optimized as possible"*).
Versions, sizes and the beta-format defect probed live the same day against the npm registry, the Drizzle
documentation and `drizzle-team/drizzle-orm#5166`.

## Related skills

`aoneahsan-cccs-supabase` (🔴 the provisioning gate, passed before any SQL) · `-fileshub-vault` ·
`-supabase-edge-functions` · `-data-contract` · `-postgres-multitenancy-rbac` · `-ask-the-owner` ·
`-packages-up-to-date` (the version pin).

## Maintenance

Re-check the pin when `drizzle-team/drizzle-orm#5166` closes — if the 1.0 line restores flat migration files,
the `@rc` ban is lifted and the blocker entry in `~/.claude/rules/package-version-known-issues.md` moves to
its resolved section. Re-check the split-ownership table whenever drizzle-kit gains an entity kind.
