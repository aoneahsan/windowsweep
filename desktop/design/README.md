# windowsweep desktop - the design argument

Last Updated: 2026-09-04 (round 3) · Direction **02, "Reclaim"** · Phase P6-A, gate 1 pending

The reasoning behind the click dummy in `windowsweep-click-dummy/`. Written so the owner can disagree with
the *argument* rather than only with the pixels. Nothing here was put to him as a choice; the decisions are
made and defended, per `~/.claude/rules/frontend-ui-standards.md` §8.

**Direction 01 was rejected on 2026-09-04.** Its post-mortem, its own words and the archived page are at
`windowsweep-click-dummy/_rejected/01-instrument-panel-2026-09-04/`. This document does not repeat that; it
starts from what replaced it.

---

## 1. The design read, and the one mistake that mattered

The anti-slop method's first step is a one-line read, before any markup:

> **Reading this as: a desktop utility's primary screen, for developers and power users on their own Windows
> machine, in a confident "workshop instrument" language - dark-first, high-contrast, with a live data
> visualisation as the hero and mechanical motion.**

Direction 01 got that line wrong, and everything downstream followed. It read windowsweep-desktop as a
**dashboard / trust-first regulated surface** and set the dials to VARIANCE 3-5 · MOTION 2-4 · DENSITY 7-8.
Those are the dials for an internal tool somebody stares at for eight hours; they cannot produce an attractive
page, and no amount of execution quality recovers from them.

This is not that. It is a **premium consumer utility opened for two minutes a month**, where being impressive
*is* the product - which is the entire reason people pay for CleanMyMac rather than using the free
alternatives that do the same deletions.

### 🔴 The dials are set per REGIME, and that split is the structural fix

| Regime | Screens | VARIANCE | MOTION | DENSITY |
|---|---|---|---|---|
| **Moment** | Home, Run, Splash, Consent, Account, Elevation | 7 | 6 | 3 |
| **Cockpit** | Sections, Picker, History, Settings, Report | 5 | 4 | 7 |

Same tokens, different composition. `anti-slop.md`'s scope-honesty clause is honoured rather than ignored -
high variance in a data table is a defect, so it is not applied there. Direction 01's error was applying the
second row to *everything*, including the screen the user sees first.

The independent corroboration: `ext-taste-design-taste-frontend`'s own preset table gives
**Premium consumer = 7 / 6 / 3**, arrived at from a different direction.

## 2. The signature element - "The Reclaim Map"

Every reclaimable target as one tile: **sized by bytes, hue by tier, lightness by staleness, grouped by
section.** Real `d3.treemap()`, vendored, not SVG assembled from strings.

**Why this and not a storage doughnut.** The product's whole thesis is one sentence - *the user must know what
will go before it goes.* A treemap is that sentence, drawn. It is also the only way 26 sections and hundreds
of targets become legible at a glance, and nothing else in this category does it on Windows.

- **Hover** a tile: full path, size, idle days, tier.
- **Click** a tile: keep it. The readout above re-totals live, and the toast carries **undo**.
- **Clean**: the tiles *drain* and the drive rails fill. One memorable, deliberate moment beats twelve
  ambient loops.
- 🔴 **The zero state was designed first, not last.** A clean machine draws the same object from the
  **protected** list, dimmed - *"every location behind these tiles is protected or in use"* - which is true,
  informative, and still recognisably the product. A signature element that renders as a blank rectangle
  destroys the argument on first paint, and that is a recorded failure elsewhere in the fleet.

### Two channels, two variables, each canonical

| Channel | Means |
|---|---|
| **Hue** | tier - how risky removing it is (`config` -> `permanent`) |
| **Lightness** | idle days - how stale it is |

The first version used hue alone. On a developer machine eight of eight sections are `rebuilds`, so the map
painted one flat green and told the reader nothing the total did not already say. Staleness is the variable
the product actually reasons about, so it earns the second channel rather than a decorative stripe. **The
idle domain is the reachable range, re-solved per render**, so a machine whose oldest cache is 60 days still
gets the full ramp. Both channels are named in the on-screen legend.


