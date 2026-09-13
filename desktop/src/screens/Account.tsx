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
 *
 * 🔴 AND THE ACCOUNT CAN BE DELETED FROM HERE (owner decision D14, 2026-09-12).
 * `/privacy` already promised it could; until now nothing on this screen could.
 * The band at the foot calls `delete_my_account()` and signs out - dummy first, in
 * `account.html`'s `[data-ws-delete]`.
 *
 * 🔴 THE DUMMY'S FRAME (D-38, GATE 4 round 7): the `Optional` eyebrow, the lede's
 * bold "never gated", the card beside the "What is stored, exactly" table, and the
 * Sync band. It was one narrow column carrying two paragraphs of its own words.
 *
 * 🔴 THE SYNC BAND SAYS "LOCAL" IN EVERY STATE, because that is what is true:
 * nothing in this window syncs yet (`lib/sync.ts` has no caller). The dummy's
 * signed-in rows ("Synced 2 minutes ago") describe a wiring that has not landed,
 * and its "What happens when two machines disagree" disclosure describes conflict
 * handling - the newer change wins, with an Undo - that no code performs. That
 * disclosure is withheld rather than shipped as a promise; it arrives with the
 * sync wiring.
 *
 * ⚠️ NOT EXERCISED ON THIS MACHINE. Google is the only provider and it is not
 * enabled on the Supabase project yet, so nobody can sign in here and therefore
 * nobody can reach the signed-in card or the deletion control. What IS verified is
 * the code path and the words; what is NOT is a live deletion. Saying so is the
 * point.
 */

import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useStore } from '../state/store';
import { deleteAccount, signIn, signOut } from '../lib/auth';
import { configuredFeatures } from '../lib/config';
import { controlState, stateOf } from '../lib/control-state';
import { PrimaryButton } from '../components/PrimaryButton';

/**
 * 🔴 The typed confirmation, compared EXACTLY. The label promises "it must match
 * exactly", so `Delete` does not arm the button - a control that quietly accepted
 * a different string would make the one sentence on the screen untrue in the
 * direction that matters least to the product and most to the reader.
 */
const CONFIRM_WORD = 'delete';

/** The five rows of `account.html`'s "What is stored, exactly", in its order. */
const STORED = ['email', 'name', 'settings', 'runs', 'lastSeen'] as const;

/** The dummy's Sync rows (`page-account.js` -> `sync()`), each with its local state. */
const SYNC_ROWS = [
  { key: 'settings', state: 'localOnly' },
  { key: 'runs', state: 'localOnly' },
  { key: 'paths', state: 'never' },
] as const;

/** The avatar's letters: the first two words of the name, or the email's first letter. */
function initials(displayName: string | null, email: string): string {
  const words = (displayName ?? '').trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 0 ? words.slice(0, 2).map((w) => w.charAt(0)) : [email.charAt(0)];
  return letters.join('').toUpperCase();
}

