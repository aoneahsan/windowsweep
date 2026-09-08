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
 */
export function ReclaimMapTable({ targets }: { targets: MapTarget[] }) {
  const { t } = useTranslation();
  const rows = targets.filter((x) => x.bytes > 0);
  return (
    <table className="tbl">
      <thead>
        <tr>
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
