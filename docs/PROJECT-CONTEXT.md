# Project Context - windowsweep

Last Updated: 2026-09-26 (latest: D50 - `desktop-v1.3.1` this session - and D51 - the stray `runs$RUNID` folder deleted; TASK-019's generators became Vite plugins. Earlier the same day: D49 - the workspace root backed up on the private site repo's `project-root`
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
- Current status (2026-09-25): **CLI 1.3.1** on npm and **`desktop-v1.3.0`**, the repository's Latest release, both
  published 2026-09-25 - sections 0-25, 160 self-test checks, and sign-in with sync live in the desktop app; the
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
  number is never reused. 0-21 shipped in 1.0.0, 22-25 in 1.1.0; the next new section starts at 26 (which is
  free because RW-066's driver-leftover section was deferred, not shipped).
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

### Session 13 decisions (2026-09-12) - the audit

Asked to audit the whole project again and rewrite every record, the owner settled eight questions. His
answers by the option label he chose, and what each one changed:

| # | Question | Answer | Consequence |
|---|---|---|---|
| **D13** | The workspace root had been renamed to `windowsweep-root` under every record | **"Yes, windowsweep-root is final"** | every instruction record repointed; the memory note moved to the new project key; historical quotes keep the old name |
| **D14** | `/privacy` promises account deletion no surface could perform | **"Build it"** | RW-113: a `delete_my_account()` SECURITY DEFINER RPC in this repo's schema home, wired into the site's `/account` and the desktop Account screen, proved on a throwaway alias |
| **D15** | Google sign-in (MANUAL-TASKS row 15) | **"Yes, I will enable it during this run"** | RW-116: sign-in, contact, account, deletion and the admin gating verified as the non-admin alias and as the admin |
| **D16** | Execution model for the remaining work | **"Fable writes audit + plan, Opus executes"** | this session ends with the v3 plan; an Opus session runs its waves. Restated mid-session: *"make sure fable 5.1 plans and save plan and then stop i will switch model to opus 5 and it will (should) implement all planned work, it should run 4 custom subagents to get all planned work as best and fast as possible implemented"* |
| **D17** | Android | **"Keep it out"** | no Android build for the site or the CLI; Capacitor stays wired |
| **D18** | The docs certificate GitHub has not issued in five days | **"Yes, remove and re-add via the API"** | RW-102 opens with the Pages API re-add, then one pass over every docs link |
| **D19** | The two 1.2.0 report-body wording changes flagged for veto | **"Both stand"** | `Reclaimed` in the report tables and the HTML hero without `dry-run` are final |
| **D20** | The sub-agent ceiling for the Opus run | **"Up to four at once"** | scopes pairwise disjoint, verified before every dispatch; hot files main-only; the standing rule of two returns afterwards |

### Session 16 decisions (2026-09-17) - the v4 audit, four from the owner

He ran his standard audit prompt: understand the whole project, refresh every record to the state of the
tree, estimate what is left, then finish it and deploy. Fable 5.1 audited read-only and wrote
`../completion-plan-v4-2026-09-17.md`; Opus 5 executes it. Four decisions, each his verbatim option:

- **D21 - "One writer at a time".** Final, and it supersedes D20's four and the three of 2026-09-14. His
  standing audit prompt still carries the line "it should run 4 custom subagents", so he was asked directly
  and chose the one-writer ceiling on context cost. Read-only explorers may run beside the single writer;
  hot files stay main-only; agents never commit, push, deploy or publish.
- **D22 - "I will enable it before Opus runs"** (row 15, the Google Web OAuth client). 🔴 Probed the same
  day and `external.google` still reads **false**, so ordering rule O6 governs: do everything else first,
  re-poll, and if it is still off when `desktop-v1.2.0` is cut, that release ships with sign-in dormant
  exactly as 1.1.0 did. Never wait on it, and never claim it flipped without a fresh probe.
- **D23 - "Yes, cut 1.3.0 now".** RW-121 ships in this run, so the CLI closes here rather than on the second
  machine. 🔴 The **desktop stays at 1.2.0**: `desktop-release.yml` compares the app manifests with `VERSION`
  at the tagged commit, so the desktop tag is cut first, and because the bundled engine is untracked and
  copied at build time a later dev build carries a 1.3.0 engine under a 1.2.0 app until the next desktop
  release catches up. That consequence is stated in the release notes, not left to be discovered.
- **D24 - "Straight through".** Records, then every unblocked item to the release and the deploys, then the
  records again. No review in between; he reviews at the end, himself.

### Session 17 decisions (2026-09-24/25) - the v5 audit and its execution, twenty-two from the owner

He re-ran his audit prompt, then asked mid-turn for a Terms page "first, so i can get google cloud console app
in production and approved", then approved executing plan v5 with custom agents. Each line is his verbatim option.

- **D25 - Google sign-in: "enabled just now, continue"** - probed `external.google: true` 2026-09-24T10:15Z.
- **D26 - `desktop-v1.3.0`: "Here, once Google is on (Recommended)"** - cut on THIS machine with the 1.3.0
  engine, TASK-013 and sign-in live, a GATE 4 round and the updater proof 1.2.0 -> 1.3.0. Supersedes D23's
  second-machine placement for the desktop.
- **D27 - "Yes, finish on Opus 5.5 (Recommended)"** - the audit prompt's Fable-plans role waived for this run.
- **D28 - "This session sets them (Recommended)"** - Supabase Auth `site_url` = `https://windowsweep.aoneahsan.com`,
  `uri_allow_list` = `https://windowsweep.aoneahsan.com/**,http://127.0.0.1:*`; set and read back 2026-09-24.
- **D29 - "I'll make sure it's published (Recommended)"** - the owner publishes the OAuth consent screen
  (MANUAL-TASKS row 30).
- **D30 - "Also a t1+admin identity"** - RW-116 runs as `t1+1` and `t1+del` (admin-API users, sessions injected),
  `t1+admin` promoted by out-of-band SQL then demoted and deleted in the same wave (O8), the real Google path once
  as the base automation identity, and one real desktop sign-in by the owner (row 31).
- **D31-D34 - the Terms facts:** "Pakistan (Recommended)" (law and courts) · "Google's age where you live
  (Recommended)" · "Ahsan Mahmood (Recommended)" (operator, `aoneahsan@gmail.com`) · "Site, account and software
  (Recommended)". The panel was his "Lean panel (Recommended)"; its three answers (acceptance, misuse, as-is) and
  the effective date ("The day it goes live") are in `docs/story/decision-log.md`. GATE 4: "Approve, ship it".
- **D35 - up to three custom agents** ("i approve, if needed run up to 3 custom subagents"), superseding D21 for
  this run; raised by D43.
- **D36 - "Yes, apply it (Recommended)"** - `runs_user_id_started_at_idx` on `runs (user_id, started_at desc)`,
  applied 2026-09-25 through the session pooler and verified from `pg_indexes` (migration `20260924160739`).
- **D37 - "After the releases, this run (Recommended)"** - the fleet package baseline (ESLint 10, the script
  contract, prettier, husky + lint-staged, vitest) runs after `desktop-v1.3.0`, in this run.
- **D38 - "Manage own account (Recommended)"** - the Terms age is the one Google requires to manage your own
  Google Account, so a parent-supervised child's account does not qualify.
- **D39-D42 - the desktop sync behaviour:** a failed Remove keeps manual retry ("Manual retry") · the settings
  notice sits on Account plus one Home line, in memory only ("Account + a Home line") · no notice on a fresh
  machine ("No notice then") · no notice when a date-only win changes no value ("No notice then").
- **D43 - up to four custom agents** ("re-run the custom subagents up to 4 custom subagents", 2026-09-25),
  superseding D35: scopes pairwise disjoint and verified before each dispatch, hot files main-only, agents never
  commit, push, deploy or publish, and the account-creating and deleting steps of RW-116 stay in the main session.
- **D44-D46 - the team voice** (asked 2026-09-25, after the owner's fleet rule of the same day: products speak as
  "the {Product} team", never one person). **D44 "Change first, then release (Recommended)"** - the desktop
  Settings wording changes, through the story pipeline with his GATE 4 and dummy first, BEFORE `desktop-v1.3.0`
  is tagged. **D45 "All public surfaces, legal kept (Recommended)"** - the team voice on the site, the docs site,
  the README and the desktop app, author metadata included; the Terms operator (D33), the LICENSE copyright and
  the npm `author` field stay, as legal and registry facts. **D46 "Drop it from product rosters
  (Recommended)"** - the personal-portfolio entry ("Meet the Developer") leaves every product roster; the
  portfolio keeps its own voice where it lives.
- **D47 - the About panel stays** (asked 2026-09-25, after GATE 4 round 14 found D-67: a Settings -> About panel the
  app has carried since its first build and the dummy never had). **"Keep it, add to dummy (Recommended)"** - its
  three sentences and the **Source** / **Support this work** buttons are kept word for word and written into the
  dummy first; the answer is also that panel's GATE 4. D-66 (the Settings status note) was the main session's call by
  the round-8 amendment and arrives in the app. Both are checked by round 15 before the tag (D44).
- **D48 - TASK-017 is applied** (asked 2026-09-25): **"Yes, apply it (Recommended)"**. The forward migration
  `20260925154905_stamp_contact_request_handled.sql`: a trigger stamps `handled_at` and `handled_by` on the server when
  the status changes (cleared on a return to `new`, pinned otherwise), and the admin's column grant narrows to
  `status`. The site stops sending both first, and RW-116's flow 3 is re-run after. A production schema change, so his
  yes came first (the D30/D36 pattern).
- **D49 - the workspace root is backed up in git** (asked 2026-09-26): **"get this root folder backed up in git
  properly in existing project repo, in project-root branch or whatever branch we have decided for this purpose in
  global rules, make sure to initialize claude properly in this root folder and put readme etc, so our context
  management will be as best and optimized as possible"**. The fleet rule for a root container whose product
  repository is public puts it on the private `windowsweep-web`: branch `project-root`, remote `o` fetching that
  branch only, unrelated history, never merged. The `webview2-profile/` caches stay out; `../RESTORE.md` rebuilds
  the workspace. It supersedes D1's consequence that the root is not a repository; the planning files still never
  enter this public repository.
- **D50 - `desktop-v1.3.1` is cut in session 18** (asked 2026-09-26): **"Yes, this session (Recommended)"** - after
  the hook line and TASK-019: the O2' cascade to 1.3.1, a kit from `release-kit-1.3.0/`, GATE 4 round 16 until CLEAN,
  publish `--latest`, the updater proof 1.3.0 -> 1.3.1, then the site's download page and the docs (O3').
- **D51 - the stray `runs$RUNID` app-data folder is deleted** (asked 2026-09-26): **"Delete it (Recommended)"** -
  its three files were listed with their SHA-256 in `../gate4-evidence/stray-runs-RUNID/listing.txt` first.

### How the frontend UI mandates map to this product - the declared exemptions

`~/.claude/rules/frontend-ui-standards.md` applies to the desktop app (the CLI has no UI at all). Recorded
here because the rule says anything a product declines to ship is **declared with a reason, never quietly
dropped** - and three of its mandates genuinely do not apply to a local disk utility.

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

**Declared out, with reasons:**

🔴 **§13, the admin panel and the five plan-administration capabilities: NOT APPLICABLE, and this is the
reason.** The rule exists so a product's limits are admin fields rather than code changes. This product has
**no server, no plan, no limit and no second user**: the engine runs locally with no network calls at all, and
the desktop window's only account feature is syncing one person's own settings between their own machines.
There is nothing an administrator could administer and no limit to raise. Consistent with the owner's
2026-09-05 decision that **no surface makes a pricing claim** - which is why the app says what signing in
*does* rather than what it costs.

⚠️ **§2, the upload-field info popover:** there is no upload field anywhere in the app. Nothing to declare
beyond its absence.

⚠️ **§16, a decorative overlay painted outside its surface:** the custom cursor is an axis and is drawn
inside the app shell rather than `position: fixed` on `<body>`, so the band-colour resolution the rule
requires does not arise. If a floating badge or scroll indicator is added later, that mandate applies to it.

**Open, and honestly so:** §10's GATE 4 parity - screenshot pairs of the dummy beside the app, judged by eye
in the app's own WebView2 - is not done, and needs owner row 22. §12's interaction floor has no automated
gate by design; the browser pass proves the screens render and are reachable, not that every control
acknowledges within 100 ms. That is a look-at-it check and it is owed.

### Two durable constraints found on 2026-09-05, worth not rediscovering

🔴 **`Write-Box` draws a 78-glyph rule, so the tagline has a de-facto 75-character
budget.** `lib/ui.ps1` draws a 78-character rule and indents the subtitle by three, so anything longer
overruns it in the terminal. The current tagline is 91 characters and already does. Cosmetic and accepted,
recorded so the next session does not treat it as a new defect - and so a tagline rewrite knows the real
constraint is 75, not the 110 the content map states for the npm and docs-site copies.

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

### The marketing site's tables, applied 2026-09-08

Five forward-only migrations, authored in Drizzle at `desktop/src/db/schema/site.ts` and applied with
`supabase db push`. The schema's ONE home stays the **desktop** repo (owner decision P8-D2); the site reads
generated types at `windowsweep-web/src/db/types.ts`, which is **generated, never authored** -
re-run after every migration by the procedure in `windowsweep-web/docs/runbooks/regenerate-db-types.md`
(`--project-id` with the account PAT in the environment, into a temporary file first - never `--linked`,
which the CLI refuses under its cached login, and never a redirect straight into the real file).

- `profiles`, `contact_requests`, `admin_audit`. RLS on all three, 8 policies, 4 triggers, column-scoped
  grants. `supabase/rollbacks/` exists beside the migrations and is **never applied automatically**.
- 🔴 **`platform_role` is in NO grant, for any role.** It changes only out of band, by rule. The two fixed
  admin emails are stamped `superadmin` by the `auth.users` trigger, not by a migration touching the table.
- 🔴 **The generated types are wider than the grants**, because they come from the *schema*. `Insert`/`Update`
  expose `platform_role` and `email` as writable; a write to either typechecks and then fails `403 42501`,
  and the message names the **table** rather than the column, so it reads like a broken policy when the
  policy is right. The narrowing lives in the site's data layer (`windowsweep-web/PENDING-TASKS.md`
  TASK-001), and **`.upsert()` is banned on these tables** - PostgREST builds `ON CONFLICT DO UPDATE SET`
  from every payload key and Postgres checks the privilege at plan time, so a column-scoped UPDATE grant
  refuses the write even when nothing conflicts.
