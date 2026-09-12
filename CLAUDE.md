# windowsweep - Project Rules

Last Updated: 2026-09-12 (session 13, the audit: the workspace root renamed to `windowsweep-root` and every record repointed; CLI 1.2.0 published and equal to `main`; the marketing site live; `desktop-v1.2.0` owed; eight owner decisions D13-D20; the v3 completion plan) - Context pass: 2026-09-12 (CLAUDE.md and AGENTS.md mirrored, both under 28 KB)

Safe, developer-aware Windows cleanup CLI: a Windows PowerShell 5.1 engine behind a dependency-free Node
launcher. The Windows member of the family with `linux-cleanup` (Bash) and `macleanup` (Bash). Public repo
`aoneahsan/windowsweep`, npm package `windowsweep`, MIT.

- Durable identity and owner decisions: `docs/PROJECT-CONTEXT.md`
- Owner-only tasks (never ticked off by an agent): `docs/MANUAL-TASKS.md`
- Resumable state: `docs/features/windowsweep-completion/00-tracker.json` (read it first, resume the first
  pending sub-task; the 1.0.0 tracker `docs/features/windowsweep-v1/00-tracker.json` is closed)
- 🔴 **The planning files live at the WORKSPACE ROOT `D:\work\windowsweep-root\`, one level up, and are
  OUTSIDE git** (owner decision 2026-09-07; the root was renamed from `windows-cleanup-root` and confirmed
  final on 2026-09-12): `../remaining-work.md` (the specification of every open item),
  `../remaining-work-summary.md` (the one-page view with the percentage), `../what-this-project-consists-of.md`
  (what exists today). **A `git clone` does not carry them** - another machine needs the whole
  `windowsweep-root` folder copied. The method for finishing the work is `../completion-plan-v3-2026-09-12.md`
  (the two 2026-09-07 plans beside it are history; their decisions still apply)
- Dependency and manifest record: `docs/PACKAGES.md`
- Follow-ups the agent owes this project: `PENDING-TASKS.md` (root)

## Current state (session 13, 2026-09-12 - the audit)

**The CLI is published at 1.2.0 and the engine equals it.** `windowsweep@1.2.0` went to npm on 2026-09-08 with
every publish-gate step run; tag `v1.2.0`, Release **`--latest=false`**, and `desktop-v1.1.0` still the
repository Latest so the updater endpoint resolves. 🔴 The invariant is back: `git diff v1.2.0..HEAD -- lib
modules windowsweep.ps1 bin windowsweep.cmd package.json VERSION` is **empty** and stays so until the 1.3.0
cascade opens. Self-test **156** (check 18e covers the `--scan` developer flag), PSScriptAnalyzer 1.25.0 clean,
44-file tarball. Debts that wait for that cascade and nothing else (RW-121): `WS_DOCS` still names the GitHub
docs, and `lib/safety.ps1` (541 lines) and `modules/self_test_extra.ps1` (537) exceed rule 6's ceiling. The
README's at-a-glance rows were left at 1.1.0 by the cascade and corrected on 2026-09-12; the published
tarball's copy stays stale until 1.3.0 - the cascade checklist in rule 7 names the README rows for that reason.

**The desktop app is released at 1.1.0 and 1.2.0 is owed.** `desktop-v1.1.0` carries all six artefacts and is
installed on this machine (HKCU). Built since and unreleased: wave 4b (idle shading, protected chips,
tile-click exclusion), RW-105 (Picker Remove, cancel, drives + capacity ring, the schedule switch, heldBack),
D-9 / D-13 / D-22, the `screen.view` / `control.press` events, a Sentry breadcrumb scrub. GATE 4 is closed on
the eleven screens and wave 4b; the four RW-105 surfaces have no capture (RW-119). Owed: the account-deletion
control (D14, RW-113), TASK-004 / 006 / 007 / 009 / 010, D-8 confirmed and D-21 read from the rendered slot
(RW-103), then the `desktop-v1.2.0` cascade (`desktop/package.json`, `tauri.conf.json`, `Cargo.toml` to 1.2.0,
`yarn sync:cli`) with telemetry live for the first time - the four ids are repository variables the release
workflow passes - and the updater proved 1.1.0 -> 1.2.0 here (RW-109). 🔴 The cargo cache still holds the old
folder names; expect the recorded `os error 3` trap on the first local Rust build and `cargo clean -p` the
affected packages per profile.

**The marketing site is LIVE** (`https://windowsweep.aoneahsan.com/`, since 2026-09-08). Twelve routes, the
admin surface, sitemap / feed / robots. 🔴 Open: every route's static HTML still carries the home title and
canonical, an unknown path returns 200, no `llms.txt` file, no JSON-LD in static HTML, no OG card (RW-114); no
`.env`, so telemetry is dormant (RW-115); sign-in dormant until row 15 (RW-116, with the admin gating verified
as a non-admin); no parity pairs against its dummy (RW-117); no CI (RW-118).