## 2a. Round 3 - what "better, but not final" changed

His verdict on round 2 was *"okay it's better but still not final, improve it make it better and more
beautiful"*. That is neither a rejection nor a keep-and-branch, so direction 02 stands and was refined in
place - nothing was archived. Four causes, all specific:

### 🔴 The accent was over-spent, and it cost the hero

`rebuilds` was aliased straight to `--c-accent`, and eight of eight sections are `rebuilds` - so the largest
element on the page was painted in full-strength brand colour. The accent is spent on **three** things: the
primary action, a measured value, and the selected nav item. Spending it across half the viewport is what
made the page read as a green block and stole the number's power.

The first correction muted every tier to one drab tone and the map went from too loud to **mud**. The answer
was a **range**: each tier declares a quiet `-lo` and a saturated `-hi`, and the idle ramp interpolates
between them. A cache touched yesterday sits back into the surface; one untouched for eight months is bright
and worth looking at. Every tile now stays below the accent's peak (L .82 / C .185), so the hero and the CTA
keep it to themselves.

### The page had no light in it

Round 2 was correct, legible and entirely flat - every surface a solid fill with a 1px border. Added, all
under the decorative ceiling and none of it animated: two ambient accent fields behind the app ground
(9% and 5%), a 1.6% grain so surfaces read as material rather than fill, a top-edge sheen and hairline on
every panel, band seams that fade at the edges instead of ruling straight across, a glow under the hero
number, and the product's sweep metaphor at 10% behind it.

### 🔴 The hero's right half was dead space, and the map was carrying the page

Both fixed by one element: **the capacity ring** - three concentric arcs, one per drive, used / reclaimable /
free, with the reclaimable slice in full accent and a soft glow. It is the page's only circle, which is most
of why the layout stopped reading as a stack of rectangles. The treemap's frame then dropped from 420 to 340
so the drives and the ladder are visible above the fold; the map is the hero's *evidence*, not the whole page.

### Typography was correct in the display face and wrong in the details

A spaced hyphen is not a dash and a straight apostrophe is not an apostrophe - and that group is most of why
competent text still reads as machine-written. Applied to text nodes only, never inside `<code>`, so every
CLI literal is untouched. 🔴 The project's ASCII-only IRON rule covers the PowerShell engine and `bin/*.js` -
its file set was **read, not assumed** - so the desktop tree can carry proper punctuation.

### And one instrument gap, which is the finding that matters most

**The contrast sweep had never measured the treemap's labels.** SVG text paints with `fill`, not `color`, so
reading `color` returned an inherited value and silently skipped 56 text nodes - the single largest block of
text on the page. It reported 0 failures while never looking at the map. Corrected, then *proved* corrected
by showing `fill` genuinely differs from `color` on 9 of those nodes. A sweep is only as good as the property
it reads.

## 3. Typography - hierarchy carried by the WIDTH axis

**Inter is retired** - it is item 5 on the anti-default list, and it was direction 01's UI face.

| Role | Stack |
|---|---|
| Display + numerals | **Archivo Expanded** -> `Segoe UI Variable Display`, `Segoe UI`, system-ui |
| UI text | **Archivo** (same family, normal width) |
| Paths, log, sizes | **JetBrains Mono** -> `Cascadia Code`, `Consolas` |

🔴 **The deliberate idea: hierarchy by width, not only by size and weight.** Archivo is a variable grotesque
carrying `wdth 62-125`; one family at two widths gives a hierarchy device almost no UI uses, which is exactly
why it reads as chosen. `42.7 GB` in Archivo Expanded 700 is a different object from Inter 600.

What was rejected, from the catalogued pairings in `ext-uiuxpm-ui-ux-pro-max`'s typography database:
JetBrains-Mono-only (too extreme for an app shell), Space Mono (brutalist, wrong register), **Inter** (the
anti-default), and IBM Plex Sans + JetBrains Mono (correct family *shape*, no width axis). The last is the
nearest catalogued neighbour and Archivo replaces it for the axis alone.

