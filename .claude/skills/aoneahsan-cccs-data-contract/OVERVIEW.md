# Overview — `aoneahsan-cccs-data-contract`

## Purpose

Fix the two halves of the client–server contract that keep being re-litigated per project: **where data work
happens**, and **how a request is validated on each side**. Both failures ship silently — a dashboard that
downloads ten thousand rows works fine on the developer's seeded database, and a payload full of `null`s only
destroys data on the second edit.

The rule in one line: **the server decides and computes; the client asks well and explains.**

## What this skill does

- States that aggregation — counts, totals, chart series, KPI tiles, reports, exports — happens **server-side**,
  and that the client receives the answer rather than the data behind it.
- Names the one case where client-side `filter`/`sort`/`reduce` is correct: an already-bounded page, or a
  genuinely local dataset.
- Requires the client to **validate and then shape** every payload, with blank optional fields **omitted** —
  and distinguishes omission ("I didn't fill this in") from an explicit `null` ("clear this"), which are
  different operations that look identical in code.
- Fixes the backend's validation order — request shape, authentication, authorization, business validity, then
  the database — and explains why the order is not stylistic.
- States that a database constraint is not a validator, so a 500 from a unique-key violation is a missing step.
- Supplies the rationalization table and the red-flag list for a rule people know and skip under deadline.

## When it gets invoked

- Building a chart, table, dashboard tile, export or report.
- Writing a form submit, a mutation, or anything that sends a payload to a server.
- Writing an API route, an edge function, a Worker handler, or a security rule.
- Deciding whether something belongs in a query or in the browser.
- Reviewing a diff for either failure — the red-flag list is the review pass.

## Where it applies

| Scope | Applies |
|---|---|
| Stacks | Every one. The concern is stack-independent; the syntax is not, and each backend skill carries its own |
| Frontends | React, Flutter, a browser extension, a Worker-rendered page — the client half is about the payload, not the framework |
| Not applicable | A purely local app with no server. The payload half still applies to anything crossing a process boundary |

## What it deliberately does not cover

- **Page sizes, cursor rules and quota arithmetic.** Those are law in `~/.claude/rules/data-fetch-budget.md`,
  and restating numbers in a skill is how two records start disagreeing.
- **Per-backend syntax.** The Firestore, Supabase, Laravel, Workers and Edge Function skills own their own.
- **Row-level authorization design.** That is `aoneahsan-cccs-postgres-multitenancy-rbac` and `-firestore`;
  this skill only fixes *when* it runs relative to the other checks.

## Sources

| Source | Record |
|---|---|
| Owner directive, 2026-07-30 | both rules, stated together: process on the backend, validate on both sides with optional keys removed rather than sent as `null` |
| `~/.claude/rules/data-fetch-budget.md` | the read-budget law this points at, including its evidence that a blown free-tier quota takes production down for a day |
| The same rule file's Postgres section | that RLS *filters* rather than refuses, so a missing owner filter returns 200 — which is why a client-side check can never be the boundary |

## Related skills

- `aoneahsan-cccs-react-forms`, `-react-form-components` — where the client validates and shapes.
- `aoneahsan-cccs-react-api-tanstack-query` — the mutation layer that sends the shaped payload.
- `aoneahsan-cccs-react-tables-tanstack`, `-d3-charts` — the consumers that must be fed aggregates.
- `aoneahsan-cccs-laravel`, `-supabase-edge-functions`, `-nodejs`, `-cloudflare-workers` — the ordered gate.
- `aoneahsan-cccs-firestore`, `-postgres-multitenancy-rbac` — step 3, and why a rule cannot police shape.
- `aoneahsan-cccs-plans-entitlements` — the same server-enforces/client-explains asymmetry, for limits.

## Maintenance

- **Living registries this skill points at:** `~/.claude/rules/data-fetch-budget.md` when present. Never copy
  its numbers here.
- **Feedback loop:** a new instance of either failure found in a real project adds a row to the
  rationalization table or the red-flag list, not a new section.
- **Last reviewed:** 2026-07-30
