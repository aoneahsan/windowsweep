# windowsweep desktop - the amendment log, part 3 (2026-09-25, after the releases, onwards)

> Continues [`AMENDMENTS-2.md`](AMENDMENTS-2.md), which closed at 493 lines against this repository's 500-line
> ceiling. 🔴 **The next amendment goes at the bottom of this file**, and a new `AMENDMENTS-4.md` starts when this
> one would pass 500 lines. The rule is unchanged: a divergence is written into the dummy first, with its reason
> here, and only then does the app match.

## Amendment - 2026-09-25 (after the releases): History's total steps aside when the view holds no real run (TASK-018)

Found by TASK-013's live verification (the Dry-runs filter, on an account with no dry-runs): History's header read
*"0 B / freed in the last 0 runs"*. True, and clumsy, and the dummy drew it the same way. **No new words.** The
block that carries the figure - the total and its count line - is hidden while the view holds no real run
(`page-history.js`; `data-ws-hist-sum` on `history.html`'s total block), and the empty row below it, whose words
are already approved (*No runs yet*, *No dry-runs yet*, the other-machines states), is what the reader reads. One
run and more keep the block exactly as before, *"freed in the last run"* and *"freed in the last N runs"*.

App: `src/components/history/HistoryHeader.tsx` renders `.hist-total` only when `runs > 0` - the same count the
dummy uses (real runs in the filtered list). Checked by the next desktop release's GATE 4 round, with History's
empty states in its scope.

## Amendment - 2026-09-26 (GATE 4 round 16, D-72): section 22 is not a developer section

`seed.js` flagged section 22 (`globals`, the globally installed packages audit) `dev:true`, while its own header says
every dev flag is transcribed from the engine's catalogue - and `lib/constants.ps1` has `Dev = $false` for it, as it
has since 1.1.0 (`3c4d54e`). The app reads the engine, so its Sections screen showed seven `dev` badges where the
dummy showed eight. **The dummy was wrong and the app was right**: `seed.js` now reads `dev:false`, a transcription
fix with no new words (the round-7 D-37 class). Round 16's other five findings (D-68 to D-71, D-73) are the app
brought to the dummy, which is unchanged for them - the Privacy tab's words, the status bar's mono face, Run's hero
band, Home's schedule column and the URL axis layer are all the dummy's as drawn.

## Amendment - 2026-09-26 (GATE 4 round 17, R17.9(3)): the no-keys build's sentence joins the dummy

The app has drawn one sentence the dummy never did, since its first Privacy tab: *"No destination is configured in
this build, so nothing is actually sent from it."* (`settings.noKeys`), under the rows, only when EVERY analytics and
crash destination is unconfigured. Round 1 recommended adding it to the dummy (round-01a.md:230); round 17 found it
still app-only. It is written into the dummy now, in the app's exact words and placement - `page-settings.js` ->
`privacy()`, drawn by `settings.html?nokeys=1` - so the dummy owns it as it owns every other word on the tab. No app
change: release builds carry all four keys and never show it, and a build with one key set draws no sentence on either
side. A GATE 4 round can pair it only against a build made without keys, which no round has run.

## Amendment - 2026-10-31 (1.4.0): Plans and the two notices

D56 supersedes this design's older no-plan statement in `README.md` sections 8 and 10. The 1.4.0 screen is
`windowsweep-click-dummy/plans.html`; it uses Reclaim's existing lime, sky and plum treatments, typefaces and nine
appearance axes. The new UI is a **ledger**: current plan, count left and reset date occupy the first band; the
device and account pools sit beside it. The person sees the month's state before any price or request button.

The screen keeps the cockpit regime (variance 5, motion 4, density 7). Its asymmetry comes from a 7/5 count
and allowance pair, then two equal plan choices, then 4/8 referral and Team panels. Equal plan cards make their
prices and limits comparable; the rest of the screen avoids the repeated-card rhythm that lost direction 01.
The meter is a fixed track with a changing fill. At zero it remains the same object, empty and labelled with
the next reset date. The limit panel names what still runs, and its primary action follows the account state.

The single theme control stays in the title bar. The Plans CSS reads semantic tokens for colour, type,
spacing and motion; it introduces no new hue or cursor. A new React Aria plan picker is not drawn because
checkout is closed under D61: the buttons record requests, charge nothing and grant nothing. The one pay
line stays immediately beneath each request button.

The legal notice and release gate are created by the shared shell script on every applicable page. The legal
bar stays above the status bar and never appears on a task page. Release notices take priority when both
could appear. The normal release is a small anchored notice; urgent or next-start records use a full-window
block with one Update action and the published reason as a data slot. The fallback release and support links
appear only in the failed-update state. The site-only `draftKept` line is absent pending browser proof.

Rejected: a pricing-first screen, because it would bury the count someone came to check; a circular allowance
gauge, because its zero state would look like an empty decoration; and a blocking legal dialog, because the
notice law requires a quiet bar. The owner still needs to review this 1.4.0 extension in writing. App parity
is a separate Gate 4 after implementation.

## Amendment - 2026-11-03: personal file scanner in Picker

The owner chose Downloads as the default scan root and explicitly added folders as the only extension. Section
19 of the existing Picker is the review surface, so the same row-by-row selection and Recycle Bin default stay
in view. The new folder panel sits above the candidate table. It shows the fixed Downloads root and the folders
the person adds; the prototype's folder dialog stands in for the app's native Windows chooser. Adding or removing
a folder invalidates the previous section-19 results and selection. Scanning clears that selection again.

Results distinguish large, old and both. The two reason filters include a both-result in either view. The table
shows the measured age and timestamp basis, not a claim that a file is unused. Protected files remain visible
with a refusal reason and no selection control. The selection file also refuses to match those rows. Nothing is
preselected, and the dummy never reads or removes a real file. The folder list and view preferences persist in
the existing strata-storage namespace; candidate rows and selections do not.

The panel uses the cockpit regime, the existing tokens, filters, table and selection bar. At the 760 px native
minimum, controls wrap above the table and the table retains its existing horizontal scroll. No new colour,
cursor or navigation destination is introduced. `docs/story/content-map.md` row 13 still owns Picker's words.
The owner must review this extension before the desktop app follows it; app parity remains a separate Gate 4.

## Amendment - 2026-11-03: remaining P9 sections and declared folders

The catalogue now carries sections 26-29 from the engine's 1.4.0 list. Picker chips and sample rows show
26 as program uninstallation and 27 as leftover folders. The selection bar says an uninstall is permanent
regardless of the Recycle Bin choice, and that 27 needs administrator permission. The Elevation screen
names section 29's Chrome policy and its “Managed by your organization” effect. Section 27 stays in Picker;
it cannot be run as an unattended elevation card without a selection.

Settings' scan tab now shows the personal, automation profile and scratch folder lists. The personal list
shares Picker's saved folders; Downloads remains implicit and cannot be removed. Each list maps to the
engine's own flag, and the dummy accepts absolute Windows folders without a semicolon separator. The
idle window describes D82's per-volume timestamp choice, and the section 19 threshold says “large or old”.
All four new sections use the established cockpit components, tokens and default pointer. No new screen
or navigation destination is added. These extensions remain in review with the section 19 scanner.

## Amendment - 2026-11-03: desktop tours and walkthrough approved

The owner reviewed the 1440 and 760 px page-tour and seven-step walkthrough captures and wrote:
**“Approve desktop tours and walkthrough.”** The shared titlebar Tour button, step controls and
walkthrough composition are approved for production implementation. The seven dummy fixture
images must be replaced with fresh 1.4.1 app captures before the live walkthrough is verified.

## Amendment - 2026-11-06: the legal bar is the first-run surface (N-001, N-016)

The Consent screen is retired (N-016) and nothing routes to it; `consent.html` stays as the 1.3.2 reference the
contents page already marks retired. The first-run surface is now the legal bar, on the first non-task page after
Splash (Home, on a first launch), in N-001's words: the fixed sentence with both policy links, which open the website
in the browser; the one analytics line; and Okay. It is `role="status"`, takes no focus, and the window stays usable
under it. Four changes to the 2026-10-31 bar, each to meet `legal-notice.md`:

1. **Seen on this PC and on the account.** The two keys teach each other, so a second machine or a later sign-in never
   brings it back; until now it kept one key or the other, and a sign-in showed it again.
2. **Escape closes it**, as Okay does, and a keyboard user is handed back to the rail's current item, or to Menu when
   the rail is folded away.
3. **Hover and focus hold the 10 seconds and leaving restarts them**; a one-second poll only paused them.
4. **The law's size, about 36rem, in the bottom-right corner** the release notice uses. The two never show together
   (the release surface takes priority), and the corner clears the rail and the middle of the work; it was a 66rem
   strip across the window, over the rail's foot at 1440.

The decision stays in `app.js`; the bar itself moved to `legal-bar.js`, loaded on demand as `tours.js` is, and it marks
itself seen only once it is drawn (`app.js` is three lines shorter than before). N-016: Clarity leaves the window, so
Home's destinations ledger and Settings, Privacy list Google Analytics 4, Amplitude and Sentry with their approved
lines, and *Never sent* stays in both. Checked at 1440 and at the 760 px native minimum: above the status bar, no
sideways scroll, nothing on Run, Picker, Elevation or Splash, and no key written on those pages.

Rejected: a first-run screen in front of Home (it gates the app on a notice the law says must never block) and a
bottom-centre strip (at 1440 it lands on the rail). The owner still needs to review this in writing; app parity is a
separate Gate 4.

## Amendment - 2026-11-06: the emails, drawn once (`emails.html`)

`emails.html` is rewritten as the one review page for every message windowsweep sends: the seven FilesHub templates
(`windowsweep-welcome`, `-plan-confirmed`, `-referral-confirmed`, `-payment-returned`, `-plan-granted`,
`-plan-request-open`, `-team-invite`) and release newsletter email 1, each at 600 and 390 px with its plain-text part.
Words come only from `emails-1.4.0.md`; facts and formats from the senders and CONTRACTS.md §14 (en-GB long dates,
`$4.00`, plan display names, never keys).

1. **The layout is drawn once**, at the top of the page: the shell (hidden preheader, logo tile, eyebrow, heading,
   intro, facts, one bulletproof button with its raw link under it, footer), the brand hex in light and dark taken
   from the lime tokens (button text 5.35:1 light, 11.17:1 dark), and the style block every message ships. That block
   sits inert on the page (`media="not all"`) and `page-emails.js` replays it as container queries on each canvas, so
   the gallery's own width and theme never restyle a specimen.
2. **The plain-text part is generated from the same markup**, in reading order, so the two cannot drift; a link whose
   text is its own address prints the address once.
3. **The logo is the live site's absolute https PNG** with explicit width and height. Over `file://` the preview shows
   the repository's mark instead; the specimen markup keeps the real URL.
4. **The release email uses FilesHub's Letterhead**: ten blocks, the button straight after the lede and again at the
   end, image slots drawn as images-off frames carrying their approved alt text until fresh app captures exist, and the
   signed unsubscribe link. No postal address is printed in this public repository.

Not drawn: the newsletter confirmation email has no approved words. Rejected: eight separate files (the layout would
be retyped eight times) and live media queries on the page (the reviewer's window would restyle the mail). The owner
still needs to review this in writing.

## Approval, 2026-11-06 - the legal bar, the destinations without Clarity and the emails (D90)

The owner approved the drawn desktop legal bar (N-001), the destinations without Clarity (N-016) and the eight-email gallery: *"Approve all (Recommended)"*. One main-session call rides with it: on first run the tour hint waits until the legal bar closes, so two notes never stack. The newsletter confirmation email is written through the story system (D91) and drawn before it is sent.

## Amendment - 2026-11-06: the tour hint waits for the legal bar (D90's main-session call, drawn)

`app.js` now draws what D90's approval recorded in words: while the legal bar is up the one-time tour hint waits, and it
comes about 1.2 seconds after the bar closes, the delay the app's `TourControl` uses. `legal-bar.js` announces its close
(`ws-legal-closed`) and `buildNotices()` raises `wsLegalPending` before it loads the bar, so the hint, built later in
`boot()`, knows to wait. A release notice or block still means no hint beside it; the app now holds the hint for one too
(1.4.3). Measured on `index.html?legal=1` at 1440 and 760: the bar up and no hint, no hint just after Okay, the hint 1.4
seconds later, no page error (`site-evidence/session-2026-11-05/desktop-dummy-legal-hint/`).
