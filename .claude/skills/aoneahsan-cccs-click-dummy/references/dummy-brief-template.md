# The click-dummy brief — project template

Copy everything below the rule into `<project>-project-root/05-CLICK-DUMMY-BRIEF.md` and fill the
placeholders.

🔴 **This template must never reference an internal skill, tool or prior conversation.** It is handed to a
model that has none of them — often a different vendor's model entirely. Anything it needs must be *in the
file*. Verify before handing it over:

```bash
grep -c "aoneahsan-cccs" <project>-project-root/05-CLICK-DUMMY-BRIEF.md   # -> 0
```

| Placeholder | Becomes |
|---|---|
| `<PROJECT>` | Display name |
| `<what it is>` | Two or three honest sentences: what the product does, who uses it, which surfaces it ships on |
| `<why rebuilt>` | The owner's own framing of what is wrong today |
| `<goal quote>` | The owner's words for how it should feel — keep them verbatim |
| `<domain honesty>` | Any domain-specific copy constraint (health: tracks but does not diagnose; finance: not advice) |
| `<known defect>` | A real recorded defect not to reproduce — delete the bullet if there is none |
| `<emails>` | 🔴 The `emails.html` contract, pasted from `aoneahsan-cccs-email-campaigns/references/transactional-email-layout.md` §9, plus the product's email list — never deleted: every product sends email |

**Last updated:** 2026-09-11 (the `<emails>` placeholder and `emails.html` in the structure). Earlier: 2026-08-03 (§4 gained the admin-panel batch — written out in full, because the model reading
this brief has no skills loaded)

---

# <PROJECT> — Click-Dummy Brief

**Audience:** the model building the static HTML click dummy. **This brief is self-contained** — it assumes
no access to any internal tooling, skill or prior conversation.
**Companion:** `06-CLICK-DUMMY-INVENTORY.md` — the page checklist and what to build next.

---

## 1. What you are building, and why it matters

**<PROJECT>** is `<what it is>`

It already exists and is being **rebuilt from scratch** because `<why rebuilt>`.

```
YOU ARE HERE
     |
Phase A   COMPLETE CLICK DUMMY   <-- static HTML + Tailwind. Whole app, page by page.
     |                               The owner approves each page.
Phase B   IMPLEMENTATION             Your approved HTML becomes the real app.
```

🔴 **Your output is not a mockup that gets thrown away.** The approved dummy is used *as it is* to build the
real frontend. Your markup and CSS are the specification: sloppy structure becomes technical debt in the
product; good structure gets translated almost verbatim.

**The goal:** `<goal quote>`

### Where it lives

Everything you produce goes in `<project>-click-dummy/` at the root of this folder. There is **no framework** — plain
HTML, one stylesheet you build once, and a small amount of plain JavaScript. **Every page opens directly in a
browser and every link between pages works.** It is a *click* dummy; the owner must be able to walk the whole
flow, and by the end he must be able to *use* it.

🔴 **Every HTML file sits flat at the root of `<project>-click-dummy/`.** Never `page-name/index.html`, never
`gallery/forms.html`. Only `vendor/`, `assets/` and the two archive folders (section 14) are subfolders. The
owner reviews these by opening files, so every page must be one double-click away.

---

## 2. Deliverable A1 — ONE home page

Build **one** home page, as well as you can build it. Not three, not four.

Explore alternatives if it helps you decide — as sketches, for your own benefit — then **commit and build the
strongest one properly.** Handing over a menu of directions costs several builds and buys nothing.

🔴 **Never ask the owner to choose a direction, palette, type pairing or layout.** He is a developer, not a
designer — he can tell you whether he likes a finished page, and he has said so plainly. Decide, then let him
react to a real page. "I don't like it" is complete feedback: the answer to it is a *different* direction with
stated reasoning, never a question back asking what he would have preferred.

The home page carries:

| | |
|---|---|
| **Colour** | A full ramp — surface, text, border, accent, and semantic success/warning/danger/info — in **both light and dark**. Not a light theme with dark bolted on |
| **Type** | Font pairing and a full scale with real line-heights. System stacks or self-hosted only — no webfont fetched at review time |
| **Feel** | Radius, elevation, spacing density, border weight |
| **Content** | 🔴 **A header, a footer, and at least 12–15 genuinely distinct sections** (see below) |

