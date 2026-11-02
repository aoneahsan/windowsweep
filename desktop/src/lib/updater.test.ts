import { afterEach, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => {
  let phase: 'idle' | 'running' = 'idle';
  const listeners = new Set<(value: { phase: 'idle' | 'running' }) => void>();
  return {
    check: vi.fn(),
    relaunch: vi.fn(),
    track: vi.fn(),
    getPhase: () => phase,
    setPhase: (next: 'idle' | 'running') => {
      phase = next;
      for (const listener of listeners) listener({ phase });
    },
    subscribe: (listener: (value: { phase: 'idle' | 'running' }) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
});

vi.mock('@tauri-apps/plugin-updater', () => ({ check: state.check }));
vi.mock('@tauri-apps/plugin-process', () => ({ relaunch: state.relaunch }));
vi.mock('./analytics', () => ({ track: state.track }));
vi.mock('../state/store', () => ({
  useStore: {
    getState: () => ({ phase: state.getPhase() }),
    subscribe: state.subscribe,
  },
}));

function browser() {
  const events = new EventTarget();
  const documentEvents = new EventTarget();
  vi.stubGlobal('window', {
    __TAURI_INTERNALS__: {},
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    addEventListener: events.addEventListener.bind(events),
    removeEventListener: events.removeEventListener.bind(events),
  });
  vi.stubGlobal('document', {
    visibilityState: 'visible',
    addEventListener: documentEvents.addEventListener.bind(documentEvents),
    removeEventListener: documentEvents.removeEventListener.bind(documentEvents),
  });
  return { events, documentEvents };
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.clearAllMocks();
  state.setPhase('idle');
});

it('downloads during a run but waits until the cleanup finishes before installing', async () => {
  browser();
  vi.stubEnv('DEV', false);
  const install = vi.fn().mockResolvedValue(undefined);
  const download = vi.fn().mockImplementation((onEvent: (event: unknown) => void) => {
    onEvent({ event: 'Started', data: { contentLength: 10 } });
    onEvent({ event: 'Progress', data: { chunkLength: 10 } });
    onEvent({ event: 'Finished' });
    return Promise.resolve();
  });
  state.check.mockResolvedValue({ version: '1.4.0', download, install });
  const { checkForUpdate } = await import('./updater');
  const outcome = await checkForUpdate();
  if (outcome.kind !== 'available') throw new Error('expected an available update');

  state.setPhase('running');
  const progress: (number | null)[] = [];
  const installing = outcome.handle.downloadAndInstall((value) => progress.push(value));
  await vi.waitFor(() => expect(download).toHaveBeenCalledOnce());
  expect(install).not.toHaveBeenCalled();

  state.setPhase('idle');
  await installing;
  expect(install).toHaveBeenCalledWith({ restartAfterInstall: true });
  expect(progress).toEqual([0, 99, 100]);
});

it('defers a restart until the current run settles', async () => {
  browser();
  vi.stubEnv('DEV', false);
  state.relaunch.mockResolvedValue(undefined);
  const { restartApp } = await import('./updater');
  state.setPhase('running');
  const restarting = restartApp();
  expect(state.relaunch).not.toHaveBeenCalled();
  state.setPhase('idle');
  await restarting;
  expect(state.relaunch).toHaveBeenCalledOnce();
});

it('shares the startup check and rechecks on resume and after six hours', async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-10-31T12:00:00Z'));
  const { events, documentEvents } = browser();
  vi.stubEnv('DEV', false);
  state.check.mockResolvedValue(null);
  const { checkForUpdate, watchForUpdates, UPDATE_RECHECK_MS } = await import('./updater');
  const outcomes: string[] = [];
  const stop = watchForUpdates((outcome) => outcomes.push(outcome.kind));
  await checkForUpdate();
  expect(state.check).toHaveBeenCalledTimes(1);
  await Promise.resolve();
  expect(outcomes).toEqual(['none']);

  events.dispatchEvent(new Event('focus'));
  expect(state.check).toHaveBeenCalledTimes(1);
  await vi.advanceTimersByTimeAsync(60_001);
  documentEvents.dispatchEvent(new Event('visibilitychange'));
  await Promise.resolve();
  expect(state.check).toHaveBeenCalledTimes(2);
  await vi.advanceTimersByTimeAsync(UPDATE_RECHECK_MS);
  expect(state.check).toHaveBeenCalledTimes(3);
  stop();
  await vi.advanceTimersByTimeAsync(UPDATE_RECHECK_MS);
  expect(state.check).toHaveBeenCalledTimes(3);
});
