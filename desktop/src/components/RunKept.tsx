/**
 * 🔴 WHAT THE RUN ACTUALLY KEPT, from the engine's own `excluded[]`.
 * This is the outcome, not the intention: the map band on Home counts what
 * was ASKED for, and this counts what the engine turned away when a
 * deletion reached the chokepoint. They can legitimately differ - an
 * excluded folder nothing tried to delete never appears here - and showing
 * the request as though it were the result is exactly the shape of lie this
 * feature exists to prevent. Empty after a `--scan`, always, because a scan
 * never reaches the chokepoint.
 *
 * Moved out of `screens/Run.tsx` at the 500-line ceiling; the markup is unchanged.
 */

import { useTranslation } from 'react-i18next';

export function RunKept({ excluded }: { excluded: readonly string[] }) {
  const { t } = useTranslation();
  if (excluded.length === 0) return null;
  return (
    <section className="band band-app band-tight">
      <div className="wrap rise">
        <div className="zone-label">
          <span className="caps">{t('run.excludedTitle')}</span>
          <span className="t-sm ink-3" style={{ flex: 'none' }}>
            {t('run.excludedHint', { count: excluded.length })}
          </span>
        </div>
        <div className="panel pad">
          <ul
            style={{
              margin: 0,
              paddingInlineStart: 'var(--sp-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--sp-1)',
            }}
          >
            {excluded.map((path) => (
              <li className="mono t-xs" key={path} style={{ wordBreak: 'break-all' }}>
                {path}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