- Live constraints the UI must mirror rather than discover: contact requests are rate-limited to **5 per hour
  per user**, raised as `429` with SQLSTATE `PT429`; `message` is 10-4000 characters and `subject` <= 120,
  and `NOT NULL` is what makes those CHECKs bite, because a CHECK evaluating to NULL passes.
- 🔴 **`ALTER DEFAULT PRIVILEGES ... REVOKE EXECUTE ON FUNCTIONS FROM public, anon, authenticated,
  service_role` has NO EFFECT on this project.** A `pg_default_acl` row granted by `supabase_admin` covers
  the same `(schema, objtype)` and outranks ours, so functions created afterwards are born with
  `proacl = NULL`, which is EXECUTE to PUBLIC. Confirmed three ways. The only control that holds is an
  explicit **per-function** `revoke`, in the same migration that creates the function, and the only proof is
  that function's own `proacl`. Recorded fleet-wide in `~/.claude/rules-detail/data-fetch-budget.md`.
- Verified from the catalogues and by live `anon` probes rather than from migration text: `pg_policies` shows
  all 8 policies with `USING`/`WITH CHECK` intact and none naming `anon`; `has_table_privilege` shows
  TRUNCATE and MAINTAIN false for all three roles on all five tables; five `anon` calls over PostgREST return
  `401 42501`, a refusal rather than an empty result that would have passed vacuously against empty tables.
  Row counts are 0/0/0/0 - the probe run left nothing behind.

