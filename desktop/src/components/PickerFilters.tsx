/**
 * The Picker's sticky filter band - the section chips and the search box (`picker.html` filters).
 *
 * 🔴 1.5.0 (D110): the install sections get their own *Updates* label and chips, in one group that
 * wraps as a unit, so the label never parts from its chips and the change of bar is expected
 * before it happens. Both lists are the catalogue's own interactive sections, split by tier -
 * never a list kept here.
 */

import { useTranslation } from 'react-i18next';

import type { Section } from '../lib/catalogue';

function Chip({
  section,
  pressed,
  onPress,
}: {
  section: Section;
  pressed: boolean;
  onPress: (id: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      className="fchip"
      type="button"
      aria-pressed={pressed}
      onClick={() => {
        onPress(section.id);
      }}
    >
      {t('picker.chipLabel', {
        id: section.id,
        name: t(`picker.section.${String(section.id)}.chip`, { defaultValue: section.key }),
      })}
    </button>
  );
}

export function PickerFilters({
  removing,
  installing,
  current,
  install,
  q,
  onSection,
  onSearch,
}: {
  /** The interactive sections that take something away (17-27). */
  removing: Section[];
  /** The interactive sections that bring something in (30-32). */
  installing: Section[];
  current: number;
  install: boolean;
  q: string;
  onSection: (id: number) => void;
  onSearch: (q: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <section
      className="band band-well band-tight"
      style={{ position: 'sticky', top: 0, zIndex: 4 }}
    >
      <div className="wrap">
        <div className="filters" data-tour="choose-filter">
          <span className="caps ink-3" style={{ marginInlineEnd: 'var(--sp-2)' }}>
            {t('picker.sectionFilter')}
          </span>
          {removing.map((s) => (
            <Chip key={s.id} section={s} pressed={s.id === current} onPress={onSection} />
          ))}
          {installing.length > 0 ? (
            <span
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 'var(--sp-2)',
              }}
            >
              <span className="caps ink-3" style={{ marginInline: 'var(--sp-2)' }}>
                {t('picker.updatesFilter')}
              </span>
              {installing.map((s) => (
                <Chip key={s.id} section={s} pressed={s.id === current} onPress={onSection} />
              ))}
            </span>
          ) : null}
          <input
            className="field"
            type="search"
            placeholder={t(
              install ? 'picker.searchPlaceholderInstall' : 'picker.searchPlaceholder'
            )}
            value={q}
            style={{ maxWidth: '16rem', marginInlineStart: 'auto' }}
            /* 🔴 `replace`, or every keystroke becomes a history entry and Back
               walks the filter backwards one character at a time. */
            onChange={(e) => {
              onSearch(e.target.value);
            }}
          />
        </div>
      </div>
    </section>
  );
}
