# Tailwind v4 — overview

## Purpose

Tailwind v4 moved configuration out of JavaScript and into CSS, and the fleet is already carrying the drift
that causes: `tailwindcss@4.3.3` installed in `lifewell-old` beside a **v3-style `tailwind.config.ts`**. This
skill is the CSS-first model stated once — tokens in `@theme`, dark mode as a custom variant, OKLCH colour,
and the token discipline that keeps a design system from eroding back into hardcoded values.

It exists because the LifeWell rebuild's entire UI rests on it, and because the failure mode is silent: a
token in the wrong block generates no utility, raises no error, and simply does nothing.

## What this skill does

- States the standard: **no `tailwind.config.*` in a v4 project**, and what `@config` is actually for.
- Draws the **`@theme` vs `:root`** line — the distinction between a design token that generates utilities
  and a plain CSS variable that does not.
- Gives the **namespace → utility family** map that decides what a token name produces.
- Defines the **three-layer token architecture** (primitive → semantic → component) and the rule that
  features consume semantic tokens only.
- Treats **light and dark as two value sets over one semantic vocabulary**, never two stylesheets.
- Explains **OKLCH** and why a ramp built in it stays perceptually even where HSL does not.
- Makes **arbitrary values a design-system failure** with a grep that finds them.
- Covers the directives that matter — `@theme inline`, `@custom-variant`, `@utility`, `@source`, `@variant`,
  `@reference` — and the `--alpha()` / `--spacing()` functions.
- Carries the traps: string-concatenated class names, the missing `inline`, and the pre-paint theme script.

## When it gets invoked

- "set up Tailwind", "add a design token", "why isn't this class working"
- "add dark mode" / "the app flashes the wrong theme on load"
- "port this component from the old app" (v3 → v4)
- Any project scaffold that includes Tailwind.
- Any time a component is about to use a raw hex value or a bracketed arbitrary value.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Every project on Tailwind v4 — web and the Capacitor web layer |
| Stack override | The concern is *design tokens with a single source of truth*. A project on a different styling system satisfies it with that system's token mechanism; the three-layer architecture and the no-raw-values rule carry over unchanged. |

## Sources

| Source | Record |
|---|---|
| `tailwindcss.com` — theme, functions-and-directives, dark-mode (fetched 2026-07-25) | `_source-understanding/urls/tailwind-v4.md` |

## Related skills

- `aoneahsan-cccs-design-system` — consumes these tokens to build the primitives
- `aoneahsan-cccs-react-theming` — the user-facing customiser that switches the token sets
- `aoneahsan-cccs-frontend-design` — palette selection and the per-project uniqueness registry
- `aoneahsan-cccs-react-aria` — the `tailwindcss-react-aria-components` plugin registered via `@plugin`

## Maintenance

- **Living registries this skill points at:** none. Version-sensitive facts are pinned in the source record.
- **Last reviewed:** 2026-07-25
