# Gate 4 — parity: the dummy is checked against, not merely read

The dummy skill's other three gates all close **before** any app code exists. This one closes **after**, and
it is the only one that looks at the thing the dummy was built to specify.

## Why it exists

A 44-page dummy was approved and translated into React. Typecheck, lint, build, 114 unit tests, 96 frozen
URLs, token-emission and JSON-LD gates were all green. The app rendered **light where the approved default
was dark**, ~43% roomier on every page, with the custom pointer absent and no appearance control on any
route.

Nothing failed because nothing was looking. The rule at the time — *"the dummy is the visual specification,
do not redesign it here"* — is a **prohibition on intent**, and an agent that sincerely believes it
translated faithfully satisfies it completely. 🔴 **A prohibition on intent cannot fail.**

The full rule lives at `~/.claude/rules/frontend-ui-standards.md` §10. This file is the method.

## The handoff manifest — the dummy agent's last deliverable

The dummy phase does not end at approval; it ends when the next phase knows what to check. Emit
`<project>-click-dummy/PARITY-MANIFEST.json` alongside `CLICK-DUMMY-APPROVAL.md`:

```jsonc
{
  "defaults": { "theme": "dark", "palette": "dusk", "density": "cozy",
                "font": "small", "radius": "medium", "cursor": "custom" },
  "defaultsSource": "index.html:38",   // 🔴 a POINTER, so the test parses the file, never this copy
  "controls": { "header": ["appearance-cycle", "customiser-trigger"] },
  "pages": [
    { "dummy": "index.html",  "route": "/",       "sections": 14, "bands": ["plain","raised","deep","accent"] },
    { "dummy": "about.html",  "route": "/about",  "sections": 9,  "bands": ["deep","plain","raised","accent"] }
  ],
  "archetypes": [
    { "dummy": "calculator.html", "routes": ["/tools/child-growth", "/tools/waist-hip-ratio"] }
  ],
  "noDummy": ["/support", "/get-involved"]   // routes with no approved design — say so, do not invent one
}
```

🔴 **`defaultsSource` is the point.** The parity test **parses the dummy file** and compares. A test that
restates the values is a second copy that drifts, and it will drift silently — which is the failure this
gate exists to catch, reintroduced one level up.

## The two halves

### (a) Mechanical

Minimum: the boot state of `document.documentElement` — every attribute the dummy sets, with the dummy's
own values, read **live in a browser**, not inferred from source.

Then, **per paired page and not optional**: section count, band-tone sequence, the header's control set —
and 🔴 **the TEXT of every heading and every body paragraph, asserted against the dummy's own markup.**

🔴 **The words are part of the specification, and this is the half that gets skipped.** A structural gate —
band tones, section order, heading *ids* — passes happily over a rewritten sentence, because a heading in the
right position is all it looks at. Measured on clearhire 2026-08-20: a structural parity gate had been green
while **901 text units differed** from the approved dummy across the 26 pages whose routes were built, one of
them an approved `<h2>` silently replaced by a better-reading line. *"The app's version reads better"* is not
a reason; it is the mechanism.

Every difference resolves to exactly one of three outcomes, and **there is no fourth**:

1. **Fix** — the app's copy becomes the dummy's, verbatim.
2. **Declare** — an exclusion naming the dummy's own element id **and the written reason** (an unbuilt wave,
   a reviewer note the dummy wrote to itself, labelled sample data that must never be hardcoded). 🔴 An
   unexplained filter in a parity gate is how a gate stops gating.
3. **Live number** — the ONE carve-out: a quantity the product can actually count comes from the product,
   inside the dummy's own sentence. A dummy drawn before the product existed states counts that go stale, and
   shipping a number that contradicts the app's own catalogue is worse than the wording drifting.

🔴 **Report three numbers — matched · declared-excluded · unresolvable — never a bare ratio.** A runner that
iterates its capability set instead of its claim set prints a clean N/N over claims it never executed.

🔴 **Prove it fails.** Flip one default, watch it go red, restore — and better, **point it at a defect you did
not plant.** This class of defect is silent, so a parity test nobody has seen fail is indistinguishable from
one asserting nothing, and a gate proven only against the defect it was written for proves only that.

### (b) Visual

The dummy page and the app page, **captured at the same widths** (1440 and 390 unless the project says
otherwise), both in the report. Not "I compared them" — the pair.

Cheapest reliable form: point a headless browser at `file://…/<project>-click-dummy/<page>.html` and at
`http://localhost:<port>/<route>`, screenshot each, attach both.

**Emails have their own pair.** The app's email composers are checked against `emails.html` by a parity test
and an escaping test, and the gallery is captured at 600 and 390 —
`aoneahsan-cccs-email-campaigns/references/transactional-email-layout.md` §9 and §12.

## What this is NOT

- ❌ **Not pixel-diffing.** Font rasterisation, subpixel rendering and animation timing differ legitimately.
  A pixel gate is red forever and gets switched off inside a week.
- ❌ **Not licence to change the dummy to match the app.** 🔴 If the dummy is wrong, **fix the dummy first
  and say so**. Reconciling in the other direction is how a rebuilt UI drifts back into what it replaced.

  🔴 **A fix-at-source that replaces a VOCABULARY is not done until a whole-pair grep for the retired words
  comes back clean.** Replacing a taxonomy touches a handful of obvious places and leaves the rest — the
  error strings get fixed, an aside three screens down still narrates the old behaviour, and a constant is
  still named after it. The app then diverges from its own corrected spec, silently, and the next parity test
  is written *around* the discrepancy instead of catching it.

  Precedent (habitforge, 2026-08-13): the dummy's auth pages carried a Firebase **popup** taxonomy the
  rebuild's redirect flow made unreachable. The obvious spots were corrected and the fix declared done — a
  review then found *"the window closes and this page moves on"* still in signin's aside, *"The Google window
  closed"* still in signup's cancelled message, a stale rationale comment, and a `POPUP_MS` constant. **Grep
  both sides for the dead vocabulary — "popup", "window", whatever the old model was named — before saying
  it is finished.**
- ❌ **Not the dummy agent's job.** That agent is permanently barred from the app tree, and correctly so. It
  produces the manifest; the implementation and test agents execute the check.

## The failure shape this catches, by name

**"Built but not wired."** Three instances in the origin project, identical in shape: a complete,
well-documented implementation with nothing calling it.

- An atmospheric background whose own header said *"mounted once in the root layout"* — mounted nowhere.
- Two stylesheets asserting *"the pre-paint script in index.html sets data-theme"* — no such script.
- Six preference axes with byte-faithful CSS, three of them never written to the DOM.

🔴 **Documentation describing intent reads exactly like documentation describing fact.** A comment saying a
thing is wired is a claim to verify. Grep for the consumer.

**Last updated:** 2026-09-11 (emails get their own pair — the composer parity + escaping tests). Earlier: 2026-07-31 (created with §10)
