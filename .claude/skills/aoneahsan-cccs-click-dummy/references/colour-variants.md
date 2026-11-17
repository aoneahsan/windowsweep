# Three colour variants — three genuinely different hues

A2 runs after the home page is approved and applies to **the whole UI** from A3 onward. It delivers three
colour treatments, each designed in light and dark: **six rendered combinations**, switchable from the dummy's
header so the owner judges them on a real page rather than as swatches.

## 🔴 Three DIFFERENT hues, temperatures and moods — owner directive, 2026-08-03

> *"they should always be in 3 different moods/temperatures/hues, instead of just same with a bit change …
> three color palletts must always be 3 properly and fully different tunes/moods/temperatures/hues"*

**One primary hue is REGISTERED per project. The other two are free.**

| | |
|---|---|
| **The registered primary** | `~/.claude/palettes/project-palettes.json` holds one distinct `primaryHue` per project. Prefer 25° clearance; where unavailable, maximize the feasible minimum circular distance and document the full palette treatment. |
| **The other two treatments** | Unregistered and unconstrained. They **may overlap any other project's hue** — the owner's words: *"2 can overlap with any other project fuck not matter"*. Nothing depends on their uniqueness. |

🔴 **This reverses the previous rule, which capped a treatment at ±8° from the primary.** That reasoning —
that a project claims one hue, so all three treatments must be versions of it — produced three
indistinguishable palettes on `aoneahsan-portfolio` (68 / 70 / 62), and the owner's verdict was exactly
that: *"other two are literally same as brass"*. **A treatment the user cannot tell apart from the default
is not a treatment.** Do not re-derive the ±8° constraint from the registry's primary-hue separation maths; the
separation rule governs the *registered* hue only.

Aim for roughly even thirds of the wheel. The worked example that replaced the failure:

| | hue | neutral hue | mood |
|---|---|---|---|
| `brass` | 68 | 68 warm ink | workshop, craft — **the registered primary** |
| `tide` | 198 | 225 cold slate | technical, precise, night |
| `iris` | 295 | 300 plum grey | creative, late, saturated |

Spread 130° / 97° / 133°, so no two can be confused at a glance.

🔴 **The NEUTRAL hue is what actually carries a treatment's temperature.** Two treatments can differ in
accent and still feel identical if the page around them is the same grey — that was half of why the failed
attempt failed. Move the neutral ramp with the accent, or the paper never changes.

## What still constrains the two free hues

They are free of the *registry*, not of the design. Both remaining checks are cheap:

1. 🔴 **An accent must not land on a semantic hue** — danger 27 · warning 85 · success 150 · info 240.
   A brand accent sitting on `success` means the user cannot tell a saved state from a button. Clear each
   by ≥40° where possible.
2. **Chroma near the sRGB boundary is silently clamped**, and the ceiling differs wildly by hue — violet
   holds ~0.20 at L .60 while cyan clamps around ~0.11. Author each ramp explicitly per treatment and
   verify the **rendered** chroma; a ramp computed by multiplying a factor cannot be checked.

## The proof they exist for

Three treatments that all look right is **evidence the token vocabulary is genuinely semantic**. If one of them
breaks — a button that goes invisible, a chart series that collapses, a border that vanishes — the cause is
almost always a component hardcoding a colour instead of consuming a token. That is the bug the variants exist
to surface, and it is cheaper to find here than after the app is built.

## What stays constant across all three

**Semantic colours are meaning, not brand.** Success, warning, danger and info keep their hues in every
treatment; only their lightness is re-solved per appearance so they stay legible. A danger red that changes hue
between variants teaches the user nothing.

🔴 **Check danger against the accent in each treatment.** An accent in the red-to-magenta arc can read as the
same colour as `danger` — one project had to move danger from hue 20 to 30 for exactly this reason, which also
brought it back inside the sRGB gamut.

**Chart series scales are re-derived per treatment**, not reused. A five-series categorical scale tuned against
a cool neutral loses separation against a warm one (`aoneahsan-cccs-d3-charts`).

### 🔴 A derived ramp does not follow a hue that moves later

