# windowsweep - Project Rules

**Mirror of `CLAUDE.md`** - byte-identical except the H1 names the guide. Change one, change both.

Last Updated: 2026-09-26 (session 18: `desktop-v1.3.1` released and proved - invariants 2, 3, 5 and 10; TASK-020
filed. Earlier the same day: the workspace root backed up on the private site repo's `project-root` branch, D49.
Earlier the same day, the pause: site parity round 7 CLEAN, RW-117 closed, WH011. Earlier 2026-09-25, the releases: `desktop-v1.3.0` Latest with sign-in live and the updater proved 1.2.0 -> 1.3.0,
CLI 1.3.1 with the team's maker lines, TASK-019 filed. Earlier the same day: the desktop cascaded to 1.3.0, TASK-013 verified live and closed,
`SUPABASE_ENABLED` set, the 1.3.0 release kit; earlier the same day the invariants were brought to the v1.3.0 engine,
`desktop-v1.2.0` Latest, round 12's guard method and the same-session round-report rule; plan v5 is the method.
Earlier 2026-09-17: the v4 audit and a context pass). Durable decisions: `docs/PROJECT-CONTEXT.md`; what each session
did: `docs/project-history.md`; verified runs and releases: `docs/runs-and-releases.md`.

Safe, developer-aware Windows cleanup CLI: a Windows PowerShell 5.1 engine behind a dependency-free Node
launcher. The Windows member of the family with `linux-cleanup` (Bash) and `macleanup` (Bash). Public repo
`aoneahsan/windowsweep`, npm package `windowsweep`, MIT.

- Durable identity and owner decisions: `docs/PROJECT-CONTEXT.md`
- Owner-only tasks (never ticked off by an agent): `docs/MANUAL-TASKS.md`
- 🔴 **Resumable state, and the ONLY place status lives:**
  `docs/features/windowsweep-completion/00-tracker.json` (read it first, resume the first pending sub-task;
  the 1.0.0 tracker `docs/features/windowsweep-v1/00-tracker.json` is closed). **Never restate a phase's
  progress here** - a second copy is what this file was trimmed to remove.
