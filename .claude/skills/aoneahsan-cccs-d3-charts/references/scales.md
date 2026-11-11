# Scales — anchoring, sharing, and the traps that pass every gate

Companion to `SKILL.md` → "One canonical scale per metric". Everything here was found by looking at a
rendered chart, never by a build gate.

## The module

One module, imported everywhere the metric is shown — the label and the colour come from the same source:

```ts
export const strengthColor = scaleLinear<string>()
  .domain(STOPS)                              // the named tier boundaries, see below
  .range(tierColours)                         // read from computed style, so it follows the theme
  .interpolate(interpolateLab);               // perceptual, so mid-values look mid
export const strengthTier = (v: number) => TIERS.findLast(t => v >= t.from)!;
```

Rebuild it on every theme change, including the `prefers-color-scheme` path — the user never clicked
anything, so a theme switcher usually forgets to signal it and the scale goes stale.

## Anchor on what the metric can actually produce

`.domain([0, 100])` is a *guess* that the metric uses all of 0..100. Verify it.

**The worked case.** A habit-strength score summed three terms, one of which — "done today" — contributed a
flat **30 of the 100**. So a live streak could never score below **31**, and days 1–5 of a five-tier ladder
occupied strengths 31, 31, 32, 32, 33.

A rope's thickness mapped that nominal 0..100 onto half-width 9..42. Measured:

| | reset | day 1 | day 5 | day 120 |
|---|---|---|---|---|
| strength | 0 | 31 | 33 | 100 |
| thickness | 49.8px | 47.4px | 49.0px | 103.5px |

Four defects, one cause:

1. **Day one consumed 46% of the range.** The first tier of five looked like half the last.
2. **The whole journey was a 2.2× visual range**, so growth was barely legible.
3. **The first tier grew 1.6px across its five days** — four interactions with no visible result.
4. **The ramp's floor was unreachable**, so the empty state had to hardcode a mid value and became the
   *thickest* thing on the page at 48% of maximum.

Re-anchoring on the tier floors, with the first tier pinned to its real day-one value:

```js
// exported once; colour and thickness both read it
export const STOPS = [0, LIVE_FLOOR, 34, 48, 70, 92, 100];   // LIVE_FLOOR derived, not typed
const halfFor = scaleLinear().domain(STOPS).range([1.6, 2.4, 5, 10.5, 19, 30, 40]).clamp(true);
```

2.2× became **16.7×**, day one dropped to 6% of the frame, and the five tier cards separated by 1.6–2.2×
each instead of 1.05×.

**Derive the floor, never type it.** `LIVE_FLOOR = score({streak: 1, doneToday: 1, round: false})` follows the
formula if its weights change; a literal `31` silently stops matching.

## The anchor is not a label — do not round it

Pinning the first tier to the *displayed* 31 when the real value is 30.58 puts the anchor fractionally above
the value it is meant to anchor, so day one **clamps to the floor** and the second step moves a third as far
as the third does. Anchors take the unrounded value.

## Labels round; marks do not

A display function ending in `Math.round(v)` quantises the metric to integers. Over a slow-moving early
range that means **consecutive interactions produce identical geometry** — days 1–5 above gave 31/31/32/32/33,
so two of the first five check-ins moved nothing at all.

Keep both readings on every sample:

```js
{ day, strength: score(day),              // integer — tier, label, the data table
  exact:  score(day, {round: false}) }    // continuous — thickness, colour, position
```

A chart is not quantised to its label's precision. Tier *decisions* (which strand is present, which name is
shown) use the rounded value so they agree with the visible label; every *mark* uses the continuous one.

## One domain, several ranges

When two channels encode one metric — colour and thickness, size and opacity — they share the domain array
and differ only in range. Two channels on two domains disagree about the same value, which is worse than one
channel alone: a day-one "Thread" rendered 91% of the way to the *string* colour because thickness had been
re-anchored and colour had not.

## Frame versus data

A decorative terminal — a rounded cap, an end marker — carries no value and may sit past the last data point.
It must not sit past the **frame**. Ending the axis line and any reference envelope at `X1` let a
maximum-thickness cap bulge ~50px beyond both, which reads as the chart having been cropped.

```js
const PLOT_END = X1 + MAX_HALF;              // frame
g.select('.domain').attr('d', `M${X0},0H${PLOT_END}`);
```

Ticks mark the data; the line is the frame. Sample a reference envelope in **pixel** space so it reaches
`PLOT_END`, deriving its `t` from the data range so any sag still matches the series exactly.

## A thin mark disappears when the viewBox scales down

A 1000-unit-wide viewBox in a 320px viewport scales by 0.29. A mark 3.2 units tall renders at **0.92px** and
vanishes on a phone — while looking perfectly fine on the desktop it was designed on.

```js
.attr('stroke', paint).attr('stroke-width', 1).attr('vector-effect', 'non-scaling-stroke')
```

~1px at every viewport, imperceptible on a 98px mark. Check the *thinnest* state at the *smallest* width;
neither shows up at the size you are working at.

## Verifying a scale

- **Print the metric at its real extremes** — first value, each named boundary, the ceiling — and read the
  rendered pixels, not the formula.
- **Step the first few interactions one at a time** and assert each one changes the geometry.
- **Measure the rendered box at several data sizes** and assert it is identical (`SKILL.md` → the box rule).
- **Look at it at full size.** The cap overhang and the sub-pixel thread above both passed every numeric
  check and were obvious in a screenshot.

---

## The two causes of a chart whose box grows with the data

Moved out of `SKILL.md` 2026-07-30 (size budget). The rule — grow the domain, never the range — stays there.
Both of these look fine in any single screenshot, which is why they ship.

- **A length that ramps with the value.** `span: max(0.14, days / 110)` on a habitforge rope collapsed the
  drawing to 14% width on the *first* data point, because the zero state had its own full-width branch. The
  element visibly shrank the moment it was used.
- **A viewBox cropped to the drawing** plus `height: auto`, so the aspect ratio — and therefore the element's
  height — follows the data.

```ts
// ✅ the frame is constant; only what is mapped into it changes
const x = scaleLinear().domain([0, days]).range([X0, X1]);   // X0/X1 are fixed
```

**Verify by measuring `getBoundingClientRect()` at several data values and asserting the numbers are
identical**, not merely reasonable. Dead space in a thin state is a composition problem to solve inside the
frame, never by resizing the frame.
