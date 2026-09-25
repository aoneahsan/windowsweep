> Sections 8-9 of the click dummy inventory · part of [`CLICK-DUMMY-INVENTORY.md`](CLICK-DUMMY-INVENTORY.md), the index.

# Click dummy inventory - verification, 2026-09-05

Last Updated: 2026-09-25 · Moved here verbatim from the index under RW-132.

## 8. Verification, 2026-09-05 (RW-073, RW-074, RW-075)

Driven through the automation Chrome only - `$CHROME_WS_BROWSER` on its own profile directory and port,
headed because headless is broken on this machine, and the process killed afterwards. The owner's own Chrome
was running throughout and was never touched.

### Every page opened and looked at

All **20 pages** load with **zero console errors**, no unresolved mount points, and no `<textarea>`. This is
the step that matters most: four of the previous session's defects tripped no gate at all and were found only
by opening the page.

### The gates, and the plants that prove they can fail

| Gate | Product screens (the window minimum is 760px) | Proved red by |
|---|---|---|
| Unconstrained overflow | **clean at 760, 900, 1024, 1280, 1440 and 1920** | a 3,000px box with no scrolling ancestor: 0 -> 1 |
| Focusable-while-hidden | **0 at every width** | a `[hidden]` block forced to `display:flex !important`: 0 -> 2 |
| Type floor (HTML text) | **no HTML text below 12px on any screen** | a 10px paragraph: 45 -> 46 |

🔴 **The first attempt at the hidden-focus plant came back "blind", and the plant was wrong, not the gate.**
It set `display:flex` inline, which the global `[hidden] { display: none !important }` correctly overrides -
so the plant never created the condition. Re-planted with `!important` it goes red immediately. A plant that
cannot reproduce the defect proves nothing about the gate, and reads exactly like a gate that works.

### The six flows, and the links

| Check | Result |
|---|---|
| First run: no consent, no account | pass |
| Consent survives a navigation | pass |
| A settings change survives a round trip | pass (`idleDays` 42) |
| A run is recorded and survives a reload | pass (0 -> 1 run persisted; the rendering of that injected row was not separately confirmed) |
| Sign in, then sign out returns to first-run | pass |
| Demo axes apply from the URL | pass (`?palette=plum`) |
| Demo axes are **never** persisted | pass (localStorage empty after) |
| Every rail link reaches its page **when clicked** | pass, 11/11 - reading `href`s always passes, so they were clicked |
| Storage namespace read from a physical key | pass - the key is `windowsweep.dummy.v1` |

### Three defects found and fixed

1. **A hidden selection bar was fully keyboard-reachable.** `.selbar[hidden]` set `display: flex !important`
   so it could slide out, which left it `visibility: visible` with **all three of its buttons focusable**, no
   `aria-hidden`, no `inert`, and its top edge at 726px in a 749px viewport. A keyboard user tabbed into a bar
   they could not see. Now `visibility: hidden` with a delayed transition, so the slide still reads and the
   bar leaves both the tab order and the accessibility tree. Measured after: `actuallyFocusable=0`.
2. **The horizontal scroller was dead in five places.** `class="panel xscroll"` with an inline
   `style="overflow:visible"` - the inline declaration beats the class, so `overflow-x` computed to `visible`
   and a 1,125px table simply overflowed with no way to reach its right-hand columns. `overflow-x: auto` and
   `overflow-y: visible` cannot coexist on one box, which is what drove the inline override; the fix is two
   elements - the panel keeps `overflow: visible` for escaping menus, an inner `.xscroll` does the scrolling.
   Fixed in `sections.html`, `picker.html`, `history.html`, `report.html` and `g-tables.js`.
3. **A one-line explanation could not shrink.** An inline `flex:none` on a `.zone-label` child forced 549px of
   text through a 390px viewport. Removed, and `.zone-label > *` now carries `min-width: 0`.