- 🔴 **The planning files live at the WORKSPACE ROOT `D:\work\windowsweep-root\`, one level up, and are
  OUTSIDE this public repo** (owner decision 2026-09-07; the root was renamed from `windows-cleanup-root` and
  confirmed final on 2026-09-12): `../remaining-work.md` (the specification of every open item),
  `../remaining-work-summary.md` (the one-page view with the percentage - **read the number there**, so it
  cannot drift in two files), `../what-this-project-consists-of.md` (what exists today). **A `git clone` of this
  repo does not carry them**: the root is its own repository on the private `windowsweep-web`'s `project-root`
  branch (D49, 2026-09-26), and `../RESTORE.md` rebuilds the whole folder. 🔴 **The method is
  `../completion-plan-v5-2026-09-24.md`** (v4, v3 and the 2026-09-07 plans are history; every decision they record
  still applies). Its ordering rules are hard for every desktop release - **O2**: the desktop tag lands on a commit where
  `desktop/package.json`, `tauri.conf.json` and `VERSION` all agree; **O3**: no site deploy between that release
  becoming Latest and `download.ts` moving; **O7**: site parity runs on the FINAL site build (round 6 found S-29, fixed;
  round 7 CLEAN on 2026-09-25). **O6** (`SUPABASE_ENABLED` only after TASK-013 was verified live) was met on 2026-09-25.
- Dependency and manifest record: `docs/PACKAGES.md` · follow-ups the agent owes: `PENDING-TASKS.md` (root)
- Skill-listing scoping for this repo: `.claude/settings.json` (`skillOverrides`, `name-only`) - every skill
  stays invocable by name; only descriptions outside this stack leave the listing.

## 🔴 Invariants that must not be rediscovered

Everything else about where the work stands is in the tracker and `../remaining-work-summary.md`.

1. 🔴 **The v1.3.1 engine invariant.** `git diff v1.3.1..HEAD -- lib modules windowsweep.ps1 bin windowsweep.cmd
   VERSION package.json` is **empty** (verified 2026-09-25) and stays so until the next CLI cascade. CLI 1.3.1 is on
   npm (2026-09-25); its release was created `--latest=false` (IRON rule 13).
2. 🔴 **`desktop-v1.3.1` is the repository's Latest release** (2026-09-26, on `5dde309`) and stays so until the next
   desktop release is published `--latest` - the updater reads `releases/latest/download/latest.json`, so Latest is always a DESKTOP release.
3. 🔴 **The desktop app and `VERSION` both read 1.3.1** - the cascade (`2c5d98e`) moved `desktop/package.json`,
   `tauri.conf.json`, `Cargo.toml` and `Cargo.lock` to `VERSION`, `desktop-v1.3.1` was tagged where all of them agree
   (O2'), and the app reports the version in its manifest (1.3.0 reported 1.2.0). Every later desktop release cascades
   the same way before its tag. The bundled engine is untracked and mirrored by the build's engine plugin (`desktop/vite/engine-bundle.ts`, TASK-019) on every `yarn dev` and `yarn build`, the release build's `beforeBuildCommand` included: 41 files since 1.3.0.
4. 🔴 **TASK-013 (cloud sync) is verified live and closed (DONE-016), and `SUPABASE_ENABLED` is `true`** (both
   2026-09-25, O6'). Every release build carries the Supabase keys: `desktop-release.yml` exports them only after
   probing that the project answers `external.google: true`, and refuses the build otherwise, because
   `configuredFeatures()` turns sign-in on whenever both values are present. `desktop-v1.3.0` is the first
   published release that carries them (its log: *"Supabase build variables exported"*).
5. 🔴 **Never install a GATE 4 IPC guard by assigning to `window.__TAURI_INTERNALS__.invoke`** - the property is
   non-writable and non-configurable, so the assignment is a silent no-op while the guard reports "installed" (on
   2026-09-14 the next press started an unintended real 1.8 GB run). The method is round 12's two-wire guard: FULFIL
   (never fail) the CDP Fetch on `http://ipc.localhost/*` with `Tauri-Response: error`, wrap
   `window.chrome.webview.postMessage`, take the predicate from `args.rs`, and prove it fail-closed and selective
   before the first press (`../gate4-evidence/round12/drivers/`). 🔴 **It guards `tauri dev` only:** on an INSTALLED
   build WebView2 answers `http://ipc.localhost` before the DevTools Fetch domain sees it, so the guard observes and
   refuses nothing (found 2026-09-26, the tracker's `knownRisks`) - a proof on an installed build presses only its one
   named control and records the IPC with the Network domain.
6. 🔴 **A GATE 4 round's report is written and committed in the SAME session as the round**, with every driver's
   stdout teed to its `logs` folder. A round with a driver that did not finish is INCOMPLETE and re-run, never
   judged. Desktop round 11 and site rounds 3 and 5 ran and went unrecorded; round 11 had to be re-run as round 12.
7. 🔴 **The site's release gate FAILS the site build from the moment a desktop release becomes Latest until
   `src/content/download.ts` moves** (`vite/release-strings.ts`). That is the forcing function, not a nuisance.
8. 🔴 **The cargo cache still holds the pre-rename folder names** - expect the recorded `os error 3` trap on the
   first local Rust build and `cargo clean -p` the affected packages per profile.
9. 🔴 **P1 and the 1.1 residue are second-machine work** (owner, 2026-09-07) - not startable here.
10. Release procedure when a GATE 4 round comes back CLEAN: a new kit built from `../release-kit-1.3.1/` (spent
    2026-09-26 - every step ran; its drivers are the template and its README's three notes bind the next kit;
    preflight first, every time); `../release-kit-1.3.0/` and `../release-kit/` are the spent 1.3.0 and 1.2.0 kits.

## Per-Project Stack Override (binding)

| Concern | This project |
|---|---|
| Language / runtime | Windows PowerShell 5.1-compatible scripts (`windowsweep.ps1`, `lib/`, `modules/`) that also run on PowerShell 7. `bin/windowsweep.js` is a Node >=14 launcher with zero dependencies; `windowsweep.cmd` is the no-Node launcher |
| Package manager | nothing at runtime; `npm` only for `npm pack` and publishing |
| Gates | `node bin\windowsweep.js --self-test --no-color` (fixture-based, exit 0), `npm run version:check`, `npm pack --dry-run` shows the `files` allowlist only, PSScriptAnalyzer with `PSScriptAnalyzerSettings.psd1` (🔴 it only loads under `powershell.exe -NoProfile -ExecutionPolicy Bypass` + `Import-Module`; without that the import fails and a bare `.Count` prints a vacuous 0). CI job `ci` (windows-latest) runs the self-test and a dry-run on both hosts |
| Tests | the self-test fixtures are the test suite (real junction, nested junction, dry-run hash, stale prune, keep-newest, long path, extension-leftover plan). No Vitest, no Jest for the CLI; the desktop app runs vitest for the pre-approved classes (D37). New checks for pure logic are pre-approved |
| Typecheck / lint / build | no build output, so the fleet source-map rule is satisfied by construction; PSScriptAnalyzer is the lint |
| UI rules | none apply to the CLI - it has no UI at all. They apply to the desktop app (P6), where nine mandates are met and **three are declared OUT with reasons**: 🔴 §13's admin panel and plan set are **not applicable** (no server, no plan, no limit, no second user - nothing to administer, and no surface makes a pricing claim), §2's upload popover has no upload field, and §16's outside-surface overlay does not arise. The marketing site (P8) meets §13 with a minimal `/admin` (D10) under the same plan-set exemption. The full mapping with its evidence: `docs/PROJECT-CONTEXT.md` |
| Docs site | `aoneahsan/windowsweep-docs` at `D:\work\windowsweep-root\windowsweep-docs`: Docusaurus 3 + React 19 + TS ~6.0.3 + yarn 4, GitHub Pages only, ports 5972/5973. Its pages MIRROR `docs/` - fix a wording error here first, then re-mirror. `docs/MANUAL-TASKS.md` and `docs/story/**` are excluded from its build |
| Backend | 🔴 **Supabase**, per the owner's standing directive of 2026-09-05 (`~/.claude/rules/services-integrations.md`): Supabase is the default backend for every new project, never Firebase. Hosted-only, owner-created, FilesHub-gated; the schema is **Drizzle** TypeScript at `desktop/src/db/schema/`, and `supabase db push` is the only applier. Project `nlmetjyytgwaxcliusuo` (FilesHub Supabase id 15, created 2026-09-07 under a new account because all seven existing ones were at the two-project free-tier limit). Google sign-in is ON since 2026-09-24 (D25) and the auth URLs are set (D28): the site's sign-in is live, and the desktop's from `desktop-v1.3.0` (2026-09-25) |
| Desktop app (P6) | `desktop/` in this repo: Tauri 2 + React 19 + Vite 8 + Tailwind v4 + React Aria + TanStack Router (hash history), port 5974, identifier `com.aoneahsan.windowsweep`. It runs the bundled script with `--json --no-color` and **reimplements no cleanup logic**. `desktop/design/` holds the approved click dummy and its inventory; `desktop/src` and `desktop/src-tauri` hold the app. 🔴 `tokens.css`, `shared.css` and `components.css` were promoted **once, in one direction** on 2026-09-05 - the app's copies are authoritative and are never synced back. Gates: `yarn gates` - `typecheck`, `lint` (ESLint 10, 0 warnings), `build` (0 warnings, no chunk over 500 kB), `test` (vitest, the pre-approved classes only); `yarn typecheck:clean` after any dependency change (D37, 2026-09-25). The build-time generators and gates are Vite plugins in `desktop/vite/`, never a scripts folder (TASK-019): `prepaint.ts` writes `public/prepaint.js` from `axes.json` (CI fails a stale committed copy), `tauri-config.ts` checks `tauri.conf.json` against the installed CLI's schema, `engine-bundle.ts` mirrors the engine into the bundle, and `catalogue-keys.ts` stops on any literal i18n key the catalogue cannot resolve. A husky pre-commit hook lints and formats staged `desktop/` files; it installs from `desktop/`'s `postinstall`, never the root (the root is the published package), and runs lint-staged with `--no-stash --relative --max-arg-length 8000` (the house rule bans `git stash`; Windows caps a command line at 8,191 characters, and lint-staged splits a long file list only when the length is set). Every `@tauri-apps/*` npm package stays on its Rust crate's major.minor (`docs/PACKAGES.md`). `desktop-ci.yml` adds the unit tests, `cargo fmt --check`, `clippy -D warnings` and `cargo test`. External design-craft skills are vendored per-project in `.claude/skills/` |
| Storytelling (P7) | `docs/story/` holds the approved Bible, the voice fingerprint (`calibrated: false`, open and not blocking, waiting on the owner's own samples), the approved content map, the decision log, `run-state.json` and `drafts/`. GATE 1 and GATE 2 are cleared. 🔴 **GATE 4 is pre-authorised for every remaining surface** (owner, 2026-09-07 and D12) **on a stated condition**: the finalizer's fact-consistency check PASSES and the surface carries zero unanswered `NEEDS DECISION`. Either one failing pauses **that surface only**. The dummy's words are amended before the app's (`~/.claude/rules/frontend-ui-standards.md` §10a) |
| Marketing site (P8, **LIVE** since 2026-09-08) | `aoneahsan/windowsweep-web` (private, D9) at `D:\work\windowsweep-root\windowsweep-web`, deployed to Firebase Hosting at `https://windowsweep.aoneahsan.com`. A web **app**: Supabase for the backend (the **same** project as the desktop app - one auth pool), **Firebase for hosting and GA4 only**, Amplitude + Clarity + Sentry with no opt-out, Capacitor wired with **no Android folder** (P8-D3; Android is out of scope, D17). Thirteen routes incl. `/terms` (2026-09-25, the Google consent screen's terms address), `/contact`, `/account` and a minimal `/admin` (D10); sign-in live since 2026-09-25; its story surfaces live in this repo's `docs/story/`. Build gates under `vite/`: `catalogue-keys.ts`, `template-keys.ts`, `release-strings.ts`, `lastmod.ts` (sitemap dates from git), the prerender branch assertions, and a sign-in probe that fails closed once the keys are set. It is the product's **canonical homepage** |
| Last optimized | 2026-09-17 |
| Next routine optimization eligible | 2026-10-17 |
| Guide bytes | 22,773 B (this file, post-edit) |
| Covered subtree | this repo's root pair only; `desktop/` and `windowsweep-web/` keep their own nested guides |
| Method | status moved to `00-tracker.json`; fleet-copy sections replaced by pointers to `~/.claude/rules/`; every binding mapping, IRON rule and 🔴 invariant kept auto-loaded |
| Fleet record | `code/docs/tracking/project-context-budget-tracker.json` |

## IRON rules for this repository

1. **PowerShell 5.1 first.** No ternary, no `??`, no `&&`/`||` chains, no `param()` block on the entry script
   (flags come from `$args`). **Source is ASCII-only**; glyphs are `[char]` codes in `lib/ui.ps1`. Two 5.1 traps
   with guards in the tree: `ConvertFrom-Json` returns a top-level array as one object (use `Read-JsonFile` in
   `modules/editors.ps1`), and `.Count` on a lone PSCustomObject is `$null` (wrap function results in `@()`).
2. **One deletion chokepoint.** Every deletion goes through `Remove-PathSafe` or `Send-ToRecycleBin` with a
   declared `-Within` root (`lib/safety.ps1`). Never a bare `Remove-Item` on user data. A new target is a
   `New-Target` row in its section's `Get-TargetsNN`; layout kinds (`chromium`, `firefox`, `electron`,
   `editor`) may only clear the cache folder names allowlisted in `lib/actions.ps1`. The protected lists only
   grow. Self-test check [6] asserts no declared target sits inside a protected path - run it after any change.
   Interactive sections (17, 18, 19, 23 and any new one) present a selection that `--yes` never answers.
3. **Everything honours `--dry-run`.** Deletion helpers short-circuit; destructive external commands go
   through `Invoke-External -Destructive`; dry-run output aggregates per folder. Self-test check [7c]
   (tree hash unchanged) stays.
4. **Section numbers are frozen; a number is never reused.** 0-21 shipped in 1.0.0, 22-25 in 1.1.0, so the
   next new section is 26. Retire a section as a no-op that says so. The catalogue, safe batch and profiles
   live in `lib/constants.ps1`; `docs/sections.md`, `docs/cli-reference.md`, `docs/profiles.md` and the README
   section table must agree with it. 🔴 **Nothing may iterate a literal section range** - `Get-AllTargets` and
   the menu prompt derive theirs from `WS_SECTIONS`, and self-test check 15a fails if that regresses.
   🔴 **A path becomes a target only once it has been seen on a real machine**; anything else goes in the
   "candidate targets awaiting verification" table in `docs/sections.md`, never into a `New-Target` row.
5. **No network code.** Self-test check [9] greps for HTTP and socket calls. `Start-Process <url>` opens the
   user's browser only in `--report-issue`, `--feedback` and the reports manager, after the user asks.
6. **Files stay under 500 lines**, functions carry a `.SYNOPSIS`, verbs are PowerShell-approved. (The last debt
   closed in the 1.3.0 cascade: `lib/safety.ps1` 467 lines, `modules/self_test_extra.ps1` 366.)
7. **Version cascade, all together:** `package.json`, `VERSION`, `WS_VERSION_FALLBACK` in `lib/constants.ps1`,
   a `CHANGELOG.md` entry, the README at-a-glance row and changelog line. `npm run version:check` asserts the
   first three. Deletion behaviour changes are documented in the changelog and in `docs/sections.md`. Every
   release from 1.0.1 on gets an annotated tag `vX.Y.Z` and a GitHub Release.
8. **Public repository.** No secrets, no credentials, no machine-specific paths beyond the owner's records in
   `docs/PROJECT-CONTEXT.md` and `docs/MANUAL-TASKS.md`. The product speaks as **the windowsweep team**, never as
   one person (D45, 2026-09-25): the README's Author section names the team with its team page and contact form;
   the licence, the LICENSE copyright and the npm `author` field keep the owner's name as legal and registry
   facts; never a phone number. The tarball is the `files` allowlist only (`.github/`, `docs/`,
   `desktop/`, `temp/`, `CLAUDE.md`, `AGENTS.md`, the portfolio file and the three root planning files never
   ship; CI sweeps the listing by name).
9. **Governance.** `main` is protected by a ruleset (owner-only bypass, required check `ci`); the owner pushes
   directly, everyone else through a reviewed PR (`CONTRIBUTING.md`). Publishing follows the gate in
   `~/.claude/rules/publishing-compliance.md`; a bad release is deprecated, never unpublished.
10. **Running the tool from an agent session:** `--dry-run` before any real run; real runs only within the
    scope the owner named; admin sections are never launched from an agent session (they need a UAC click).
11. `temp/` holds read-only clones of the sibling tools for reference; it is gitignored and never edited.
12. 🔴 **The click dummy owns the desktop app's words as well as its layout.** A divergence is written into
    the dummy first, then the app matches - GATE 4 parity is checked page by page as screenshot pairs at
    **1440 and 760** (`~/.claude/rules/frontend-ui-standards.md` §10 and §10a). 🔴 **760, not 390**:
    `tauri.conf.json` sets `minWidth: 760`, so the product cannot be narrower and a failure at 390 is one
    nobody can act on. Anything the app declines to ship is declared with a reason, never quietly dropped.
13. 🔴 **Every CLI release is created with `gh release create ... --latest=false`** (owner decision
    2026-09-07). The desktop updater's endpoint is
    `https://github.com/aoneahsan/windowsweep/releases/latest/download/latest.json`, so the repository's
    "Latest" release must always be a **desktop** release. A CLI release marked latest would point every
    installed app at a release that carries no `latest.json`, and the updater would silently stop finding
    updates. Desktop releases are created with `--latest`.

## Sub-agents, skills and model workflow (IRON-SOLID)

🔴 **NO default sub-agents** for ANY work in this project, read-only exploration included - they have no
access to `/skills`, so delegating to one silently SKIPS the skills RULE #0 requires. All planning,
implementation, review and exploration happens in the **main context**. Custom `aoneahsan-ccca-*` agents are
the only carve-out, each with an explicit `EXCLUSIVE SCOPE`; when a relevant skill is missing, **install or
enable it** rather than proceeding skill-less. (Owner directive 2026-07-11.)

🔴 **ONE writer agent at a time** - owner decision **D21**, 2026-09-17, verbatim option *"One writer at a
time"*, taken on context cost and **final** as the standing default. (For the 2026-09-24/25 run only, the owner
raised it to three, D35, then four, D43 - scopes pairwise disjoint, hot files main-only.) It supersedes D20's "up to FOUR at once" (2026-09-12) and the
THREE it was narrowed to on 2026-09-14; both stay recorded in `docs/PROJECT-CONTEXT.md`, and the wave
content is unchanged. Read-only explorers may run beside the single writer. Scopes pairwise disjoint and verified
before every dispatch; hot files main-only; agents never commit, push, deploy or publish.

**Usual skill loadout here:** `aoneahsan-cccs-coding-standards`, `-nodejs`, `-javascript`, `-npm-package`,
`-npm-package-readme`, `-markdown`, `-copywriting`, `-documentation`, `-git-workflow`, `-packages-up-to-date`,
`-verification`; `-docusaurus` for the docs site, `-tauri*` and the React/design family for the desktop phase,
`-story*` for P7.

**Model workflow:** PLAN and REVIEW on **Fable 5**; EXECUTE on **Opus 5 or newer** (the global floor applies).
Plans live in `~/.claude/plans/`; the tracker is resumed, never re-planned from zero.

Global records (rules, policy, audit reports) live in the `ahsan-notebook` repo at
`static/assets/claude-code/`; the `~/.claude/...` paths are symlinks into it. Full text: `~/.claude/CLAUDE.md`.

<!-- RULE:orcid-bibtex v2026-07-25 -->
## ORCID / BibTeX record

This project is published as a work on ORCID **0009-0006-2311-8687** (Ahsan Mahmood). Its BibTeX entry lives at
`D:\ahsan-notebook\static\assets\personal\orcid-project-projects-files\windowsweep.bib`, beside a
combined `aoneahsan-all-works.bib` used for a single import.

On **"update ORCID profile info"**: regenerate that file from this project's portfolio-info file and its
**probe-verified** live URLs, refresh the combined file in the same edit, and invoke
`aoneahsan-cccs-orcid-profile` + `aoneahsan-cccs-bibtex` (agent: `aoneahsan-ccca-orcid`). Never invent a URL, a
DOI or a release year - an unreachable channel is omitted, never claimed. Importing, and the work-type retype
that BibTeX cannot perform, are owner-only steps recorded in that folder's `MANUAL-TASKS.md`.

## Reviews

No automatic reviews. A standalone review runs only when the owner asks for one
(`~/.claude/rules/fable-standalone-review.md`); Codex reviews are owner-run.
