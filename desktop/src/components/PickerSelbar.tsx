/**
 * The Picker's selection bar - `picker.html`'s `.selbar[data-ws-pickbar]`.
 *
 * It speaks for the WHOLE selection of the mode in view, across sections, while the screen's
 * header speaks for the section in view: two rows ticked in 17 read "2 chosen · across section 17"
 * here, over section 23's own "0 of 8 chosen".
 *
 * 🔴 ONE BAR, TWO MODES (1.5.0, A4-08). Removing (17-27) keeps Recycle Bin / Permanent and "Remove
 * these". Installing (30-32) drops the choice, says the download in words beside the figure, and
 * takes its verb from the rows - "Install 3 updates", "Remove 3 old packages", "Install 2, remove 3"
 * (never a run: A4-15). 🔴 The accent figure is space RECLAIMED, so in install mode it stands only while
 * section 31's old packages are chosen, labelled "to reclaim"; an install never reaches it. The two
 * selections never merge: the bar acts on the mode in view, and rows chosen in the other mode are
 * named in one line at the end, because they stay chosen and run separately.
 *
 * 🔴 The bar is always rendered and `hidden` while nothing is chosen, as the dummy's is:
 * `.selbar[hidden]` slides it out and takes it out of the tab order in one rule
 * (`styles/shell/04-tables-panel-responsive.css`), so a keyboard user never tabs into a bar they
 * cannot see.
 *
 * 🔴 THE MODE GOVERNS THE `recycle` SECTIONS ONLY - 18, 19 and 23. Section 17 is tier `rebuilds`
 * and its artefacts go through `Remove-PathSafe` outright whichever way this is set
 * (`modules/projects.ps1:157`). While one of its rows is chosen the bar says so, in the words
 * decided with D-48 (GATE 4 round 8, D-49): a bar reading "Recycle Bin" over rows that are deleted
 * outright understates deletion, which is round 7's D-25 again.
 */

import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import { stateOf } from '../lib/control-state';
import { ELEVATED_INSTALL_SECTIONS } from '../lib/candidate-extras';
import { downloadPhrase, type InstallTally, type KeptPhrase } from '../lib/install-mode';
import { downloadText, keptText } from './picker-words';
import { PrimaryButton } from './PrimaryButton';

/** The two values the segmented control offers; `recycle` is the default. */
export type DeleteMode = 'recycle' | 'permanent';

/** What the bar says while removing: which consequence lines apply. */
export interface RemoveLines {
  /** A row of section 17 is chosen - those rows go outright whichever mode is set. */
  outright: boolean;
  uninstall: boolean;
  /** A row of section 27 is chosen - its permission and its .reg backups are said here. */
  leftovers: boolean;
  recycleOnly: boolean;
}

/** The install mode's sentences, in the order the dummy draws them (`picker.html` install lines). */
function installLines(t: TFunction, tally: InstallTally): string[] {
  const lines: string[] = [];
  if (tally.windowsUpdates > 0) lines.push(t('picker.installLine.wu'));
  if (tally.drivers > 0) lines.push(t('picker.installLine.drivers'));
  if (tally.remove > 0) lines.push(t('picker.installLine.old'));
  if (tally.winget > 0) lines.push(t('picker.installLine.winget'));
  /* Its own clause, so removing old driver packages says it too: 30 and 31 run in the elevated
     window, and what the person meets is Windows' own prompt. */
  if (tally.sections.some((id) => ELEVATED_INSTALL_SECTIONS.has(id))) {
    lines.push(t('picker.installLine.elevated'));
  }
  lines.push(t('picker.installLine.restart'));
  return lines;
}

