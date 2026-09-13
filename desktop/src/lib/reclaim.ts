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
 * The hero reads the TOTAL reclaimable (`derive.reclaimable()`, `wire.js:436`) and
 * the sub-line counts distinct sections present in the targets
 * (`derive.bySection().length`) - never the sections that ran.
 *
 * 🔴 THE RECLAIM BUTTON AND THE RUN SCREEN'S HERO READ WHAT THE SAFE RUN FREES -
 * `safeRunBytes` below, the same figure the ladder totals. They used to carry the
 * total, so on this machine the button read `Reclaim 53.6 GB` over a run the
 * ladder expected to free 11.5 GB: a button labelled with an amount the action
 * does not deliver. The dummy never decided between the two because its seed makes
 * them equal (every seeded target sits in a safe-batch section); the button's own
 * word, "Reclaim", decides it - the number is what pressing it reclaims. Decided by
 * the main session on GATE 4 round 7 and recorded in `design/README.md`.
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

/**
 * What a safe run would free, or `null` when nothing has been measured - the
 * figure the ladder totals, the Reclaim button carries and the Run screen's idle
 * hero shows. ONE derivation for all three, for the reason this file exists.
 *
 * Every included target whose section is in the engine's own `safe_batch`, at the
 * size the scan measured on disk. With developer mode ON the engine keeps recent
 * files inside the dev caches, so this is the ceiling of what goes; what the idle
 * gate keeps is `heldBackBytes`, shown beside it rather than subtracted from it,
 * because that figure needs a dry-run and this one must not wait for one.
 */
export function safeRunBytes(
  catalogue: Catalogue | null,
  scanTargets: ScanTarget[],
  /** `scannedAt !== null` - the same separate fact every other figure here reads. */
  measured: boolean,
): number | null {
  if (!measured || !catalogue) return null;
  const safe = new Set(safeRunSections(catalogue).map((section) => section.id));
  return scanTargets
    .filter((target) => safe.has(target.section))
    .reduce((total, target) => total + target.bytes, 0);
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

/** The safe batch's developer sections - the only place developer mode's gate applies. */
function developerSafeSections(catalogue: Catalogue): Set<number> {
  return new Set(safeRunSections(catalogue).filter((section) => section.dev).map((section) => section.id));
}

/**
 * How much developer mode's idle gate is holding back: `0` with developer mode off,
 * and `null` while nothing has measured it.
 *
 * 🔴 TWO MEASUREMENTS OF DIFFERENT QUESTIONS, AND THE ANSWER IS THE GAP BETWEEN
 * THEM. A `--scan` reports each target's size ON DISK - `lib/scan.ps1:60-65` sizes
 * it with `Get-DirectoryBytes`, and the scan prints its own caveat saying so:
 * "These are sizes on disk, not what a run would delete: the idle gate keeps
 * recently used files". A `--dry-run` reports what the run WOULD delete with that
 * gate applied. Neither number alone says what the gate kept; the gap does.
 *
 * 🔴 PER DEVELOPER SECTION, NEVER THE WHOLE BATCH (GATE 4 round 7, owner item 3b).
 * This used to subtract the dry-run's TOTAL estimate from the whole safe batch, and
 * the batch holds gates developer mode does not own: section 10's temp files are
 * pruned by `--temp-days` whatever developer mode says
 * (`modules/windows_user.ps1:72`), logs go on their own fixed windows, and a
 * running browser skips its cache target outright. Every one of those read as
 * "held back" by a switch that has nothing to do with them. The engine's
 * developer gate lives on targets flagged `-Dev` (`lib/actions.ps1:130`), and those
 * sit only in the catalogue's developer sections, so the gap is taken section by
 * section there: the dry-run records each section's own estimate in
 * `sections[].freed_bytes` (`lib/log.ps1` -> `Add-Freed` adds to `SectionFreed` in a
 * dry-run too). What remains inside is developer mode's doing - the idle window and
 * the newest version it keeps - plus a few logs those sections prune on short
 * fixed windows, which are small and are said here rather than hidden.
 *
 * 🔴 DO NOT REPLACE THIS WITH A PER-TARGET IDLE FILTER. The click dummy computes
 * its own held-back figure that way (`db.js` -> `heldByDeveloperMode`), which
 * counts a folder whose newest file is three days old as held back in full - while
 * the engine's gate is per FILE (`lib/actions.ps1:210`, "only files idle $Days+
 * days go") and gives up everything older inside it.
 *
 * The guards below are what keep the subtraction like-for-like. Each one, if
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
  /* 🔴 OFF HOLDS NOTHING BACK, and that is a definition rather than a
     measurement: with developer mode off the engine clears every dev cache
     completely (`lib/actions.ps1:130`). */
  if (!developer) return 0;
  if (!measured || !catalogue || !summary || !isCleanupRun(summary)) return null;

  /* 1. It must be a REHEARSAL. A real run's per-section figure is what went, and
        subtracting that would print everything that remained as "held back". */
  if (!summary.dry_run) return null;

  /* 2. Developer mode must not have moved since. The idle gate only applies with it
        ON, so an estimate taken with it off reports a gap that is really a change
        of setting. The engine sends this back as a boolean or its own word. */
  const ranAsDeveloper =
    typeof summary.developer === 'boolean' ? summary.developer : summary.developer === 'true';
  if (!ranAsDeveloper) return null;

  /* 3. The rehearsal must have run EVERY developer section of the safe batch - the
        whole batch, or a Sections dry-run that included them. A section it did not
        run has no estimate, and a partial figure would read as the whole of it. */
  const estimate = new Map(
    summary.sections.filter((step) => step.status === 'dry-run').map((step) => [step.section, step.freed_bytes]),
  );
  const developerSections = [...developerSafeSections(catalogue)];
  if (developerSections.some((id) => !estimate.has(id))) return null;

  /* 4. The included targets only, because the rehearsal carried the same
        `--exclude-path` flags. Clamped at zero per section: the two walks of a live
        disk are minutes apart, and a negative "held back" is a nonsense one. */
  let held = 0;
  for (const id of developerSections) {
    const onDisk = scanTargets
      .filter((target) => target.section === id)
      .reduce((total, target) => total + target.bytes, 0);
    held += Math.max(0, onDisk - (estimate.get(id) ?? 0));
  }
  return held;
}

/**
 * How many developer caches were used inside the idle window - the dummy's
 * "N caches used in the last M days" under "Held back right now", or `null` before
 * a scan has measured anything.
 *
 * Counted over the same developer sections as `heldBackBytes`, from the one fact
 * the 1.2.0 scan reports per target: the newest write anywhere under it. A cache
 * written inside the window holds back at least that much, which is the sentence's
 * whole claim. ⚠️ The engine's gate also reads access and creation times, which the
 * scan does not report, so a cache only READ recently counts as idle here - the
 * count can be low, never high.
 */
export function recentDeveloperCaches(
  catalogue: Catalogue | null,
  scanTargets: ScanTarget[],
  developer: boolean,
  idleDays: number,
  measured: boolean,
  /** Fixed once per call, so the count cannot straddle a midnight. */
  now: number = Date.now(),
): number | null {
  if (!measured || !catalogue) return null;
  if (!developer) return 0;
  const developerSections = developerSafeSections(catalogue);
  return scanTargets.filter((target) => {
    if (target.bytes <= 0 || !developerSections.has(target.section)) return false;
    const idle = idleDaysOf(target.newest_write_utc, now);
    return idle !== null && idle < idleDays;
  }).length;
}