**The docs site is live over HTTP only.** GitHub still presents its own `*.github.io` certificate; the CNAME
is right and the apex has no CAA record. Owner decision D18: the agent removes and re-adds the custom domain
through the Pages API, then switches every docs link in ONE pass (RW-102). `desktop.md` correctly says "In
1.1.0" until the desktop release moves.

**Supabase:** project `nlmetjyytgwaxcliusuo`, seven migrations, five tables with RLS verified from the
catalogues; every user-owned row cascades from `auth.users`, so **`delete_my_account()` is one statement**
(RW-113, D14). Google sign-in is off; the owner enables it during the v3 run (D15).

**Storytelling:** 14 of 19 surfaces recorded or applied. Open: site-home (finalizer), site-privacy
(finalizer; its deletion HARD FAIL is met by RW-113), site-front-site (fact-check + finalizer), site-front row
9 (apply to the docs, RW-112), site-app (unwritten), then the keeper batch (RW-107).

**Decisions taken on 2026-09-12 (D13-D20, verbatim in `docs/PROJECT-CONTEXT.md`):** the root rename is final ·
account deletion is BUILT · Google sign-in lands during the run · Fable plans and Opus executes · Android
stays out · the agent re-adds the docs domain · the two 1.2.0 report-wording changes stand · up to four
`aoneahsan-ccca-*` agents at once for this run.

🔴 **P1 and the 1.1 residue are second-machine work** (owner, 2026-09-07). The specification of every open
item is `../remaining-work.md`; the percentage lives in `../remaining-work-summary.md` - **read it there**, so
one number cannot drift in two files; the method is `../completion-plan-v3-2026-09-12.md`.

## Per-Project Stack Override (binding)

