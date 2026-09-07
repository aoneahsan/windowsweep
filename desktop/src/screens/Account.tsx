/**
 * Account - optional, and it gates nothing.
 *
 * Translated from `account.html`, with the wording the owner approved on
 * 2026-09-05: the screen says what signing in *does* and makes no claim about
 * pricing. The earlier line asserted there was no paid tier and nothing to buy,
 * which is a claim that outlives the decision it describes.
 *
 * 🔴 Sign-in is never a gate. Every cleanup capability works signed out, and this
 * screen is reachable and useful either way. When the OAuth client is not
 * configured in the build, the button says so instead of failing on press.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { signIn, signOut } from '../lib/auth';
import { configuredFeatures } from '../lib/config';
import { controlState, stateOf } from '../lib/control-state';

export function Account() {
  const { t } = useTranslation();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const [busy, setBusy] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const features = configuredFeatures();

  function onSignIn() {
    setBusy(true);
    setError(null);
    void signIn()
      .then(setUser)
      .catch((e: unknown) => { setError(e instanceof Error ? e.message : String(e)); })
      .finally(() => { setBusy(false); });
  }

  /* 🔴 Sign-in opens a browser and waits for a redirect - the slowest thing on
     any of these screens, and until now the only sign that it had started was
     nothing at all. `busy` was already tracked and never rendered. */
  function onSignOut() {
    setSigningOut(true);
    void signOut().finally(() => {
      setUser(null);
      setSigningOut(false);
    });
  }

  return (
    <>
      <section className="band band-app band-tight">
        <div className="wrap wrap-narrow">
          <p className="caps ink-3">{t('nav.account')}</p>
          <h1 className="t-xl wide">{t('account.title')}</h1>
          {/* The approved wording: what sign-in does, and nothing about pricing. */}
          <p className="lede">{t('account.lede')}</p>
        </div>
      </section>

      <section className="band band-app band-tight">
        <div className="wrap wrap-narrow">
          <div className="panel pad">
            {user ? (
              <>
                <div className="lst">
                  <div className="lst-i">
                    <div style={{ flex: 1 }}>
                      <div className="t-base">{user.displayName ?? user.email}</div>
                      <div className="t-sm ink-3">{user.email}</div>
                    </div>
                    <div className="lst-x">
                      <button
                        className="btn btn-sm"
                        type="button"
                        onClick={onSignOut}
                        disabled={signingOut}
                        {...controlState(stateOf(signingOut))}
                      >
                        <span className="btn-label">{t('account.signOut')}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-3)' }}>
                  {t('account.signOutNote')}
                </p>
              </>
            ) : (
              <>
                <p className="t-sm">{t('account.whatSyncs')}</p>
                <p className="t-sm ink-3">{t('account.whatNeverSyncs')}</p>
                <div style={{ marginTop: 'var(--sp-4)' }}>
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={busy || !features.signIn}
                    onClick={onSignIn}
                    {...controlState(stateOf(busy))}
                  >
                    <span className="btn-label">
                      {features.signIn ? t('account.signIn') : t('account.notConfigured')}
                    </span>
                  </button>
                </div>
                {!features.signIn ? (
                  <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-2)' }}>
                    {t('account.notConfiguredNote')}
                  </p>
                ) : null}
                {/* 🔴 `role="alert"`: a failed sign-in must interrupt, because the
                    person is about to act on the belief that it worked. */}
                {error ? (
                  <div className="note note-warn" style={{ marginTop: 'var(--sp-3)' }} role="alert">
                    <span aria-hidden="true">⚠</span>
                    <span className="t-sm">{error}</span>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
