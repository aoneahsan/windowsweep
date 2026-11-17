# Overview — `aoneahsan-cccs-postgres-multitenancy-rbac`

## Purpose

The access-control model for the owner's multi-tenant Postgres and Supabase projects: who belongs to which
tenant, what they may do inside it, and how to write RLS policies that actually hold rather than merely
looking correct.

## What this skill does

- Makes **RLS the boundary**, deny-by-default, with an explicit policy per table — never a catch-all that
  silently covers tables nobody wrote a policy for.
- Puts **tenancy in a membership table, not a JWT claim**, so revoking access takes effect immediately rather
  than at the next token refresh.
- Separates the **two levels of role** — a platform role on the user, a tenant role on the membership — and
  requires exactly one writer for each, because a synchronised copy produces two answers to one question.
- Replaces a stored per-user permission list with a **role → capability registry** resolved server-side, so
  changing what a role can do is a deploy rather than a migration across every user row.
- States the rule that decides whether policies work: **a list, count or aggregate must prove its policy from
  its own filters**, because a list fails when any candidate row fails the policy.
- Names the **admin-branch trap** — an admin branch passes silently, so a user-facing flow verified as an
  admin proves nothing.
- Defines the **three-way probe** (member, non-member, member-without-the-filter) and warns that a
  `(200, 0)` result satisfies any policy vacuously, so data must be seeded first.

## Why it exists

Written during the LabFlow rebuild's Phase 0, 2026-07-27. The shipped app had **11 roles and 252 permission
keys** stored as an array on a user document the client could write, a role duplicated across two documents
with two independent writers, and a 1,204-line rules file ending in a catch-all that granted tenant-scoped
CRUD on *any* collection name — so the model was not deny-by-default and a new collection was readable the
moment it existed.

The existing `-supabase` skill covers RLS basics and `-plans-entitlements` covers feature gating, but neither
carried a tenancy and role model at that scale, and the tenancy substrate is laid in the foundation wave
where every later table inherits its shape. Getting it wrong is not a refactor; it is a re-migration.

The provability rule and the admin-branch trap are carried across from the fleet's Firestore lineage
(`~/.claude/rules/data-fetch-budget.md`), where both were learned from production breakage — including a
sibling project that reported PASS twice on a feature broken for every non-admin user.

## What it deliberately does not cover

Plan limits and entitlement gating (`-plans-entitlements`), the Supabase platform itself (`-supabase`), and
query performance (`-postgres-search`).
