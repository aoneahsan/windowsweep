# windowsweep desktop - the design argument

Last Updated: 2026-09-04 · Phase P6-A, gate 1 pending

This is the reasoning behind the click dummy in `click-dummy/`. It is written so the owner can disagree with
the *argument* rather than only with the pixels. Nothing here was put to him as a choice; the decisions are
made and defended.

---

## 1. What this product actually is, and what that costs the design

windowsweep deletes files. Every screen is therefore in service of one job: **the user must know what will go
before it goes, and must never be surprised afterwards.** That single sentence decides more than any
aesthetic preference.

It has three consequences the rest of this document follows from:

1. **Evidence before action.** No screen offers a destructive action without the measurement beside it. The
   Clean button never appears without the number it would remove and the list it would touch.
2. **Restraint reads as competence here.** The fleet's design bar is *unique, playful, creative, cheerful* -
   and the rule that sets it also says decoration is rich on marketing surfaces and **restrained in product
   ones** (`frontend-ui-standards.md` §1a). A cleanup tool that feels playful while asking to delete 40 GB
   feels *untrustworthy*. The personality goes into the copy, the information design and the motion
   discipline, not into ornament.
3. **The CLI's safety model must be visible, not re-explained.** Tier and batch policy are the whole safety
   argument, and in the terminal they are a table nobody reads twice. In the GUI they are a badge on every
   section, always on screen. That is the single most important information-design decision in this app.

**The desktop app never reimplements cleanup logic.** It runs the bundled script with `--json`, reads
`candidates[]`, `targets[]` and the `##windowsweep` progress lines, and drives the interactive sections with
`--select-file`. Anything the GUI could get wrong is something the CLI already gets right.

## 2. Direction: an instrument, not an app store app

The chosen direction is **"instrument panel"** - the app reads like a well-made measuring device.

