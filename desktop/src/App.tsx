/**
 * Routes and boot.
 *
 * 🔴 Hash history. The window loads from `tauri://localhost` in production and
 * `http://localhost:5974` in development; a path-based router asks the host to
 * serve `/settings`, which in the packaged app is a file that does not exist.
 *
 * 🔴 Every screen's state that a person would expect to survive - which tab,
 * which filter, which section is open - lives in the URL, not in a bare
 * `useState`, so the back button works and a state is linkable.
 */

import { useEffect } from 'react';
import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router';

import { Shell } from './components/Shell';
import { Home } from './screens/Home';
import { RunScreen } from './screens/Run';
import { Sections } from './screens/Sections';
import { Consent } from './screens/Consent';
import { Placeholder } from './screens/Placeholder';
import { useStore } from './state/store';
import { loadCatalogue } from './lib/engine';

function RootLayout() {
  const setCatalogue = useStore((s) => s.setCatalogue);
  const setEngineError = useStore((s) => s.setEngineError);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const catalogue = await loadCatalogue();
        if (!cancelled) setCatalogue(catalogue);
      } catch (error) {
        // 🔴 Reported, never swallowed: without a catalogue the app has nothing
        // honest to show, and a screen full of zeroes reads as "nothing to do".
        if (!cancelled) setEngineError(error instanceof Error ? error.message : String(error));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setCatalogue, setEngineError]);

  return <Outlet />;
}

const rootRoute = createRootRoute({ component: RootLayout });

/** The consent screen deliberately renders WITHOUT the rail: it is answered before
    the app is navigable, and offering navigation would let it be skipped silently. */
const consentRoute = createRoute({ getParentRoute: () => rootRoute, path: '/consent', component: Consent });

function withShell(Component: () => React.ReactElement) {
  return function Wrapped() {
    return (
      <Shell>
        <Component />
      </Shell>
    );
  };
}

const routes = [
  consentRoute,
  createRoute({ getParentRoute: () => rootRoute, path: '/', component: withShell(Home) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/run', component: withShell(RunScreen) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/sections', component: withShell(Sections) }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/picker',
    component: withShell(() => <Placeholder screen="picker" />),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/history',
    component: withShell(() => <Placeholder screen="history" />),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/report',
    component: withShell(() => <Placeholder screen="report" />),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/account',
    component: withShell(() => <Placeholder screen="account" />),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: withShell(() => <Placeholder screen="settings" />),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/elevation',
    component: withShell(() => <Placeholder screen="elevation" />),
  }),
];

const router = createRouter({
  routeTree: rootRoute.addChildren(routes),
  history: createHashHistory(),
  defaultPreload: false,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return <RouterProvider router={router} />;
}
