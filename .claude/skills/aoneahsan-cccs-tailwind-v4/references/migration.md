# v3 → v4 migration, directives, and container queries

Depth behind `SKILL.md`. Read when porting anything written for v3, or when reaching for a directive.

## The v3 → v4 map

| v3 (JavaScript config) | v4 (CSS) |
|---|---|
| `tailwind.config.js` exists | **no config file** — everything in the CSS entry |
| `content: [...]` | automatic detection + `@source "…"` for anything outside the project |
| `theme.extend.colors` | `@theme { --color-* }` |
| `theme.colors` (full replace) | `@theme { --color-*: initial; … }` |
| `theme.extend.spacing` | `@theme { --spacing-* }` |
| `theme.extend.borderRadius` | `@theme { --radius-* }` |
| `theme.extend.fontFamily` | `@theme { --font-* }` |
| `theme.extend.fontSize` | `@theme { --text-* }` |
| `theme.extend.screens` | `@theme { --breakpoint-* }` |
| `theme.extend.transitionTimingFunction` | `@theme { --ease-* }` |
| `theme.extend.keyframes` + `animation` | `@theme { --animate-*; @keyframes … }` |
| `darkMode: 'class'` | `@custom-variant dark (&:where(.dark, .dark *))` |
| `darkMode: ['class', '[data-theme="dark"]']` | `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))` |
| `plugins: [require('…')]` | `@plugin "…"` |
| `@tailwind base/components/utilities` | one `@import "tailwindcss"` |
| a plugin's `addUtilities` | `@utility` |
| `theme('colors.brand.500')` in CSS | `var(--color-brand-500)` |

**Port tokens, not classes.** A v3 component's class names mostly work unchanged; its *config* is what has
to move. The exception is anything reading `theme()` in CSS — that becomes a plain `var()`.

## Directives in detail

### `@theme` vs `@theme inline` vs `@theme static`

| Form | Behaviour |
|---|---|
| `@theme` | token → CSS variable + utilities; only variables actually used are emitted |
| `@theme inline` | resolves references at use time — **required** when a token's value is `var(--other)` |
| `@theme static` | emits every variable whether used or not; for tokens read dynamically at runtime |

`static` matters when JavaScript reads a variable that no class references — a D3 chart pulling
`--color-accent` off the computed style, for instance. Without it the variable may not exist in the output.

### `@utility` — not the same as a class

```css
@utility tab-4 { tab-size: 4; }
```

`@utility` composes with variants (`hover:tab-4`, `lg:tab-4`); a plain `.tab-4 {}` in a stylesheet does not.
If a helper needs to be variant-aware, it must be a `@utility`.

### `@source` — content detection

Detection scans the project automatically. It cannot see what it does not know about:

```css
@source "../../packages/ui/src";                  /* a sibling workspace package */
@source "../node_modules/@company/design-kit";    /* a published component lib */
```

### `@variant` and `@custom-variant`

```css
/* Use a variant inside custom CSS */
.callout { background: white; @variant dark { background: black; } }

/* Define one */
@custom-variant supporter (&:where([data-plan="pro"] *));
```

### `@reference` — scoped style blocks

A `<style>` block in a Vue/Svelte SFC or a CSS module cannot see the theme. `@reference` imports the tokens
for compilation **without** duplicating the output CSS:

```css
@reference "../../app.css";
h1 { @apply text-2xl font-bold text-accent; }
```

### `@config` — the legacy bridge

```css
@config "../../tailwind.config.js";
```

Exists to keep a v3 config working during a migration. **A new project must never create one.** Its presence
in a finished project means the migration stalled.

## Container queries

Built in — no plugin. `@container` on the parent, `@sm:` / `@lg:` variants on children, sized from the
`--container-*` namespace.

```html
<article class="@container">
  <div class="flex flex-col @md:flex-row @md:items-center">…</div>
</article>
```

**Use a container query when a component must adapt to its own slot** rather than the viewport — the same
card rendered full-width and inside a narrow sidebar. A media query is wrong there, because the viewport is
identical in both cases and the available width is not.

Media queries remain correct for **page layout**: the shell, the nav breakpoint, the overall grid.

## The detection trap, precisely

