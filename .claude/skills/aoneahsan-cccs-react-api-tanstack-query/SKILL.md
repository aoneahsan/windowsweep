---
name: aoneahsan-cccs-react-api-tanstack-query
description: 'Server data with TanStack Query: query keys, stale time, mutations and invalidation, and the data-fetch budget capping every list read. Use when fetching or mutating server data, designing a query key, tuning refetch behaviour, or when a query has no explicit limit on how much it returns.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/files/prompt-logs.md
---

# Server data — TanStack Query

**TanStack Query owns everything that comes from a server.** Never fetched data in zustand, never a
`useEffect` + `useState` fetch. Query gives caching, deduplication, background refetch, retry and loading
state; hand-rolling those is how a codebase ends up with five different loading conventions.

## 🔴 The data-fetch budget — non-negotiable

**The client never fetches a whole collection to filter, sort, count or sample on the frontend.**

| Rule | Value |
|---|---|
| Default page size | **20** |
| Hard maximum per fetch | **50** |
| Beyond page 1 | cursor/keyset pagination — never offset loops, never "load 500, show 20" |
| Filtering and sorting | server-side, via query + index |
| Counts | aggregation (`getCountFromServer`, `COUNT(*)`) or a maintained counter field — **never** by reading the documents |
| Real-time listeners | single doc or a limited query only, detached on unmount |

**A query with no limit is a bug even on a small collection**, because collections grow. The only exemptions
are structurally bounded, enum-like collections — each carrying a `// bounded: <reason>` comment — and
owner-approved admin tooling.

This exists because imtehanhub exhausted Firestore's free 50,000-read daily quota in one day and took
production down for every real user until the reset. Full rule: `~/.claude/rules/data-fetch-budget.md`.

## Query keys are a hierarchy

```ts
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters: Filters) => [...todoKeys.lists(), filters] as const,
  detail: (id: string) => [...todoKeys.all, 'detail', id] as const,
};
```

A key factory per domain, never inline string arrays. Every value the query depends on belongs **in the key** —
a key that omits a filter serves stale results for the wrong filter. Invalidating `todoKeys.lists()` then
clears every list variant at once.

## Stale time is a decision, not a default

`staleTime: 0` refetches on every mount and focus. For content that rarely changes — a tool catalogue, a
category tree, static lists — use **≥ 5 minutes** and set `refetchOnWindowFocus: false` unless the data must
genuinely be live. Client persistence is a mandatory second layer, but never an excuse to skip the limits
above: the persister writes through **`strata-storage`**'s `indexedDB` adapter, never `indexedDB` directly
(`aoneahsan-cccs-strata-storage`). Firestore's own persistent cache is separate and stays as it is.

🔴 **Never `refetchInterval` for data.** A timer is polling: the data is late by up to the interval and every open
tab pays for it. Live data arrives as a Realtime signal that invalidates this query, and gaps close on reconnect,
focus and `online` (`aoneahsan-cccs-realtime-not-polling`).

## Mutations invalidate; they do not hand-patch

```ts
const mutation = useMutation({
  mutationFn: updateTodo,
  onSuccess: (_data, variables) => {
    queryClient.invalidateQueries({ queryKey: todoKeys.detail(variables.id) });
    queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
  },
});
```

Optimistic updates only where the latency is genuinely felt, and always with an `onError` rollback via
`onMutate`'s snapshot.

## 🔴 The mutation layer shapes the payload

A mutation sends what the form gave it only if someone shaped it first. **An optional field the user left blank
has its key removed** — never `null`, `undefined` or `''` — because on a partial update a present key overwrites
the stored value, so editing one field silently erases another.

Omission means "I didn't fill this in"; an explicit `null` means "clear it". Both must stay expressible:
`aoneahsan-cccs-data-contract`.

## Errors and loading

Let the query own the states. Distinguish **empty** from **error** from **loading** — an empty list rendered
as a spinner reads as broken. Errors reach the user as something actionable and reach the logger with detail.

For the query client setup, pagination, infinite queries and prefetching, read `references/patterns.md`.

🔴 **The fleet performance standard** (2026-09-11) makes staleTime classes, key factories and no fetch in an
effect law, and every new query reports its key, class and limit: `aoneahsan-cccs-react-performance/references/performance-standard.md` §2 and §6.
