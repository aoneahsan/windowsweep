/**
 * THE theme control: one panel, every appearance axis, reachable from every route.
 *
 * 🔴 It renders from `AXES` - the same table the pre-paint script is generated
 * from - so an axis cannot exist in one and not the other. Card selectors, never
 * dropdowns: the point of a colour treatment is to be seen before it is chosen.
 *
 * 🔴 THE CLASSES ARE THE DUMMY'S, and that is what makes the panel visible at all.
 * The first translation invented `tm-scrim`, `tm`, `tm-dlg`, `tm-hd`, `tm-body`,
 * `axis-cards` and `axis-card` - not one of which exists in `shell.css`. The
 * result passed typecheck, lint and build while the panel had no scrim, no
 * surface, and no selected state on ANY of the ten axes: pressing a card changed
 * the whole app and the card itself looked identical before and after. The real
 * vocabulary is `sheet-scrim`, `sheet`, `sheet-hd`, `sheet-bd`, `cards` and
 * `card-sel`, and `card-sel[data-selected]` is the acknowledgement.
 *
 * 🔴 Each card PREVIEWS its own value - a radius card drawn at its radius, a
 * treatment card showing that treatment's real surface/ink/accent triad, read from
 * that treatment rather than from the live one. A card carrying only a word is a
 * dropdown wearing a border.
 *
 * 🔴 A real `radiogroup` per axis, through React Aria: one tab stop, arrow keys
 * within, focus and press states on the card. Roving tabindex hand-rolled WITHOUT
 * arrow keys would make every unselected value unreachable by keyboard, which is
 * worse than no keyboard support at all.
 */

import { Dialog, Label, Modal, ModalOverlay, Radio, RadioGroup } from 'react-aria-components';
import { useTranslation } from 'react-i18next';

import { AXES, axisValue, resolveAppearance, type Axis, type AxisPrefs } from '../lib/theme';
import { useStore } from '../state/store';

const RADIUS_PREVIEW: Record<string, string> = {
  none: '0', small: '2px', medium: '4px', large: '7px', full: '9px',
};
const DENSITY_PREVIEW: Record<string, string> = {
  compact: '2px', comfortable: '4px', spacious: '6px',
};
const TYPE_SCALE_PREVIEW: Record<string, string> = {
  small: '10px', medium: '13px', large: '17px',
};
const NATIVE_STACK = "'Segoe UI Variable Display','Segoe UI',system-ui,sans-serif";
const DISPLAY_STACK = "'Archivo','Segoe UI',system-ui,sans-serif";

/**
 * A type specimen, not copy: the same two glyphs in every language, exactly like
 * the colour triad beside it. It is inside an `aria-hidden` preview, so it is
 * decoration on a card whose real label is the translated value name.
 */
const SPECIMEN = 'Ag';
const MOTION_GLYPH: Record<string, string> = { system: '››', full: '›››', reduced: '||' };
const SOUND_GLYPH: Record<string, string> = { on: '♪', off: '—' };

/** 🔴 The two literals here are the ONE place a colour may be hard-coded: an
    appearance preview must show light and dark whatever the app is currently
    painting, so following the theme would make the card lie. */
const PREVIEW_LIGHT = 'oklch(.97 0 0)';
const PREVIEW_DARK = 'oklch(.2 0 0)';

