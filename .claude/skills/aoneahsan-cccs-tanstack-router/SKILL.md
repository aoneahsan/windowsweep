---
name: aoneahsan-cccs-tanstack-router
description: 'Routing with TanStack Router: file-based routes at scale, typed search params as the URL-state mechanism, the division of labour between loaders and TanStack Query, per-route pending and error components, auth guards in beforeLoad, and a build guard failing when an indexed URL disappears. Use when adding or guarding routes.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/files/prompt-logs.md
---

# TanStack Router

**The standard: routes are files, search params are typed, and a URL that search engines have indexed cannot
disappear without the build failing.**

## Typed search params are the URL-state mechanism

This is the single biggest reason to use this router. `validateSearch` makes URL state a **typed API** rather
than string parsing scattered through components.

```tsx
export const Route = createFileRoute('/health/metrics')({
  validateSearch: z.object({
    tab:    z.enum(['chart', 'table']).default('chart'),
    range:  z.enum(['7d', '30d', '90d']).default('30d'),
    page:   z.number().int().min(1).default(1),
    q:      z.string().optional(),
  }),
});

// Fully typed, both ways
const {tab, range} = Route.useSearch();
navigate({search: (prev) => ({...prev, tab: 'table'})});
```

Every modal, tab, filter, sort, step and search term lives here — never in bare `useState`. A refresh
restores the exact view. See `aoneahsan-cccs-url-state-persistence` for which states qualify.

**Defaults are omitted from the URL** by `default()`, so the common case stays a clean path.

## Loaders vs TanStack Query — do one, not both

| Use | For |
|---|---|
| **Loader** | data the route cannot render without — it blocks the transition, so the page never flashes empty |
| **TanStack Query** | everything else — lists, panels, anything refetching, paginating or mutating |

Doing both for the same data double-fetches and gives two caches that disagree. The workable hybrid is a
loader that **warms the Query cache** (`queryClient.ensureQueryData`) and components that then read through
Query as usual — one fetch, one cache.

## Guards belong in `beforeLoad`

```tsx
export const Route = createFileRoute('/_app')({
  beforeLoad: ({context, location}) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({to: '/login', search: {redirect: location.href}});
    }
  },
});
```

On a `_app` pathless layout route it covers every child at once, and it runs **before** the loader — so a
protected route never fetches for an unauthenticated user. Guarding inside a component instead means the
fetch already happened and the flash already showed.

## Per-route pending and error components

```tsx
export const Route = createFileRoute('/health/metrics')({
  pendingComponent: MetricsSkeleton,      // a skeleton matching the layout, not a spinner
  errorComponent: MetricsError,           // branded, with a retry
  notFoundComponent: MetricsNotFound,
});
```

A route without these inherits the root's, which is how one failing panel blanks a whole page.

## Code splitting

`.lazy.tsx` route files split automatically. Keep `validateSearch` and `beforeLoad` in the **non-lazy** file —
they must run before the chunk loads, and moving them into the lazy half defeats the guard.

## 🔴 The frozen-URL guard

A rebuild's real risk is a public, indexed URL quietly disappearing in a refactor. Make it a build failure,
not a discovery in Search Console:

```ts
// scripts-free: a check run from package.json, comparing generated routes to the frozen list
const frozen = JSON.parse(readFileSync('docs/frozen-urls.json', 'utf8')) as string[];
const actual = new Set(Object.keys(routeTree.routesById));
const missing = frozen.filter((u) => !actual.has(u));
if (missing.length) throw new Error(`Frozen URLs missing: ${missing.join(', ')}`);
```

Wire it as `yarn verify:routes` and run it in the build. A merged feature **keeps its public URL** — the
redirect is the compatibility layer, not a deletion.

## Common mistakes

| Mistake | What happens | Instead |
|---|---|---|
| UI state in `useState` | refresh loses the view; nothing is shareable | typed search params |
| Loader **and** Query for one dataset | double fetch, two disagreeing caches | loader warms the Query cache |
| Guard inside the component | fetch already ran, flash already showed | `beforeLoad` on a layout route |
| `validateSearch` in the `.lazy` file | runs too late to guard anything | keep it non-lazy |
| No per-route error component | one panel blanks the page | `errorComponent` per route |
| Renaming an indexed URL | traffic lost silently | the frozen-URL guard |
| An effectful loader (starts a driver, opens a channel, offers state the page follows) left on the default stale reload | coming back to the route shows the old match and runs the loader behind it, so the page mounts before the offer and draws nothing (Rent Party, an online game after a pause) | `loader: { handler, staleReloadMode: 'blocking' }`: the way back waits for the loader, as a first visit does |

## Related skills

`aoneahsan-cccs-url-state-persistence` (which states belong in the URL) · `-react-api-tanstack-query` (the
cache the loader warms) · `-react` (app structure) · `-react-seo` (why the frozen URLs matter) ·
`-react-ui-ux` (the pending and error states).