### 🔴 The content floor — and what "distinct" means

A section counts when it has **a different job AND a different shape** from every other section on the page.
Three feature cards side by side are **one** section, not three. A second testimonial row is not a new section.
A page that claims fifteen and delivers five is the most common way this deliverable fails.

**Consecutive sections must differ in at least two of: background band, content width, internal layout.**
Fifteen distinct sections stacked in one container at one width still reads as a single long column.

Draw from what the product justifies: hero · the problem in the reader's words · how it works, in real numbered
steps · two or three feature deep-dives **each in a different layout** · an interactive or animated preview ·
outcomes and metrics · comparison against the status quo · a persona split · integrations or platform reach ·
trust and security · pricing preview · FAQ · what shipped recently · a closing CTA band · footer.

**One signature element.** Something on this page exists nowhere else in the product and is what someone would
describe if asked what the page looked like. It must not render as a blank rectangle when it has no data, and it
must still be there for a visitor who has reduced motion switched on.

**Count the sections and list them by name in your hand-back.** "15 sections" is unverifiable; a named list is
reviewable in fifteen seconds.

### Then record the decision

One short paragraph: what direction you chose, what you set aside, and why. That paragraph is what he argues
with.

---

## 2b. Deliverable A2 — three colour treatments

Once the home page is approved, produce **three colour treatments at three genuinely different hues,
temperatures and moods**, each designed in **light and dark** — six combinations — switchable from a control
in the page header.

They stay one product — same layout, type system, spacing and semantics. What varies:

| Axis | Varies how |
|---|---|
| **Accent hue** | 🔴 roughly even thirds of the wheel — three different moods, **never three shades of one** |
| **Neutral temperature** | 🔴 the grey ramp moves **with** the accent — identical greys make different accents feel like the same palette |
| **Accent chroma and lightness** | muted, full-strength, or darkened-and-saturated |
| **Contrast and weight** | border thickness, elevation strength, surface-to-surface lightness gap |

Only the primary hue is **registered**; the other two are free and may overlap any other project's hue. None
may land on a semantic hue (danger 27 · warning 85 · success 150 · info 240).

**Semantic colours stay constant** across all three — success, warning, danger and info are meaning, not brand.
Only their lightness is re-solved per appearance so they stay legible. Check `danger` against the accent in each
treatment: an accent in the red-to-magenta range can read as the same colour as an error.

Every combination independently clears contrast: body text on every surface, the primary action's text on its
accent, and the focus ring at ≥3:1 against **both** the component and its background. **A treatment that only
works in dark is unfinished, not a treatment.**

Name them for what they feel like — `clinical`, `warm`, `contrast` — never `variant-1`. Report which is the
default and the contrast figures for the primary action and focus ring in all six combinations.

The treatment choice is a **preference**: it persists (see §3b). Chart series scales are re-derived per
treatment, never reused.

---

## 3. Technical contract

**Tailwind CSS v4** — the CSS-first version. There is **no `tailwind.config.js`** in v4; configuration lives
in CSS.

🔴 **Build Tailwind locally and commit the output CSS. No CDN script tag.** The dummy opens over `file://`
and is reviewed wherever the owner happens to be — on a CDN it renders unstyled with no network, and the
design gets rejected for a reason that has nothing to do with the design. The same rule covers every other
library the dummy needs, charts included.

```html
<link rel="stylesheet" href="/tailwind.css">   <!-- built locally, committed -->
<link rel="stylesheet" href="/tokens.css">
```

### `tokens.css` is the most valuable artifact you produce

Every colour, size, radius and duration is a **semantic token** declared once in `@theme`. This file carries
into the real app, so its naming is not cosmetic:

```css
@import "tailwindcss";

@theme {
  /* Colour — OKLCH. Semantic names only: what it is FOR, never what it looks like. */
  --color-surface:        oklch(99% 0.005 150);
  --color-surface-raised: oklch(97% 0.008 150);
  --color-text:           oklch(25% 0.02  150);
  --color-text-muted:     oklch(55% 0.015 150);
  --color-border:         oklch(90% 0.01  150);
  --color-accent:         oklch(62% 0.15  150);
  --color-accent-hover:   oklch(56% 0.16  150);
  --color-danger:         oklch(58% 0.20   25);

  /* Type, radius, motion */
  --text-base:      1rem;
  --radius-md:      0.5rem;
  --ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);
  --duration-quick: 150ms;
}
```

