# Gates, liveness and contracts

The full text of the A2, gate-record, live-dummy, token and not-the-dummy rules moved out of SKILL.md (2026-11-02). Read before A2, before recording any gate, and before handing the tokens to the app.

## 🔴 A2 — three colour treatments at three DIFFERENT hues, and the theme control that switches them

Three treatments at **three genuinely different hues, temperatures and moods** — one registered primary plus
two free ones that may overlap any other project's hue — each in light and dark, **and the neutral moves with
the accent**. Plus **THE theme control**: one icon, one panel, every appearance axis, pre-paint and persisted.
**Gate 1 covers both.** `references/colour-variants.md` · **`aoneahsan-cccs-react-theming`**.

🔴 **Do not re-derive a same-hue constraint from the registry's primary-hue separation** — that governs the
*registered* hue only. Three versions of one hue is the rejected outcome, not the target.

## Gate records

**Only the owner's own written words move anything to ✅** — not silence, not "looks fine", never your own
judgement — **recorded verbatim in the session it is given**, or it is gone at the next compaction. **Nothing
is created under `<project>/` before gate 3's record exists**, not even an empty scaffold (owner, 2026-07-29);
a resumed session *verifies* that record rather than inferring it from progress.

## 🔴 A dummy that is correct and DEAD is rejected — pitfall 21

Decoration is rich on marketing pages and restrained in product pages (`~/.claude/rules/frontend-ui-standards.md`
§1a). **Responsiveness has no such split and is owed everywhere:** every control answers press, every state is
reachable **by acting** and not only by looking, and every gallery file carries a **playground** driving one
live instance. That is GATE 2's second half — `aoneahsan-cccs-interaction-feedback` and
`-component-playground`, both required loadout.

🔴 **One shared script, ONE mount point** — hand-copying a live layer's markup per page is pitfall 4.

## The token contract

**Tailwind v4, CSS-first, semantic OKLCH tokens** — architecture in `aoneahsan-cccs-tailwind-v4`. Two rules
are this phase's own: 🔴 **no arbitrary values** (each one is a design-system failure —
add the token; a grep for `-\[` returns nothing), and 🔴 **`tokens.css` is promoted once, in one direction** —
the first implementation module copies it into the app, whose copy is then authoritative, **never a two-way
sync.**

## 🔴 What the dummy must not decide

**The DOM of interactive widgets** belongs to React Aria Components; the dummy gives the **visual** spec only.
**But its controls must still WORK** — a static specimen of an open listbox cannot be judged. Both hold at
once, in RAC's real anatomy: `references/component-gallery.md`. Also not the dummy's: **routes** (public URLs
are frozen), the **data model**, **which features exist**.