export function Account() {
  const { t } = useTranslation();
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const [busy, setBusy] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /* The deletion control's own three pieces of state. `deleted` outlives `user`
     deliberately: the band disappears the instant the account goes, so without it
     the only acknowledgement of an irreversible action would be a screen quietly
     returning to its signed-out state. */
  const [confirmWord, setConfirmWord] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const features = configuredFeatures();

  function onDelete() {
    setDeleting(true);
    setError(null);
    void deleteAccount()
      .then(() => {
        setUser(null);
        setConfirmWord('');
        setDeleted(true);
      })
      .catch((e: unknown) => { setError(e instanceof Error ? e.message : String(e)); })
      .finally(() => { setDeleting(false); });
  }

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
        <div className="wrap">
          <p className="caps ink-3">{t('account.eyebrow')}</p>
          <h1 className="t-xl wide">{t('account.title')}</h1>
          {/* The approved wording: what sign-in does, and nothing about pricing. */}
          <p className="lede">
            <Trans i18nKey="account.lede" components={{ 1: <strong /> }} />
          </p>
        </div>
      </section>

      <section className="band band-app">
        <div className="wrap">
          <div className="g12">
            <div className="c6">
              <div className="panel pad">
                {user ? (
                  <>
                    <div style={{ display: 'flex', gap: 'var(--sp-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span className="ava ava-lg" aria-hidden="true">
                        {initials(user.displayName, user.email)}
                      </span>
                      <div>
                        <p className="t-md wide">{t('account.signedIn')}</p>
                        <p className="t-sm ink-3">{user.email}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 'var(--sp-5)', flexWrap: 'wrap' }}>
                      <button
                        className="btn"
                        type="button"
                        onClick={onSignOut}
                        disabled={signingOut}
                        {...controlState(stateOf(signingOut))}
                      >
                        <span className="btn-label">{t('account.signOut')}</span>
                      </button>
                    </div>
                    <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-3)' }}>
                      {t('account.signOutNote')}
                    </p>
                  </>
                ) : (
                  <>
                    {/* 🔴 `role="status"`: the account has just been deleted and the
                        band that did it is gone, so this is the only acknowledgement
                        there is. It must reach a screen reader too, and politely -
                        the action has already finished, so nothing is interrupted. */}
                    {deleted ? (
                      <div className="note note-info" style={{ marginBottom: 'var(--sp-4)' }} role="status">
                        <span aria-hidden="true">i</span>
                        <span className="t-sm">{t('account.deleteDone')}</span>
                      </div>
                    ) : null}
                    <p className="caps ink-3">{t('account.cardEyebrow')}</p>
                    <h2 className="t-lg wide">{t('account.cardTitle')}</h2>
                    <p className="t-base">{t('account.cardBody')}</p>
                    <div style={{ marginTop: 'var(--sp-4)' }}>
                      <PrimaryButton
                        control="account.signIn"
                        size="lg"
                        onPress={onSignIn}
                        disabled={busy || !features.signIn}
                        state={stateOf(busy)}
                        label={features.signIn ? t('account.signIn') : t('account.notConfigured')}
                      />
                    </div>
                    <p className="t-sm ink-3">{t('account.browserNote')}</p>
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

            <div className="c6">
              <div className="well pad">
                <h2 className="t-md wide">{t('account.storedTitle')}</h2>
                <div className="xscroll" style={{ marginTop: 'var(--sp-3)' }}>
                  <table className="tbl">
                    <thead>
                      <tr>
                        <th>{t('account.storedColField')}</th>
                        <th>{t('account.storedColWhy')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STORED.map((row) => (
                        <tr key={row}>
                          <td className="t-sm">{t(`account.stored.${row}.field`)}</td>
                          <td className="t-sm ink-3">{t(`account.stored.${row}.why`)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="t-sm ink-3" style={{ marginTop: 'var(--sp-3)' }}>
                  <Trans
                    i18nKey="account.neverStored"
                    components={{ 1: <strong />, 3: <span className="badge badge-outline" /> }}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="band band-well band-tight">
        <div className="wrap">
          <h2 className="t-md wide">{t('account.syncTitle')}</h2>
          <div className="lst panel" style={{ marginTop: 'var(--sp-3)' }}>
            {SYNC_ROWS.map((row) => (
              <div className="lst-i" key={row.key}>
                <div style={{ flex: 1 }}>
                  <div className="t-base">{t(`account.sync.${row.key}`)}</div>
                  <div className="t-sm ink-3">{t(`account.sync.${row.state}`)}</div>
                </div>
                <div className="lst-x">
                  <span className="badge badge-neutral">{t('account.sync.badgeLocal')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔴 DELETE THE ACCOUNT. `account.html`'s `[data-ws-delete]` band, matched.
          Owner decision D14 (2026-09-12): the app's own `/privacy` promised the
          account could be deleted from here, and there was no control behind the
          promise.

          🔴 Rendered only while signed in - there is nothing to delete otherwise -
          and the typed word is the whole friction. No shame language and no
          urgency: this band sits one screen away from a safety surface, and a
          product whose argument is "you see what goes before it goes" cannot make
          leaving feel like a mistake. */}
      {user ? (
        <section className="band band-app band-tight">
          <div className="wrap wrap-narrow">
            <div className="panel pad">
              <h2 className="t-md wide">{t('account.deleteTitle')}</h2>
              {/* Exactly what the cascade does, and nothing more. */}
              <p className="t-sm">{t('account.deleteWhatGoes')}</p>
              <p className="t-sm ink-3">{t('account.deleteWhatStays')}</p>
              <label
                className="t-sm"
                style={{ display: 'block', marginTop: 'var(--sp-4)' }}
                htmlFor="account-delete-confirm"
              >
                {/* `Trans` so the word renders as <code> - the dummy's own styling, and the
                    one thing the reader must copy exactly. */}
                <Trans
                  i18nKey="account.deleteConfirmLabel"
                  values={{ word: CONFIRM_WORD }}
                  components={{ 1: <code className="mono" /> }}
                />
              </label>
              {/* A one-line input, never a textarea - there is one word to type. */}
              <input
                className="field"
                id="account-delete-confirm"
                type="text"
                autoComplete="off"
                spellCheck={false}
                style={{ maxWidth: '16rem', marginTop: 'var(--sp-2)' }}
                value={confirmWord}
                onChange={(e) => { setConfirmWord(e.currentTarget.value); }}
              />
              <div style={{ marginTop: 'var(--sp-4)' }}>
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={onDelete}
                  disabled={deleting || confirmWord.trim() !== CONFIRM_WORD}
                  {...controlState(stateOf(deleting))}
                >
                  <span className="btn-label">{t('account.deleteAction')}</span>
                </button>
              </div>
              {/* The same interrupting treatment sign-in uses, for the same reason:
                  a failure here leaves the account standing while the person
                  believes it is gone. */}
              {error ? (
                <div className="note note-warn" style={{ marginTop: 'var(--sp-3)' }} role="alert">
                  <span aria-hidden="true">⚠</span>
                  <span className="t-sm">{error}</span>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      <div style={{ height: 'var(--sp-16)' }} />
    </>
  );
}
