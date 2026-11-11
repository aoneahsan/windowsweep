# The page inventory — deriving it, batching it, proving it complete

The inventory is the dummy's parity ledger. It answers two questions on every prompt: *which page is next*,
and *does every route in the product have a page that covers it*.

It lives at `<project>-project-root/06-CLICK-DUMMY-INVENTORY.md`.

## The folder it counts — flat, every HTML file at the root

```
<project>-click-dummy/
  index.html  pages.html  gallery.html  gallery-*.html  <page-slug>.html
  tokens.css  shared.css
  seed.js  db.js  app.js  wire.js  demo.js
  vendor/     the vendored strata bundle + its provenance README
  assets/     only what cannot be inline SVG
  _rejected/  _kept/    archives, excluded from the source scan
```

🔴 **Never `<slug>/index.html`** — the reviewer opens the folder expecting pages, and pays a click per page
across forty of them (pitfall 20). Only `vendor/`, `assets/` and the two archives are subfolders.

🔴 **Progress is counted from this inventory, never from `ls`** — `ls` counts archives, galleries and the
contents page as product pages, so it always over-reports.

---

## Pages are archetypes, not routes

A 196-route app does not need 196 dummy pages. It needs one page per **UI archetype** — a distinct layout and
interaction shape. Eleven tracker screens differing only in a unit and a colour are **one** archetype; the
twelfth that adds a two-value input is a second.

A realistic app lands around **35–50 pages**. Far fewer means archetypes are being collapsed that genuinely
differ; far more means routes are being copied rather than grouped.

**How to decide whether two routes share an archetype:**

| Same archetype | Different archetype |
|---|---|
| Same layout skeleton, same component set, different data | A different primary interaction (a form vs a feed) |
| Differs only by unit, label, icon or colour | Differs by input shape (single value vs range vs two-value) |
| One list of things vs another list of things | A list vs a detail-plus-editor |

When unsure, build the page and note the variant in its `Covers` column. Collapsing two archetypes into one
is discovered at implementation, which is exactly when it is most expensive.

---

## The table

One row per page. Every column earns its place.

```markdown
| # | Page | Path | File | Archetype | Covers | Status |
|---|------|------|------|-----------|--------|--------|
| 1 | Home | `/` | `index.html` | Marketing landing | `routes/index.tsx` | ⬜ |
| 2 | Component library | — | `gallery*.html` (8) | Reference | every primitive | ⬜ |
| 3 | Dashboard | `/dashboard` | `dashboard.html` | Metric overview + charts | `dashboard.index.tsx`, 4 widgets | ⬜ |
```

- **Path** is the **real** route the page will have. Public paths are frozen and come from the frozen-contract
  file — never invented here.
- **File** is the dummy's flat filename. 🔴 **Always `<slug>.html` at the root, never `<slug>/index.html`** —
  the owner reviews by opening files, so nesting costs him a click per page for nothing.
- **Covers** names the old route files this page stands in for. It is what makes the coverage check possible.
- **Status** is `⬜ pending` → `🔄 in review` → `✅ approved`. **Only the owner sets `✅`.**

🔴 **Rows and files are different numbers, and the hand-back counts FILES.** One row can map to several files —
the component library is one row and eight files. Keep both totals in the header of this table so the delivery
summary's arithmetic is checkable rather than asserted.

### 🔴 Every email is a page too — `emails.html`

Every email the product sends is drawn in ONE flat gallery file, `emails.html` — one row here, like the
component library — and listed in an `## Emails` table in this inventory. **Gate 3 does not close while an
inventoried email is un-drawn.** The `<template>` contract, the widths and the app's parity test:
`aoneahsan-cccs-email-campaigns/references/transactional-email-layout.md` §9–§10.

---

## Batching

Group pages into batches of 4–8 that share a layout family, so consecutive pages reuse decisions instead of
reopening them.

| Batch | Contains | Why grouped |
|---|---|---|
| **0** | The home page, then its three colour treatments | GATE 1 — nothing else can start |
| **1** | The component library, eight files | GATE 2 — the vocabulary everything composes from |
| **2** | Public surface — 🔴 **including a pricing page** | Frozen URLs, no auth, de-risks the freeze early |
| **3** | Entry and identity | Auth, profile, settings — the form-heavy archetypes |
| **4** | The core domain | The product's main screens |
| **5+** | Verticals, grouped by shared layout | Each batch reuses the previous batch's decisions |
| **second-last** | 🔴 System and admin — **a BATCH sized from the project's DERIVED admin surface**, never one page | Depends on everything it manages |
| **last** | 🔴 **Wiring** — every page onto the shared store | GATE 3. Nothing to wire until the pages exist |

