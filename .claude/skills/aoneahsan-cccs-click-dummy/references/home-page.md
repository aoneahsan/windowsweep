# The home page — the one page that sets the direction

A1 delivers **one** home page, built as well as it can be built. It is the page the direction is judged on, so
it carries the palette, the type pairing, the motion character and the full live layer. Everything from A3
onward inherits what it establishes.

## Signature vocabulary (moved from SKILL.md 2026-10-27)

🔴 **A signature VOCABULARY, not only a signature element** (owner, 2026-10-27, every project). Buttons, type, dividers, section
headers, cards, tables, charts, inputs, navigation, icons and states are each drawn from the product's own world. A clean,
competent, generic page is a rejection ("just another simple clean UI": Tilawah v1). Test each primitive: could it sit in another
product unchanged? Then it is not done. The hand-back lists each primitive's product-specific form.
`~/.claude/rules/frontend-ui-standards.md` §20.

## 🔴 The content floor

**Header, footer, and at least 12–15 genuinely distinct sections.**

This is a floor, not a target. It exists because the alternative has a measured failure: four directions on one
project were rejected with *"basic as hell … no life in it at all"*, and the post-mortem counted **two** unique
content sections across all four pages. Each was a hero, a three-card feature row, and a CTA — technically a
page, visually a template.

### What makes a section count

A section counts when it has **a different job AND a different shape** from every other section on the page.

| Counts | Does not count |
|---|---|
| A comparison table after a feature narrative | The same card grid with new copy and a new heading |
| An interactive preview of the product | A second testimonial row |
| A metrics band with real, sourced figures | Three cards inside one section counted as three sections |
| A persona-split ("if you are a X…") | A spacer, a divider, or a lone heading |
| An FAQ built from questions the product actually gets | A repeat of the hero with the image flipped |

**Three feature cards side by side are one section.** This is the single most common way a page claims fifteen
and delivers five.

### The rhythm rule

🔴 **Consecutive sections must differ in at least two of: background band, content width, internal layout.**
Fifteen distinct sections stacked in one container at one width still reads as one long column — the exact
complaint that followed the first fix attempt on LifeWell: *"right now it's all in container … no dividers
between sessions."*

Give the page a **band system** in `tokens.css` (three or four section background treatments) and alternate
deliberately. Full-bleed against contained. Wide against narrow. Grid against prose against media.

## 🔴 One signature element

Something on this page exists nowhere else in the product and is what a reviewer would describe if asked what
the page looked like. A live data visualisation, an animated diagram of the core mechanic, a physical metaphor
for what the product does.

Two guards on it:

- **It must not render empty in its zero state.** A signature element fed by no data is a blank rectangle where
  the most memorable thing on the page should be — pitfall 13. Give it seeded content.
- **It must survive the reduced-motion pass.** If the element only exists as animation, a reduced-motion visitor
  sees nothing.

## 🔴 A signature vocabulary, not only a signature element (owner, 2026-10-27)

One remarkable element on an otherwise clean, generic page fails. Tilawah's first home page had a strong tajweed signature element,
a claimed gold palette and fifteen distinct sections, and it was rejected: *"very basic and nothing custom or unique about it … just
another simple clean UI"*. Every primitive the page uses (buttons, type, links, chips, dividers, section headers, cards and frames,
tables, charts, navigation, icons, the footer, the legal bar, the theme panel) takes a form drawn from the product's own world. Ask of
each: *could it sit in another product unchanged?* The hand-back carries a table naming each primitive's product-specific form.
Law: `~/.claude/rules/frontend-ui-standards.md` §20.

## The section vocabulary to draw from

Pick what the product actually justifies; this is a menu, not a checklist to fill:

hero · the problem, stated in the reader's words · how it works (numbered, real steps) · two or three feature
deep-dives, **each in a different layout** · an interactive or animated preview · outcomes and metrics ·
comparison against the status quo · persona split · integrations or platform reach · trust and security ·
pricing preview · FAQ · what shipped recently · a closing CTA band · footer.

## Copy and honesty

Real copy in every section — **no lorem ipsum, no invented numbers, no fabricated testimonials or user
counts.** A metric with no source is cut, not softened. `aoneahsan-cccs-copywriting` owns the voice; the
honesty rules there apply to a dummy exactly as they apply to a shipped page, because this copy is what gets
translated.

## The live layer applies here in full

The home page is a **marketing surface**, so it carries the rich end of the motion table — magnetic hover,
parallax, animated background, scroll reveal, counters. Which lever and which guard:
`~/.claude/rules/frontend-ui-standards.md` §1a; recipes: `aoneahsan-cccs-motion`.

It is also an **SEO surface**: per-page metadata, JSON-LD and a crawlable body are design constraints here, not
a later pass (`aoneahsan-cccs-react-seo`, `-postbuild-seo-html`).

## Responsive floor

Mobile-first, and the small end is a real user because these ship as native apps too. Design 320 first, then
375 · 768 · 1024 · 1920, and check that nothing breaks on a very wide screen (≥2560) where a centred column can
strand content in an ocean of background. Touch targets ≥44×44, body text ≥16px, one navigation method per
viewport, wide content scrolls inside its own container and never the page body.

## What the hand-back must state

Count the sections and **list them by name**. "15 sections" is unverifiable; a named list is reviewable in
fifteen seconds and makes a padded page obvious to its own author before it reaches him.

**Last updated:** 2026-07-30
