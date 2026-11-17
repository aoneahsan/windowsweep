---
name: aoneahsan-cccs-postgres-multitenancy-rbac
description: 'Multi-tenant access control in Postgres and Supabase: tenant membership as a table, the two-level role model, a role-to-capability registry replacing a sprawling permission list, and the provable-from-its-own-filters rule that makes RLS actually hold. Use when designing a tenant model, writing RLS, or when a list query 403s.'
metadata:
  author: aoneahsan
  source: LabFlow rebuild Phase 0, 2026-07-27
---

# Postgres Multi-Tenancy & RBAC

## The rule

**Row-level security is the boundary, and a policy must be provable from the query's own filters.** Every
table denies by default; every table gets an explicit policy; and a policy that reads a column obliges every
list, count and aggregate over that table to filter on it.

## When to use

- Designing a tenant model, or adding the first tenant-scoped table.
- Writing, reviewing or debugging an RLS policy.
- Adding a role or a capability.
- A list query returns 403 while a single-row read of the same table works.
- Verifying access control — which means verifying it **as a non-admin**.

## Tenancy is a table, not a claim

Put membership in a table — `tenant_members (user_id, tenant_id, role)` — never in a JWT claim. A claim is
**stamped at login and stale from that moment**, so revocation takes effect at the next token refresh rather
than immediately; a membership row is read at query time and revoking is a `DELETE`. The cost is a join per
policy, which a `(user_id, tenant_id)` index makes trivial and Postgres caches within a statement.

## Two levels of role, and they are not the same thing

**Platform role** lives on the user row and answers "is this person staff of *our company*?" — only ever `user`
or `platform_admin`. **Tenant role** lives on the membership row and answers "what is this person *within this
laboratory*?" Conflating them produces the most confused access models, because a person can be a manager in one
tenant and a technician in another — expressible only if the role lives on the membership.

🔴 **One writer.** The role belongs on the membership row and nowhere else. A copy on the user row kept in sync
by application code gives two answers to one question, and the answer a policy reads depends on which code path
last wrote. Both levels in full: `references/roles.md`.

🔴 **Two platform values is this skill's minimum, not a ceiling.** A project with moderators or a support desk
declares those rungs too — declare only the rungs something actually checks. The fuller ladder, and the panel
built over it, are `aoneahsan-cccs-platform-admin`; this skill keeps the RLS and tenant half.

## Capabilities, not a permission list

A long list of permission keys stored per user is the shape that fails — it lives on a row the user can often
write, it drifts from the roles it came from, and nobody can answer "who can do X" without scanning every user.

Instead: **roles are data, capabilities are code.** One registry maps role → capabilities; the user carries a
role; the server derives capabilities at check time. Changing what a role can do becomes a deploy, not a
migration across every user row.

🔴 **The server enforces, the client explains.** A capability check in the browser is UX. If the only thing
stopping an action is a hidden button, the action is not stopped.

The registry, and why the stored-list shape fails: `references/roles.md`.

## 🔴 The rule that decides whether your policies work

**A list, count or aggregate must prove its policy from its own filters.**

A policy reading `tenant_id` means every such query must carry `where tenant_id = ...`. Being *inside* a
tenant the caller belongs to is not something the planner can see; the policy is evaluated per candidate row,
and **a list fails when any row in the result set fails the policy**.

The recurring failure shape looks obviously correct and is denied at runtime:

```sql
-- denied: nothing here proves the tenant
select * from samples where batch_id = $1;

-- allowed: the filter the policy reads is present
select * from samples where tenant_id = $1 and batch_id = $2;
```

Full detail, including the aggregate and cross-tenant-admin cases: `references/rls-patterns.md`.

## 🔴 The admin-branch trap

**Never verify a user-facing flow with an admin account.**

An `or platform_role = 'platform_admin'` branch in a policy silently passes, so every ordinary-user failure
is invisible from an admin session (incident: `references/rls-patterns.md`).

Verify as the **least-privileged role that should be able to do the thing** — and separately verify that a
role which should *not* be able to do it gets a 403.

## Verifying — the probe, not the policy

Reading a policy is not verifying it. Issue the real query as a member, as a non-member, and **as a member with
the tenant filter removed** — that third probe is the one that proves the policy is doing the work rather than
the filter, and it must come back **403**.

🔴 **A `(200, 0)` result proves nothing.** A query returning zero rows satisfies any policy vacuously.
**Seed data first, then probe.**

Expected status per case, including how different clients surface a denial: `references/rls-patterns.md`.

## Common mistakes

Read `references/common-mistakes.md` when reviewing a policy or tenant model — eight mistakes, from listing
without the filter the policy reads to a permission array on a user-writable row.

## Going deeper

- `references/rls-patterns.md` — the policy set, aggregates, cross-tenant admin, and the probe procedure
- `references/roles.md` — the two-level model, the capability registry, and role-explosion
- `references/common-mistakes.md` — read when reviewing a policy or tenant model

## Related skills

`aoneahsan-cccs-supabase` (the platform) · `-supabase-edge-functions` (server-side enforcement) ·
`-plans-entitlements` (limits on top of capabilities) · `-phi-safe-engineering` (what this protects) ·
`-postgres-search` · `-platform-admin` (the ladder and the panel over it) ·
`-web-e2e-testing` (driving the probe as a non-admin).

<!-- Related law: ~/.claude/rules/data-fetch-budget.md — the provability rule and its Firestore lineage. -->
