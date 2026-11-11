---
name: ext-vercel-vercel-react-best-practices
description: Vetted React performance patterns for the WindowSweep Vite desktop and web apps. Use when changing React rendering, data loading, or bundle structure; consult the named rule files only as needed.
license: MIT
metadata:
  author: vercel
  source: vercel-labs-agent-skills/react-best-practices
  sourceCommit: 7c180d9
---

# React performance guidance for WindowSweep

This is a selected fork of Vercel's React Best Practices. It keeps the React rules that apply to WindowSweep's Vite apps. The full upstream guide also covers Next.js, SWR and direct browser storage; those instructions are outside this project's stack. The project uses TanStack Query for server data and strata-storage for local state. Follow the `aoneahsan-cccs-*` skills and the repository's `AGENTS.md` for stack, accessibility and workflow decisions.

Read one relevant file from `rules/` before applying a pattern. Measure a performance problem before adding an abstraction. The retained rules are:

| Concern | Rule files |
|---|---|
| Independent async work | `async-parallel.md`, `async-defer-await.md` |
| Bundle shape | `bundle-conditional.md` |
| Derived and frequently updated state | `rerender-derived-state.md`, `rerender-derived-state-no-effect.md`, `rerender-functional-setstate.md`, `rerender-memo.md`, `rerender-no-inline-components.md`, `rerender-move-effect-to-event.md` |
| Rendering large or conditional content | `rendering-content-visibility.md`, `rendering-conditional-render.md` |
| Repeated lookups and immutable sorting | `js-index-maps.md`, `js-set-map-lookups.md`, `js-tosorted-immutable.md` |

Do not introduce a package, storage call, polling loop, or rendering pattern solely because an upstream example uses one. Confirm the pattern against the installed React version and the app's existing primitives.
