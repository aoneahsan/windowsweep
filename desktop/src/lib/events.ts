/**
 * The event registry - the one vocabulary every reported event comes from.
 *
 * 🔴 A typed registry is what stops `screen.view`, `screenView` and `view_screen`
 * all existing by month three, at which point no dashboard is trustworthy and the
 * fix is a migration rather than an edit. `track()` takes an `EventName`, so a
 * name that is not here does not compile.
 *
 * 🔴 The first-run notice PROMISES two of these. It says the window sends "which
 * screens you opened and which buttons you pressed", and until 2026-09-08 the only
 * `track()` callers in the tree were the three updater events - so a GA4 key would
 * have received `update.check.*` and gtag's own session events, and nothing the
 * sentence describes. `screen.view` and `control.press` are that sentence, made
 * true. (PENDING-TASKS TASK-005.)
 *
 * 🔴 GA4's `send_page_view` stays FALSE. `screen.view` replaces it rather than
 * sitting beside it: this window is one document with a hash router, so gtag's own
 * page_view fires once at boot and never again, which would report every session
 * as a single screen.
 *
 * The property vocabulary is bounded on purpose - `route`, `control`, `version`,
 * `reason`. A property invented per event is a property nobody can segment on.
 *
 * 🔴 NOTHING HERE MAY CARRY A PATH, A FOLDER NAME OR A DRIVE LABEL. `route` is the
 * app's own hash route (`/settings`), never a filesystem location, and `control` is
 * an id from the closed list below. `analytics.ts` scrubs every string property as
 * a second line of defence, but the first line is choosing what to send.
 */

/** Every event this application may report, with the properties it carries. */
export const EVENTS = {
  /** One per route change, from the router subscription in `App.tsx`. */
  'screen.view': { route: 'string' },
  /** One per press of a primary control, from `PrimaryButton`. */
  'control.press': { control: 'string', route: 'string' },
  'update.check.available': { version: 'string' },
  'update.check.skipped': { reason: 'string' },
  'update.install.failed': { reason: 'string' },
} as const;

export type EventName = keyof typeof EVENTS;

/**
 * The closed vocabulary of pressable controls.
 *
 * 🔴 An id, never a label. A label is translated copy and would change the event
 * name the day someone edits a sentence; an id survives a rewording, which is the
 * whole reason the two are separate.
 */
export const CONTROL_IDS = [
  'home.scan',
  'home.dryRun',
  'home.reclaim',
  'run.start',
  'sections.runSelected',
  'picker.remove',
  'consent.continue',
  'account.signIn',
  'elevation.askAndRun',
  'splash.updateNow',
] as const;

export type ControlId = (typeof CONTROL_IDS)[number];
