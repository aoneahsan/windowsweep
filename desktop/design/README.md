# windowsweep desktop - the design argument

Last Updated: 2026-09-05 · Direction **02, "Reclaim"** · Phase P6-A, gates 1-3 recorded 2026-09-05; gate 4 (parity) closes after the app exists

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


## 2b. Round 4 - legibility and progressive disclosure

> *"too dense … text too small and hard to read, and i think too much we are trying to explain to end user,
> make it easy for end user, with option to see details if he wants"*

Measured before changing anything, because "too dense" has causes and they are countable:

| | |
|---|---|
| Sized elements set at 11-13px | **37 of 39.** `.caps` resolved to 11px and was used 21 times; `t-2xs` 16 more |
| The floor that was violated | `home-page.md`: *body text >= 16px*. The base was 15px and almost nothing used it |
| Visible copy on Home | **444 words** |
| Where it actually was | **263 words - 59% - in exactly the two blocks he quoted** |

**The type scale went up and, more importantly, elements stopped reaching for the bottom of it.** Retuning
tokens is half the job; a scale nobody uses the top of is not a scale. Base is now 16px, supporting prose
15px, and 12px is reserved for badges and chips. `.caps` moved up two steps - uppercase needs *more* size to
stay legible, not less.

**Progressive disclosure, built on native `<details>`** so keyboard operation, state and the screen-reader
announcement are correct for free. Each collapsed block keeps one plain sentence visible: *"Your documents,
photos, keys and saved passwords are never touched"* in place of a 106-word essay on the deletion chokepoint;
*"Six sections need Windows to ask your permission first"*; *"Nothing leaves this machine unless you turn it
on."* **Nothing was deleted - the page stopped leading with it.** Home's default view went from 444 words to
**208**, and the safe-run ladder now shows four rungs with the rest one click away, which also closed the
dead space beside it.

**Our vocabulary left the default view.** `Remove-PathSafe`, `-Within <root>`, `--yes` and the batch-policy
taxonomy are inside the disclosures. The run history reads `Yesterday · 5 sections · packages and editors`
rather than `yesterday – only 1,2,6 – 5 sections`. What stays is the *user's* domain - `npm cache`,
`Gradle caches` are real things on their disk, and this is a developer-aware tool.

**A new gate, and it caught two regressions immediately.** A rendered-DOM type audit: nothing below 12px,
no paragraph below 15px - measured from the page, not from `tokens.css`, because the tokens were never the
problem. Proven by planting an 11px paragraph and a 10px label and watching each fail. It then caught the
hidden expandable rows in `sections.html` that it could *not* see (they start hidden - the blind spot is
recorded), and the new `.disclose` component shipped at **1.09:1** in light mode.

🔴 That last one was **the same defect class as round 3's badge**: a component painting its own background
inside the inverted bleed band inherits the band's ink. Fixing it per component does not scale, so the base
inks are now never-rebound tokens and any surface inside a bleed band restores them. The next component
inherits the correct behaviour instead of the bug.

### Deviation recorded

`home-page.md`'s 12-15 section floor exists so a page does not read as templated. The owner has said the page
shows too much. **His instruction outranks a skill default.** The 14 zones remain and remain distinct - they
are progressively disclosed, not removed.

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
| **1 - direction** (home + three treatments) | ✅ **APPROVED 2026-09-05** - *"approved, looks great, get all remaining work fully done now"* |
| **2 - vocabulary** (component library) | ✅ **approved in advance, 2026-09-05** - see below |
| **3 - the phase** (every page, wired, persisting) | ✅ **approved in advance, 2026-09-05** - see below |
| 4 - parity (the built app matching, page by page) | not started - closes only after the app exists |

### How gates 2 and 3 were closed, so nobody has to infer it

Asked in the same message where to stop - at the gallery for GATE 2, at the finished dummy for GATE 3, or
straight through - the owner chose **"Straight through to the app"**. That sentence is the whole authority for
creating anything under `desktop/` beyond this folder; **nothing else authorises it, and the agent did not
approve its own work.** The trade he accepted, stated to him before he chose: he sees the design once,
already translated, so a screen he dislikes later costs a fix in two places instead of one.

🔴 **GATE 4 is untouched by that.** Parity between the built app and this dummy is checked page by page,
at 1440 and 390, as screenshot pairs - and the dummy owns the **words** as well as the layout.

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

---

## Amendment - 2026-09-07: the consent screen becomes a notice

🔴 **Recorded here because `frontend-ui-standards.md` §10a requires a divergence to be written into the dummy
first and the reason recorded beside it**, rather than left in a decisions log the reader of the dummy never
opens.

**Owner decision, verbatim:** *"do not give user option to turn off any of those analytics or anything, it's
a free production, just mention we use that to improve the product, with no option to opt out, they can just
not use the product if they so not like it"*, and then *"keep it simple 1 line we collect to improve the
product for everyone, sweet and simple"*.

That supersedes the 2026-09-03 decision this dummy was drawn against, which put four providers behind a
first-run dialog with every one off until accepted.

**Files amended, and what moved:**

