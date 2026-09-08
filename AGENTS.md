# windowsweep - Agent Rules

Last Updated: 2026-09-08 (session 11: the 1.2.0 engine window opened and `--exclude-path` turned out to protect one section out of twenty-six; four Rust commands landed; the marketing-site repository exists; three owner rows closed by evidence rather than by asking) - Context pass: 2026-09-05 (CLAUDE.md and AGENTS.md mirrored, both under 28 KB)

Safe, developer-aware Windows cleanup CLI: a Windows PowerShell 5.1 engine behind a dependency-free Node
launcher. The Windows member of the family with `linux-cleanup` (Bash) and `macleanup` (Bash). Public repo
`aoneahsan/windowsweep`, npm package `windowsweep`, MIT.

- Durable identity and owner decisions: `docs/PROJECT-CONTEXT.md`
- Owner-only tasks (never ticked off by an agent): `docs/MANUAL-TASKS.md`
- Resumable state: `docs/features/windowsweep-completion/00-tracker.json` (read it first, resume the first
  pending sub-task; the 1.0.0 tracker `docs/features/windowsweep-v1/00-tracker.json` is closed)
- 🔴 **The three planning files live at the WORKSPACE ROOT, one level up, and are OUTSIDE git**
  (owner decision 2026-09-07): `../remaining-work.md` (the specification of every open item),
  `../remaining-work-summary.md` (the one-page view with the percentage), `../what-this-project-consists-of.md`
  (what exists today). **A `git clone` does not carry them** - another machine needs the whole
  `windows-cleanup-root` folder copied. The method for finishing the work is `../completion-plan-2026-09-07.md`
- Dependency and manifest record: `docs/PACKAGES.md`
- Follow-ups the agent owes this project: `PENDING-TASKS.md` (root)

## Current state (session 11, 2026-09-08 - the 1.2.0 engine window)

**The CLI is published at 1.1.0 and the engine is now DELIBERATELY ahead of it.** 🔴 The long-standing
invariant *"`git diff 3c4d54e..HEAD -- lib modules windowsweep.ps1 bin` is empty"* **ended on purpose** in
commit `1904b21`; it is replaced by *"the engine equals `v1.2.0` once tagged"*. Do not read the non-empty
diff as drift - read every hunk of it, and it should classify as exactly: the three additive contract
changes, two string fixes, and nothing else.

**What went into the engine for 1.2.0 (unreleased; the version has NOT moved):**

- 🔴 **`--exclude-path` was protecting ONE section out of twenty-six.** It was parsed globally, documented as
  section 17's, and read by exactly one consumer at `modules/projects.ps1:102`. Someone who excluded a folder
  was protected in section 17 and silently unprotected everywhere else - it worked where you tested it. It is
  now enforced inside `Get-ProtectionReason`, the guard every chokepoint already calls, so it holds in every
  section: refused, logged `excluded: <path>`, reported once in a new `excluded[]` array. The check runs
  **last**, so a path that is both protected and excluded reports the PROTECTED reason - the stronger claim,
  and the one no flag can lift. `Initialize-Exclusions` is called from `Initialize-Settings`, **not** from
  `Initialize-Safety`, because the config file is merged after the safety tables are built.
- `targets[].newest_write_utc` in `--scan --json`, ISO 8601 UTC or `null`. It costs no extra walk: under
  `--json` the size pass is `Get-DirectoryStats`, which already returns the newest stamp from the same
  enumeration. A human `--scan` keeps the faster robocopy path.
- `protected` in `--list --json` - the subtrees plus the four category sentences, both readers now taking the
  category list from **one** constant (`WS_PROTECT_CATEGORIES`).
- Section 22 declared `Dev = $true` with no behavioural branch; and checking that against the docs found the
  mirror-image gap - sections **4, 17 and 20 are developer-gated and said so nowhere**. Both fixed; the table
  and the engine now agree on all seven, verified by parsing both.
- `--help` said `--permanent` covers "Sections 18/19"; it reaches **18, 19 and 23**.

**Self-test 151 -> 155, exit 0**, each new check watched failing on its own plant. PSScriptAnalyzer 1.25.0
clean. 🔴 **Still owed before 1.2.0 ships:** the `cli-strings` and `report-bodies` slots, the tagline in all
five places, the version cascade, the publish gate, the tag, and a Release with `--latest=false`.

