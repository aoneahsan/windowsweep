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
 * 🔴 The rows come from `axes.json`, which `scripts/gen-prepaint.mjs` also reads to
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
  for (const axis of AXES) root.setAttribute(axis.attr, axisValue(prefs, axis.key));
  const appearance = resolveAppearance(prefs);
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
