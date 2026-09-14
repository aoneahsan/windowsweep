/**
 * The last rehearsal of the safe run - Home's "Dry-run first" - and what it may
 * still be used for: the figure the Reclaim button and the Run screen's idle hero
 * carry, and the held-back figure beside them.
 *
 * 🔴 D-60, GATE 4 round 9 - A REFINEMENT OF DECISION 6's QUANTITY. Round 7 gave the
 * button what the safe run frees and filled it with the measured safe-batch total;
 * round 9 then measured `Reclaim 34.2 GB` beside the engine's own dry-run of the
 * same arguments estimating 2.0 GB, because the engine's gates - the idle window,
 * the temp window, a browser in use - cut the measured total down. The Bible: never
 * state a gigabyte figure as a promise. So:
 *
 *  (a) after a rehearsal with the CURRENT arguments - the same sections, developer
 *      mode, `--days`, `--temp-days`, `--large-file-mb` and exclusions - the figure
 *      is that rehearsal's estimate: the engine's own number for the run on offer;
 *  (b) before one, or once any of those has changed since, it is an UPPER BOUND and
 *      is worded as one ("Reclaim up to"): the measured safe-batch total less what
 *      developer mode is measured to hold back. That is a true bound, because the
 *      engine cannot free more than was measured and not held back.
 *
 * Home's hero keeps the measured total: it describes what is there, not what a
 * press will do. Decided by the main session and recorded in `design/README.md`,
 * whose dummy draws both states first (`db.js` -> `offer`).
 */

import { isCleanupRun, type RunSummary } from './cli';
import type { RunPreferences } from './engine';

export interface Rehearsal {
  /** The preferences it ran with - every one of them is a flag on the safe run. */
  prefs: RunPreferences;
  /** Its exclusion roots, sorted: a set, compared as one, whatever order they were ticked in. */
  excludedPaths: string[];
  /** The engine's own summary of it. */
  summary: RunSummary;
}

/**
 * A rehearsal from a finished "Dry-run first", or `null` when the result cannot
 * stand for one: no summary, cancelled, refused by the engine (exit 2 and above),
 * or not the whole safe batch dry.
 */
export function rehearsalFrom(input: {
  prefs: RunPreferences;
  excludedPaths: readonly string[];
  summary: RunSummary | null;
  exitCode: number;
  cancelled: boolean;
}): Rehearsal | null {
  const { summary } = input;
  if (!summary || input.cancelled || input.exitCode > 1) return null;
  if (!isCleanupRun(summary) || !summary.dry_run || summary.mode !== 'all') return null;
  return { prefs: { ...input.prefs }, excludedPaths: [...input.excludedPaths].sort(), summary };
}

function sameSet(sorted: readonly string[], other: readonly string[]): boolean {
  if (sorted.length !== other.length) return false;
  const next = [...other].sort();
  return sorted.every((path, i) => path === next[i]);
}

/** Whether the rehearsal ran with exactly the arguments the safe run would pass now. */
export function isCurrentRehearsal(
  rehearsal: Rehearsal | null,
  prefs: RunPreferences,
  excludedPaths: readonly string[],
): rehearsal is Rehearsal {
  if (!rehearsal) return false;
  const was = rehearsal.prefs;
  return (
    was.developer === prefs.developer &&
    was.idleDays === prefs.idleDays &&
    was.tempDays === prefs.tempDays &&
    was.largeFileMb === prefs.largeFileMb &&
    sameSet(rehearsal.excludedPaths, excludedPaths)
  );
}

/**
 * Whether its per-section estimates still measure what developer mode holds back.
 *
 * 🔴 NARROWER THAN "CURRENT", AND NOT OPTIONAL. The held-back figure is each
 * developer section's size on disk less the rehearsal's estimate for it, so it is a
 * measurement of developer mode, the idle window and the exclusions - and of those
 * only: `--temp-days` and `--large-file-mb` govern sections 10 and 19, which are not
 * developer sections. A gap measured under `--days 100` subtracted from a run at
 * `--days 30` would hold back more than that run does, and the bound built from it
 * would stop being one; a re-included target has no estimate in the old figure at
 * all. So after any of the three moves, the figure is `not measured` until the next
 * rehearsal, and nothing is subtracted.
 */
export function heldBackApplies(
  rehearsal: Rehearsal | null,
  prefs: RunPreferences,
  excludedPaths: readonly string[],
): rehearsal is Rehearsal {
  if (!rehearsal) return false;
  return (
    rehearsal.prefs.developer === prefs.developer &&
    rehearsal.prefs.idleDays === prefs.idleDays &&
    sameSet(rehearsal.excludedPaths, excludedPaths)
  );
}

/** What the Reclaim button and the Run screen's idle hero carry. */
export interface ReclaimOffer {
  amount: number;
  /** `true` when `amount` is the upper bound - "Reclaim up to" - rather than an estimate. */
  upTo: boolean;
}

/**
 * The offer, or `null` before a scan has measured anything - the button's "Scan
 * first" and the hero's "not measured", exactly as before.
 */
export function reclaimOffer(input: {
  /** `safeRunBytes` - the measured safe-batch total. */
  safeTotal: number | null;
  /** `heldBackBytes` over a rehearsal that still applies: `0` with developer mode off, `null` while unmeasured. */
  heldBack: number | null;
  /** The last rehearsal if it ran with the current arguments, else `null`. */
  current: Rehearsal | null;
}): ReclaimOffer | null {
  if (input.safeTotal === null) return null;
  if (input.current) return { amount: input.current.summary.estimated_bytes, upTo: false };
  /* An unmeasured held-back figure subtracts nothing: the bound stays true, only looser. */
  return { amount: Math.max(0, input.safeTotal - (input.heldBack ?? 0)), upTo: true };
}
