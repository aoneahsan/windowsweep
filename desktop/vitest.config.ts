/**
 * The unit-test runner's own config - deliberately NOT the app's `vite.config.ts`.
 *
 * That config runs the catalogue-key gate, React and Tailwind, none of which a unit test
 * needs. The tests here are the fleet's pre-approved classes only - pure logic whose
 * wrongness is invisible - so they need the `@` alias and a Node environment, nothing else.
 *
 * 🔴 `TZ` is fixed to a zone WITH daylight saving. `history-dates.ts` counts local calendar
 * days, and the day the clocks change is 23 or 25 hours long; on this machine's own zone
 * (UTC+5, no DST) that case could never run, so a regression there would pass here and
 * surface only for someone in Europe or North America. The test asserts the zone really has
 * DST before it trusts any answer.
 */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    env: { TZ: 'America/New_York' },
  },
});