| Concern | This project |
|---|---|
| Language / runtime | Windows PowerShell 5.1-compatible scripts (`windowsweep.ps1`, `lib/`, `modules/`) that also run on PowerShell 7. `bin/windowsweep.js` is a Node >=14 launcher with zero dependencies; `windowsweep.cmd` is the no-Node launcher |
| Package manager | nothing at runtime; `npm` only for `npm pack` and publishing |
| Gates | `node bin\windowsweep.js --self-test --no-color` (fixture-based, exit 0), `npm run version:check`, `npm pack --dry-run` shows the `files` allowlist only, PSScriptAnalyzer with `PSScriptAnalyzerSettings.psd1` (🔴 it only loads under `powershell.exe -NoProfile -ExecutionPolicy Bypass` + `Import-Module`; without that the import fails and a bare `.Count` prints a vacuous 0). CI job `ci` (windows-latest) runs the self-test and a dry-run on both hosts |
| Tests | the self-test fixtures are the test suite (real junction, nested junction, dry-run hash, stale prune, keep-newest, long path, extension-leftover plan). No Vitest, no Jest. New checks for pure logic are pre-approved |
| Typecheck / lint / build | no build output, so the fleet source-map rule is satisfied by construction; PSScriptAnalyzer is the lint |
| UI rules | none apply to the CLI - it has no UI at all. They apply to the desktop app (P6), where nine mandates are met and verified, and **three are declared OUT with reasons**: 🔴 §13's admin panel and plan set are **not applicable** (no server, no plan, no limit, no second user - there is nothing to administer, and no surface makes a pricing claim), §2's upload popover has no upload field, and §16's outside-surface overlay does not arise. §10's GATE 4 parity is **closed** on the eleven screens (six rounds, 2026-09-07) and on wave 4b (the rendered DOM, 2026-09-08); the four RW-105 surfaces and a round-7 read of D-8/D-21 are still owed (RW-119, RW-103). §12's floor was measured with a MutationObserver (84 ms and 102 ms). The marketing site (P8) meets §13 with a minimal `/admin` (D10) under the same plan-set exemption. The full mapping with its evidence: `docs/PROJECT-CONTEXT.md` |
| Docs site | `aoneahsan/windowsweep-docs` at `D:\work\windowsweep-root\windowsweep-docs`: Docusaurus 3 + React 19 + TS ~6.0.3 + yarn 4, GitHub Pages only, ports 5972/5973. Its pages MIRROR `docs/` - fix a wording error here first, then re-mirror. `docs/MANUAL-TASKS.md` and `docs/story/**` are excluded from its build |
| Backend | 🔴 **Supabase**, since the owner's standing directive of 2026-09-05 (`~/.claude/rules/services-integrations.md`): Supabase is the default backend for every new project, never Firebase. The desktop app was switched the same day, before anything had been created on Firebase, so it cost code and no data. Hosted-only, owner-created, FilesHub-gated; the schema is **Drizzle** TypeScript at `desktop/src/db/schema/`, `supabase db push` is the only applier. Project `nlmetjyytgwaxcliusuo` (FilesHub Supabase id 15, created 2026-09-07 under a new account because all seven existing ones were at the two-project free-tier limit); seven migrations applied; **the `delete_my_account()` RPC is owed** (owner decision D14, 2026-09-12; RW-113). Google sign-in stays off until row 15, which the owner does during the v3 run (D15) |
| Desktop app (P6) | `desktop/` in this repo: Tauri 2 + React 19 + Vite 8 + Tailwind v4 + React Aria + TanStack Router (hash history), port 5974, identifier `com.aoneahsan.windowsweep`. It runs the bundled script with `--json --no-color` and reimplements no cleanup logic. `desktop/design/` holds the approved click dummy and its inventory; `desktop/src` and `desktop/src-tauri` hold the app. 🔴 `tokens.css`, `shared.css` and `components.css` were promoted **once, in one direction** on 2026-09-05 - the app's copies are authoritative and are never synced back. Its own gates are `yarn typecheck && yarn lint && yarn build` plus `yarn check:prepaint`, and `desktop-ci.yml` adds `cargo fmt --check`, `clippy -D warnings` and `cargo test`. GATE 4 (parity) is **closed** on the eleven screens and wave 4b; `desktop-v1.1.0` is released and installed on this machine; `desktop-v1.2.0` (the 1.2.0 engine, telemetry live, wave 4b, RW-105, account deletion) is owed with the updater proved 1.1.0 -> 1.2.0 (RW-109). External design-craft skills are vendored per-project in `.claude/skills/` |
| Storytelling (P7) | `docs/story/` holds the approved Bible, the voice fingerprint (`calibrated: false`, open and not blocking), the approved 14-surface content map, the decision log, `run-state.json` and `drafts/`. GATE 1 and GATE 2 are cleared; **14 of 19 surfaces are recorded or applied** (the desktop trio, readme, tagline, desktop-readme, the six docs surfaces, ai-guide, cli-strings, report-bodies). 🔴 **GATE 4 is pre-authorised for every remaining surface** - site-home, site-privacy, site-front-site, site-front, site-app (owner, 2026-09-07 and D12) - on a stated condition: the finalizer's fact-consistency check PASSES and the surface carries zero unanswered `NEEDS DECISION`. Either one failing pauses **that surface only**. The dummy's words are amended before the app's (`~/.claude/rules/frontend-ui-standards.md` §10a) |
| Marketing site (P8, **LIVE** since 2026-09-08) | `aoneahsan/windowsweep-web` (private, D9) at `D:\work\windowsweep-root\windowsweep-web`, deployed to Firebase Hosting at `https://windowsweep.aoneahsan.com` (200 on both hosts). A web **app**: Supabase for the backend (the **same** project as the desktop app - one auth pool), **Firebase for hosting and GA4 only**, Amplitude + Clarity + Sentry with no opt-out, Capacitor wired with **no Android folder** (P8-D3; Android is out of scope, D17). Twelve routes incl. `/contact`, `/account` and a minimal `/admin` (D10); its story surfaces live in this repo's `docs/story/`. **Open:** prerendered routes + a real 404 + `llms.txt` + JSON-LD + an OG card (RW-114), telemetry live (RW-115), sign-in / contact / account / deletion / admin verified as a person once row 15 lands (RW-116), GATE 4 parity against its dummy (RW-117), a CI workflow (RW-118), the records write-back. It is the product's **canonical homepage**: `package.json` `homepage` and both repos' GitHub homepage move to it in RW-102's one-pass write-back |
| Context Budget Last Verified | 2026-09-12 — CLAUDE.md 20,752 B / PENDING-TASKS.md 7,354 B; re-check due 2026-09-22 |

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
6. **Files stay under 500 lines**, functions carry a `.SYNOPSIS`, verbs are PowerShell-approved.
7. **Version cascade, all together:** `package.json`, `VERSION`, `WS_VERSION_FALLBACK` in `lib/constants.ps1`,
   a `CHANGELOG.md` entry, the README at-a-glance row and changelog line. `npm run version:check` asserts the
   first three. Deletion behaviour changes are documented in the changelog and in `docs/sections.md`. Every
   release from 1.0.1 on gets an annotated tag `vX.Y.Z` and a GitHub Release.
