/**
 * History says when a run happened twice: a relative day for reading, and an exact local
 * minute for matching against the report's file name. Both are wrong in ways no screenshot
 * shows - a run at 23:50 read at 00:10 labelled "today", or a stamp an offset away from the
 * report it should match - so the arithmetic is pinned here.
 *
 * Every date below is built with the LOCAL `Date` constructor, the way a person reads a
 * clock. `vitest.config.ts` fixes the zone to one with daylight saving, and the first case
 * fails if that did not take.
 */
import { describe, expect, it } from 'vitest';
import { calendarDaysAgo, exactStamp, relativeDay } from './history-dates';

/** A local wall-clock time, as the ISO instant the app stores. */
const local = (y: number, m: number, d: number, h: number, min: number) =>
  new Date(y, m - 1, d, h, min).toISOString();
const localMs = (y: number, m: number, d: number, h: number, min: number) =>
  new Date(y, m - 1, d, h, min).getTime();

describe('history dates', () => {
  it('runs in a zone with daylight saving, so the 23- and 25-hour days are exercised', () => {
    const january = new Date(2026, 0, 15).getTimezoneOffset();
    const july = new Date(2026, 6, 15).getTimezoneOffset();
    expect(january).not.toBe(july);
  });

  it('counts local calendar days, not elapsed hours', () => {
    // twenty minutes apart, but across midnight: yesterday
    expect(calendarDaysAgo(local(2026, 9, 24, 23, 50), localMs(2026, 9, 25, 0, 10))).toBe(1);
    // twenty hours apart on the same date: today (rounding the hours would say yesterday)
    expect(calendarDaysAgo(local(2026, 9, 25, 0, 5), localMs(2026, 9, 25, 20, 5))).toBe(0);
    // twenty hours apart across one midnight: yesterday (flooring the hours would say today)
    expect(calendarDaysAgo(local(2026, 9, 24, 13, 0), localMs(2026, 9, 25, 9, 0))).toBe(1);
  });

  it('still counts one day across the clock changes (23 and 25 hours)', () => {
    // America/New_York: the clocks go forward on 2026-03-08 and back on 2026-11-01
    expect(calendarDaysAgo(local(2026, 3, 8, 12, 0), localMs(2026, 3, 9, 12, 0))).toBe(1);
    expect(calendarDaysAgo(local(2026, 11, 1, 12, 0), localMs(2026, 11, 2, 12, 0))).toBe(1);
  });

  it('names the day the way the dummy does: today, yesterday, days, then months', () => {
    const now = localMs(2026, 9, 25, 9, 0);
    expect(relativeDay(local(2026, 9, 25, 8, 0), now)).toBe('today');
    expect(relativeDay(local(2026, 9, 24, 23, 59), now)).toBe('yesterday');
    expect(relativeDay(local(2026, 9, 20, 9, 0), now)).toBe('5 days ago');
    expect(relativeDay(local(2026, 8, 12, 9, 0), now)).toBe('1 month ago');
  });

  it('stamps the local minute the engine names its report after, never UTC', () => {
    // 02:15 UTC is still the previous evening in New York (UTC-4 in September)
    expect(exactStamp('2026-09-25T02:15:00.000Z')).toBe('2026-09-24 22:15');
  });

  it('answers nothing for a stamp that does not parse', () => {
    expect(calendarDaysAgo('not a date', Date.now())).toBeNull();
    expect(relativeDay('not a date', Date.now())).toBe('');
    expect(exactStamp('not a date')).toBe('');
  });
});
