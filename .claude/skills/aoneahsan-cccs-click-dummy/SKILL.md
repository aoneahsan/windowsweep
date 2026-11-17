---
name: aoneahsan-cccs-click-dummy
description: 'Designing a product''s whole UI as a static HTML+Tailwind click dummy before any framework code: one home page, three colour variants, the component library, every page wired and persisting state. Use when a project or feature area needs UI approved first, a dummy was rejected, or someone proposes designing in the framework.'
metadata:
  source: LifeWell rebuild Phase A, 2026-07-26; OD-13/14/18/19/25-28/34; habitforge rejections, 2026-07-29; owner standard, 2026-07-30
---

# Click Dummy

🔴 **Floor:** `aoneahsan-cccs-custom-made`. What this produces must look and read as made by hand for this one product, never AI-generated (owner, 2026-11-04).

## Overview

Design the whole product in static HTML first, approve it, then build it. The dummy is a **specification, not
a mockup**: its markup and tokens translate into the app, and the finished prototype remembers state. Use it
for new products, rebuild design phases, or feature areas—not a screen the existing system already answers.

## 🔴 You decide the design — and load complete craft just in time

**Never ask him to choose a direction, palette, layout, type pairing or aesthetic.** Decide it, argue it in
writing, and let him react to the finished page — `~/.claude/rules/frontend-ui-standards.md` §8. Stack,
product, scope and behaviour questions are still asked.

Scan the complete craft set before Phase A, then load each body **before the first edit of the phase that uses
it** — `references/craft-loadout.md`. A0/A1 direction craft is immediate; gallery, page-domain, wiring, and
parity bodies load at their own boundaries. Deferral never means omission. The main session copies the
project's external craft set (`aoneahsan-cccs-cloned-skills-library`).

## 🔴 An older prototype gives fields, not a layout

A client's mock-up or a previous version supplies fields, flows and words only. Draw every screen on today's
product, use its width, and pass the layout audit: `references/redraw-on-todays-app.md` (§19).

## The order

```
A0  craft loaded · ext- skills copied · palette hue claimed        preparation
A1  ONE home page, the best you can build                       -> GATE 1
A2  three colour variants of the approved direction                closes GATE 1
A3  the component library, eight gallery files                  -> GATE 2
A4+ every remaining page, then all of them WIRED into one
    working prototype that persists                             -> GATE 3
```

🔴 **A1 delivers ONE home page, not a menu of directions** (owner, 2026-07-30). Sketch privately, then commit
and build the strongest one properly.

🔴 **The home page has a content floor: header, footer, and ≥12–15 genuinely distinct sections** —
**`references/home-page.md`**.

🔴 **A signature VOCABULARY — every primitive drawn from the product's own world** (owner, 2026-10-27; §20):
`references/home-page.md`.

🔴 **Claim the palette hue before A1** in `~/.claude/palettes/project-palettes.json`. Prefer 25° clearance;
if unavailable, maximize the feasible minimum circular distance and document it. The registry has
**parallel writers** — re-read it immediately before claiming. Full procedure: `aoneahsan-cccs-frontend-design/references/palette-registry.md`.

Why the home page precedes the gallery, and why a page needing what the gallery lacks means the *gallery* is
incomplete — `references/process.md`.

## 🔴 A2 — three colour treatments at three DIFFERENT hues, and the theme control that switches them

Three genuinely different hues (one registered, two free), light and dark, the neutral moving with the accent,
plus THE theme control — **Gate 1 covers both**. 🔴 Never re-derive a same-hue constraint from the registered-primary separation rule.
Read `references/gates-and-contracts.md` → A2, `references/colour-variants.md` and `aoneahsan-cccs-react-theming` before A2.

## 🔴 Four gates, each written or it has not happened

| Gate | Closes on | Recorded in |
|---|---|---|
| **1 — direction** | the home page + its three variants | the decisions log |
| **2 — vocabulary** | the complete component library | the decisions log |
| **3 — the phase** | every page built, wired, manually checked | `CLICK-DUMMY-APPROVAL.md` |
| **4 — parity** | the built app matching, page by page | each module's report |

🔴 **Gate 4 closes after the app exists** — the only gate that checks what the dummy specified:
`references/parity-check.md`.

🔴 **Only the owner's own written words move a gate to ✅**, recorded verbatim the session they are given;
**nothing under `<project>/` before gate 3's record exists** — read `references/gates-and-contracts.md` → "Gate
records" before recording or resuming a gate.

## 🔴 Rejected is archived; kept-but-superseded stays a candidate

Both keep the file byte-identical; neither replacement is a recolour. Folders, promotion, and the fake-new-
direction check: `references/process.md`.

## The folder — flat, every HTML file at the root

🔴 **Never `<slug>/index.html`** — every reviewable page is one double-click away. Full layout:
**`references/page-inventory.md`**.

## 🔴 The finished dummy is INTERACTIVE and it REMEMBERS

🔴 **State persists through `strata-storage`** — the deliverable, never a stretch goal; never ask about it.
Owner directive verbatim: `references/state-layer.md`.

Store, six flows, `namespace` trap, and pre-paint contract: **`references/state-layer.md`**.

## 🔴 A dummy that is correct and DEAD is rejected — pitfall 21

Every control answers press, every state is reachable by acting, every gallery file carries a playground; 🔴
**one shared script, ONE mount point**. 🔴 **No arbitrary values**, and 🔴 **`tokens.css` is promoted once, in one
direction**. 🔴 The dummy never decides widget DOM (React Aria), routes, the data model or which features exist —
yet its controls still WORK. Full text: `references/gates-and-contracts.md`; read it before GATE 2 and before
promoting tokens.

## 🔴 Every hand-back carries a delivery summary — a required slot

New / Modified / Unchanged on **separate lines**, plus progress counted from the **page inventory, never
`ls`**. Exact template: `references/dummy-brief-template.md` §12.

## Going deeper

**`references/pitfalls.md` — read it before the first gate you intend to trust.** 🔴 **Most pass every
automated gate**; 🔴 **four have no gate at all** and ship a page that is correct yet rejected — as generic, or
as dead.

Also in `references/`: **`dummy-brief-template.md`** (the brief copied into the project — it names no skill,
because the model executing it has none) · **`parity-check.md`** (gate 4) · plus `home-page`,
`colour-variants`, `state-layer`, `process` (and the writer budget), `craft-loadout`, `component-gallery`, `gates-and-contracts`,
`page-inventory`.

## Related skills

`aoneahsan-cccs-project-rebuild` (the phase around it) · `-tailwind-v4` (tokens) · `-react-aria` (whose DOM it
is) · `-design-system` (what it becomes) · `-motion` (the life layer) · `-strata-storage` (the state layer) ·
`-tiptap-rich-text` (every multi-line input) · `-react-theming` (the variant switcher) · `-frontend-design`,
`-react-ui-ux` (the quality bar) · `-copywriting`.
