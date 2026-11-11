# Click-dummy pitfalls — the ones that cost real time

Three tiers. The first five are obvious once named and just need to not be skipped. The middle group are the
expensive ones: each **passed every automated gate it was subject to** and was found only by looking at the
rendered result — which is why they get a file. A gate you trust that cannot see a whole class of defect is
worse than no gate, because it reports safety.

The last group is a different failure again: the page is *correct* and gets rejected anyway, because it looks
generic. Those have no gate at all.

**Group headings deliberately carry no count** — they drifted twice while the counts stayed put.

## The five that are obvious once named

| Mistake | What happens | Instead |
|---|---|---|
| Only the happy state | the real work — empty, error, dense — gets discovered in React instead | every applicable state |
| A centred spinner for loading | causes the exact layout shift a skeleton prevents | a skeleton shaped like the layout |
| `:focus` instead of `:focus-visible` | a mouse click leaves a ring behind | `focus-visible`, always |
| A bare greyed-out disabled control | `disabled` removes it from the tab order *and* from screen readers, so the reason is unreachable | it still explains itself |
| Lorem ipsum | a layout that only works with placeholder text does not work | real copy, and no invented numbers |

---

## The ones that pass every gate

## 1. Trusting computed contrast instead of the rendered DOM

Offline arithmetic over the token values said a palette passed. A sweep of the **live** DOM found **51
failures** on the same palette.

The gap is that a token is not what lands on screen: `color-mix()`, opacity, a `light-dark()` pair resolving
against the other theme, an inherited colour on an unexpected surface, and blend modes all intervene. Measure
`getComputedStyle` on real elements, in both themes.

**Two traps inside the measurement itself:**

- 🔴 **One fresh page load per theme.** `light-dark()` does not re-resolve when you flip a
  `data-appearance` attribute at runtime, so a runtime flip measures the first theme twice.
- 🔴 **Normalise colours through a canvas `fillStyle`, and compare pixels — never strings.** Chrome returns
  `oklch(…)` from `getComputedStyle`, and reading its three numbers as if they were RGB reports 1.00 for
  everything. `oklab(1 0 0)` and `oklch(1 0 0)` are one colour spelled two ways.
- 🔴 **Clear the probe canvas to TRANSPARENT and read the true alpha — never pre-fill it.** Painting the
  sample over an opaque base makes `getImageData` return alpha 255 for everything, so every
  `rgba(0, 0, 0, 0)` background resolves to **black**. In a dark theme that is roughly the real background,
  so the sweep reports **0 failures and is believed**; run the identical code in the light theme and it
  fails almost every element. Walk the ancestor stack, keep only layers with real alpha, and composite them
  over the body colour.

  The general rule this is an instance of: **a sweep reporting zero failures is not evidence until it has
  been shown to detect a real one.** Both false results above were "clean" runs.

**A blend-mode layer is invisible to the sweep.** A grain or texture overlay using `mix-blend-mode` changes
what the eye sees and nothing `getComputedStyle` reports — so state that limit rather than claiming the
measured number accounts for it.

## 2. A fill colour reused as text

Accent and status hues are tuned for **backgrounds**, where the bar is 3:1. The same hue as type lands at
roughly **3.3–4.4:1** — under the 4.5:1 text bar, and by a margin too small to notice by eye.

Give every such hue a separate `-ink` variant, and solve it against the **worst surface it will ever sit on** —
usually the raised card, not the page. A status colour needs three values, not one: the base fill, a `-soft`
tint, and the `-ink` that is legible on that tint.

**The same shape catches charts.** A fill must clear 3:1 against the surface, which caps a light-mode fill
near 60% lightness — leaving roughly an 18-point window for a five-series ramp. Five series therefore cannot
be separated by lightness alone, which is why markers, stroke patterns and direct labels are the mechanism and
colour is the last cue.

## 3. A default written after its override

`:root` and `:root[data-x]` are **both specificity (0,1,0)**, so with equal specificity the later rule wins —
and a default written last silently defeats every override.

Write defaults first, then the `:root[data-x]` variants. The failure is invisible in review because the CSS
reads correctly line by line; only the rendered result disagrees.

## 4. Shared behaviour in the shared script, its markup copied per page

The one that produced **four** silent defects in a single dummy, of which the owner saw one.

A shared script drove a cursor layer, a preferences panel, a reset button and a theme toggle. Their **markup**
was hand-copied into pages. So: the first page worked, and every other page broke — the cursor layer was
absent while the CSS still hid the OS pointer (an invisible pointer on six pages), a Reset button carried an id
the script never listened for, a theme toggle had no handler at all, and the copy-setup affordance existed only
on the page least likely to be under review. Plus label drift on identical controls: `Custom/Companion/Off`
against `Ring/Companion/System`.

