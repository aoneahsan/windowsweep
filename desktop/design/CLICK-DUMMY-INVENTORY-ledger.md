> Sections 1-7 of the click dummy inventory · part of [`CLICK-DUMMY-INVENTORY.md`](CLICK-DUMMY-INVENTORY.md), the index.

# Click dummy inventory - the ledger

Last Updated: 2026-09-25 · Moved here verbatim from the index under RW-132, with the stamp these sections carried:
Last Updated: 2026-09-05 · Counted from the folder, not asserted. Every number below is reproducible with the
commands at the end.

## 1. Totals

| Kind | Count | Note |
|---|---|---|
| HTML pages | **20** | 11 product screens + the contents index + 8 component-library files |
| Product screens | **11** | the eleven archetypes below; every one opens by double-click |
| Component-library files | **8** | each carries exactly one live playground |
| `page-*.js` | 11 | one per screen that needs behaviour (Home is driven by `wire.js`; `page-contents.js` serves `pages.html`) |
| `g-*.js` | 8 | one per gallery file |
| Shared scripts | 9 | `app.js` `db.js` `demo.js` `gallery.js` `playground.js` `reclaim-map.js` `seed.js` `widgets.js` `wire.js` |
| CSS | 4 | `tokens.css` `shared.css` `components.css` `gallery.css` |
| Vendored | 10 d3 modules + 2 variable fonts | SHA-256 provenance in `vendor/README.md`; **zero network requests anywhere** |
| Live bytes | 767,438 | excluding the archive |
| Archived | 48,167 | `_rejected/01-instrument-panel-2026-09-04/`, kept byte-identical |

**Gallery contents, counted separately from files:** **49 specimen sections**, **28 comparison rows**,
**8 playgrounds** (one per file, each driving one live instance), **22 trims declared with a reason**.

## 2. The eleven product screens

Regime decides the dials: **moment** screens are airy (variance 7 / motion 6 / density 3), **cockpit** screens
are dense (5 / 4 / 7). Applying cockpit density to the screen a user sees first is what direction 01 got wrong.

| # | File | Archetype | Regime | Covers | HTML | JS |
|---|---|---|---|---|---|---|
| 1 | `index.html` | the home screen | moment | 14 named zones, listed in §3 | 15,495 | `wire.js` |
| 2 | `sections.html` | the catalogue | cockpit | all 26 sections, tier, batch policy, admin and developer gating | 6,034 | 10,228 |
| 3 | `run.html` | the moment | moment | a live run driven by simulated `##windowsweep` progress lines | 5,726 | 8,852 |
| 4 | `splash.html` | boot + update gate | moment | first paint, update check, downloading, restart-to-apply, offline | 4,882 | 3,236 |
| 5 | `consent.html` | first-run decision | moment | four providers, **all off until accepted**, each revocable | 4,623 | 3,362 |
| 6 | `picker.html` | candidate multi-select | cockpit | sections 17, 18, 19, 23 - the `--select` / `--select-file` surface | 6,856 | 6,101 |
| 7 | `history.html` | list + filter | cockpit | local runs and cloud rows, the latter labelled **summary only** | 4,875 | 6,496 |
| 8 | `report.html` | one run rendered | cockpit | the schema-1 JSON as a page, with Markdown and HTML export | 5,067 | 5,106 |
| 9 | `account.html` | identity + sync | moment | optional Google sign-in, exactly what is stored, sync state, sign out | 4,955 | 3,765 |
| 10 | `settings.html` | settings form | cockpit | five tabs, plus the house promotions in §5 | 3,707 | 13,778 |
| 11 | `elevation.html` | permission explainer | moment | what needs UAC, what the second window does, the SmartScreen note | 5,756 | 2,132 |
| - | `pages.html` | contents index | - | every page in the prototype, one click away | 2,358 | 3,715 |

## 3. Home's fourteen zones

The design argument claims fourteen; here is where each one lives, so the count is checkable. They sit inside
**7 content bands** plus the title bar and the status bar.

| Zone | Where | Marker |
|---|---|---|
| 1 window chrome (frameless - we draw it) | header | `.titlebar` |
| 2 the reclaim readout | band 1 | `data-ws-hero` |
| 3 **the Reclaim Map** (the signature element) | band 2, a `well` | `data-ws-map` |
| 4 drive capacity rails and the capacity ring | band 1 + band 3 | `data-ws-ring`, `data-ws-drives` |
| 5 the safe-run ladder | band 3 | `data-ws-ladder` |
| 6 developer mode with its live consequence | band 3 | inside the ladder band |
| 7 "these need a person" | band 4, a `well` | `data-ws-needs` |
| 8 the chokepoint, drawn | band 5, a `bleed` | prose + diagram |
| 9 the protected-path chip field | band 5 | `data-ws-protected` |
| 10 the last eight runs, with a sparkline | band 6 | `data-ws-spark` |
| 11 schedule | band 6 | beside the sparkline |
| 12 sections that need admin | band 7 | prose + link to `elevation.html` |
| 13 what leaves this machine | band 7 | `data-ws-consent` |
| 14 the status bar | footer | `.statusbar` |

No two adjacent zones share a shape, and consecutive zones differ in at least two of {band treatment, content
width, internal layout}. The three band treatments are `panel` (raised), `well` (sunken) and `bleed`
(edge-to-edge, inverted).

## 4. The component library

Eight files, each opening with a **playground that drives one live instance** - not a row of pre-rendered
specimens, which looks identical and proves nothing. The check is: disconnect a dial on purpose and confirm
the panel goes inert.

