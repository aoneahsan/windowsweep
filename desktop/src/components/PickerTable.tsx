/**
 * The Picker's table - `picker.html`'s `.tbl` inside `.panel > .xscroll`, with the
 * body `page-picker.js` paints: the rows a section offered, or the one state that
 * says why there are none.
 *
 * 🔴 FOUR EMPTY BODIES, AND EACH IS A DIFFERENT FACT. Which one shows is decided by
 * the screen, never guessed here:
 * - `skipped` - section 17 with developer mode off. The engine skips it outright
 *   (`modules/runner.ps1:105`), so it offers nothing and a dry-run would ask
 *   nothing; the dummy says so in the words Elevation uses for section 20.
 * - `not-asked` - nothing has asked the engine about this section yet. Its list is
 *   not empty, it does not exist, so the state offers the ask itself: a dry-run,
 *   which costs nothing and deletes nothing (`picker.html?empty=1`).
 * - `no-match` - asked, with rows, all of them filtered out by the search.
 * - `nothing` - asked, and the section found nothing on this machine: "the good
 *   outcome, not an error". Only this one may say the section found nothing.
 *
 * The row control is the dummy's reduced-width switch, and the row carries
 * `data-selected`, so the choice reads from across the row, not from one knob.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import { controlState, stateOf } from '../lib/control-state';
import type { Candidate } from '../lib/cli';

/** Which body the section in view gets - see the list above. */
export type PickerBody = 'rows' | 'skipped' | 'not-asked' | 'no-match' | 'nothing';

function EmptyRow({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={5}>
        <div className="empty">
          <h3>{title}</h3>
          <p>{body}</p>
          {children}
        </div>
      </td>
    </tr>
  );
}

export function PickerTable({
  body,
  rows,
  selectedPaths,
  onToggle,
  asking,
  askDisabled,
  onAsk,
}: {
  body: PickerBody;
  /** The rows to draw when `body` is `rows` - already filtered by the search. */
  rows: Candidate[];
  selectedPaths: ReadonlySet<string>;
  onToggle: (path: string) => void;
  /** This section's dry-run is in flight - the ask carries the pending state. */
  asking: boolean;
  /** Another run holds the engine, or another ask is in flight. */
  askDisabled: boolean;
  onAsk: () => void;
}) {
  const { t } = useTranslation();

  return (
    <table className="tbl">
      <thead>
        <tr>
          <th style={{ width: '2.4rem' }}>
            <span className="visually-hidden">{t('picker.colChoose')}</span>
          </th>
          <th>{t('picker.colPath')}</th>
          <th style={{ width: '9rem' }}>{t('picker.colProject')}</th>
          <th style={{ width: '5rem' }}>{t('picker.colIdle')}</th>
          <th style={{ width: '6.5rem' }} className="num-cell">{t('picker.colSize')}</th>
        </tr>
      </thead>
      <tbody>
        {body === 'skipped' ? (
          <EmptyRow title={t('picker.nothingHereTitle')} body={t('picker.devOff')} />
        ) : null}
        {body === 'not-asked' ? (
          <EmptyRow title={t('picker.notAskedTitle')} body={t('picker.notAskedBody')}>
            <button
              className="btn btn-sm"
              type="button"
              onClick={onAsk}
              disabled={askDisabled}
              {...controlState(stateOf(asking))}
            >
              <span className="btn-label">{t('picker.ask')}</span>
            </button>
          </EmptyRow>
        ) : null}
        {body === 'no-match' ? (
          <EmptyRow title={t('picker.searchEmptyTitle')} body={t('picker.searchEmptyBody')} />
        ) : null}
        {body === 'nothing' ? (
          <EmptyRow title={t('picker.nothingHereTitle')} body={t('picker.nothingHereBody')} />
        ) : null}
        {body === 'rows'
          ? rows.map((r) => {
              const on = selectedPaths.has(r.path);
              return (
                <tr key={r.path} data-selected={on ? 'true' : 'false'}>
                  <td>
                    <button
                      className="switch"
                      type="button"
                      role="switch"
                      aria-checked={on}
                      aria-label={t('picker.chooseRow', { path: r.path })}
                      style={{ ['--sw-w' as string]: 'calc(1.9rem * var(--density))' }}
                      onClick={() => { onToggle(r.path); }}
                    />
                  </td>
                  <td>
                    {/* The engine reports absolute paths, often past 80 characters, so
                        the cell ellipsises as the dummy's does and the whole path is
                        one hover away - and always in the switch's accessible name. */}
                    <div
                      className="mono t-sm"
                      title={r.path}
                      style={{ maxWidth: '38rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {r.path}
                    </div>
                  </td>
                  {/* The engine sends an empty string, not null, for a row with no project -
                      section 23's folders - so both read as the dummy's dash. */}
                  <td className="t-sm ink-3">{r.project !== null && r.project !== '' ? r.project : '—'}</td>
                  <td className="num t-sm ink-3">
                    {r.idle_days === null ? '—' : t('picker.idleShort', { count: r.idle_days })}
                  </td>
                  <td className="num-cell t-sm accent-ink">{formatBytes(r.bytes)}</td>
                </tr>
              );
            })
          : null}
      </tbody>
    </table>
  );
}
