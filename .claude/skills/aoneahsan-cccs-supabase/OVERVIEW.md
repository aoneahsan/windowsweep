# Overview — `aoneahsan-cccs-supabase`

## Purpose

Supabase as the Postgres-shaped alternative to Firebase, used where relational queries or genuine text search
matter. It also documents the multi-account free-tier arrangement that keeps the fleet's hosting costs at
zero.

## What this skill does

- Explains the **free-tier multi-account strategy**: two projects per account, additional accounts each with
  their own organisation, and one identity added as owner across all of them.
- Requires projects to stay **movable** — the project ref and URL live only in that app's config, so
  re-pointing to another instance is never a code change.
- Notes that free projects auto-pause when idle and cap at 500 MB, and that migration to paid happens only
  once a product earns.
- Makes **RLS the security boundary**: enabled on every table, with the anon key public by design and safe
  only because of RLS, and the `service_role` key bypassing RLS entirely and therefore server-only.
- 🔴 Enforces the **provisioning gate**: hosted-only, owner-created, registered in FilesHub, checked in three
  tiers (runtime / schema / platform) immediately before the step that needs each — and **BLOCKS** when a
  credential is missing rather than improvising.
- Supplies the **resolution order** for working out which hosted project a codebase belongs to, because
  FilesHub carries no project→Supabase link.
- Records what replaced the retired local stack: forward-only idempotent migrations, idempotent upsert seeds,
  and the ban on `db reset` now that one project serves development and production both.
- Carries across the rules that do not change with the backend: the read budget with keyset pagination,
  Google-only auth, and FilesHub for storage and email.

## When it gets invoked

- Setting up Supabase in a project, or working out which hosted project it belongs to.
- Writing or reviewing RLS policies.
- Applying schema changes or migrations; seeding data; provisioning test accounts.
- Choosing between Supabase and Firebase for a project.
- A feature needs joins or text search that Firestore cannot provide.

## Where it applies

Projects that have chosen Supabase — currently a minority, led by CallVault and the LinkedIn automation
project.

## Sources

Owner directive 2026-08-06 (hosted-only + the FilesHub gate, superseding the local-Docker directive of
2026-07-18), the live FilesHub probe of the same date, and the multi-account strategy recorded in the global
services rules. `_source-understanding/files/prompt-logs.md` carries the original, now-retired framing.

## Related skills

`aoneahsan-cccs-fileshub-vault` (🔴 the vault the gate reads) · `-ask-the-owner` (the pause when a gate
fails) · `-firebase` and `-firestore` (the equivalents these map onto) · `-react-api-tanstack-query` (the read
budget, unchanged) · `-nodejs` (the zero-cost boundary) · `-documentation` (the stack-override declaration).

## Maintenance

Re-probe the registry in `references/provisioning-gate.md` rather than trusting it — it is a snapshot.
Re-check when a project is registered or migrates to a paid instance, or when the free-tier limits change.
