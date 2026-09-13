/**
 * The `Show` band - `history.html:51-61`: sticky, so the chips stay in reach while
 * the table scrolls under them.
 *
 * The chips are the app's filter vocabulary (`fchip` with `aria-pressed`, as on
 * Sections), and the visible `Show` names the group for a screen reader too.
 * `Other machines` is drawn because the dummy draws it; what it shows in this build
 * is a stated gap, never a faked row (`HistoryTable`).
 */

import { useId } from 'react';
import { useTranslation } from 'react-i18next';

import { HISTORY_FILTERS, type HistoryFilter } from '../../lib/history-rows';

export function HistoryShow({ filter, onChoose }: { filter: HistoryFilter; onChoose: (next: HistoryFilter) => void }) {
  const { t } = useTranslation();
  const labelId = useId();
  return (
    <section className="band band-well band-tight hist-show">
      <div className="wrap">
        <div className="filters" role="group" aria-labelledby={labelId}>
          <span className="caps ink-3 hist-show-label" id={labelId}>{t('history.show')}</span>
          {HISTORY_FILTERS.map((f) => (
            <button
              className="fchip"
              type="button"
              key={f}
              aria-pressed={filter === f}
              onClick={() => { onChoose(f); }}
            >
              {t(`history.filter.${f}`)}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
