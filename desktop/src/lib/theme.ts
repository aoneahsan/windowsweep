/**
 * The appearance axes - ONE table, exactly as the approved click dummy defines them.
 *
 * 🔴 The registry is the single source. The pre-paint script iterates it, the theme
 * panel renders from it, and one apply path writes it. Adding an axis is one row,
 * so an axis cannot be half-added - the recorded failure this shape prevents is a
 * project whose CSS was byte-faithful across six axes while only three were ever
 * written to the DOM.
 *
 * 🔴 Applied PRE-PAINT, from `index.html`'s head, before React exists. Appearance
 * applied late is a colour flash; density or text size applied late is a reflow.
 */

import registry from './axes.json';

export interface AxisValue {
  value: string;
  label: string;
}

export interface Axis {
  key: string;
  attr: string;
  /** i18n key for the axis name. The label itself is never hard-coded in English. */
  labelKey: string;
  def: string;
  values: AxisValue[];
  preview: string;
}

/**
 * 🔴 The rows come from `axes.json`, which the build's `vite/prepaint.ts` also reads to
 * emit the pre-paint script. One file, two consumers - so the script that runs
 * before React exists and the panel the user opens can never disagree about which
 * axes exist or what each one defaults to.
 */
export const AXES: readonly Axis[] = registry.axes;

export type AxisPrefs = Record<string, string>;

export const PREFS_STORAGE_KEY: string = registry.storageKey;

export function axisByKey(key: string): Axis | undefined {
  return AXES.find((a) => a.key === key);
}

export function axisValue(prefs: AxisPrefs, key: string): string {
  const axis = axisByKey(key);
  if (!axis) return '';
  const current = prefs[key];
  return axis.values.some((v) => v.value === current) ? (current as string) : axis.def;
}

/**
 * URL overrides are SHOWN, never persisted - the dummy's own contract (`app.js`): a reviewer who links
 * `?palette=plum&theme=light` must not have it follow them. `prepaint.js` applies the same layer before first
 * paint; this is the React side's copy, read once at load, so the boot pass in `main.tsx` no longer takes the
 * URL's value away again (D-73, GATE 4 round 16). An axis is named by its key (`typeScale`) or its attribute
 * (`type-scale`), as the dummy accepts both.
 *
 * 🔴 It is layered only where an axis is APPLIED or SHOWN - `applyAllAxes` and the theme panel - and never into
 * `axisValue` itself: sync compares STORED preferences through `axisValue`, and a link must not make a setting
 * look changed and travel to the account.
 */
const urlOverride: AxisPrefs = readUrlOverride();

function readUrlOverride(): AxisPrefs {
  const out: AxisPrefs = {};
  try {
    const q = new URLSearchParams(window.location.search);
    for (const axis of AXES) {
      const raw = q.get(axis.key) || q.get(axis.attr.replace(/^data-/, ''));
      if (raw && axis.values.some((v) => v.value === raw)) out[axis.key] = raw;
    }
  } catch {
    /* no window, or a URL that will not parse - there is nothing to layer */
  }
  return out;
}

/** The preferences as the window shows them: the URL's overrides over the stored ones. */
export function shownPrefs(prefs: AxisPrefs): AxisPrefs {
  return { ...prefs, ...urlOverride };
}

/**
 * An explicit choice ends the URL's override for that axis, as the dummy's `setAxis` does. The key is DELETED,
 * never blanked: a blank value spread over the stored preferences would make `axisValue` answer the default and
 * hide the choice just made.
 */
export function dropUrlOverride(key: string): void {
  delete urlOverride[key];
}

/** `system` resolves through the OS query; everything else is itself. */
export function resolveAppearance(prefs: AxisPrefs): 'light' | 'dark' {
  const t = axisValue(prefs, 'theme');
  if (t !== 'system') return t === 'light' ? 'light' : 'dark';
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

/**
 * The ONE apply path. Nothing else in this codebase writes an axis attribute.
 * `data-appearance` carries the RESOLVED value, which is what the token file
 * actually selects on.
 */
export function applyAllAxes(prefs: AxisPrefs, root: HTMLElement = document.documentElement): void {
  const shown = shownPrefs(prefs);
  for (const axis of AXES) root.setAttribute(axis.attr, axisValue(shown, axis.key));
  const appearance = resolveAppearance(shown);
  root.setAttribute('data-appearance', appearance);
  root.style.colorScheme = appearance;
}

export function readPrefs(): AxisPrefs {
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return {};
    const wrapped = parsed as { v?: unknown };
    const value = 'v' in wrapped ? wrapped.v : parsed;
    return typeof value === 'object' && value !== null ? (value as AxisPrefs) : {};
  } catch {
    return {};
  }
}

export function writePrefs(prefs: AxisPrefs): void {
  try {
    // The `{v: ...}` wrapper and the `namespace:key` physical key are strata-storage's
    // own shape, named at both ends so a namespace change cannot silently revert this
    // to unprefixed keys. Verify by reading the physical key, never by reading config.
    window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify({ v: prefs }));
  } catch {
    /* a private window or blocked site data - the session still works, it just forgets */
  }
}

/**
 * Motion consults BOTH the axis and the OS. A media query cannot see the axis, so
 * anything asking the query directly lets the setting be silently ignored.
 */
export function motionAllowed(prefs: AxisPrefs): boolean {
  const m = axisValue(prefs, 'motion');
  if (m === 'reduced') return false;
  if (m === 'full') return true;
  try {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return true;
  }
}
