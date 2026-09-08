/**
 * Home zone 4 - the drive rails. `index.html:109-113`, `wire.js` -> `renderDrives`.
 *
 * 🔴 THE `pending.drives` DECLARATION THAT STOOD HERE IS GONE, because the
 * capability is built. It said: "A run reports what it reclaimed, and nothing about
 * your drives or how much room is left on them, so this window has no measured
 * figure to draw." Half of that is still true - the engine's `--json` summary
 * carries no drive field at all - and the other half stopped being a reason once
 * `list_drives` asked Windows instead. A shipped capability still advertising
 * itself as pending is the worse of the two errors.
 *
 * 🔴 ONE STACKED RAIL PER DRIVE, which is the whole design argument the dummy
 * records beside this zone: "Three separate percentage cards - which is what
 * direction 01 shipped - cannot show the reclaimable slice at all."
 *
 * 🔴 The reclaimable slice is ATTRIBUTED from the scan's own target paths, never
 * apportioned across drives by a share (`lib/drives.ts` -> `driveRows`). A number
 * spread by a ratio would look exactly as convincing and be made up.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import { railWidths, type DriveRow } from '../lib/drives';

/** The dummy's three legend swatches, in its own order and its own words. */
const LEGEND: { key: string; fill: string }[] = [
  { key: 'home.drivesLegendUsed', fill: 'color-mix(in oklab, var(--c-ink) 34%, transparent)' },
  { key: 'home.drivesLegendReclaimable', fill: 'var(--c-accent)' },
  { key: 'home.drivesLegendFree', fill: 'color-mix(in oklab, var(--c-ink) 10%, transparent)' },
];

export function HomeDrives({
  rows,
  /** `null` while the first answer is still on its way from the Rust side. */
  loading,
}: {
  rows: DriveRow[];
  loading: boolean;
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="panel pad">
        <p className="t-sm ink-3">{t('common.loading')}</p>
      </div>
    );
  }
  /* No fixed drive at all is not a state this band can describe, and the dummy
     owns no words for it. On Windows it cannot happen - `list_drives` enumerates
     every fixed volume - so rather than invent a sentence, the band renders
     nothing and the column below it closes up. */
  if (rows.length === 0) return null;

  return (
    <div className="panel pad">
      {rows.map((row) => {
        const { usedPct, reclaimablePct } = railWidths(row);
        return (
          <div className="drive" key={row.letter}>
            {/* The dummy's own convention: the letter carries its colon. The Rust
                side sends a bare letter so the two sides cannot disagree about
                whether it is included. */}
            <span className="drive-name">{`${row.letter}:`}</span>

            <div className="cap">
              <i className="cap-seg cap-used" style={{ width: `${String(usedPct)}%` }} />
              {/* `pulse` is the dummy's own class on this segment - the one moving
                  thing in the band, and it is the thing the page is about. */}
              <i
                className="cap-seg cap-recl pulse"
                style={{ width: `${String(reclaimablePct)}%` }}
                title={
                  row.reclaimableBytes === null
                    ? undefined
                    : t('home.driveRailTitle', {
                        amount: formatBytes(row.reclaimableBytes),
                        letter: row.letter,
                      })
                }
              />
            </div>

            <div className="t-xs" style={{ textAlign: 'end', whiteSpace: 'nowrap' }}>
              <div className="num">{t('home.driveFree', { amount: formatBytes(row.freeBytes) })}</div>
              {/* 🔴 `not measured`, never `+0 B`. A drive nobody has scanned and a
                  drive with nothing on it are different facts, and `+0 B` asserts
                  the second one. It is the word the hero and the ladder already use
                  for the same distinction. */}
              <div className="num accent-ink">
                {row.reclaimableBytes === null
                  ? t('home.notMeasured')
                  : t('home.driveReclaimable', { amount: formatBytes(row.reclaimableBytes) })}
              </div>
            </div>
          </div>
        );
      })}

      <p
        className="t-xs ink-3"
        style={{ marginTop: 'var(--sp-4)', display: 'flex', gap: 'var(--sp-3)' }}
      >
        {LEGEND.map((item) => (
          <span key={item.key} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <i
              aria-hidden="true"
              style={{ width: '9px', height: '9px', borderRadius: '2px', background: item.fill }}
            />
            <span>{t(item.key)}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
