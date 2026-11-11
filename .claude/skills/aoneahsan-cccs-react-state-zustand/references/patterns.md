# zustand patterns

## Store with persistence

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  appearance: 'light' | 'dark' | 'system';
  accent: string;
  hydrated: boolean;
  setAppearance: (a: ThemeState['appearance']) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      appearance: 'system',
      accent: 'violet',
      hydrated: false,
      setAppearance: (appearance) => set({ appearance }),
    }),
    {
      name: 'theme',
      storage: createJSONStorage(() => strataAdapter),        // never window.localStorage
      partialize: (s) => ({ appearance: s.appearance, accent: s.accent }),   // never persist `hydrated`
      onRehydrateStorage: () => (state) => { state?.set({ hydrated: true }); },
    },
  ),
);
```

`partialize` is the part people miss: without it, transient flags get persisted and then restored as stale
truth on the next load.

## Storage adapter

```ts
// strata-storage (or @capacitor/preferences in older projects) — identical API on web and native.
export const strataAdapter = {
  getItem: async (name: string) => (await storage.get<string>(name)) ?? null,
  setItem: async (name: string, value: string) => { await storage.set(name, value); },
  removeItem: async (name: string) => { await storage.remove(name); },
};
```

One adapter per project, in `src/lib/`. Nothing else touches storage directly.

## Selectors

```ts
// Single value
const total = useCartStore((s) => s.total());

// Several values — useShallow prevents a new object identity every render
import { useShallow } from 'zustand/shallow';
const { items, count } = useCartStore(useShallow((s) => ({ items: s.items, count: s.items.length })));

// Actions are stable — safe to select once outside a component if needed
const addItem = useCartStore((s) => s.addItem);
```

## Cross-device sync

```ts
// On sign-in: remote wins, then write back so the server always has a row.
export async function syncPreferences(uid: string) {
  const remote = await fetchPreferences(uid);
  if (remote) {
    useThemeStore.setState(remote);
  } else {
    await savePreferences(uid, useThemeStore.getState());
  }
}

// On change: debounce so customiser interaction does not spam the backend.
const pushRemote = debounce((state) => savePreferences(uid, state), 500);
useThemeStore.subscribe(pushRemote);
```

On sign-**out**, keep the local values. The device should continue showing the user's last choice without the
account link.

## Testing a store

```ts
const initial = useCartStore.getState();
beforeEach(() => useCartStore.setState(initial, true));   // `true` replaces rather than merges
```

Stores are module singletons, so state leaks between tests unless reset explicitly.

## Reading outside React

```ts
const token = useAuthStore.getState().token;     // one-shot read, e.g. in an API interceptor
```

Useful in service modules. Do not use it inside a component — it does not subscribe, so the component will
not re-render when the value changes.
