/**
 * The URL axis layer (D-73, GATE 4 round 16) - a URL-state codec, one of the pre-approved classes: its failure is
 * invisible to every gate. The window must SHOW a linked axis (`?radius=large`) and never STORE it, and an explicit
 * choice must end the override. Sync compares stored preferences through `axisValue`, so that path must never see
 * the URL.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

async function themeWithSearch(search: string) {
  vi.resetModules();
  vi.stubGlobal('window', { location: { search } });
  return import('./theme');
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('the URL axis layer', () => {
  it('shows a linked axis over the stored preference, by its key or its attribute name', async () => {
    const theme = await themeWithSearch('?radius=large&type-scale=large');
    const shown = theme.shownPrefs({ radius: 'small', typeScale: 'small' });
    expect(theme.axisValue(shown, 'radius')).toBe('large');
    expect(theme.axisValue(shown, 'typeScale')).toBe('large');
  });

  it('ignores a value the axis does not have', async () => {
    const theme = await themeWithSearch('?density=enormous');
    expect(theme.axisValue(theme.shownPrefs({ density: 'compact' }), 'density')).toBe('compact');
  });

  it('never reaches the stored preferences that sync compares', async () => {
    const theme = await themeWithSearch('?radius=large');
    expect(theme.axisValue({ radius: 'small' }, 'radius')).toBe('small');
  });

  it('ends the override on an explicit choice, so the choice shows', async () => {
    const theme = await themeWithSearch('?radius=large');
    theme.dropUrlOverride('radius');
    expect(theme.axisValue(theme.shownPrefs({ radius: 'small' }), 'radius')).toBe('small');
  });
});