- One large primary readout dominates Home: **reclaimable space**, with its freshness stated ("measured 4
  minutes ago") because a stale measurement is worse than none.
- Everything measured is set in **tabular monospace numerals**, so two figures in a column can be compared by
  eye without reading them.
- Paths are monospace too. A path is an identifier read character by character, not prose.
- The accent colour is spent on exactly three things: the primary action, a measured value, and the selected
  navigation item. Spending it anywhere else would make the one number that matters stop standing out.

**What this rejects:** a dashboard of equal-weight cards (nothing dominates, so nothing is read); a wizard
(the user is not a beginner being led, they are an operator choosing); and a "storage doughnut" hero, which
looks like every cleaner on the Microsoft Store and says less than one honest number.

## 3. Colour

**Registered primary: hue 128, lime.** Claimed 2026-09-03 in `~/.claude/palettes/project-palettes.json`. The
registry had no free 25° arc left; 128 sits at the midpoint of the widest gap (104 taxease ↔ 152 wakalat), 24°
from each. That shortfall is recorded rather than hidden.

| Role | Light | Dark | Why |
|---|---|---|---|
| Accent (primary action, measured value, selected nav) | `lime-700` `#4d7c0f` (4.9:1 on white) | `lime-400` `#a3e635` with **dark on-accent text** | white on `#a3e635` is ~1.7:1 and must never be used |
| Success | hue **158** | hue 158 | 🔴 at 128 the default success green reads as the accent, so a "done" state would be indistinguishable from the brand |
| Warning | hue 75 amber | hue 75 amber | reserved for a gate the user must pass, never for a result |
| Danger | hue 25 red | hue 25 red | reserved for permanent, irreversible tiers. **Never the accent** |

**Three treatments, three genuinely different hues** (per the click-dummy rule; only the registered hue is
held apart from other projects, so the other two may overlap anything):

| Treatment | Hue | Mood | Why it earns a slot |
|---|---|---|---|
| **Lime** (default) | 128 | cool green, technical, calm | the registered identity |
| **Sky** | 231 | cold blue, systems-tool | matches the **shipped logo mark**, which is a sky-blue gradient `#38bdf8 → #1e3a8a`. An icon may legitimately differ from the UI accent, and repainting a shipped mark is the owner's call - so the app offers a treatment that agrees with it instead |
| **Plum** | 320 | warm magenta, low-glare | the only warm option far from both, and the most comfortable of the three in a dark room |

**The neutral hue moves with the accent.** Surfaces carry a trace of the treatment's hue at very low chroma
(0.004-0.010), so switching treatment changes the whole room rather than repainting one button. A grey that
stays grey while the accent moves is the tell of a recoloured, not re-themed, interface.

## 4. Surfaces, depth and density

Three depths, no more: **app** (window chrome and rail), **panel** (cards), **sunken** (the run log, tables
and any scrolling region). Depth is carried by value and a 1px border, not by shadow - shadows on a dense
tool read as clutter, and they disappear in dark mode anyway.

**Radius is small on purpose**: 6px on panels, 4px on controls. Large radii read as consumer-friendly; this
app wants to read as precise. `--radius` is a theme axis, so a user who disagrees can change it.

**Density is an axis** (`comfortable` / `compact`) implemented as a `calc()` multiplier on the spacing scale,
not as per-property overrides - the failure mode being that a hand-written override misses tokens and the
layout goes half-dense.

## 5. Typography

| Role | Stack | Why |
|---|---|---|
| UI and display | `Inter`, then `Segoe UI Variable Text`, `Segoe UI` | Inter's tall x-height survives the small sizes a dense tool needs; the Segoe fallbacks mean the app looks native before any font loads, which matters for a desktop binary |
| Numerals, paths, log | `JetBrains Mono`, then `Cascadia Code`, `Consolas` | tabular figures so a column of sizes aligns; a path is an identifier, not prose |

Text size is a theme axis and multiplies the type scale, so a user at 125% Windows scaling plus "large" here
still gets a layout that holds.

## 6. Motion

- State change ≤ **180ms**, entrance ≤ **500ms**, staggered only on first paint of a screen.
- 🔴 **The run log never animates.** Streaming text with motion on it is unreadable, and this is the one
  surface a user watches while something irreversible happens.
- Progress is a determinate bar per section driven by the `##windowsweep` lines - never an indeterminate
  spinner, because "how far along" is exactly the question being asked.
- `prefers-reduced-motion` removes all of it, and there is a **motion axis** in the theme panel as well, so
  the preference is reachable without changing an OS setting.

## 7. Decoration - where the life goes

Restrained, and only in three places:

1. A **sweep arc** SVG behind the primary readout at 10% opacity - the product's one visual metaphor.
2. **Empty states** get the same arc plus a sentence with personality ("Nothing to sweep. Your disk is
   cleaner than most.").
3. **Tier badges** are the ornament that earns its place: they are colour, shape and information at once.

No decorative SVG on cards, no animated background, no magnetic hover, no custom cursor. Those belong on
marketing surfaces, and this product has none.

## 8. Consent and privacy - a design surface, not a legal one

The CLI makes **zero network calls** and that is advertised. The desktop app can send analytics and errors
**only after the user accepts**, and the first-run dialog says so in those words. All four providers (GA4,
Amplitude, Clarity, Sentry) are **off until accepted**, individually listed, and individually revocable in
Settings.

Sign-in is **optional and for sync only** - it stores the email, settings and run history, and restores
settings on a new machine. 🔴 **Runs are never gated. There is no paid tier and no plan set** (an explicit
owner exemption from the fleet plan-set rule). The Account screen states that in one line, because a sign-in
button in a free tool invites exactly the opposite assumption.

Synced run history carries **no file paths, no host name and no user name** - only section ids, statuses and
byte counts. That is a design decision with a UI consequence: the History screen labels cloud rows
"summary only" so nobody expects to find a path there.

## 9. The elevated run

Admin sections need a UAC prompt, which the app cannot answer. The design is honest about it: an
**Elevation** card explains that a second, elevated window opens with its own log, and the main window then
follows that run's report file rather than pretending to own it. The SmartScreen note lives here too, because
an unsigned binary's first launch is a real user experience and hiding it costs more trust than admitting it.

## 10. Screens

| Screen | Job |
|---|---|
| Splash / update gate | version check, `notifyAppReady`, nothing else |
| **Home** | the primary readout, the safe run, last run, drives, developer mode |
| Sections | the catalogue with tier and gate badges; select, preview, run |
| Picker | candidates for 17 / 18 / 19 / 23, with size and idle days |
| Run | per-section progress and the streaming log |
| History | local runs, and cloud runs when signed in |
| Account | optional Google sign-in, exactly what is stored |
| Settings | developer mode, idle windows, scan roots, notifications, consent, the theme panel |
| Consent | first-run dialog, all providers off until accepted |
| Elevation | what an elevated run does, and the SmartScreen note |

## 11. What the dummy does not decide

Per the click-dummy contract: the **DOM of interactive widgets** belongs to React Aria Components - the dummy
gives the visual specification only. It also does not decide routes, the data model, or which features exist.

## 12. Deviations from the standard dummy process, and why

- **No 12-15 section marketing home page.** That floor is written for a web product's landing page. This is a
  desktop application window; its "home" is the app's primary screen. Building a 15-section marketing page
  here would specify a surface the product does not have.
- **State persists through plain `localStorage` behind a `wsStore` wrapper**, not `strata-storage`. The dummy
  is static HTML with no bundler, and no dependency may be downloaded on this network until the owner's
  go-ahead (`PENDING-TASKS.md` TASK-001). The wrapper has the same shape, so the real app swaps the
  implementation and nothing else.
- **Tailwind arrives from the play CDN** for the same reason. The `@theme` token block is authored exactly as
  the real app's `tokens.css` will be, and is promoted into the app in one direction at implementation time.

## 13. Gates

| Gate | State |
|---|---|
| **1 - direction** (home page + three treatments) | 🟡 **awaiting the owner** - `docs/MANUAL-TASKS.md` row 17 |
| 2 - vocabulary (component library) | not started |
| 3 - the phase (every page, wired, persisting) | not started |
| 4 - parity (the built app matching, page by page) | not started - closes after the app exists |

🔴 **Nothing is created under `desktop/` beyond this design folder until gate 3 is recorded.** No app
scaffold, no `package.json`, no `src-tauri/`.
