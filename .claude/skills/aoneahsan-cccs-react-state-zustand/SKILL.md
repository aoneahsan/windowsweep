---
name: aoneahsan-cccs-react-state-zustand
description: 'Client state with zustand: store structure, selector discipline to avoid re-renders, persistence through strata-storage rather than any raw web storage API, and the rule against Context API for app state. Use when adding client state, persisting preferences, or when props are drilled more than two levels.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/files/prompt-logs.md
---

# State — zustand

**zustand for client state. Not Context API, not Redux, not MobX, not Jotai.** The owner's rule:
*"we must not use context API or other complex state management libraries, as this one does what we
need/want."*

Context is still correct for what it is actually for: dependency injection of a stable value (a theme object,
a query client, a router). It is wrong for state that changes, because every consumer re-renders on every
change regardless of which slice it uses.

## What belongs in a store

**Client state only.** Server data belongs to TanStack Query — see `aoneahsan-cccs-react-api-tanstack-query`.
Putting fetched data in zustand means reimplementing caching, invalidation and refetching by hand.

| zustand | TanStack Query | `useState` |
|---|---|---|
| auth session, preferences, theme, cart, cross-page UI state | anything from a server | state one component owns and nothing else reads |

If exactly one component reads it, `useState` is the right answer. A store is for state that outlives or
crosses components.

## Slice per domain, actions inside

```ts
interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  clear: () => void;
  total: () => number;      // derive, never store
}
```

One store per domain (`authStore`, `cartStore`, `themeStore`) — not one global store. Actions live in the
store beside the state they mutate, so a component never assembles a multi-step update itself. **Derived
values are computed, never stored** — a stored total is a second source of truth that will disagree.

## 🔴 Always select a slice

```ts
const items = useCartStore((s) => s.items);          // ✅ re-renders only when items change
const { items } = useCartStore();                    // ❌ re-renders on EVERY store change
```

This is the single most common zustand mistake and the reason a store can feel slower than props. For
multiple values use `useShallow`, or take separate selectors.

## Persistence

Wrap with `persist` and give it a storage adapter — **never raw `localStorage`**. Every web storage API goes
through **`strata-storage`** (`aoneahsan-cccs-strata-storage`), which behaves identically on web and native;
`@capacitor/preferences` survives only in projects that predate it. One `strataAdapter` per project lives in
`src/lib/` and nothing else touches storage directly. Persist only what should survive a reload: preferences
yes, transient UI state no.

Gate first paint on rehydration so the app never flashes the wrong theme — see `aoneahsan-cccs-react-theming`.

Authenticated users get a second layer: the same preferences in the backend, so they follow the user across
devices. Remote wins on sign-in; debounce writes.

For store setup, middleware, testing and cross-device sync, read `references/patterns.md`.

🔴 **Selectors are part of the fleet performance standard** (2026-09-11) — whole-store subscriptions and
Context-as-app-state are defects there: `aoneahsan-cccs-react-performance/references/performance-standard.md` §2.
