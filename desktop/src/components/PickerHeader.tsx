/**
 * The Picker's header band - the section's own eyebrow, title and lede, and on the right the
 * figure for the section in view (`picker.html` header, `page-picker.js` `choose`/`bar`).
 *
 * 🔴 The accent figure is space RECLAIMED (1.5.0, A4-08). In install mode it stands only where a
 * row of the section can reclaim some - section 31, for its old driver packages - and then the
 * count beneath reads "to reclaim · 6 of 6 chosen"; 30 and 32 show the count alone.
 */

import { Trans, useTranslation } from 'react-i18next';

import { formatBytes } from '../lib/format';
import type { Section } from '../lib/catalogue';

const COUNT_MARKUP = { 1: <span className="num" />, 3: <span className="num" /> };

export function PickerHeader({
  section,
  bytes,
  chosen,
  total,
  install,
  reclaims,
}: {
  section: Section;
  /** What the rows chosen in this section free. */
  bytes: number;
  chosen: number;
  /** The section's selectable rows. */
  total: number;
  install: boolean;
  /** A row of this section can free space - always so outside install mode. */
  reclaims: boolean;
}) {
  const { t } = useTranslation();
  const showFigure = !install || reclaims;

  return (
    <section className="band band-app band-tight">
      <div className="wrap">
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-4)', alignItems: 'flex-end' }}
        >
          <div>
            <p className="caps ink-3">{t('picker.eyebrow', { id: section.id })}</p>
            <h1 className="t-xl wide">
              {t(`picker.section.${String(section.id)}.title`, { defaultValue: section.title })}
            </h1>
            <p className="t-sm ink-3">
              {t(`picker.section.${String(section.id)}.lede`, { defaultValue: '' })}
            </p>
          </div>
          {/* The header speaks for the section in view; the bar below, for the whole
              selection of the mode in view. */}
          <div style={{ marginInlineStart: 'auto', textAlign: 'end' }}>
            {showFigure ? <p className="num t-xl wide accent-ink">{formatBytes(bytes)}</p> : null}
            <p className="t-sm ink-3">
              <Trans
                i18nKey={install && reclaims ? 'picker.chosenOfReclaim' : 'picker.chosenOf'}
                values={{ chosen, total }}
                components={COUNT_MARKUP}
              />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
