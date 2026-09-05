# windowsweep - Project Rules

Last Updated: 2026-09-05 (session 7: audit - the desktop app and the storytelling retrofit added to the 100% scope; the A4 screens committed as WIP; every record refreshed) · Context pass: 2026-09-05 (CLAUDE.md and AGENTS.md mirrored, both well under 28 KB)

Safe, developer-aware Windows cleanup CLI: a Windows PowerShell 5.1 engine behind a dependency-free Node
launcher. The Windows member of the family with `linux-cleanup` (Bash) and `macleanup` (Bash). Public repo
`aoneahsan/windowsweep`, npm package `windowsweep`, MIT.

- Durable identity and owner decisions: `docs/PROJECT-CONTEXT.md`
- Owner-only tasks (never ticked off by an agent): `docs/MANUAL-TASKS.md`
- Resumable state: `docs/features/windowsweep-completion/00-tracker.json` (read it first, resume the first
  pending sub-task; the 1.0.0 tracker `docs/features/windowsweep-v1/00-tracker.json` is closed)
- The specification of every open item: `remaining-work.md` (root); the one-page view:
  `remaining-work-summary.md`; what exists today: `what-this-project-consists-of.md`
- Dependency and manifest record: `docs/PACKAGES.md`
- Follow-ups the agent owes this project: `PENDING-TASKS.md` (root)

## Current state (session 7, 2026-09-05 - audit)

**1.1.0 is published on npm and equals `main`'s engine** (built from `3c4d54e`; `git diff 3c4d54e..HEAD -- lib
modules windowsweep.ps1 bin` is empty; tags `v1.0.0`, `v1.0.1`, `v1.1.0`, each with a GitHub Release). Sections
0-25, `--select` / `--select-file`, `--notify`, `candidates[]` / `targets[]` and `##windowsweep` progress lines
in `--json`, `--list --json`. The self-test runs **151 checks** (green on 2026-09-05, exit 0). The documentation
site `aoneahsan/windowsweep-docs` is deployed and green; `windowsweep-docs.aoneahsan.com` still probes **000**
(owner DNS rows 11-12), so `package.json` `homepage`, the README links and `WS_DOCS` point at GitHub until it
probes 200.

**Open: P6 (the desktop app), P7 (the storytelling retrofit), the owner rows.** Desktop direction 02 "Reclaim"
was **approved on 2026-09-05** (*"approved, looks great, get all remaining work fully done now"*); gates 2 and 3
were **pre-authorised** in the same message (*"Straight through to the app"*), so `desktop/` may hold app code;
GATE 4 (parity) closes after the app exists. The click dummy holds all eleven screens plus the eight-file
component library (A3 in `45953b7`, A4 handed over as WIP in `2721b75`); Block Q's inventory ledger, Block R's
wiring and Block S's verification are still open (RW-073 to RW-075). No app code, no Firebase project, no
desktop CI exists yet. rustup 1.98.1 is installed per-user; **Visual Studio Build Tools is not** (row 22), so
Rust links only in CI. TASK-001 (the download gate) was lifted in full on 2026-09-05.

**Owner decisions of 2026-09-05 (audit session), verbatim in `docs/PROJECT-CONTEXT.md`:** "100%" **includes the
desktop app**; the WIP screens were committed as their own `design:` commit; the folder layout
`D:\work\windows-cleanup-root\{windows-cleanup, windowsweep-docs}` is durable (row 4 closed as superseded);
and **every product-voice surface is retrofitted through the storytelling system** (P7: Story Bible first, then
the README, the docs pages, `llms.txt`, the CLI strings and the desktop copy -
`~/.claude/rules/storytelling-content.md`). 🔴 No new product-voice prose before the approved Bible; factual
corrections of false statements are allowed; in the docs repo `docs/story/**` is excluded from the build.

🔴 **P5 is closed but two of its rows are not:** RW-064 and RW-065 shipped only their verified halves and RW-066
was **deferred, not shipped**, because that software is not installed on this machine - a candidate table in
`docs/sections.md` plus one owner probe (`MANUAL-TASKS` row 20). **Section 26 is still free.** `C:\Intel` was
inspected and **rejected**: it holds `Thunderbolt` and driver support content, not extraction leftovers.