Both faces are **self-hosted** (`vendor/fonts/`, latin subsets, 121 KB), so the dummy has zero network
dependencies and renders offline exactly as reviewed.

## 4. Layout - a bento grid, three bands, real elevation

Direction 01 was a single column of eight identical `rounded-panel border bg-panel` cards at one width. This
is a **12-column grid** with asymmetric spans (7/5, 8/4, full-bleed, inset) and **three band treatments** -
`panel` raised, `well` sunken, `bleed` edge-to-edge inverted.

🔴 **No two adjacent zones share a shape**, and consecutive zones differ in at least two of {band, content
width, internal layout}. 🔴 **Elevation is a genuine lightness step plus a border plus inner light on dark /
a real shadow on light** - two or three points of lightness collapse into mud and read as "flat" without a
reviewer being able to say why, which is a fair description of part of what "very basic" meant.

### The 14 zones of Home, named so the count is checkable

1 window chrome (frameless - we draw it) · 2 the reclaim readout · **3 the Reclaim Map** · 4 drive capacity
rails · 5 the safe-run ladder · 6 developer mode with its live consequence · 7 "these need a person" ·
8 the chokepoint, drawn · 9 the protected-path chip field · 10 the last eight runs, with a sparkline ·
11 schedule · 12 sections that need admin · 13 what leaves this machine · 14 the status bar.

`home-page.md`'s 12-15 floor is **honoured**, expressed as app zones rather than marketing bands. Direction
01 waived it outright; that waiver is withdrawn, because the floor's purpose is "do not ship something that
reads as templated" and eight identical cards is exactly what it exists to catch.

**Zone 4 is not three cards.** One stacked rail per drive showing used / **reclaimable** / free - three
separate percentage cards, which is what direction 01 shipped, cannot show the reclaimable slice at all.

## 5. Colour

**Registered primary: hue 128, lime.** Re-read the registry immediately before authoring (it has parallel
writers): 12 claims, and 128 still sits in the widest usable gap - taxease 104 and wakalat 152, 24 degrees
each side. The only wider gaps land on semantic hues. **The hue was never what was wrong**, so it is not
re-registered.

| Treatment | Accent | Neutral | Mood |
|---|---|---|---|
| **lime** (default) | 128 | 128 | technical, signal, alive |
| **sky** | 231 | 225 cold slate | night, systems - agrees with the shipped logo mark |
| **plum** | 320 | 315 warm | low-glare, late, saturated |

Spread 103 / 89 / 168 degrees. 🔴 **The neutral hue moves with the accent** - a grey that stays grey while
the accent moves is the tell of a recoloured rather than a re-themed interface.

**Three semantic colours, constant across all treatments:** danger 27 · warning 85 · success 150.
🔴 `info` (240) is deliberately **not declared** - windowsweep has no informational state, so there is
nothing for a blue to mean, and declaring an unused token would have collided with the sky accent at 9
degrees.

### 🔴 The one real collision, stated rather than rounded away

The registered accent (128) is **22 degrees** from success (150). The rule asks for 40 where possible; 40 is
not possible without moving either the registered hue or a semantic one. Direction 01 moved success to 158,
which bought 8 degrees and broke *"semantic colours stay constant"*. Instead the separation is carried by two
other channels, both mandatory: **chroma** (accent .150-.190 against success .085-.090, roughly half) and **a
glyph** - `.state-ok` never renders without its tick. The honest floor, 22, is written into `tokens.css` with
the arithmetic beside it.

## 6. Motion - "shutter and drain"

`--ease-mech: cubic-bezier(.2, .9, .25, 1)`. Things move on one axis and stop sharply, like a mechanism.
Nothing springs, nothing bounces. State change <=180 ms · entrance <=500 ms, staggered on a screen's first
paint only, never on a list · determinate per-section progress from the engine's own `##windowsweep` lines,
never an indeterminate spinner · 🔴 **the run log never animates**, because it is the one surface a person
watches while something irreversible happens · `prefers-reduced-motion` honoured at the token layer **and**
a motion axis in the panel, consulted through one helper that reads both.

