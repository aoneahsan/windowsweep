# Project Context - windowsweep, the owner decisions of session 21

Moved here **verbatim** from [`PROJECT-CONTEXT.md`](PROJECT-CONTEXT.md)'s `## Durable owner decisions` section on
2026-11-10, before that file reached its 500-line ceiling. Nothing was reworded: D55-D84, 2026-10-30 to 2026-11-03.
Earlier decisions (D13-D54) are in [`PROJECT-CONTEXT-decisions-2026-09.md`](PROJECT-CONTEXT-decisions-2026-09.md);
later ones (D85 on) stay in `PROJECT-CONTEXT.md`.

### Session 21 decisions (2026-10-30) - the first `/complete-project` run

Asked in one batch at the start of the run; each answer is his verbatim option. The run's state file is
`projects-finalization-record/production/windowsweep-complete-project.json`.

- **D55 - category "Desktop app + CLI (Recommended)"**: the column he set for macleanup the same day. No store, so
  no store-listing set; AI and FilesHub storage NA; Android and a browser extension do not apply; iOS 0.
- **D56 - plan set "Mirror macleanup exactly (Recommended)"**: Free (every section, unlimited previews, 15 real
  runs per PC a month + 15 more signed in) · Pro $4 a month or $36 a year (unlimited real runs, synced history on
  up to 5 PCs, schedules, exports) · Team $3 a seat a month or $30 a year, minimum 3 seats (+ shared fleet
  reports) · referral 10 points per confirmed friend, one Pro month per 3, at most 4 a year. Every figure is an admin
  field. The npm CLI stays free, MIT and unlimited. **Supersedes the 2026-09-05 no-pricing
  decision and its old §13 admin declaration.** The current scope is recorded below.
- **D57 - agents "Up to 4 (Recommended)"**: at most four custom agents at once, resource-checked before each dispatch.
- **D58 - Supabase "Approve the set (Recommended)"**: on `nlmetjyytgwaxcliusuo`, each rehearsed in
  `BEGIN ... ROLLBACK` first - additive Drizzle migrations (release records + public latest view + admin publish RPC;
  plans, plan fields, `app_config`, billing and Polar events, referral, teams and invites, admin RPCs and audit, the
  legal-notice seen flag, devices and run claims); the Google-only `before_user_created` hook (Google + the `t1`
  test aliases); anonymous sign-ins on; the Edge Functions `polar-checkout`, `polar-webhook`, `admin`, `team`,
  `account-welcome` and `allowance`; secrets `FILESHUB_API_KEY` and `POLAR_*`.
- **D59 - GATE 4 "Extend the pre-authorisation (Recommended)"** to this run's new non-legal surfaces (pricing and
  plan screens, the legal bar, tours and the walkthrough, the update notice and block screens, admin pages, the
  welcome email) on the 2026-09-07 condition. Terms and Privacy changes and every marketing `[TEST]` go to him first.
- **D60 - release "Yes, 1.4.0 this run (Recommended)"**: desktop and CLI 1.4.0 through the release kit; the
  second-machine items (RW-064/065/066) move to 1.5.0.
- **D61 - Polar "Build it dormant now (Recommended)"**: checkout, webhook and products built and tested; a plan
  request replaces the pay button until his windowsweep Polar organization exists as a FilesHub payment account.
- Mid-run, the same day: he asked for the "What is windowsweep" and LinkedIn company page documents so he can create
  the Polar organization; they live in the notebook's `linkedin-social-content/windowsweep/`.
- **D62 - "Free keeps them (Recommended)"** (2026-10-31): Free keeps 1.3.2's signed-in run-summary sync,
  cross-machine History and Markdown/HTML per-run export. Pro adds reports across 5 machines (5 per Team seat),
  history export, schedules and unlimited real runs. D56 changes the desktop weekly schedule and monthly real-run
  limits; the CLI keeps `--install-task` and `--export`.
- **D63 - "Yes, ship them early (Recommended)"** (2026-10-31): ahead of 1.4.0, deploy `/pricing` for Polar review
  (plans arriving with 1.4.0; checkout dormant, plan requests instead of pay buttons) and the Terms/Privacy payment
  clauses after his GATE 4. This requires an extra site deploy before the release deploy.
