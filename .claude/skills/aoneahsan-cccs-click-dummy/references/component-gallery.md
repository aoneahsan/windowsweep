# The component library — deliverable A3, and GATE 2

**Every UI element the app is made of**, in every state, in the approved direction and all three colour
treatments. Built **after** the home page and its variants, **before** the remaining pages.

It is its own approval gate: **GATE 2 closes when the owner approves the library in writing.** Until then A4
does not start, because every page from A4 on is composed from this vocabulary.

## Why this order

The home page proves the direction is *lovable* — nobody falls in love with a wall of buttons, so judging a
direction from swatches alone is a worse decision made earlier.

The library then does the job the home page can't: it **locks the vocabulary before forty pages are built on
it**. Without it, page 9 invents a fourth button size, page 22 invents a second table style, and the
"consistent design system" has to be retrofitted across everything.

So: **A1 home page → A2 colour treatments → A3 library → A4+ every remaining page.**

Every page after A3 is **composed from library components**. A page needing something the library lacks is a
signal the library is incomplete — add it there deliberately, never inline as a one-off.

## 🔴 Eight files, all flat at the dummy root

~90 components each carrying a state row in two appearances is not one reviewable document. Split it, and keep
every file at the root so each is one double-click away — never `gallery/forms.html`.

| File | Holds |
|---|---|
| `gallery.html` | the index, plus **Actions** and **Feedback and system** |
| `gallery-typography.html` | the type scale, headings, prose, lists, quotes, code, measure |
| `gallery-forms.html` | field structure, inputs, choice, specialised, multi-step |
| `gallery-tables.html` | the data table in every state — its own file because it is the largest single component |
| `gallery-display.html` | layout primitives, cards, stats, lists, badges, avatars, progress, accordion |
| `gallery-navigation.html` | the app shell, tabs, breadcrumbs, pagination, stepper |
| `gallery-overlays.html` | modal, alert dialog, drawer, popover, menu placement, tooltip, toast |
| `gallery-charts.html` | every chart type the product uses, in every state |

Each file names **its first real consumer** ("used by `dashboard.html`"), so a component nobody consumes is
visible as either dead work or a missing page.

## 🔴 Every gallery file carries a PLAYGROUND — a required slot

Each of the eight files opens with a knob panel driving **one live instance** of that file's most important
component, before the specimen rows begin:

```
┌ PLAYGROUND ─────────────────────────────────────────────┐
│ data: empty · one · typical · dense · extreme · long · rtl │
│ state: default · loading · error · disabled · selected     │
│ size: sm · md · lg          [Reset]  [Copy link]           │
├─────────────────────────────────────────────────────────┤
│              ← ONE live component, driven →              │
└─────────────────────────────────────────────────────────┘
```

**Both surfaces, not one instead of the other.** The specimen rows answer *"are these consistent?"* and need
simultaneity; the playground answers *"what happens when…?"* and needs a live target. A file with rows and no
playground is under-specified; a file with a playground and no rows loses the only view that catches an
inconsistent hover across five components.

🔴 **Knobs that swap between pre-rendered specimens are not a playground** — they can only show what the
author already thought of, and that is exactly what the reviewer is trying to get past. It also renders
identically to a working one, so nothing catches it.

Deep-linkable via the query string, **never persisted** (`state-layer.md` — preferences persist, demo axes do
not). One owner builds the panel and creates its own markup, behind an idempotent guard; hand-copying it into
eight files is pitfall 4.

Full dial catalogue per component family, the chart dials, and the harness in vanilla and React:
**`aoneahsan-cccs-component-playground`**.

---

## The inventory

Trim what the product genuinely does not use; **say what you trimmed**. Silently skipping a control means
discovering at page 30 that nothing specifies it.

### Typography

The full scale rendered at its real sizes — `display` through `caption` · every heading level in place, with the
vertical rhythm between them · **prose** (the rich-text editor's own output: paragraphs, bold, links, ordered
and unordered lists, nested lists, blockquote, inline and block code, a table inside prose) · a **measure**
specimen proving line length stays readable at 1920 · numerals in a data context (tabular alignment) · the
weight and tracking pairs the display font is actually set with.

🔴 **Verify the display font is reaching the page.** A `--font-display` token that is defined and never
referenced leaves every heading silently set in the body font — found exactly that way on one project, after
four directions had been reviewed.

