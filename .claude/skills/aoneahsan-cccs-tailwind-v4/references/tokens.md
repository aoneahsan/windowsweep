# Token architecture, OKLCH ramps, and the theme sets

Depth behind `SKILL.md`. Read when defining a project's palette, building a ramp, or wiring light/dark.

## The three layers, in full

### 1. Primitive tokens — the raw material

The ramp, the scales. **Never referenced by a feature.** Their names describe what they *are*, not what they
are *for*, which is exactly why a component must not use them: `--brand-500` says nothing about whether it
is a background, a border or text.

```css
@theme {
  /* Brand ramp — OKLCH, even lightness steps */
  --brand-50:  oklch(0.97 0.02 264);
  --brand-100: oklch(0.93 0.05 264);
  --brand-200: oklch(0.86 0.09 264);
  --brand-300: oklch(0.77 0.14 264);
  --brand-400: oklch(0.66 0.18 264);
  --brand-500: oklch(0.55 0.21 264);
  --brand-600: oklch(0.47 0.19 264);
  --brand-700: oklch(0.39 0.16 264);
  --brand-800: oklch(0.31 0.12 264);
  --brand-900: oklch(0.24 0.09 264);
  --brand-950: oklch(0.17 0.06 264);

  /* Neutral ramp — a touch of the brand hue keeps greys from looking dead */
  --ink-50:  oklch(0.98 0.003 264);
  --ink-500: oklch(0.55 0.012 264);
  --ink-950: oklch(0.15 0.008 264);
}
```

### 2. Semantic tokens — the only vocabulary a feature may use

Named for **role**, so the value can change per theme without a single component edit.

```css
@theme inline {
  --color-surface:        var(--ink-50);
  --color-surface-raised: white;
  --color-surface-sunken: var(--ink-100);

  --color-text:           var(--ink-950);
  --color-text-muted:     var(--ink-500);
  --color-text-inverse:   var(--ink-50);

  --color-border:         var(--ink-200);
  --color-border-strong:  var(--ink-300);

  --color-accent:         var(--brand-600);
  --color-accent-hover:   var(--brand-700);
  --color-accent-subtle:  var(--brand-50);

  --color-danger:         oklch(0.55 0.20 27);
  --color-success:        oklch(0.60 0.15 150);
  --color-warning:        oklch(0.75 0.15 80);
}
```

> **`@theme inline` is required here**, because every one of these references another variable. Without it
> the utility resolves at definition time and inherits the wrong value inside a nested theme scope.

### 3. Component tokens — only when a primitive needs its own knob

```css
@theme {
  --btn-padding-inline: 1rem;
  --btn-height-md: 2.5rem;
}
```

Most primitives never need this layer. Reach for it when a value must be overridable per instance *and* is
meaningless outside that component.

## Light and dark: two value sets, one vocabulary

The semantic names are constant. Only what they resolve to changes.

```css
/* Defaults = light */
@theme inline {
  --color-surface: var(--ink-50);
  --color-text:    var(--ink-950);
  --color-border:  var(--ink-200);
}

/* Dark re-points the SAME names. Plain CSS variables here — these are
   overrides of existing tokens, not new tokens, so no utilities are generated. */
[data-theme='dark'] {
  --color-surface: var(--ink-950);
  --color-text:    var(--ink-50);
  --color-border:  var(--ink-800);
}

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

`bg-surface` is now correct in both themes and **no component contains a `dark:` variant**. Reserve the
`dark:` variant for the rare case where a genuine layout or asset difference is needed, not for colour.

### The pre-paint script — the FOUC guard

The attribute must be on `document.documentElement` **before first paint**. A React effect runs too late:
the app paints light, then snaps. Inline this in `<head>`, before the bundle:

```html
<script>
  // 🔴 The ONE place allowed to touch localStorage directly (aoneahsan-cccs-strata-storage): this runs
  // before any module loads, so there is no API to call. It therefore hard-codes strata's physical key
  // contract — CHANGE THE ADAPTER PREFIX AND YOU MUST CHANGE THIS LINE, or the flash comes back silently.
  //   physical key  = <localStorage adapter prefix> + 'theme'   (+ '<namespace>:' if the instance sets one)
  //   stored value  = strata's JSON wrapper, so the choice is .value — never the raw string
  (function () {
    var s = null;
    try { s = JSON.parse(localStorage.getItem('myapp:theme')).value; } catch (e) {}
    var d = s === 'dark' || (!s && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = d ? 'dark' : 'light';
  })();
</script>
```

The `try/catch` is load-bearing: a missing key, a foreign value, or a wrapper shape change must fall through
to the system preference rather than throw and leave the attribute unset. Put the mirrored half of the
comment on the `defineStorage` call that owns the prefix — `aoneahsan-cccs-strata-storage`.

🔴 **Count the wrappers.** When the theme is persisted by zustand's `persist` over a strata adapter — which is
the house pattern (`aoneahsan-cccs-react-state-zustand`) — the value strata holds is *itself* the serialized
persist envelope, so one unwrap lands on a string, not the choice:

```js
s = JSON.parse(JSON.parse(localStorage.getItem('myapp:theme')).value).state.appearance;
```

Read the real key in devtools once and match the shape. A single unwrap yields a truthy string that is never
`'dark'`, so the guard silently degrades to "always light" — the exact flash it was added to prevent, with
nothing thrown and nothing logged.

## Building an OKLCH ramp

`oklch(L C H)` — lightness `0..1`, chroma `0..~0.4`, hue `0..360`.

1. **Pick the hue** once for the whole ramp and keep it fixed.
2. **Walk lightness** in even steps from ~0.97 down to ~0.17.
3. **Curve chroma**, do not hold it flat — peak it in the middle (400–600) and taper at both ends. Full
   chroma at very high or very low lightness is unreachable in sRGB and gets clipped, which is what makes a
   naive ramp look muddy at the extremes.
4. **Check contrast at the shades you actually ship**, not in the abstract: text needs 4.5:1, UI boundaries
   and focus rings 3:1, in **both** themes.

Because OKLCH is perceptually uniform, equal lightness steps *look* equal. The same walk in HSL does not —
yellow at 50% lightness reads far brighter than blue at 50%, which is why HSL ramps need hand-tuning and
these do not.

## Owning the palette outright

Tailwind's default colours are a fine starting point and a poor identity. To guarantee a project's palette is
its own:

```css
@theme {
  --color-*: initial;      /* drop every default colour */
  /* …then declare only yours */
}
```

`--*: initial` drops the entire default theme — spacing, type scale and all. Use it only when the project
genuinely defines every scale itself.

**Before claiming a palette, check the registry.** Two projects sharing a primary hue is the failure the
per-project palette rule exists to prevent — see `aoneahsan-cccs-frontend-design`.
