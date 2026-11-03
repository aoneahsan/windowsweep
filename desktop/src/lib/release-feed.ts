/** Public release-record read and broadcast signal for the desktop window. */

import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

import { errorText, logger } from './logger';
import { parseReleaseRecord, type ReleaseRecord } from './release-state';

/** Development builds observe the test channel; a shipped build observes production. */
export const RELEASE_CHANNEL = import.meta.env.DEV ? 'test' : 'production';
const TOPIC = `releases:desktop:${RELEASE_CHANNEL}`;
const RETRY_MAX_MS = 30_000;

/**
 * A broadcast is only a signal. Every signal and successful subscription re-reads
 * the one public view row, so a reconnect closes the missed-message gap.
 */
export function watchReleaseRecord(onRecord: (record: ReleaseRecord | null) => void): () => void {
  let active = true;
  let client: SupabaseClient | null = null;
  let pending: Promise<void> | null = null;
  let rerun = false;
  let channel: RealtimeChannel | null = null;
  let retry: ReturnType<typeof setTimeout> | null = null;
  let backoff = 1_000;

  const read = (): void => {
    if (!active || !client) return;
    if (pending) {
      rerun = true;
      return;
    }
    const work = (async () => {
      try {
        // bounded: the public view holds one row per platform and channel.
        const { data, error } = await client
          .from('latest_app_releases')
          .select('version,severity,reason,min_native_version')
          .eq('platform', 'desktop')
          .eq('channel', RELEASE_CHANNEL)
          .limit(1)
          .maybeSingle();
        if (error) throw error;
        if (active) onRecord(parseReleaseRecord(data));
      } catch (error) {
        logger.warn('release record read failed', { error: errorText(error) });
        // Preserve a release already seen in this run while the network recovers.
      }
    })().finally(() => {
      if (pending === work) pending = null;
      if (rerun && active) {
        rerun = false;
        read();
      }
    });
    pending = work;
  };

  const leave = (sb: SupabaseClient): void => {
    if (channel) void sb.removeChannel(channel);
    channel = null;
  };

  const join = (): void => {
    const sb = client;
    if (!active || !sb) return;
    leave(sb);
    channel = sb
      .channel(TOPIC)
      .on('broadcast', { event: 'release' }, read)
      .subscribe((status) => {
        if (!active) return;
        // The SDK types these wire values as a string enum. Convert once so
        // comparisons do not depend on a transitive package import.
        const state = String(status);
        if (state === 'SUBSCRIBED') {
          backoff = 1_000;
          read();
        } else if (state === 'CHANNEL_ERROR' || state === 'TIMED_OUT' || state === 'CLOSED') {
          leave(sb);
          if (!retry) {
            retry = window.setTimeout(() => {
              retry = null;
              join();
            }, backoff);
            backoff = Math.min(backoff * 2, RETRY_MAX_MS);
          }
        }
      });
  };

  const onVisible = (): void => {
    if (document.visibilityState === 'visible') read();
  };
  const onOnline = (): void => {
    read();
    if (!channel && !retry) join();
  };
  void import('./auth').then(
    ({ supabase }) => {
      if (!active) return;
      client = supabase();
      if (!client) return;
      read();
      join();
    },
    (error: unknown) => {
      logger.warn('release client unavailable', { error: errorText(error) });
    }
  );
  document.addEventListener('visibilitychange', onVisible);
  window.addEventListener('focus', onVisible);
  window.addEventListener('online', onOnline);

  return () => {
    active = false;
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('focus', onVisible);
    window.removeEventListener('online', onOnline);
    if (retry) window.clearTimeout(retry);
    if (client) leave(client);
  };
}