The rule above is about deriving a ramp **once, per treatment**. This is the other half, and it is the half
that gets missed: **when a treatment's hue is changed after the fact, every ramp solved against the old frame
is silently stale.** Nothing recomputes; the numbers were literals the day they were written.

Live case, aoneahsan.com 2026-08-13. All three treatments originally sat in a warm 62–70° band, so a
categorical series at hue **190** was far from every one of them. An owner directive then moved the second
treatment to **198** — and 190 became **8° from that treatment's accent, at identical chroma**. In that
treatment a data series rendered in the brand colour, which is precisely the failure the ramp's own comment
said it existed to prevent. The token file still carried its original claim of *"at least 28° from every
accent"*, so the file asserted the very separation it no longer had, for ten days, across every chart.

**So the trigger is the hue change, not the ramp.** When a claimed or treatment hue moves:

1. **Re-solve every derived ramp** against the new frame — categorical series, chart colours, anything whose
   hue was chosen *relative* to an accent. Semantic hues are constant and exempt.
2. **Re-check the file's own written claim.** A separation figure in a comment is a measurement with an
   expiry date; if the hue moved, the sentence is now a false statement sitting exactly where a future editor
   will trust it.
3. **State the honest floor, even when it is uglier.** On that project a second series sat 26° from an accent
   and could not be moved: `danger` at 27 and the accent at 68 bound an arc **41°** wide, so ≥28° from the
   accent forces ≤13° from danger — and a series reading as the danger colour is the worse defect. The claim
   was corrected to 26° with the arithmetic recorded. **Rounding a constraint up to the number you wanted is
   how the first error happened.**

## Contrast is verified per treatment, per appearance — all six

Every combination independently clears: body text on every surface it appears on, accent-on-surface for the
primary action, the focus ring at ≥3:1 against **both** the component and its background, and every adjacent
pair in a data ramp. **A treatment that only works in dark is not a treatment**, it is an unfinished one.

Verify against the **rendered DOM**, not the authored values — pitfall 1. A colour authored outside the sRGB
gamut is silently clamped, so the number you computed is not the number on screen.

🔴 **Measure the thing STANDING ON a band, not only the band.** With three genuinely different hues the
treatments no longer share a lightness, and the trap that follows is specific: a treatment whose accent
peaks darker (violet at L .585) invites you to flip the on-band text to near-white — which then collides
with any chip, badge or card that sits on that band carrying a light background of its own. Measured
**1.67:1** on `aoneahsan-portfolio`'s product-mark chips; the band itself was perfectly legible.

**Prefer an invariant to three bespoke corrections:** a light appearance keeps a light accent band and dark
on-band text in *every* treatment. Adjust the band's lightness to fit the rule rather than inverting the
text to fit the band.

## Where they live

One block per treatment in `tokens.css`, keyed on a data attribute, with light and dark values inside each:

```css
[data-palette='clinical'] {
  --color-accent:  light-dark(oklch(0.51 0.155 288), oklch(0.72 0.145 288));
  --color-surface: light-dark(oklch(0.99 0.002 288), oklch(0.19 0.006 288));
  /* … the full ramp, both appearances … */
}
```

🔴 **`data-theme` is the preference (`light` | `dark` | `system`); `data-appearance` is the resolved value.**
A `system` preference has no colours of its own, so a stylesheet cannot express it — resolve it in script and
write the result to a second attribute. Conflating the two is how a `system` user gets an unstyled page.

## Naming

Name a treatment for the mood it carries — `brass`, `tide`, `iris` — never `variant-1`. The owner picks by
feel, and a name he can say is a name he can pick.

## The switcher

A header control that cycles treatment × appearance. It is a **preference**, so it persists (via
`strata-storage`, per `references/state-layer.md`) — unlike a demonstration switch, which never does. The
same control is the seed of the app's real theme customiser: `aoneahsan-cccs-react-theming`.

## What the hand-back states

Which treatment is the **default** and why, the three names, and the contrast figures for the primary action and
the focus ring in all six combinations. A claim of "all pass AA" without numbers is not verification.

**Last updated:** 2026-11-06 (palette capacity rule). Earlier 2026-08-03 (three genuinely different hues; the ±8° same-hue rule retired).