### Actions

`button` — primary · secondary · tertiary/ghost · destructive · link-style, each in sm/md/lg, plus icon-only,
with-leading-icon, with-trailing-icon, full-width · `toggle button` · `button group` / `split button` ·
`menu` (the dropdown: sections, dividers, icons, destructive item, submenu, checkable items) · `link` (inline
in prose, standalone, external-with-affordance)

### Forms

**Inputs:** `text` · `email` · `password` (with reveal) · `number` (with stepper) · `search` (with clear) ·
`tel` · `url` · **`rich text`** (toolbar, placeholder, character count — 🔴 **there is no `textarea`**; every
multi-line input is an editor, per `aoneahsan-cccs-tiptap-rich-text`)

**Choice:** `select` · `combobox` / autocomplete (with async-loading state) · `multi-select` / tag input ·
`checkbox` · `checkbox group` · `radio group` · `switch` · `segmented control` · `slider` (single + range) ·
`rating`

**Specialised:** `date picker` · `date range` · `time picker` · `colour picker` (if used) · `file upload`
(idle · dragging · uploading with progress · success · rejected-file), which **carries an info affordance
explaining accepted types, size limit and dimensions before the user picks**

**Structure:** `field wrapper` (label · required marker · description · error · character count) · `fieldset`
/ section · `form layout` (single-column, two-column, responsive collapse) · **`multi-step form`** (stepper
header, per-step validation, back/next/skip, a review step, and the progress indicator in all its states)

### Navigation

`sidebar` — expanded · collapsed-to-icons · mobile drawer · with nested groups · with an active item ·
scrolled · `top bar` (with search, notifications, avatar menu) · `bottom nav` (mobile/native) · `tabs`
(horizontal, scrollable-overflow, vertical) · `breadcrumbs` (with truncation) · `pagination` (numbered and
load-more) · `stepper` / progress indicator · `command palette` (if used)

### Overlays

`modal` / dialog — sm/md/lg, scrolling body, sticky footer · `alert dialog` (destructive confirmation) ·
`drawer` / sheet — right, bottom, mobile full-height · `popover` · `tooltip` · `toast` — success · error ·
info · with-action · stacked · `dropdown positioning` near a viewport edge

### Display

`card` — plain, interactive, with media, with footer actions, in a grid · `stat` / metric card (value, delta,
trend, unit) · `list` — simple, with avatars, with actions, selectable · `table` — sortable, selectable,
sticky header, row actions, horizontal scroll, dense mode, and its **empty and loading** states · `badge` /
tag / pill / status dot · `avatar` (image, initials, fallback) + `avatar group` · `progress` (bar and ring) ·
`skeleton` (matching each real layout, not a generic block) · `empty state` · `banner` / inline alert
(info · success · warning · error, dismissible) · `accordion` (single and multi-open) · `timeline` /
activity feed · `divider` · `tooltip-less icon label`

### Charts

The set the product actually uses — commonly `line` · `bar` · `stacked bar` · `area` · `donut` · `sparkline`
· `progress ring` · `calendar heatmap`.

Each chart ships with: **loading** (a skeleton shaped like the chart) · **empty** ("no data yet" with the
action that creates some) · **single data point** (the case that breaks most chart layouts) · **dense** (a
year of daily values) · **legend and axis labels** · **a tooltip/readout** · and **mobile**, where most chart
designs fail first.

🔴 **Never colour alone.** A series must be distinguishable by shape, pattern, direct label or marker —
otherwise the chart is unreadable to colour-blind users and in monochrome.

### Feedback and system

`loading` (inline spinner, button loading, page skeleton) · `error boundary` fallback · `offline banner` ·
`confirmation` patterns · `undo` affordance

---

## Every component ships its full state set

| State | Must be shown |
|---|---|
| `default` | at rest |
| `hover` | guarded with `@media (hover: hover)` so a tap leaves no stuck hover |
| `focus-visible` | **not `focus`** — a mouse click must not leave a ring behind |
| `active` | pressed |
| `disabled` | 🔴 and **still explaining itself** — `disabled` removes an element from the tab order *and* from screen readers, so a bare greyed-out control is invisible to some users and inexplicable to the rest |
| `loading` | with the layout held, not collapsed |
| `error` | the message beside the control, never only a red border |
| `read-only` | visibly different from disabled |
| `selected` / `checked` / `expanded` | where applicable |
| dark mode | every one of the above, again |