**The desktop app is released and has gained four Rust commands.** `desktop-v1.1.0` is on GitHub Releases,
marked Latest, with both installers, both minisign signatures, `latest.json` and `SHA256SUMS.txt`, and the
updater endpoint resolves. GATE 4 closed on all eleven screens after six rounds. New in the shell:
`write_select_file`, `cancel_run`, `list_drives`, `list_run_files`, plus `--install-task` /
`--uninstall-task` in the argument allowlist - 15 Rust tests, each watched failing on a plant.
🔴 **`--large-mb` DOES NOT EXIST; the flag is `--large-file-mb`** (default 100). Allowlisting the misspelling
would have compiled, passed every gate, and thrown from the engine the first time a person moved the size
control. 🔴 `engine.rs` was already over the 500-line ceiling before this work; the allowlist moved whole to
`args.rs`. 🔴 A custom Tauri command needs no ACL entry **only while the app has no `src-tauri/permissions/`
directory** - adding one flips `has_app_acl_manifest` true and every command starts needing an explicit entry,
at runtime, with a green build.

**Open GATE 4 items, none blocking:** D-8 (four Settings preferences), D-9 (the ecosystem roster panel),
D-13 (Splash skipped-note copy), D-22 (Run idle hero). `PENDING-TASKS.md` holds TASK-004 to TASK-007;
TASK-003 closed 2026-09-08 (the CRLF working tree: `lib/constants.ps1` went 0 -> 93 CR bytes,
`windowsweep.ps1` 0 -> 316, every LF file stayed at 0).

**The docs site is live over HTTP** at `windowsweep-docs.aoneahsan.com`. 🔴 **HTTPS still probes 000** -
GitHub has not issued the certificate, `https_enforced` is `false`, and that is blocked on GitHub rather than
on the owner. Every link switch waits for one 200 and they all move together, never one early. Its AI guide
was telling automated callers that `--yes` auto-confirms DISM (`12-14` rather than `12-13`); arbitrated from
`lib/constants.ps1:66` and fixed on the site, where the product's own copy was already right.