🔴 **"System and admin" is a batch, and every inventory written before it said so produced one page.**
ClearHire's carried a single `/admin/users` row against **39** shipped admin routes; LifeWell's finished
50-page dummy contained exactly one `admin.html`. **Size it from this project's `docs/admin/ADMIN-SURFACE.md`**
— the derived capability list, not a generic checklist (`aoneahsan-cccs-platform-admin`). Each capability that
survives merging is a page or a tab in one; then merge deliberately and **write the sentence saying which and
why**, exactly as the archetype rule above requires of every other page.

🔴 **No derived artifact yet means the admin batch cannot be sized** — run the derivation first. Guessing here
is what produced both one-page failures above.

🔴 **A pricing page and plan administration are MANDATORY rows, in every dummy** — owner directive 2026-08-14:
every product ships a plan set, so *"this one is free"* is never a reason to omit either
(`aoneahsan-cccs-plans-entitlements`). The public batch carries the pricing page; the admin batch carries the
five plan capabilities. Designing them late is what leaves the app claiming *"no paid tier"* on surfaces the
pricing work never touched — five of them at once, on habitforge.
🔴 **Every pay surface the dummy draws** (checkout panel, upgrade dialog, a pricing card whose button starts a
payment) carries exactly one small line under the button — *"By continuing, you agree to our Terms of Service
and Privacy Policy."* — and nothing else about payment terms; the no-refund policy is drawn only in the Privacy
Policy and the Terms (`~/.claude/rules/payment-copy.md`).

Batch order follows **design dependency**, which is not the same as the implementation wave order — the library
comes early because everything else composes from it, even though it is not a shipped screen.

🔴 **The wiring batch is a real batch, not a finishing touch.** It adds the store, the seed data, the shared
navigation registry and the bindings, and it is where sign-in, create and sign-out become real
(`state-layer.md`). Budget it like a batch of pages, because that is what it costs.

---

## The coverage check

The inventory is only worth having if it can be *proved* complete. Run this when the route list is known, and
again before Phase B starts:

- **Every old route file appears in exactly one `Covers` cell.** A route in two cells means two pages claim
  it; a route in none means a screen with no design.
- **Every frozen public URL has a row** whose `Path` matches it exactly.
- **The sum of the routes named in `Covers` equals the census route count.**

State the arithmetic explicitly, and state it honestly. A tally like *"186 + shared layouts = 196 ✓"* that
was never actually computed is worse than *"the exact mapping is proved against the parity ledger when it
exists"* — the first invites trust it hasn't earned.

Where the ledger already exists, reconcile against it directly: every ledger row with verdict `keep` or
`merge-into` must be covered by a dummy page.

---

## Before Phase B starts

- [ ] Every row is `✅ approved` by the owner
- [ ] The coverage check passes against the parity ledger
- [ ] `tokens.css` is complete — no page needed a value that isn't a token
- [ ] The library contains every component the pages actually used
- [ ] Every link in the dummy resolves inside the dummy — 🔴 **verified by clicking, not by reading `href`s**
- [ ] 🔴 The prototype works end to end: sign in → create → reload → still there → sign out → reset
- [ ] 🔴 The admin batch covers every capability in `docs/admin/ADMIN-SURFACE.md`, and the seeded superadmin
      can reach every one of them (`aoneahsan-cccs-platform-admin`)
- [ ] 🔴 GATE 3 recorded in the owner's own written words

Then, and only then, the tokens are promoted into the app **once, in one direction**, and implementation
begins.

**Last updated:** 2026-09-11 (every email is a page too — `emails.html` and the `## Emails` table). Earlier: 2026-08-03 (later the same day: the admin batch is sized from the project's **derived**
`docs/admin/ADMIN-SURFACE.md`, not from a generic archetype list — owner directive. Earlier that day: the
admin batch is never one row).
Earlier, 2026-07-30 (flat filenames, rows-vs-files counting, the wiring batch, the three gates)