**Why no gate caught it:** a missing element fails no contrast check, overflows nothing, logs no error and
duplicates no id. Every static grep passed. It is visible only by opening the page.

**The fix is ownership, not copying.** The script that drives a piece of shared chrome also creates it, behind
an idempotent guard:

```js
if (document.querySelector('.thing')) return;   // a page may still carry it
// …createElement, never innerHTML — HTML-string injection is a project gate at zero
```

Two things make this the better **specification** rather than a workaround: "paste this into every page" has
no framework analogue, whereas one owner mounting it once is exactly one component in the root layout; and it
renders the panel from the axis registry the script already holds, which is what a settings UI *is*.

Build the panel synchronously rather than from a fetched partial, so a page still works when opened over
`file://`.

## 5. Guarding two halves of one decision differently

Showing a replacement and suppressing what it replaces are **the same decision**, so they must not be able to
disagree. A custom cursor had `display: block` inside `@media (hover: hover) and (pointer: fine)` and
`cursor: none` outside it — so a coarse-pointer device with a mouse attached got the pointer hidden with
nothing drawn.

One guard for both halves. Where the language allows it, gate the destructive half on the constructive half
actually being present:

```css
:root[data-cursor='custom']:has(.cursor) { cursor: none; }
```

That turns "this bug is fixed" into "this bug cannot recur" — a page lacking the layer keeps its native
cursor instead of having none.

🔴 **Since 2026-10-26 there is no custom cursor at all** — the browser's default pointer only, every page (owner;
`rules/frontend-ui-standards.md`). The lesson stands for any pair of show/suppress halves; the cursor example is history.

## 6. A data element that resizes with its own data

`width: 100%` is not size stability, and this is the kind of defect the owner reports as a *feeling* —
*"on first entry it shrinks and then keeps growing"* — long before anyone finds the two lines causing it.

habitforge's rope had two independent causes stacked:

- a **length that ramped with the value** — `span: max(0.14, days / 110)`. Day 0 took a separate branch that
  ignored `span` and drew at full width, so the **first check-in collapsed the element to 14%** and it crawled
  back over 110 days. The zero state looked right, which is exactly why nobody caught it.
- a **viewBox cropped to the drawing** plus `height: auto`, so the element's own height grew 74 → 125 units
  as the data got bigger.

Neither trips a gate: no overflow, no contrast failure, no console error, and a screenshot of any single
state looks correct. **Fix the frame and grow the domain** — a constant `viewBox` and a constant scale
*range*, with only `.domain()` responding to the data. Verify by measuring `getBoundingClientRect()` at
several data values and asserting they are *identical*, not merely plausible.

## 7. A chart hand-rolled as SVG strings

Assembling `svg.innerHTML` from a template string renders. It also has no scale, no axis, no data join and
no accessible table — so it is an ornament that resembles a chart, and every one of those omissions is
invisible to a build.

In a dummy this matters more than in an app, because **the dummy is the specification**: a fake chart here
becomes a fake chart in the framework, and the twenty-six pages after it copy the precedent. Use the real
charting library, in the dummy too. Bundle it — a dummy opens over `file://`, so a CDN tag is not an option
and vendoring the minified file into a specification folder is worse.

## 8. 🔴 Verifying the flag you just set

The most expensive one, because it does not hide a defect — it **certifies** one.

A shared filter hid items with the `hidden` attribute. The verification counted
`cards.filter(c => !c.hidden)`, got exactly the number the live count showed, and reported the filter working.
It was not working: **all 33 cards were still painting.** The test read back the property the code had just
written, so it could only ever agree with itself.

**A test whose input and its expectation come from the same statement proves nothing.** Measure the
*consequence*, never the *cause*:

| Do not assert on | Assert on |
|---|---|
| `el.hidden`, `el.classList.contains('is-open')`, `aria-expanded` | `getComputedStyle(el).display`, a box with real height |
| the value you passed to a setter | what the DOM renders afterwards |
| "the attribute is on the element" | "the pixel changed" |

The tell is that the assertion mentions the same property the code under test writes. When it does, reach one
layer further out — to paint, to layout, to what a person would see.

## 9. 🔴 An undefined custom property silently poisons its whole shorthand

`outline: var(--ring) solid var(--color-focus)` with `--ring` never declared does not fall back to a sensible
outline. The whole declaration becomes invalid at computed-value time and resolves to `unset` — so
`outline-style` is **`none`**.

