import { afterEach, expect, it, vi } from 'vitest';
import { startAnalytics, track } from './analytics';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

it('registers the existing Measurement ID and sends scrubbed events through gtag commands', async () => {
  vi.stubEnv('DEV', false);
  const script = {
    async: false,
    src: '',
    onload: null as null | (() => void),
    onerror: null as null | (() => void),
  };
  vi.stubGlobal('document', {
    createElement: () => script,
    head: { appendChild: () => script.onload?.() },
  });
  vi.stubGlobal('window', { dataLayer: [] as unknown[] });

  await startAnalytics({ ga4MeasurementId: 'G-TEST123' }, '1.4.0');
  expect(script.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-TEST123');
  const commands = window.dataLayer ?? [];
  expect(commands).toHaveLength(2);
  expect(
    commands.every((command) => Object.prototype.toString.call(command) === '[object Arguments]')
  ).toBe(true);
  expect(Array.from(commands[1] as IArguments)).toEqual([
    'config',
    'G-TEST123',
    { send_page_view: false, app_version: '1.4.0' },
  ]);

  track('screen.view', { route: '/settings' });
  track('control.press', { control: 'C:\\Users\\someone\\private.log' });
  expect(Array.from(commands[2] as IArguments)).toEqual([
    'event',
    'screen_view',
    { route: '/settings' },
  ]);
  expect(Array.from(commands[3] as IArguments)).toEqual([
    'event',
    'control_press',
    { control: '<path>' },
  ]);
  expect(JSON.stringify(commands)).not.toContain('api_secret');
});