**Rules that make it survive translation:**

- **Semantic names, never literal ones.** `--color-accent`, not `--color-green-500`. The palette may change
  after it is seen; a literal name becomes a lie the moment it does.
- **Dark mode is a second set of token values, not a second stylesheet.** Each component is written once and
  re-themes for free.
- 🔴 **No arbitrary values.** `w-[347px]` and `text-[#3fb37f]` are design-system failures, not shortcuts. If
  a token is missing, **add the token**. A grep for `-\[` in your output must return nothing.
- **OKLCH for colour**, so light and dark ramps stay perceptually even.

### Structure

```
<project>-click-dummy/
  tokens.css          <- the token set. The highest-value file here.
  shared.css          <- component classes that repeat
  tailwind.css        <- the locally built Tailwind output, committed
  index.html          <- home page
  pages.html          <- a review index linking every page
  gallery.html        <- the library index
  gallery-*.html      <- the eight library files (see section 4)
  <page-slug>.html    <- one flat file per page
  emails.html         <- every email the product sends, drawn like a page: <emails>
  seed.js             <- the demo dataset
  db.js               <- the store
  app.js              <- the shell: navigation, preferences, overlays
  wire.js             <- the declarative bindings (deleted when the app is built)
  demo.js             <- the review toolbar
  vendor/             <- third-party bundles + a README naming version and checksum
  assets/             <- only what cannot be inline SVG
  _rejected/  _kept/   <- archives (see section 14)
```

🔴 **Both archives must be excluded from the Tailwind source scan** — `@source not "./_rejected";` and
`@source not "./_kept";` — because v4 scans the whole tree below its CSS file, and otherwise dead markup keeps
injecting classes into the shipped stylesheet forever.

---

## 3b. 🔴 The finished dummy is interactive and it remembers

This is the deliverable, not a stretch goal. By the end, the dummy **works**:

| Flow | What must happen |
|---|---|
| **Sign in** | The app pages unlock. |
| **An authenticated page** | Checks the session on load. A signed-out visitor gets the signed-out state or the sign-in page — never a half-rendered page. |
| **Create / edit / delete** | Submitting a form or modal changes the list, and it is still changed after a reload and after navigating away and back. |
| **Sign out** | 🔴 **Clears everything and returns to first-run state.** A sign-out that leaves entries behind is the first thing a reviewer tests. |
| **First open** | Seeded with a deterministic demo dataset whose dates are relative to today, so no list is ever empty. |
| **Demonstration switches** | 🔴 **Never persisted.** A reviewer flips "show the error state" once, forgets, and every page looks broken for the rest of the session. Preferences persist; demo switches do not. |

No server and no real CRUD — persistence is browser storage. Three rules make it hold:

1. **Store facts, derive the rest.** Persist what the user did — entries, settings, the session. Compute totals,
   streaks and percentages when reading. A stored total is how one screen says 12 and the next says 11.
2. **Namespace every key** with the project name (`myapp:settings`, not `settings`). Every page opened from the
   filesystem shares one origin, so an unprefixed key collides with every other local page on the machine.
3. **One theme script in `<head>`, reading storage directly**, is the single allowed exception to going through
   the storage layer — it runs before any script has loaded, and without it the page flashes the wrong theme.
   Write a comment at **both** ends naming the exact key it depends on.

Say in `demo.js` which storage backend is actually live. A prototype that silently fell back to memory looks
like a design bug rather than an environment one.

---

## 4. Build order

| Step | Deliverable | Gate |
|---|---|---|
| **A1** | **One home page**, complete — header, footer, 12–15 distinct sections | 🔴 **GATE 1** |
| **A2** | **Three colour treatments**, each in light and dark | closes GATE 1 |
| **A3** | **The component library** — every element the app is made of, in every state, in **eight flat files** | 🔴 **GATE 2** |
| **A4+** | Every remaining page, one at a time, then **all of them wired** into the working prototype | 🔴 **GATE 3** |