### The eighth migration: `delete_my_account()`, applied and proved 2026-09-12

Owner decision D14. `20260912170206_delete_my_account_function.sql`, generated by `yarn db:custom` so the
`supabase` prefix and the `_journal.json` entry come from drizzle-kit rather than by hand. Drizzle models no
functions, grants or comments, so `site.ts` was deliberately NOT edited - there is nothing about this
migration it could express.

- The function is **one statement**: `delete from auth.users where id = auth.uid()`, preceded by a null-uid
  guard that raises `42501`. 🔴 The guard is the authentication step and it must be inside the body, because
  the bare delete with a null uid matches zero rows and **succeeds** - PostgREST would answer `204` and a
  caller who was never signed in would be told their account was deleted.
- 🔴 Why one statement is enough, read from `pg_constraint` rather than from the schema files: every FK
  referencing `auth.users` is `confdeltype = 'c'`. In `public` that is `profiles`, `user_settings`, `runs` and
  `contact_requests`; in `auth` it is all eight internal tables, so the delete takes the sessions with it,
  which is what makes the account gone rather than merely unreachable.
- 🔴 What does NOT go, and that is correct: `admin_audit` is not user-owned - it records what an ADMIN did,
  and its `actor` column deliberately carries no foreign key, as does `contact_requests.handled_by`. An audit
  trail a person can erase by deleting their own account is not an audit trail.
