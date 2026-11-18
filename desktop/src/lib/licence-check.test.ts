import { describe, expect, it, vi } from 'vitest';

import { checkLicence } from './licence-check';

const key = 'WINDOWSWEEP-WL-TEST-0000';
const response = (verdict: string, status = 200): Response =>
  new Response(JSON.stringify({ data: { verdict } }), { status });

describe('configured client licence', () => {
  it('does not call FilesHub when the build has no key', async () => {
    const request = vi.fn<typeof fetch>();
    expect(await checkLicence('', request)).toBe('active');
    expect(request).not.toHaveBeenCalled();
  });

  it('blocks only definitive refusals and fails open on transport errors', async () => {
    for (const verdict of ['revoked', 'not_found', 'invalid_format']) {
      expect(await checkLicence(key, () => Promise.resolve(response(verdict)))).toBe('inactive');
    }
    for (const verdict of ['valid', 'pending_setup']) {
      expect(await checkLicence(key, () => Promise.resolve(response(verdict)))).toBe('active');
    }
    expect(await checkLicence(key, () => Promise.resolve(response('revoked', 503)))).toBe('active');
    expect(await checkLicence(key, () => Promise.resolve(new Response('unreadable')))).toBe(
      'active'
    );
    expect(await checkLicence(key, () => Promise.reject(new TypeError('offline')))).toBe('active');
  });

  it('opens after the five-second timeout', async () => {
    vi.useFakeTimers();
    try {
      const request: typeof fetch = async (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        });
      const result = checkLicence(key, request);
      await vi.advanceTimersByTimeAsync(5_000);
      expect(await result).toBe('active');
    } finally {
      vi.useRealTimers();
    }
  });
});
