/** The 1.3.2 values must survive the switch without changing physical keys. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { authStorage, readStored, storage, writeStored } from './storage';

const records = new Map<string, string>();
const localStorage = {
  get length() {
    return records.size;
  },
  key(index: number) {
    return [...records.keys()][index] ?? null;
  },
  getItem(key: string) {
    return records.get(key) ?? null;
  },
  setItem(key: string, value: string) {
    records.set(key, value);
  },
  removeItem(key: string) {
    records.delete(key);
  },
  clear() {
    records.clear();
  },
};

beforeEach(() => {
  records.clear();
  vi.stubGlobal('window', { localStorage });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('desktop strata migration', () => {
  it('adopts a wrapped 1.3.2 value at the same physical key', () => {
    records.set('windowsweep:prefs', JSON.stringify({ v: { theme: 'light', density: 'compact' } }));

    expect(readStored('windowsweep:prefs', {})).toEqual({ theme: 'light', density: 'compact' });
    expect(storage.getSync('prefs', { storage: 'localStorage' })).toEqual({
      theme: 'light',
      density: 'compact',
    });
    const physical = JSON.parse(records.get('windowsweep:prefs') ?? '{}') as Record<
      string,
      unknown
    >;
    expect(physical.value).toEqual({ theme: 'light', density: 'compact' });
    expect(physical).not.toHaveProperty('v');
    expect([...records.keys()]).toEqual(['windowsweep:prefs']);
  });

  it('does not let an old consent acknowledgement suppress the new legal notice', () => {
    records.set('windowsweep:consent', JSON.stringify({ v: { seen: true, seenAt: '2026-09-20' } }));

    expect(readStored('windowsweep:legal-notice', null)).toBeNull();
    expect(records.has('windowsweep:consent')).toBe(true);
    expect(records.has('windowsweep:legal-notice')).toBe(false);
  });

  it('keeps a newer legal notice over an old consent value', () => {
    writeStored('windowsweep:legal-notice', { seen: true, seenAt: '2026-10-31' });
    records.set('windowsweep:consent', JSON.stringify({ v: { seen: false } }));

    expect(readStored('windowsweep:legal-notice', null)).toEqual({
      seen: true,
      seenAt: '2026-10-31',
    });
    expect(records.has('windowsweep:consent')).toBe(true);
  });

  it('preserves Supabase Auth JSON as a string while adopting its old key', () => {
    const session = JSON.stringify({ access_token: 'test-token', expires_at: 123 });
    records.set('windowsweep:supabase-auth', session);

    expect(authStorage.getItem('windowsweep:supabase-auth')).toBe(session);
    authStorage.setItem('windowsweep:supabase-auth', session);
    expect(JSON.parse(records.get('windowsweep:supabase-auth') ?? '{}')).toHaveProperty(
      'value',
      session
    );
    authStorage.removeItem('windowsweep:supabase-auth');
    expect(records.has('windowsweep:supabase-auth')).toBe(false);
  });

  it('returns the fallback and clears a malformed legacy History value', () => {
    records.set('windowsweep:history', '{broken');

    expect(readStored('windowsweep:history', [])).toEqual([]);
    expect(records.has('windowsweep:history')).toBe(false);
  });
});
