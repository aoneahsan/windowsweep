/**
 * Home zone 13 - what leaves this machine. `index.html:230-268`.
 *
 * On request rather than in the way, and lifted out of `Home.tsx` when that screen
 * crossed the project's 500-line ceiling. It is a self-contained band with its own
 * data source, so the seam is a real one.
 *
 * 🔴 These were four SWITCHES until 2026-09-07; the owner removed the opt-out, so
 * each destination is now a stated fact carrying an `on` badge. A switch that
 * changes nothing is worse than no switch, and this is the surface a person meets
 * in ordinary use rather than once at first run.
 */

import { useTranslation } from 'react-i18next';

import { DESTINATIONS, type Destination } from '../lib/consent';

/** Brand names, not copy: they are the same in every language. */
const VENDOR: Record<Destination, string> = {
  ga4: 'Google Analytics 4',
  amplitude: 'Amplitude',
  clarity: 'Microsoft Clarity',
  sentry: 'Sentry',
};

export function HomeDestinations() {
  const { t } = useTranslation();
  return (
    <details className="disclose">
      <summary>
        <span className="disclose-line">{t('home.privacySummary')}</span>
        <span className="disclose-more">{t('consent.detailsMore')}</span>
      </summary>
      <div className="disclose-body">
        <p>{t('home.privacyIntro')}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {DESTINATIONS.map((d) => (
            <div key={d} style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--sp-3)' }}>
              <span className="badge badge-outline">{t('consent.badgeOn')}</span>
              <div>
                <div>
                  <span className="t-sm">{t(`consent.provider.${d}.name`)}</span>{' '}
                  <span className="t-xs ink-3">{VENDOR[d]}</span>
                </div>
                <div className="t-xs ink-3">{t(`consent.provider.${d}.what`)}</div>
              </div>
            </div>
          ))}
        </div>
        <p>
          <strong>{t('consent.neverSentLabel')}</strong> {t('consent.neverSent')}
        </p>
        <p>{t('home.privacySignIn')}</p>
      </div>
    </details>
  );
}
