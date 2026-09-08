/**
 * The reclaim map's data shapes and its pure geometry - everything that has an
 * answer before React is involved.
 *
 * Lifted out of `ReclaimMap.tsx` when that file crossed the project's 500-line
 * ceiling. The split is along a real seam rather than a convenient line count:
 * nothing here touches the DOM, so the frame, the colour ramp and the hierarchy
 * can be reasoned about - and corrected against `reclaim-map.js` - without reading
 * a component.
 */

import { scaleLinear } from 'd3-scale';

import type { SectionTier } from '../lib/catalogue';

/** One target, as the map needs it. Every field comes from the engine. */
export interface MapTarget {
  section: number;
  /** The section's own key from the catalogue - the engine's vocabulary. */
  sectionKey: string;
  tier: SectionTier;
  label: string;
  path: string;
  bytes: number;
  /** Whole days since the newest write under it, or null when it has no stamp. */
  idleDays: number | null;
  /** Kept out of the next run by this person. Drawn dimmed, never hidden. */
  excluded: boolean;
}

export interface Leaf {
  name: string;
  path: string;
  value: number;
  section: number;
  tier: SectionTier;
  idleDays: number | null;
  excluded: boolean;
  children?: undefined;
}
export interface Group {
  name: string;
  section: number;
  tier: SectionTier;
  path?: undefined;
  value?: undefined;
  children: Leaf[];
}
export interface Root {
  name: string;
  path?: undefined;
  value?: undefined;
  section?: undefined;
  tier?: undefined;
  children: Group[];
}
export type MapNode = Root | Group | Leaf;

/** Room for the section label strip. `reclaim-map.js:34`. */
export const PAD_TOP = 19;

/** Portrait below 700px, landscape above. `reclaim-map.js:31-33`. */
export function frameFor(px: number): { w: number; h: number } {
  return px > 0 && px < 700 ? { w: 620, h: 760 } : { w: 1000, h: 340 };
}

/**
 * Interpolate between the tier's OWN two ends, never toward the page surface -
 * mixing toward the background is what produced mud. `reclaim-map.js:56-59`.
 */
export function tierColour(tier: SectionTier, pct: number): string {
  return `color-mix(in oklab, var(--c-tier-${tier}-hi) ${String(pct)}%, var(--c-tier-${tier}-lo))`;
}

/** Where one tile sits on the idle ramp, 0 = used recently, 100 = long idle. */
export type IdleScale = (idleDays: number | null) => number;

/**
 * The idle ramp, re-solved from THIS data. `reclaim-map.js:162-167`.
 *
 * 🔴 The domain is the REACHABLE range, not [0, 365]: a machine whose oldest cache
 * is 60 days should still get the whole ramp. When every tile has the same age -
 * or none has a stamp at all - `hi > lo` is false and every tile takes 100, the
 * tier's solid end, which is precisely the branch this app used while the second
 * channel had no data.
 */
export function idleScaleFor(leaves: readonly Leaf[]): IdleScale {
  const days = leaves.map((leaf) => leaf.idleDays).filter((d): d is number => d !== null);
  if (days.length === 0) return () => 100;
  const lo = Math.min(...days);
  const hi = Math.max(...days);
  if (hi <= lo) return () => 100;
  const scale = scaleLinear().domain([lo, hi]).range([0, 1]).clamp(true);
  return (idleDays) => {
    /* A target with no stamp is not "brand new" - it is unmeasured, and painting
       it at the faded end would read as a fresh cache. It takes the solid end,
       the same value the whole map takes when nothing is datable. */
    if (idleDays === null) return 100;
    return Math.round(100 * Math.max(0, Math.min(1, scale(idleDays))));
  };
}

/** `reclaim-map.js:66-70`. */
export function fitText(text: string, widthPx: number, fontPx: number): string {
  const max = Math.floor((widthPx - 12) / (fontPx * 0.56));
  if (max < 3) return '';
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

export function buildRoot(targets: MapTarget[]): Root {
  const groups = new Map<number, MapTarget[]>();
  for (const target of targets) {
    if (target.bytes <= 0) continue;
    const list = groups.get(target.section);
    if (list) list.push(target);
    else groups.set(target.section, [target]);
  }
  return {
    name: 'reclaimable',
    children: [...groups.entries()].map(([section, list]) => ({
      name: list[0]?.sectionKey ?? String(section),
      section,
      tier: list[0]?.tier ?? 'rebuilds',
      children: list.map((t) => ({
        name: t.label,
        path: t.path,
        value: t.bytes,
        section: t.section,
        tier: t.tier,
        idleDays: t.idleDays,
        excluded: t.excluded,
      })),
    })),
  };
}