8. **Public repository.** No secrets, no credentials, no machine-specific paths beyond the owner's records in
   `docs/PROJECT-CONTEXT.md` and `docs/MANUAL-TASKS.md`. The author block is name, site, GitHub, LinkedIn and
   the public email; never a phone number. The tarball is the `files` allowlist only (`.github/`, `docs/`,
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
    nobody can act on. Anything the app declines to ship is declared with a reason, never quietly dropped. The
    desktop app reimplements no cleanup logic: it runs the bundled `windowsweep.ps1` with `--json --no-color`
    and reads its catalogue from `--list --json`.
13. 🔴 **Every CLI release is created with `gh release create ... --latest=false`** (owner decision
    2026-09-07). The desktop updater's endpoint is
    `https://github.com/aoneahsan/windowsweep/releases/latest/download/latest.json`, so the repository's
    "Latest" release must always be a **desktop** release. A CLI release marked latest would point every
    installed app at a release that carries no `latest.json`, and the updater would silently stop finding
    updates. Desktop releases are created with `--latest`.

## Sub-agents & Skills - Main-Context-First (IRON-SOLID)

Default/built-in sub-agents (`general-purpose`, `Explore`, `Plan`, `claude`, `fork`, ...) do NOT have access to
`/skills`, so delegating to them silently SKIPS the skills RULE #0 requires. Do all skill-relevant work in the
**MAIN context**; use a sub-agent ONLY when a **custom** `aoneahsan-ccca-*` agent exists for that job, with an
explicit `EXCLUSIVE SCOPE`; when a relevant skill is missing, **install/enable it** rather than proceeding
skill-less. (Owner directive 2026-07-11; full text in `~/.claude/CLAUDE.md`.)

## Main-Context + Skills + Model Workflow (IRON-SOLID)

1. **NO default sub-agents** for ANY work in this project, read-only exploration included. All planning,
   implementation, review and exploration happens in the main context. Custom `aoneahsan-ccca-*` agents are
   the carve-out; **for the v3 run the owner allows up to FOUR at once** (D20, 2026-09-12), scopes pairwise
   disjoint and verified before every dispatch, hot files main-only; the standing rule of two returns afterwards.
2. **Skills always:** before any task, scan the available-skills list and invoke EVERY relevant skill
   (`aoneahsan-cccs-coding-standards`, `-nodejs`, `-javascript`, `-npm-package`, `-npm-package-readme`,
   `-markdown`, `-copywriting`, `-documentation`, `-git-workflow`, `-packages-up-to-date`, `-verification`
   are the usual loadout here; `-docusaurus` for the docs site, `-tauri*` and the React/design family for the
   desktop phase, `-story*` for phase P7).
3. **Model workflow:** PLAN and REVIEW on **Fable 5**; EXECUTE the approved plan on **Opus 5 or newer**. The
   global model floor (Fable 5 / Opus 5, never Opus 4.8 or older) applies here as everywhere. Plans live in
   `~/.claude/plans/`; the tracker above is resumed, never re-planned from zero.

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