## 7. The one theme control - ten axes

appearance · colour treatment · corner radius · density · text size · typeface · panel background · custom
cursor · motion · sound. One header icon, one panel, card selectors that **preview their own value**.
🔴 Stamped on `<html>` **pre-paint from one table iterated once** - appearance applied late is a flash,
density or text size applied late is a reflow. `sound` is the only axis defaulting off.

Numeric axes are `calc()` multipliers on a single unit, so an axis cannot reach some tokens and miss others.
The surface-style axis **composes** into its own token rather than trying to out-specify the palette block.

**Default appearance is `dark`, not `system`.** The theming skill recommends `system` in the absence of a
decision; this is a decision, and an approved artefact outranks a skill default.

## 8. Consent, privacy, and the account

The CLI makes **zero network calls** and its own test suite asserts it. The desktop app can send analytics and
crash reports and sends nothing until accepted - all four providers listed individually and individually
revocable. Sign-in is **optional and for sync only**; 🔴 **runs are never gated, there is no paid tier and no
plan set** (an explicit owner exemption from the fleet plan-set rule, 2026-09-03). Synced run history carries
no paths, host name or user name, so the History screen labels cloud rows "summary only".

## 9. What the dummy does not decide

The **DOM of interactive widgets** belongs to React Aria Components - this gives the visual specification and
working behaviour, not the anatomy. Also not the dummy's: routes, the data model, or which features exist.

## 10. Deviations, each with its authority

| Deviation | Why |
|---|---|
| **No pricing page**, though `page-inventory.md` calls it mandatory | The owner's explicit 2026-09-03 decision for this app: runs always free, no paid tier, no plan set. His current instruction outranks a skill default. Recorded, not silently dropped |
| **No admin batch** | A local utility with optional sync has no platform surface; the derived admin surface is the Firebase console (recorded 2026-09-03) |
| **Plain CSS, no Tailwind CDN** | `tokens.css` is authored in exactly the shape the app's `@theme inline` will wrap, so it still promotes in one direction - and the dummy gains zero network dependencies, which a design specification should have |
| **`wsStore` wrapper, not `strata-storage`** | Vendoring strata is a download, gated on `PENDING-TASKS.md` TASK-001. Same shape and the same `namespace` semantics, verified by reading a physical key |
| **Three screens at A1, not one** | One direction, **not a menu** - which is what "A1 delivers ONE home page" forbids. The two extra screens are the dense regime where direction 01 actually failed. Owner-approved scope |

## 11. Gates

| Gate | State |
|---|---|
| **1 - direction** (home + three treatments) | 🟡 **awaiting the owner** - `docs/MANUAL-TASKS.md` row 17 |
| 2 - vocabulary (component library) | not started |
| 3 - the phase (every page, wired, persisting) | not started |
| 4 - parity (the built app matching, page by page) | not started - closes after the app exists |

🔴 **Nothing is created under `desktop/` beyond this design folder until gate 3 is recorded.** No app
scaffold, no `package.json`, no `src-tauri/`.

## 12. How to review it

Open `windowsweep-click-dummy/index.html` by double-click. It works offline.

- The **theme icon** in the title bar opens all ten axes. Every card previews its own value.
- **Click tiles** on the map to keep them - the total re-totals and the toast offers undo.
- Drag the **idle window** slider and watch the map and the held-back figure move together.
- **`review tools`**, bottom left (or Ctrl+Alt+D): the storage backend actually in use, the four gates, and a
  button that **plants each defect on purpose** so you can watch a gate go red rather than take its word.
- A link can carry a look without saving it: `index.html?palette=plum&theme=light`.
- `sections.html` is the cockpit regime; `run.html` is the moment, and its Start button drives the whole
  thing from simulated `##windowsweep` lines.