That alone would be survivable. What made it serious: the eight selectors using it were all *more specific*
than the global `:focus-visible` rule, so each one **replaced a working focus ring with nothing** — every
clickable card, every graph node, the editor toolbar.

Nothing catches this. The CSS parses, no console error is raised, an arbitrary-value grep finds nothing, and a
contrast sweep measures colours on elements it never focuses. **Prove a token resolves by painting it on a
probe element and reading the computed value** — `var(--x)` against a literal is a two-line test.

## 10. 🔴 A shared component is only as shared as its mount point's NAME

Pitfall 4 says the script that drives shared chrome must also create it. True, and not sufficient.

The appearance customiser had exactly one owner, which built the panel *and* injected its toggle — into
`.hdr-actions`. The marketing shell calls the header's action cluster that; the **app shell calls it
`.topbar-actions`**. So on every signed-in page the panel was injected, complete, and its button never was: a
whole preferences UI present in the DOM and unreachable, while the marketing site worked.

Nothing was missing and nothing errored, so no gate fired. **When a shared component mounts into a container
the page supplies, enumerate every name that container has** — or, better, give it one name and fix the pages.

## 11. 🔴 The gate that cannot see the thing it is gating

Six separate gates on one project reported safety they could not observe. They are one failure with six
faces, and each passed for weeks:

| The gate | What it is blind to |
|---|---|
| `documentElement.scrollWidth` for overflow | Nothing, if `html` is `overflow-x: clip` — it returns the viewport width whatever overflows. Hid a **775px topbar in a 320px viewport**. Walk the elements instead |
| A class audit | **Composition.** `.prog` and `.prog-fill` both existing passed a progress bar with no `.prog-track` |
| A glob or a grep | **Itself matching nothing.** A sweep printed "none" while scanning zero files; run correctly it found seven violations |
| A self-consistent manifest (`BUILT + BATCH = N`) | Both lists being wrong together. Cross-check against a third source |
| A contrast sweep | **Hidden states.** Reveal every state block first, or the empty and error screens are never measured |
| Two separate tool actions | **Transient state.** Click-then-measure reported a modal closed that was open; perform and assert in ONE evaluation |
| A link check reporting "**0 missing**" | **Its own denominator.** It walked the page *registry* — every file in the inventory exists, so it answered 0 forever. It never read a rendered `href`, so two 404s in the home page's footer survived every pass. Enumerate the **anchors**, not the manifest |

The habit that catches all six: **before trusting a gate, break the thing on purpose and confirm the gate
fails.** A gate nobody has watched fail is a gate nobody has verified.

🔴 **And ask what the gate counts, not only whether it passes.** The seventh row is the subtlest of the set
because it was *working perfectly* — the probe fetched all 58 registry files and truthfully reported 58 built,
0 missing. The number was right and the question was wrong: "does every file I listed exist" is not "does
every link on every page resolve". The registry could not contain `privacy-policy.html`, because that file was
never created — AD-12 had collapsed the legal pages into one — so the one place the answer could have come
from was the rendered markup nobody was reading.

A denominator drawn from the same source as the thing being checked cannot fail. **Draw it from the other
side:** resolve every local `href` on every page against the server, and let the count be whatever it is.
Found on aoneahsan.com 2026-08-13 by the Fable review leg; the corrected sweep is 59 pages → 39 distinct
targets → 0 dead, and it is a different gate, not a fixed one.

## 12. 🔴 A page-local override that ties with a shared rule wins on source order

Page CSS loads after the shared stylesheet, so `.page-scope .thing { … }` at (0,2,0) beats
`.thing[data-state] { … }` at (0,2,0) — identical specificity, later wins.

The live instance: a calendar page stripped UA button chrome with
`.cx-month .cal-day { background: transparent }`, which silently defeated
`.cal-day[data-selected] { background: var(--color-accent) }`. The selected day kept its white text and lost
its background. **Contrast 1.00 — today's date was invisible, in both themes.**

Two rules follow. **A component that will be used as a `<button>` strips its own UA chrome, in the shared
layer**, so no page has to. And **when a page override is unavoidable, it must not restate a property the
component sets per state** — override the layout, never the state paint.

The same shape in reverse: a rule for *bare* elements inside a container will outrank *components* in that
container. `:is(.empty, .banner) a` at (0,2,0) repainted `.btn-primary` at (0,1,0), so every call-to-action
in an empty state became accent-on-accent. Exclude the components explicitly — `a:not(.btn):not(.card)…` —
or the fix for unstyled links ships a worse defect than the one it fixed.

