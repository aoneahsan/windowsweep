---
name: aoneahsan-cccs-data-contract
description: 'The client/backend contract: where data work happens and how a request is validated on both sides — server-side aggregation for charts, tables, counts and reports; a payload that omits blank optional fields rather than sending null; and the fixed order of shape, auth, authorization, business validity, then the database. Use when building a chart, table, export or report, writing a form submit or any mutation, or writing an API route, edge function or security rule.'
metadata:
  author: aoneahsan
  source: owner directive 2026-07-30; rules/data-fetch-budget.md
---

# Data contract

**The server decides and computes. The client asks well and explains.**

Two halves, each with a failure mode that ships silently: work done in the wrong place, and a request trusted
by the side that cannot enforce anything.

## 🔴 Part 1 — the server does the work

**Never fetch rows to compute a result.** A chart, total, count, KPI tile, report or export receives the
**aggregated answer**, not the data behind it. The aggregation is a query, a database function or a server
function; its result is what crosses the wire.

Ten thousand rows fetched to draw one line is: the user's bandwidth, the client's memory, a frozen main thread,
and — on a metered backend — a quota that a single dashboard can exhaust for every user of the product.

| Want | Do | Never |
|---|---|---|
| a count | an aggregate (`count()`, `COUNT(*)`) or a maintained counter | read the rows and take `.length` |
| a chart series | group and aggregate server-side, return the buckets | fetch the rows and reduce in the browser |
| a total or average | `sum()` / `avg()`, or a maintained field | `rows.reduce(…)` |
| a filtered, sorted page | `where` + `order by` + a limit | fetch all, then `.filter().sort()` |
| a search | the database's index | fetch all, then match in JS |
| a random sample | an indexed strategy over a bounded set | fetch the pool |

**Client-side `.filter()` / `.sort()` / `.reduce()` is correct in exactly one case:** over a page that is
already bounded (≤50 rows), or over a genuinely local dataset — a bundled catalogue, an imported file.

Page sizes, cursor rules, quota arithmetic and per-backend syntax are law, not this skill's to restate:
`~/.claude/rules/data-fetch-budget.md` when present.

## 🔴 Part 2 — every request is validated twice, differently

The two sides are not redundant. **The client's job is to be helpful; the server's job is to be certain.**
A check that only exists in the browser is a UX affordance, not a boundary.

### Client, before sending

1. **Validate** against the schema. A required field that is missing never reaches the network.
2. **Tell the user which field and why, at the field** — not a toast that vanishes.
3. **Shape the payload.** 🔴 **An optional field the user left blank has its KEY REMOVED** — never sent as
   `null`, `undefined` or `""`.

🔴 **Omission and `null` mean different things, and a form that cannot express both has a bug:**

| Intent | Payload | Because |
|---|---|---|
| "I didn't fill this in" | **key absent** | on a partial update, an absent key leaves the stored value alone |
| "Clear what's there" | **explicit `null`** | erasing is a real operation and must stay expressible |

Send `null` for an untouched field and **every update erases stored data**. The user edits their display name
and silently loses their bio. This is the reason the rule exists; it is not tidiness.

### Server, in this order — no reordering, no skipping

```
1  request shape        -> 422   before anything else runs
2  authentication       -> 401
3  authorization        -> 403   role · permission · tenant · ownership
4  business validity    -> 409/422  does the referenced row exist, is this state legal
5  only now: the database
```

Order is not style. Validating shape after a database read means an unauthenticated caller reached storage;
checking ownership after the write means the write happened.

🔴 **A database constraint is not a validator.** A 500 from a unique-key violation is a missing step 4 — the
user gets an opaque failure and the log gets a stack trace instead of "that email is already registered".

Where the same language runs both sides, **share one schema** so they cannot drift.

## Rationalizations, and what is actually true

| The excuse | Reality |
|---|---|
| "It's only a few hundred rows" | Collections grow; the query does not. This is how a working page becomes an outage. |
| "The client already validated it" | The client is code you shipped to a stranger's machine. Anyone can post whatever they like. |
| "RLS/rules will catch it" | They filter rows. They do not validate shape, and a filter that returns fewer rows is a **200** — invisible to any test asserting success. |
| "Sending `null` is the same as omitting" | On a partial update it overwrites. Different operation, same syntax. |
| "The ORM will reject bad data" | As a 500, after the round trip, with no message the user can act on. |
| "Aggregating server-side needs an index/migration" | Yes. That is the work. Widening the fetch is not a cheaper version of it. |

## 🔴 STOP — red flags in your own diff

- `.length` on a fetched array used as a count · `.reduce(` over server data · a chart fed a raw row array
- a query with no limit · `.filter(` or `.sort(` on anything unbounded
- `mutateAsync(values)` passing raw form state straight through
- `null` or `""` in a payload for a field the user simply skipped
- an auth check *after* a read, or any DB call before step 4 completes
- a `catch` that turns a constraint violation into a generic 500

## Going deeper

`references/frontend-payload.md` — validate, then shape: a worked `toPayload()`, the clear-versus-omit
distinction per backend, and the traps in `undefined` / `""` / `exactOptionalPropertyTypes`.

`references/backend-gate.md` — the ordered gate per stack (Laravel, an edge function, a Worker, security
rules), the status codes, and how to prove the order holds with two probes.

## Related skills

`aoneahsan-cccs-react-forms` · `-react-api-tanstack-query` (where the client half lives) ·
`-react-tables-tanstack` · `-d3-charts` (the aggregate consumers) · `-laravel` ·
`-supabase-edge-functions` · `-nodejs` · `-cloudflare-workers` (the server half) · `-firestore` ·
`-postgres-multitenancy-rbac` (step 3, and rules that filter rather than refuse) · `-plans-entitlements`
(the same asymmetry for limits) · `-coding-standards`.
