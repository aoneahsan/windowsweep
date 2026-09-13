/**
 * *Load 20 more* - `history.html:82-88`.
 *
 * 🔴 NO TOAST. The dummy raised "Loaded the next page" for a press whose answer is
 * already on screen - the new rows, and the count beside the button changing - so
 * the toast was noise (§12: a toast is the fallback, not the default; the dummy
 * was amended). The count is a polite live region, which is what tells a screen
 * reader the same thing.
 *
 * 🔴 `aria-disabled`, not `disabled`, once every row is drawn. Disabling the focused
 * button would drop a keyboard user's focus to the top of the document on the press
 * that finished the list; `aria-disabled` keeps it where it was, `data-disabled`
 * gives it the product's disabled look, and the count it points at is the reason.
 */

import { useId } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { HISTORY_PAGE_SIZE } from '../../lib/history-rows';

export function HistoryPager({ shown, total, onMore }: { shown: number; total: number; onMore: () => void }) {
  const { t } = useTranslation();
  const countId = useId();
  const exhausted = shown >= total;
  return (
    <>
      <div className="pager hist-pager">
        <button
          className="btn btn-sm"
          type="button"
          aria-disabled={exhausted || undefined}
          data-disabled={exhausted ? '' : undefined}
          aria-describedby={countId}
          onClick={exhausted ? undefined : onMore}
        >
          {t('history.loadMore', { count: HISTORY_PAGE_SIZE })}
        </button>
        <span className="t-xs ink-3" id={countId} role="status">
          <Trans
            i18nKey="history.showing"
            values={{ shown, total }}
            components={{ 1: <span className="num" />, 3: <span className="num" /> }}
          />
        </span>
      </div>
      <p className="t-sm ink-3 hist-budget">{t('history.budgetNote')}</p>
    </>
  );
}