export function PickerSelbar({
  count,
  bytes,
  sections,
  install,
  tally,
  verb,
  mode,
  onMode,
  lines,
  kept,
  busy,
  failed,
  onClear,
  onPress,
  ref,
}: {
  /** Rows chosen in the mode in view. */
  count: number;
  /** Space those rows free - never a download. */
  bytes: number;
  /** The sections the chosen rows belong to, ascending. */
  sections: number[];
  /** The section in view is an install section (tier `update`). */
  install: boolean;
  /** The install mode's tally; read only while `install`. */
  tally: InstallTally;
  /** The install mode's verb, in words (`picker-words.ts` -> `verbText`). */
  verb: string;
  mode: DeleteMode;
  onMode: (next: DeleteMode) => void;
  lines: RemoveLines;
  /** Rows chosen in the OTHER mode, or null. */
  kept: KeptPhrase | null;
  busy: boolean;
  /** The engine's own refusal of the selection file, verbatim - see `Picker.tsx`. */
  failed: string | null;
  onClear: () => void;
  onPress: () => void;
  /** Measured by the screen, so the room under its last block can grow to the bar's height. */
  ref?: React.Ref<HTMLDivElement>;
}) {
  const { t } = useTranslation();

  const sentences = install
    ? installLines(t, tally)
    : [
        t('picker.consequence'),
        ...(lines.outright ? [t('picker.consequence17')] : []),
        ...(lines.uninstall ? [t('picker.consequence26')] : []),
        ...(lines.leftovers ? [t('picker.consequence27')] : []),
        ...(lines.recycleOnly ? [t('picker.consequence19')] : []),
      ];
  if (kept) sentences.push(keptText(t, kept));

  return (
    /* The consequence line takes a full-width line of its own under the controls, as
       `picker.html` now draws it: with section 17's sentence the one-row bar squeezed
       its own controls ("Remove these" broke onto two lines). */
    <div
      ref={ref}
      className="selbar"
      data-tour="choose-consequence"
      hidden={count === 0}
      style={{ flexWrap: 'wrap', rowGap: 'var(--sp-1)' }}
    >
      <span className="num t-md wide">{count}</span>
      <span className="t-sm ink-2">{t('picker.chosenWord')}</span>
      <span className="tb-sep" />
      {!install || bytes > 0 ? (
        <span className="num t-md wide accent-ink">{formatBytes(bytes)}</span>
      ) : null}
      {install && bytes > 0 ? <span className="t-sm ink-2">{t('picker.toReclaim')}</span> : null}
      {install ? (
        <span className="t-sm ink-2">{downloadText(t, downloadPhrase(tally))}</span>
      ) : null}
      <span className="t-xs ink-3 only-wide">
        {sections.length > 0
          ? t('picker.where', { count: sections.length, list: sections.join(', ') })
          : ''}
      </span>
      <div
        style={{
          marginInlineStart: 'auto',
          display: 'flex',
          gap: 'var(--sp-2)',
          alignItems: 'center',
        }}
      >
        {/* 🔴 A label wrapping a real radio, which is what `.seg-opt` is styled for:
            the selected paint is `.seg-opt:has(input:checked)`. Native radios in
            one group also bring arrow-key traversal with them. Install mode has no
            Recycle Bin choice - nothing it installs goes anywhere. */}
        {install ? null : (
          <div className="seg" role="radiogroup" aria-label={t('picker.howToDelete')}>
            <label className="seg-opt">
              <input
                type="radio"
                name="pick-mode"
                value="recycle"
                checked={mode === 'recycle'}
                onChange={() => {
                  onMode('recycle');
                }}
              />
              <span>{t('picker.recycleBin')}</span>
            </label>
            <label className="seg-opt">
              <input
                type="radio"
                name="pick-mode"
                value="permanent"
                checked={mode === 'permanent'}
                disabled={lines.recycleOnly}
                onChange={() => {
                  onMode('permanent');
                }}
              />
              <span>{t('picker.permanent')}</span>
            </label>
          </div>
        )}
        {/* Acknowledged where it happened: every switch of this mode goes off and the bar
            slides away - no toast, as the dummy's Clear now does. */}
        <button className="btn btn-sm" type="button" onClick={onClear}>
          <span className="btn-label">{t('picker.clear')}</span>
        </button>
        {/* 🔴 Live. It writes the selection file and runs the sections those rows came
            from - after a confirmation for an install, an uninstall or a permanent
            removal. The pending state is set before the write, so the control answers
            the press in the same frame. */}
        <PrimaryButton
          control={install ? 'picker.install' : 'picker.remove'}
          size="sm"
          onPress={onPress}
          disabled={busy || count === 0}
          state={stateOf(busy)}
          label={install ? verb : t('picker.remove')}
        />
      </div>
      <p className="t-sm ink-3" style={{ flexBasis: '100%' }}>
        {sentences.join(' ')}
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
