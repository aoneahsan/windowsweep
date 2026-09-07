/**
 * Home zones 7 + 8 - the promise, and the argument on request. `index.html:160-207`.
 *
 * These two carried 106 of Home's 444 words in the dummy's first draft. What a
 * nervous person needs is the promise; the proof is for whoever asks for it - so
 * the sentence is always visible and the enforcement sits behind a disclosure.
 *
 * 🔴 The chip field the dummy fills with protected locations is DECLARED, not
 * filled: `pending.protectedChips` (pending-wave). The engine protects paths
 * through four separate mechanisms in `lib/safety.ps1` - exact paths, subtrees,
 * wildcard patterns and basenames - and publishes none of them in `--list --json`.
 * A short list printed here would read as the whole guarantee and understate it,
 * so the declaration names the command that does print the full one instead.
 * 🔴 Never invent a protected path: that list is a safety guarantee.
 */

import { useTranslation } from 'react-i18next';

export function HomeSafety() {
  const { t } = useTranslation();

  return (
    <section className="band band-bleed band-tight">
      <div className="wrap rise">
        <p className="assure">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3 4 6.5v5c0 4.6 3.2 8.6 8 9.5 4.8-.9 8-4.9 8-9.5v-5z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span>{t('home.assure')}</span>
        </p>

        <details className="disclose" style={{ marginTop: 'var(--sp-4)' }}>
          <summary>
            <span className="disclose-line">{t('home.chokeSummary')}</span>
            <span className="disclose-more">{t('consent.detailsMore')}</span>
          </summary>
          <div className="disclose-body">
            <p>{t('home.chokeBody')}</p>

            <div className="choke-out">
              <div className="choke-out-row">
                <span className="badge badge-danger">{t('home.chokeRefused')}</span>
                <span className="t-sm ink-2">{t('home.chokeRefusedWhat')}</span>
              </div>
              <div className="choke-out-row">
                <span className="badge badge-warn">{t('home.chokeRecycle')}</span>
                <span className="t-sm ink-2">{t('home.chokeRecycleWhat')}</span>
              </div>
              <div className="choke-out-row">
                <span className="badge badge-accent">{t('home.chokeDeleted')}</span>
                <span className="t-sm ink-2">{t('home.chokeDeletedWhat')}</span>
              </div>
            </div>

            <div>
              <p className="caps ink-3" style={{ marginBottom: 'var(--sp-3)' }}>
                {t('home.protectedTitle')}
              </p>
              {/* The stated gap that stands where the chip field would be. */}
              <p className="t-xs ink-3">{t('pending.protectedChips')}</p>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
