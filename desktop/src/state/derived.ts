/**
 * What the screens read OUT of the store: the few derivations with more than one
 * reader, each built from atomic selectors.
 *
 * 🔴 Lifted out of `state/store.ts` when that file neared the project's 500-line
 * ceiling, the same move `lib/engine-args.ts` records - verbatim, reasoning
 * included. The store holds facts and the actions that change them; this file
 * holds what is computed from them, so neither grows into the other.
 */

import { useMemo } from 'react';

import { includedOnly } from '../lib/exclusions';
import { heldBackBytes, recentDeveloperCaches, safeRunBytes } from '../lib/reclaim';
import { heldBackApplies, isCurrentRehearsal, reclaimOffer, type ReclaimOffer } from '../lib/rehearsal';
import type { RunPreferences } from '../lib/engine';
import type { ScanTarget } from '../lib/cli';
import { useStore } from './store';

/**
 * Every preference a run carries, read in one line.
 *
 * 🔴 Four atomic subscriptions rather than one selector returning an object: a
 * selector that builds a new object every call re-renders on every unrelated store
 * change, and the log pane appends thousands of lines during a purge. Each field
 * here is compared by value, so a screen re-renders when a preference moves and
 * not when the log does.
 *
 * 🔴 The idle window is ONE field with two readers - Home's control and Settings'
 * control set the same `idleDays`, never a copy each. Two copies of a number a
 * person can edit in two places is how a window ends up showing 100 beside a run
 * that used 30.
 */
export function useRunPreferences(): RunPreferences {
  const developer = useStore((s) => s.developer);
  const idleDays = useStore((s) => s.idleDays);
  const tempDays = useStore((s) => s.tempDays);
  const largeFileMb = useStore((s) => s.largeFileMb);
  return { developer, idleDays, tempDays, largeFileMb };
}

/**
 * The measured targets a run would ACTUALLY touch: everything the last `--scan`
 * found, minus what the person has clicked out of it.
 *
 * 🔴 ONE derivation, and it is the one every figure reads - the hero number, the
 * Reclaim button, the safe-run ladder, the Sections table and total, the per-
 * section rows and the status bar. The recorded failure it exists to prevent is
 * `reclaimableBytes`, which lived in two files and was wrong the same way in both;
 * a second copy of this filter would be that defect again, in a place where being
 * wrong means the window promising more than the run delivers.
 *
 * 🔴 THE ONE DELIBERATE EXCEPTION IS HOME'S MAP, which draws the excluded tiles
 * too, dimmed, so "what I turned off" stays visible instead of silently vanishing
 * (`reclaim-map.js` -> `mapDataAll`). It reads `scanTargets` directly and carries
 * the flag per tile; nothing else may.
 */
export function useIncludedScanTargets(): ScanTarget[] {
  const scanTargets = useStore((s) => s.scanTargets);
  const excludedPaths = useStore((s) => s.excludedPaths);
  return useMemo(() => includedOnly(scanTargets, excludedPaths), [scanTargets, excludedPaths]);
}

/**
 * What developer mode is holding back right now - `lib/reclaim.ts` ->
 * `heldBackBytes`, read once for its three readers: Home's "Held back right now",
 * the consequence line under Settings' developer switch, and the Reclaim button's
 * bound. Several call sites assembling the same inputs is how one of them ends up
 * passing the whole scan.
 *
 * 🔴 Measured by the last rehearsal, and only while developer mode, the idle window
 * and the exclusions are still the ones it ran with (`lib/rehearsal.ts` ->
 * `heldBackApplies`, which says why each of the three matters).
 */
export function useHeldBackBytes(): number | null {
  const rehearsal = useStore((s) => s.rehearsal);
  const catalogue = useStore((s) => s.catalogue);
  const scannedAt = useStore((s) => s.scannedAt);
  const excludedPaths = useStore((s) => s.excludedPaths);
  const prefs = useRunPreferences();
  const includedTargets = useIncludedScanTargets();
  const applies = heldBackApplies(rehearsal, prefs, excludedPaths);
  return heldBackBytes(
    applies ? rehearsal.summary : null,
    includedTargets,
    catalogue,
    prefs.developer,
    scannedAt !== null,
  );
}

/**
 * What the Reclaim button and the Run screen's idle hero carry (D-60): the last
 * rehearsal's estimate while it ran with the current arguments, otherwise the
 * measured safe-batch total less what is held back, worded as the bound it is.
 * `null` until a scan has measured - "Scan first" / "not measured".
 */
export function useReclaimOffer(): ReclaimOffer | null {
  const rehearsal = useStore((s) => s.rehearsal);
  const catalogue = useStore((s) => s.catalogue);
  const scannedAt = useStore((s) => s.scannedAt);
  const excludedPaths = useStore((s) => s.excludedPaths);
  const prefs = useRunPreferences();
  const includedTargets = useIncludedScanTargets();
  const heldBack = useHeldBackBytes();
  return reclaimOffer({
    safeTotal: safeRunBytes(catalogue, includedTargets, scannedAt !== null),
    heldBack,
    current: isCurrentRehearsal(rehearsal, prefs, excludedPaths) ? rehearsal : null,
  });
}

/**
 * How many developer caches were used inside the idle window - the count under
 * "Held back right now" (`index.html`'s `devHeldN`). `lib/reclaim.ts` ->
 * `recentDeveloperCaches` says what it counts and what it cannot see.
 */
export function useRecentDeveloperCaches(): number | null {
  const catalogue = useStore((s) => s.catalogue);
  const developer = useStore((s) => s.developer);
  const idleDays = useStore((s) => s.idleDays);
  const scannedAt = useStore((s) => s.scannedAt);
  const includedTargets = useIncludedScanTargets();
  return recentDeveloperCaches(catalogue, includedTargets, developer, idleDays, scannedAt !== null);
}