Class detection is a **static scan of source text**, not an evaluation. Anything assembled at runtime is
invisible:

```tsx
// ❌ never generated — no such literal exists in the source
<div className={`bg-${color}-500`} />

// ✅ complete literals, selected between
const TONE = {
  danger:  'bg-danger text-text-inverse',
  success: 'bg-success text-text-inverse',
} as const;
<div className={TONE[tone]} />
```

This is also why a class name may not be split across a template boundary, and why `@source` exists for files
the scanner never opens.

---

## Pitfalls — the four that stay out of `SKILL.md`

Added 2026-07-30 when `SKILL.md` exceeded the size budget. The three costliest stay there (a dynamic class name,
grepping minified output, and theme-in-an-effect). Each of these four has a dedicated section in `SKILL.md`
explaining the mechanism; this is the one-line failure it produces.

| Mistake | What happens | Instead |
|---|---|---|
| Tokens in `:root` | utilities never generate, silently | put them in `@theme` |
| Missing `@theme inline` | a referencing token resolves wrong under nesting | add `inline` |
| Overriding `--color-*` to re-skin at runtime | nothing changes: the utility emits `var(--<inner>)`, not `var(--color-*)` | read `dist.css` for the name the utility actually uses, override that |
| Raw hex in a component | tracks no palette, no theme, no rebrand | a semantic token |

**`:root` is the single most common v4 mistake**, and its signature is that nothing errors — the CSS is valid,
the variable resolves, and the utility class you wanted was simply never generated. A missing utility looks
identical to a typo in a class name, which is why it costs so much time.

**The re-skin one wastes an afternoon in a specific way:** the override is correct CSS, applies cleanly, and
changes nothing on screen, because the utility never referenced the variable being overridden. The only way out
is reading the emitted `dist.css` for the name the utility actually uses — see the section in `SKILL.md` for
the two silent breakages and how to confirm which one you have.

---

## Re-skinning by variable override — verification and the two traps

Moved out of `SKILL.md` 2026-07-30 (size budget). `SKILL.md` keeps the mechanism and the rule; this is how to
prove it worked and the two ways it silently does not.

### Verify by reading the generated CSS, not the source

This failure mode compiles clean and *looks like it worked*:

```bash
grep -o '\.font-display{[^}]*}' dist.css   # must show var(--font-display)
```

The scoped block must also actually appear in the output. And grep it **unquoted** — minified output is one
line with quotes stripped, so `grep -c 'data-skin="ledger"'` returns 0 on correct CSS.

### ⚠️ `@import` position does NOT matter to Tailwind — corrected 2026-07-29

An earlier version of this guidance claimed an `@import` placed after `@source`/`@custom-variant` is "silently
invalid and dropped". **It is not.** Tailwind v4 resolves `@import` in its own bundler, where the CSS-spec
ordering rule does not apply. Proven by building one partial in both positions and diffing the output —
**identical**, both inlined.

The bug that produced that claim was the *check*, not the CSS: a quoted grep against minified output, fixed in
the same change as a needless import move, which then took the credit.

🔴 **The general lesson is worth more than the specific fact: when a fix and a measurement change together, the
fix is unproven.** Re-break it and confirm it fails.

### A token is safe on one surface, not everywhere

The same `content-subtle` measured **4.45:1** on an inset surface and **4.13:1** on a sunken one while passing
on the page. Scope the fix to the surface rather than the component:

```css
:is(.well, .bg-surface-sunken) { --ct-subtle: var(--ct-muted); }
```

That also reaches text rendered by JS, where no markup edit could.

## Three more common mistakes (moved from SKILL.md)

| Mistake | What happens | Instead |
|---|---|---|
| `` `bg-${c}-500` `` | class never detected — detection is a static text scan | write whole class names, select between them |
| Grepping **minified** `dist.css` with a quoted selector | `grep -c 'data-skin="ledger"'` returns 0 on output that is one line with quotes stripped — reads as "the block was never emitted" and sends you to fix CSS that was always correct | `grep -o 'data-skin=ledger' dist.css \| wc -l` |
| Theme applied in a React effect | app paints light, then snaps to dark | set the attribute pre-paint, in a head script |
