/**
 * Formatting through `Intl`, never hand-rolled.
 *
 * 🔴 The FORMATTING locale is not the UI language. `DEFAULT_LOCALE` is the
 * catalogue i18next runs; `FORMAT_LOCALE` is what `Intl` uses. Bare 'en' gives US
 * conventions, so an en-GB product would print "August 21, 2026". Two constants,
 * never one value changed in two places.
 */

/** The catalogue i18next loads. Changing this changes which translation runs. */
export const DEFAULT_LOCALE = 'en';

/** What `Intl` formats with. Changing this changes dates, numbers and units only. */
export const FORMAT_LOCALE = 'en-GB';

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

/**
 * Bytes as the engine reports them - binary steps, because that is what Windows
 * shows in Explorer and a mismatch between the two reads as the tool lying.
 */
export function formatBytes(bytes: number, fractionDigits = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = unit === 0 ? 0 : fractionDigits;
  return `${new Intl.NumberFormat(FORMAT_LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)} ${BYTE_UNITS[unit]}`;
}

export function formatCount(n: number): string {
  return new Intl.NumberFormat(FORMAT_LOCALE).format(n);
}

export function formatDateTime(iso: string | number | Date): string {
  return new Intl.DateTimeFormat(FORMAT_LOCALE, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatRelative(from: Date, to: Date = new Date()): string {
  const seconds = Math.round((from.getTime() - to.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(FORMAT_LOCALE, { numeric: 'auto' });
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ['second', 60], ['minute', 60], ['hour', 24], ['day', 7], ['week', 4.35], ['month', 12],
  ];
  let value = seconds;
  for (const [unit, size] of steps) {
    if (Math.abs(value) < size) return rtf.format(Math.round(value), unit);
    value /= size;
  }
  return rtf.format(Math.round(value), 'year');
}

export function formatDuration(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${formatCount(s)}s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest === 0 ? `${formatCount(m)}m` : `${formatCount(m)}m ${formatCount(rest)}s`;
}
