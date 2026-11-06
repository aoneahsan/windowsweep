/**
 * The legal bar's DECISION (N-001; `legal-notice.md`; desktop `AMENDMENTS-3.md`, 2026-11-06,
 * approved under D90). Eager, in the root layout beside the release gate; the bar itself
 * (`LegalBar`) loads only when it is drawn, as the dummy's `app.js` loads `legal-bar.js`.
 *
 * Decided ONCE, after auth has settled, and never shown and then hidden:
 *  - this PC has seen it: nothing to draw, at once - the account is still taught once it is known;
 *  - a build with no account, or nobody signed in: owed;
 *  - signed in: the account's own record answers, and teaches this PC when it saw the bar elsewhere.
 *
 * Owed, it is drawn on the next page that can carry it - never a task page, never beside a release
 * notice or block, which takes the corner first - and marked seen on this PC and on the account the
 * moment it is drawn. A task page or a release surface arriving while it is up closes it.
 */

import { lazy, Suspense, useCallback, useEffect, useRef } from 'react';
import { useRouterState } from '@tanstack/react-router';

import { configuredFeatures } from '../lib/config';
import { markNoticeSeen, pageTakesBar, planNotice, readNotice, settlePhase } from '../lib/consent';
import { errorText, logger } from '../lib/logger';
import { useNotices } from '../state/notices';

const LegalBar = lazy(() => import('./LegalBar').then((m) => ({ default: m.LegalBar })));

type AccountApi = typeof import('../lib/legal-account');

/** Move the phase on a decision; `settlePhase` is why it only ever moves forward. */
function settle(show: boolean): void {
  const { legal, setLegal } = useNotices.getState();
  setLegal(settlePhase(legal, show));
}

export function LegalNotice() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const phase = useNotices((s) => s.legal);
  const release = useNotices((s) => s.release);
  /* Who is signed in, and whose record has been read: written by the auth events, read when the bar draws. */
  const accountRef = useRef<{ api: AccountApi | null; uid: string | null; read: string | null }>({
    api: null,
    uid: null,
    read: null,
  });

  useEffect(() => {
    let active = true;
    let stop: (() => void) | null = null;
    /* A repeat launch is decided at once, and so is a build with no account; only a PC that has
       not seen the bar waits for the account's answer. */
    const seen = readNotice().seen;
    if (seen) settle(false);
    if (!configuredFeatures().signIn) {
      if (!seen) settle(true);
      return;
    }
    void import('../lib/legal-account').then(
      (api) => {
        if (!active) return;
        accountRef.current.api = api;
        stop = api.watchAccount((uid) => {
          const known = accountRef.current;
          known.uid = uid;
          if (uid === null) {
            known.read = null;
            settle(!readNotice().seen);
            return;
          }
          if (known.read === uid) return;
          void api.readAccountNotice(uid).then((seenAt) => {
            if (!active || known.uid !== uid) return;
            if (seenAt !== undefined) known.read = uid;
            const plan = planNotice(
              readNotice(),
              seenAt === undefined ? { kind: 'unknown' } : { kind: 'read', seenAt }
            );
            if (plan.teachDevice !== null) markNoticeSeen(plan.teachDevice);
            if (plan.teachAccount) void api.markAccountNotice();
            settle(plan.show);
          });
        });
      },
      (error: unknown) => {
        logger.warn('legal notice: the account module did not load', { error: errorText(error) });
        if (active) settle(!readNotice().seen);
      }
    );
    return () => {
      active = false;
      stop?.();
    };
  }, []);

  /* Marked seen the moment it is drawn, here and on the account; a second call is a no-op. */
  const shown = useCallback(() => {
    const { legal, setLegal } = useNotices.getState();
    if (legal !== 'due') return;
    markNoticeSeen();
    const { api, uid } = accountRef.current;
    if (api && uid !== null) void api.markAccountNotice();
    setLegal('open');
  }, []);

  const closed = useCallback(() => {
    useNotices.getState().setLegal('done');
  }, []);

  const allowed = pageTakesBar(path, release);
  if (phase !== 'open' && !(phase === 'due' && allowed)) return null;
  return (
    <Suspense fallback={null}>
      <LegalBar away={!allowed} onShown={shown} onClose={closed} />
    </Suspense>
  );
}
