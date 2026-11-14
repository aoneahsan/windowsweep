/**
 * The install confirmation - `picker.html` `#pick-install-confirm`, `picker-install.js`
 * `paintConfirm` (1.5.0, AMENDMENTS-4 A4-09, D110, D111).
 *
 * 🔴 EVERY INSTALL PRESS ASKS FIRST, though nothing of the person's is lost: an install reaches
 * beyond this machine and this window cannot undo it, and undo beats confirm only where the action
 * can be walked back. So it is NOT the destructive style - no warning icon, the button is the
 * primary one - but Cancel is still focused first, Escape is Cancel, and React Aria returns focus
 * to the bar's button on close.
 *
 * The title and the button are the bar's verb ("Install 2, remove 3?"), and each line shows only for
 * work actually chosen; the restart line always shows, because it is true of all of it.
 *
 * 🔴 Wherever drivers are chosen it says the PC maker's own driver tool is named, never run (A4-15):
 * on a ThinkPad that tool's driver-only switch still queued a firmware package, so the engine stopped
 * starting it, and the window says so rather than leaving the reader to wonder where it went.
 */

import { useId } from 'react';
import { Button, Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';
import { useTranslation } from 'react-i18next';

import { ELEVATED_INSTALL_SECTIONS } from '../lib/candidate-extras';
import type { InstallTally } from '../lib/install-mode';
import { PrimaryButton } from './PrimaryButton';

export function PickerInstallConfirm({
  isOpen,
  tally,
  verb,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  tally: InstallTally;
  /** The bar's verb, already in words (`picker-words.ts` -> `verbText`). */
  verb: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t } = useTranslation();
  const bodyId = useId();
  const elevated = tally.sections.some((id) => ELEVATED_INSTALL_SECTIONS.has(id));

  return (
    <ModalOverlay
      className="scrim"
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
      isDismissable={false}
    >
      <Modal style={{ display: 'contents' }}>
        <Dialog role="alertdialog" className="dlg" aria-describedby={bodyId}>
          <div className="dlg-hd">
            <div>
              <Heading slot="title" className="t-md wide">
                {t('picker.installConfirm.title', { verb })}
              </Heading>
            </div>
          </div>
          <div
            className="dlg-bd"
            id={bodyId}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}
          >
            {tally.fetchedByWindowsUpdate > 0 ? (
              <p className="t-sm">{t('picker.installConfirm.wu')}</p>
            ) : null}
            {tally.driverRows > 0 ? (
              <>
                <p className="t-sm">{t('picker.installConfirm.firmware')}</p>
                <p className="t-sm">{t('picker.installConfirm.makerTool')}</p>
              </>
            ) : null}
            {tally.winget > 0 ? <p className="t-sm">{t('picker.installConfirm.winget')}</p> : null}
            {tally.remove > 0 ? <p className="t-sm">{t('picker.installConfirm.old')}</p> : null}
            {elevated ? <p className="t-sm">{t('picker.installConfirm.admin')}</p> : null}
            <p className="t-sm">{t('picker.installConfirm.restart')}</p>
          </div>
          <div className="dlg-ft">
            <Button slot="close" className="btn" autoFocus>
              {t('picker.confirmCancel')}
            </Button>
            <PrimaryButton control="picker.installConfirm" onPress={onConfirm} label={verb} />
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