| File | Change |
|---|---|
| `consent.html` | Four switches and two answers become one heading, a `Never sent` panel, a disclosure, and one `Continue`. Title now `What the window sends` |
| `page-consent.js` | Writes a *seen it* flag rather than a per-provider map. The comment at its head records what survived and why |
| `index.html` | Home's privacy ledger lists the four destinations as facts with an `on` badge, and gains the `Never sent` paragraph |
| `wire.js` | `renderConsent` paints stated facts, not switches |
| `elevation.html` | The runs folder is `%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\`. It said `windowsweep-desktop`, and so did the app - **parity was a match, so no parity check could find it** |
| `splash.html` | The update band no longer promises installation on close, which Tauri's updater does not do. Now *"Install it now, or carry on and install it later."* |

**Two things kept deliberately.** The engine's zero-network fact, because it is a published claim and still
true - the decision covers the desktop window, never the command-line tool. And the `Never sent` list,
because a notice with nothing checkable in it is an announcement: the Bible's band R delivers reassurance as
a **specific refusal**, and naming what never leaves is that refusal. Cutting it would have made the screen
shorter and worse.

**One thing removed on principle.** A switch a person can press that changes nothing is worse than no switch,
because it is a promise the product does not keep. So the ledger states rather than offers.

⚠️ **This re-opens `desktop-safety`**, a GATE-4-recorded storytelling surface covering Consent and Elevation.
The keeper owes it a pass.

## Amendment - 2026-09-07 (later): Home's twelve bands, and three states the dummy never specified

The GATE 4 round-3 pass was the first to judge these screens against a build that could reach the engine.
Rounds 1 and 2 had measured a Home that rendered one band, because three stacked defects refused every
engine call - so their numbers were right by accident. Judged properly, **Home implemented 4 of the 12
bands** and declared none of the eight gaps, Sections had lost its filter row and its tier vocabulary, and
Run had no per-section surface for progress events that were already arriving.

Eight bands were built and four gaps are now declared in the app's own UI, which is what §10a requires.
**Nothing was edited out of the dummy to match what is built** - the dummy keeps specifying the finished
product, and three of those declarations are `pending-wave` for exactly that reason:

| The dummy still specifies | Why the app declares instead |
|---|---|
| The drive rails and the capacity ring | The engine's `--json` summary carries **no drive or free-space field at all**, and the dummy's own figures here are seeded. A real one needs an engine field, which is frozen outside a version cascade |
| The weekly schedule switch | `--install-task` is not in the Rust argument allowlist, so this window cannot ask the engine to register the task. The engine does it itself from a command line |
| Idle shading and the `Idle (days)` column | `ScanTarget` is `{section, label, path, bytes}` - the scan reports a size and **no age**. The dummy's own `idleScale` degenerates to exactly the value the app uses when the idle range carries no information |
| Clicking a tile to keep it out of the next run | `ExcludePaths` is read by `modules/projects.ps1` and nowhere else, so `--exclude-path` cannot keep a browser or npm cache out of a safe run. A tile you had clicked would still be deleted - **which is why sentence two of `index.html:74` cannot ship as written, and this row is the amendment that says so** |

**Three states the dummy did not specify, added here rather than invented in the app.** This is the part
worth remembering: the app had already written words for two of them, which is the wrong way round. The
dummy owns the words.

| State | Where | Reachable as |
|---|---|---|
| Home before anything has been scanned | `index.html`, `[data-ws-map-empty]` | `index.html?empty=1` |
| The last-eight-runs band with no history | `index.html`, `[data-ws-spark-empty]` | `index.html?empty=1` |
| **A run the engine refused** | `run.html`, `[data-ws-run-fail]` | `run.html?failed=1` |

The failed-run state is the one that mattered. The page carried Ready, Running, Finished and Cancelled -
and `Cancelled` is a different thing, because a person chose it - so a run the engine refused fell through
to **"The run finished."** over a run that never started. A first draft of those words claimed nothing was
left half-deleted; that asserts per-step atomicity nobody can promise, since a folder delete can fail
partway on a locked file, so it was replaced before the app copied it.

**Six labels restored, not substituted.** An implementation pass had shown the engine's own section keys -
`wu`, `cleanmgr`, `dism`, `hiberfil`, `eventlogs`, `vhdx` - and declared the substitution, reasoning that a
second set of names would drift out of step with `--list --json`. The rule is the other way round: the dummy
owns the words, and **section numbers are frozen**, so a map keyed by section id cannot silently drift. The
catalogue's `title` was not an alternative either - those run to *"Windows Update + system temp
(SoftwareDistribution, Delivery Optimization, ...)"*, right for a table row and impossible in a chip. A
future admin section with no label falls back to its title, so it appears in plain sight rather than
vanishing.

⚠️ **Still owed against this amendment:** the `index.html:74` sentence *"Click one to keep it."* and the six
curated admin labels at `index.html:252-257` are now covered by the table above, but the dummy's own text
still reads as though both ship. Settling that wording is a dummy edit, not an app one.

## Amendment - 2026-09-07 (later still): D-18, and a sentence that was backwards

Closing D-18's five divergences turned up a copy defect that had nothing to do with them, and it is the one
worth reading first.

🔴 **The developer-mode state line was inverted, in the direction that understates destruction.** The app
said *"Off. Toolchain caches are left alone."* The engine says the opposite, in its own words at
`lib/actions.ps1:209-210`: with developer mode **off** these caches are *"cleared completely"*; with it
**on**, *"only files idle N+ days go"*. `lib/actions.ps1:130` is the mechanism - a dev target's `prune` or
`units` mode becomes `clear` when developer mode is off. So the window told a reader their toolchain caches
were safe at precisely the setting that empties them.

The dummy had it right all along (`wire.js:451-453`), and the app now carries the dummy's two lines verbatim:
*"On - keeping anything used in the last {N} days"* and *"Off - every cache is offered in full"*. The
supporting note also lost its hardcoded *"last hundred days"*, which had begun contradicting the adjustable
idle window directly beneath it; the dummy's own numberless sentence replaces it.

**Two amendments here, both because the dummy was describing the CLI where the window differs:**

| Where | Was | Now, and why |
|---|---|---|
| `index.html:307` | `%USERPROFILE%\.windowsweep\logs` | That is the CLI's default. The window passes `--logs-dir` on **every** run, so no log ever lands there. It now shows the engine's own answer - the directory of the `log_file` the run reported - and says so plainly before any run has written one |
| `run.html:129` | `windowsweep --all --yes --json` | Built from the same helpers that construct the real arguments, so it cannot drift from what the app runs. `--json` is prepended by the Rust side, hence its position, and `--days` is now a real flag the window passes |

**One capability declared rather than built, and the dummy keeps specifying it:** *"Held back right now"*. The
engine sizes each target with `Get-DirectoryBytes` - its size **on disk** - and prints that caveat itself at
`lib/scan.ps1:77`. Nothing in the `--json` summary reports how much the idle gate would keep, so a figure
there would be invented. The **Idle window** beside it is real and is now built: it drives `--days`, which the
engine documents and the Rust allowlist already permitted.

⚠️ **Still owed against this amendment:** six screens - history, report, picker, settings, account, elevation
- carry a status-bar middle text in the dummy that the app does not render. Not part of D-18; recorded so it
is not rediscovered.

## Amendment - 2026-09-13: the account can be deleted, and Elevation became a choice

Five dummy changes in one pass. Four close filed defects (`PENDING-TASKS.md` TASK-004, 007, 009, 010) and the
fifth builds a control the product had promised in writing and never shipped.

### 1. `account.html` + `page-account.js` - the deletion control (owner decision D14, 2026-09-12)

**Why the DUMMY changed:** the site's `/privacy` says the account can be deleted *"from there"* and names four
things that go. The desktop Account screen offered sign in and sign out, and the dummy's card offered a button
called **"Delete the cloud copy"** whose whole implementation was a toast describing itself. A promise with no
control behind it is the defect; a button that only describes what it would do is the same defect wearing a
control.

| Was | Now |
|---|---|
| `page-account.js`: a `btn btn-danger` beside Sign out, toasting *"This would delete your synced settings and run summaries"* | Gone. Deleting an account is not a second button of equal weight beside Sign out with nothing between the pointer and the deletion |
| nothing | `account.html` `[data-ws-delete]`: a band, shown only while signed in, with a heading, the sentence naming what goes, the sentence naming what stays, a typed `delete` confirmation and a destructive button disabled until it matches exactly |

🔴 **The sentence names what the DATABASE actually does, and no more.** Every user-owned table references
`auth.users` with `onDelete: 'cascade'`, so the account row takes the profile, the synced settings, the run
summaries and the contact requests with it. **`admin_audit` does not go** - it records what an administrator
did and is not the person's row. Nothing on the PC is touched: this deletes a cloud account, not files. The
second paragraph is the *limit* of the first, which is why both are there rather than one reassurance.

**No shame and no urgency language.** It sits one screen from a safety surface, and a product whose whole
argument is *"you see what goes before it goes"* cannot make leaving feel like a mistake. The typed word is
the friction; the copy is not.

⚠️ **Not exercised.** Google is the only provider and it is not enabled on the Supabase project yet, so nobody
can sign in in this build and therefore nobody can reach this control. The RPC, the words and the code path
are built; a live deletion is not.

### 2. `elevation.html` + `page-elevation.js` - the screen became the choice its own lede described

The lede has said *"When you ask for **one** of these"* since the dummy was drawn, and the screen ran all six
admin sections. The dummy decides, and it decides in favour of the copy.

| Change | Why |
|---|---|
| A `switch` on each admin card | The per-section choice the lede already promised |
| A three-option `seg` on section 15 instead of a switch | `--hiberfil off/reduced/keep` is the engine's own vocabulary and a switch cannot say which. With no value `modules/system_admin.ps1:171` prints *"pass --hiberfil off\|reduced\|keep to run this section unattended"* and returns - a **silent no-op behind a UAC prompt**. `keep` means "not chosen" |
| `[data-ws-deep-gate]`: a `note note-danger` naming what each CHOSEN deep section does, plus one confirming switch | `modules/runner.ps1:89-92` refuses every `Batch = 'deep'` section without `--i-understand-deep` - 15, 16 and 20 of the six offered - so the screen listed six and could run three. The flag authorises clearing every Windows Event Log permanently, removing `hiberfil.sys` with Hibernate and Fast Startup, and stopping Docker Desktop and every WSL distro. That is a decision, so it is asked, never defaulted |
| A `[data-ws-elevate-blocked]` line under the buttons | The reason a control is blocked belongs beside the control, never in a toast a person has to provoke |
| Section 20's card declares developer mode when it is off | `modules/runner.ps1:105` skips ids 4, 17 and 20 with developer mode off. Declared on the card rather than discovered in the log |
| The status bar's `six sections need an elevated window` became `[data-ws-text="elevateCmd"]` | That sentence stops being a fact once the screen is a choice. It now shows the invocation, built from the same choice the buttons run - `run.html:132`'s rule, so a sentence cannot drift from the flags |

**The dummy's "This window tails the log" wording was already correct and is unchanged.** What was wrong is
that it was not TRUE: the elevated child is a separate process in its own console (`lib/safety.ps1` ->
`Start-Process -Verb RunAs -Wait`), so nothing it prints reaches the parent's stdout, which is the only stream
this window receives. The app now reads the child's own log and report out of the shared run folder. No dummy
change was owed for that - a code change was.

### 3. `reclaim-map.js` + `index.html` - the map is one tab stop, the table carries the control

Decided 2026-09-08 under the agent's design authority; TASK-009.

`role="img"` on the `<svg>` makes its subtree **presentational**, so the 28 tiles' `aria-label`s were each
computed and then discarded while all 28 `tabindex="0"` stops remained - 28 of Home's 58 focusable stops,
**48% of the page**, announcing roughly nothing. The cost of both approaches with the benefit of neither.

| Was | Now |
|---|---|
| `<svg role="img">`, not focusable | `tabindex="0"` - one stop, carrying the summary label |
| each tile `tabindex="0" role="button" aria-label=...` | each tile `tabindex="-1"`, no role, no label. `-1` rather than omitted, so a tile can still be focused programmatically |
| a tile `keydown` handler for Enter and Space | removed - it went with `role="button"`, and a key handler on something no keyboard can focus is code that can never run |
| `buildTable(mount, data)` - five data columns | `buildTable(mount, data, onToggle)` - an **In the run** column of labelled switches first, `data-path` on the row and the switch, and the column omitted entirely when no handler is passed (the Run screen's map is a drain, not a control) |
| `index.html` `The same data as a table` | `The same data as a table, with a switch for each target` - otherwise the control is discoverable only by opening a disclosure labelled as though it held nothing but numbers |

`wire.js` writes the toggle once through `db.toggleExcluded` and paints both views in place. Rebuilding the
table would throw away the focus of the person using its switches, which is the group the column exists for.

### 4. `shared.css` - a 44px hit area on every switch, with no visual change (TASK-010)

`.switch` at `--sw-w: calc(1.9rem * var(--density))` measures **30.4 x 17**, and 19 of them sit on the
Sections table. That is a **pointer** problem, a different argument from the touch floor that lets `.btn-sm`
stand at 28px in a desktop-only window: a 17px target is hard to hit with a mouse whether or not a finger is
involved.

A `.switch::before` overlay, centred, `min-width`/`min-height: 44px`, painting nothing. The pill, the knob,
the row rhythm and every GATE 4 screenshot are untouched, because a transparent pseudo-element has no
appearance. Measured in the running app: the control box is **30.4 x 17 with the rule and 30.4 x 17 without
it**, while the hit area is **44px x 44px** with and **auto x auto** without. `min-*` rather than a fixed
size, so a switch already larger than 44px keeps its own box.

### 5. `picker.html` - a dead class a previous edit duplicated instead of removing (TASK-007)

`picker.html:120` read `class="t-sm ink-3 t-sm ink-3"`. Commit `6f4706f` removed the dead `selbar-note` -
which resolves to nothing in either stylesheet - and left the two remaining class names written twice. Now
`class="t-sm ink-3"`. The app had already dropped `selbar-note` and records why in `Picker.tsx`.

**Sweep result, on the record:** every `className` string in `desktop/src` was extracted and compared against
the 333 selectors in the app's own CSS. **Zero orphans.** Three apparent hits were checked and are not
classes: `className` (a variable in `PrimaryButton.tsx`), `done` (a comparison value in `RunPerSection.tsx`)
and the `tier-` template prefix, whose six real classes all exist.

### Owed, and deliberately not taken here

🔴 **"Measure without elevating" DID elevate - FIXED in the main session the same day, and the dummy needed
no change, because its words were always right and the app was wrong.** `elevateDry` passed `--dry-run`
alongside `--elevate`, and `windowsweep.ps1:294` relaunches on `--elevate` regardless of the mode - so the
button labelled *"Measure without elevating"*, and the note under it saying a scan can measure these sections
without administrator rights, both described something the invocation did not do.

The invocation that was "not obvious" is settled by the dummy's own sentence: **it is a scan**. `--scan` is
not scoped to six sections, and does not need to be - it sizes every target (`Show-ScanTable` never reaches
the runner's admin skip at `modules/runner.ps1:98`), and the screen sums only the targets whose section was
chosen. That is precisely what the toast's words already say: *"Measured 15.9 GB across the sections you
chose."* So the app now runs `scanArgs`, reports the chosen sections' total inline in that sentence (the
number is a live quantity, the carve-out §10 allows), and refreshes Home's map with the same measurement.
The unelevated `--dry-run --only` the old code would have fallen back to if the prompt were declined measured
nothing at all, because the runner skips every admin section before reading a byte.

🔴 **It cannot come back by accident.** `elevatedArgs` no longer accepts a `dryRun` option, so a rehearsal of an
elevated run - which would still pass `--elevate`, and so still prompt - is a compile error. Planted on
2026-09-13: `dryRun: true` in the screen's builder call -> `TS2353: Object literal may only specify known
properties, and 'dryRun' does not exist`; restored, typecheck green.

## Amendment - 2026-09-13 (later): GATE 4 round 7

Round 7 (`gate4/GATE4-REPORT.md`, R7.x) came back not clean. Six of its findings were the dummy's to change
first, and one decision gave a live number its quantity. Each change below is the dummy moving so the app can
carry its words verbatim; none edits the finished product down to what is built.

### 1. `index.html` + `wire.js` - the developer caption follows the switch (D-25), and two Home details (D-36)

| Was | Now, and why |
|---|---|
| `index.html:130` one fixed caption: *"Caches you have used recently are left alone, so your next build is not a cold one."* | `[data-ws-text="devNote"]`, set in `refresh()`. With developer mode OFF the page read *"Off - every cache is offered in full"* directly above that sentence - false at that setting, in the direction that understates deletion (the engine clears every dev cache completely, `lib/actions.ps1:130`). Off now carries this dummy's own words for it, from its Settings row: *"Nothing is being held back - every cache is offered in full."* The two lines overlap in the OFF state; the dummy's words were kept over new prose, and the keeper may tighten them |
| "Include everything" pressable with nothing excluded - a no-op | disabled while `excluded` is empty, as the app does |
| the idle window's value appeared only inside the count sentence | the label carries its reading, `[data-ws-text="idleReadout"]` ("100 days"), as the app does - the slider no longer moves in silence |

### 2. `page-settings.js` - the developer row's consequence (D-26)

It printed *"Right now that holds back -."*: `fmt.bytes` was handed the ARRAY `heldByDeveloperMode()` returns,
not its total. And the figure the app shows there needs a scan AND a dry-run, so every session starts with it
unmeasured - where *"Right now that holds back not measured."* is not a sentence. It is now label and value,
the Home well's own caption: *"Held back right now: 17.3 GB."* / *"Held back right now: not measured."*;
`settings.html?empty=1` renders the second, the way `index.html?empty=1` renders Home's empty states. Off is
unchanged: *"Nothing is being held back - every cache is offered in full."*

### 3. `page-elevation.js` + `elevation.html` - the command line (D-27) and the measured note (D-28)

- `commandLine()` gains `--days`, `--temp-days` and `--large-file-mb`: D-8 put them on every run and the Run
  screen's line was amended for them; this one was not. The status slot's static text now equals what renders
  by default, so it cannot be D-21 again.
- "Measure without elevating" answers in `[data-ws-measured]`, a `note note-info` with `role="status"` beside
  the control, instead of a toast. The house standard is that a result lands where the person is looking and a
  toast is the fallback; the app already did this.

### 4. `picker.html` + `page-picker.js` - sections 18 and 19 (D-37)

The chips and `META` described 18 and 19 the wrong way round against this dummy's own `seed.js` and the engine
catalogue (18 `partials`, 19 `large`). Both texts had in fact been written about section 19's two faces - its
size threshold, and the installers and archives it finds - and neither about 18. Section 19 keeps the one that
names its threshold (the setting Settings controls). Section 18 takes the engine's own description of it
(`modules/personal.ps1`, `Invoke-Section18`: *"Half-finished downloads left behind by browsers and download
managers"*) and keeps this dummy's Downloads-only sentence, which is true of both. Chip 18 reads
`18 · partial downloads`. The page also reads `?section=`, which Home's "Choose items" has always passed and
this page ignored, so every card opened section 17. ⚠️ This re-opens `desktop-cockpit` S-038 and S-039; the
keeper owes them a pass.

### 5. `page-account.js` - the sign-out sentence (D-38, signed-in state)

The app's signed-in card carries *"Signing out clears every local trace of the account, including the rows
cached from your other machines."* under Sign out, and the dummy owns the words, so it is written here. It is
exact since 2026-09-13: sign-out is scope `'local'`, which ends this machine's session and never the same
person's session on the website sharing the account.

### 6. Which quantity the Reclaim button's live number fills - no word changes

The button's sentence stays *"Reclaim {amount}"*. `{amount}` is **what the safe run frees** - the ladder's own
total, `safeRunBytes` - and the Run screen's idle hero carries the same figure; the Home hero keeps the total
reclaimable. The seed made the two equal (every seeded target sits in a safe-batch section), so this dummy
never decided; the button's own word, "Reclaim", does. The same decision puts only the listed sections' tiles
on the Run screen's "What is going" map. Decided by the main session on round 7.

### Not amended, and why

- **Settings' status note, *"settings sync when you are signed in"*, and Account's *"What happens when two
  machines disagree"*** stay in the dummy and are withheld from the app: nothing in the window syncs yet
  (`src/lib/sync.ts` has no caller), and both describe behaviour no code performs. They arrive with the sync
  wiring, or the dummy withdraws them - the main session's call.
- **The populated Picker's frame** - the section chips, the table, the note, the file disclosure and the
  selection bar - is not yet the app's; the app's Picker still carries words this dummy never had. It was
  unreachable until round 7's D-23 was fixed, so no round has judged it. Owed next, with one decision this
  dummy must make first: a section nothing has asked the engine about yet.

## Amendment - 2026-09-13 (later still): what round 8 would otherwise flag

Round 7's fixes were accepted; this pass closes what was left on its list, dummy first. Where the app had
written words before the dummy had them, the words move here now and the log says so - that order was the
wrong way round. Nothing below edits the finished product down to what is built.

### 1. `picker.html` + `page-picker.js` - the populated Picker, and the section nothing has asked yet

The frame round 7 could not judge (the app's Picker was unreachable until D-23) is now the app's too: the
section's own header, the chips and filter, the table, the note, the file disclosure and the selection bar.
Four changes to the dummy came first:

| Was | Now, and why |
|---|---|
| every section seeded, so the dummy never drew a section the engine had not been asked about | `picker.html?empty=1` draws it: *"Nothing has been offered yet."* over *"A dry-run costs nothing and deletes nothing."* and a **Dry-run** button. In the window the engine is the only source of these rows and offers a section's list only once a run has asked, so "never asked" and "asked, nothing here" are different facts with different words. The title line was the app's (it had carried it since the Picker was built - app first, the wrong way round); the body is this dummy's own History and gallery sentence, the button its Sections button |
| section 17 listed whatever the seed held with developer mode off | *"Nothing to choose here"* over *"Developer mode is off, so the engine skips this one. Turn it on in Settings first."* - Elevation's words for section 20. The engine skips 17 outright in that state (`modules/runner.ps1`, the 4/17/20 rule), so offering its rows would promise a deletion the run will not make |
| the header's count was every chosen row, divided by the rows of the section in view - two rows ticked in 17 read "2 of 2 chosen" over section 18 | the header speaks for the section in view (its chosen bytes, "N of M chosen" of its own rows); the selection bar keeps speaking for the whole selection ("across sections 17, 23") |
| *"Cleared."* toast with Undo | no toast: every switch goes off and the bar slides away, which is the answer where the person is looking (the D-28 rule below) |

The command line in the disclosure now follows the section in view (`--only 23` over section 23); its file path
stays an example (`demo-data`).

### 2. `picker.html` + `page-picker.js` - "Drive this from a file instead" is the gallery's upload field, working

The zone was a static stub whose button raised a toast of invented figures. It is now the gallery's whole
field (`g-forms.js`, "specialised"): the **Selection file** label, the **?** affordance stating *Purpose*,
*Types*, *Max size* and an *Example* before the pick, the zone, and its states. A dropped or chosen file is read
in the page and matched the way the engine reads a `--select-file` (`windowsweep.ps1`: each line trimmed, blank
lines and `#` comments skipped; `lib/ui.ps1` `Resolve-SelectedPaths`: case-insensitive against the candidates
this section offers). Matches are ticked and added to the selection; nothing is uploaded, and "Remove these"
still carries the selection.

