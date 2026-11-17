---
name: aoneahsan-cccs-d3-charts
description: 'Charts with D3 in React: the boundary that stops React and D3 fighting over the DOM, a fixed rendered box while the domain grows, one canonical colour scale per metric, responsive sizing, theme tokens, a table fallback and keyboard access, force-simulation lifecycle, and when canvas replaces SVG. Use for any chart or graph.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/files/prompt-logs.md; habitforge rope chart, 2026-07-29
---

# D3 charts

**D3 is the house charting library — no Recharts, Chart.js, ApexCharts, Victory or Nivo.** One library, full
control, and no fight with a wrapper's opinions.

## 🔴 The boundary

**React owns the DOM. D3 owns the maths.** Both touching the same nodes is the source of every "the chart
disappears on re-render" bug: D3 computes scales, shapes and layout as pure calculation; React renders the
result. Use `d3-selection` **only** where React cannot help — a force simulation's per-tick updates, a zoom
behaviour's event plumbing — and confine it to a `useRef`'d subtree React never renders into.

The worked component: `references/patterns.md`.

## 🔴 The rendered box must not change with the data

**Grow the domain. Never grow the range.** A chart whose element resizes as values arrive is layout shift
wearing a costume — the page reflows while the user works, and every neighbour moves with it.

🔴 **Verify by measuring `getBoundingClientRect()` at several data values and asserting the numbers are
identical**, not merely reasonable. Dead space in a thin state is solved inside the frame, never by resizing it.

The two causes — a length that ramps with the value, and a viewBox cropped to the drawing — both look fine in
any single screenshot, which is why they ship: `references/scales.md`.

## 🔴 One canonical scale per metric

If colour means "strength" it must mean it identically on every surface — chart, badge, list row, card. A
gradient re-invented per chart teaches the reader nothing, because the same colour means a different number two
components later.

Define it **once**, export it, and derive the text label from the same function that produces the colour, so a
label and a swatch can never disagree. Anchors are read from the DOM, so rebuild on every theme change,
including the `prefers-color-scheme` path a switcher forgets to signal. Keep the ramp off the brand accent, or
"high value" looks like "primary action" — and always pair colour with a second channel.

🔴 **Every channel encoding it shares that domain — and the domain is the REACHABLE range, not `[0, 100]`.**
A score with a flat +30 term never falls below 31, so a linear ramp burns 46% of itself on day one.
**Labels round; marks do not.**

Worked numbers, four traps: `references/scales.md`.

## Theme tokens, never hardcoded colour

`stroke="var(--color-accent)"` follows the palette, the user's theme and any future rebrand. `stroke="#7c3aed"`
follows nothing, and is invisible in dark mode.

For a value D3 needs as a **string** (an interpolator, a scale range), read it once from the computed style
rather than duplicating the hex — and declare those tokens `@theme static` so they exist even when no
utility references them (`aoneahsan-cccs-tailwind-v4`).

## Responsive

`ResizeObserver` on the container, not a window listener — the container changes when a sidebar opens and the
window does not. Disconnect it on cleanup, and render nothing until `width > 0`. The hook:
`references/patterns.md` → "Responsive sizing and dialled data".

## 🔴 An accessible chart

A chart is an image to a screen reader unless it is given more:

- **A table fallback carrying the same data** — visually hidden or in a disclosure. This is the primary
  accessible representation, not a consolation prize.
- **`role="img"` + a meaningful `aria-label`** describing what it shows, including the trend.
- **Keyboard-navigable data points** where points are interactive: focusable, arrow keys to move, the value
  announced.
- **Never colour as the only encoding.** Pair it with shape, pattern, direct labels or position — a
  red-versus-green series is unreadable for the most common colour deficiency.

## Lifecycle, degenerate data, and canvas

A force simulation that is never stopped keeps ticking after unmount, setting state on a dead component —
`sim.stop()` in the effect cleanup, always. An empty chart gets a designed empty state, not blank axes. A
line chart with a **single** datum draws nothing, so render the point. Above roughly 1,000 marks, keep D3 for
the scales and draw the marks to canvas.

Working code for all four: `references/patterns.md`.

🔴 **A chart is specified only once its data can be DIALLED** — series and point counts, zero/negative/null,
one spike, **all-equal values**, long labels, loading and empty. Read `references/patterns.md` → "Responsive
sizing and dialled data" and **`aoneahsan-cccs-component-playground`** before calling a chart specified.

## Common mistakes

| Mistake | What happens | Instead |
|---|---|---|
| 🔴 Fetching rows and reducing them into a series | 10,000 reads to draw 90 marks; fine on a seeded DB, an outage on a real one | the query returns the buckets — `references/data-path.md` |
| D3 `.append()` into React-rendered nodes | chart vanishes on re-render | React renders; D3 calculates |
| Hand-rolled SVG strings "just for a mockup" | no scale, no axis, no table — and it ships | the real library, bundled |

**`references/pitfalls.md` — eight more**, grouped by what they break: three in theme and colour (including one
ramp meaning two things, which passes review because each chart looks right alone), three in lifecycle and
sizing (including the resize listener that passes every manual test and fails on a collapsing sidebar), one
scale-honesty, one accessibility.

## Related skills

Where the numbers come from: `references/data-path.md`.

`aoneahsan-cccs-data-contract` (buckets, not rows) · `aoneahsan-cccs-react-components` (D3-only rule) · `-tailwind-v4` (tokens, and `@theme static` for values
read at runtime) · `-component-playground` (the data dials that make a chart reviewable) ·
`-react-accessibility` (the fallback and keyboard requirements) · `-react-performance`
(the canvas threshold) · the built-in `dataviz` skill (chart-type and colour-design guidance).