Phase P1 is entirely owner-run (rows 1, 2, 3, 6, 7, 8, 9, 10, 19, 21). The specification of every open item is
`remaining-work.md`; the one-page view with the two percentages (whole project about 53%, CLI-only scope about
87%) is `remaining-work-summary.md`.

## Per-Project Stack Override (binding)

| Concern | This project |
|---|---|
| Language / runtime | Windows PowerShell 5.1-compatible scripts (`windowsweep.ps1`, `lib/`, `modules/`) that also run on PowerShell 7. `bin/windowsweep.js` is a Node >=14 launcher with zero dependencies; `windowsweep.cmd` is the no-Node launcher |
| Package manager | nothing at runtime; `npm` only for `npm pack` and publishing |
| Gates | `node bin\windowsweep.js --self-test --no-color` (fixture-based, exit 0), `npm run version:check`, `npm pack --dry-run` shows the `files` allowlist only, PSScriptAnalyzer with `PSScriptAnalyzerSettings.psd1` (🔴 it only loads under `powershell.exe -NoProfile -ExecutionPolicy Bypass` + `Import-Module`; without that the import fails and a bare `.Count` prints a vacuous 0). CI job `ci` (windows-latest) runs the self-test and a dry-run on both hosts |
| Tests | the self-test fixtures are the test suite (real junction, nested junction, dry-run hash, stale prune, keep-newest, long path, extension-leftover plan). No Vitest, no Jest. New checks for pure logic are pre-approved |
| Typecheck / lint / build | no build output, so the fleet source-map rule is satisfied by construction; PSScriptAnalyzer is the lint |
| UI rules | none apply to the CLI - no frontend, i18n surface, theme, plans or admin panel. They apply to the desktop app (P6) |
| Docs site | `aoneahsan/windowsweep-docs` at `D:\work\windows-cleanup-root\windowsweep-docs`: Docusaurus 3 + React 19 + TS ~6.0.3 + yarn 4, GitHub Pages only, ports 5972/5973. Its pages MIRROR `docs/` - fix a wording error here first, then re-mirror. `docs/MANUAL-TASKS.md` and `docs/story/**` are excluded from its build |
| Desktop app (P6) | `desktop/` in this repo: Tauri 2 + React 19 + Vite + Tailwind v4 + React Aria, port 5974, identifier `com.aoneahsan.windowsweep`. It runs the bundled script with `--json` and reimplements no cleanup logic. Today only `desktop/design/` exists - the argument in its `README.md` and the **approved** click dummy in `windowsweep-click-dummy/` (eleven screens + eight gallery files, plain CSS + vendored D3, zero network; `tokens.css` promotes into the app in ONE direction). Gates 1-3 are recorded, so app code may now be created; GATE 4 (parity) closes after it exists. External design-craft skills are vendored per-project in `.claude/skills/` - see `EXTERNAL-SKILLS.md` |
| Storytelling (P7) | `docs/story/` does not exist yet. Owner decision 2026-09-05: retrofit everything - `/story-init` first (GATE 1), then the content map (GATE 2), then every product-voice surface through `/story-write`. The dummy's words are amended before the app's (`~/.claude/rules/frontend-ui-standards.md` §10a) |

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
    the dummy first, then the app matches - GATE 4 parity is checked page by page as screenshot pairs at 1440
    and 390 (`~/.claude/rules/frontend-ui-standards.md` §10 and §10a). Anything the app declines to ship is
    declared with a reason, never quietly dropped. The desktop app reimplements no cleanup logic: it runs the
    bundled `windowsweep.ps1` with `--json --no-color` and reads its catalogue from `--list --json`.

## Sub-agents & Skills - Main-Context-First (IRON-SOLID)

Default/built-in sub-agents (`general-purpose`, `Explore`, `Plan`, `claude`, `fork`, ...) do NOT have access to
`/skills`, so delegating to them silently SKIPS the skills RULE #0 requires. Do all skill-relevant work in the
**MAIN context**; use a sub-agent ONLY when a **custom** `aoneahsan-ccca-*` agent exists for that job, with an
explicit `EXCLUSIVE SCOPE`; when a relevant skill is missing, **install/enable it** rather than proceeding
skill-less. (Owner directive 2026-07-11; full text in `~/.claude/CLAUDE.md`.)

## Main-Context + Skills + Model Workflow (IRON-SOLID)

1. **NO default sub-agents** for ANY work in this project, read-only exploration included. All planning,
   implementation, review and exploration happens in the main context.
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
