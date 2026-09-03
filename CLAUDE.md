# windowsweep - Project Rules

Last Updated: 2026-09-03 (session 1: 1.0.1 published, docs site, records) · Context pass: 2026-09-03 (CLAUDE.md and AGENTS.md mirrored, both well under 28 KB)

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

## Current state (end of session 1, 2026-09-03)

**1.0.1 is published on npm and equals `main`'s engine.** It closed every P0 defect from the launch-day
audit, including the HIGH one: `--yes` no longer selects anything in sections 17, 18 and 19. Tags `v1.0.0`
and `v1.0.1` exist with GitHub Releases, and every release from here gets both. The self-test runs
**124 checks**; each new one was proved red on a planted defect. A documentation site lives at
`aoneahsan/windowsweep-docs` (Docusaurus on GitHub Pages, deployed and green) - its domain does not resolve
yet, so `package.json` `homepage`, the README links and `WS_DOCS` still point at GitHub and switch only after
the domain probes 200. `AI-INTEGRATION-GUIDE.md` ships in the package.

Open: **P5** (the 1.1 family-parity features: sections 22-26, new target rows, `--notify`, and the two GUI
prerequisites RW-071 `--select` and RW-072 the `--json` additions) and **P6** (the desktop app). Phase P1 is
entirely owner-run.

Owner decisions of 2026-09-03, recorded in full in `docs/PROJECT-CONTEXT.md`: "feature-complete" means the
1.0 catalogue plus the 1.1 family-parity features; the docs site is in scope; the desktop app is a Tauri
wrapper in `desktop/` with **optional Google sign-in for sync only and runs always free** (no paid tier, no
plan set - an explicit exemption), **full fleet observability behind a first-run consent dialog** while the
CLI keeps zero network calls; distribution stays npm and git clone only; and **no toolchain or dependency
downloads happen on this machine until he gives the go-ahead** (`PENDING-TASKS.md` TASK-001).

## Per-Project Stack Override (binding)

| Concern | This project |
|---|---|
| Language / runtime | Windows PowerShell 5.1-compatible scripts (`windowsweep.ps1`, `lib/`, `modules/`) that also run on PowerShell 7. `bin/windowsweep.js` is a Node >=14 launcher with zero dependencies; `windowsweep.cmd` is the no-Node launcher |
| Package manager | nothing at runtime; `npm` only for `npm pack` and publishing |
| Gates | `node bin\windowsweep.js --self-test --no-color` (fixture-based, exit 0), `npm run version:check`, `npm pack --dry-run` shows the `files` allowlist only, PSScriptAnalyzer with `PSScriptAnalyzerSettings.psd1`. CI job `ci` (windows-latest) runs the self-test and a dry-run on both hosts |
| Tests | the self-test fixtures are the test suite (real junction, nested junction, dry-run hash, stale prune, keep-newest, long path, extension-leftover plan). No Vitest, no Jest. New checks for pure logic are pre-approved (P2 in `remaining-work.md`) |
| Typecheck / lint / build | no build output, so the fleet source-map rule is satisfied by construction; PSScriptAnalyzer is the lint |
| UI rules | none apply to the CLI - no frontend, i18n surface, theme, plans or admin panel. They apply to the desktop app (P6) |
| Docs site | `aoneahsan/windowsweep-docs` at `D:\work\windowsweep-docs`: Docusaurus 3 + React 19 + TS ~6.0.3 + yarn 4, GitHub Pages only, ports 5972/5973. Its pages MIRROR `docs/` - fix a wording error here first, then re-mirror |
| Desktop app (P6) | `desktop/` in this repo: Tauri 2 + React 19 + Vite + Tailwind v4 + React Aria, port 5974, identifier `com.aoneahsan.windowsweep`. It runs the bundled script with `--json` and reimplements no cleanup logic |

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
   Interactive sections (17, 18, 19 and any new one) present a selection that `--yes` never answers.
3. **Everything honours `--dry-run`.** Deletion helpers short-circuit; destructive external commands go
   through `Invoke-External -Destructive`; dry-run output aggregates per folder. Self-test check [7c]
   (tree hash unchanged) stays.
4. **Section numbers 0-21 are frozen; new sections start at 22.** Retire a section as a no-op that says so;
   never reuse a number. The catalogue, safe batch and profiles live in `lib/constants.ps1`; `docs/sections.md`,
   `docs/cli-reference.md`, `docs/profiles.md` and the README section table must agree with it.
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
   `temp/`, `CLAUDE.md`, `AGENTS.md` and the three root planning files never ship).
9. **Governance.** `main` is protected by a ruleset (owner-only bypass, required check `ci`); the owner pushes
   directly, everyone else through a reviewed PR (`CONTRIBUTING.md`). Publishing follows the gate in
   `~/.claude/rules/publishing-compliance.md`; a bad release is deprecated, never unpublished.
10. **Running the tool from an agent session:** `--dry-run` before any real run; real runs only within the
    scope the owner named; admin sections are never launched from an agent session (they need a UAC click).
11. `temp/` holds read-only clones of the sibling tools for reference; it is gitignored and never edited.

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
   are the usual loadout here; `-docusaurus` for the docs site, `-tauri*` for the desktop phase).
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
