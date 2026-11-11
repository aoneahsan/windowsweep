# D3 charts — overview

## Purpose

LifeWell is chart-dense — health time-series, symptom heatmaps, growth percentile curves, force-directed
association graphs, family and work trees — and the house rule is **D3 only**, no wrapper libraries. The
built-in `dataviz` skill gives library-agnostic design guidance; this gives the D3-in-React engineering that
keeps charts from fighting the framework, ignoring the theme, or excluding screen-reader users.

The boundary at its centre — React owns the DOM, D3 owns the maths — is the fix for the most common D3 bug in
a React app: a chart that vanishes on re-render because both are mutating the same nodes.

## What this skill does

- Draws the **React/D3 boundary** and confines `d3-selection` to the cases React cannot serve.
- Requires **theme tokens instead of hardcoded colour**, so charts follow dark mode and any rebrand, with the
  `@theme static` note for values D3 reads at runtime.
- Specifies **`ResizeObserver`** rather than a window listener, and guards against rendering at zero width.
- Makes an **accessible chart** concrete: a table fallback as the primary accessible representation,
  `role="img"` with a meaningful label, keyboard-navigable points, and never colour as the only encoding.
- Gives the **force-simulation lifecycle**, including the `sim.stop()` that prevents a permanent leak.
- Covers **empty and single-point states**, and the **canvas-over-SVG threshold**.

## When it gets invoked

- Building any chart, graph, heatmap or network visualisation.
- Making a chart responsive or theme-aware.
- An accessibility pass over a data-heavy screen.
- A chart disappearing on re-render, leaking memory, or unreadable in dark mode.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Every React project with data visualisation |
| Stack override | The concern is *charts that follow the theme, resize with their container, and are readable without sight*. A Flutter project satisfies it with its own painting layer — see `aoneahsan-cccs-flutter-ui-ux`. |

## Sources

| Source | Record |
|---|---|
| The owner's D3-only charting rule | `_source-understanding/files/prompt-logs.md` |
| `d3` 7.9.0 verified on npm, 2026-07-25 | `_tracker/06-lifewell-skills-tracker.json` → verifiedFacts |

## Related skills

- `aoneahsan-cccs-react-components` — where the D3-only rule is stated
- `aoneahsan-cccs-tailwind-v4` — tokens, and `@theme static` for values read at runtime
- `aoneahsan-cccs-react-accessibility` — the fallback and keyboard requirements
- `aoneahsan-cccs-react-performance` — the canvas threshold
- `dataviz` (built-in) — chart-type selection and colour design

## Maintenance

- **Living registries this skill points at:** none.
- **Last reviewed:** 2026-07-25
