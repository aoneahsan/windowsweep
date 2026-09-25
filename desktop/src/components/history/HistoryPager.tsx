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

export function HistoryPager({
  shown,
  total,
  onMore,
  pending = false,
  failed = false,
}: {
  shown: number;
  total: number;
  onMore: () => void;
  /** The next page of the account's rows is being read (TASK-013). */
  pending?: boolean;
  /** That read failed: the rows read stand, and SY-02c's second line says so beside the button. */
  failed?: boolean;
}) {
  const { t } = useTranslation();
  const countId = useId();
  const exhausted = shown >= total;
  const inert = exhausted || pending;
  return (
    <>
      <div className="pager hist-pager">
        <button
          className="btn btn-sm"
          type="button"
          aria-disabled={inert || undefined}
          aria-busy={pending || undefined}
          data-disabled={exhausted ? '' : undefined}
          data-pending={pending ? '' : undefined}
          aria-describedby={countId}
          onClick={inert ? undefined : onMore}
        >
          <span className="btn-label">{t('history.loadMore', { count: HISTORY_PAGE_SIZE })}</span>
        </button>
        {failed ? (
          <span className="t-sm" role="alert" style={{ marginInlineStart: 'var(--sp-2)' }}>
            {t('account.sync.failed.listMore')}
          </span>
        ) : null}
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