function AxisPreview({ axis, value, prefs }: { axis: Axis; value: string; prefs: AxisPrefs }) {
  if (axis.preview === 'radius') {
    return (
      <span className="prev" aria-hidden="true">
        <span className="prev-radius" style={{ borderRadius: RADIUS_PREVIEW[value] ?? '4px' }} />
      </span>
    );
  }
  if (axis.preview === 'swatch') {
    return (
      <span className="prev" aria-hidden="true">
        {/* both attributes, so the tokens resolve from THAT treatment */}
        <span className="prev-swatch" data-palette={value} data-appearance={resolveAppearance(prefs)}>
          <i style={{ background: 'var(--c-panel)' }} />
          <i style={{ background: 'var(--c-ink-2)' }} />
          <i style={{ background: 'var(--c-accent)' }} />
        </span>
      </span>
    );
  }
  if (axis.preview === 'density') {
    return (
      <span className="prev" aria-hidden="true">
        <span className="prev-density" style={{ gap: DENSITY_PREVIEW[value] ?? '4px' }}>
          <i />
          <i />
          <i />
        </span>
      </span>
    );
  }
  if (axis.preview === 'typescale') {
    return (
      <span className="prev" aria-hidden="true">
        <span style={{ fontSize: TYPE_SCALE_PREVIEW[value] ?? '13px', fontFamily: 'var(--ff-display)' }}>
          {SPECIMEN}
        </span>
      </span>
    );
  }
  if (axis.preview === 'font') {
    return (
      <span className="prev" aria-hidden="true">
        <span style={{ fontSize: '14px', fontFamily: value === 'native' ? NATIVE_STACK : DISPLAY_STACK }}>
          {SPECIMEN}
        </span>
      </span>
    );
  }
  if (axis.preview === 'appearance') {
    return (
      <span className="prev" aria-hidden="true">
        <span className="prev-appearance">
          <i style={{ background: value === 'dark' ? PREVIEW_DARK : PREVIEW_LIGHT }} />
          <i style={{ background: value === 'light' ? PREVIEW_LIGHT : PREVIEW_DARK }} />
        </span>
      </span>
    );
  }
  if (axis.preview === 'surface') {
    return (
      <span className="prev" aria-hidden="true">
        <span
          className="prev-radius"
          style={{
            borderRadius: '3px',
            borderColor: 'transparent',
            background:
              value === 'translucent'
                ? 'color-mix(in oklab, var(--c-ink) 22%, transparent)'
                : 'var(--c-ink-3)',
          }}
        />
      </span>
    );
  }
  if (axis.preview === 'cursor') {
    return (
      <span className="prev" aria-hidden="true">
        <span
          className="prev-radius"
          style={{ borderRadius: '999px', width: '14px', height: '14px', opacity: value === 'off' ? 0.3 : 1 }}
        />
      </span>
    );
  }
  if (axis.preview === 'motion') {
    return (
      <span className="prev" aria-hidden="true">
        <span>{MOTION_GLYPH[value] ?? MOTION_GLYPH.system}</span>
      </span>
    );
  }
  return (
    <span className="prev" aria-hidden="true">
      <span>{SOUND_GLYPH[value] ?? SOUND_GLYPH.off}</span>
    </span>
  );
}

export function ThemePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const prefs = useStore((s) => s.prefs);
  const setAxis = useStore((s) => s.setAxis);

  return (
    <ModalOverlay className="sheet-scrim" isOpen={open} onOpenChange={(o) => { if (!o) onClose(); }} isDismissable>
      <Modal className="sheet">
        <Dialog className="sheet-dlg" aria-label={t('theme.title')}>
          <div className="sheet-hd">
            <h2 className="t-md wide">{t('theme.title')}</h2>
            <button
              className="btn btn-ghost btn-sm"
              type="button"
              style={{ marginInlineStart: 'auto' }}
              onClick={onClose}
            >
              <span className="btn-label">{t('common.close')}</span>
            </button>
          </div>

          <div className="sheet-bd">
            {AXES.map((axis) => (
              <RadioGroup
                className="axis"
                key={axis.key}
                value={axisValue(prefs, axis.key)}
                onChange={(value) => { setAxis(axis.key, value); }}
              >
                <Label className="axis-name caps">{t(axis.labelKey)}</Label>
                <div className="cards">
                  {axis.values.map((v) => (
                    <Radio className="card-sel" value={v.value} key={v.value}>
                      <AxisPreview axis={axis} value={v.value} prefs={prefs} />
                      <span>{t(`theme.value.${v.value}`, v.label)}</span>
                    </Radio>
                  ))}
                </div>
              </RadioGroup>
            ))}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
