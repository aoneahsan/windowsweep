import { afterEach, expect, it, vi } from 'vitest';

interface TestState {
  session: { access_token: string } | null;
  authReads: number;
  records: Map<string, unknown>;
}

const state = vi.hoisted((): TestState => ({
  session: { access_token: 'test-device-jwt' },
  authReads: 0,
  records: new Map<string, unknown>(),
}));

vi.mock('./config', () => ({
  supabaseConfig: {
    url: 'https://example.supabase.co',
    publishableKey: 'sb_publishable_test',
  },
}));
vi.mock('./storage', () => ({
  readStored: (key: string, fallback: unknown) => state.records.get(key) ?? fallback,
  writeStored: (key: string, value: unknown) => state.records.set(key, value),
}));
vi.mock('./auth', () => ({
  supabase: () => ({
    auth: {
      getSession: () => {
        state.authReads += 1;
        return Promise.resolve({ data: { session: state.session }, error: null });
      },
    },
  }),
}));

import { startAnalytics, track } from './analytics';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it('sends an allowlisted event with a JWT and no client-side GA4 secret, then skips no-session events', async () => {
  vi.stubEnv('DEV', false);
  const fetchMock = vi.fn(() => Promise.resolve(new Response(null, { status: 202 })));
  vi.stubGlobal('fetch', fetchMock);

  await startAnalytics({ ga4IngestEnabled: true }, '1.4.0');
  track('screen.view', { route: '/settings' });
  await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

  const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
  if (typeof init.body !== 'string') throw new Error('analytics request has no JSON body');
  const body = JSON.parse(init.body) as Record<string, unknown>;
  expect(url).toBe('https://example.supabase.co/functions/v1/analytics-ingest');
  expect(init.headers).toMatchObject({ Authorization: 'Bearer test-device-jwt' });
  expect(body).toMatchObject({
    event: 'screen_view',
    app_version: '1.4.0',
    params: { route: '/settings' },
    engagement_time_msec: 1,
  });
  expect(body.client_id).toMatch(/^[0-9a-f-]{36}$/);
  expect(body.session_id).toMatch(/^[1-9][0-9]{0,15}$/);
  expect(JSON.stringify(body)).not.toContain('api_secret');
  expect(state.records.has('windowsweep:analytics-client-id')).toBe(true);
  expect(state.records.has('windowsweep:analytics-session')).toBe(true);

  track('update.check.skipped', { reason: 'C:\\Users\\someone\\private.log' });
  await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
  const [, retryInit] = fetchMock.mock.calls[1] as unknown as [string, RequestInit];
  if (typeof retryInit.body !== 'string') throw new Error('analytics request has no JSON body');
  expect(JSON.parse(retryInit.body)).toMatchObject({
    event: 'update_check_skipped',
    params: { reason: 'other' },
  });

  state.session = null;
  track('control.press', { control: 'home.scan', route: '/' });
  await vi.waitFor(() => expect(state.authReads).toBe(3));
  expect(fetchMock).toHaveBeenCalledTimes(2);
});