🔴 **A note on how finding 2 was nearly missed.** The first attempt to identify the offending rule walked
`document.styleSheets` from inside the page and reported that no `.xscroll` rule existed anywhere. That was
vacuous: `cssRules` throws `SecurityError` for `file://` stylesheets, so the walk saw **zero rules in four
sheets** and reported an empty result that looked like an answer. The authoritative instrument was
`CSS.getMatchedStylesForNode` over the DevTools protocol, which showed `.xscroll` matching and applying - and
sent the search to the inline style instead. **Always print what the instrument could see.**

### Declared, not fixed

| Item | Measurement | Why it stands |
|---|---|---|
| SVG data labels below the 12px type floor | 45 elements: one at 9.5px in the capacity ring, and 10 / 10.5 / 11px on treemap tiles | They are drawn only when the tile is large enough (guards such as `w > 54 && h > 42`), and they sit inside the **owner-approved signature element**. Raising them changes the look of an approved design, which is his call, not a session's. 🔴 Note that the round-4 type audit reported the floor as met: it did not look at SVG text - the same blind spot the contrast sweep had for `fill` before round 3 closed it. **No HTML text is below 12px.** |
| `gallery-tables` and `gallery-charts` overflow at 760-1024 | up to +265px | Internal design documentation, not a product screen. Their specimens deliberately show a seven-column table at its natural width |
| `picker` selection bar at 390px | +111px | 390 is **below the 760px window minimum** the Tauri shell declares - a width no user can reach. Recorded rather than chased |

### The contrast sweep, and the fourth defect - the one that mattered most

| Treatment / appearance | Text nodes measured | of them SVG | Failures |
|---|---|---|---|
| lime / light · lime / dark | 1,339 each | 118 each | 0 |
| sky / light · sky / dark | 1,339 each | 118 each | 0 |
| plum / light · plum / dark | 1,339 each | 118 each | 0 |
| **total** | **8,034 across 6 combinations** | **708** | **0** |

Colours are normalised through a canvas and compared as **pixels, not strings** - Chrome returns `oklch()`
from `getComputedStyle`, and an `rgba()` regex matches none of it, counts zero elements and reports a
confident PASS. SVG text is read from `fill`, not `color`. Both halves are proved by a plant: a low-contrast
HTML paragraph takes the failure count 0 -> 1, and a low-contrast `<text>` appended to the treemap does the
same, which is what proves the gate can see the map at all.

🔴 **Defect 4: the entire bleed-band ink reset was dead, and the sweep found it.** In light appearance the
first run of this sweep reported **29 failures per treatment, 87 in total** - ratios of 1.09:1 and 1.58:1,
which is invisible text. Dark appearance passed cleanly, which is the exact signature of this defect class:
a band inverts its *surface*, a component inside it paints its own light surface, and it then takes the
band's light ink.

The cause was not the rule. The rule was correct and listed fifteen components. **Its comment had a
premature `*/`**, five lines before the intended close:

```css
   is general and every future surface inherits the correct behaviour. */   <- closed here
   THIRD occurrence: the segmented control in the picker's selection bar ...
   catches an omission - it has now found all three ... */                  <- and again here
.band-bleed .card,
```

Everything between the two closers became stray text, and the CSS parser discarded the rule that followed
while recovering. So the reset that the previous session added - to fix the *third* occurrence of exactly
this defect - silently disabled itself and all fourteen of its siblings. One character. Removing the early
`*/` took the sweep from 87 failures to **0**.

Two things are worth carrying forward. First, the comment in that block says *"the CONTRAST SWEEP is what
catches an omission - it has now found all three, each time before release"* - and it then caught the bug
that disabled the fix it was documenting. Second, **a CSS parse error is silent**: nothing logs, nothing
throws, the page renders, and only a measurement of the result tells you a rule is missing. A brace-balance
check passed on this file the whole time, because the braces *were* balanced.

