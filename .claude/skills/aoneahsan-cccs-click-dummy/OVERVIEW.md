# Overview — `aoneahsan-cccs-click-dummy`

## Purpose

Settle a product's entire UI in static HTML before any framework code exists, then hand over a **working
prototype** rather than a picture of one. Design iteration in HTML costs minutes and in React costs days — so
the expensive medium should only ever receive decisions that are already made. The approved dummy is translated
almost verbatim, which turns implementation into translation plus data work rather than design-by-commit.

It is a separate skill from the rebuild method because it stands alone: a greenfield product, or a whole new
feature area in an existing one, can use it without any of the audit, freeze or parity machinery.

## What this skill does

- Runs the **A0 → A1 → A2 → A3 → A4+** order: preparation, **one** home page, three colour treatments, the
  component library, then every remaining page wired together — and explains why the home page precedes the
  library rather than following it.
- Fixes the three approval gates — direction, vocabulary, phase — and what counts as approval for each.
- Sets the home page's **content floor**: header, footer and ≥12–15 genuinely distinct sections, with a rule
  for what makes a section distinct and a rhythm rule that stops fifteen of them reading as one column.
- Defines **three colour treatments at three genuinely different hues**, each in light and dark — one
  registered primary plus two free hues — and why three versions of a single hue is the rejected outcome.
- Specifies the state layer: the store, sign-in/sign-out/create flows, the strata `namespace` trap, and the
  pre-paint theme script's physical-key contract.
- Defines the `tokens.css` contract — semantic OKLCH tokens, dark mode as a second value set, no arbitrary
  values — so the file survives into the real app unchanged, promoted **one way** only.
- Specifies the component library as eight flat files covering typography, actions, forms, tables, display,
  navigation, overlays and charts, each with its complete state matrix.
- Distinguishes the two ways the owner says no — **rejected** and **kept-but-superseded** — and what the
  replacement must be in each case.
- Enforces the responsive floor, the accessibility floor, the motion budget and the copy-honesty rules.
- Requires a **delivery summary** on every hand-back, so an owner approving batches over many sessions never
  has to ask what changed or how much is left.
- Records the pitfalls in three classes — obvious once named, passing every automated gate, and having no gate
  at all, which ship a page that works perfectly and still reads as generic.
- Draws the line at what the dummy must **not** decide — most importantly the DOM of interactive widgets,
  which React Aria owns.
- Carries a fully self-contained brief that a model with no access to these skills can execute.

## When it gets invoked

- "build the click dummy" · "design the UI first" · "let's do the HTML mockup before React"
- A rebuild reaches Phase A, or a whole new feature area needs its own pages.
- A home page or library came back rejected and needs a new direction.
- A dummy needs its remaining pages built, or its pages wired into the working prototype.
- UI design is being handed to an external or another vendor's model.
- Someone proposes designing screens directly in the framework — the failure this exists to prevent.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | A new project, a rebuild's design phase, or a whole new feature area needing its own pages |
| Stack override | The token contract assumes Tailwind v4 and the widget-DOM rule assumes React Aria. A project on another stack keeps the *concerns* — semantic tokens, state coverage, and not inventing the internals of widgets its behaviour layer owns |
| Not applicable | A single screen inside an app whose design system already answers the question |

## Sources

| Source | Record |
|---|---|
| The LifeWell Phase A brief and inventory (2026-07-25) | generalised; LifeWell keeps its filled instance at `05-CLICK-DUMMY-BRIEF.md` and `06-CLICK-DUMMY-INVENTORY.md` |
| Owner decisions OD-13, OD-14, OD-18, OD-19 | direction count, dummy-first order, the library deliverable, the dummy's location |
| OD-25 → OD-28 | the four-direction rejection rounds — *"basic as hell … no life in it at all"* — which the home-page content floor is the measurable answer to |
| OD-34 | the interactive, persistent prototype and the strata-storage requirement |
| habitforge, 2026-07-25 → owner standard, 2026-07-30 | *"create just 1 UI version… instead of creating 4 5 different versions"*. Recorded here in 2026-07-25 and **not applied** until the 2026-07-30 standard collapsed A0 to a single built page — the drift this skill now exists to prevent in itself |
| LifeWell (2026-07-29) | the delivery-summary requirement, and pitfalls 4–5 — a cursor layer whose driver was shared while its markup was copied per page, producing four silent defects that every static gate passed |

## Related skills

- `aoneahsan-cccs-project-rebuild` — the phase this sits inside.
- `aoneahsan-cccs-tailwind-v4` — the CSS-first token layer.
- `aoneahsan-cccs-strata-storage` — the state layer the finished prototype runs on.
- `aoneahsan-cccs-react-aria` — why interactive-widget DOM is not the dummy's to invent.
- `aoneahsan-cccs-design-system` — what the approved dummy is codified into.
- `aoneahsan-cccs-react-theming` — the colour-treatment switcher, and what it becomes in the app.
- `aoneahsan-cccs-tiptap-rich-text` — why the product has no `<textarea>`.
- `aoneahsan-cccs-frontend-design`, `-react-ui-ux` — the component quality bar the translation must meet.
- `aoneahsan-cccs-copywriting` — the real, honest copy the dummy carries.

## Maintenance

- **Living registries this skill points at:** `~/.claude/rules/frontend-ui-standards.md` (§1a the motion
  surface split, §8 design authority, the upload-field affordance, the one-navigation-method rule) and
  `~/.claude/palettes/project-palettes.json` when present on this machine.
- **Feedback loop:** each completed dummy folds what it learned back into `references/component-gallery.md`,
  `references/dummy-brief-template.md` and `references/pitfalls.md`.
- **Last reviewed:** 2026-07-30
