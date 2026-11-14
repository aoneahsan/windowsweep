/**
 * The Picker's table - `picker.html`'s `.tbl` inside `.panel > .xscroll`, with the
 * body `page-picker.js` paints: the rows a section offered, or the one state that
 * says why there are none. The cells themselves are `PickerCells.tsx`
 * (`picker-columns.js`), and each section names its own four columns.
 *
 * 🔴 FOUR EMPTY BODIES, AND EACH IS A DIFFERENT FACT. Which one shows is decided by
 * the screen, never guessed here:
 * - `skipped` - section 17 with developer mode off. The engine skips it outright
 *   (`modules/runner.ps1:105`), so it offers nothing and a dry-run would ask
 *   nothing; the dummy says so in the words Elevation uses for section 20.
 * - `not-asked` - nothing has asked the engine about this section yet. Its list is
 *   not empty, it does not exist, so the state offers the ask itself: a dry-run,
 *   which costs nothing and deletes nothing (`picker.html?empty=1`). 27 asks for
 *   permission even to look; 30-32 list without it and install nothing.
 * - `no-match` - asked, with rows, all of them filtered out by the search.
 * - `nothing` - asked, and the section found nothing on this machine: "the good
 *   outcome, not an error". Only this one may say the section found nothing.
 *
 * The row control is the dummy's reduced-width switch, and the row carries
 * `data-selected`, so the choice reads from across the row, not from one knob.
 */

import { useTranslation } from 'react-i18next';

import { controlState, stateOf } from '../lib/control-state';
import type { Candidate } from '../lib/cli';
import { columnKeys, KindCell, NameCell, SizeCell, useChoiceLabel, WhenCell } from './PickerCells';

/** Which body the section in view gets - see the list above. */
export type PickerBody = 'rows' | 'skipped' | 'not-asked' | 'no-match' | 'nothing';

function EmptyRow({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
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

/** The not-asked body: 19 scans folders, 27 asks for permission, install sections list. */
function notAskedBody(section: number, install: boolean): string {
  if (section === 19) return 'picker.dataNotAskedBody';
  if (section === 27) return 'picker.adminScanBody';
  return install ? 'picker.notAskedInstallBody' : 'picker.notAskedBody';
}

export function PickerTable({
  body,
  rows,
  selectedPaths,
  onToggle,
  asking,
  askDisabled,
  onAsk,
  section,
  install,
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
  section: number;
  /** The section is tier `update` - the install mode's columns and words. */
  install: boolean;
}) {
  const { t } = useTranslation();
  const choiceLabel = useChoiceLabel();
  const [name, kind, when, size] = columnKeys(section);

  return (
    <table className="tbl">
      <thead>
        <tr>
          <th style={{ width: '2.4rem' }}>
            <span className="visually-hidden">{t('picker.colChoose')}</span>
          </th>
          <th>{t(name)}</th>
          <th style={{ width: '9rem' }}>{t(kind)}</th>
          <th style={{ width: '5rem' }}>{t(when)}</th>
          <th style={{ width: '6.5rem' }} className="num-cell">
            {t(size)}
          </th>
        </tr>
      </thead>
      <tbody>
        {body === 'skipped' ? (
          <EmptyRow title={t('picker.nothingHereTitle')} body={t('picker.devOff')} />
        ) : null}
        {body === 'not-asked' ? (
          <EmptyRow
            title={t(section === 19 ? 'picker.dataNotAskedTitle' : 'picker.notAskedTitle')}
            body={t(notAskedBody(section, install))}
          >
            {section !== 19 ? (
              <button
                className="btn btn-sm"
                type="button"
                onClick={onAsk}
                disabled={askDisabled}
                {...controlState(stateOf(asking))}
              >
                <span className="btn-label">{t('picker.ask')}</span>
              </button>
            ) : null}
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
              const selectable = r.selectable !== false;
              const on = selectable && selectedPaths.has(r.path);
              return (
                <tr key={r.path} data-selected={on ? 'true' : 'false'}>
                  <td>
                    {selectable ? (
                      <button
                        className="switch"
                        type="button"
                        role="switch"
                        aria-checked={on}
                        aria-label={choiceLabel(r, install)}
                        style={{ ['--sw-w' as string]: 'calc(1.9rem * var(--density))' }}
                        onClick={() => {
                          onToggle(r.path);
                        }}
                      />
                    ) : (
                      <span className="badge badge-outline" title={r.skip_reason}>
                        {t('picker.refused')}
                      </span>
                    )}
                  </td>
                  <NameCell row={r} install={install} />
                  <KindCell row={r} install={install} />
                  <WhenCell row={r} install={install} />
                  <SizeCell row={r} install={install} />
                </tr>
              );
            })
          : null}
      </tbody>
    </table>
  );
}
