/**
 * How much a run could reclaim, and across how many sections - in ONE place.
 *
 * 🔴 This existed twice, in Home.tsx and in Shell.tsx, and both copies were wrong
 * the same way: they read a RUN's result off a SCAN's summary. `--scan` populates
 * `targets[]` and leaves `estimated_bytes` at 0, and `sections[]` carries only the
 * steps that actually ran - one, for the scan itself. So after a scan that found
 * 63.7 GB across 10 sections, the hero read `0 B` and `across 665 targets in 1
 * sections`, and the primary button offered `Reclaim 0 B` directly above a ladder
 * promising 39.3 GB. Every layout and word check passed it; only reading the
 * numbers against the engine's own output caught it.
 *
 * The dummy settles the semantics and they are not interchangeable
 * (`wire.js:436-442`): the hero and the Reclaim button show the TOTAL reclaimable
 * (`derive.reclaimable()`), the safe-run ladder shows the safe-batch SUBSET
 * (`derive.safeRunBytes()`), and the sub-line counts distinct sections present in
 * the targets (`derive.bySection().length`) - never the sections that ran. So
 * 63.7 GB in the hero beside 39.3 GB in the ladder is correct by design, not a
 * disagreement.
 */

import { idleDaysOf, isCleanupRun, type ProgressEvent, type RunSummary, type ScanTarget } from './cli';
import { type Catalogue, safeRunSections, sectionById } from './catalogue';
import { isExcluded } from './exclusions';
import type { MapTarget } from '../components/ReclaimMap';

/**
 * Total bytes a run could reclaim, or `null` when nothing has been measured.
 *
 * Scan data wins whenever it exists, because it is a measurement of what is on
 * disk now; a dry-run does not change that, and a real run clears the targets it
 * has just deleted.
 */
export function reclaimableBytes(
  summary: RunSummary | null,
  scanTargets: ScanTarget[],
  /**
   * Whether a scan has measured this machine at all - `scannedAt !== null`.
   *
   * 🔴 A SEPARATE FACT from "the list is non-empty", and conflating them was a
   * live defect the moment exclusions existed: the rows handed in here are the
   * INCLUDED ones, so a person who excludes everything hands in an empty array
   * after a real measurement. Reading emptiness as "nothing measured" would have
   * fallen through to the last run's `estimated_bytes` and printed a figure from
   * a different question - a window promising bytes a run would refuse, which is
   * the exact failure `--exclude-path` exists to prevent.
   */
  measured: boolean,
): number | null {
  if (measured) {
    return scanTargets.reduce((total, target) => total + target.bytes, 0);
  }
  if (!summary) return null;
  return summary.estimated_bytes > 0 ? summary.estimated_bytes : summary.freed_bytes;
}

/**
 * How many sections that figure spans.
 *
 * With scan data this is the number of DISTINCT sections holding a target, which
 * is what the reader is being told. Falling back to a run's `sections[]` is
 * correct only in the run case, where those are the sections that produced the
 * bytes being shown.
 */
export function reclaimableSectionCount(
  summary: RunSummary | null,
  scanTargets: ScanTarget[],
  measured: boolean,
): number {
  if (measured) {
    return new Set(scanTargets.map((target) => target.section)).size;
  }
  return summary?.sections.length ?? 0;
}

/** How many targets that figure spans. */
export function reclaimableTargetCount(
  summary: RunSummary | null,
  scanTargets: ScanTarget[],
  measured: boolean,
): number {
  if (measured) return scanTargets.length;
  return summary?.targets.length ?? 0;
}

/**
 * The map's tiles: one per scanned target, coloured by its section's tier and
 * grouped by its section. Every field is the engine's own.
 *
 * Shared because the Run page draws the SAME map, draining - the dummy's
 * "What is going" band, whose hint is "Tiles leave as each section finishes"
 * (`run.html:64-65`). Two mappings would drift apart exactly the way the two
 * copies of `reclaimableBytes` did.
 */
export function toMapTargets(
  catalogue: Catalogue | null,
  scanTargets: ScanTarget[],
  /**
   * The exclusion roots, so each tile knows whether it has been clicked out.
   *
   * 🔴 Home passes the WHOLE scan and lets the flag dim the excluded tiles: the
   * dummy's `mapDataAll` keeps them drawn so "what I turned off" stays visible
   * rather than silently vanishing. The Run screen passes the included targets
   * only, because that map is the "What is going" band and an excluded target is
   * not going - so an empty list here is correct there.
   */
  excludedPaths: readonly string[] = [],
  /** Fixed once per call, so 665 tiles cannot straddle a midnight and disagree. */
  now: number = Date.now(),
): MapTarget[] {
  if (!catalogue) return [];
  return scanTargets.map((target) => {
    const section = sectionById(catalogue, target.section);
    return {
      section: target.section,
      sectionKey: section?.key ?? String(target.section),
      tier: section?.tier ?? 'rebuilds',
      label: target.label,
      path: target.path,
      bytes: target.bytes,
      idleDays: idleDaysOf(target.newest_write_utc, now),
      excluded: isExcluded(target.path, excludedPaths),
    };
  });
}

