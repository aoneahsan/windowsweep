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

import { lazy, Suspense, useEffect } from 'react';
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
import { Consent } from './screens/Consent';
import { Splash } from './screens/Splash';
import { useStore } from './state/store';
import { loadCatalogue } from './lib/engine';
import { track } from './lib/analytics';
import { configuredFeatures } from './lib/config';

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

  /* 🔴 TASK-013: a session left by an earlier launch resumes syncing at boot, not
     only when the Account screen opens - otherwise a finished run before that
     screen is visited would wait in the upload queue for no reason. Loaded by a
     dynamic import so a build with no Supabase keys never pulls the client in. */
  useEffect(() => {
    if (!configuredFeatures().sync) return;
    void import('./lib/sync-session').then(
      (sync) => sync.restoreSync(),
      () => undefined
    );
  }, []);

  return <Outlet />;
}

const rootRoute = createRootRoute({ component: RootLayout });

/** The consent screen deliberately renders WITHOUT the rail: it is answered before
    the app is navigable, and offering navigation would let it be skipped silently. */
const consentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/consent',
  component: Consent,
});
const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/splash',
  component: Splash,
});

/**
 * 🔴 THE NINE SHELL SCREENS ARE SPLIT BY ROUTE (TASK-016 item 4). All eleven were
 * imported at the top of this file, so opening the window parsed and executed the
 * Picker's table, the Report's charts, History's, Settings' ten axis panels and the
 * Elevation screen before anyone had navigated anywhere.
 *
 * 🔴 Consent and Splash stay EAGER, and that is the point rather than an omission:
 * `RootLayout` navigates to `/splash` on boot, so they are the two screens a launch
 * is certain to reach. Deferring the screen the app opens on would move a fetch
 * onto the critical path to save a chunk nothing avoids.
 *
 * 🔴 Named exports, so each import is mapped to a `default` - `lazy` takes a module
 * with one and these screens have none. A default export per screen would work too
 * and would cost the codebase its one-name-per-thing rule.
 */
const Home = lazy(() => import('./screens/Home').then((m) => ({ default: m.Home })));
const RunScreen = lazy(() => import('./screens/Run').then((m) => ({ default: m.RunScreen })));
const Sections = lazy(() => import('./screens/Sections').then((m) => ({ default: m.Sections })));
const Picker = lazy(() => import('./screens/Picker').then((m) => ({ default: m.Picker })));
const History = lazy(() => import('./screens/History').then((m) => ({ default: m.History })));
const Report = lazy(() => import('./screens/Report').then((m) => ({ default: m.Report })));
const Account = lazy(() => import('./screens/Account').then((m) => ({ default: m.Account })));
const Settings = lazy(() => import('./screens/Settings').then((m) => ({ default: m.Settings })));
const Elevation = lazy(() => import('./screens/Elevation').then((m) => ({ default: m.Elevation })));

/**
 * 🔴 ONE `Suspense`, and it is INSIDE the shell rather than around the `Outlet`.
 * Around the outlet, every navigation would blank the title bar, the rail and the
 * status bar - the whole window - while a chunk arrived. Here the shell stays
 * painted and the pressed rail item is already marked, so the navigation is
 * acknowledged where the person is looking and only the content area waits.
 *
 * 🔴 The fallback is DELIBERATELY WORDLESS. The app has one loading sentence,
 * `common.loading` - "Reading the catalogue from the engine" - and that is a
 * different fact; printing it here would have the window name something it is not
 * doing. The dummy has no counterpart to invent one from either: it is static HTML
 * and has no chunks to wait for. In a packaged window the chunk is a local file, so
 * this is a frame, not a wait.
 */
function withShell(Component: React.ComponentType) {
  return function Wrapped() {
    return (
      <Shell>
        <Suspense fallback={null}>
          <Component />
        </Suspense>
      </Shell>
    );
  };
}

const routes = [
  consentRoute,
  splashRoute,
  createRoute({ getParentRoute: () => rootRoute, path: '/', component: withShell(Home) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/run', component: withShell(RunScreen) }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/sections',
    component: withShell(Sections),
  }),
  createRoute({ getParentRoute: () => rootRoute, path: '/picker', component: withShell(Picker) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/history', component: withShell(History) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/report', component: withShell(Report) }),
  createRoute({ getParentRoute: () => rootRoute, path: '/account', component: withShell(Account) }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/settings',
    component: withShell(Settings),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/elevation',
    component: withShell(Elevation),
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
