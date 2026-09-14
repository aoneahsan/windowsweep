import { Trans, useTranslation } from 'react-i18next';

import { formatBytesParts } from '../lib/format';

/**
 * The hero's figure - `.hero-num`, the number with its unit in its own `.unit`
 * span, printed as `fmt.bytesParts` does (two decimals, D-46). Home's hero and the
 * Run screen's share it because in the dummy they are one component.
 *
 * `null` is the window's honest `not measured`. `upTo` words the figure as the upper
 * bound it is (D-60, GATE 4 round 9): `run.html`'s "up to" sits in a `.unit` span
 * before the number, and the whole phrase is ONE key, so a language that puts the
 * qualifier after the number reorders it in its catalogue and nowhere else.
 */
export function HeroFigure({ bytes, upTo = false }: { bytes: number | null; upTo?: boolean }) {
  const { t } = useTranslation();
  if (bytes === null) {
    return (
      <p className="hero-num">
        <span>{t('home.notMeasured')}</span>
      </p>
    );
  }
  const parts = formatBytesParts(bytes);
  return (
    <p className="hero-num">
      {upTo ? (
        <Trans
          i18nKey="run.heroUpTo"
          values={{ value: parts.value, unit: parts.unit }}
          components={{ 1: <span className="unit" />, 2: <span />, 3: <span className="unit" /> }}
        />
      ) : (
        <>
          <span>{parts.value}</span>
          <span className="unit">{parts.unit}</span>
        </>
      )}
    </p>
  );
}
