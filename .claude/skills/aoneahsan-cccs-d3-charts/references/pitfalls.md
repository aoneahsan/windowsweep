# Chart pitfalls — the long tail

**Last Updated:** 2026-07-30 · Split out of `SKILL.md` when it exceeded the size budget. The three costliest
stay in `SKILL.md`; these eight are the rest, grouped by what they break.

## Theme and colour

| Mistake | What happens | Instead |
|---|---|---|
| Hardcoded hex | invisible in dark mode | theme tokens |
| Colour-only series encoding | unreadable for colour deficiency | pair with shape or labels |
| A colour ramp re-invented per chart | the same colour means two things | one exported scale per metric |

The third is the one that survives review, because each chart looks right alone. It only reads as a bug when two
charts sit on the same dashboard and "green" means *healthy* in one and *category 3* in the other. One exported
scale per metric is the fix — see `references/scales.md`.

## Lifecycle and sizing

| Mistake | What happens | Instead |
|---|---|---|
| Window resize listener | misses container-only changes | `ResizeObserver` |
| Simulation never stopped | memory leak, setState after unmount | `sim.stop()` in cleanup |
| Range or viewBox growing with the data | the element resizes as the user works | grow `.domain()`, fix the range |

A resize listener is the classic false pass: it works in every manual test, because a human resizing a window
resizes the container too. It fails when a sidebar collapses, a panel splits, or a details row expands — the
container changes and the window does not.

## Scale honesty

| Mistake | What happens | Instead |
|---|---|---|
| `.domain([0, 100])` on a metric that starts at 31 | a third of the range spent before the first value | anchor on the reachable range |

## Accessibility

| Mistake | What happens | Instead |
|---|---|---|
| Chart with no table fallback | unreadable to a screen reader | the table is the accessible view |

Not a nicety and not an add-on: the table **is** the chart's text alternative, which is why it belongs in the
same component rather than behind a toggle nobody finds.