- **D64 - desktop analytics "Bundled analytics only (Recommended)"** (2026-10-31, from the security lane's F-SEC-003):
  Amplitude and Sentry stay bundled; Clarity leaves the desktop window and stays on the website. Its GA4
  Measurement Protocol choice and `script-src 'self'` narrowing are superseded by D75.
- **D65 - database hardening "Yes, both (Recommended)"**: SSL enforcement on and the legacy JWT API keys disabled, each
  checked first (nothing may still use a legacy key; FilesHub's keepalive is checked first) and read back after.
- **D66 - "1.4.0 removes it"**: a Free user's weekly task from 1.3.2 is removed on the first start of 1.4.0, said once,
  with Pro and the command line's free `--install-task` named as the alternatives.
- **D67 - "They keep their price (Recommended)"**: a running subscription renews at the price it started with until
  cancelled; an admin price change applies to new purchases.
- **D68 - "Pay link when checkout opens (Recommended)"**: a plan request grants nothing; when checkout opens, the team
  emails each open request a link to pay, and the request closes.
- **D69 - "Each member's run summaries (Recommended)"**: the Team fleet report shows, per member and machine, date,
  mode, sections run and bytes reclaimed - never a path, file name, machine name or user name.
- **D70 - "Cancel it server-side first (Recommended)"**: deleting an account first cancels its Polar subscription
  through the server, then deletes; this approves one Edge Function beyond D58's six (`delete-account`).
- **D71 - "Keep the anonymous counts (Recommended)"**: after a deletion a machine's run claims keep only the random
  install id, the month, the pool and the section numbers; the Privacy Policy says so.
- **D72 - "Approve it (Recommended)"**: `security_manual_linking_enabled` turned on in the same Auth update as D58's
  hook and anonymous sign-ins, so "Sign in with Google" links onto the device session.
- **D73 - "Keep the clause (recommended)"** (2026-10-31): the Terms may state that deliberate run-limit evasion or
  referral-account farming can lead to account deletion and referral voiding. Legal GATE 4 remains pending.
- **D74 - GA4 relay proposal, superseded by D75** (2026-10-31): a server-side Measurement Protocol relay and
  daily counters were drafted but never applied or deployed. The owner questioned the extra secret and chose D75.
- **D75 - "Use existing Measurement ID (Recommended)"** (2026-10-31): keep the desktop's existing public GA4
  Measurement ID and `gtag.js` path, with its scrubbed event vocabulary. No Measurement Protocol API secret,
  `analytics-ingest` function or daily telemetry-count tables are needed. Amplitude and Sentry remain bundled;
  Clarity remains website-only. The desktop CSP allows the GA4 tag and collection hosts.
- **D76 - no Docker for WindowSweep** (2026-10-31): the owner forbids starting or using Docker because of its
  system load. The Supabase CLI's `db dump` path is excluded; backups use a standalone PostgreSQL client.
- **D77 - uninstalling selected programs is in scope** (2026-11-02, owner: "get rid of all softwares which i do
  not need from this system fully ... get all that implemented as features in this software"): new section 26 runs
  the selected program's own registered uninstaller. Interactive only, never batch; `--yes` never selects. It
  replaces the old non-goal "running an uninstaller (section 24 only reports)".
- **D78 - leftovers outside AppData** (2026-11-02): new section 27 offers unclaimed top-level folders in Program
  Files, ProgramData, Common Files, `%LOCALAPPDATA%\Programs`, profile dot-folders and drive-root folders; Recycle
  Bin, interactive, fails closed. A leftover inside a protected subtree is reported, never removed.
- **D79 - two narrow protection exceptions, computed at start-up** (2026-11-02): Codex standalone releases other
  than the `current` junction target and the newest previous one; and the allowlisted Chromium cache leaves inside
  a user-declared browser-profile root (`browserProfileRoots`). Everything else in `.codex` and `.local` stays protected.
- **D80 - these ship in 1.4.0** (2026-11-02, "Ship as 1.4.0 when gates pass"): they join the 1.4.0 programme and
  its existing gates; the second-machine candidate rows RW-064/065/066 move to 1.5.0.
- **D81 - browser AI model** (2026-11-02): section 29 sets Chrome's `GenAILocalFoundationalModelSettings = 1`
  (HKLM). Chrome then deletes `OptGuideOnDeviceModel` itself (seen on the P52 that day: 4 GB gone with Chrome
  running). It shows "Managed by your organization"; the undo is documented.
- **D82 - idle basis** (2026-11-02, "Auto-detect, then write time (Recommended)"): where last-access is live on a
  root (a sample shows most files read within a day but written long before), the idle gate ignores last-access
  and uses write/creation; elsewhere it stays the newest of the three. The output names the basis used.
- **D83 - 1.4.0 section extensions** (2026-11-02, from the P52 cleanup): 4 adds system images no AVD uses and
  dangling AVD `.ini` files (`sdkmanager --uninstall`); 7 adds `browserProfileRoots`; 10 adds `tempRoots`; 24
  adds a last-run column from Prefetch when elevated; 23's claim logic learns reverse-DNS app ids, Store package
  names, acronyms and process command lines, and never offers the desktop app's own data folder.
- **D84 - personal data scanner roots** (2026-11-03, owner: "Downloads by default; users add folders"):
  section 19 searches Downloads and only the extra folders a person adds. The desktop stores those extra
  roots locally and passes them explicitly, including an empty list. Large or old describes a file, not
  whether it is needed. Selection is row by row; removal defaults to the Recycle Bin, and a file changed
  since the scan is refused.
- Settled in the main session the same day, not owner questions: the release form warns when a version is ABOVE the
  deployed build (a record above every build would block everyone; the update-flow skill's wording is corrected);
  `devices` stores no machine name, host name or Windows version (the product's "never a machine name" promise); the
  plan record, invite code, referrals and team seat are deleted with the account; an admin's plan change is audited
  without any of the person's words.

Last Updated: 2026-11-10
