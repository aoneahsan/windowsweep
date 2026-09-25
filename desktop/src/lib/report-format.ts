/**
 * The one figure the Report screen formats itself: the run's duration, as the
 * engine measured it (`meta.duration_seconds`). "17 seconds" in the dummy's meta
 * line (S-129), through `Intl` so the unit words belong to the locale.
 */

import { FORMAT_LOCALE } from './format';

/** `17 seconds` · `1 minute, 5 seconds` · `2 minutes`. */
export function durationWords(totalSeconds: number): string {
  const whole = Math.max(0, Math.round(totalSeconds));
  const unit = (value: number, name: 'second' | 'minute' | 'hour') =>
    new Intl.NumberFormat(FORMAT_LOCALE, { style: 'unit', unit: name, unitDisplay: 'long' }).format(
      value
    );
  if (whole < 60) return unit(whole, 'second');
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const seconds = whole % 60;
  const parts: string[] = [];
  if (hours > 0) parts.push(unit(hours, 'hour'));
  if (minutes > 0) parts.push(unit(minutes, 'minute'));
  if (seconds > 0) parts.push(unit(seconds, 'second'));
  return new Intl.ListFormat(FORMAT_LOCALE, { type: 'unit', style: 'long' }).format(parts);
}