A1 before A3 is deliberate: a real page proves the direction is lovable, and the library then locks the
vocabulary before the rest is built on it. **From A4 onward, every page is composed from library
components** — a page needing something the library lacks means the library is incomplete, so it is added there
rather than inline.

The eight library files, all flat at the root:

`gallery.html` (index + actions + system) · `gallery-typography.html` · `gallery-forms.html` ·
`gallery-tables.html` · `gallery-display.html` · `gallery-navigation.html` · `gallery-overlays.html` ·
`gallery-charts.html`

Each names its first real consumer, so a component nothing consumes is visibly either dead work or a missing
page. The library's contents are listed in the inventory file named in section 1.

### 🔴 The admin panel is a batch of pages, not one page

**<PROJECT>** is run by its owner, so it ships a **platform admin panel** — and that panel is a batch of real
pages near the end of the inventory, after everything it manages. Build the ones this product needs, named
here so none is dropped by accident:

**dashboard · users · roles · review queue · moderation · entities · content list · content edit ·
analytics · audit log · feature flags · settings**

Merging two of them into one page is fine where the product justifies it — **write the sentence saying which
and why**, in the inventory. Silently leaving one out is not: a product with user-generated content owes a
moderation queue, and one that verifies anything owes a review queue.

🔴 **The panel is a product surface, not an internal tool.** Same tokens, same theme control, same
320→1920 responsive floor, the same loading/empty/error/dense states, the same keyboard and contrast rules,
and every action acknowledged. It is where the owner spends his time, often on the phone he happens to have
with him — "it's only admin" is how it ends up unusable there.

---

## 5. Every page ships every state

A page shown only in its happy state hides the work. Show every state that applies — as separate sections, or
via a small state-switcher in the corner:

| State | What it must show |
|---|---|
| **Default** | Realistic content, realistic volume |
| **Loading** | A **skeleton matching the final layout** — not a centred spinner. A spinner causes the layout shift the skeleton prevents |
| **Empty** | Explain *why* it is empty and give the action that fills it. **Never a bare "No data"** |
| **Error** | What failed, in plain language, plus a retry. Never a raw error object |
| **Dense** | Many rows, long text, overflowing labels — where layouts actually break |

Plus, for the page as a whole: **light and dark**, and **320px, 768px and 1920px**.

### Interaction states on every control

`default · hover · focus-visible · active · disabled · loading · error · read-only`

- Use **`focus-visible`**, not `focus`, so a mouse click leaves no ring behind.
- A **disabled control must still explain itself** — `disabled` removes an element from the tab order *and*
  from screen readers, so a bare greyed-out button is invisible to some users and inexplicable to the rest.
- Guard hover with `@media (hover: hover)` so a tap leaves no stuck hover state.

### 🔴 There is no `<textarea>` in this product

**Every multi-line input is a rich text editor.** The component is uniform and its **capability** varies — a
field that must stay plain is that same component with no formatting buttons, never a `textarea`.

In the dummy, build it *shaped* like the real one: a real toolbar, real focus / invalid / disabled / read-only
states, a placeholder and a character count, over a `contenteditable`. In the app it becomes a proper editor
library, so keep the toolbar and states faithful and do not invent an output format.

---

## 6. Responsive floor

Mobile-first. This ships as a native app too, so the small end is a real user.

| Width | Must hold |
|---|---|
| **320px** | No horizontal scroll, nothing clipped. The hard case — design it first |
| 375 / 768 / 1024 | Layout adapts, nothing overlaps |
| **1920px** | Content does not stretch into unreadable line lengths |
| **2560px+** | A big screen must not strand a narrow column in an ocean of background — the layout still looks composed |

- **Touch targets ≥ 44×44px** on mobile, spaced so neighbours are not mis-tapped.
- **Body text ≥ 16px** on mobile — below that, iOS zooms on focus and it reads as a bug.
- **Wide content — tables, charts, code — scrolls inside its own container.** The page body never scrolls
  sideways.
- 🔴 **One navigation method per viewport.** The hamburger appears *only* when the inline nav is hidden. Both
  visible at one width is a real bug that has shipped before. One breakpoint drives both; if the inline items
  do not fit, **reduce the item count** rather than showing both.

---

