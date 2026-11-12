# Project Context - windowsweep

Last Updated: 2026-11-10 (latest: D100-D103 - the second `/complete-project` run: the hub ads row relabelled, the plain ads words, clickable desktop promotions with release 1.4.7, and this session's production touches; session 21's D55-D84 moved verbatim to `PROJECT-CONTEXT-decisions-2026-10.md`). Earlier 2026-11-06 (D90-D93 - design gate approved, the seven missing strings, the email functions deploy, release 1.4.3; and the unapplied 1.4.0 legal wave found). Earlier 2026-11-05 (D85-D89 - the run resumed: the test-only production proofs, release 1.4.2, Polar sandbox then production, the email tests, the shared test Supabase project; sessions 13-20 moved to `PROJECT-CONTEXT-decisions-2026-09.md`). Earlier 2026-10-30 (D55-D61 - the first `/complete-project` run: category, plan set, agents,
the Supabase production set, GATE 4, release 1.4.0, Polar dormant). Earlier 2026-09-28 (row 30 closed on the owner's word - the consent screen published; web row 4's sign-in proved from the server. Earlier the same day: D54 - a development build reports no analytics (DONE-023); row 31 closed by the owner's own sign-in and dry-run on 1.3.2; the site's tables and the eighth migration moved verbatim to `PROJECT-CONTEXT-supabase.md` at the 500-line ceiling. Earlier the same day: D53 - desktop-v1.3.2 and CLI 1.3.2: the desktop sign-in fixed (DONE-021), TASK-020 (DONE-020), TASK-022 (DONE-022), TASK-023 filed; the D28 line corrected. Earlier 2026-09-26: D52 - TASK-020 widens the desktop CSP for Clarity. Earlier the same day: `desktop-v1.3.1` released and proved under D50 - the current-status line. Earlier the same day: D50 - `desktop-v1.3.1` this session - and D51 - the stray `runs$RUNID` folder deleted; TASK-019's generators became Vite plugins. Earlier the same day: D49 - the workspace root backed up on the private site repo's `project-root`
branch. Earlier 2026-09-25: `desktop-v1.3.0` published as Latest and proved by the in-app updater 1.2.0 -> 1.3.0,
CLI 1.3.1 on npm with the team's maker lines, rounds 14 and 15 with D47, session 14's decision table moved to
`docs/project-history.md`. Earlier the same day: RW-116 and TASK-013 verified as a person and torn down, O6' set, the desktop cascaded to 1.3.0, the open-unknowns section brought to date - TASK-017 and TASK-018 are the two open owner decisions. Earlier: session 17: D25-D43 recorded - the Terms page, sign-in live on the site, the runs index, the desktop sync behaviour, up to four agents; RW-132: the dated session narratives moved verbatim to `docs/project-history.md` and the verified runs and release record to `docs/runs-and-releases.md`, nothing reworded; the stamp this replaces follows)
Earlier: 2026-09-17 (session 16, the v4 audit: D21-D24, the two unrecorded GATE 4 rounds, the unintended real run of 2026-09-14)
Verified Against: commit ffad0b6 on `main`, 2026-09-25 - self-test 160/160, version parity 1.3.1, `npm pack` 46 files
(119.7 kB packed, 401.4 kB unpacked, byte-identical to the registry's 1.3.1), PSScriptAnalyzer 0 findings (a plant
proved it catches one), the engine diffing EMPTY against `v1.3.1`, `desktop-ci` and `ci` green.

## Identity and outcome
- Purpose: safe, developer-aware disk and cache cleanup CLI for Windows; the Windows member of the family with
  `linux-cleanup` (Bash) and `macleanup` (Bash).
- Primary users: developers and power users on Windows 10/11 who want to see and control every deletion.
- Current status (2026-09-26): **CLI 1.3.1** on npm (2026-09-25) and **`desktop-v1.3.1`**, the repository's Latest
  release (2026-09-26) - sections 0-25, 160 self-test checks, and sign-in with sync live in the desktop app; the
  documentation site and the marketing site follow both. Each release's record: `docs/runs-and-releases.md`.
  What is open: the tracker (the only status), `../remaining-work.md` (the specification) and
  `../completion-plan-v5-2026-09-24.md` (the method), both at the **workspace root**, outside this repository
  (backed up on the private site repo's `project-root` branch, D49).
- Distribution: `npx windowsweep`, `npm install -g windowsweep`, or a clone run through `windowsweep.cmd`.
  No other channel (owner decision 2026-09-03).
- What is open, with evidence and acceptance criteria: `../remaining-work.md` (the **workspace root**
  `D:\work\windowsweep-root\`, outside this repository since 2026-09-07 - `../RESTORE.md` rebuilds it, D49);
  how it gets done: `../completion-plan-v5-2026-09-24.md`; status:
  `docs/features/windowsweep-completion/00-tracker.json`.

## Chosen architecture
- Runtime: Windows PowerShell 5.1-compatible scripts (also run on PowerShell 7), dot-sourced `lib/` + `modules/`,
  flags parsed from `$args` (no `param()` on the entry so GNU-style flags survive `-File`).
- Launcher: `bin/windowsweep.js` (Node >=14, zero dependencies) spawns `powershell.exe -ExecutionPolicy Bypass`;
  `windowsweep.cmd` does the same without Node. Both pass version/launcher facts via `WINDOWSWEEP_*` env vars.
- State: `%USERPROFILE%\.windowsweep\{logs,reports,feedback,config.json}`; JSON report schema 1; MD/HTML export
  built in (no jq).
- Deployment: GitHub (`main`, remote `o`) + npm; CI job `ci` on `windows-latest` runs self-test + dry-run on both
  hosts, PSScriptAnalyzer, and a tarball allowlist sweep.
- Deliberate stack deviations: no TypeScript, no yarn build, no Vitest; the gate is `--self-test` (fixture-based)
  plus `--dry-run`. Source is ASCII-only because PowerShell 5.1 reads BOM-less UTF-8 as ANSI.

## Durable owner decisions
- Name `windowsweep` (windows + sweep sharing the s, the macleanup construction); chosen 2026-09-03 after two
  rounds of candidates; verified free on npm (incl. `window-sweep`) and unclaimed by any real product.
- npm publish of 1.0.0 approved by the owner on 2026-09-03 "to secure the spot"; token comes from the FilesHub
  developer-accounts vault (`aoneahsan-npm-pat`), never stored in the repo.
- The product speaks as **the windowsweep team**, never as one person (D45, 2026-09-25; it replaces the 2026-09-03
  author-block rule of name, site, GitHub, LinkedIn and email): the README's Author section names the team, its team
  page and its contact form; the licence, LICENSE copyright and npm `author` field keep the owner's name. No phone number.
- Section numbers are frozen from the release that introduced them; a retired section stays as a no-op and a
  number is never reused. 0-21 shipped in 1.0.0, 22-25 in 1.1.0; 26-29 are assigned for 1.4.0 by D77-D81
  (uninstall, leftovers, releases, browserai). RW-066's deferred driver-leftover section takes the next free
  number (30) if it ships.
- Developer mode semantics (owner requirement): developer = idle gate (100 days) + keep-newest on sections 1-5;
  non-developer = clear those caches. Non-interactive with no saved answer defaults to developer on.
- Idle age = newest of write/access/creation time, because Windows disables last-access updates on most
  volumes; the rule may only make files look fresher (conservative). Accepted trade-off 2026-09-03.
- Interactive sections (17, 18, 19, 23) are never auto-confirmed by `--yes`. Of those, 18, 19 and 23 use the
  Recycle Bin; 17 removes build artefacts through the chokepoint outright, because a rebuilt `node_modules` is
  not something a Recycle Bin is for. Downloads is the only personal
  root scanned; Desktop stays a protected root. `--yes` never selects items in them (RW-002 restores this).
- Prefetch, `Windows\Installer`, WinSxS (except via DISM), NTUSER/UsrClass, hiberfil (except via powercfg) are
  never touched by design.
- On the owner's machine (2026-09-03): hibernation to be disabled fully (`--hiberfil off`) in the admin step;
  the real run in the build session covered the safe batch in developer mode only.
- The three repositories live side by side under **`D:\work\windowsweep-root\`** (`windowsweep` = the
  product, `windowsweep-docs` = the docs site, `windowsweep-web` = the marketing site). Owner decision
  2026-09-05, asked which layout is durable: **"Keep this layout as is"**. 🔴 The product folder was renamed
  from `windows-cleanup` to `windowsweep` (final, 2026-09-07), and **the root itself was renamed from
  `windows-cleanup-root` to `windowsweep-root` and confirmed final on 2026-09-12 (D13)** - every instruction
  record was repointed that day; the 2026-09-07 plans and the work-history records keep the old name as
  history.
- **Scope of "feature-complete" (2026-09-03):** the 1.0 catalogue plus the family-parity features shipped as
  1.1 - a read-only globals audit (22), an orphaned-AppData scan (23), an installed-programs idle report (24),
  a startup-items audit (25), driver/upgrade installer leftovers (26, admin), new target rows in sections 1, 8
  and 9, and a `--notify` toast. Sibling features deliberately not adopted: TUI, doctor, check-update, restore
  points, font caches (`remaining-work.md` RW-069).
- **Docs site (2026-09-03):** in scope - `aoneahsan/windowsweep-docs` at `windowsweep-docs.aoneahsan.com`,
  Docusaurus on GitHub Pages like the two siblings. The DNS record and the Pages domain are owner rows.
- **Desktop app (2026-09-03):** a later, separate phase (P6): a Tauri wrapper that runs this same script and
  reimplements no cleanup logic, like `macleanup/desktop`. Not counted toward CLI completion. Its account model
  (free local GUI vs sign-in with plans) is decided when the phase opens.
- **Releases (2026-09-03):** every release from 1.0.1 on gets an annotated tag `vX.Y.Z` and a GitHub Release;
  `v1.0.0` is tagged retroactively on `70c6738`, the commit the published tarball was built from.

### Sessions 13-20 decisions (D13-D54) - moved to `PROJECT-CONTEXT-decisions-2026-09.md`

Moved **verbatim** on 2026-11-05, when this file passed its 500-line ceiling: the decision blocks of sessions
13, 16, 17, 19 and 20 (D13-D54, 2026-09-12 to 2026-09-28). Nothing was reworded; read
[`PROJECT-CONTEXT-decisions-2026-09.md`](PROJECT-CONTEXT-decisions-2026-09.md) for any of them.

### Session 21 decisions (D55-D84) - moved to `PROJECT-CONTEXT-decisions-2026-10.md`

Moved **verbatim** on 2026-11-10, before this file reached its 500-line ceiling: the decision block of session 21
(D55-D84, 2026-10-30 to 2026-11-03). Nothing was reworded; read
[`PROJECT-CONTEXT-decisions-2026-10.md`](PROJECT-CONTEXT-decisions-2026-10.md) for any of them.

### Session 22 decisions (2026-11-05) - resuming the `/complete-project` run

Asked in one batch when the paused run resumed; each answer is his verbatim option.

- **D85 - production proofs "Approve (a)-(f), test only (Recommended)"**: on `nlmetjyytgwaxcliusuo` this session may
  (a) create `aoneahsan.apps.t1+1`, `t1+2` and `t1+admin` through the Auth admin API; (b) try one stranger email
  sign-up, which the Google-only hook must refuse; (c) promote `t1+admin`, use it, then demote it (O8); (d) publish
  `test`-channel release rows for desktop, web and docs through the admin action (normal, urgent, equal, then
  `0.0.0`); (e) create the test users' rows only through the product, probe across accounts and read the catalog;
  (f) let `t1+2` delete itself through `/account`, delete the rest, and read back zero. No production-channel row.
- **D86 - "Release 1.4.2 now (Recommended)"**: CLI and desktop 1.4.2 through the local release kit, carrying the
  tours and walkthrough, an update that installs itself when the window closes, and the no-polling fixes. The
  installed 1.4.1 must take 1.4.2 by itself.
- **D87 - Polar "Sandbox proof, then prod (Recommended)"**: products and webhook endpoints created through Polar's
  API; `POLAR_*` secrets set on the production project, with a sandbox window of about 30 minutes for a `t1+1`
  test-card checkout; production configured afterwards, and checkout opens only if Polar has approved the
  organization. No real payment.
- **D88 - email "Approve all three (Recommended)"**: email marketing on the windowsweep FilesHub key with the
  vault's postal address; the release-newsletter signup on the website and docs, dummy first; one `[TEST]` welcome
  and one `[TEST]` 1.4.2 newsletter to `aoneahsan.apps.t1@gmail.com`, scored only after he confirms receipt.
- **D89 - the shared test Supabase project** (his words: *"please set this as test supabase for any and all
  projects ... they must clear their data etc after they done with it so next can use it easily"*): FilesHub
  `supabase-projects` 30, `test-supabase-use-for-any-project`, ref `jisblczrxduhnxtcdzfd`, is the restore and
  rehearsal target for every production project, leased and wiped after each use (fleet law in
  `~/.claude/rules-detail/supabase-provisioning.md`). This run's restore rehearsal of the release-1.4.1 backup ran
  there.
- **D90 - design gate "Approve all (Recommended)"** (2026-11-06): the drawn website plan administration (the five
  capabilities, plan requests, run allowance and referral settings), the one-sentence legal bar on the site and in
  the desktop window (replacing the full-screen first-run screen), the release-notes signup on the changelog and the
  docs footer, and the eight drawn emails. Web Amendments 33-36, desktop `AMENDMENTS-3.md`. One main-session call
  rides with it: on first run the desktop tour hint waits until the legal bar closes, so two notes never stack.
- **D91 - the seven missing strings "Story system under D59 (Recommended)"**: plan-field limit messages, a plan key
  that already exists, why Free has no Active switch, a badge key that already exists, an empty plan-source list, an
  invalid newsletter address, and the newsletter confirmation email - written through the story pipeline under the
  D59 pre-authorisation; the confirmation email also rides in the D88 `[TEST]` send.
- **D92 - email functions "Yes, after the [TEST] proof (Recommended)"**: deploy `account-welcome`, `admin`,
  `polar-webhook` and `team` to production `nlmetjyytgwaxcliusuo` with the branded composer once the parity and
  escaping tests pass and the `[TEST]` welcome reaches the t1 inbox. Nothing else on production changes.
- **D93 - "Release 1.4.3 when built (Recommended)"**: the legal bar, the walkthrough numerals and the tour-hint order,
  through the local kit (`desktop-v1.4.3` Latest, CLI `v1.4.3 --latest=false`, unchanged engine); the installed 1.4.2
  must stage it in the background and install it when the window closes.
- Found in the main session on 2026-11-06, not an owner question: the **1.4.0 wave of the approved `legal-payments`
  draft** (T-01, T-04, P-01, P-02, P-04, P-05, P-07 to P-11; GATE 4 2026-10-31) was never applied to the website, so
  the live Privacy Policy omits run claims, devices, referrals and Teams that 1.4.0 collects. It is applied in this
  run, dummy first, with the effective date moved to the day it goes live; P-06 waits for the first email sent.
- Settled in the main session, not owner questions: the docs site stays on GitHub Pages (fleet law of 2026-11-05,
  which reversed that day's docs move); the website moved to Cloudflare Pages in the fleet pass the same day
  (project `windowsweep`, `www` same site with the canonical on the bare name); Node 24.16.0 replaced 24.13.0 on this
  machine without its yarn shims or global CLIs, restored with `corepack enable yarn` and the prior global set.

### Session 24 decision (2026-11-07)

- **D94 - his words**: *"windowsweep polar org is approved get that done, and approve all emails so far, approve all
  othre work as well, and continue nd finish all remianing work fully now, release everything in production once done"*.
  Read as: open production checkout (`POLAR_PRODUCTS` set; Polar reads the organization `active`); his approval and
  receipt of the `[TEST]` emails (MANUAL row 37) and of the 1.4.3 newsletter, released to confirmed subscribers; his
  approval of the session-23 work; and the remaining work finished and released, which includes desktop 1.4.4 with the
  Plans screen's checkout-open state (S-005 in `docs/story/drafts/plans-app.md`, built dormant under D61) and the docs'
  plans page. No real charge: the sandbox proved the paid path, an unpaid production checkout proves the live page.
- **D95 - legal GATE 4 for the checkout-open revision, 2026-11-07** (AskUserQuestion, under D59's rule that Terms and Privacy wording goes to the owner first): *"Approve all six (Recommended)"* - the Terms meta description (S3), `terms.plans.polar` with "from version 1.4.4", `terms.plans.team`, `privacy.plans.polar`, `privacy.plans.received` and the web `llms.txt` Terms line (S5, `docs/story/drafts/release-1.4.4.md`) move to the present tense, and the Terms effective date moves to the deploy day. For `privacy.plans.received`, *"Name the extra numbers (Recommended)"*: "For each payment Polar takes, windowsweep keeps one record: the plan, the period it covers, the seat count, the amount, its status, and Polar’s order, subscription and customer numbers."
- **D96 - finish everything now, 2026-11-07.** The Comparison Hub runs in this session (AskUserQuestion, queue upkeep: *"Now, in this session"*; `/comparison-hub` joins run 2026-10-30-2224 at order 3; the vision is on record in root `docs/OWNER-VISION.md`). Then, in his words: *"we need to finish this project, please go with best recommendations, make sure to not go for any workarounds, build real solutions, implement best long term solutions and get all remaining work completed now please, only stop once all is done, and do not ask me any questions unless it's really important or you need me to do something manually"*. So ISSUE-002 to ISSUE-005 are fixed at their roots in this run, and a release follows.
- **D97 - the production actions of ISSUE-003, 2026-11-08,** taken under D94 (*"release everything in production once
  done"*) and D96's words. Migrations `20261107193543` (the subscription state table) and `20261107193640` (its
  functions and `my_plan()`'s `renews`) went in with `supabase db push`, after a rehearsal in a rolled-back transaction;
  `polar-webhook` v8 was deployed (`--use-api`, no Docker, D76); both Polar endpoints, production and sandbox, now also
  send `subscription.canceled`, `.uncanceled` and `.revoked`. The proof used signed synthetic events for one t1+1
  test row (root `site-evidence/subscription-cancel-v145/`), removed and read back at zero. No real customer row was
  touched and no charge was made.
- **D98 - release 1.4.6 and the proof-user cleanup, 2026-11-08,** taken under D96 (*"get all remaining work
  completed now"*). 1.4.6 was cut the same day as 1.4.5 because ISSUE-006 and the root's TASK-001 (the app icon and
  installer pictures from the brand kit) reach people only in a desktop release. In production, the two anonymous
  users the 1.4.5 proofs had created on fresh WebView2 profiles were deleted with their device rows and read back
  absent. A proof launch now reuses a profile that already holds a session, so it creates no user.
- **D99 - Comparison Hub words approved, 2026-11-09.** After the live hub, CCleaner example and docs hub were
  presented for MANUAL-TASKS row 38, the owner replied *"approve all, finish all remainign work fully now"*.
  This approves the WindowSweep Comparison Hub words once and closes completion hard gate 5. It does not record
  completion of the separate manual device, account, token or archive checks in rows 33-36.

### Session 25 decisions (2026-11-10) - the second `/complete-project` run

Asked in one batch in plan mode, after the pre-audit found the 2026-11-09 house-ads rule unmet in three places; each
answer is his option. The run's state file is `projects-finalization-record/production/windowsweep-complete-project.json`
(run `2026-11-10-0028`).

- **D100 - the Comparison Hub ads row "Relabel the row (Recommended)"**: the row "States no ads or bundled offers"
  becomes "States no third-party ads or bundled offers" on all 13 rival pages and both hubs. windowsweep keeps Yes,
  cited to the code (no ad network, nothing bundled); every rival cell stays as sourced, since a page that says "no
  ads" also rules out third-party ads. The docs guides' prose names the row the same way.
- **D101 - the plain ads words "Approve as written (Recommended)"**: the website home band lede becomes "These are ads,
  for the same team's own projects and nothing else. There is no ad network on this site. That sentence is the
  promise: adding one would mean deleting it first. Which is the only kind of promise worth writing down."; the
  desktop Settings → About note becomes "These are ads for the team’s own tools, not an advertising network – nothing
  here is sold, tracked or third-party, and windowsweep never appears in its own list."; the Polar brief's "No
  advertising space" line becomes "Ads: only the windowsweep team's own other tools, in the desktop app and on the
  website. No advertising network, and no space is sold." Dummy first; published only if the lean story panel's fact
  consistency passes with no NEEDS DECISION (the 2026-09-07 condition).
- **D102 - desktop promotions "Clickable cards + 1.4.7 (Recommended)"**: each card in Settings → About opens its
  product's page in the system browser through the existing guarded opener, with no click tracking; the roster is
  re-vendored (Trizlink's casing); the D101 note. Desktop, CLI tag and npm 1.4.7 are released once proven, and the
  installed 1.4.6 must update itself to 1.4.7. Package updates the stack audit adopts ride along.
- **D103 - production touches "Approve all four (Recommended)"** on `nlmetjyytgwaxcliusuo`, this session: (1)
  read-only catalog queries (RLS on every public table including `billing_subscription_states`, grants, SECURITY
  DEFINER exposure, the auth user count); (2) the seeded non-admin proof: `aoneahsan.apps.t1+1` and `t1+2` created
  through the Auth admin API, one owned and one forbidden row each, cross-account read, update, delete and forged
  insert, `t1+1` walking `/account` and `/pricing` live, both deleted and read back to the baseline of 8 users; (3)
  the layer-2 update-flow re-proof on the `test` channel, `t1+admin` publishing normal, urgent and equal rows through
  the audited RPC for desktop, website and docs, the rows ending at `0.0.0`, `t1+admin` deleted after; (4) any
  anonymous user or device row a proof launch leaves, matched to its WebView2 profile first, deleted and read back.
- **D104 - his words, 2026-11-10 00:30 (+0500)**: *"I'M TAKING OFF NOW, I WILL BE BACK TOMORROW, I NEED YOU TO FINISH
  ALL REMAINING WORK FULLY AS BEST AS POSSIBLE BEFORE I GET BACK TOMORROW PLEASE GO WITH BEST RECOMMENDATIONS, I APPROVE
  ALL PLEASE DO NOT STOP ON ANYTHING YOU NEED FROM ME FINISH WHAT YOU CAN WITHOUT ME, FULLY AS BEST AS POSSIBLE, YOU HAVE
  THIS WHOLE SYSTEM, PLEASE GET THE TASK/PROMPT GIVEN TO YOU FULLY, GET ALL WORK AS BEST AS POSSIBLE COMPLETED, CONFIRMED
  AND PUSHED, DEPLOYED AND FINALIZED PLEASE DO NOT STOP UNTIL ALL THAT YOU CAN DO IS DONE, AND AS I SAID, GO WITH BEST
  RECOMMENTDATIONS, I APPROVE ALL"*. Read as: every question this run raises takes its recommended option, recorded as
  it is taken (D105 on); anything only he can do becomes a MANUAL-TASKS row instead of a pause. It names no rule it
  excuses and no sub-agent, so it is not an owner-typed exception and the run stays in the main context.

### How the frontend UI mandates map to this product

`~/.claude/rules/frontend-ui-standards.md` applies to the desktop app (the CLI has no UI at all). Recorded
here as evidence of the checks. D56 supersedes the old plan and admin decision; the 1.4.0
work must meet those requirements and the update-flow gate before completion.

**Met, and verified by measurement on 2026-09-05:**

| § | Mandate | Evidence |
|---|---|---|
| 1 | Decoration and entrance motion | the sweep motif at the hero only; motion consults BOTH the axis and the OS query (`lib/theme.ts` -> `motionAllowed`) |
| 3 | URL state, not bare `useState` | hash history; the filter and tab live in the URL on Sections, History and Settings |
| 5 | `.env.example` in sync, no server secret in a `VITE_` var | every value is a public client identifier; `configuredFeatures()` reports what is absent |
| 6 | SVG-first assets | `src-tauri/icons/icon.svg` is the master; every PNG and the `.ico` are exported from it |
| 9a | Three colour treatments, light and dark | lime / sky / plum, hue 128 registered; 264 combinations measured with zero contrast failures |
| 9b | No `<textarea>` in a shipped product | zero in any component. The one match in `src/styles/shell/08-forms.css` is the rule's own comment (`shell.css` was split by concern on 2026-09-13, RW-122) |
| 11 | ONE theme control, applied pre-paint from one table | `src/lib/axes.json` is the single table; `public/prepaint.js` is GENERATED from it by `vite/prepaint.ts` on every dev start and build, and CI fails a stale committed copy (TASK-019) |
| 14 | Every string through `t()` from day one | enforced by `no-restricted-syntax` AST selectors at `error`, watched failing on two different plants |
| 15 | External links leave the origin, and the do-follow policy | `lib/links.ts` is the one policy module; a raw `href="http…"` appears nowhere in a component |

**Current scope:** §13's admin panel and plan controls are part of 1.4.0 under D56.
The app currently has no upload field (§2) or decorative overlay (§16). The custom
cursor axis was removed on 2026-10-26; the browser's default pointer applies.

**Open, and honestly so:** §10's GATE 4 parity - screenshot pairs of the dummy beside the app, judged by eye
in the app's own WebView2 - is not done, and needs owner row 22. §12's interaction floor has no automated
gate by design; the browser pass proves the screens render and are reachable, not that every control
acknowledges within 100 ms. That is a look-at-it check and it is owed.

### Two durable constraints found on 2026-09-05, worth not rediscovering

🔴 **`Write-Box` draws a 78-glyph rule and indents the subtitle by three.** The 1.4.0
CLI now wraps the tagline inside that rule; the 160-check self-test covers it. Keep
that wrapping when the sentence changes.

🔴 **The tagline lives in FIVE places, not the three the records used to name**, and they do not all agree
today. `package.json` `description`, `WS_TAGLINE` in `lib/constants.ps1`, the docs site's
`docusaurus.config.ts` tagline (which carries a *different* sentence), `docs/README.md`, and the bundled
engine copy at `desktop/src-tauri/resources/windowsweep/lib/constants.ps1` - the last regenerated by
the build's engine plugin (`desktop/vite/engine-bundle.ts`) on every `yarn dev` and `yarn build`.

### Earlier sessions, moved to `docs/project-history.md`

Moved there verbatim on 2026-09-25 under RW-132, in their original order. Moved is not retired: a decision
there binds until a later one replaces it. What each block covers:

- sessions 13 and 16 - what each audit verified, and what no record said
- session 10 (2026-09-07) - the completion-run decisions and the planner's three (the installer file names
  among them), the eight defects and how each was proved, analytics with no opt-out, the two defects that
  meant the app had never worked, and the docs site's page-wide canonical
- sessions 8 and 9 (2026-09-05) - the one-way style promotion, `--select-file`, the generated pre-paint
  script, Rust compiling here, and the switch to Supabase
- sessions 7, 6, 4, 5 and 3 (2026-09-03 to 2026-09-05) - the headline scope, the storytelling retrofit,
  gates 1-3, the download lift, verified-only target paths with `C:\Intel` rejected, direction 01 rejected,
  and the desktop account, telemetry and palette decisions
- session 14 (2026-09-13/14) - the v3 run's decisions, taken from recorded rules and none from the owner (moved
  later on 2026-09-25, when this file reached 495 lines)

## External records and registrations

- **FilesHub project id 60** (`slug: windowsweep`, public id `01M1M5FCY6TMM6KGC0W6GE79KY`), created 2026-09-03.
  Its vault carries the Supabase link (id 15), the Firebase web config (the GA4 measurement id included,
  written 2026-09-08), Sentry, Clarity and Amplitude, and the updater's minisign private key and password
  (written 2026-09-07 so a second machine can produce signed builds). The Google OAuth client is not a vault
  item - it lives in Supabase's own Auth -> Providers form (row 15).
- **Palette registry:** primary hue **128** (lime), light `#4d7c0f`, dark `#a3e635` with dark on-accent text.
  Registered 2026-09-03 in `~/.claude/palettes/project-palettes.json`.
- **Dev ports:** 5972 (docs site start), 5973 (docs site serve), 5974 (desktop Vite dev URL), 5975 / 5976
  (the marketing site dev / preview), in `~/.dev-ports.json` - paths repointed to `windowsweep-root` on
  2026-09-12.
- **Portfolio:** `apps/WINDOWSWEEP_portfolio-info_2026-09-25.md` in the notebook, with a byte-identical copy at
  this repository's root (outside the npm `files` allowlist). Refreshed on 2026-09-25 to CLI 1.3.1, `desktop-v1.3.0`
  with sign-in, `/terms` and the team voice (27 modules and 22 Rust tests counted at the tags); the master links
  entry carries `links.web` = the site, `links.docs` over HTTPS, and `ownerReview` still empty (owner row 5).
- **ORCID:** `windowsweep.bib` (`aoneahsan-windowsweep-2026`) in the notebook's ORCID folder and appended to
  `aoneahsan-all-works.bib`; the import and the work-type retype are owner rows in that folder's
  `MANUAL-TASKS.md` (row 24).
- **Documentation site:** `aoneahsan/windowsweep-docs` at `D:\work\windowsweep-root\windowsweep-docs`,
  deployed to GitHub Pages and green; `windowsweep-docs.aoneahsan.com` answers **HTTP 200** (all 55 sitemap
  URLs, 2026-09-08). HTTPS waits on GitHub's certificate (the host still presents `*.github.io`; no CAA on the
  apex); the agent re-adds the domain via the Pages API (D18). `package.json` `homepage`, the README links and
  the repo fields switch in ONE pass after the first HTTPS 200; `WS_DOCS` in `lib/constants.ps1` moves inside
  the 1.3.0 cascade because the engine equals `v1.2.0`.
- **Marketing site:** `aoneahsan/windowsweep-web` (private) at `D:\work\windowsweep-root\windowsweep-web`,
  **live** at `https://windowsweep.aoneahsan.com` since 2026-09-08 on Firebase Hosting (project `windowsweep`,
  number 123008957321, hosting + GA4 only); the palette registry's `domain` names it since 2026-09-12;
  `package.json` `homepage` and both repos' GitHub homepage follow in the write-back.

## Supabase

The desktop app's backend, since the owner's standing directive of 2026-09-05. **Resolved and recorded
2026-09-07**, when he created the project (`docs/MANUAL-TASKS.md` row 23, which needed a new account because
all seven existing ones were at the two-project free-tier limit):

- ref: `nlmetjyytgwaxcliusuo`
- url: `https://nlmetjyytgwaxcliusuo.supabase.co` (matches the ref - checked, because a registration's `url`
  field silently drives every derived endpoint)
- region: `ap-south-1` · FilesHub Supabase project **id 15** · dashboard:
  `https://supabase.com/dashboard/project/nlmetjyytgwaxcliusuo`
- account: `aoneahsan.amp.p1@gmail.com` (FilesHub account id 8), which holds a personal access token
- registered in FilesHub: **yes** (verified 2026-09-07), and the project link is recorded -
  `PATCH /projects/windowsweep {"supabase_project_id": 15}`, so `GET /projects/windowsweep/vault` now answers
  the "which Supabase project is this app's?" question directly instead of returning `null`
- gates, all passing 2026-09-07: **G1 runtime** (`endpoints.api` + `config.publishable_key`) · **G2 schema**
  (`has.db_password` + `has.db_url_session_pooler`) · **G3 platform** (the account's PAT). The REST root
  answers 401, which is PostgREST's signature; `keepalive.last_status` is `ok`
- 🔴 **Google sign-in is NOT enabled yet.** `GET /auth/v1/settings` reports `external.google: false`, so
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are deliberately kept out of release builds and the
  local `.env` until owner row 15 lands - an app advertising sign-in it cannot complete is worse than one
  that says the feature is unconfigured, which is what `configuredFeatures()` makes it do today
  (re-probed 2026-09-08 and again 2026-09-12: still `false`). ⚠️ `external.email` IS `true` with
  `disable_signup: false` and `mailer_autoconfirm: false`, which is how the account-deletion probe created a
  confirmed throwaway user through the admin API while Google stayed off - email sign-up is not a product
  feature here, it is a test-account mechanism

### The site's tables and the eighth migration - moved to `PROJECT-CONTEXT-supabase.md`

The five forward-only migrations behind the marketing site's tables (applied 2026-09-08) and the eighth,
`delete_my_account()` (D14, applied and proved 2026-09-12), with their grants, probes and live checks, are in
[`PROJECT-CONTEXT-supabase.md`](PROJECT-CONTEXT-supabase.md) - moved there verbatim on 2026-09-28, when this file
passed its 500-line ceiling (514 lines).

## Constraints and non-goals
- Must: honour `--dry-run` in every destructive helper and external command; route every deletion through
  `Remove-PathSafe` / `Send-ToRecycleBin` with a declared `-Within` root; keep every file under 500 lines;
  keep source ASCII-only; make no network calls; ship only the `files` allowlist.
- Must not: add dependencies; follow reparse points; delete inside a protected root under any flag; auto-run
  deep or interactive sections in batch mode; store credentials or machine-specific paths in the repo.
- Explicitly out of scope for the CLI: registry cleaning, changing startup items (section 25 only reports),
  driver or service changes, undo for caches. Running a program's own uninstaller is in scope since D77 (section
  26, interactive only); section 24 still only reports. A GUI is not part of the CLI; the desktop app is phase P6.

## Key paths and contracts
- `lib/safety.ps1` - the chokepoint and the protected lists; every change here is a safety change.
- `lib/constants.ps1` - section catalogue, profiles, safe batch, version fallback (must equal `package.json` and `VERSION`).
- `lib/actions.ps1` - `New-Target` rows + `Invoke-TargetList`; the cache-folder name allowlist for layout kinds.
- `modules/release_helpers.ps1` - the self-test groups [1]-[12]; `modules/self_test_extra.ps1` carries groups
  [13]-[18]. 160 checks in total since 1.3.0 (junction, dry-run, keep-newest, extension, catalogue and contract fixtures).
- `docs/sections.md`, `docs/cli-reference.md`, README section table - must agree with the catalogue.

## Verification
- Standard gates: `node bin/windowsweep.js --self-test --no-color` (exit 0), `npm run version:check`,
  `npm pack --dry-run` shows only the allowlist, `Invoke-ScriptAnalyzer -Recurse -Settings PSScriptAnalyzerSettings.psd1`
  (0 findings).
- Runtime verification: `--dry-run --all --yes --developer` reviewed section by section before any real run;
  CI repeats self-test + dry-run on Windows PowerShell 5.1 and PowerShell 7.
- Gate proof (2026-09-03): two planted defects of different shapes each turned `--self-test` red (exit 1) -
  a protected path declared as a section 9 target (check [6]) and an unclosed function in a module (check [3]);
  both removed, files byte-identical, 108/108 again.
- CI history: the first three runs on `main` failed on PSScriptAnalyzer under PowerShell 7
  (`PSAvoidOverwritingBuiltInCmdlets` lists `Write-Log` for the core target); `84c732f` renamed the function
  and run 33739406904 succeeded. Windows Server (`windows-latest`) is therefore dry-run-tested on every push.
- Audit (2026-09-03, `what-this-project-consists-of.md`): every documented promise checked against the code.
  Findings, all recorded in `remaining-work.md` P0 and none fixed yet: `--yes` pre-selects every item of
  sections 17-19 in the walkthrough and menu and section 17 then deletes without a human choice (RW-002, HIGH);
  section 19's title names Desktop (RW-003); sections 18/19 print the tier "permanent" (RW-004);
  `--purge-all` is documented as asking once more (RW-005); a running editor's VSIX cache is documented as
  cleared but is guarded (RW-006); `--install-task`/`--install-alias` under npx register the evictable npx-cache
  path (RW-007); exit code 130 comes only from the Node launcher (RW-008); `--uninstall-data --yes` asks
  nothing (RW-010); 13 keywords (RW-011).

## Verified runs and the release record

Moved verbatim to `docs/runs-and-releases.md` on 2026-09-25 under RW-132: every real run with its numbers
(the unintended one of 2026-09-14 included), the updater proof, the site's telemetry capture, what has not run
for real yet, and every npm publish, tag and GitHub Release from 1.0.0 to `desktop-v1.3.2` and CLI 1.3.2. Record new ones
there. Two rules in it bind the next run and publish: `Get-ProtectionReason` stays table-driven, and the
publish diff uses `%SystemRoot%\System32\tar.exe`.

## Two traps in this workspace's own layout

🔴 **`remaining-work-summary.md`, `remaining-work.md`, `what-this-project-consists-of.md` and both completion
plans live at the WORKSPACE ROOT, outside this repository** (owner decision, 2026-09-07; backed up since 2026-09-26
on the private site repo's `project-root` branch, D49). Two independent story
slots reached for a GitHub blob URL to `remaining-work-summary.md` while drafting the README, and every one
of those URLs **404s for every reader**: `git ls-files` does not list the file, so there is nothing at that
path on github.com. A link is a promise. When a document needs to point at project status, point at
`docs/features/windowsweep-completion/00-tracker.json`, which IS tracked.

🔴 **A `git clone` of the three repositories does not carry any of them.** Moving this project to another machine
means running `../RESTORE.md`, whose first line clones the root's own `project-root` branch (D49).

## Open material unknowns

- **No owner decision is open (2026-09-28).** D53 is carried out: `desktop-v1.3.2` with TASK-020 (DONE-020), the
  sign-in fix (DONE-021) and the run-folder fix (DONE-022). D54 is carried out too: a development build reports no
  analytics (DONE-023), and no task is open.
- **Still owed by the owner, polled at the start of every session:**
  - **Web row 4** (`windowsweep-web/docs/MANUAL-TASKS.md`) - the rest of the real Google path on the site, in his own
    browser (Google refuses an automated one, RW-116). Its sign-in is proved from the server (2026-09-28,
    `../site-evidence/web-row4/`). The cancelled attempt and the deletion remain, and they need a throwaway account:
    his own is the site's superadmin and holds the desktop's synced rows.
  - **Rows 5 and 13** (the master-links review and the ORCID import) - unchanged.
  - **Rows 26 and 28** (the weekly task seen in Task Scheduler; a cancelled real run's log compared) - ready
    since `desktop-v1.2.0` shipped.
  - **Row 29, a glance at the four dashboards** - the agent proves the beacons on the wire and holds no
    dashboard login.
- ~~**Row 15, Google sign-in.**~~ **CLOSED 2026-09-24 (D25):** `external.google: true`. The site signs in since
  2026-09-25; desktop release builds carry the keys from `desktop-v1.3.0` on (`SUPABASE_ENABLED`, set 2026-09-25
  after TASK-013's live verification, O6').
- ~~**Row 31, one real desktop sign-in (D30).**~~ **CLOSED 2026-09-28**, by the owner on the installed 1.3.2: his
  Google sign-in and one dry-run, read back from the server with no path, drive label, machine name or user name
  in either synced row (`docs/MANUAL-TASKS.md` row 31, `../site-evidence/row31/`).
- ~~**Row 30, the OAuth consent screen (D29).**~~ **CLOSED 2026-09-28** on the owner's word ("google consent screen
  is published"). No API reads the publishing status, so no agent probe backs it.
- ~~**GitHub, not the owner:** the docs certificate.~~ **CLOSED 2026-09-12.** The agent removed and re-added
  the domain under D18; GitHub issued a Let's Encrypt certificate naming the host within the hour
  (`https_certificate.state: approved`, `notBefore` 15:57 UTC), `https_enforced` is on, `http://` returns 301,
  and the link write-back ran in one pass. No GitHub support step was needed.
- **Moved to a second machine** (owner, 2026-09-07): row 20 (the candidate-path probe that settles RW-064,
  RW-065 and RW-066) and the P1 verification runs (rows 1, 2, 3, 6, 7, 8, 9, 10, 19, 21); then CLI 1.4.0 if
  those verify. CLI 1.3.0 shipped here instead (D23), and `desktop-v1.3.0` was cut, published and proved here (D26, 2026-09-25). The handoff is
  section B11 of `../completion-plan-v3-2026-09-12.md`.

## 2026-11-12 continuation decisions

- **D105:** Under D104, the recommended fix for the two layout findings is applied dummy first and prepared as 1.4.8, preserving published 1.4.7 tags and assets. The desktop readout uses intrinsic minimum width; the website editor keeps Save and its result outside the scrolling body. No cleanup-engine behaviour changes.
- **D106:** Asked whether to recreate `aoneahsan.apps.t1+admin@gmail.com` as an administrator on production `nlmetjyytgwaxcliusuo`, inspect the corrected plan editor without saving plan changes, then delete it and return to eight users. The owner answered **"Approve this temporary admin verification (Recommended)"**. The proof completed: zero plan writes; the exact tagged identity was demoted/deleted, its browser session removed, and eight users read back.
