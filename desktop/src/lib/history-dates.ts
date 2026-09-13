/**
 * The two ways History states when a run happened (`page-history.js`, S-081/S-082):
 * a relative day for reading, and an exact local minute for matching against a
 * report's file name.
 *
 * 🔴 CALENDAR days, in local time - not elapsed hours rounded. The dummy rounds
 * `(now - then) / 24h`, so a run at 23:50 read at 00:10 is "today" when it was
 * yesterday, and one from 13:00 yesterday read at 09:00 is also "today". Counting
 * the local midnights between the two instants is what a person means by
 * "yesterday", and the difference is invisible in any single screenshot.
 */

import { FORMAT_LOCALE } from './format';

const DAY_MS = 86_400_000;

/* Built once: a page of History formats up to two hundred of these. */
const DAYS = new Intl.RelativeTimeFormat(FORMAT_LOCALE, { numeric: 'auto' });
const MONTHS = new Intl.RelativeTimeFormat(FORMAT_LOCALE, { numeric: 'always' });

/** Local midnight of the day holding `ms`. */
function startOfLocalDay(ms: number): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Whole local calendar days from the run to `now`: 0 is today, 1 is yesterday.
 * Null when the stamp does not parse. Rounded, because the gap between two local
 * midnights is 23 or 25 hours on the days the clocks change.
 */
export function calendarDaysAgo(iso: string, now: number): number | null {
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return null;
  return Math.max(0, Math.round((startOfLocalDay(now) - startOfLocalDay(at)) / DAY_MS));
}

/**
 * `today` · `yesterday` · `N days ago` · `N months ago` - the dummy's four steps,
 * through `Intl.RelativeTimeFormat` so a second locale needs no code. Days use
 * `numeric: 'auto'` (which is what produces "today" and "yesterday"); months use
 * `always`, because "last month" names a calendar month and a run 44 days ago can
 * sit two of them back.
 */
export function relativeDay(iso: string, now: number): string {
  const days = calendarDaysAgo(iso, now);
  if (days === null) return '';
  if (days < 30) return DAYS.format(-days, 'day');
  return MONTHS.format(-Math.round(days / 30), 'month');
}

/**
 * `YYYY-MM-DD HH:MM` in LOCAL time - a fixed machine format, deliberately not a
 * locale one. Its job is to be matched against `report-<yyyy-MM-dd_HHmmss>-<pid>.json`,
 * which the engine stamps in local time, so the dummy's UTC `toISOString()` would
 * put the two an offset apart.
 */
export function exactStamp(iso: string): string {
  const at = Date.parse(iso);
  if (Number.isNaN(at)) return '';
  const d = new Date(at);
  const two = (n: number) => String(n).padStart(2, '0');
  return `${String(d.getFullYear())}-${two(d.getMonth() + 1)}-${two(d.getDate())} ${two(d.getHours())}:${two(d.getMinutes())}`;
}