| State | Words |
|---|---|
| idle | *"Drop a selection file here, or choose one"* (unchanged) |
| dragging | *"Release to read it"* (the gallery's) |
| done | *"4 paths, 2 matched"* - the gallery's *"402 paths, 397 matched"*, with the file's own numbers |
| rejected, size | *"That file is 300 KB - the limit is 256 KB"* - the gallery's sentence, with the file's own size |
| rejected, type | *"notes.csv is not a .txt or .list file"* - **new**, one plain functional line |
| rejected, unreadable | *"That file could not be read."* - **new**, one plain functional line |
| per unmatched line | *"No candidate here matches D:\work\nothing\here"* - **new** as copy, but it is the engine's own note (*"--select-file: no candidate here matches $want"*), shown before the run rather than after; past twenty lines the rest read *"and N more"*, the safe-run ladder's words |

The limits the affordance prints are the limits enforced (`.txt`/`.list`, 256 KB) - the gallery's own rule
under this field. The unmatched lines sit in a `note note-warn` under the zone.

### 3. Four acknowledgements move from a toast to the control (the D-28 class)

§12: a result lands where the person is looking, and a toast is the fallback. Round 7 filed the channel on one
control (D-28); these four were the same class.

| Where | Was | Now |
|---|---|---|
| `index.html` + `wire.js` - Include everything | *"Every target is back in the run."* toast | the button's own done state (700 ms); it is disabled again at once, since nothing is left to include |
| `index.html` + `wire.js` - the weekly schedule switch | *"Weekly task registered. It runs the safe batch only."* / *"Weekly task removed."* toasts | a `role="status"` line beside the switch, `[data-ws-text="scheduleAck"]`: *"Scheduled for Sundays at 03:00."* / *"The task was removed."* for 4 s. These were the app's words (`home.scheduleDone`, `home.scheduleRemoved`) - app first, now drawn here |
| `page-settings.js` - the developer switch | *"Developer mode on - recent caches are kept."* / *"... off - those caches will be cleared completely."* toasts | none: the consequence line under the title re-renders with the switch |
| `page-settings.js` - the schedule row | the switch alone | the same status line beside the switch, the same words as Home's |

### 4. `page-run.js` - the queue is the whole safe batch

The per-section list showed only the sections with seeded tiles, but the engine also runs the batch's
report-only sections (0 health, 21 disk usage) and reports progress for each, so the list disagreed with its
own "N of M". The measured sections come first, biggest first (the ladder's order - a rule, not `demo-data`,
so the app follows it); the rest follow in catalogue order with no figure, as the app draws them.

### 5. `app.js` - the Admin rail entry draws its own icon

`NAV` has always named the Admin entry's icon `backend`, and the icon map never defined it, so `svgIcon` fell
back to `doc` - the same mark as Reports and Components. The map now draws `backend`, the path the app draws.
The app did not change; the dummy now matches what its own `NAV` asked for.

### Declared rather than amended

`gate4/GATE4-REPORT.md` carries the list, appended the same day: the two sync sentences (`pending-wave`,
TASK-013), `app 0.1.0-design` (`prototype`), and every toast still in the dummy, each with its class. The
Remove-these, scan, dry-run and Reclaim toasts stay: each stands in for a run this dummy cannot perform.

## Amendment - 2026-09-13 (round 8): the removal path, and Home before a scan

Round 8 (`gate4/GATE4-REPORT.md`, R8.4 and R8.6) closed round 7 and found three blockers on the Picker's
removal path, which no round had reached before. All three were the dummy's to change first. Two of its gap
findings were the dummy's alone. The app followed each change; its own items are listed at the end.

### 1. `shared.css` - the selection bar's segment joins the ink reset (D-47)

`.selbar` swaps to the bleed inks, and the reset list that hands a segment back its base inks only named
`.band-bleed .seg`. In light theme the selected "Recycle Bin" read 1.09:1, and "Permanent" 2.24:1.
`.selbar .seg` is now in the list, with a comment naming it the fourth occurrence. Measured after, both
sides, a row chosen:

| theme | selected option | unselected option |
|---|---|---|
| light | 16.74 : 1 | 4.87 : 1 |
| dark | 15.52 : 1 | 6.67 : 1 |

### 2. `picker.html` + `page-picker.js` - a Permanent removal is confirmed first (D-48, decided)

Decided 2026-09-13 (`docs/story/decision-log.md`, "GATE 4 round 8's decision point D-48"). With the mode on
Permanent, "Remove these" opens the gallery's destructive alert dialog (`g-overlays.js`, "alert
(destructive)") as `#pick-confirm`. Cancel is focused first, Escape means Cancel, and only "Remove
permanently" goes on. Recycle Bin mode keeps its single press, because it is recoverable.

| part | words |
|---|---|
| title | *Remove {count} item permanently?* / *Remove {count} items permanently?* |
| body | *They do not go to the Recycle Bin. Permanent has no undo.* - the second sentence is the bar's own |
| buttons | *Cancel* · *Remove permanently* |

The stand-in toast for both modes is gone. It promised the confirmation ("This would ask you to confirm…")
without providing it, and told the Recycle Bin story ("Sent N items to the Recycle Bin") about rows of 17
that never reach it. A removal now goes to `run.html`, the way Sections' "Run selected" does. The window
opens its Run screen at the same point. So `A-2`'s entry for `page-picker.js:289` describes a toast that no
longer exists.

### 3. `picker.html` + `page-picker.js` - what the mode governs (D-49, decided with D-48)

Section 17's artefacts go through `Remove-PathSafe` whichever mode is set (`modules/projects.ps1:157`).
While one of its rows is chosen, the consequence line ends: *"Section 17's rows are deleted outright
whichever you choose; this choice covers 18, 19 and 23."* It is hidden otherwise.

**One layout change came with it.** On one row, the longer line squeezed the bar's own controls: "Remove
these" broke onto two lines, and so did the figure. So the bar wraps, and the consequence line takes a
full-width row of its own under the controls. The window draws the same.

### 4. `index.html` + `wire.js` - `?empty=1` is the whole of Home before a scan (D-53)

It emptied only the map and the last runs, while every other band stayed seeded. So the window's
before-a-scan words had no approved counterpart. They were app-first, the wrong way round. They are drawn
here now:

| band | before a scan |
|---|---|
| hero | *not measured* · *Nothing has been measured yet. A scan reads sizes and deletes nothing.* · **Scan** · **Scan first** (disabled) · the ring is not drawn |
| map | the existing panel; the table keeps its header and has no rows; the legend has no tier chips |
| drives | each rail's free space, and *not measured* for its reclaimable slice |
| developer mode | *not measured*, with no count line |
| ladder | every rung of the safe batch, in catalogue order, *not measured*; *and 7 more*; the total *not measured* |
| these need a person | *nothing offered yet* · *0 items waiting* |
| last runs | the band's own panel carries the two lines; the figure, the chart and "Open the report" step aside. It used to be a panel inside the panel, beside a seeded figure, and it now has the window's anatomy |
| rail foot | *-* · *across 0 sections* |

### 5. `index.html` + `seed.js` + `wire.js` - what is never touched, in the engine's words (D-52)

Under the chip field: the window's lead *"And these kinds of thing, wherever they are:"*, then the engine's
four category sentences, verbatim (`seed.js` `PROTECT_CATEGORIES`, copied from `WS_PROTECT_CATEGORIES`,
`lib/constants.ps1:33`). These are the engine's words, not seed text.

### 6. `app.js` - the drawer says what it opens (D-54)

The Menu button carries `aria-controls="ws-rail"` and an `aria-expanded` that follows the drawer. Escape
closes the drawer. This is what the window already did.

### The app's own round-8 items, no dummy change

- D-39: the map's before-a-scan note is the dummy's panel instead of a note clipped to 1 px.
- D-40: the bar slides again (Tailwind's layered `[hidden]` rule beat `.selbar[hidden]`).
- D-43: Consent's status note.
- D-44, the Home half: *safe batch* / *sections …* instead of the engine's mode, and a scan is no longer
  listed as a run.
- D-45: the drop zone's hidden button is named by the field's label.
- D-46: bytes print as `fmt.bytes` does (whole KB), and the two heroes as `bytesParts` does (two decimals).
- D-50: Run at rest shows the idle line.
- D-51: `--list --json` is set in code.
- The held-back well's two columns now match this dummy's.

## Amendment - 2026-09-13 (latest): History and Report with data (D-41, D-42, D-44's second half)

Rounds 1-2 closed both screens empty; round 8 judged them with data. Dummy first, then the app. Nothing
below edits the finished product down to what is built; what the window cannot do yet is declared.

### 1. `history.html` + `page-history.js` - History (D-41)

| Was | Now, and why |
|---|---|
| *"Every run this machine has made, and a summary ..."* | *"Every run made in this window, and a summary of runs from your other machines if you are signed in."* The window records the runs it starts; the weekly Scheduled Task it registers and any command-line run report to `%USERPROFILE%\.windowsweep\reports`, which the window does not list. Home already says "in this window" |
| empty row *"windowsweep has not run on this machine yet. ..."* | *"No run has finished in this window yet. A dry-run costs nothing and deletes nothing."* (Home's sentence). A `Dry-runs` filter with none reads *"No dry-runs yet"* / *"A dry-run costs nothing and deletes nothing."*; the heading is an h2 (the page has one h1) |
| *"freed in the last 1 runs"* | *"freed in the last run"* for one |
| Freed per run: a hand-built path normalised min..max | d3 from zero - Home's spark's scale for the same metric (min..max drew a 2.4 GB run as if it freed nothing); real runs only; none: *"No real run has finished in this window yet."* inside the unchanged 900 x 90 frame; one run sits mid-frame |
| relative day by rounded elapsed hours; exact stamp in UTC | local calendar days; the exact stamp in local time, as the report file's name is stamped |
| 6 rows; "Load 20 more" adds 20 and raises a toast | twenty a page; no toast (the rows and the count answer; the count is a polite live region); inert (`aria-disabled` + `data-disabled`) once all are drawn; a chip returns to page one |
| eight seeded runs | + seventeen older (demo-data), so the second page exists |
| - | the `Show` label names the chip group; each open link is described by its row's When; a dry-run row opens `report.html?dry=1`; `history.html?empty=1` draws the screen before any run |

Unchanged: a scan is never a row (it measures and deletes nothing; `lib/run-mode.ts` `isRunRecord`). `Other
machines` keeps its signed-in and signed-out words - the finished product's.

### 2. `report.html` + `page-report.js` - Report (D-42)

| Was | Now, and why |
|---|---|
| static *"Freed 3.31 GB"* over rows adding to 5.7 GB; *"Safe batch · ... 5 ran · 3 skipped"* over a table showing 6 and 2 | both read from the steps: *"Freed 5.7 GB"*, *"safe batch · 8 sections attempted · 6 ran · 2 skipped · nothing refused · 17 seconds"*; *"N refused"* / *"N failed"* when present. The opening words are History's (D-44): one run, one name |
| *Show the JSON* toast *"Opens ...run-<stamp>.json in your text editor."* | a read-only panel under the header with the file as written, named by its file; the window may not open a local path (the opener is granted `https:` and `mailto:` only) |
| an empty bar read `skipped` (21 diskusage beside "ran") | the step's status word, or `0 B` when it ran and freed nothing |
| every drive gained up to 3.31 GB, each ticked | the freed bytes land on C:; D: and E: unchanged, no tick - the tick means "this succeeded" |
| badges `ran` / neutral | + `dry-run` outline, `refused` warn, `failed` danger; the word stays the engine's |
| Section column automatic | `width: 11rem`: the engine leaves most notes empty and automatic layout gave Section the Note column's room |
| `%USERPROFILE%\.windowsweep\reports\run-<stamp>.json` | the run's own file in the window's layout (demo-data; the window prints the engine's path): the engine names it `report-<stamp>-<pid>.json`, and the window gives each run its own folder via `--reports-dir` |
| crumbs `ol` | inside `nav aria-label="Breadcrumb"` |
| - | `?dry=1`: *"A dry-run would reclaim 5.7 GB"*, *"What each section would free"*, *"Would free"*, `dry-run` badges, estimates in ink |
| - | `?empty=1`: *"No run to report yet."* + *"A report is written for every run, including a dry-run, and the file on disk says exactly what this screen says."* (the app's words, app-first, now drawn here) |
| - | `?gone=1`: the History crumb + *"That run is no longer in this window's history."* |
| - | `?unreadable=1` / `=missing`: the History record's figure, the meta line held empty, *Show the JSON* inert and described by *"This run's report file could not be read, so only its summary is shown."* (+ the Rust side's reason) / *"No report file was found for this run, so only its summary is shown."* |

Unchanged: *Export...* and its toast - the finished product.

### Declared rather than amended
- History `Other machines`: `pending-wave` (TASK-013) - the window shows *"No runs from other machines"* over
  *"Run summaries from your other machines are not synced in this build yet. The filter is named here rather
  than hidden, so what is missing is a stated gap rather than something you have to discover."*
- Report *Export...*: `pending-wave` - the button is drawn disabled with *Export is not built into this window yet...*; the build needs `--export` on the Rust allowlist and a reveal permission (product PENDING-TASKS TASK-015)

## Amendment - 2026-09-14: GATE 4 round 9

Round 9 (`gate4/GATE4-REPORT.md`, R9.6 and R9.7) closed round 8's blockers and found one more, D-55, with four
small items; the main session then decided D-60. Two of them were the dummy's to change first, and the app
followed each. The app's own items are listed at the end.

### 1. `reclaim-map.js` - a long path ellipsises, and Size stays in view (D-58)

The table's Path cell had no maximum, the same rule on both sides. One 128-character path on a real machine grew
the table until Size and Idle sat 307 px beyond the band's own scroller at 1440; this seed's short paths hid it.
The Path cell now takes the width that is left (`width: 100%; max-width: 0`) and ellipsises inside it. The whole
path stays in the cell's text, which is what a screen reader reads, and one hover away in `title`. The Target cell
keeps to one line, so the room the path gives up is not taken back by a wrapped label.

Measured with a 128-character path set into this page's seed (in the page only):

| width | before: table overflow, Size's right edge | after |
|---|---|---|
| 1440 | 443 px; 323 px beyond the scroller | 0 px; 119 px inside it |
| 760 | 891 px; 771 px beyond | 0 px; 119 px inside |

### 2. `db.js`, `index.html`, `wire.js`, `run.html`, `page-run.js` - the Reclaim button states a bound or the engine's own estimate (D-60, decided)

This replaces the quantity decision 6 gave `{amount}` (the 2026-09-13 round-7 amendment, section 6). Decision 6
stands in its own words - the button's number is what the safe run frees. What changes is how that number is
known.

Round 9 measured the window offering *"Reclaim 34.2 GB"* while the engine's own dry-run of the same arguments
estimated 2.0 GB. Of the gap, 22.0 GB was the held-back figure shown beside the button; browsers (8.1 GB to
245 MB) and temp (2.8 GB to 784 MB) took most of the rest - the engine's own gates, the temp window and files in
use, cutting the measured total down. The measured safe-batch total is what is on disk, not what a press frees,
and the Bible says never to state a gigabyte figure as a promise.

Decided by the main session on 2026-09-14 (`docs/story/decision-log.md`):

- **(a) After a rehearsal with the current arguments** - "Dry-run first", the safe batch dry, with the same
  sections, developer mode, `--days`, `--temp-days`, `--large-file-mb` and exclusions - the button and the Run
  screen's idle hero show that rehearsal's estimate: the engine's own figure.
- **(b) Before one, or once any of those has changed since,** they show an upper bound, worded as one: *"Reclaim
  up to {amount}"*. The amount is the measured safe-batch total less what is held back. It is a true bound,
  because the engine cannot free more than was measured and not held back.
- **The Home hero keeps the measured total.** It describes what is there, not what a press will do.

| where | before a rehearsal, or after an argument moved (b) | after a rehearsal with the current arguments (a) |
|---|---|---|
| Home's primary button | *Reclaim up to {amount}* | *Reclaim {amount}* (the existing sentence) |
| Run's idle hero | *up to*, in its own `.unit` span before the figure | the figure alone |
| either, before a scan | *Scan first*, disabled; *not measured* (unchanged) | |

How this dummy draws both: `db.facts.rehearsal` records the arguments "Dry-run first" ran with, and its estimate -
this prototype's own dry-run figure, the one its toast reports. `db.derive.offer()` compares them with the current
arguments, the exclusions as a set. Press "Dry-run first" and the button drops *up to*; move the idle window, the
developer switch, an exclusion or a Settings threshold and it returns; move it back and the estimate returns.
Starting the safe run on `run.html`, or Home's Reclaim, spends the rehearsal. The seed has no gate but the idle
window, so here the estimate equals the bound and only the words change; on a real machine they differ, as above.

**What the window subtracts, and only while it holds.** Held back is each developer section's size on disk less
the rehearsal's estimate for it, so it measures developer mode, the idle window and the exclusions, and nothing
else. After any of those three moves it reads *not measured* until the next rehearsal, and nothing is subtracted:
a gap measured under `--days 100` would hold back more than a run at `--days 30` does, and the bound built from it
would stop being one. `--temp-days` and `--large-file-mb` govern sections 10 and 19, which are not developer
sections, so the figure survives them and is subtracted. With developer mode off it is 0 by definition. (This
dummy sets its held-back caches aside per target in `activeTargets()`, so its bound is `safeRunBytes()` itself -
the difference `lib/reclaim.ts` already records, unchanged here.)

Measured in the window on this machine: before a rehearsal *"Reclaim up to 34.2 GB"* (the ladder's 34.2 GB, held
back not measured), and the Run hero *up to 34.19 GB*; after "Dry-run first" *"Reclaim 1.9 GB"*, the Run screen
reading *"A dry-run would reclaim 1.9 GB."* and, at rest, *1.92 GB*; `--days 90` *"up to 34.2 GB"*, back to 100
*"1.9 GB"*; `--temp-days 4` *"up to 12.2 GB"* (34.2 less the 22.0 GB held back); developer mode off *"up to
34.2 GB"*; one target excluded *"up to 32.5 GB"*.

New strings in the window's catalogue: `home.reclaimUpTo` *"Reclaim up to {{amount}}"* and `run.heroUpTo`
*"<1>up to</1> <2>{{value}}</2><3>{{unit}}</3>"* - one key, so a language can put the qualifier after the number.
The keeper takes both into desktop-moment's record.

### The app's own round-9 items, no dummy change

- D-55: Home's hero, its sub-line, the scan button's word and the rail foot read the scan and nothing else. A
  Picker ask (`--only N --dry-run`) is a run, and it measures nothing the hero claims; before a scan, Home is
  `index.html?empty=1` whatever has run. The one sub-line state this dummy never drew - a span with no
  freshness, after a run's summary stood in for a scan - is gone with it.
- D-56: a dry-run's report ticks no drive (`page-report.js`: `gained = !DRY && …`).
- D-57: the last-runs line ages on its own half-minute clock, before a scan as after one.
- D-59: a refused `write_select_file` is shown at the control and records no run.
