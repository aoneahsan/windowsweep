/**
 * The sign-in's loopback address - pure logic whose wrongness is invisible, one of the pre-approved classes. The
 * defect it guards shipped in 1.3.0 and 1.3.1: every gate was green and every desktop sign-in was refused at its last
 * step, because the address carried no state for the reply to bring back.
 *
 * Supabase's two appends are reproduced as GoTrue v2.197.0 writes them: parse `redirect_to`, keep its query, set
 * `code` (success) or `error` (a refusal), re-encode.
 */
import { describe, expect, it } from 'vitest';

import { loopbackRedirect } from './oauth-redirect';

const STATE = '0b3f1c2e-4d5a-4b6c-8d7e-9f0a1b2c3d4e';

/** What reaches the browser after Supabase appends one parameter to `redirect_to`. */
function supabaseAppends(redirectTo: string, key: string, value: string): URL {
  const url = new URL(redirectTo);
  url.searchParams.set(key, value);
  return new URL(url.toString());
}

describe('the loopback redirect', () => {
  it('is the listener on 127.0.0.1 at its port, with the state in the query and no path before it', () => {
    const redirect = loopbackRedirect(53211, STATE);
    expect(redirect).toBe(`http://127.0.0.1:53211?state=${STATE}`);
  });

  it('brings the state back beside the code on success', () => {
    const reply = supabaseAppends(loopbackRedirect(53211, STATE), 'code', 'a1b2c3');
    expect(reply.host).toBe('127.0.0.1:53211');
    expect(reply.searchParams.get('code')).toBe('a1b2c3');
    expect(reply.searchParams.get('state')).toBe(STATE);
  });

  it('brings the state back beside the error on a refusal', () => {
    const reply = supabaseAppends(loopbackRedirect(53211, STATE), 'error', 'access_denied');
    expect(reply.searchParams.get('error')).toBe('access_denied');
    expect(reply.searchParams.get('state')).toBe(STATE);
  });
});
