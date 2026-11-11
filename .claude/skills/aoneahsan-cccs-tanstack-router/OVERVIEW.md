# TanStack Router — overview

## Purpose

LifeWell has ~170 routes and 96 of its URLs are in Google's index. Both facts shape this skill: routing at
that scale needs structure rather than a growing switch statement, and a refactor must not be able to delete
a public URL without the build noticing.

The other reason it exists is that this router's **typed search params** are the cleanest implementation of
the house URL-state rule. Where other routers leave URL state as string parsing scattered through components,
`validateSearch` makes it a typed API with defaults.

## What this skill does

- Establishes **typed search params as the URL-state mechanism**, with defaults omitted from the URL.
- Divides **loaders from TanStack Query** — blocking data versus everything else — and gives the hybrid that
  avoids double-fetching.
- Puts **auth guards in `beforeLoad`** on a pathless layout route, so a protected route never fetches for an
  unauthenticated user.
- Requires **per-route pending, error and not-found components**, so one failing panel cannot blank a page.
- Notes the code-splitting trap: `validateSearch` and `beforeLoad` must stay in the non-lazy file.
- Specifies the **frozen-URL build guard** that fails when an indexed route disappears.

## When it gets invoked

- Adding, moving or restructuring routes.
- Putting modal, tab, filter, sort, search or step state in the URL.
- Guarding a route behind authentication.
- Any refactor that touches a public, indexed URL.
- A route flashing empty, or a refresh losing the user's place.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | React projects using TanStack Router |
| Stack override | The concern is *typed URL state, guards before fetch, and public URLs that cannot silently disappear*. A project on react-router satisfies the same concerns with loaders and its own search-param handling. |

## Sources

| Source | Record |
|---|---|
| `@tanstack/react-router` 1.170.18 verified on npm, 2026-07-25 | `_tracker/06-lifewell-skills-tracker.json` → verifiedFacts |
| The 96 frozen URLs and 15 redirects | `code/production-projects/lifewell-project-root/02-FROZEN-CONTRACTS.md` |

## Related skills

- `aoneahsan-cccs-url-state-persistence` — which states belong in the URL at all
- `aoneahsan-cccs-react-api-tanstack-query` — the cache a loader warms
- `aoneahsan-cccs-react` — overall app structure
- `aoneahsan-cccs-react-seo` — why an indexed URL is frozen
- `aoneahsan-cccs-react-ui-ux` — the pending and error states each route renders

## Maintenance

- **Living registries this skill points at:** none. The frozen-URL list lives per project.
- **Last reviewed:** 2026-07-25