- Verified from `pg_proc`, never from the file: `prosecdef` true, `proconfig` = `search_path=""`, owner
  `postgres`, no argument, returns void, and `proacl = {postgres=X/postgres,authenticated=X/postgres}` -
  EXECUTE to `authenticated` and nobody else. 🔴 This is the first **reachable** function on the project to
  carry the per-function revoke: the four earlier ones return `trigger`, which Postgres refuses to invoke
  directly and PostgREST leaves out of the schema cache, so their hole was latent. This one is exposed at
  `POST /rest/v1/rpc/delete_my_account` the moment it exists.
- Proved live on a seeded throwaway user (`aoneahsan.apps.t1+2@gmail.com`, created confirmed through the
  admin API): the publishable key alone -> `401 42501`; the secret key (`service_role`) -> `403 42501`; the
  user's own JWT -> **204**, after which `auth.users`, `profiles`, `user_settings`, `runs`,
  `contact_requests` and `auth.identities` all went **1 -> 0** for that id. The null-uid branch was exercised
  separately as `postgres`, the only caller that reaches the body. The probe left nothing behind: the RPC
  under test deleted its own test data.
- ⚠️ **Stated rather than rounded up:** the `auth.sessions` transition was NOT measured - it read 0 before the
  sign-in and 0 after the delete, so the session the password grant created was never counted while it
  existed. The sessions claim rests on the catalogue (`sessions_user_id_fkey` is `confdeltype='c'`), not on a
  measured row going away.
