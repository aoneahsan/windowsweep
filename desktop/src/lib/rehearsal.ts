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
  /**
   * When it finished, to compare against `scannedAt` (D-63).
   *
   * 🔴 THIS WINDOW'S CLOCK, NOT THE ENGINE'S, and that is a limit rather than a
   * choice: the engine writes `meta.finished_at` into the REPORT FILE
   * (`lib/log.ps1`), never into the one-line `--json` summary this app parses, so
   * `RunSummary` has no finish time to read. Stamped here, the instant the run
   * resolved, which is the same instant `setScanTargets` stamps `scannedAt` with -
   * one clock, so the two are comparable, which is the only property D-63 needs.
   */
  finishedAt: number;
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
  return {
    prefs: { ...input.prefs },
    excludedPaths: [...input.excludedPaths].sort(),
    summary,
    finishedAt: Date.now(),
  };
}

function sameSet(sorted: readonly string[], other: readonly string[]): boolean {
  if (sorted.length !== other.length) return false;
  const next = [...other].sort();
  return sorted.every((path, i) => path === next[i]);
}

/**
 * Whether the rehearsal ran with exactly the arguments the safe run would pass now,
 * AND no scan has re-measured the machine since it finished.
 *
 * 🔴 D-63 (GATE 4 round 11) - THE ARGUMENTS WERE THE ONLY THING THIS COMPARED, AND
 * THEY ARE HALF THE QUESTION. A rehearsal's per-section figures are estimates of
 * files that were on disk when it ran. Press Scan afterwards and the window has a
 * newer measurement of the same machine - a person emptied a cache, a build ran, an
 * installer cleaned up after itself - while every argument is untouched, so the
 * rehearsal stayed "current" and the bands went on printing estimates the app's own
 * newest measurement contradicted.
 *
 * So the rule is both halves: the arguments equal the run's AND `finishedAt >=
 * scannedAt`. After a later scan the figures fall back to D-60's bound wording -
 * "Reclaim up to ...", built from the NEW scan - until the next "Dry-run first".
 *
 * 🔴 The REAL-RUN half of this was already done one file away and is not repeated
 * here: `state/store.ts` -> `spendScanTargets` drops the rehearsal outright when a
 * real run spends a section it estimated. That is a stronger answer for a stronger
 * event - those bytes are gone, not merely re-counted.
 *
 * `scannedAt` null means nothing has ever been measured, so no scan can have
 * finished after anything: the rehearsal is left alone, and every figure built from
 * it is `null` at that point anyway.
 */
export function isCurrentRehearsal(
  rehearsal: Rehearsal | null,
  prefs: RunPreferences,
  excludedPaths: readonly string[],
  /** `scannedAt` from the store - when the live measurements were taken. */
  scannedAt: number | null,
): rehearsal is Rehearsal {
  if (!rehearsal) return false;
  if (scannedAt !== null && rehearsal.finishedAt < scannedAt) return false;
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
  /** `heldBackBySection`, summed, over a rehearsal that still applies: `0` with developer mode off, `null` while unmeasured. */
  heldBack: number | null;
  /** The last rehearsal if it ran with the current arguments, else `null`. */
  current: Rehearsal | null;
}): ReclaimOffer | null {
  if (input.safeTotal === null) return null;
  if (input.current) return { amount: input.current.summary.estimated_bytes, upTo: false };
  /* An unmeasured held-back figure subtracts nothing: the bound stays true, only looser. */
  return { amount: Math.max(0, input.safeTotal - (input.heldBack ?? 0)), upTo: true };
}

/**
 * Which figure a band of per-section rows is showing, said once for the band.
 *
 * `null` is "these rows are not describing a run at all" - one has happened, or one
 * is happening, so the rows are the engine's own reports. `'unmeasured'` is the
 * fourth state and is NOT the same fact: nothing has been measured, so there is no
 * figure to qualify (D-64).
 */
export type FigureBasis = 'bound' | 'estimate' | 'unmeasured' | null;

/**
 * 🔴 D-64 (GATE 4 round 11) - THE BAND ASKED WHETHER A RUN HAD HAPPENED AND NEVER
 * WHETHER ANYTHING HAD BEEN MEASURED. On a fresh session `runFigures` returns an
 * empty map with `upTo: true`, so the Run screen's `Per section` band printed
 * `offer.basisBound` - "Sizes on disk - a run frees up to this" - over eleven rows
 * carrying no figures at all, while Home's ladder one screen away correctly drew no
 * caption. Two bands describing one run, disagreeing about whether its figures exist.
 *
 * 🔴 `offer === null` IS that fact, and it is deliberately the same expression Home's
 * ladder reads (`SafeRunLadder.tsx` -> `measured = total !== null`, whose `total` is
 * this offer's amount), so the two cannot drift apart again. 🔴 NOT "the figure map
 * is empty": emptiness and "nothing measured" are separate facts - exclude every
 * target after a real scan and the map is empty while the true answer is 0 - and
 * `lib/reclaim.ts` records that exact conflation as a defect it already had to fix.
 */