🔴 **And three separate times in this session a PLANT was wrong rather than the gate**, each reported as
`*** GATE BLIND ***` until it was examined: the hidden-focus plant used an inline `display:flex` that the
global `[hidden]` reset correctly overrode; the first SVG plant was appended to a decorative icon with no
text box; the second used `#8a8a8a`, which is genuinely readable at 4.5:1 against the treemap's dark frame.
**A plant must reproduce the condition against the surface it actually lands on**, or it proves nothing -
and it fails in the direction that looks like a broken gate, which is the safer direction but still costs a
session real time.

---

## 9. The app-side pass — 2026-09-05, and what it found

GATE 4 compares the built app against this dummy page by page, so this ledger
records both halves. Section 8 recorded the dummy's own verification; this records
the first pass over the eleven **React** screens.

### How it was possible before the Rust half compiled

Visual Studio Build Tools is not installed on this machine (owner row 22), so
`tauri build` cannot run here — and outside a Tauri window there is no `invoke`,
so every screen showed its engine-error state and could not be compared with
anything. A design gate blocked on a 5 GB owner-only download is the wrong
dependency, so `desktop/src/lib/dev-engine.ts` answers the engine's contract in a
development build: the real captured catalogue, plausible sizes, always as a
dry-run, every log line saying it is not the real engine.

🔴 **Its gate took two attempts, and the second one is the lesson.** The first
version gated the call sites on `import.meta.env.DEV` and imported the module
statically. Measured against `dist/`: the identifiers were gone and two of the
module's string literals were still there — the branches were eliminated, the
module stayed in the graph. The import is now dynamic behind the same constant,
and re-measured with a control string that must be found. **Gating a body is not
gating a module.**

### What was measured

The automation Chrome (`$CHROME_WS_BROWSER`), headed, on its own profile
directory and its own debugging port. **11 screens × 4 widths × 3 treatments ×
light and dark = 264 combinations**, and **10,684 text nodes**.

Widths were **760, 1024, 1440 and 1920**. 🔴 **390 is not among them, deliberately**
— `tauri.conf.json` sets `minWidth: 760`, so the product cannot be narrower than
that and a failure at 390 is one nobody can act on.

| Check | Result |
|---|---|
| Routes that threw | 0 |
| Screens in the engine-error state | 0 — the stand-in answers |
| Horizontal overflow on the body | 0 |
| Text below 12px | 0 |
| Contrast failures (WCAG AA, size- and weight-aware) | **0 of 10,684** |
| Focusable controls inside a hidden container | 0 |

### The defect it found, which no static gate could

**`Shell.tsx` resolved `getCurrentWindow()` during render.** Outside a Tauri
window that reads `window.__TAURI_INTERNALS__`, which does not exist — so every
screen rendering the title bar threw, while Splash and Consent, which do not use
the shell, were fine. Typecheck, lint and build were all green: the call is
correctly typed and the module resolves. The window object is now resolved inside
the button handler, which is also the right shape in production — a title bar has
no reason to reach for the window before someone presses one of its buttons.

🔴 **And the audit nearly missed it.** Vite's error overlay is a custom element in
a shadow root, so the text walk never saw it; the first run reported eleven broken
screens as clean, and only the overlay's own 9.6px "Hide Error" leaking into the
tiny-text list gave it away. The audit now asks for `vite-error-overlay` directly,
and the earlier numbers were re-taken — 1,504 text nodes became 10,684 once the
pages actually rendered, which is how much of each screen the overlay was hiding.

### The gates were watched failing

Two different plants on the Sections screen: an inline `#3a3f36` on the lede, and
a 9px paragraph. Both were caught and located — `1.94:1 (needs 4.5) at 15px` and
`9px "The catalogue"`, each with its screen, mode, treatment and width. Restored,
and the pass came back clean.

### What this pass is NOT

It is **not** GATE 4. GATE 4 is screenshot pairs of the dummy page beside the app
page, judged by eye, in the app's own WebView2 — and that needs the Tauri build,
which needs owner row 22. This pass establishes that every screen renders, at
every width the product can be, in every treatment, with no contrast or type
defect and no runtime error. The visual comparison is still owed.

Reproduce: `yarn dev` in `desktop/`, then the CDP script recorded in that
session's work-history entry.