- ✅ **Closed 2026-09-13 - was a known consistency gap, never a live hole:** `is_platform_admin()` kept
  `service_role` EXECUTE, because its migration revoked only `from public, anon` and Supabase's default ACL names
  `service_role` explicitly, so revoking PUBLIC never removed it. The forward migration
  `20260912202759_revoke_is_platform_admin_service_role.sql` removed it, and `pg_proc` read back
  `authenticated=X/postgres` and nothing else beside the owner (`desktop/supabase/README.md`). It stays the
  cleanest demonstration of why a migration names all four roles. *(Corrected in place 2026-09-25: this line
  said the gap was still open.)*
- **Auth URLs, 2026-09-24 (D28):** `site_url` was `http://localhost:3000` and `uri_allow_list` was empty; set
  over the Management API (`PATCH /v1/projects/nlmetjyytgwaxcliusuo/config/auth`, the two fields only) to
  `https://windowsweep.aoneahsan.com` and `https://windowsweep.aoneahsan.com/**,http://127.0.0.1:*`, and read
  back. The desktop's loopback return is the `127.0.0.1:*` entry.
- **Index, 2026-09-25 (D36):** `runs_user_id_started_at_idx` on `runs (user_id, started_at desc)`, migration
  `20260924160739`, pushed through the session pooler (the direct IPv6 host timed out mid-authentication) and
  read back from `pg_indexes` and `supabase_migrations.schema_migrations`; `runs` held 0 rows, and `auth.users`
  held 0 users before RW-116 created its three.
- **Verified as a person, 2026-09-25 (RW-116, TASK-013):** two suites of throwaway identities, made and torn down
  by the main session - `t1+1`, `t1+del` and `t1+admin` (promoted for its checks only, then demoted and read back,
  O8) against the live site; `t1+desk1` and `t1+desk2` against a desktop dev build. Every result was re-read from
  the catalog, and after both teardowns `auth.users` and every user table read 0 again; the triage's two
  `admin_audit` rows stay, by design. The RLS probes held (another user's rows 200 `[]` to select, delete and
  update; an insert in their name 403 `42501`). The real Google path cannot be automated - Google refuses the
  browser after the email step - so it is the owner's (web MANUAL-TASKS row 4). Found on the way: TASK-017.
  GATE 4 round 13 makes the `t1+desk1` / `t1+desk2` pair once more for its signed-in states and tears it down.