export function perSectionBasis(input: {
  /** A person stopped the run: tested first, for the reason `Run.tsx`'s eyebrow records. */
  cancelled: boolean;
  /** No CLEANUP run has happened in this window - `!isCleanupRun(summary)`. */
  notRunYet: boolean;
  /** The engine is busy. */
  running: boolean;
  /** `reclaimOffer`'s result: `null` until a scan has measured something. */
  offer: ReclaimOffer | null;
  /** `runFigures().upTo` - whether those figures are the bound or the rehearsal's own. */
  upTo: boolean;
}): FigureBasis {
  if (input.cancelled || !input.notRunYet || input.running) return null;
  if (input.offer === null) return 'unmeasured';
  return input.upTo ? 'bound' : 'estimate';
}

/** What a run would free from each section, and whether those figures are bounds. */
export interface RunFigures {
  /** Section id -> bytes. A section with nothing measured and no estimate is absent. */
  bySection: Map<number, number>;
  /** `true` when every figure is the upper bound - "up to" - rather than an estimate. */
  upTo: boolean;
}

/**
 * 🔴 D-61 (GATE 4 round 10) - EVERY FIGURE THAT DESCRIBES WHAT A RUN WOULD FREE
 * FOLLOWS `reclaimOffer`'S RULE, not only the button D-60 fixed.
 *
 * Round 10 measured the button reading *Reclaim 1.9 GB* - the engine's own
 * estimate for that exact run - while two bands lower Home's ladder said *"Total a
 * safe run would free 34.2 GB"* and the Run screen's eleven waiting rows totalled
 * 34.3 GB. Eighteen times the figure, in plainer words, on the same screen;
 * `SafeRunLadder.tsx`'s own header states the invariant it broke, that the total
 * "is the same number the Reclaim button carries". The words are a promise
 * whatever their size, and the Bible's rule is that a gigabyte figure is never
 * stated as one.
 *
 * So, per section:
 *   (a) after a rehearsal with the CURRENT arguments, the rehearsal's own figure -
 *       `sections[].freed_bytes`, which the engine fills in a dry-run exactly as in
 *       a real one (`lib/log.ps1` -> `Add-Freed`; verified against a real
 *       `--json --dry-run`, whose eleven per-section figures summed precisely to
 *       its `estimated_bytes` while the top-level `freed_bytes` stayed 0);
 *   (b) otherwise the measured size less what developer mode is measured to hold
 *       back, which is that section's share of the bound the button carries.
 *
 * In both cases the figures SUM TO `reclaimOffer`'s amount over the safe batch, so
 * the band and the button cannot print two different answers again. A figure that
 * describes what IS THERE is not touched: Home's hero, the drives, the map, a
 * section card on the Sections screen.
 *
 * 🔴 ALL OR NOTHING, and that is the same guard `heldBackBySection` applies one file
 * away. A rehearsal that has no figure for one of the sections asked about cannot
 * fill the band: a column mixing estimates with measured sizes totals to a number
 * that is neither, and its rungs would no longer sum to the button's figure.
 */
export function runFigures(input: {
  /** The sections the figures are wanted for - the engine's own safe batch, in its order. */
  sections: readonly number[];
  /** What the scan measured per section (`lib/reclaim.ts` -> `measuredBySection`). */
  measured: Map<number, { bytes: number; count: number }>;
  /** What developer mode holds back per section, or `null` while unmeasured. */
  heldBack: Map<number, number> | null;
  /** The last rehearsal if it ran with the current arguments, else `null`. */
  current: Rehearsal | null;
}): RunFigures {
  const estimate = input.current
    ? new Map(
        input.current.summary.sections
          .filter((step) => step.status === 'dry-run')
          .map((step) => [step.section, step.freed_bytes]),
      )
    : null;

  if (estimate && input.sections.every((id) => estimate.has(id))) {
    const bySection = new Map<number, number>();
    for (const id of input.sections) bySection.set(id, estimate.get(id) ?? 0);
    return { bySection, upTo: false };
  }

  const bySection = new Map<number, number>();
  for (const id of input.sections) {
    const row = input.measured.get(id);
    if (!row) continue;
    bySection.set(id, Math.max(0, row.bytes - (input.heldBack?.get(id) ?? 0)));
  }
  return { bySection, upTo: true };
}