/**
 * The same tiles with every finished section removed, so the map empties as the
 * run proceeds. A section is gone once the engine has reported its `end` event -
 * the tile leaves when the work is done, not when it starts, because a tile that
 * vanished at `start` would claim the space back before it was freed.
 */
export function drainMapTargets(all: MapTarget[], progress: Record<number, ProgressEvent>): MapTarget[] {
  return all.filter((target) => progress[target.section]?.event !== 'end');
}

/**
 * How much the idle gate is holding back, or `null` when nothing has measured it.
 *
 * 🔴 TWO MEASUREMENTS OF DIFFERENT QUESTIONS, AND THE ANSWER IS THE GAP BETWEEN
 * THEM. A `--scan` reports each target's size ON DISK - `lib/scan.ps1:60-65` sizes
 * it with `Get-DirectoryBytes`, and the scan prints its own caveat saying so:
 * "These are sizes on disk, not what a run would delete: the idle gate keeps
 * recently used files". A `--dry-run` reports `estimated_bytes`, which is what the
 * run WOULD delete with that gate applied. Neither number alone says what the gate
 * kept. Subtracting them does, and it is the only honest source for this figure -
 * which is why it reads "not measured" until a dry-run has actually run.
 *
 * 🔴 DO NOT REPLACE THIS WITH A PER-TARGET IDLE FILTER. The click dummy computes
 * its own held-back figure that way (`db.js` -> `heldByDeveloperMode`: every
 * dev-gated target whose `idle < idleDays`), and now that the 1.2.0 engine reports
 * `targets[].newest_write_utc` the app could copy it - which is exactly the trap.
 * The engine's gate is per FILE inside a target (`lib/actions.ps1:210`, "only
 * files idle $Days+ days go"), so a folder whose newest file is three days old
 * still gives up everything older inside it. A target-level filter would count the
 * whole folder as held and overstate this figure, plausibly, with no way to notice.
 *
 * The four guards below are what make the subtraction like-for-like. Each one, if
 * dropped, yields a number that looks reasonable and is not.
 */
export function heldBackBytes(
  summary: RunSummary | null,
  scanTargets: ScanTarget[],
  catalogue: Catalogue | null,
  developer: boolean,
  /** `scannedAt !== null` - the same separate fact every other figure here reads. */
  measured: boolean,
): number | null {
  if (!measured || !catalogue || !summary || !isCleanupRun(summary)) return null;

  /* 1. It must be a REHEARSAL. A real run's `estimated_bytes` is 0 and its
        `freed_bytes` is what went - subtracting either would print the whole
        subset as "held back" the moment a run finished. */
  if (!summary.dry_run) return null;

  /* 2. It must have covered the WHOLE safe batch. `safeBatchArgs` passes `--all`
        with no sections and `--only` with them, and the engine reports which it
        was in `mode`. A dry-run of two sections from the Sections screen produces
        a small estimate that, subtracted from the whole subset, reads as an
        enormous amount held back. */
  if (summary.mode !== 'all') return null;

  /* 3. Developer mode must not have moved since. The idle gate only applies with
        developer mode ON (`lib/actions.ps1:210`), so an estimate taken with it off
        and read with it on reports a gap that is really a change of setting. The
        engine sends this back as a boolean or its own word, so both are read. */
  const ranAsDeveloper =
    typeof summary.developer === 'boolean' ? summary.developer : summary.developer === 'true';
  if (ranAsDeveloper !== developer) return null;

  /* 4. The subset is the SAFE BATCH, because that is what the rehearsal covered -
        and the included targets only, because the rehearsal carried the same
        `--exclude-path` flags. Comparing the whole scan against a safe-batch
        estimate would count every deep and interactive section as held back. */
  const safe = new Set(safeRunSections(catalogue, developer).map((section) => section.id));
  const subset = scanTargets
    .filter((target) => safe.has(target.section))
    .reduce((total, target) => total + target.bytes, 0);

  /* Clamped at zero. The two figures come from two separate walks of a live disk,
     so an estimate can legitimately exceed a slightly older scan - and a negative
     "held back" is not a smaller number, it is a nonsense one. Zero is the honest
     floor: the gate is demonstrably holding nothing back that this pair can see. */
  return Math.max(0, subset - summary.estimated_bytes);
}
