import { afterEach, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => {
  let row: Record<string, unknown> | null = null;
  let readError: Error | null = null;
  let onBroadcast: (() => void) | null = null;
  let onStatus: ((status: string) => void) | null = null;
  const reads = vi.fn();
  const removeChannel = vi.fn();
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn(() => {
      reads();
      return Promise.resolve({ data: row, error: readError });
    }),
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.limit.mockReturnValue(query);
  const channel = {
    on: vi.fn((_type: string, _filter: unknown, callback: () => void) => {
      onBroadcast = callback;
      return channel;
    }),
    subscribe: vi.fn((callback: (status: string) => void) => {
      onStatus = callback;
      return channel;
    }),
  };
  return {
    client: { from: vi.fn(() => query), channel: vi.fn(() => channel), removeChannel },
    reads,
    removeChannel,
    setRow: (next: Record<string, unknown> | null) => {
      row = next;
    },
    setReadError: (next: Error | null) => {
      readError = next;
    },
    broadcast: () => onBroadcast?.(),
    status: (value: string) => onStatus?.(value),
  };
});

vi.mock('./auth', () => ({ supabase: () => state.client }));
vi.mock('./logger', () => ({ logger: { warn: vi.fn() }, errorText: () => 'error' }));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  state.setRow(null);
  state.setReadError(null);
});

it('reads the bounded public row on start, rejoin, broadcast and reconnect, then tears down', async () => {
  const windowEvents = new EventTarget();
  const documentEvents = new EventTarget();
  vi.stubGlobal('window', {
    addEventListener: windowEvents.addEventListener.bind(windowEvents),
    removeEventListener: windowEvents.removeEventListener.bind(windowEvents),
    setTimeout,
    clearTimeout,
  });
  vi.stubGlobal('document', {
    visibilityState: 'visible',
    addEventListener: documentEvents.addEventListener.bind(documentEvents),
    removeEventListener: documentEvents.removeEventListener.bind(documentEvents),
  });
  state.setRow({
    version: '1.4.1',
    severity: 'normal',
    reason: 'A required fix.',
    min_native_version: null,
  });
  const { watchReleaseRecord } = await import('./release-feed');
  const seen: string[] = [];
  const stop = watchReleaseRecord((record) => seen.push(record?.version ?? 'none'));
  await vi.waitFor(() => expect(state.reads).toHaveBeenCalledTimes(1));
  expect(state.client.from).toHaveBeenCalledWith('latest_app_releases');

  state.status('SUBSCRIBED');
  await vi.waitFor(() => expect(state.reads).toHaveBeenCalledTimes(2));
  state.setRow({
    version: '1.4.2',
    severity: 'urgent',
    reason: 'A safety fix.',
    min_native_version: null,
  });
  state.broadcast();
  await vi.waitFor(() => expect(seen).toContain('1.4.2'));
  state.setReadError(new Error('offline'));
  state.broadcast();
  await vi.waitFor(() => expect(state.reads).toHaveBeenCalledTimes(4));
  expect(seen.at(-1)).toBe('1.4.2');
  state.setReadError(null);
  windowEvents.dispatchEvent(new Event('online'));
  await vi.waitFor(() => expect(state.reads).toHaveBeenCalledTimes(5));

  stop();
  state.broadcast();
  expect(state.reads).toHaveBeenCalledTimes(5);
  expect(state.removeChannel).toHaveBeenCalled();
});