| File | Holds | Playground drives | Sections | Rows | Trims |
|---|---|---|---|---|---|
| `gallery.html` | index, actions, feedback and system primitives | `button`: variant x size x state x label x icon x width | 6 | 9 | 1 block |
| `gallery-typography.html` | the scale, headings, prose, code, measure, tabular numerals | the type scale at three `--type-scale` values | 6 | 0 | 2 |
| `gallery-forms.html` | field structure, inputs, choice, specialised, multi-step | the field wrapper: label, description, error, counter | 8 | 9 | 4 |
| `gallery-tables.html` | the section table in every state | the table: rows, density, sort, selection, empty, loading | 4 | 0 | 3 |
| `gallery-display.html` | cards, stats, lists, badges, tiers, progress, accordion, skeleton, empty | the stat card | 9 | 4 | 3 |
| `gallery-navigation.html` | app shell, rail, tabs, breadcrumbs, pagination, stepper, command palette | the rail: expanded / icons / drawer | 5 | 3 | 3 |
| `gallery-overlays.html` | modal, alert dialog, drawer, popover, menu, tooltip, toast | the toast: kind, action, undo, stacking | 6 | 2 | 3 |
| `gallery-charts.html` | treemap, capacity ring, sparkline, bar, line | the treemap's **data dials** | 5 | 1 | 3 |
| **Total** | | **8 playgrounds** | **49** | **28** | **22** |

**Trims are stated, never silent.** All 22 carry a reason on the page - for example a calendar heatmap is
trimmed because "run cadence is weekly at most; 365 mostly-empty cells would say less than the sparkline", and
inline cell editing because "the catalogue is frozen public contract". The command palette is **kept**: 26
sections earn a Ctrl+K.

Every file states in a line that the **DOM of interactive widgets belongs to React Aria Components** - these
are the visual specification and working behaviour, not the anatomy - so the CSS reattaches unchanged and the
framework build deletes only the hand-rolled behaviour.

## 5. House promotions, and the two layers that keep this app out of its own list

`settings.html` carries the ecosystem roster under **More from the same team** (until 2026-09-25 *More from the
same developer*; the team-voice run, owner decisions D44-D46, which also drop the personal-portfolio entry at the
vendoring layer - `OFF_ROSTER`). The fleet rule requires **two** independent layers, each proved by removing the
other.

| Layer | Where | What it does |
|---|---|---|
| 1 - the vendoring drop | `page-settings.js`, `ROSTER = ROSTER_SOURCE.filter(...)` | this project's id leaves the roster as it is taken in |
| 2 - the display resolver | the `about()` panel, `ROSTER.filter(...)` | drops the id again at render time |

🔴 **Both layers were no-ops until 2026-09-05.** The roster array simply never contained `windowsweep`, so
neither filter could match anything: removing either one changed the rendered list not at all, and the
"prove each with the other removed" check passed in both directions while proving nothing. **A filter that
cannot match is indistinguishable from a filter that works.** `ROSTER_SOURCE` now carries every product,
this one included, which is what the real ecosystem roster looks like - so both filters are load-bearing.

Proof harness: `window.wsPromoAudit()` in `page-settings.js`. It returns four cases, and the fourth is the
control that makes the other three mean something:

| Case | Self-promoted? | Expected | Shown |
|---|---|---|---|
| both layers | no | no | 4 |
| layer 1 only (display filter removed) | no | no | 4 |
| layer 2 only (vendoring drop removed) | no | no | 4 |
| **neither layer - the control** | **yes** | **yes** | 5 |

There is no advertising network and there never will be one here: the app's own privacy copy promises none,
and adding one would make it a lie. This is the only promotion surface.

## 6. What the dummy deliberately does not have

| Absent | Why, and on whose authority |
|---|---|
| A pricing page | Owner decision 2026-09-03: runs are always free, no paid tier, no plan set. An explicit exemption from the fleet plan-set rule, recorded rather than silently skipped |
| An admin batch or platform-admin surface | A local utility with optional sync has no platform surface. The admin surface for this phase is the Firebase console (recorded 2026-09-03) |
| A `<textarea>` anywhere | Fleet rule: every multi-line input is a rich text editor. The one multi-line field (the exclusion-list editor) is tiptap-shaped over `contenteditable`. Gate: `grep -c '<textarea' *.html` returns 0 for all 20 files |
| Any network request | The dummy is the specification and must render offline exactly as reviewed. d3 and both fonts are vendored with provenance; the CSS is plain, authored in the shape the app's `@theme inline` will wrap |
| A second colour treatment per screen | Three treatments (lime 128, sky 231, plum 320) are switched by the theme control, not duplicated per page |

## 7. Reproducing every number here

```bash
cd desktop/design/windowsweep-click-dummy
ls *.html | wc -l                                    # 20
ls page-*.js | wc -l ; ls g-*.js | wc -l             # 11 ; 8
grep -c 'G.section(' g-*.js | awk -F: '{s+=$2}END{print s}'   # 49
grep -c 'G.row('     g-*.js | awk -F: '{s+=$2}END{print s}'   # 28
grep -c 'wsPlayground.register' g-*.js | awk -F: '{s+=$2}END{print s}'  # 8
grep -c '<textarea' *.html | grep -v ':0' | wc -l    # 0
find . -type f -not -path './_rejected/*' -printf '%s\n' | awk '{s+=$1}END{print s}'   # 767438
```

The promotion audit runs in the page: open `settings.html`, go to About, and call `wsPromoAudit()` in the
console - or run the same four cases headlessly against `ROSTER_SOURCE`, which is what the session that wrote
this did.
