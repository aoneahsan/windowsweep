/**
 * The account's half of the legal bar (N-001): who is signed in, and `profiles.legal_notice_seen_at`.
 *
 * 🔴 Reached only through a dynamic import from `LegalNotice`, and only in a build with Supabase
 * keys, so a build without them never pulls the client in - the seam `App.tsx` keeps for sync.
 *
 * 🔴 PUSHED, NEVER POLLED. Who is signed in arrives on the SDK's own auth events: `INITIAL_SESSION`
 * is the settled answer at boot (the law decides once, after auth has settled) and a later sign-in
 * arrives as `SIGNED_IN`. Nothing here runs on a timer.
 *
 * Reads: one row, the caller's own, filtered on the column `profiles_select_own` compares - once at
 * a launch whose PC has not seen the bar or whose account was not yet taught, and once per sign-in.
 * Writes: only `mark_legal_notice_seen()`, which acts for `auth.uid()` alone, keeps the first moment
 * in server time, and is the column's only writer (no UPDATE on it is granted to this window,
 * `20261031082152_v140_privileges.sql`).
 */

import { supabase } from './auth';
import { errorText, logger } from './logger';

/**
 * Call `onAccount` with the signed-in account's id, or null when nobody is signed in. The anonymous
 * session a device keeps for its run allowance is not an account.
 */
export function watchAccount(onAccount: (uid: string | null) => void): () => void {
  const sb = supabase();
  if (!sb) {
    onAccount(null);
    return () => undefined;
  }
  let active = true;
  const { data } = sb.auth.onAuthStateChange((_event, session) => {
    const uid = session && !session.user.is_anonymous ? session.user.id : null;
    /* Deferred: the SDK holds its auth lock while it notifies, and the profile read goes through it. */
    window.setTimeout(() => {
      if (active) onAccount(uid);
    }, 0);
  });
  return () => {
    active = false;
    data.subscription.unsubscribe();
  };
}

/**
 * When the account saw the bar: an ISO time, null when it never has, or undefined when the row
 * could not be read - a failed read is never mistaken for "never seen".
 */
export async function readAccountNotice(uid: string): Promise<string | null | undefined> {
  const sb = supabase();
  if (!sb) return undefined;
  try {
    // bounded: one row - the caller's own, by the policy's own condition.
    const { data, error } = await sb
      .from('profiles')
      .select('legal_notice_seen_at')
      .eq('user_id', uid)
      .maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    const seenAt: unknown = data.legal_notice_seen_at;
    return typeof seenAt === 'string' ? seenAt : null;
  } catch (error) {
    logger.warn('legal notice: the account record could not be read', { error: errorText(error) });
    return undefined;
  }
}

/** Tell the account the bar was seen. A failure is logged; the next launch teaches it again. */
export async function markAccountNotice(): Promise<void> {
  const sb = supabase();
  if (!sb) return;
  try {
    const { error } = await sb.rpc('mark_legal_notice_seen');
    if (error) throw error;
  } catch (error) {
    logger.warn('legal notice: the account could not be told', { error: errorText(error) });
  }
}
