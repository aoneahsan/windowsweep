/**
 * The confirmation before a Permanent removal - GATE 4 round 8, D-48, decided
 * 2026-09-13 (`docs/story/decision-log.md`) and drawn in the dummy first
 * (`picker.html` `#pick-confirm`, the gallery's destructive alert dialog).
 *
 * 🔴 WHY THE WINDOW HAS TO ASK. The engine asks its own final question for 18, 19
 * and 23 (`Confirm-Ui -NoAutoYes -ScriptedOk`, `lib/ui.ps1:161`) precisely so a
 * permanent removal is never one keypress - and the `--select-file` this window
 * writes is what answers it. A window that answers that question on the reader's
 * behalf must ask it itself. Recycle Bin mode keeps its single press: it is
 * recoverable, and undo beats confirm wherever the action can be walked back.
 *
 * React Aria's Modal carries the behaviour: focus moves in and is contained, Escape
 * is Cancel, and focus returns to "Remove these" when it closes. Cancel is focused
 * first, so a stray Enter keeps the files. Only "Remove permanently" goes on to
 * `write_select_file` and the run.
 */

import { useId } from 'react';
import { Button, Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from './PrimaryButton';

export function PickerConfirm({
  isOpen,
  count,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  /** How many chosen rows would go - the title's plural. */
  count: number;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  const bodyId = useId();

  return (
    <ModalOverlay
      className="scrim"
      isOpen={isOpen}
      /* Escape and the Cancel button both close through here: closing IS cancelling. */
      onOpenChange={(open) => { if (!open) onCancel(); }}
      /* An alert dialog is answered, never dismissed by a stray click beside it. */
      isDismissable={false}
    >
      {/* The dialog is the box, as in the dummy (`.scrim > .dlg`); the modal wrapper
          contributes no box of its own. */}
      <Modal style={{ display: 'contents' }}>
        <Dialog role="alertdialog" className="dlg dlg-sm dlg-danger" aria-describedby={bodyId}>
          <div className="dlg-hd">
            <div className="dlg-icon" aria-hidden="true">!</div>
            <div>
              <Heading slot="title" className="t-md wide">
                {t('picker.confirmTitle', { count })}
              </Heading>
            </div>
          </div>
          <div className="dlg-bd">
            <p className="t-sm" id={bodyId}>{t('picker.confirmBody')}</p>
          </div>
          <div className="dlg-ft">
            <Button slot="close" className="btn" autoFocus>
              {t('picker.confirmCancel')}
            </Button>
            <PrimaryButton
              control="picker.removePermanently"
              tone="danger"
              onPress={onConfirm}
              label={t('picker.confirmRemove')}
            />
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
