# Overview — `aoneahsan-cccs-react-state-zustand`

## Purpose

Client state management. zustand is the fixed choice, and the skill's real job is drawing the boundary
between the three kinds of state so they stop leaking into each other.

## What this skill does

- Fixes **zustand** and rules out Context API, Redux, MobX and Jotai for app state — while noting what Context
  *is* still right for (injecting a stable value) and why it is wrong for changing state.
- Draws the three-way boundary: zustand for client state that crosses components, TanStack Query for anything
  from a server, `useState` for state a single component owns.
- Sets store structure — one store per domain rather than a global store, actions colocated with the state
  they mutate, and derived values computed rather than stored.
- Makes **selector discipline** explicit: always select a slice, because destructuring the whole store
  re-renders on every change. This is the most common cause of zustand feeling slow.
- Covers persistence through the `persist` middleware with a storage adapter — strata-storage or Capacitor
  Preferences, never raw `localStorage` — plus rehydration gating and the authenticated cross-device layer.

## When it gets invoked

- Adding client state, or creating a store.
- Reviewing a store, or diagnosing unexpected re-renders.
- Persisting user preferences or session data.
- Props are being threaded down more than two levels.
- Someone proposes Context, Redux or another state library.

## Where it applies

Every React project.

## Sources

`_source-understanding/files/prompt-logs.md` (zustand named, Context API explicitly excluded, the
fix-all-four-concerns instruction) and `_source-understanding/files/generic-project-rules.md` (R-021
persistence layering).

## Related skills

`aoneahsan-cccs-react-api-tanstack-query` (the server half of the boundary) · `-react-theming` (the
rehydration gate) · `-url-state-persistence` (state that belongs in the URL instead) ·
`-capacitor-packages-setup` (strata-storage).

## Maintenance

Re-check when strata-storage adoption replaces `@capacitor/preferences` fleet-wide — ztools still uses the
latter.
