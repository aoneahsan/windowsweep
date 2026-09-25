/**
 * The three engine thresholds this window passes on every run - their defaults, the
 * ranges its controls offer, and the clamps that make a stored value safe to pass.
 * Lifted out of `state/store.ts` when that file reached the repository's 500-line cap;
 * the store re-exports the ranges, so nothing that imports them from there changed.
 *
 * 🔴 Every default is the ENGINE'S own (`lib/config.ps1` -> Get-DefaultConfig), so the
 * number on screen is the number that runs.
 */

/** The engine's own idle threshold - `lib/config.ps1`, `days = 100`. */
export const DEFAULT_IDLE_DAYS = 100;
/** The range the click dummy's own control offers (`index.html:138`). */
export const MIN_IDLE_DAYS = 7;
export const MAX_IDLE_DAYS = 365;

/** The engine's own temp threshold - `lib/config.ps1`, `tempDays = 3`. */
export const DEFAULT_TEMP_DAYS = 3;
export const MIN_TEMP_DAYS = 1;
export const MAX_TEMP_DAYS = 90;

/** The engine's own large-file threshold - `lib/config.ps1`, `largeFileMb = 100`.
    🔴 NOT the dummy's 500: that row is a prototype stub whose input has an empty
    handler (`page-settings.js:106`), while every other default here is taken from the
    engine. */
export const DEFAULT_LARGE_FILE_MB = 100;
export const MIN_LARGE_FILE_MB = 1;
export const MAX_LARGE_FILE_MB = 100_000;

/**
 * The engine refuses `--days`, `--temp-days` and `--large-file-mb` unless each is a
 * whole number, and the Rust side refuses a value that looks like a flag, so the one
 * place a value is set is also the place it is made safe to pass. A stored value from
 * an older build - or a hand-edited one - is clamped rather than trusted.
 */
function clampWhole(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

/** The idle window in whole days, inside the control's range. */
export function clampIdleDays(days: number): number {
  return clampWhole(days, MIN_IDLE_DAYS, MAX_IDLE_DAYS, DEFAULT_IDLE_DAYS);
}

/** The temp-folder window in whole days, inside the control's range. */
export function clampTempDays(days: number): number {
  return clampWhole(days, MIN_TEMP_DAYS, MAX_TEMP_DAYS, DEFAULT_TEMP_DAYS);
}

/** Section 19's large-file threshold in whole MB, inside the control's range. */
export function clampLargeFileMb(mb: number): number {
  return clampWhole(mb, MIN_LARGE_FILE_MB, MAX_LARGE_FILE_MB, DEFAULT_LARGE_FILE_MB);
}
