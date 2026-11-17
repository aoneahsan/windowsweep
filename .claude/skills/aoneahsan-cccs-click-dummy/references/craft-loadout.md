# The craft loadout — complete discovery, phase-scoped loading

Scan the full catalog before Phase A so no concern is missed. Invoke every skill below **before the first edit
of the phase that uses it**, not all bodies before A1. Deferred means “not in scope yet,” never “optional.”
This preserves the complete craft set while avoiding the same ~20 bodies on every page-agent startup.

## A0/A1 — direction and home page

Load before designing the first line of markup:

| Skill | Why it is current now |
|---|---|
| `aoneahsan-cccs-design-process` | Read its anti-slop reference: design read + variance/motion/density dials |
| `-frontend-design` | Palette registry, visual direction, add-life levers |
| `-cloned-skills-library` | Copy the project’s vetted external colour, typography, and design-audit set |
| `-tailwind-v4` | Establish CSS-first semantic tokens before pages consume them |
| `-frontend-development` | 320→1920 layout, touch targets, and one-nav behavior |
| `-react-accessibility` | Keyboard, contrast, semantics, and reduced-motion floor |
| `-copywriting` | Real product voice and honest landing-page copy |
| `-react-seo` + `-postbuild-seo-html` | The home page’s metadata, JSON-LD, and crawlable body constraints |

The HabitForge rejection proved `-design-process` + `-cloned-skills-library` are not ceremony: those were the
two omitted bodies, and the otherwise complete page came back generic.

## A2/A3 — colour treatments and component vocabulary

Load before the first colour/gallery edit:

- `-react-theming` — three treatments and the single pre-paint appearance control.
- `-design-system` + `-react-aria` — visual vocabulary plus real widget anatomy.
- `-motion` — easing, duration, reduced motion, and its responsiveness floor.
- `-interaction-feedback` — every control acknowledges the action at the control.
- `-component-playground` — every gallery file drives one live specimen with its knob panel.
- `-react-ui-ux` + `-react-accessibility` — states, navigation, keyboard, and contrast sweeps.
- `-tiptap-rich-text` — no product `<textarea>`; gallery multi-line input is the rich-text component.
- `-d3-charts` — when the gallery includes charts: D3 plus the accessible data table.

## A4+ — remaining page batches

Keep already-loaded foundation bodies available. Add only the bodies whose surfaces appear in the current
inventory batch:

- `-copywriting` for every user-visible page/state.
- `-url-state-persistence` when a page adds tabs, filters, steps, drawers, or modals.
- `-d3-charts` for a chart/report batch; aggregated buckets in, fixed rendered box, accessible table.
- `-tiptap-rich-text` for any multi-line input.
- `-platform-admin` for the system/admin batch sized from `docs/admin/ADMIN-SURFACE.md`.
- Domain skills named by that batch (social, legal, clinical, plans, feedback, exports, and so on).

Do not reload a body merely because a new page file starts. Continue the same heavy agent for adjacent batches
and carry forward the foundation decisions.

## Final wiring batch

Load `-strata-storage`, `-url-state-persistence`, `-interaction-feedback`, and `-react-theming` before wiring.
This is where sign-in/create/reload/sign-out, the namespace probe, shared mount point, persisted state, and
pre-paint appearance become executable rather than decorative.

## Gate 4 — app parity

After the app exists, load the implementation stack plus `-click-dummy`’s parity reference. Compare dummy and
rendered route page by page; Phase-A bodies do not all need reloading unless a visual mismatch is being fixed.

## Official/plugin companions

Invoke `frontend-design:frontend-design` for composition, Adobe `react-aria` for current widget APIs,
`superpowers-chrome:browsing` to inspect rendered output, and `dataviz` for chart work. The main session owns
copies under `.claude/skills/`; an agent reports missing craft rather than writing outside scope.

**Last updated:** 2026-08-05 — the complete loadout is preserved but loaded at the phase that consumes it.
