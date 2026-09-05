/**
 * THE theme control: one panel, every appearance axis, reachable from every route.
 *
 * 🔴 It renders from `AXES` - the same table the pre-paint script is generated
 * from - so an axis cannot exist in one and not the other. Card selectors, never
 * dropdowns: the point of a colour treatment is to be seen before it is chosen.
 */

import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { useTranslation } from 'react-i18next';

import { AXES, axisValue } from '../lib/theme';
import { useStore } from '../state/store';

export function ThemePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const prefs = useStore((s) => s.prefs);
  const setAxis = useStore((s) => s.setAxis);

  return (
    <ModalOverlay className="tm-scrim" isOpen={open} onOpenChange={(o) => { if (!o) onClose(); }} isDismissable>
      <Modal className="tm">
        <Dialog className="tm-dlg" aria-label={t('theme.title')}>
          <div className="tm-hd">
            <h2 className="t-md wide">{t('theme.title')}</h2>
            <button className="btn btn-sm" type="button" onClick={onClose}>
              {t('common.close')}
            </button>
          </div>

          <div className="tm-body">
            {AXES.map((axis) => {
              const current = axisValue(prefs, axis.key);
              return (
                <div className="axis" key={axis.key}>
                  <span className="axis-name caps" id={`axis-${axis.key}`}>
                    {t(axis.labelKey)}
                  </span>
                  <div className="axis-cards" role="radiogroup" aria-labelledby={`axis-${axis.key}`}>
                    {axis.values.map((v) => (
                      <button
                        className="axis-card"
                        type="button"
                        role="radio"
                        aria-checked={current === v.value}
                        key={v.value}
                        data-axis={axis.key}
                        data-value={v.value}
                        onClick={() => { setAxis(axis.key, v.value); }}
                      >
                        <span className="axis-card-label">{t(`theme.value.${v.value}`, v.label)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
