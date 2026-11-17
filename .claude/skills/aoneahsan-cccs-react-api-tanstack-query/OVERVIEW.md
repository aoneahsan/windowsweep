# Overview — `aoneahsan-cccs-react-api-tanstack-query`

## Purpose

Owns all server data. Its most important content is not the library API but the **data-fetch budget** — the
rule that caps every list read, written after an unbounded query exhausted a production free-tier quota and
took an app down for a day.

## What this skill does

- Fixes TanStack Query as the owner of server state, and rules out both zustand-for-fetched-data and
  `useEffect`-plus-`useState` fetching.
- States the **data-fetch budget**: default page size 20, hard maximum 50, cursor pagination beyond page one,
  server-side filtering and sorting, counts via aggregation rather than by reading documents, and scoped
  real-time listeners. Declares that a query without a limit is a bug regardless of current collection size,
  and names the two exemptions.
- Requires **query key factories** per domain, with every dependency present in the key, so invalidation is
  hierarchical and stale-wrong-filter results are impossible.
- Treats `staleTime` as a deliberate decision, with ≥5 minutes and disabled focus-refetch for rarely-changing
  content, and client persistence as a second layer rather than a substitute for limits.
- Sets mutation practice: invalidate rather than hand-patch the cache, and use optimistic updates only where
  latency is felt, always with a rollback.
- Requires empty, error and loading to be visually distinct states.

## When it gets invoked

- Fetching or mutating any server data.
- Designing a query key, or debugging a stale or wrong-filter result.
- Tuning refetch and caching behaviour.
- Reviewing any query — especially one with no explicit limit.
- Building a list, table, search or infinite scroll.

## Where it applies

Every React project that talks to a backend, whatever the backend is.

## Sources

`_source-understanding/files/prompt-logs.md` (TanStack Query named as the standard; the 50K-read quota
incident and the resulting 20/50 rule) and `_source-understanding/files/generic-project-rules.md` (R-033).

## Related skills

`aoneahsan-cccs-react-state-zustand` (the client half of the boundary) · `-firestore` (indexes and rules the
limits depend on) · `-react-tables-tanstack` (paginated list rendering) · `-react-performance`.

## Maintenance

The budget numbers are owner-set and stable. The canonical rule lives at
`~/.claude/rules/data-fetch-budget.md` — point there rather than duplicating it.
