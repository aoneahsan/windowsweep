/**
 * The desktop window's single persistence boundary. The old 1.3.2 keys already
 * use `windowsweep:`; a namespace and no extra key prefix keep those physical
 * names stable for the pre-paint script and Supabase Auth.
 */
import { defineStorage } from 'strata-storage';

const PREFIX = 'windowsweep:';
const LOCAL = { storage: 'localStorage' as const };

export const storage = defineStorage({
  namespace: 'windowsweep',
  keyPrefix: false,
  defaultStorages: ['localStorage'],
  adapters: { sessionStorage: false, indexedDB: false, cookies: false, cache: false },
});

function logicalKey(physicalKey: string): string {
  if (!physicalKey.startsWith(PREFIX) || physicalKey.length === PREFIX.length) {
    throw new Error('Invalid windowsweep storage key');
  }
  return physicalKey.slice(PREFIX.length);
}

function matchesFallback(value: unknown, fallback: unknown): boolean {
  if (fallback === null) return true;
  if (Array.isArray(fallback)) return Array.isArray(value);
  return typeof value === typeof fallback && (typeof fallback !== 'object' || value !== null);
}

/** Adopt a 1.3.2 JSON record, then keep only the decoded value in strata. */
export function readStored<T>(physicalKey: string, fallback: T, legacyKey = physicalKey): T {
  try {
    const key = logicalKey(physicalKey);
    const imported = storage.importRawSync(legacyKey, key, LOCAL);
    if (imported !== null) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(imported);
      } catch {
        storage.removeSync(key, LOCAL);
        return fallback;
      }
      const value =
        typeof parsed === 'object' && parsed !== null && 'v' in parsed ? parsed.v : parsed;
      if (!matchesFallback(value, fallback)) {
        storage.removeSync(key, LOCAL);
        return fallback;
      }
      storage.setSync(key, value, LOCAL);
    }
    const value = storage.getSync<unknown>(key, LOCAL);
    if (legacyKey !== physicalKey && value !== null) {
      storage.removeSync(logicalKey(legacyKey), LOCAL);
    }
    return value !== null && matchesFallback(value, fallback) ? (value as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStored<T>(physicalKey: string, value: T): void {
  try {
    storage.setSync(logicalKey(physicalKey), value, LOCAL);
  } catch {
    // The app still works in a private window; this choice will not persist.
  }
}

export function removeStored(physicalKey: string): void {
  try {
    storage.removeSync(logicalKey(physicalKey), LOCAL);
  } catch {
    // A missing or blocked store has nothing to clear.
  }
}

/** Supabase owns this record's JSON format; strata stores its raw string. */
export const authStorage = {
  getItem(key: string): string | null {
    try {
      const logical = logicalKey(key);
      storage.importRawSync(key, logical, LOCAL);
      return storage.getSync<string>(logical, LOCAL);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    storage.setSync(logicalKey(key), value, LOCAL);
  },
  removeItem(key: string): void {
    removeStored(key);
  },
};