Show the states **side by side in a row**, labelled. A gallery that shows one specimen per component has
documented a third of the work.

🔴 **And each state must be *reachable by acting*, not only by looking.** Press the button and it enters its
own pending state; submit the form and the error lands at the field with focus moved there; delete the row and
an undo appears. A specimen row proves the states were **designed**; only acting on the component proves the
sequence between them was. What is owed on each action, and how fast:
**`aoneahsan-cccs-interaction-feedback`**.

🔴 **Then switch colour treatment and look again.** Six combinations exist (three treatments × light and dark),
and a component that hardcodes a colour instead of consuming a token only reveals itself in one of them —
finding it here is the whole reason the treatments were built before the library (`colour-variants.md`).

---

## 🔴 What the gallery must not do

**Do not invent the internal DOM of an interactive widget.** In the real app, dialogs, selects, comboboxes,
menus, tabs, date pickers and sliders are built on a behaviour library that owns their markup, ARIA wiring
and keyboard handling.

The gallery specifies the **visual contract** — size, spacing, colour, elevation, motion, and every state
above. It does not specify the element tree. A hand-built select with its own listbox markup is discarded in
translation, and the effort with it.

Keep wrapper markup simple and semantic: a real `<button>`, a real `<label>`, a real `<dialog>` or a plain
container. Style by state class or `data-` attribute so the same CSS reattaches to the real component.

### …while still being operable — the two rules do not conflict

**The gallery's controls must WORK** (owner, 2026-07-29): a static specimen of an open listbox cannot be
judged, and judging is what the gallery is for. What the rule above protects is narrower than it first reads —
a hand-rolled accessibility implementation is *worse than the library's* **and** gets thrown away. So:

- Write the markup in **the behaviour library's real anatomy** — React Aria Components' own class names,
  roles and `data-selected` / `data-focused` / `data-pressed` attributes. Then the CSS reattaches unchanged.
- Add just enough behaviour to open, select, dismiss and traverse — driven from the shared script, one mount
  point, never hand-copied per page.
- **Say so on the page:** a line stating that the framework build deletes this behaviour and keeps the CSS.
  Otherwise the next reader takes the demo for the specification.
- The rich-text editor ships **tiptap-*shaped*** over `contenteditable` — the real toolbar, the real states,
  never tiptap loaded from a CDN.

---

## Definition of done for A3 — what GATE 2 is judged against

- [ ] All eight files exist, flat at the root, cross-linked from `gallery.html`
- [ ] Every component in the inventory present, or explicitly listed as not-used-by-this-product
- [ ] Every component shows its full state row, labelled
- [ ] 🔴 **Every one of the eight files opens with a playground** driving ONE live instance — and a knob
      disconnected on purpose makes the check fail, or the check is decorative
- [ ] 🔴 **Acting on a component produces its acknowledgement** — press → pending, submit-invalid → inline
      error with focus moved, delete → undo. Not just the states rendered side by side
- [ ] Charts expose their data dials — series, points, zero/negative/null, single point, spike, all-equal
- [ ] Light **and** dark, both designed
- [ ] 🔴 Spot-checked in **all three colour treatments** — nothing breaks in one of the six combinations
- [ ] 320 / 768 / 1920 with no horizontal scroll, and no stranded column at 2560
- [ ] Keyboard-operable throughout with a visible focus ring
- [ ] AA contrast verified in both appearances, including disabled and placeholder text
- [ ] Charts include loading, empty, single-point, dense and mobile — and are readable without colour
- [ ] 🔴 **No bare `<textarea>` anywhere** — `grep -c '<textarea' *.html` returns 0
- [ ] Only semantic tokens — a grep for `-\[` returns nothing
- [ ] No interactive widget's internal DOM invented
- [ ] Every token the library needed and lacked is reported, so it is added deliberately

**Last updated:** 2026-08-01 (every gallery file carries a **playground** driving one live instance, states
must be reachable by *acting* and not only by looking, and chart data dials joined the A3 checklist — owner
directive, after the dummies came out correct and inert. Earlier, 2026-07-30: A2 → A3; the eight-file split,
typography and tables as their own files, GATE 2, the three-treatment sweep, and the no-`textarea` grep gate)
