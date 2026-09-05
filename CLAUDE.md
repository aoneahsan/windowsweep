# windowsweep - Project Rules

Last Updated: 2026-09-05 (session 8: the click dummy closed, all four story gates cleared for the desktop screens, the desktop app foundation built and gated) · Context pass: 2026-09-05 (CLAUDE.md and AGENTS.md mirrored, both well under 28 KB)

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

## Current state (session 8, 2026-09-05 - the desktop foundation and the story gates)

**1.1.0 is published on npm and equals `main`'s engine** (built from `3c4d54e`; `git diff 3c4d54e..HEAD -- lib
modules windowsweep.ps1 bin` is empty; tags `v1.0.0`, `v1.0.1`, `v1.1.0`, each with a GitHub Release). Sections
0-25, `--select` / `--select-file`, `--notify`, `candidates[]` / `targets[]` and `##windowsweep` progress lines
in `--json`, `--list --json`. The self-test runs **151 checks** (green 2026-09-05, exit 0). 🔴 **No engine file
has been touched since 1.1.0 and none should be** without a version cascade.

**The docs site** is deployed and green, now with a real PNG Open Graph card and its own regenerated lockfile;
`windowsweep-docs.aoneahsan.com` still probes **000** (owner DNS rows 11-12), so `package.json` `homepage`,
the README links and `WS_DOCS` point at GitHub until it probes 200.

**The click dummy is CLOSED** (RW-073 to RW-075, 2026-09-05). Eleven screens, eight gallery files, a parity
ledger at `desktop/design/CLICK-DUMMY-INVENTORY.md`. Four real defects were fixed, including a premature `*/`
that had disabled the whole bleed-band ink reset and left 87 text nodes at 1.09:1 in light mode. Gates: 8,034
contrast measurements across three treatments in light and dark with zero failures, zero focusable-while-hidden
controls, no HTML text under 12px - each watched failing on its own plant.

**The desktop app now has a built foundation** (RW-077, RW-078, RW-080 largely done). `desktop/` holds a Vite 8
+ React 19 + TS ~6.0.3 web layer and `src-tauri/`. What exists and is proved: the engine bridge (`lib/cli.ts`
parses the `--json` contract, `lib/catalogue.ts` reads `--list --json` so no section list is hard-coded
anywhere), PKCE sign-in, Firestore REST sync that pages at 20 and syncs no path, one consent-gated `track()`
fan-out, the **ten-axis theme registry in ONE file** (`src/lib/axes.json`) with `public/prepaint.js` GENERATED
from it and a `--check` drift gate, i18n on every string behind a `no-restricted-syntax` gate at `error`, and
five Rust commands behind an **argument allowlist with its own unit test**. Screens built: Home, Run, Sections,
Consent. Seven are declared as `pending-wave` placeholders rather than hidden. 🔴 **Rust has not been compiled
locally** - Visual Studio Build Tools is still absent (row 22), so `desktop-ci.yml` is the only Rust evidence.

**Gates run 2026-09-05, all green:** `yarn typecheck` exit 0 · `yarn lint` exit 0, with the i18n gate watched
failing on two different plants (a literal JSX string and a literal `aria-label`) · `yarn build` zero warnings,
zero source maps · the prepaint drift gate watched failing on a planted axis change · the CI tarball sweep
watched failing on a planted `desktop/` entry · CLI self-test 151/151 · `version parity OK: 1.1.0`.

**The storytelling retrofit has both approval gates.** GATE 1 (the Bible) and GATE 2 (the content map) were
approved 2026-09-05; the voice is the eleventh entry in the global registry. The three desktop surfaces are
drafted as numbered slot inventories at `docs/story/drafts/desktop-{moment,safety,cockpit}.md` - 375 slots,
331 kept as already on voice, 38 changed - and **GATE 4 was granted on 2026-09-05**. RW-093 wrote all 38 into
the click dummy, and the app then followed the dummy. Two owner answers came with it: **the pricing claim is
gone** (Home and Account now say only what sign-in does, so nothing claims there is no paid tier), and **the
installer ships unsigned** with the SmartScreen note kept and its two verifiable artefacts named exactly - a
SHA-256 checksum and the updater's minisign signature, neither of which is a code-signing certificate.
🔴 **Eleven surfaces are still unwritten**: readme, tagline, docs-start, docs-safety, docs-reference,
docs-help, docs-about, ai-guide, site-front, cli-strings, desktop-readme.

🔴 **P5 is closed but two of its rows are not:** RW-064 and RW-065 shipped only their verified halves and RW-066
was **deferred, not shipped**. **Section 26 is still free.** `C:\Intel` was inspected and **rejected**.

Phase P1 is entirely owner-run (rows 1, 2, 3, 6, 7, 8, 9, 10, 19, 21). The specification of every open item is
`remaining-work.md`; the one-page view (whole project about **71%**, CLI-only about **88%**) is
`remaining-work-summary.md`.

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
| Desktop app (P6) | `desktop/` in this repo: Tauri 2 + React 19 + Vite 8 + Tailwind v4 + React Aria + TanStack Router (hash history), port 5974, identifier `com.aoneahsan.windowsweep`. It runs the bundled script with `--json --no-color` and reimplements no cleanup logic. `desktop/design/` holds the approved click dummy and its inventory; `desktop/src` and `desktop/src-tauri` hold the app. 🔴 `tokens.css`, `shared.css` and `components.css` were promoted **once, in one direction** on 2026-09-05 - the app's copies are authoritative and are never synced back. Its own gates are `yarn typecheck && yarn lint && yarn build` plus `yarn check:prepaint`, and `desktop-ci.yml` adds `cargo fmt --check`, `clippy -D warnings` and `cargo test`. GATE 4 (parity) is still open. External design-craft skills are vendored per-project in `.claude/skills/` - see `EXTERNAL-SKILLS.md` |
| Storytelling (P7) | `docs/story/` holds the approved Bible, the voice fingerprint (`calibrated: false`, open and not blocking), the approved 14-surface content map, the decision log, `run-state.json` and `drafts/`. GATE 1 and GATE 2 are cleared; three desktop surfaces are drafted and awaiting GATE 4. The dummy's words are amended before the app's (`~/.claude/rules/frontend-ui-standards.md` §10a) |

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
