/**
 * Home zones 7 + 8 - the promise, and the argument on request. `index.html:160-207`.
 *
 * These two carried 106 of Home's 444 words in the dummy's first draft. What a
 * nervous person needs is the promise; the proof is for whoever asks for it - so
 * the sentence is always visible and the enforcement sits behind a disclosure.
 *
 * 🔴 THE CHIP FIELD IS FILLED FROM THE ENGINE, and `pending.protectedChips` is
 * gone. That declaration said the engine "publishes no readable list" of its
 * protected paths, which the 1.2.0 `--list --json` ended: it emits
 * `protected.subtrees` - this machine's real folders, built by `Initialize-Safety`
 * - and `protected.categories`, the same sentences `--list-targets` prints, both
 * from one constant. Self-test check [18b] asserts that parity, which is what
 * makes it safe to print here: the window cannot show a narrower promise than the
 * command line does.
 *
 * 🔴 NEVER invent, extend or abridge either list. It is a safety guarantee, so a
 * hand-written entry would be a promise nothing enforces and a dropped one would
 * understate what is actually refused. Both are rendered whole, from the catalogue,
 * or not at all: an engine that published neither says so rather than showing an
 * empty field that reads as "nothing is protected".
 *
 * 🔴 The category sentences are DATA, not UI copy. They arrive from the engine's
 * own constant and are printed verbatim, so they are not keyed - keying them would
 * create a second wording that is free to drift from what the tool itself says.
 * Every label and heading around them is keyed.
 */

import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';

export function HomeSafety() {
  const { t } = useTranslation();
  const protectedPaths = useStore((s) => s.catalogue?.protected);
  const subtrees = protectedPaths?.subtrees ?? [];
  const categories = protectedPaths?.categories ?? [];

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
              {subtrees.length === 0 && categories.length === 0 ? (
                /* Before the catalogue has loaded, and on an engine older than
                   1.2.0 that published neither list. Saying so is the only honest
                   option: an empty chip field would read as an empty promise. */
                <p className="t-xs ink-3">{t('home.protectedUnread')}</p>
              ) : (
                <>
                  <div className="chipfield">
                    {subtrees.map((path) => (
                      <span className="chip" key={path} title={t('home.protectedChipTitle')}>
                        {path}
                      </span>
                    ))}
                  </div>
                  {categories.length > 0 ? (
                    <>
                      <p className="t-xs ink-3" style={{ marginTop: 'var(--sp-4)' }}>
                        {t('home.protectedCategoriesLead')}
                      </p>
                      {/* A real list, because it is one and a screen reader should
                          count it - with its box stated rather than inherited from
                          the user agent, which has no `ul` reset in this app.
                          Logical properties, so it is correct in RTL. */}
                      <ul
                        className="t-xs ink-3"
                        style={{
                          margin: 'var(--sp-2) 0 0',
                          paddingInlineStart: 'var(--sp-5)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 'var(--sp-1)',
                        }}
                      >
                        {categories.map((sentence) => (
                          <li key={sentence}>{sentence}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}
