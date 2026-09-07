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
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';

import { Shell } from './components/Shell';
import { Home } from './screens/Home';
import { RunScreen } from './screens/Run';
import { Sections } from './screens/Sections';
import { Consent } from './screens/Consent';
import { Splash } from './screens/Splash';
import { Settings } from './screens/Settings';
import { History } from './screens/History';
import { Picker } from './screens/Picker';
import { Report } from './screens/Report';
import { Account } from './screens/Account';
import { Elevation } from './screens/Elevation';
import { useStore } from './state/store';
import { loadCatalogue } from './lib/engine';
import { track } from './lib/analytics';

/**
 * 🔴 THE APP BOOTS THROUGH SPLASH, and until now it did not.
 *
 * `/splash` and `/consent` were both registered and NOTHING ever navigated to
 * either one, so the boot sequence never ran, the update check never happened,
 * and a first-run person never saw the notice - three built things that no route
 * reached. A launch opens at `#/`, so the redirect fires there, exactly once.
 *
 * 🔴 Once per process, and only from the default location. A deep link - which in
 * a desktop window means a reload on `#/settings` - keeps the place it was given
 * rather than being thrown back to a boot screen, and returning to Home after the
 * splash must not bounce straight back into it.
 */
let booted = false;

function RootLayout() {
  const setCatalogue = useStore((s) => s.setCatalogue);
  const setEngineError = useStore((s) => s.setEngineError);
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (booted) return;
    booted = true;
    if (path !== '/') return;
    void navigate({ to: '/splash' });
  }, [path, navigate]);

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
const splashRoute = createRoute({ getParentRoute: () => rootRoute, path: '/splash', component: Splash });

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
  splashRoute,
  createRoute({ getParentRoute: () => rootRoute, path: '/', component: withShell(Home) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/run', component: withShell(RunScreen) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/sections', component: withShell(Sections) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/picker', component: withShell(Picker) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/history', component: withShell(History) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/report', component: withShell(Report) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/account', component: withShell(Account) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/settings', component: withShell(Settings) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/elevation', component: withShell(Elevation) }),
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

/**
 * 🔴 ONE place emits a screen view, and it is the router rather than a component.
 *
 * The first-run notice promises "which screens you opened", and nothing in the
 * tree emitted it (PENDING-TASKS TASK-005). A `useEffect` in a layout would work
 * too, and would fire twice per route under StrictMode; a router subscription sits
 * outside React entirely, so it reports one navigation as one event in development
 * and in production alike.
 *
 * 🔴 GA4's own `send_page_view` stays FALSE and this replaces it. The window is one
 * document with a hash router: gtag's page_view fires once at boot and never again,
 * so every session would read as a single screen.
 *
 * `pathChanged` is the gate, plus the first resolution - which has no
 * `fromLocation` at all - so the screen a launch lands on is counted. A search
 * parameter moving (a Settings tab, a Sections filter) is deliberately NOT a
 * screen view: it is the same screen with different state.
 *
 * The route pattern is the app's own hash path, never a filesystem location.
 */
router.subscribe('onResolved', (event) => {
  if (!event.pathChanged && event.fromLocation !== undefined) return;
  track('screen.view', { route: event.toLocation.pathname });
});

export function App() {
  return <RouterProvider router={router} />;
}
