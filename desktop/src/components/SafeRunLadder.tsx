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
 *
 * 🔴 THE TOTAL IS HANDED IN, NOT SUMMED HERE. It is the same number the Reclaim
 * button carries, so "Total a safe run would free" and the button that starts that
 * run cannot print two different figures.
 *
 * 🔴 AND SINCE D-61 (GATE 4 round 10) THAT IS TRUE AGAIN, WHICH IT HAD STOPPED
 * BEING. The total was `safeRunBytes` - the measured size on disk - while D-60 had
 * moved the button to the engine's own estimate, so round 10 read *"Total a safe
 * run would free 34.2 GB"* directly under *"Reclaim 1.9 GB"*: this header's own
 * invariant, broken by the fix one band above it. The rungs, the roll-up and the
 * total are now all `runFigures` (`lib/rehearsal.ts`) - the rehearsal's own number
 * per section after a rehearsal with these arguments, otherwise the bound - and
 * `upTo` says which, once, for the band. Eleven "up to" prefixes down a numeric
 * column would be noise; a rung with no figure at all is still "not measured".
 *
 * 🔴 The rows arrive sorted by the figure SHOWN, so "which step frees the most"
 * stays true in both states: after a rehearsal the shape of the run really is the
 * estimate's shape, and a ladder still ranked by size on disk would put a section
 * estimated at 0 B on the top rung with an empty bar.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';

export interface LadderRow {
  id: number;
  key: string;
  /** What a run would free from this section, or null while nothing says. */
  bytes: number | null;
  /** How many targets the SCAN measured here - what is there, so it is never an estimate. */
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

export function SafeRunLadder({
  rows,
  total,
  upTo,
}: {
  rows: LadderRow[];
  /** The Reclaim button's own amount - null until a scan has measured. */
  total: number | null;
  /** Whether every figure here is a bound rather than the last rehearsal's estimate. */
  upTo: boolean;
}) {
  const { t } = useTranslation();

  const measured = total !== null;
  const shown = rows.slice(0, SHOWN);
  const rest = rows.slice(SHOWN);
  /* A zero here would divide every bar into NaN, and after a rehearsal a top rung
     estimated at 0 B is an ordinary state rather than a broken one. */
  const max = rows[0]?.bytes || 1;
  const restBytes = rest.reduce((sum, r) => sum + (r.bytes ?? 0), 0);

  return (
    <div className="panel pad">
      {rows.length === 0 ? (
        <p className="t-sm ink-3">{t('home.ladderEmpty')}</p>
      ) : (
        <>
          {/* D-61: which of the two the column is carrying, said once for the band.
              Before a scan there is no figure to qualify, so it says nothing. */}
          {measured ? (
            <p className="t-xs ink-3" style={{ marginBottom: 'var(--sp-3)' }}>
              {upTo ? t('offer.basisBound') : t('offer.basisEstimate')}
            </p>
          ) : null}
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
            <span className="t-sm ink-2">
              {measured && upTo ? t('home.ladderTotalUpTo') : t('home.ladderTotal')}
            </span>
            <span className="num t-md wide accent-ink">
              {total === null ? t('home.ladderUnmeasured') : formatBytes(total)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
