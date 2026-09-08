/**
 * Home zone 3 - the reclaim map band. `index.html:69-92`.
 *
 * The map itself is `ReclaimMap`; this is the label, the tier legend, the idle
 * ramp, the same data as a table, and the exclusion controls.
 *
 * 🔴 The two `pending-wave` declarations that stood here are GONE, because the
 * capabilities they declared are built. `pending.mapIdle` said the scan reported a
 * size and no age; the 1.2.0 engine reports `targets[].newest_write_utc`.
 * `pending.mapExclude` said `--exclude-path` reached one section out of
 * twenty-six; it is now enforced inside `Get-ProtectionReason`, the guard every
 * chokepoint calls, so it holds everywhere. A shipped capability still advertising
 * itself as pending is the worse of the two errors.
 *
 * 🔴 CLICKING A TILE DELETES NOTHING - it decides what a deletion SKIPS, so its
 * failure mode is a person believing a folder is protected when it is not. Three
 * things make that legible and all three are here or one hop away: the tile itself
 * dims, this band counts what is kept, and the Run screen shows the engine's own
 * `excluded[]` - what the run actually refused, rather than what was asked.
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ReclaimMap, ReclaimMapTable, type MapTarget } from './ReclaimMap';
import { controlState, stateOf } from '../lib/control-state';
import type { SectionTier } from '../lib/catalogue';

/** The tiers present in the drawn data, in the dummy's risk order (`seed.js:18-25`). */
const TIER_ORDER: SectionTier[] = ['config', 'report', 'rebuilds', 'slow', 'recycle', 'permanent'];

export function ReclaimMapBand({
  targets,
  measured,
  excludedCount,
  onToggleExcluded,
  onClearExclusions,
  clearedRecently,
}: {
  targets: MapTarget[];
  measured: boolean;
  /** How many of the drawn targets are kept out of the next run. */
  excludedCount: number;
  onToggleExcluded: (path: string) => void;
  onClearExclusions: () => void;
  /** Drives the tick on the clear button - the acknowledgement at the control. */
  clearedRecently: boolean;
}) {
  const { t } = useTranslation();

  const tiers = useMemo(() => {
    const present = new Set(targets.filter((x) => x.bytes > 0).map((x) => x.tier));
    return TIER_ORDER.filter((tier) => present.has(tier));
  }, [targets]);

  return (
    <section className="band band-well">
      <div className="wrap rise">
        <div className="zone-label">
          <span className="caps">{t('home.mapTitle')}</span>
          <span className="t-xs ink-3" style={{ flex: 'none' }}>{t('home.mapHint')}</span>
        </div>

        <ReclaimMap targets={targets} measured={measured} onToggle={onToggleExcluded} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--sp-4)',
            alignItems: 'center',
            marginTop: 'var(--sp-3)',
          }}
        >
          {/* `wire.js:86-107`: the tier hues, then the idle ramp. The ramp row is
              back because the channel it explains now varies - an encoding nobody
              can read is worse than no encoding, and so is a key to an encoding
              that is not there. */}
          <div className="tm-legend">
            {tiers.map((tier) => (
              <span className={`tier tier-${tier}`} key={tier}>
                <span className="t-xs ink-3">{`${tier} – ${t(`home.tier.${tier}`)}`}</span>
              </span>
            ))}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <span
                aria-hidden="true"
                style={{
                  width: '56px',
                  height: '9px',
                  borderRadius: '2px',
                  background:
                    'linear-gradient(90deg, color-mix(in oklab, var(--c-accent) 34%, var(--c-well)), var(--c-accent))',
                }}
              />
              <span className="t-xs ink-3">{t('home.mapIdleRamp')}</span>
            </span>
          </div>

          {/* `index.html:90-94` - what is kept, and the way back. */}
          <div
            style={{
              marginInlineStart: 'auto',
              display: 'flex',
              gap: 'var(--sp-2)',
              alignItems: 'center',
            }}
          >
            {/* 🔴 `aria-live="polite"`: clicking a tile changes this count and
                nothing else a screen reader would notice, so without it the whole
                acknowledgement is visual. */}
            <span className="t-xs ink-3" aria-live="polite">
              {excludedCount === 0
                ? t('home.mapExcludedNone')
                : t('home.mapExcludedCount', { count: excludedCount })}
            </span>
            <button
              className="btn btn-sm btn-ghost"
              type="button"
              onClick={onClearExclusions}
              disabled={excludedCount === 0}
              {...controlState(stateOf(false, clearedRecently))}
            >
              <span className="btn-label">{t('home.mapIncludeEverything')}</span>
            </button>
          </div>
        </div>

        <details style={{ marginTop: 'var(--sp-3)' }}>
          <summary className="t-xs ink-3" style={{ cursor: 'pointer' }}>
            {t('home.mapTableSummary')}
          </summary>
          <div
            className="xscroll"
            style={{ maxHeight: '20rem', overflowY: 'auto', marginTop: 'var(--sp-2)' }}
          >
            <ReclaimMapTable targets={targets} />
          </div>
        </details>
      </div>
    </section>
  );
}
