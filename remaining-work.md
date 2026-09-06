# windowsweep - remaining work to 100% feature-complete and production-ready

Last Updated: 2026-09-05 (audit, the click dummy closed, both story gates cleared and the desktop app's foundation built; npm `windowsweep@1.1.0`; the desktop app and the storytelling retrofit are in scope)

This is the working specification for finishing windowsweep. It is written for an agent session (Claude Code
or Codex) that has read `CLAUDE.md` / `AGENTS.md` and nothing else. Every open item carries its evidence, its
success criteria, its acceptance points, what to do and what not to do. **Status lives in one place only:
`docs/features/windowsweep-completion/00-tracker.json`.** This file never carries a status column; when an
item closes, the tracker sub-task flips in the same commit as the work.

Companion files: `what-this-project-consists-of.md` (what exists today, with evidence) and
`remaining-work-summary.md` (the one-page view with percentages).

## 1. Definition of done

| Question | Decision |
|---|---|
| What counts as 100% feature-complete | The 1.0 catalogue (sections 0-21) **plus** the family-parity features shipped as 1.1 (sections 22-25, the scripted-selection flags, the `--json` contract), **plus** the docs site, repository hygiene and the owner records, **plus** the Windows desktop app, **plus** the storytelling retrofit of every product-voice surface |
| Does the desktop app count? | **Yes** (owner, 2026-09-05: *"Yes, include it"*). It was excluded from the CLI percentage on 2026-09-03; that scope still exists and is reported separately, but the headline number now covers the whole project |
| Docs site | **In scope.** `aoneahsan/windowsweep-docs` served at `windowsweep-docs.aoneahsan.com` (Docusaurus on GitHub Pages, like `linux-cleanup-docs` and `macleanup-docs`). Built and deployed; the domain waits on the owner's DNS record |
| Storytelling | **Retrofit everything** (owner, 2026-09-05: *"Retrofit everything"*). A Story Bible first, then the README, the docs-site pages, `llms.txt`, the CLI console strings and the desktop copy through the story pipeline. Phase P7 |
| Folder layout | `D:\work\windows-cleanup-root\{windows-cleanup, windowsweep-docs}` is durable (owner, 2026-09-05: *"Keep this layout as is"*). The 2026-09-03 rename row is closed as superseded |
| Distribution channels | **npm and the git clone only** for the CLI. No winget, Scoop, Chocolatey or PowerShell Gallery. The desktop app ships as a GitHub Release with NSIS and MSI installers |

"Production-ready" for this project means: the published npm version equals `main`; every documented promise
is true in the code; the admin, personal and Windows 11 paths have been exercised for real at least once; the
docs site is live and linked; the repository carries topics, a tag and a release per version; the owner's
records (portfolio, ORCID, master links) name the project and agree with it; **the desktop app is released as
`desktop-v1.1.0` and verified page by page against the approved click dummy (GATE 4); and `docs/story/` holds
an approved Story Bible with every in-scope surface through GATE 4.**

## 2. Status snapshot (2026-09-05)

| Area | Weight | Done | What is missing |
|---|---|---|---|
| CLI engine + releases (1.0.0, 1.0.1, 1.1.0) | 25 | 100% | nothing |
| 1.1 residue (candidate target rows) | 3 | 40% | Telegram, WhatsApp, Office, Steam shadercache, WebView2, torch, conda, driver leftovers - all wait on the owner's probe (row 20) |
| Verification (P1) | 8 | 15% | elevated sections 12-16/20 and `--elevate`; Windows 11; the Scheduled Task; sections 4/5/7/8/17-19/23 for real; `--notify` on pwsh |
| Self-test coverage | 4 | 100% | nothing (151 checks, 17 groups) |
| In-repo documentation | 5 | 100% | nothing |
| Docs site | 8 | 95% | DNS + HTTPS (rows 11-12) and the write-back that follows. The PNG OG card and the local install closed 2026-09-05 |
| Repository hygiene + owner records | 5 | 85% | homepage fields after DNS; the owner's review of the master-links entry (row 5); the ORCID import (row 13) |
| Desktop design (click dummy) | 8 | **100%** | nothing - RW-073 to RW-075 closed 2026-09-05, four defects fixed, every gate proved red on its own plant |
| Desktop app (code, Tauri, Supabase, CI, release) | 24 | 68% | all eleven screens built; RW-079 waits on owner row 23; Rust compiles and packages locally since 2026-09-06 (row 22 closed); RW-081 run-to-verify and GATE 4 parity; RW-082 the release |
| Storytelling retrofit (P7) | 10 | 55% | GATE 4 on the three drafted desktop surfaces, seven `NEEDS DECISION` answers, RW-093, then eleven more surfaces |

Score = sum(weight x done) / 100 = 25 + 1.2 + 1.2 + 4 + 5 + 7.6 + 4.25 + 8 + 16.32 + 5.5 = **78.07% of the whole
project**. Against the narrower scope agreed on 2026-09-03 (engine 30, 1.1 features 20, verification 10,
in-repo docs 10, docs site 10, self-test 5, release 5, hygiene 5, records 5) the CLI stands at
30 + 18 + 1.5 + 10 + 9.5 + 5 + 5 + 4.5 + 4.25 = **87.75**. The published CLI on its own is production-ready;
what is open there is verification only the owner can run.

## 3. How to work this file

1. Read `CLAUDE.md` (or `AGENTS.md`), then `docs/features/windowsweep-completion/00-tracker.json`. Take the
   first `pending` or `in_progress` sub-task; it names the `RW-` item below. **Never re-plan from zero.**
2. One item (or one small phase, when the items are small) per session. Run the gates named in the item before
   claiming it done. Flip the sub-task, bump `lastUpdated`, append a `runHistory` row, one commit per repo,
   push and quote the `Bypassed rule violations` line.
3. Every code change obeys the IRON rules in `CLAUDE.md`: PowerShell 5.1 syntax, ASCII-only engine source,
   every deletion through the chokepoint with a declared `-Within` root, `--dry-run` honoured, files under 500
   lines, section numbers frozen, the version cascade moves together.
4. Owner-only rows (`awaitingUser: true` in the tracker, and a row in `docs/MANUAL-TASKS.md`) are never
   executed by an agent. The agent prepares, the owner runs, the agent records the result.
5. Paste-ready session prompt:

   > Read `remaining-work.md` and `docs/features/windowsweep-completion/00-tracker.json` in
   > `D:\work\windows-cleanup-root\windows-cleanup`. Resume the first pending sub-task, do only that item (or
   > that small phase), run its gates, flip its status in the same commit, append a runHistory row, one commit,
   > push to `o main` and quote the bypass line.

## 4. Things never to do (apply to every item)

**The CLI**

- Never reuse or renumber a section. 0-25 are a public contract; the next new section is 26; a retired section
  stays as a no-op that says so.
- Never add a runtime dependency to `package.json`, and never add network code (self-test check [9] fails the
  build on `Invoke-WebRequest`, `HttpClient`, sockets, `curl`, `wget`).
- Never delete outside `Remove-PathSafe` / `Send-ToRecycleBin` / `Clear-DirectoryContents` /
  `Remove-StaleFiles` / `Remove-StaleUnits`, and never call a destructive external command outside
  `Invoke-External -Destructive`. A bare `Remove-Item` on user data is a defect.
- Never shrink a protected list. They only grow.
- Never `npm unpublish`; a bad release is `npm deprecate`d. Never `git push --force`, never `--admin`, never
  edit or disable the `main` ruleset. A direct owner push prints `Bypassed rule violations`; quote it.
- Never ship `CLAUDE.md`, `AGENTS.md`, `docs/`, `temp/`, `desktop/`, the three root planning files or the
  portfolio file in the tarball (`files` is an allowlist; CI sweeps the listing by name).
- Never put a secret, a token, a phone number or a new machine-specific path into this public repository.
- Never change deletion behaviour without a `CHANGELOG.md` entry and matching edits to `docs/sections.md`,
  `docs/cli-reference.md` and the README section table.
- Never run an admin section from an agent session (they need a UAC click), and never run a real (non
  dry-run) cleanup outside the scope the owner named for that session.

**The desktop app**

- Never reimplement any cleanup logic in the app: it runs the bundled `windowsweep.ps1` with
  `--json --no-color` and reads the catalogue from `--list --json`. No finder, no path list, no idle rule.
- Never gate a run behind sign-in, never add a paid tier or a plan set (an explicit owner exemption).
- Never enable a telemetry provider before the consent dialog is accepted, and never sync a filesystem path,
  host name or user name in a run summary.
- Never let the app elevate itself; elevation goes through the engine's own `--elevate`, and this session
  never triggers that path.
- 🔴 **The click dummy owns the words as well as the layout.** A divergence is written into the dummy first,
  then the app matches (GATE 4 parity, screenshot pairs at 1440 and 390). Anything the app declines to ship is
  declared with a reason, never quietly dropped.

**The storytelling retrofit**

- Never write product-voice prose before the Story Bible is approved at GATE 1. Correcting a factually false
  statement is not new prose and is always allowed.
- Never guess a `NEEDS DECISION`: surface it to the owner verbatim, the turn it arrives, with options.
- Never let `docs/story/**` reach the docs-site build (the `exclude` entry plus the workflow sweep).
- Never run a third review round; after two, both positions go to the decision log and the owner decides.

## 5. Closed items (reference only - the specifications were deleted when they closed)

| Item | What shipped | Commit |
|---|---|---|
| RW-001 | 1.0.1 published so npm equalled `main`, with the full publish gate | `edaa5cf` |
| RW-002 (HIGH) | `--yes` no longer selects anything in sections 17, 18, 19: `Read-MultiSelect -NoAutoYes`, section 17's confirmation never auto-answered, an AST check on every picker call site | `edaa5cf` |
| RW-003, RW-004 | Section 19's title names Downloads only; sections 18/19 report the `recycle` tier | `edaa5cf` |
| RW-005 | `--purge-all` from a console asks for the typed word once per run | `edaa5cf` |
| RW-006 | The VSIX download cache is its own unguarded target, as documented | `edaa5cf` |
| RW-007 | `--install-task` / `--install-alias` refuse under npx (exit 3) with the global-install steps | `edaa5cf` |
| RW-008 | The engine exits 130 on an interrupted run, matching the launcher and the docs | `edaa5cf` |
| RW-010, RW-011 | `--uninstall-data` always asks; keywords trimmed to twelve | `edaa5cf` |
| RW-022 | Windows Server wording: CI dry-runs on `windows-latest`; real runs verified on Windows 10 | `3ae3c4d` |
| RW-030 | Self-test 114 -> 124: parser, section lists, size text, cache leaves, `--json` shape, superseded versions, Chromium layout, workspace storage, stale artefacts, report export - each proved red on a plant | `1650e80` |
| RW-041 | `AI-INTEGRATION-GUIDE.md` at the root, in the `files` allowlist, linked and mirrored | `5c12134` |
| RW-050 | 8 topics, wiki off, annotated tags `v1.0.0` and `v1.0.1` with GitHub Releases | `a94bac7` + tags |
| RW-051 (agent half) | Portfolio-info file with a byte-identical root copy, the master links entry, `windowsweep.bib` and the combined refresh, the ORCID block in both instruction files | `a94bac7` |
| RW-053, RW-054 | CI tarball sweep names the planning files; README and docs index rows point at them | `edaa5cf`, `3ae3c4d` |
| RW-060 | Section 22: the global-packages audit, read-only, declaring no deletable target | `3c4d54e` |
| RW-061 | Section 23: orphaned application data under AppData, interactive, Recycle Bin, fail-closed | `3c4d54e` |
| RW-062 | Section 24: installed programs not modified for N+ days, report only | `3c4d54e` |
| RW-063 | Section 25: the startup-items audit, report only | `3c4d54e` |
| RW-067 | Seven artefact-directory additions plus a marker-gated `.cache` | `3c4d54e` |
| RW-068 | `--notify`: a WinRT toast on 5.1, a tray balloon on pwsh, wired into `--install-task` | `3c4d54e` |
| RW-069 | The sibling features deliberately not adopted, recorded (§9 below keeps the table) | `3c4d54e` |
| RW-071, RW-072 | `--select` / `--select-file`; `candidates[]`, `targets[]`, progress lines, `--list --json` | `3c4d54e` |
| P5 release | 1.1.0 published, tagged `v1.1.0`, released; the docs site re-mirrored | `3c4d54e` |
| RW-070 | The desktop app's scope decided and recorded (account model, telemetry, location, identity, releases) | 2026-09-03 |
| Click dummy | Direction 01 built and rejected; direction 02 "Reclaim" built, refined over rounds 3 and 4, approved at GATE 1 with gates 2-3 pre-authorised; the eight-file component library; the eight A4 screens | `07c6f37`, `5481891`, `0c7b955`, `a2d6b88`, `63e815f`, `45953b7`, `2721b75` |
| RW-042 | Docs-site labels corrected: footer `Sections 0-25`, `llms.txt` facts, the intro footer, the quick-start check count, the report example version | this audit |
| RW-073 | Block Q closed: the inventory ledger, the house-promotion panel with both self-exclusion layers made load-bearing and proved, every page opened | 2026-09-05 |
| RW-074 | Block R closed: six store flows, 11/11 rail links verified by clicking, demo axes never persisted, the namespace read from a physical key | 2026-09-05 |
| RW-075 | Block S closed: overflow clean at six widths, no focusable-while-hidden control, no HTML text under 12px, 8,034 contrast measurements with 0 failures, every gate proved red on its own plant. Four defects fixed | 2026-09-05 |
| RW-044 (part) | Docs-repo topics set | this audit |
| RW-052 | Folder rename superseded by the `-root` layout decision | this audit |
| RW-055 | Portfolio file refreshed to 1.1.0 and renamed in both locations; master links entry updated | this audit |

## 6. Phase P1 - verification of paths that have never run for real

Every row here is owner-run. The agent's part is to prepare the exact command, collect the log and report
afterwards, fix what the run exposes, and record the outcome in `docs/PROJECT-CONTEXT.md` under "Verified
runs". The rows exist in `docs/MANUAL-TASKS.md`; the tracker mirrors them as `awaitingUser` sub-tasks. Run
them from 1.1.0 (`npm i -g windowsweep@latest` or the clone).

### RW-020 - First real elevated run of sections 12-16 and 20 (owner ~30 min + agent 30 min)

- **What.** No admin section has ever executed for real: the build machine ran unelevated, CI runs dry-runs
  only. `Invoke-Elevated` (`lib/safety.ps1`), the service stop/start wrapper, `cleanmgr` with `StateFlags0077`,
  DISM, `powercfg`, `wevtutil` (`modules/system_admin.ps1`) and `diskpart` compaction (`modules/docker.ps1`)
  are untested outside dry-run.
- **Command (owner, at the keyboard).** `windowsweep --only 12,13,14,15 --hiberfil off --yes
  --i-understand-deep --elevate` (MANUAL-TASKS row 1; hibernation fully off is the owner's recorded decision).
  Section 16 (event logs) and 20 (compaction) are separate decisions: run `--only 20 --yes --i-understand-deep
  --elevate` only with Docker Desktop and WSL shut down; run 16 only if the owner wants the logs gone.
- **Success criteria.** The elevated window's JSON report shows `ran` for every section requested;
  `Get-Service wuauserv,bits` shows both `Running` afterwards; the `StateFlags0077` values are absent from
  `HKLM:\...\VolumeCaches\*`; `hiberfil.sys` is gone and `powercfg /a` reports hibernation unavailable; DISM's
  analysis lines appear in the log; no crash bundle under `~\.windowsweep\feedback`.
- **Acceptance points (agent, after the run).** 1. Read the log and report; record freed bytes and the
  before/after free space in `docs/PROJECT-CONTEXT.md`. 2. Any warning or non-zero exit becomes a P0-style fix
  with its own sub-task. 3. Confirm the parent window printed the child's exit code (the `-Wait -PassThru` path).
- **Do not.** Never run this from an agent session; never add `--reset-base` on the first run.

### RW-021 - Windows 11 has never been exercised (owner ~30 min)

- **What.** README and `docs/installation.md` list Windows 11 as supported; every real and dry run so far was
  Windows 10 Pro for Workstations (19045) or CI's Windows Server.
- **Command (owner, on a Windows 11 machine or VM).** `npx windowsweep --self-test` (expect 151/151), then
  `npx windowsweep --dry-run --all --yes`, then a real `npx windowsweep --all --yes`. MANUAL-TASKS row 8.
- **Success criteria.** Self-test green, dry-run reviewed, the real run frees space with no unexpected `REFUSE`
  line and no crash bundle; the OS build number recorded in `docs/PROJECT-CONTEXT.md`.
- **Acceptance points.** Windows 11-only paths (new Teams under `Packages\MSTeams_*`, `Widgets`, WebView2
  caches) appear in the `--scan` table; anything absent by design is noted in `docs/sections.md`.

### RW-023 - Sections 4, 17, 18, 19 and 23 for real (owner ~20 min)

- **What.** Section 4 found no idle AVD on the build machine; 17-19 and 23 are interactive by design.
  MANUAL-TASKS row 3 (`--only 17 --scan-roots "D:\work;E:\04-code"`, then `--only 18,19`) and row 19
  (`--profile audit`, then `--only 23 --dry-run`). Section 4 runs when an AVD is idle 100+ days or with
  `--days` lowered deliberately.
- **Success criteria.** Each section lists candidates, the owner selects, the selected items go (17: removed;
  18/19/23: Recycle Bin), the JSON report shows `ran`, nothing unselected is touched. The selection prompt
  appears even with `--yes`. `--select-file` is the scripted alternative and lifts the batch refusal.
- **Acceptance points.** Section 23 lists nothing belonging to a program that is still installed (the owner's
  judgement is the acceptance); a folder named for a running process never appears.

### RW-024 - Sections 5, 7 and 8 with the blockers closed (owner ~15 min)

- **What.** Chrome (7.4 GB across 25 profiles), Slack and Granola were open and Docker's daemon was stopped
  during the build-session run, so those targets were skipped by the running-app guard. MANUAL-TASKS rows 2,
  6, 7.
- **Success criteria.** Each `--only N --yes` run shows the previously skipped targets as cleared; the
  before/after free-space delta is recorded.

### RW-025 - The weekly Scheduled Task observed running once (owner 5 min + agent 15 min)

- **What.** `--install-task` registers `windowsweep weekly safe cleanup` (Sunday 03:00, `--all --yes --quiet
  --no-color --notify`); it has never been observed to run. Install it from a **global** install - under npx it
  refuses by design. MANUAL-TASKS row 9.
- **Success criteria.** `Get-ScheduledTaskInfo -TaskName 'windowsweep weekly safe cleanup'` shows
  `LastTaskResult 0` after `Start-ScheduledTask`; a new `report-*.json` exists with `mode: all`,
  `developer_mode: true` and no `refused` step.

### RW-026 - PowerShell 7 path on a real machine (owner, optional, 10 min)

- **What.** CI proves the engine on `pwsh`; the build machine has no PowerShell 7, so `--pwsh` through the Node
  launcher and `Register-ScheduledTask` under pwsh were never run locally. MANUAL-TASKS row 10.
- **Success criteria.** `npx windowsweep --pwsh --self-test` green on a machine with PowerShell 7;
  `--pwsh --install-task --dry-run` prints the action line.

### RW-027 - `--notify` seen on both hosts (owner 5 min)

- **What.** The toast was seen once on Windows PowerShell 5.1; the `NotifyIcon` balloon on PowerShell 7 has
  never been observed by a person, and a notification is only verifiable by seeing it. MANUAL-TASKS row 21.
- **Command.** `windowsweep --scan --notify` on 5.1 and `windowsweep --pwsh --scan --notify` on pwsh.
- **Success criteria.** A notification appears on each host; the exit code is 0 and stdout is unchanged
  (`--json` output must not gain a line).

### RW-028 - Owner dry-run review of the four read-only audits (owner 10 min)

- **What.** Sections 22, 24 and 25 report only; section 23 deletes to the Recycle Bin. The owner has not yet
  reviewed what they list on his machine. MANUAL-TASKS row 19.
- **Command.** `windowsweep --profile audit` (0, 21, 22, 24, 25 - all read-only), then
  `windowsweep --only 23 --dry-run`.
- **Success criteria.** Section 22's candidate list contains no package manager and nothing a recent project
  references; section 24 lists programs by size with a working uninstall hint; section 25's enabled/disabled
  column matches Task Manager; **section 23 lists nothing that belongs to a program still installed.**

## 7. Phase P3 - the docs site, its residue

### RW-040 - The write-back after the domain answers 200 (owner rows 11-12, then agent 30 min)

- **What.** `windowsweep-docs.aoneahsan.com` is pinned in `static/CNAME`, matched by `url` in
  `docusaurus.config.ts`, and the Pages deployment is green - but the domain probes `000`, so every link still
  points at GitHub. Two owner rows unblock it: **row 11** Hostinger DNS `CNAME windowsweep-docs ->
  aoneahsan.github.io`; **row 12** GitHub Settings -> Pages -> custom domain + Enforce HTTPS.
- **Evidence.** `curl -s -o /dev/null -w '%{http_code}' https://windowsweep-docs.aoneahsan.com/` -> `000`;
  `gh api repos/aoneahsan/windowsweep-docs/pages` -> `"https_enforced": false`.
- **Success criteria.** The probe returns **200** and `https_enforced` is `true`. Only then does anything switch.
- **Acceptance points (one commit each side).**
  1. `package.json` `homepage` -> the site.
  2. README: the header `Docs` link and every `docs/*.md` link in the Documentation and Links tables -> the
     site pages, keeping one GitHub link labelled "Documentation index (source)".
  3. `WS_DOCS` in `lib/constants.ps1` -> the site (a version-cascade-adjacent change: no version bump needed,
     but `--version` output is checked afterwards).
  4. `gh repo edit aoneahsan/windowsweep --homepage <site>` and the same for `windowsweep-docs`.
  5. The master links JSON `links.docs`, and the portfolio file's Docs URL row.
  6. `docs/MANUAL-TASKS.md` rows 11 and 12 move to Completed with the date.
- **Do not.** Do not switch a single link before the 200 probe; do not put relative links from the package
  README to the site.

### RW-043 - A PNG Open Graph image (agent 20 min)

- **What.** `themeConfig.image` is `img/social-card.svg`. Most social scrapers ignore SVG, so the card is
  effectively missing. The SVG stays the master (the SVG-first rule); a PNG export sits beside it.
- **Success criteria.** `static/img/social-card.png` exists at **1200x630**, committed beside the master;
  `themeConfig.image: 'img/social-card.png'`; the `og:image:width`/`height` meta stay 1200/630.
- **Acceptance points.** After the deploy, `curl -sI <site>/img/social-card.png` returns 200 with
  `content-type: image/png`; a card validator renders it; the text in the export is legible (outline the
  fonts or use faces the exporter has).
- **Do not.** Do not hand-edit the PNG; re-export it from the SVG whenever the master changes.

### RW-045 - The local install of the docs site (agent 30 min)

- **What.** `node_modules/` has never existed in `windowsweep-docs/`. The lockfile was inherited from
  `linux-cleanup-docs` with only its workspace identity renamed - valid exactly while the dependency set is
  identical, which is why adding or bumping a dependency has been forbidden. The owner lifted the download gate
  on 2026-09-05.
- **Success criteria.** `yarn install` completes; `yarn.lock` is regenerated and committed; `yarn build` and
  `yarn typecheck` are green locally with zero warnings; the Pages run with `--immutable` stays green on the
  new lockfile.
- **Acceptance points.** The "inherited lockfile" note in the docs repo's `CLAUDE.md` and `AGENTS.md` is
  retired in the same commit; the dependency set is unchanged by the install (diff the lockfile's package list).
- **Do not.** Do not add `corepack prepare yarn@stable --activate` to the workflow - it installs a newer Yarn
  than the one that produced the lockfile and breaks `--immutable` with YN0028.

### RW-046 - A feed: deliberately not built (record, no work)

The fleet rule asks every frontend project for `/feed` and `/feed.xml`. This site has **no blog and no dated
content**: its pages mirror a manual, and the only chronological surface is the changelog page, which mirrors
`CHANGELOG.md`. A feed over it would be a second copy of the release notes with no subscriber. Recorded as a
deliberate omission rather than a gap. **If the owner wants one:** add `@docusaurus/plugin-content-blog` over
changelog entries, emit `/feed.xml` and a `/feed` page, link both in the footer, and leave the `Sitemap:`
directive unchanged.

## 8. Phase P4 - hygiene and the owner's records, residue

### RW-051 - The owner's two record rows (owner 15 min)

- **Row 5.** Review the `windowsweep` entry in `PROJECT-LINKS-IDENTIFIERS-CONTACT.json` and set `ownerReview`.
  The entry now reads `Published v1.1.0 (2026-09-04)` with 26 sections and the 151-check self-test.
- **Row 13.** Import `orcid-project-projects-files/windowsweep.bib` into ORCID and retype the work from
  "Other" to "Software" (BibTeX cannot express the type).
- **Success criteria.** `ownerReview` is non-empty; the ORCID record lists windowsweep as Software with the npm
  URL. The agent records both in the notebook's own `MANUAL-TASKS.md`.

### RW-055 - The portfolio refresh cadence (agent, recurring)

- **What.** The portfolio file refreshes **at least weekly** and not more often than every 3 days. This audit
  moved it to 1.1.0 and renamed it to `WINDOWSWEEP_portfolio-info_2026-09-05.md`; **next eligible 2026-09-12**.
- **Acceptance points.** Update the facts and add one history row (max 10 rows kept); rename to the new date in
  **both** locations and delete the old file in both; update `hasPortfolioFile` in the master JSON; `cmp` the
  two copies; commit the notebook with explicit paths.
- **Do not.** Never leave two dated portfolio files in one location; never invent a number.

## 9. Phase P5 - the 1.1 residue (all blocked on one owner probe)

Common rules: a path becomes a `New-Target` row **only once it has been seen on a real machine holding only
regenerable data**. Everything unverifiable stays in the "candidate targets awaiting verification" table in
`docs/sections.md`. One owner row settles all of it: **MANUAL-TASKS row 20**, a read-only probe he runs on any
machine that has the software. Shipped rows land in **1.2.0** with `docs/sections.md`, `docs/cli-reference.md`,
`docs/profiles.md`, the README section table and `CHANGELOG.md` moving in the same commit.

### RW-064 - Target rows for sections 8 and 9 (agent half a session, after the probe)

| Section | Target | Path | Mode / guard |
|---|---|---|---|
| 8 | Telegram Desktop cache | `%APPDATA%\Telegram Desktop\tdata\user_data\cache` and `...\media_cache` | clear; guard `Telegram` |
| 8 | WhatsApp (Store) cache | the `5319275A.WhatsAppDesktop_*` package's `LocalCache` leaf (exact name from the probe) | clear; guard `WhatsApp` |
| 8 | Microsoft Office file cache | `%LOCALAPPDATA%\Microsoft\Office\16.0\OfficeFileCache` | **prune idle only**; guards `WINWORD`, `EXCEL`, `POWERPNT`, `OUTLOOK`, `ONENOTE` (unsynced changes live here; never clear) |
| 8 | Steam shader cache | `steamapps\shadercache` in every library in `libraryfolders.vdf` | clear; guard `steam` |
| 8 | WebView2 per-app caches | `%LOCALAPPDATA%\*\EBWebView\Default` as the `chromium` layout kind | layout kind; guard the host app when known |

`wsreset.exe` already ships in section 9 as an **offered next step** rather than an execution (it has no silent
mode and always opens the Store).

- **Acceptance points.** Each path verified present on a machine with the app installed, with the observed size
  named in the commit body; the layout-kind allowlist in `lib/actions.ps1` unchanged unless a new leaf is
  genuinely needed (then the self-test proves the second guard still refuses a non-cache leaf); dry-run reviewed
  by the owner; self-test [6] green.

### RW-065 - Target rows for section 1 (agent 2 h, after the probe)

The Hugging Face hub cache shipped in 1.1.0 (prune, developer-gated; snapshots link into blobs, so keep-newest
would orphan blobs - prune is correct). Still awaiting verification: `%USERPROFILE%\.cache\torch` (prune,
developer-gated) and `conda clean --all --yes` through `Invoke-External -Destructive` when `conda` is on PATH.
Chocolatey's `%TEMP%\chocolatey` and winget's `%TEMP%\WinGet` are already covered by section 10 - document, no
new row. `%USERPROFILE%\.expo` holds state, not cache - do not add.

- **Acceptance points.** The AI-agent caches under `.cache` (`claude*`, `codex*`, `gemini*`, `copilot*`) stay
  protected; each new `.cache` target is explicitly allowed by self-test [5]; dry-run reviewed.

### RW-066 - Section 26: driver and upgrade installer leftovers (agent 2 h, after the probe)

- **What.** `C:\NVIDIA` (driver extraction), `C:\ProgramData\NVIDIA Corporation\Downloader`, `C:\AMD`, `C:\ESD`
  (feature-upgrade payload, safe once the upgrade completed). All regenerable, all admin-owned. **`C:\Intel` was
  inspected and REJECTED** - it holds `Thunderbolt`, `Logs` and `GfxCPLBatchFiles`, which are driver support
  content, not extraction leftovers. None of the others exists on the build machine, so **section 26 was never
  created and the number is still free.**
- **Acceptance points.** `Admin = $true`, `Batch = 'optin'`, tier `rebuilds`; `--scan` shows sizes unelevated;
  the folders are outside every protected root (self-test [6]); `C:\$WinREAgent`, `C:\Windows.old` and
  `Windows\Installer` are explicitly **not** targets; docs written.

### RW-069 - Sibling features deliberately not adopted (record, no work)

| Sibling feature | Why not |
|---|---|
| `linux-cleanup --tui` (whiptail/dialog) | no dependency-free Windows equivalent; the menu covers it, and the desktop app supersedes the need |
| `linux-cleanup --doctor` (shell-init repair) | Linux-specific; Windows PATH repair is out of scope |
| `macleanup --check-update` | contradicts the no-network design the README advertises |
| `macleanup` Time Machine snapshot sections | Windows restore points are a recovery mechanism; deleting them is out of scope |
| `macleanup` section 27 (font / QuickLook caches) | the Windows font cache is a system service store; clearing it is a repair step, not cleanup |

## 10. Phase P6 - the Windows desktop app

The scope was decided on 2026-09-03 and the design approved on 2026-09-05. **Gates 1, 2 and 3 are recorded**
(GATE 1 explicitly, gates 2 and 3 pre-authorised by *"Straight through to the app"*), which is the sole
authority for creating anything under `desktop/` beyond `design/`; **GATE 4 (parity) closes only after the app
exists.** The blocks below correspond to sections O-Z of
`C:\Users\PC\.claude\plans\please-plan-and-get-agile-fairy.md` section 18, which holds the long form.

**Settled, not to be re-litigated:** optional Google sign-in for **sync only** (email, settings, run history;
settings restored on sign-in); **runs are never gated, no paid tier, no plan set**; full observability (GA4,
Amplitude, Clarity, Sentry) behind a first-run consent dialog with every provider off until accepted, while the
CLI keeps zero network calls; `desktop/` in this repository, excluded from the npm allowlist and asserted absent
by CI; identifier `com.aoneahsan.windowsweep` (permanent); app version = the bundled CLI version; releases
tagged `desktop-vX.Y.Z` with NSIS + MSI + `.sig` + `latest.json`; the backend is **Supabase** (owner directive
2026-09-05) and its administration surface is the Supabase dashboard for this phase - there is no in-app admin
panel and none is owed, for the reason recorded in `docs/PROJECT-CONTEXT.md`: no server, no plan, no limit and
no second user.

### RW-073 - Finish Block Q: the A4 screens, the inventory and the promotions (agent 1 h)

- **What.** The eight screens (`splash`, `consent`, `picker`, `history`, `report`, `account`, `settings`,
  `elevation`) plus `pages.html` were committed as WIP in `2721b75`. What Block Q still owes:
  `desktop/design/CLICK-DUMMY-INVENTORY.md` (the parity ledger, with **rows and files as separate totals** so
  the arithmetic is checkable), the house-promotion panel in `settings.html`, and a look at every page.
- **Acceptance points.**
  1. The inventory lists all 20 HTML files, 28 JS, 4 CSS and the vendor set, with per-screen rows naming the
     archetype, the regime and what it covers.
  2. **House promotions ship in `settings.html` in two layers** (`rules/post-install-onboarding.md`): the
     ecosystem roster is vendored with `windowsweep` **dropped**, and the display resolver filters that id
     **again**. Prove each layer with the other removed. It is the only promotion surface; no ad network,
     because the app's privacy copy promises none.
  3. `grep -c '<textarea' *.html` -> **0** (the one multi-line input is `contenteditable`, tiptap-shaped).
  4. The "no pricing page, no admin batch" exemptions are restated on the inventory rather than silently absent.
  5. Every page opened and looked at: four of session 4's defects had no gate and were found only that way.
- **Do not.** Do not change the approved layout or wording of the three original screens in this item.

### RW-074 - Block R: the wiring batch (agent 1.5 h)

- **What.** The prototype becomes one working thing: the `NAV` registry is real for all eleven pages (done in
  `2721b75` - verify no `soon: true` remains), and the store carries six flows end to end.
- **Acceptance points.**
  1. First run -> consent -> settings round-trip -> a run -> a history entry that survives a reload -> sign in
     unlocks the cloud rows -> sign out resets to first-run.
  2. Consent state gates the Home privacy ledger and the Account screen; **declining is a first-class path.**
  3. 🔴 Every link verified by **clicking**, not by reading `href`s.
  4. Demo axes stay in the URL and are **never persisted**; preferences persist. Decorate from the pristine
     authored href.
  5. The storage namespace is proved by reading a **physical `localStorage` key** back, never by reading config.

### RW-075 - Block S: verify the dummy and hand it over (agent 1.5 h)

- **What.** Re-run the instruments already built, now across eleven screens plus eight gallery files.
- **Acceptance points.**
  1. **Contrast sweep** on the rendered DOM: fresh load per appearance, colours compared as **pixels not
     strings** (Chrome returns `oklch()`), probe canvas cleared to transparent, **SVG `fill` included**.
  2. **Type audit**: nothing user-visible below 12px, no paragraph below 15px, measured from the page.
  3. **The four gates** (`overlayContrast`, `axes`, `storageNamespace`, `overflow`) at 390 / 1440 / 1920, each
     still red on its own planted defect **plus a second, different plant** - one plant only proves the gate
     against the shape already imagined. Verify each plant actually applied.
  4. Keyboard throughout with a visible ring; reduced motion via both the OS query and the in-app axis.
  5. Screenshots at 1440 and 390 in all three treatments, light and dark.
- **Browser.** 🔴 Headless Chrome is broken on this machine (GPU crash, `--virtual-time-budget` never idles).
  Launch `$CHROME_WS_BROWSER` **headed** with `--remote-debugging-port=9222`, assert the profile is
  `ahsan-automation` before the first navigation, drive CDP from Node's built-in `WebSocket`, and kill only the
  browser this session launched.
- **Then hand back** the screenshots and the numbers. Gates 2 and 3 are already recorded; this is a hand-back,
  not a request.

### RW-076 - The story gate on the desktop copy (agent, depends on P7)

The dummy's words are the specification. Before RW-077 translates a screen, that screen's copy must have passed
the story pipeline (RW-093), and the amended words must be **in the dummy**. See §11.

### RW-077 - Block T: `desktop/`, the web layer (agent 4 h)

- **What.** The first creation under `desktop/` beyond `design/`, permitted by the recorded gate 3.
- **Acceptance points.**
  1. `desktop/package.json`: Vite 8, React 19, TypeScript **`~6.0.3`** (🔴 the fleet pin - TS 7 removes
     `yarn lint`), Tailwind v4, React Aria Components, TanStack Router (**hash history**), i18next, `motion`,
     the d3 modules the charts use, `@tauri-apps/api` + `cli`. Dev port **5974**. `.yarnrc.yml` with
     `npmMinimalAgeGate: 0`. Then `yarn install`.
  2. 🔴 `tokens.css` is **promoted once, in one direction**, into `desktop/src/styles/tokens.css` wrapped in
     `@theme inline`. The app's copy is authoritative from that moment; there is never a two-way sync.
  3. `src/lib/cli.ts` parses the summary, `candidates[]`, `targets[]` and the `##windowsweep` progress lines
     1.1.0 added for exactly this consumer. **It reimplements no cleanup logic.**
  4. `src/lib/catalogue.ts` is built from `--list --json`, 🔴 never hard-coded, so a new section appears
     without an app change.
  5. `src/lib/auth.ts`: PKCE, system browser, loopback -> Identity Toolkit REST.
  6. `src/lib/sync.ts`: Firestore REST; settings newest-wins **with an undo toast**; runs paginated (limit 20 +
     cursor, per the fetch budget); 🔴 no paths, host name or user name ever synced.
  7. The **ten-axis theme registry**, one table, applied **pre-paint** from a head script - appearance applied
     late is a flash, density or text size applied late is a reflow.
  8. 🔴 **i18n from day one**: every user-visible string through `t()`, plus the `no-restricted-syntax` lint
     gate (AST selectors, **no new dependency for one rule**). Land as `warn`, sweep, flip to `error`. The
     acceptance test is one sentence: *is a second language ONE new catalogue file, and nothing else?*
  9. One consent-gated `track()` fanning out to GA4 + Amplitude + Clarity **inside the report function**, plus
     Sentry with release tagging and path scrubbing. 🔴 Amplitude's flag is set on the init **promise**, never
     the call; a hand-rolled gtag shim pushes `arguments`, never a spread array.
  10. Every screen translated from the dummy, composed from the gallery's vocabulary; 🔴 external links open in
      the system browser through one `ExternalLink` + policy module.

### RW-078 - Block U: `src-tauri/` (agent 2 h)

- **Acceptance points.** Identifier **`com.aoneahsan.windowsweep`** (permanent), product name `windowsweep`,
  window 1000x720 / min 760x560, `createUpdaterArtifacts`, bundles **nsis + msi**; a CSP allowing only the
  analytics, Sentry, Google and Firestore hosts; least-privilege capabilities; resources
  `resources/windowsweep/**` copied by a `sync:cli` package script; four commands - `app_version`, `run_clean`,
  `oauth_listen`, `read_run_report`. `run_clean` spawns `powershell.exe -NoProfile -NoLogo -ExecutionPolicy
  Bypass -File <res>\windowsweep.ps1 --json --no-color ...` with `WINDOWSWEEP_LAUNCHER=desktop`; stderr ->
  `clean:log`, `##windowsweep` -> `clean:progress`, stdout -> `clean:done`. Elevated runs go through the
  engine's own `--elevate` with `--reports-dir`/`--logs-dir` under
  `%LOCALAPPDATA%\windowsweep-desktop\runs\<id>`, and the app **tails the log**.
- **Do not.** The app never elevates itself, and no agent session triggers that path.

### RW-079 - Block V: Supabase - the schema, the policies, the project (agent 1.5 h + owner rows 15, 23)

- **What.** The backend. 🔴 **Supabase, not Firebase** - owner directive 2026-09-05, applied to this project
  the same day because nothing had been created yet, so it cost code and no data.
- **Done and committed (2026-09-05).** `desktop/src/db/schema/sync.ts` (two tables, seven policies, RLS on
  both) · `supabase/migrations/` - the generated DDL **and** the hand-written **paired privilege block**,
  because Drizzle emits no `revoke` and Supabase's default ACL names `anon`, `authenticated` and
  `service_role` by name · `src/lib/auth.ts` on Supabase Auth PKCE, reusing the Rust loopback listener
  unchanged · `src/lib/sync.ts` on PostgREST, limit 20, keyset by `started_at`, every query filtered on the
  column its policy reads · the CSP narrowed to `*.supabase.co` · `desktop/supabase/README.md`.
- **Acceptance points.**
  1. 🔴 `supabase db push` is the ONE applier. Never `drizzle-kit push`, never `drizzle-kit migrate`, never
     the `@rc`/1.0-beta line - it emits a directory per migration, so `db push` reports success having applied
     nothing.
  2. The **equivalence gate** passes: after the push, `yarn db:generate` prints *"No schema changes, nothing
     to migrate"*. It does today, against the migrations as written.
  3. 🔴 Grants verified from `information_schema.role_table_grants`, **never from the migration text** - the
     files describe intent, and intent is what diverges. No app table shows `arwd` for `anon`; `anon` holds
     nothing at all.
  4. 🔴 Policies verified from `pg_policies`, and a `(200, 0)` probe proves nothing - seed first, probe as a
     non-admin test account, and remember a forbidden UPDATE/DELETE is 200 with 0 rows.
  5. `user_settings` is never written with `.upsert()`. The column-scoped UPDATE grant excludes `user_id`, so
     an upsert carrying it is refused at plan time with a message naming the table rather than the column.
- **Blocked, and not on the code.** 🔴 Measured 2026-09-05: **all 7 registered Supabase accounts hold 2
  projects each** - the free-tier limit, 14 of 14 slots used. windowsweep needs a **new account** before it
  can have a project, and both are owner-only (row 23). Row 15 follows it and is a **Web** OAuth client
  pointed at `https://<ref>.supabase.co/auth/v1/callback`, not the Desktop client the Firebase flow wanted.
- **Do not.** Create a Supabase project or an account by any means. Run `supabase db reset`, `start`, `stop`
  or `status`. Point anything at `127.0.0.1:54321`. Treat a blocked credential gate as a reason to switch
  backends - that is exactly how "unless I ask otherwise" becomes "whenever a credential was slow to arrive".

### RW-080 - Block W: CI (agent 1 h)

- **Acceptance points.** `desktop-ci.yml` (windows-latest): `yarn install --immutable`, `typecheck`, `lint`,
  `build`, `cargo fmt --check`, `cargo clippy -- -D warnings`, `tauri build --no-bundle`.
  `desktop-release.yml`: `tauri-action` on a `desktop-v*` tag, manual dispatch until the signing secrets exist.
  🔴 The existing tarball sweep in `ci.yml` already forbids `desktop/`; **confirm it still passes** now that the
  folder has real content, and that `npm pack --dry-run` shows the allowlist only.

### RW-081 - Block X: local gates, run-to-verify, and GATE 4 (agent 2.5 h)

- **The Build Tools dependency is satisfied** (row 22 closed 2026-09-06; VS 2022 Build Tools at
  `D:\BuildTools`, MSVC 14.44.35207, Windows SDK 10.0.26100.0). The local half of the acceptance points
  below has been run and is green; what remains is the run-to-verify pass and GATE 4 itself.
- **Acceptance points.**
  1. `yarn typecheck && yarn lint && yarn build` (zero warnings), `cargo fmt --check`,
     `cargo clippy -D warnings`, `yarn tauri build`.
  2. 🔴 **Watch each gate fail before trusting it**: plant one broken line, confirm the script goes red, delete
     it. A `tsc --noEmit` in a project-references layout compiles nothing and exits 0 - use `tsc -b` there.
  3. **Run-to-verify over the app's own WebView2**
     (`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=<port>`): light and dark screenshots; a
     **`--dry-run` only** safe batch; a picker flow driven by `--select-file`; sign-in with the
     `aoneahsan.apps.t1+1@gmail.com` alias, **password read at runtime from `~/.secrets/test-accounts/` and
     never echoed**; a settings round-trip through sign-out and back; **consent proven by inspecting the
     network, not by reading the flag**; the process killed afterwards.
  4. 🔴 **GATE 4 - parity.** Every screen, the dummy and the app side by side at **1440 and 390**, as screenshot
     pairs in the report. The dummy owns the **words** as well as the layout; anything the app declines to ship
     is declared with a reason.

### RW-082 - Block Y: the first release (agent 1 h)

- **Acceptance points.** Updater keypair -> `~/.secrets/tauri/windowsweep.key` (chmod 600) with a row in
  `~/.secrets/INDEX.md`; the public key into `tauri.conf.json`; the private key + password via `gh secret set`.
  🔴 The key never touches the repo and is never printed. App version = the bundled CLI version = **1.1.0**;
  tag `desktop-v1.1.0`; a GitHub Release with NSIS + MSI + `.sig` + `latest.json`. 🔴 **Installers carry a
  unique, build-stamped name** - `windowsweep-v1.1.0-<yyyy-MM-dd>-<HHmm>`, stamped by the build, never renamed
  by hand. SmartScreen warns on an unsigned installer on first run: **say so in the README and on the docs
  page** rather than letting a user meet it unexplained.

### RW-083 - Block Z: the records (agent 1.5 h)

- **Acceptance points.** README gains a **Desktop app** section; the docs site gains `desktop.md` and is
  re-mirrored (fix the CLI repo first, then mirror - never patch the docs repo directly), Pages run watched;
  `docs/PROJECT-CONTEXT.md`, `docs/PACKAGES.md` (the desktop manifest is a second manifest unit - record it),
  `CLAUDE.md` = `AGENTS.md` (both **under 28 KB**, verified by byte count); the tracker flipped per block with
  its SHA; a `docs/work-history/` record ending in a continuation prompt; the memory note refreshed;
  `remaining-work-summary.md` recomputed.

### RW-084 - The owner's three desktop rows (blocked)

Row **15** the Google OAuth client id · row **16** the GA4, Amplitude, Clarity and Sentry keys. Both are
still owner-only.

🔴 Row **22** (the Visual Studio 2022 Build Tools install) is **CLOSED - 2026-09-06**, so this section is two
rows, not three. The owner lifted the "never raise a UAC prompt" constraint and the install ran to
`D:\BuildTools` (MSVC 14.44.35207, Windows SDK 10.0.26100.0). Nothing Rust-side is CI-only any more.

### RW-085 - Code signing (owner decision + cost)

Unsigned installers trigger SmartScreen. Signing needs a certificate and money, so it is an owner decision, not
an assumption. Until then the warning is **documented, never hidden**.

## 11. Phase P7 - the storytelling retrofit (owner decision 2026-09-05)

The owner chose *"Retrofit everything"*: this project has shipped its README, its thirteen docs pages, its
store-style copy and its click-dummy words without a Story Bible, and the desktop app's UI copy is about to be
written. Law: `~/.claude/rules/storytelling-content.md`. The system is installed globally; nothing needs to be
built here except this project's own `docs/story/`.

**Cost, stated plainly.** The full panel is about ten dispatches per surface and roughly 1.3M tokens, because
every dispatch pays the whole fixed payload. That is why RW-091 groups pages into surfaces rather than treating
each of the thirteen docs pages as one.

### RW-090 - `/story-init`: the Story Bible (agent 1 session, then GATE 1)

- **What.** Discover from repo evidence (README, `docs/`, `CHANGELOG.md`, the design argument, the portfolio
  file), then an interview in small batches, producing `docs/story/story-bible.md` (eleven sections),
  `voice-fingerprint.md`, `decision-log.md` and `run-state.json`.
- **Acceptance points.**
  1. 🔴 **Before any file lands**, the docs repo's `exclude` carries `story/**` and its deploy workflow's sweep
     matches `*story-bible*`, `*decision-log*`, `*run-state*`, `*voice-fingerprint*`, `*content-map*` (done in
     the 2026-09-05 audit - verify it is still there). The CLI repo's CI already forbids `docs/` in the tarball.
  2. The voice runs the three-test uniqueness check against `~/.claude/story-system/registry/`; the slug is
     **`windowsweep`** (the palette-registry slug); the remote index is read before writing, because the
     registry has parallel writers. A collision is shown at GATE 1 with two differentiation proposals, never
     accepted silently.
  3. The Bible's raw material is what this product already is: a destructive tool that earns trust by naming
     every path first; the honesty rules (no undo for caches, it cannot promise a number); the developer-aware
     idle gate; zero network calls. The emotional palette must allow for **safety surfaces**.
  4. **Stop at GATE 1.** Only the owner's written approval advances it.
- **Do not.** Do not write any surface before approval; do not blend with another project's voice.

### RW-091 - The content map (agent half a session, then GATE 2)

- **What.** `docs/story/content-map.md`: one row per surface with awareness level, structure, tone band,
  length, CTA, schema and status, plus the SEO/AEO question map with answer-first sentences.
- **Candidate surfaces** (the map decides the final grouping; the count is what bounds the cost):

  | Surface | Notes |
  |---|---|
  | README | the elevator pitch; the anchor + TOC contract is fixed, the words are not |
  | `package.json` description + `WS_TAGLINE` + the docs-site tagline | one surface, three places that must agree |
  | The docs pages, grouped 4-5 ways | start here (intro, installation, quick-start) · safety (safety-model, developer-mode) · reference (sections, cli-reference, profiles, admin-and-elevation, reports-and-logs) · help (troubleshooting, faq) · about (author) |
  | `AI-INTEGRATION-GUIDE.md` | a machine-facing contract; voice applies to its prose only |
  | Docs-site intro + `llms.txt` | the site's own front door |
  | CLI console strings | prompts, walkthrough, menu, summary. 🔴 **ASCII-only** - the engine's IRON rule; no typographic quotes or dashes |
  | The desktop screens, grouped by regime | moment (Home, Run, Splash, Consent, Account, Elevation) · cockpit (Sections, Picker, History, Settings, Report) |
  | The desktop README + the docs site's `desktop.md` | written with RW-083 |

- 🔴 **Consent and elevation are safety surfaces**: humor off, no shame or urgency language, no claim about
  what the user's data is worth. So is any error state that costs the reader something.
- **Not surfaces:** `CHANGELOG.md` (factual record), the portfolio file (an owner record), social content (the
  notebook holds it by fleet rule), this file and the trackers (internal).
- **Stop at GATE 2.**

### RW-092 - `/story-write` per surface (agent 3-4 sessions, GATE 4 each)

- **What.** For each mapped surface: the writer, then the full panel (dev-editor -> writer revises ->
  line-editor -> copy-editor -> the four specialists in parallel -> the bible-keeper), at most two rounds, then
  the finalizer, then GATE 4.
- **Acceptance points.**
  1. A lint FAIL on `docs/story/drafts/*.md` is **fixed, not silenced**; a deliberate exception carries
     `<!-- story-lint: allow "..." -->` and a reason.
  2. 🔴 **The lint hook is blind to copy inside a code fence.** A slot-shaped surface (the CLI strings, later
     the `.tsx` copy) has none of its real words checked, so the fact-checker and the human reader are the only
     gate there. Say so in the packet; never read a green hook on such a surface as evidence.
  3. After GATE 4 the file in the CLI repo is edited, the docs site is **re-mirrored** (never patched
     directly), and the Pages run is watched.
  4. The CLI's gates stay green: the self-test's ASCII check [4] and the 151-check total are unaffected by a
     console-string change - re-run and quote it.
  5. The keeper records each approved surface into the Bible, the decision log and the global registry.

### RW-093 - The desktop copy, through the dummy (agent 1 session, GATE 4)

- **What.** The approved words for the eleven screens are written **into the click dummy's HTML first**
  (`~/.claude/rules/frontend-ui-standards.md` §10a: a divergence is written into the dummy, not only into a
  decisions log), the design README records why the dummy changed, and only then does RW-077 translate it.
- **Acceptance points.** Every capability whose wave has not shipped is declared in the dummy and exempted as
  `pending-wave` - the dummy specifies the finished product, never today's build progress. The four exemption
  classes are `prototype`, `demo-data`, `live-number`, `pending-wave` and no others.
- **Do not.** Do not change the dummy's layout in this item; do not edit app copy that the dummy does not carry.

**Recommended order for P6 + P7:** RW-073 -> RW-074 -> RW-075 (layout and behaviour settled) -> RW-090 ->
RW-091 -> RW-093 (the desktop words into the dummy) -> RW-077 -> RW-078 -> RW-079 -> RW-080 -> RW-081 ->
RW-082 -> RW-083, with RW-092's CLI and docs surfaces folded in wherever a session has room.

## 12. What "100%" looks like at the end

- Every sub-task in `docs/features/windowsweep-completion/00-tracker.json` is `complete`, or `blocked` on a
  named owner row, each with a commit SHA in `runHistory`.
- `npm view windowsweep version` equals `VERSION` on `main`; `git tag` lists every released version with a
  GitHub Release; the rulesets are unchanged.
- `windowsweep-docs.aoneahsan.com` answers 200 with HTTPS, is the `homepage` in `package.json`, the `Docs` link
  in the README and `WS_DOCS` in `lib/constants.ps1`, and serves a PNG social card.
- The self-test prints 151 or more checks green on Windows PowerShell 5.1 and PowerShell 7 in CI.
- `docs/PROJECT-CONTEXT.md` "Verified runs" records the elevated run, the Windows 11 run, the Scheduled Task
  run, the sections 4/5/7/8/17-19/23 runs and both `--notify` hosts.
- The portfolio file, the master links JSON entry and the ORCID work exist, agree, and are owner-reviewed.
- README, `docs/sections.md`, `docs/cli-reference.md`, `docs/profiles.md` and `lib/constants.ps1` describe the
  same sections, flags and tiers.
- `gh release view desktop-v1.1.0` lists the NSIS installer, the MSI, the `.sig` and `latest.json`; GATE 4
  screenshot pairs exist for all eleven screens at 1440 and 390; both desktop workflows are green.
- `docs/story/` holds an approved Story Bible, voice fingerprint and content map, every in-scope surface has
  passed GATE 4, and the voice is registered in `~/.claude/story-system/registry/`.

## 13. Effort estimate

| Phase | Agent sessions (3-4 h) | Owner time |
|---|---|---|
| P1 verification | 0.5 (folding in the findings) | about 3 h at the keyboard |
| P3 residue (RW-040, 043, 045) | 0.5 | 15 min (DNS + Pages) |
| P4 residue (RW-051, 055) | 0.25 | 15 min (JSON review, ORCID import) |
| P5 residue (RW-064, 065, 066) | 0.5 after the probe | 10 min (the probe) |
| P6 desktop (RW-073 to RW-083) | 6-7 | 30 min (Cloud Console rows; Build Tools done) |
| P7 storytelling (RW-090 to RW-093) | 4-5 | about 2 h across the gates |
| **Total** | **12-14 sessions** | **about 8 h** |
