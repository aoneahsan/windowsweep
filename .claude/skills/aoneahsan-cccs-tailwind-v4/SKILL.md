---
name: aoneahsan-cccs-tailwind-v4
description: 'Tailwind CSS v4: CSS-first configuration through @theme, the three-layer design-token architecture, OKLCH colour, dark mode as a custom variant, container queries, and the arbitrary-value discipline that stops a token system eroding. Use when styling on v4, defining tokens, porting from v3, or when a class produces no CSS.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/urls/tailwind-v4.md
---

# Tailwind v4

**The standard: there is no `tailwind.config.*` file.** Configuration is CSS. A v4 project that creates one
has already lost the model — `@config` exists only to keep a legacy file alive mid-migration.

```css
@import "tailwindcss";
@plugin "tailwindcss-react-aria-components";

@theme {
  --color-accent-600: oklch(0.55 0.21 264);
  --radius-card: 0.75rem;
}

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

## 🔴 `@theme` is not `:root`

The single most expensive misunderstanding in v4:

| | Generates a CSS variable | Generates utilities |
|---|---|---|
| `:root { --color-x: … }` | ✅ | ❌ **none** |
| `@theme { --color-x: … }` | ✅ | ✅ `bg-x` `text-x` `border-x` `fill-x` |

A token declared in `:root` produces **no error and no utility** — `bg-brand` simply emits nothing. When a
class silently has no effect, check which block its token lives in first.

**Not every namespace is utility-backed, and the failure is just as silent.** Verified on 4.3.3:

| In `@theme` | Utility | Note |
|---|---|---|
| `--color-*` `--radius-*` `--ease-*` `--animate-*` | ✅ | `@keyframes` written **inside** `@theme` carries through |
| `--duration-*` | ❌ **none** | the variable exists; `duration-quick` emits nothing |

For a namespace with no utility, wrap it once — `@utility dur-quick { transition-duration: var(--duration-quick) }`.
That keeps the token as the single source, composes with variants (`hover:`, `dark:`), and stops markup
hardcoding `duration-200` beside a token that says something else.

The **namespace** picks the utility family: `--color-*` · `--spacing-*` · `--text-*` · `--font-*` ·
`--font-weight-*` · `--radius-*` · `--shadow-*` · `--breakpoint-*` · `--container-*` · `--ease-*` ·
`--animate-*`.

## Three layers, and features touch only the last

```
primitive   --brand-500: oklch(0.55 0.21 264);      raw ramp, spacing, type scale — never used in a component
     ↓
semantic    --color-surface, --color-text-muted,     what a feature is allowed to name
            --color-danger, --color-accent-600
     ↓
component   --btn-padding-inline                     only when a primitive needs its own knob
```

**Light and dark are two value sets over one semantic vocabulary** — not two stylesheets. The name
`--color-surface` never changes; only what it resolves to does.

**Colour is OKLCH.** It is perceptually uniform, so stepping lightness produces a visually even ramp — which
HSL does not — and it reaches P3. Build ramps by walking lightness at near-constant chroma and hue.

## 🔴 Preference axes: multiply, and compose rather than override

A theme control's numeric axes (density, text size) must reach **every** token they govern. Writing them
per-property is how some get missed; a `calc()` multiplier makes it structural:

```css
:root { --density: 1; --sp-4: calc(1.125rem * var(--density)); }
:root[data-density='compact'] { --density: 0.82; }
```

🔴 **And an axis rule can lose SILENTLY on specificity.** `[data-surface-style]` is (0,2,0) and is beaten by a
`[data-palette][data-appearance]` block at (0,3,0) — correct-looking CSS that never applies, with nothing
logged. **Give the axis its own token** (`--surface-alpha`) and let the consuming classes compose it, rather
than trying to out-specify the block. Full contract: `aoneahsan-cccs-react-theming`.

## The arbitrary-value rule

**`w-[347px]` is a design-system failure, not a shortcut.** It means a token is missing; the fix is to add
the token. One escape hatch, used deliberately and commented: a genuinely one-off value that will never
recur, such as matching a third-party embed's fixed height.

```bash
grep -rnE '\[[0-9]+(px|rem)\]|\[#[0-9a-fA-F]{3,8}\]' src/   # should return only documented exceptions
```

## Directives worth knowing

| Directive | Use |
|---|---|
| `@theme` / `@theme inline` | tokens; `inline` **required** when a token references another variable |
| `@custom-variant` | defines `dark`, and any app-specific variant — this replaced `darkMode: 'class'` |
| `@utility` | a custom utility that composes with variants (a plain `.class` does not) |
| `@source` | content outside the project — a linked package, a UI lib in `node_modules` |
| `@variant` | apply a variant inside custom CSS |
| `@reference` | pull tokens into a scoped `<style>` block without duplicating output |
| `--alpha()` / `--spacing()` | `--alpha(var(--color-x) / 50%)`, `--spacing(4)` |

Reset with `--color-*: initial` (one namespace) or `--*: initial` (everything) to own the palette outright.

## Common mistakes

Read `references/migration.md` → *Three more common mistakes* when a class or block seems missing: a template
class name, grepping minified `dist.css` with a quoted selector, and the theme applied in a React effect.

**Four more in `references/migration.md`**, each the one-line failure of a mechanism explained above — tokens in
`:root` (**the most common v4 mistake**, and nothing errors), a missing `@theme inline`, the runtime re-skin
that applies cleanly and changes nothing, and raw hex.

## 🔴 Re-skinning by variable override

Every utility dereferences a variable, and `@theme inline` resolves one level further rather than baking a
literal, so **a whole alternate look is one scoped block** — the same mechanism light/dark already uses:

```css
:root[data-skin="ledger"] { --font-display: "…"; --radius-card: 0; --pad-section: 7rem; }
```

🔴 **It compiles clean and looks like it worked whether or not it did**, so verify by reading the generated
`dist.css` for the variable name the utility actually emits — never the source. **A token is also safe on one
surface, not everywhere:** the same `content-subtle` measured 4.45:1 inset and 4.13:1 sunken while passing on
the page, so scope a contrast fix to the surface.

`references/migration.md` carries the verification commands, the surface-scoped fix, and the corrected
`@import`-position claim — whose real lesson is that **when a fix and a measurement change together, the fix is
unproven.**

For the token architecture, OKLCH ramp construction and the light/dark sets: `references/tokens.md`.

## Related skills

`aoneahsan-cccs-design-system` (what consumes these tokens) · `-react-theming` (the user-facing customiser
over them) · `-frontend-design` (palette selection and the per-project registry) · `-react-aria` (the
`@plugin` that turns RAC data attributes into variants).
