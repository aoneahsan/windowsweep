/**
 * Home zone 5 - the safe run, step by step. `index.html:135-144`, `wire.js:223-276`.
 *
 * A LADDER with a per-rung total, not a flat list: the point of the band is the
 * shape of a run - which step frees the most, and how much the tail is worth. The
 * app had a flat list of section titles here, which carries neither.
 *
 * 🔴 The rungs are the engine's own `safe_batch`, in its own order, and a figure
 * appears only where a scan measured one. Before a scan there is no number to
 * show and none is invented; the steps are still real, so the ladder still tells
 * a person what a safe run would touch.
 *
 * Four rungs shown and the rest one click away is the dummy's own decision
 * (`wire.js:229-234`): eight made this column twice the height of the one beside
 * it and left a block of dead space under Developer mode.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';

export interface LadderRow {
  id: number;
  key: string;
  /** null until a scan has measured this section. */
  bytes: number | null;
  /** null until a scan has measured this section. */
  count: number | null;
}

/** `wire.js:232` - four is enough to show the shape. */
const SHOWN = 4;

function Rung({ row, max }: { row: LadderRow; max: number }) {
  const { t } = useTranslation();
  return (
    <div className="rung">
      <div>
        <div className="t-sm">{row.key}</div>
        <div className="t-xs ink-3">
          {row.count === null ? t('home.ladderUnmeasured') : t('home.ladderTargets', { count: row.count })}
        </div>
      </div>
      <div className="num t-sm">
        {row.bytes === null ? t('home.ladderUnmeasured') : formatBytes(row.bytes)}
      </div>
      {row.bytes === null ? null : (
        <div className="rung-bar">
          <i style={{ width: `${((row.bytes / max) * 100).toFixed(1)}%` }} />
        </div>
      )}
    </div>
  );
}

export function SafeRunLadder({ rows, measured }: { rows: LadderRow[]; measured: boolean }) {
  const { t } = useTranslation();

  const shown = rows.slice(0, SHOWN);
  const rest = rows.slice(SHOWN);
  const max = rows[0]?.bytes ?? 1;
  const restBytes = rest.reduce((sum, r) => sum + (r.bytes ?? 0), 0);
  const total = rows.reduce((sum, r) => sum + (r.bytes ?? 0), 0);

  return (
    <div className="panel pad">
      {rows.length === 0 ? (
        <p className="t-sm ink-3">{t('home.ladderEmpty')}</p>
      ) : (
        <>
          <div className="ladder">
            {shown.map((row) => (
              <Rung row={row} max={max} key={row.id} />
            ))}
            {rest.length > 0 ? (
              <details className="ladder-more">
                <summary>
                  <span>{t('home.ladderMore', { count: rest.length })}</span>
                  <span className="num accent-ink">
                    {measured ? formatBytes(restBytes) : t('home.ladderUnmeasured')}
                  </span>
                </summary>
                {rest.map((row) => (
                  <div className="rung-mini" key={row.id}>
                    <span className="t-sm">{row.key}</span>
                    <span className="num t-sm ink-2">
                      {row.bytes === null ? t('home.ladderUnmeasured') : formatBytes(row.bytes)}
                    </span>
                  </div>
                ))}
              </details>
            ) : null}
          </div>
          <div className="ladder-total">
            <span className="t-sm ink-2">{t('home.ladderTotal')}</span>
            <span className="num t-md wide accent-ink">
              {measured ? formatBytes(total) : t('home.ladderUnmeasured')}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
