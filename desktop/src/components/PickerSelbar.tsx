/**
 * The Picker's selection bar - `picker.html`'s `.selbar[data-ws-pickbar]`.
 *
 * It speaks for the WHOLE selection, across sections, while the screen's header
 * speaks for the section in view: two rows ticked in 17 read "2 chosen · across
 * section 17" here, over section 23's own "0 of 8 chosen".
 *
 * 🔴 The bar is always rendered and `hidden` while nothing is chosen, as the dummy's
 * is: `.selbar[hidden]` slides it out and takes it out of the tab order in one rule
 * (`styles/shell/04-tables-panel-responsive.css`), so a keyboard user never tabs into a bar they cannot see.
 *
 * 🔴 The consequence line is not decoration. The segmented control chooses between
 * the Recycle Bin and permanent deletion, and those differ in the one way that
 * matters - "The Recycle Bin can be emptied later. Permanent has no undo." It sits
 * next to the control, not in a toast after the fact.
 *
 * 🔴 THE MODE GOVERNS THE `recycle` SECTIONS ONLY - 18, 19 and 23. Section 17 is tier
 * `rebuilds` and its artefacts go through `Remove-PathSafe` outright whichever way
 * this is set (`modules/projects.ps1:157`). While one of its rows is chosen the bar
 * says so, in the words decided with D-48 (GATE 4 round 8, D-49): a bar reading
 * "Recycle Bin" over rows that are deleted outright understates deletion, which is
 * round 7's D-25 again.
 */

import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import { stateOf } from '../lib/control-state';
import { PrimaryButton } from './PrimaryButton';

/** The two values the segmented control offers; `recycle` is the default. */
export type DeleteMode = 'recycle' | 'permanent';

export function PickerSelbar({
  count,
  bytes,
  sections,
  mode,
  onMode,
  busy,
  failed,
  onClear,
  onRemove,
  outright,
}: {
  count: number;
  bytes: number;
  /** The sections the chosen rows belong to, ascending. */
  sections: number[];
  mode: DeleteMode;
  onMode: (next: DeleteMode) => void;
  busy: boolean;
  /** The engine's own refusal of the selection file, verbatim - see `Picker.tsx`. */
  failed: string | null;
  onClear: () => void;
  onRemove: () => void;
  /** A row of section 17 is chosen - those rows go outright whichever mode is set. */
  outright: boolean;
}) {
  const { t } = useTranslation();

  return (
    /* The consequence line takes a full-width line of its own under the controls, as
       `picker.html` now draws it: with section 17's sentence the one-row bar squeezed
       its own controls ("Remove these" broke onto two lines). */
    <div className="selbar" hidden={count === 0} style={{ flexWrap: 'wrap', rowGap: 'var(--sp-1)' }}>
      <span className="num t-md wide">{count}</span>
      <span className="t-sm ink-2">{t('picker.chosenWord')}</span>
      <span className="tb-sep" />
      <span className="num t-md wide accent-ink">{formatBytes(bytes)}</span>
      <span className="t-xs ink-3 only-wide">
        {sections.length > 0 ? t('picker.where', { count: sections.length, list: sections.join(', ') }) : ''}
      </span>
      <div style={{ marginInlineStart: 'auto', display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
        {/* 🔴 A label wrapping a real radio, which is what `.seg-opt` is styled for:
            the selected paint is `.seg-opt:has(input:checked)`. Native radios in
            one group also bring arrow-key traversal with them. */}
        <div className="seg" role="radiogroup" aria-label={t('picker.howToDelete')}>
          <label className="seg-opt">
            <input
              type="radio"
              name="pick-mode"
              value="recycle"
              checked={mode === 'recycle'}
              onChange={() => { onMode('recycle'); }}
            />
            <span>{t('picker.recycleBin')}</span>
          </label>
          <label className="seg-opt">
            <input
              type="radio"
              name="pick-mode"
              value="permanent"
              checked={mode === 'permanent'}
              onChange={() => { onMode('permanent'); }}
            />
            <span>{t('picker.permanent')}</span>
          </label>
        </div>
        {/* Acknowledged where it happened: every switch goes off and the bar slides
            away - no toast, as the dummy's Clear now does. */}
        <button className="btn btn-sm" type="button" onClick={onClear}>
          <span className="btn-label">{t('picker.clear')}</span>
        </button>
        {/* 🔴 Live. It writes the selection file and runs the sections those rows
            came from. The pending state is set before the write, so the control
            answers the press in the same frame. */}
        <PrimaryButton
          control="picker.remove"
          size="sm"
          onPress={onRemove}
          disabled={busy || count === 0}
          state={stateOf(busy)}
          label={t('picker.remove')}
        />
      </div>
      <p className="t-sm ink-3" style={{ flexBasis: '100%' }}>
        {t('picker.consequence')}
        {outright ? <> {t('picker.consequence17')}</> : null}
      </p>
      {/* 🔴 The engine's own refusal, verbatim, beside the button that was pressed.
          It appears only when nothing ran: once a run has started its reasons go
          to the Run screen's log with the engine's other lines. */}
      {failed === null ? null : (
        <p className="t-xs" role="alert" style={{ color: 'var(--c-warn-ink)', flexBasis: '100%' }}>
          {failed}
        </p>
      )}
    </div>
  );
}
