import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import type { MapTarget } from './reclaim-map-model';

/**
 * The accessible table carrying the same data - the primary accessible
 * representation, not a consolation prize. `reclaim-map.js:402-429`.
 *
 * 🔴 All five of the dummy's columns, including `Idle (days)`. That column was the
 * visible half of the map's second channel having no data: a tile's shading is
 * hard to read precisely, and this is where the number itself lives. A target the
 * engine gave no timestamp for prints the em dash the rest of this app uses for an
 * absent measurement, never a zero - `0` here would read as "used today".
 *
 * 🔴 AND IT CARRIES THE CONTROL, not just the data (TASK-009). Keeping a target out
 * of the next run used to be possible only by clicking its tile, and the tiles stopped
 * being keyboard-reachable the moment `role="img"` was fixed - `role="img"` had been
 * discarding their 28 accessible names while leaving all 28 tab stops in place. So
 * the first column is a real switch per row: labelled with the target and its size,
 * in DOM order, and writing through the same `onToggle` the tile calls, so the two
 * views of one fact cannot disagree.
 *
 * 🔴 `onToggle` is OPTIONAL and the column is omitted without it, never rendered
 * inert. The Run screen's map is a drain animation over targets that are already
 * going; a switch there would offer to keep something the engine has been told to
 * delete.
 */
export function ReclaimMapTable({
  targets,
  onToggle,
}: {
  targets: MapTarget[];
  onToggle?: (path: string) => void;
}) {
  const { t } = useTranslation();
  const rows = targets.filter((x) => x.bytes > 0);
  return (
    <table className="tbl">
      <thead>
        <tr>
          {onToggle ? <th>{t('home.mapColInRun')}</th> : null}
          <th>{t('home.mapColSection')}</th>
          <th>{t('home.mapColTarget')}</th>
          <th>{t('home.mapColPath')}</th>
          <th className="num-cell">{t('home.mapColSize')}</th>
          <th className="num-cell">{t('home.mapColIdle')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.path} data-excluded={row.excluded ? 'true' : 'false'}>
            {onToggle ? (
              <td>
                {/* 🔴 `aria-checked` is INCLUDED, not excluded: the column asks
                    "is this in the run?", and a switch whose label and whose state
                    run in opposite directions is read wrong by everyone. */}
                <button
                  className="switch"
                  type="button"
                  role="switch"
                  aria-checked={!row.excluded}
                  aria-label={t('home.mapRowAria', {
                    name: row.label,
                    amount: formatBytes(row.bytes),
                  })}
                  style={{ ['--sw-w' as string]: 'calc(1.9rem * var(--density))' }}
                  onClick={() => { onToggle(row.path); }}
                />
              </td>
            ) : null}
            <td>{row.sectionKey}</td>
            <td>{row.label}</td>
            <td className="mono t-2xs">{row.path}</td>
            <td className="num-cell">{formatBytes(row.bytes)}</td>
            <td className="num-cell">{row.idleDays === null ? '—' : String(row.idleDays)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
