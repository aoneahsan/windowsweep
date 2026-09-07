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

import type { ProgressEvent, RunSummary, ScanTarget } from './cli';
import { type Catalogue, sectionById } from './catalogue';
import type { MapTarget } from '../components/ReclaimMap';

/**
 * Total bytes a run could reclaim, or `null` when nothing has been measured.
 *
 * Scan data wins whenever it exists, because it is a measurement of what is on
 * disk now; a dry-run does not change that, and a real run clears the targets it
 * has just deleted.
 */
export function reclaimableBytes(summary: RunSummary | null, scanTargets: ScanTarget[]): number | null {
  if (scanTargets.length > 0) {
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
export function reclaimableSectionCount(summary: RunSummary | null, scanTargets: ScanTarget[]): number {
  if (scanTargets.length > 0) {
    return new Set(scanTargets.map((target) => target.section)).size;
  }
  return summary?.sections.length ?? 0;
}

/** How many targets that figure spans. */
export function reclaimableTargetCount(summary: RunSummary | null, scanTargets: ScanTarget[]): number {
  if (scanTargets.length > 0) return scanTargets.length;
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
export function toMapTargets(catalogue: Catalogue | null, scanTargets: ScanTarget[]): MapTarget[] {
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