## 7. Accessibility floor — not a later pass

| | |
|---|---|
| **Semantic HTML** | `<button>`, `<a>`, `<nav>`, `<main>`, `<label>`. Never a `<div>` with a click handler |
| **Keyboard** | Every interactive element reachable and operable, in a sensible order, with a **visible** focus ring |
| **Contrast** | WCAG **AA** — 4.5:1 body text, 3:1 large text and UI borders. Check **both** themes |
| **Labels** | Every input has a real `<label>`; every icon-only button has an `aria-label` |
| **Never colour alone** | A status, a chart series or an error must be distinguishable without colour |
| **Motion** | Everything animated respects `prefers-reduced-motion` |

---

## 8. Motion and life — playful, within a budget

The product should feel alive. It should not feel busy.

- **≤ 600ms**, most things far less. Micro-interactions 100–200ms.
- **Animate `transform` and `opacity` only.** Animating `height`, `top`, `width` or `box-shadow` costs
  frames.
- **Restraint:** motion at the hero, at section boundaries, on empty states and on meaningful state
  changes — **not on every card**.
- 🔴 **Never animate**: validation errors, destructive confirmations, anything blocking input, or anything
  that moves a tap target after the user has committed to tapping it.
- **`prefers-reduced-motion` is non-negotiable.** Reduced means *neutralise movement, keep opacity* — never
  strip the feedback entirely, or those users lose the signal that anything happened.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 🔴 Life is surface-dependent — it is not applied uniformly

The same effect that reads as craft on a landing page reads as noise in a tool somebody uses for eight hours.

**Marketing pages** — home, landing, pricing, about — carry the live layer:

| Lever | Guard |
|---|---|
| Custom cursor | 🔴 **Never** — the browser's default pointer only, every page (owner, 2026-10-26). No cursor layer, no `cursor: none`, no cursor axis in the theme panel |
| Magnetic / proximity hover | same pointer guard; cap the pull at about 8px or it feels broken rather than responsive |
| Parallax | `transform` only, one rAF-throttled scroll listener for the whole page; reduced motion → no translate at all |
| Animated gradient or mesh background | animate a `transform`, never `background-position`; reduced motion → the same gradient, static |

**Product pages** — dashboards, tables, settings, forms — carry hover, focus, skeletons and entrance only.
No parallax. (No cursor layer anywhere — banned 2026-10-26.)

**Both** get scroll reveal (once per section on product pages, fade-only under reduced motion) and animated
counters (final value immediately under reduced motion).

🔴 **One shared script, ONE mount point.** A script driving a shared live layer must also *create* its own
markup, behind an idempotent guard. Hand-copying that markup into each page makes the first page work and
every other page silently break — and no gate you can automate will catch it.

Three things none of this may cost: keyboard focus is never degraded, the native cursor is never hidden or
replaced, and no effect may move a tap target after the user has committed to tapping it.

---

## 9. Assets and charts

**SVG only, authored as SVG.** Icons, logo, illustrations, empty-state art, decorative shapes. Raster is an
export step, never a source. One icon set throughout.

Decorative SVG earns its place at heroes, section dividers and empty states — low opacity, marked
`aria-hidden="true"`. No stock illustrations, no emoji clipart, no AI-cartoon look.

### Charts — real ones, in the dummy too

🔴 **Every chart is built with D3, bundled locally. No chart library, no CDN, and never SVG assembled from a
template string.** A string-built chart renders and has no scale, no axis, no data join and no accessible
table — an ornament that resembles a chart, and every one of those omissions is invisible to a build.

This matters more here than in the finished app, because **the dummy is the specification**: a fake chart in
the dummy becomes a fake chart in the framework, and every page after it copies the precedent.

- **A chart's data table is its primary accessible form**, not a consolation prize. Every chart ships one.
- **A chart's rendered box never changes with its data.** Grow the `.domain()`; keep the range and the
  `viewBox` fixed. A chart that resizes with its own values is a defect that looks like a feature.
- One scale per metric, anchored on the range it can actually reach — not on the values that happen to be in
  today's sample.

---

## 10. Copy — real, and honest

Write real copy. **No lorem ipsum**, no `Label 1 / Label 2`. The words are part of the design, and a layout
that only works with placeholder text does not work.