---

## 18. 🔴 A storage prefix that never reaches the adapter

The config reads correctly, a comment explains why the prefix matters, and the keys are written unprefixed
anyway. Probed on strata 2.8.5 by reading the physical key back out of `localStorage`:

| Written | Physical key |
|---|---|
| `defineStorage({ prefix: 'x:' })` | `theme` — a documented no-op |
| `defineStorage({ adapters: { localStorage: { prefix: 'x:' } } })` | `theme` — **also a no-op** |
| `defineStorage({ namespace: 'x' })` | `x:theme` — the only form that works |

**Why nothing catches it:** the write succeeds, the read succeeds, no error is logged, and the value round-trips
perfectly — because the same wrong key is used both ways. One reference implementation shipped the middle form
with a comment explaining the collision risk it believed it had closed.

It matters more in a dummy than in an app because **every page opened from the filesystem shares one origin**,
so a key named `settings` collides with every other local page on the machine. One dummy's origin held 24
foreign keys from unrelated tools.

**Verify by reading a physical key, never by reading the config.** The general shape: a configuration value that
is silently discarded is indistinguishable from one that works, until you inspect the other side.

## 19. A sign-out that leaves state behind

Sign-out clears the session flag and nothing else, so the next visitor to that browser sees the previous user's
entries behind a signed-out shell — or worse, signs in and finds the list already populated.

**Why nothing catches it:** clearing one key is a successful operation. The bug is in what was *not* cleared,
and no gate enumerates that.

Sign-out **clears the whole namespace and reseeds**. It is also the first flow a reviewer tests, because it is
the cheapest way to check whether a prototype is real — which makes it a bad place to be caught.

## 20. A nested page folder

`<project>-click-dummy/dashboard/index.html` instead of `<project>-click-dummy/dashboard.html`. Every link resolves, every page
renders, every gate passes.

The cost is entirely the reviewer's: he opens the folder to find folders instead of pages, and pays a click per
page across forty of them. He asked for flat files for this reason. Only `vendor/`, `assets/` and the two
archives are subfolders.

## 16. A link decorator that reads its own output

The moment a dummy carries ambient state in the URL — a theme, a density, a demo `state` — something has to
write it onto every link, or the setting dies at the first navigation. That decorator has two ways to be
wrong, and one implementation managed both in a single line.

**It must decorate from the PRISTINE authored href, never the live one.** It runs repeatedly — on every axis
change, every store write, again on click — so reading the live `href` means the second pass reads the first
pass's output. After one pass, a value the author wrote is indistinguishable from a stale ambient one. Cache
the authored href on the node the first time you see it.

**An authored param must win, including an authored axis.** The tempting shape is "keep the page-specific
params, refresh all the ambient ones", which is right until a link deliberately sets an ambient one. Escape
links do exactly that: a "Try again" in an error state is authored as `?state=ready` *because* its whole job
is to leave the state. Refresh-everything rewrites it to `?state=error`, and **every "leave this state" link
silently becomes a "stay here" link.**

🔴 **And demo switches should not ride ambient decoration at all.** A `state` or `surface` axis exists so a
reviewer can look at one page's error design — not so it follows them across the product. One dummy leaked
`surface=app` from its gallery onto the landing page, which then rendered the marketing page at product
dials: a variant nobody chose and nobody would recognise as their own doing.

**No static gate sees any of this.** The href is only wrong *after* JavaScript runs, so a crawl of the source
finds a correct link and the page never errors. Prove it by executing the decorator against an authored
input, or by reading `document.links` on the rendered page.

## 17. The options panel is on the entry page too

Whatever builds the dummy's shared preferences panel runs on **every** page, and that includes the contents
page at the folder root. A panel whose rows are hardcoded `../<dir>/index.html` therefore resolves one level
too high from exactly the file the owner is told to open first — every row 404s, on the entry point.

The fix is not to special-case the root; it is to build the href from the page registry that already knows
where everything is. Detect the root by something true only of it — its own mount point — rather than by
parsing the path, which breaks the first time the folder is nested differently.

Same family as pitfall 4: generated markup is invisible to a source crawl, so this ships looking fine.

---

## The ones with no gate at all — they make it look generic

A different class from the twelve above. Those ship a *defect*; these ship a page that works perfectly and
gets rejected with *"does not look good enough"*. No gate exists for any of them — the only instrument is
opening the page and looking at it as a stranger would.

## 13. 🔴 The signature element renders empty in its zero state

The single worst one, because it destroys the product's whole argument on first paint.

