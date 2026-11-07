/** The account's private plan signal: the plan is re-read when it changes, never on a timer. */

import type { RealtimeChannel } from '@supabase/supabase-js';

import { supabase } from './auth';
import { errorText, logger } from './logger';

const RETRY_MAX_MS = 30_000;
/** Focus, a rejoin and a broadcast often arrive together; one re-read answers them all. */
const SETTLE_MS = 250;

/**
 * Watch `plans:<account id>`, the private topic a database trigger broadcasts to when
 * one of the account's subscription or plan-grant rows changes (migration
 * `20261107073129_plan_change_broadcast`). The event carries no data: `onSignal`
 * re-reads through the screen's normal queries. Each successful join, a window that
 * becomes visible or focused, and a network that comes back also re-read, so a
 * signal sent while the socket was down still lands. An anonymous or signed-out
 * session joins nothing, because the topic's policy admits only the account it names.
 *
 * The SDK hands a refreshed access token to the socket itself (`TOKEN_REFRESHED`),
 * so the join stays authorised for the life of the session.
 *
 * @returns teardown that leaves the channel and removes every listener.
 */
export function watchPlanSignal(onSignal: () => void): () => void {
  const sb = supabase();
  if (!sb) return () => undefined;
  let active = true;
  let channel: RealtimeChannel | null = null;
  let retry: ReturnType<typeof setTimeout> | null = null;
  let settle: ReturnType<typeof setTimeout> | null = null;
  let backoff = 1_000;

  const signal = (): void => {
    if (!active || settle) return;
    settle = setTimeout(() => {
      settle = null;
      if (active) onSignal();
    }, SETTLE_MS);
  };

  const leave = (): void => {
    const current = channel;
    channel = null;
    if (current) void sb.removeChannel(current);
  };

  const rejoinLater = (): void => {
    if (!active || retry) return;
    retry = setTimeout(() => {
      retry = null;
      void join();
    }, backoff);
    backoff = Math.min(backoff * 2, RETRY_MAX_MS);
  };

  const join = async (): Promise<void> => {
    leave();
    try {
      const { data, error } = await sb.auth.getSession();
      if (error) throw error;
      const session = data.session;
      if (!active || !session || session.user.is_anonymous) return;
      await sb.realtime.setAuth(session.access_token);
      if (!active) return;
      const joined = sb.channel(`plans:${session.user.id}`, { config: { private: true } });
      channel = joined;
      joined.on('broadcast', { event: 'plan' }, signal).subscribe((status) => {
        // A channel this watcher already left reports CLOSED; only the live one counts.
        if (!active || channel !== joined) return;
        const state = String(status);
        if (state === 'SUBSCRIBED') {
          backoff = 1_000;
          signal();
        } else if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT' || state === 'CLOSED') {
          leave();
          rejoinLater();
        }
      });
    } catch (error) {
      logger.warn('plan signal join failed', { error: errorText(error) });
      rejoinLater();
    }
  };

  const onVisible = (): void => {
    if (document.visibilityState === 'visible') signal();
  };
  const onOnline = (): void => {
    signal();
    if (!channel && !retry) void join();
  };
  document.addEventListener('visibilitychange', onVisible);
  window.addEventListener('focus', onVisible);
  window.addEventListener('online', onOnline);
  void join();

  return () => {
    active = false;
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('focus', onVisible);
    window.removeEventListener('online', onOnline);
    if (retry) clearTimeout(retry);
    if (settle) clearTimeout(settle);
    leave();
  };
}
