/** FilesHub verifies a configured client build; the owner build carries no key. */

import { whiteLabelKey } from './config';
import { useLicenceState } from '../state/licence';

const VERIFY_URL = 'https://fileshub.zaions.com/api/licensing/v1/licenses/verify';
const TIMEOUT_MS = 5_000;
const INACTIVE_VERDICTS = new Set(['revoked', 'not_found', 'invalid_format']);

export type LicenceCheckResult = 'active' | 'inactive';

/** Whether this build has a client licence to verify. */
export const licenceCheckEnabled = whiteLabelKey.length > 0;

/**
 * A definitive refusal blocks a configured client build. Missing network, an
 * unreadable answer and server errors let the app open until its next check.
 */
export async function checkLicence(
  key: string = whiteLabelKey,
  request: typeof fetch = fetch
): Promise<LicenceCheckResult> {
  if (!key.trim()) return 'active';

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = new URL(VERIFY_URL);
    url.searchParams.set('key', key);
    const response = await request(url, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'omit',
      signal: controller.signal,
    });
    if (response.status >= 500) return 'active';
    const payload: unknown = await response.json();
    if (typeof payload !== 'object' || payload === null || !('data' in payload)) {
      return 'active';
    }
    const data = payload.data;
    if (typeof data !== 'object' || data === null || !('verdict' in data)) {
      return 'active';
    }
    return typeof data.verdict === 'string' && INACTIVE_VERDICTS.has(data.verdict)
      ? 'inactive'
      : 'active';
  } catch {
    return 'active';
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

/** Check at launch and each focus event; a stale response cannot replace a newer one. */
export function bindLicenceCheck(): () => void {
  if (!licenceCheckEnabled) return () => undefined;

  let generation = 0;
  let bound = true;
  const run = () => {
    const current = ++generation;
    void checkLicence().then((result) => {
      if (current === generation) useLicenceState.getState().setInactive(result === 'inactive');
    });
  };

  // StrictMode tears down its first development effect before this microtask.
  queueMicrotask(() => {
    if (bound) run();
  });
  window.addEventListener('focus', run);
  return () => {
    bound = false;
    generation++;
    window.removeEventListener('focus', run);
  };
}