habitforge's rope is the entire reason it is not a generic habit tracker. At day 0 — **the state every
first-time visitor sees** — it rendered as an empty box in both themes, beneath a headline reading
*"Consistency you can see"*. Every automated gate passed: no contrast failure (nothing to measure), no
overflow, no console error, no missing accessible name.

**Design the zero state of the hero element first, not last.** A day-0 rope is cold dark iron with legible
strands and a sheen — visibly a rope that has not been worked yet. "Nothing, plus a caption explaining that
there is nothing" is not an empty state; it is an unfinished one.

## 14. Every section the same shape

Eleven sections of *heading top-left → paragraph at half width → box* reads as templated no matter how good
the copy is. This uniformity **is** the "looks AI-generated" complaint, and it survives excellent typography,
a correct palette and a clean accessibility sweep.

Measure it: if the section heights cluster and the eye can predict the next section's layout from the last
one, the page is monotonous. **No two adjacent sections should share a shape** — vary full-bleed against
constrained, dark against light, symmetric against asymmetric, text-led against image-led. Half of the
sections leaving their right-hand third empty is the same failure wearing a different hat.

## 21. 🔴 Correct, good-looking, and dead

The one the owner reported himself, 2026-08-01: *"they look good, but… they feel dead"* — and the reason a
dummy takes three or four rounds instead of one.

Nothing is wrong. Contrast passes, nothing overflows, the keyboard works, the console is clean, every state is
present as a labelled specimen. What is absent:

- **nothing answers.** A button looks identical before, during and after being pressed; a row vanishes on
  delete with no undo; a submit fails and reports it somewhere other than the field that caused it.
- **nothing can be driven.** The gallery shows the specimens the author chose, so a reviewer can only agree or
  disagree with a decision already made. He cannot ask *what happens with 10,000 rows, or a German label, or
  zero items* — which is where the defects are, and why they surface one round at a time by hand.

**Why no gate catches it:** every gate here tests that something present is correct. This is an *omission*, and
no gate enumerates what was never added. It is also invisible to a source read — the markup of an inert
gallery and a live one differ by a script that may or may not be bound.

Two instruments, both requiring the page to be open:

- **Throttle the network hard and use it.** Anything still inert 100 ms after a click is the bug.
- **Disconnect a knob on purpose and confirm the check goes red.** A dial wired to nothing renders exactly
  like a working one (§8's shape, one level out).

The contracts: `aoneahsan-cccs-interaction-feedback` (what is owed on each action) and
`aoneahsan-cccs-component-playground` (the knobs). Both are required loadout —
`craft-loadout.md`.

## 15. Elevation by a few percent lightness

On dark, surface / raised / inset separated by two or three points of lightness collapse into flat mud; on
light, a white card on off-white barely reads. The token names imply a hierarchy the eye cannot see, so
every reviewer reads it as "flat" without being able to say why.

A genuine step **plus** a border **plus** inner light on dark, and a real shadow on light. Verify by looking
at the render, never by reading that the three token values differ.


## 21. 🔴 Hidden is not absent — a privacy switch owes ABSENT

Found on trizlink, 2026-08-13, by the second standalone review of the same batch — after the first review had
already forced the switches to be wired at all.

A public-profile page had four visibility switches. Turned off, the page correctly rendered *"There is no
profile at this address"*: the wrapper was `hidden`, the name and handle were blanked, the page and badge
records were never built. Every driven check passed.

**The follower count was still computed and still written into its node.** The node was hidden, so nothing
showed — and the number sat in the live DOM of a page whose whole claim is that there is nothing here,
confirming the account exists and disclosing a figure, one view-source away.

```js
// pages and badges — correct: the value is ZEROED when the switch is off
var pages = (isOwner && shows('pubBio')) ? realCount() : 0;
// followers — the leak: hidden by the wrapper, but still populated
var followers = db.derive.followersOf(user.id).length;
```

**Three enforcement levels, and they are not interchangeable:**

| Level | What it does | Right for |
|---|---|---|
| `hidden` on a wrapper | stops it being *seen* | layout, progressive disclosure |
| value zeroed / never computed | stops it being *read* | anything a switch governs |
| markup never rendered | stops it *existing* | the record list itself |

🔴 **A count is the same disclosure as the list it counts.** The page above even said so in a comment twenty
lines above the leak — the standard was written and then not applied to one of the four, which is the normal
shape of this defect: the author enforces the obvious members of a set and misses the one that is derived
differently.

**The check:** for every switch, dump the rendered DOM with the switch off and grep it for the *value*, not
for the element. `leaksName:false` was verified and true; nobody grepped for the number.
