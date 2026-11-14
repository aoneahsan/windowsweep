/**
 * The confirmation before a Permanent removal - GATE 4 round 8, D-48, decided
 * 2026-09-13 (`docs/story/decision-log.md`) and drawn in the dummy first
 * (`picker.html` `#pick-confirm`, the gallery's destructive alert dialog) - and, in
 * its second shape, before any uninstall (1.5.0, AMENDMENTS-4 A4-06).
 *
 * 🔴 WHY THE WINDOW HAS TO ASK. The engine asks its own final question for 18, 19
 * and 23 (`Confirm-Ui -NoAutoYes -ScriptedOk`, `lib/ui.ps1:161`) precisely so a
 * permanent removal is never one keypress - and the `--select-file` this window
 * writes is what answers it. A window that answers that question on the reader's
 * behalf must ask it itself. Recycle Bin mode keeps its single press: it is
 * recoverable, and undo beats confirm wherever the action can be walked back.
 *
 * 🔴 ANY SECTION 26 ROW MAKES IT THE UNINSTALL QUESTION, whichever removal mode is set,
 * because an uninstall is permanent either way - and it says only what is true of the
 * rows chosen: desktop programs run their uninstallers, Store apps go for this Windows
 * account, a broken entry is cleared after a .reg backup. "Will run their own
 * uninstallers" was false of the last two, which is why 1.5.0 drew these words.
 *
 * React Aria's Modal carries the behaviour: focus moves in and is contained, Escape
 * is Cancel, and focus returns to "Remove these" when it closes. Cancel is focused
 * first, so a stray Enter keeps the files. Only the destructive button goes on to
 * `write_select_file` and the run.
 */

import { useId } from 'react';
import { Button, Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from './PrimaryButton';

/** Which uninstall lines apply - each shown only for rows actually chosen. */
export interface UninstallLines {
  desktop: boolean;
  store: boolean;
  broken: boolean;
  /** Rows of other sections are chosen too, and follow the bar's mode. */
  others: boolean;
}

export function PickerConfirm({
  isOpen,
  count,
  onCancel,
  onConfirm,
  uninstall,
}: {
  isOpen: boolean;
  /** How many chosen rows would go - the permanent title's plural. */
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
  /** Set when a section 26 row is chosen: the dialog is then the uninstall question. */
  uninstall: UninstallLines | null;
}) {
  const { t } = useTranslation();
  const bodyId = useId();

  return (
    <ModalOverlay
      className="scrim"
      isOpen={isOpen}
      /* Escape and the Cancel button both close through here: closing IS cancelling. */
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      /* An alert dialog is answered, never dismissed by a stray click beside it. */
      isDismissable={false}
    >
      {/* The dialog is the box, as in the dummy (`.scrim > .dlg`); the modal wrapper
          contributes no box of its own. */}
      <Modal style={{ display: 'contents' }}>
        <Dialog role="alertdialog" className="dlg dlg-sm dlg-danger" aria-describedby={bodyId}>
          <div className="dlg-hd">
            <div className="dlg-icon" aria-hidden="true">
              !
            </div>
            <div>
              <Heading slot="title" className="t-md wide">
                {uninstall
                  ? t('picker.confirmUninstallTitle')
                  : t('picker.confirmTitle', { count })}
              </Heading>
            </div>
          </div>
          <div
            className="dlg-bd"
            id={bodyId}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}
          >
            {uninstall ? (
              <>
                {uninstall.desktop ? (
                  <p className="t-sm">{t('picker.confirmUninstall.desktop')}</p>
                ) : null}
                {uninstall.store ? (
                  <p className="t-sm">{t('picker.confirmUninstall.store')}</p>
                ) : null}
                {uninstall.broken ? (
                  <p className="t-sm">{t('picker.confirmUninstall.broken')}</p>
                ) : null}
                <p className="t-sm">{t('picker.confirmUninstall.after')}</p>
                {uninstall.others ? (
                  <p className="t-sm">{t('picker.confirmUninstall.others')}</p>
                ) : null}
              </>
            ) : (
              <p className="t-sm">{t('picker.confirmBody')}</p>
            )}
          </div>
          <div className="dlg-ft">
            <Button slot="close" className="btn" autoFocus>
              {t('picker.confirmCancel')}
            </Button>
            <PrimaryButton
              control={uninstall ? 'picker.uninstall' : 'picker.removePermanently'}
              tone="danger"
              onPress={onConfirm}
              label={uninstall ? t('picker.confirmUninstall') : t('picker.confirmRemove')}
            />
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