🔴 **Honesty rules — absolute:**

- **No fabricated statistics.** No invented user counts, no made-up figures, no fake testimonials or ratings.
  `<known defect>`
- **No unverifiable claims** — "HIPAA-compliant", "end-to-end encrypted", "#1", "best", "trusted by
  thousands".
- **Never claim a capability the product does not have.** If a screen needs sample data, make it obviously
  sample data.
- `<domain honesty>`

Error messages, empty states and button labels all carry the product's voice. "Something went wrong" is a
missed opportunity, and so is a button labelled "Submit".

---

## 11. 🔴 What you must NOT decide

Staying inside these lines is what makes your work usable as-is.

| Not yours | Why |
|---|---|
| **DOM structure of interactive widgets** — dialogs, selects, comboboxes, tabs, menus, date pickers, sliders | In the real app these are built on a behaviour library that owns their markup, ARIA wiring and keyboard handling. **Style them; do not invent their internal structure.** A hand-built dialog skeleton is discarded in translation. Give the *visual* spec — size, spacing, colour, elevation, motion, every state — and keep wrapper markup simple and semantic |
| **Routes and URLs** | Public URLs are indexed by search engines and frozen. `06-CLICK-DUMMY-INVENTORY.md` gives the path for each page. Use it exactly |
| **Data model, backend, API shapes** | Designed separately |
| **Which features exist** | Build only what the inventory lists. **Do not invent features** |
| **Feature names and terminology** | Taken from the existing product |

Everything else — layout, hierarchy, spacing, rhythm, colour, type, iconography, motion, empty-state
personality, the flow between pages — **is yours, and is the point.**

---

## 12. Working rhythm

**One page at a time**, in the order `06-CLICK-DUMMY-INVENTORY.md` gives.

For each page, hand back:

1. The HTML file(s), working and linked into the rest of the dummy.
2. **Screenshots at 375px and 1440px, light and dark.**
3. **A short list of the design decisions you want confirmed** — not a description of what you built, but the
   two or three genuine choices where a different call was defensible.
4. **Anything you needed that the token set lacked.** That signals the system is incomplete, and it gets
   added deliberately rather than as a one-off.
5. **The delivery summary below. It is a required slot, not a nicety** — fill every line.

Then stop and wait for approval. Iterate here — changes cost minutes at this stage and days once the real app
exists.

### The delivery summary — fill this exactly, every hand-back

Copy this block and complete it. Blank lines are not permitted; write `none` where a category is empty.

```
Folder:     <project>-project-root/<project>-click-dummy/
New:        <path> — <what it is, one clause>          (one line per file created)
Modified:   <path> — <what changed>                    (one line per file edited)
Unchanged:  <paths>                                    (touched nothing, but part of this delivery)
Progress:   <n> of <total> files · <remaining> remaining
Source:     <the inventory file the counts came from>
Next:       <the next batch, named>
```

#### 🔴 Rows and FILES are different units — a status line naming one must never carry the other's number

The `Progress` line above is in **files**, deliberately. The inventory counts **rows**, and one row can be
many files (a component library is one row and eight files). Every project using this template therefore
carries two totals that are both correct and never equal — which is exactly why they get swapped.

**Observed on trizlink, 2026-08-13, three times in one commit**, and caught only by a standalone reviewer:

- the inventory asserted *"the registry agrees: 58 product rows, 25 `built: true`"* — the registry held **18**
  built rows; 25 was the file count. Written **inside the paragraph whose entire subject is that rows and
  files are different numbers**.
- the decisions log said *"12 of 56 rows approved and none in review"* in the commit that corrected the total
  to 58 and put six rows into review.
- the README shipped the pre-batch state in the commit that built the batch.

The common shape is not arithmetic: it is a **summary line written at the batch's start and committed at its
end**. Prose describing state goes stale silently, while the table beside it is updated, and nothing fails.

**The check is mechanical, so run it rather than re-reading carefully:** count the registry, count the
inventory, and diff every summary sentence in the same commit against both. 🔴 **A session cannot audit its
own summary line** — it reads what it meant. This is the specific defect class the post-push standalone
review exists to catch (`~/.claude/rules/fable-standalone-review.md`).

