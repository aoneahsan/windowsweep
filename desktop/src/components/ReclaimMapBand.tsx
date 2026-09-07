/**
 * Home zone 3 - the reclaim map band. `index.html:69-92`.
 *
 * The map itself is `ReclaimMap`; this is the label, the tier legend, the same
 * data as a table, and the two things the dummy specifies here that this build
 * cannot honour. Both are declared rather than dropped:
 *
 *  - `pending.mapIdle`    (pending-wave) the idle shading and the Idle column
 *  - `pending.mapExclude` (pending-wave) clicking a tile to keep it
 *
 * 🔴 The second one is why the tiles are inert. The engine's `--exclude-path` is
 * read by `modules/projects.ps1` and by nothing else, so it cannot keep an npm or
 * browser cache out of a safe run - and a tile that looked as though it had been
 * kept, then was deleted anyway, is the worst of the three options.
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ReclaimMap, ReclaimMapTable, type MapTarget } from './ReclaimMap';
import type { SectionTier } from '../lib/catalogue';

/** The tiers present in the drawn data, in the dummy's risk order (`seed.js:18-25`). */
const TIER_ORDER: SectionTier[] = ['config', 'report', 'rebuilds', 'slow', 'recycle', 'permanent'];

export function ReclaimMapBand({ targets, measured }: { targets: MapTarget[]; measured: boolean }) {
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

        <ReclaimMap targets={targets} measured={measured} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--sp-4)',
            alignItems: 'center',
            marginTop: 'var(--sp-3)',
          }}
        >
          {/* `wire.js:74-92`. The second channel's row is replaced by the
              declaration below, because explaining an encoding that is not
              varying would be worse than not drawing it. */}
          <div className="tm-legend">
            {tiers.map((tier) => (
              <span className={`tier tier-${tier}`} key={tier}>
                <span className="t-xs ink-3">{`${tier} – ${t(`home.tier.${tier}`)}`}</span>
              </span>
            ))}
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

        {/* The two stated gaps, per §10a's `pending-wave` exemption. */}
        <p className="t-xs ink-3" style={{ marginTop: 'var(--sp-3)' }}>{t('pending.mapIdle')}</p>
        <p className="t-xs ink-3" style={{ marginTop: 'var(--sp-2)' }}>{t('pending.mapExclude')}</p>
      </div>
    </section>
  );
}
