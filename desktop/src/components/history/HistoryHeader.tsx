/**
 * History's first band - `history.html:23-37`: the heading and its plain line, and
 * on the far side what the listed real runs freed.
 *
 * 🔴 The figure follows the `Show` chip, as the dummy's does (`page-history.js` ->
 * `paint` totals the filtered list), and counts REAL runs only: a dry-run deleted
 * nothing, so it can be neither part of "freed" nor one of "the last N runs".
 */

import { Trans, useTranslation } from 'react-i18next';

import { formatBytes } from '../../lib/format';

export function HistoryHeader({ freedBytes, runs }: { freedBytes: number; runs: number }) {
  const { t } = useTranslation();
  return (
    <section className="band band-app band-tight">
      <div className="wrap">
        <div className="hist-head">
          <div>
            <h1 className="t-xl wide">{t('history.title')}</h1>
            <p className="t-sm ink-3">{t('history.lede')}</p>
          </div>
          <div className="hist-total">
            <p className="num t-xl wide accent-ink">{formatBytes(freedBytes)}</p>
            <p className="t-sm ink-3">
              <Trans i18nKey="history.freedLast" count={runs} components={{ 1: <span className="num" /> }} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