**And rebuild the CSS before committing, then `cmp` it against the committed copy** — a stale `tailwind.css`
is invisible to every other gate.

Three rules keep it honest:

- 🔴 **The counts come from the page inventory, never from a directory listing.** `ls *.html` counts what
  exists; the inventory counts what the dummy *needs*, which is the only number that says how far along you
  are. Where one inventory row maps to several files, the file total is higher than the row total — count
  **files**, and name the source so the arithmetic is checkable.
- 🔴 **Created, modified and unchanged are three separate lines.** A run that edits ten files and creates two
  must not read as twelve new deliverables. This is the line a reviewer uses to know what to actually look at.
- **`Progress` is stated even when it did not move.** A hand-back that silently omits it reads as progress.

Why this is mandatory: the owner is approving batches over many sessions and cannot hold the file ledger in
his head. Without the summary each hand-back looks like an undifferentiated pile of HTML, and "how much is
left" becomes a question he has to ask every single time.

---

## 13. Definition of done, per page

- [ ] Every applicable state present: default, loading (skeleton), empty (with real explanatory copy), error, dense
- [ ] Every control shows its full interaction-state set, using `focus-visible`
- [ ] Light **and** dark, both properly designed
- [ ] 320 / 768 / 1920 with **no horizontal scroll** anywhere
- [ ] Keyboard-operable throughout, with a visible focus ring
- [ ] AA contrast verified in both themes
- [ ] `prefers-reduced-motion` honoured
- [ ] Only semantic tokens — a grep for `-\[` returns nothing
- [ ] 🔴 **No bare `<textarea>`** — every multi-line input is the rich-text component. `grep -c '<textarea' *.html` returns 0
- [ ] Real, honest copy — no lorem, no fabricated numbers, no unverifiable claims
- [ ] Every link in the page goes somewhere real in the dummy
- [ ] Assets are SVG
- [ ] Charts are real D3, each with its data table, and the box does not resize with the data
- [ ] No interactive widget's internal DOM invented
- [ ] Anything the page persists survives a reload, and sign-out clears it

---

## 14. 🔴 The approval gates — where this brief ends

This brief is finished when the dummy is **approved**, not when the last page is built. There are **three
gates**, and each one is a stop:

| Gate | Closes on | Then |
|---|---|---|
| **1 — direction** | the home page, plus its three colour treatments | the library may start |
| **2 — vocabulary** | the complete component library | the remaining pages may start |
| **3 — the phase** | every page built, wired into the working prototype, and manually checked | implementation may begin |

- **Only the owner's own written words approve anything.** Silence, "looks fine", "go ahead with the rest", and
  your own judgement that a page clears the bar are none of them approval.
- **Individual pages are also approved one at a time** as they are handed back, on the way to gate 3.
- **Record every approval in writing, in the session it is given**, in the owner's exact words. An approval that
  lives only in a chat transcript is gone the moment that conversation is compacted.
- **Nothing outside `<project>-click-dummy/` is created until gate 3's record exists** — no app folder, no scaffold, no
  config, not even an empty tree. If you are resuming work someone else started, *verify* the approval record
  exists; work already being underway is not evidence that it was ever given.

### 🔴 He has two ways to say no, and they are different

Move the current version aside **before** building the replacement — never overwrite it.

| He says | Where it goes | The next version must be |
|---|---|---|
| rejects it | `_rejected/NN-<slug>-<date>/` — dead, kept as evidence | **a genuinely new direction**: new colour treatment, type pairing, layout system, motion character |
| "keep this one, but show me another" | `_kept/NN-<slug>-<date>/` — 🔴 **still a live candidate** | a new direction that **names in writing** what it carries forward from each kept version, and is still a new concept |

The live version is always `index.html`. If he later picks a kept one, promote it back to `index.html` and move
the one it displaces into `_kept/`.

**Each archived folder is self-contained** — the page plus the CSS and JS it needs, so it still opens a year
later — and carries a `README.md` with **his words verbatim**, the date, and what was actually wrong (or, for a
kept one, what is worth keeping).

🔴 **The red flag on a replacement:** diff it against the version it followed. If the difference is mostly
colour values, it is a recolour wearing a new name — rebuild it. Two builds that differ only in accent hue
answer a question he did not ask.