## Constraints and non-goals
- Must: honour `--dry-run` in every destructive helper and external command; route every deletion through
  `Remove-PathSafe` / `Send-ToRecycleBin` with a declared `-Within` root; keep every file under 500 lines;
  keep source ASCII-only; make no network calls; ship only the `files` allowlist.
- Must not: add dependencies; follow reparse points; delete inside a protected root under any flag; auto-run
  deep or interactive sections in batch mode; store credentials or machine-specific paths in the repo.
- Explicitly out of scope for the CLI: registry cleaning, changing startup items (section 25 only reports),
  driver or service changes (section 26 removes installer leftovers, never drivers), undo for caches, running
  an uninstaller (section 24 only reports). A GUI is not part of the CLI; the desktop app is phase P6.

## Key paths and contracts
- `lib/safety.ps1` - the chokepoint and the protected lists; every change here is a safety change.
- `lib/constants.ps1` - section catalogue, profiles, safe batch, version fallback (must equal `package.json` and `VERSION`).
- `lib/actions.ps1` - `New-Target` rows + `Invoke-TargetList`; the cache-folder name allowlist for layout kinds.
- `modules/release_helpers.ps1` - the self-test groups [1]-[12]; `modules/self_test_extra.ps1` carries groups
  [13]-[18]. 156 checks in total (junction, dry-run, keep-newest, extension, catalogue and contract fixtures).
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
for real yet, and every npm publish, tag and GitHub Release from 1.0.0 to `desktop-v1.3.0` and CLI 1.3.1. Record new ones
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

- **No owner decision is open (2026-09-25).** TASK-017 was approved (D48), applied and verified both ways (DONE-018):
  the server stamps the triage and the admin's grant is `status` alone. TASK-018 closed without new words (DONE-017),
  so it needed no GATE 4 of his.
- **Still owed by the owner, polled at the start of every session:**
  - **Row 30** - publish the OAuth consent screen (D29), with the field values in the row.
  - **Row 31** - one real Google sign-in in the installed desktop app (D30): **ready** - 1.3.0 is installed here,
    moved from 1.2.0 by the updater proof on 2026-09-25.
  - **Web row 4** (`windowsweep-web/docs/MANUAL-TASKS.md`) - the real Google path on the site in his own browser:
    Google refuses an automated browser after the email step (RW-116, 2026-09-25).
  - **Rows 5 and 13** (the master-links review and the ORCID import) - unchanged.
  - **Rows 26 and 28** (the weekly task seen in Task Scheduler; a cancelled real run's log compared) - ready
    since `desktop-v1.2.0` shipped.
  - **Row 29, a glance at the four dashboards** - the agent proves the beacons on the wire and holds no
    dashboard login.
- ~~**Row 15, Google sign-in.**~~ **CLOSED 2026-09-24 (D25):** `external.google: true`. The site signs in since
  2026-09-25; desktop release builds carry the keys from `desktop-v1.3.0` on (`SUPABASE_ENABLED`, set 2026-09-25
  after TASK-013's live verification, O6').
- ~~**GitHub, not the owner:** the docs certificate.~~ **CLOSED 2026-09-12.** The agent removed and re-added
  the domain under D18; GitHub issued a Let's Encrypt certificate naming the host within the hour
  (`https_certificate.state: approved`, `notBefore` 15:57 UTC), `https_enforced` is on, `http://` returns 301,
  and the link write-back ran in one pass. No GitHub support step was needed.
- **Moved to a second machine** (owner, 2026-09-07): row 20 (the candidate-path probe that settles RW-064,
  RW-065 and RW-066) and the P1 verification runs (rows 1, 2, 3, 6, 7, 8, 9, 10, 19, 21); then CLI 1.4.0 if
  those verify. CLI 1.3.0 shipped here instead (D23), and `desktop-v1.3.0` was cut, published and proved here (D26, 2026-09-25). The handoff is
  section B11 of `../completion-plan-v3-2026-09-12.md`.