**Telemetry is configured and nothing was asked of the owner to get there.** The GA4 measurement id was
sitting in the Firebase project's own registered WEB app all along. The whole web config is in the FilesHub
vault (confirmed from the write response's own `changes` list, never by a reveal) and the four ids are GitHub
repository **variables** on `aoneahsan/windowsweep` - public client identifiers, so variables rather than
secrets. MANUAL-TASKS rows 16, 18 and 25 are closed on that evidence.

**Phase P8 exists as a repository.** `aoneahsan/windowsweep-web` is created **private** (D9), scaffolded with
its rules, `docs/PROJECT-CONTEXT.md` and the D9-D12 / P8-D1..D5 decisions, ports 5975/5976 registered. Its
click dummy is being built to GATE 1, which is the owner's call and the run's one deliberate stopping point.
🔴 `https://windowsweep.aoneahsan.com/` answers **404 with a valid certificate** - the custom domain is
connected and nothing is deployed.

**Storytelling:** GATE 1 and GATE 2 are closed and GATE 4 is pre-authorised for every remaining surface on a
stated condition. Content-map rows **16-19** were added for the marketing site as an amendment, and row 1's
tone band was corrected from "W once" to "W twice" because both W lines were already shipped in `README.md`.
🔴 **Two independent blind spots in the story lint hook**, both now fleet law: it strips every code fence
before counting, so on a slot-shaped surface it reads none of the shipping copy; and its sentence splitter
does not split on a period followed by `**`, so `**Short.**` is absorbed into its neighbour and a burstiness
FAIL cannot be fixed by adding one. Write `**Short**.` A green hook on these surfaces is evidence about the
writer's commentary and nothing else.

🔴 **P5 residue:** RW-064 and RW-065 shipped only their verified halves, RW-066 was deferred, and
**section 26 is still free**. Phase P1 is entirely owner-run and moved to a **second machine** on 2026-09-07,
with row 20. The specification of every open item is `../remaining-work.md`; the percentage lives in
`../remaining-work-summary.md` - **read it there**, so one number cannot drift in two files.

## Per-Project Stack Override (binding)

| Concern | This project |
|---|---|
| Language / runtime | Windows PowerShell 5.1-compatible scripts (`windowsweep.ps1`, `lib/`, `modules/`) that also run on PowerShell 7. `bin/windowsweep.js` is a Node >=14 launcher with zero dependencies; `windowsweep.cmd` is the no-Node launcher |
| Package manager | nothing at runtime; `npm` only for `npm pack` and publishing |
| Gates | `node bin\windowsweep.js --self-test --no-color` (fixture-based, exit 0), `npm run version:check`, `npm pack --dry-run` shows the `files` allowlist only, PSScriptAnalyzer with `PSScriptAnalyzerSettings.psd1` (🔴 it only loads under `powershell.exe -NoProfile -ExecutionPolicy Bypass` + `Import-Module`; without that the import fails and a bare `.Count` prints a vacuous 0). CI job `ci` (windows-latest) runs the self-test and a dry-run on both hosts |
| Tests | the self-test fixtures are the test suite (real junction, nested junction, dry-run hash, stale prune, keep-newest, long path, extension-leftover plan). No Vitest, no Jest. New checks for pure logic are pre-approved |
| Typecheck / lint / build | no build output, so the fleet source-map rule is satisfied by construction; PSScriptAnalyzer is the lint |
| UI rules | none apply to the CLI - it has no UI at all. They apply to the desktop app (P6), where nine mandates are met and verified, and **three are declared OUT with reasons**: 🔴 §13's admin panel and plan set are **not applicable** (no server, no plan, no limit, no second user - there is nothing to administer, and no surface makes a pricing claim), §2's upload popover has no upload field, and §16's outside-surface overlay does not arise. §10's GATE 4 parity and §12's interaction floor are **open and owed**. The full mapping with its evidence: `docs/PROJECT-CONTEXT.md` |
| Docs site | `aoneahsan/windowsweep-docs` at `D:\work\windows-cleanup-root\windowsweep-docs`: Docusaurus 3 + React 19 + TS ~6.0.3 + yarn 4, GitHub Pages only, ports 5972/5973. Its pages MIRROR `docs/` - fix a wording error here first, then re-mirror. `docs/MANUAL-TASKS.md` and `docs/story/**` are excluded from its build |
| Backend | 🔴 **Supabase**, since the owner's standing directive of 2026-09-05 (`~/.claude/rules/services-integrations.md`): Supabase is the default backend for every new project, never Firebase. The desktop app was switched the same day, before anything had been created on Firebase, so it cost code and no data. Hosted-only, owner-created, FilesHub-gated; the schema is **Drizzle** TypeScript at `desktop/src/db/schema/`, `supabase db push` is the only applier. 🔴 **No project exists yet and there is nowhere to put one** - all 7 registered accounts are at the 2-project free-tier limit (row 23) |
| Desktop app (P6) | `desktop/` in this repo: Tauri 2 + React 19 + Vite 8 + Tailwind v4 + React Aria + TanStack Router (hash history), port 5974, identifier `com.aoneahsan.windowsweep`. It runs the bundled script with `--json --no-color` and reimplements no cleanup logic. `desktop/design/` holds the approved click dummy and its inventory; `desktop/src` and `desktop/src-tauri` hold the app. 🔴 `tokens.css`, `shared.css` and `components.css` were promoted **once, in one direction** on 2026-09-05 - the app's copies are authoritative and are never synced back. Its own gates are `yarn typecheck && yarn lint && yarn build` plus `yarn check:prepaint`, and `desktop-ci.yml` adds `cargo fmt --check`, `clippy -D warnings` and `cargo test`. GATE 4 (parity) is still open. External design-craft skills are vendored per-project in `.claude/skills/` - see `EXTERNAL-SKILLS.md` |
| Storytelling (P7) | `docs/story/` holds the approved Bible, the voice fingerprint (`calibrated: false`, open and not blocking), the approved 14-surface content map, the decision log, `run-state.json` and `drafts/`. GATE 1 and GATE 2 are cleared and the three desktop surfaces are **recorded**. 🔴 **GATE 4 is pre-authorised for the eleven remaining surfaces** (owner, 2026-09-07) on a stated condition: the finalizer's fact-consistency check PASSES and the surface carries zero unanswered `NEEDS DECISION`. Either one failing pauses **that surface only**. The dummy's words are amended before the app's (`~/.claude/rules/frontend-ui-standards.md` §10a) |
| Marketing site (P8, **not started**) | 🔴 A new repository `aoneahsan/windowsweep-web` at `windowsweep.aoneahsan.com`, decided 2026-09-07 and scheduled **after** both desktop releases. It is a web **app**, not a brochure: Supabase for the backend (accounts, contact requests - the **same** project as the desktop app, so one Auth pool means one sign-in across the family), **Firebase for hosting and analytics only**, plus GA4 + Amplitude + Clarity and Sentry, and **Capacitor from day one** so an Android build is possible later without a rewrite. It becomes the product's **canonical homepage**, which changes what `package.json` `homepage` and the repo fields point at. A click dummy comes first. Full scope: `docs/PROJECT-CONTEXT.md` |
| Context Budget Last Verified | 2026-09-08 — CLAUDE.md 21,478 B / PENDING-TASKS.md 8,870 B; re-check due 2026-09-18 |

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
