# Project Context - windowsweep

Last Updated: 2026-09-05 (session 8)
Verified Against: commit 5f2bc84 on `main`, 2026-09-05 (session 8: the click dummy closed, both story gates cleared, the desktop app's foundation built; the 1.1.0 engine at 3c4d54e is unchanged since)

## Identity and outcome
- Purpose: safe, developer-aware disk and cache cleanup CLI for Windows; the Windows member of the family with
  `linux-cleanup` (Bash) and `macleanup` (Bash).
- Primary users: developers and power users on Windows 10/11 who want to see and control every deletion.
- Current status: **1.1.0 released** (2026-09-04) and equal to `main`: sections 0-25, the scripted-selection
  flags, the `--json` contract, 151 self-test checks. The documentation site is deployed; its domain waits on
  the owner DNS record. The desktop app design is approved (gates 1-3, 2026-09-05) and its code has not
  started. The storytelling retrofit (P7) has not started. `remaining-work.md` holds the specification and the
  tracker holds the status.
- Distribution: `npx windowsweep`, `npm install -g windowsweep`, or a clone run through `windowsweep.cmd`.
  No other channel (owner decision 2026-09-03).
- What is open, with evidence and acceptance criteria: `remaining-work.md` (root); status:
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
- Author block carries name, site, GitHub, LinkedIn and the public email only; no phone number (2026-09-03).
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
- The two repositories live side by side under `D:\work\windows-cleanup-root\` (`windows-cleanup` = the
  product, `windowsweep-docs` = the site). Owner decision 2026-09-05, asked which layout is durable: **"Keep
  this layout as is"** - the inner folder names do not change. The 2026-09-03 rename row is closed as
  superseded.
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

### Session 8 (2026-09-05, later the same day) - what was built and what it turned up

No new owner decisions were taken; this records what the session established, because two of the findings
change how a later session should read the tree.

**The desktop app has a foundation, and the promotion is one-directional and DONE.** `tokens.css`,
`shared.css` and `components.css` were copied from the click dummy into `desktop/src/styles/` on 2026-09-05.
🔴 **From that moment the app's copies are authoritative.** The dummy keeps its own as the design record; the
two are never synced, in either direction. The only edit made during promotion was the `@font-face` URL,
which moved from the dummy's relative `vendor/fonts/` to the app's served `/fonts/`.

**A correction found by reading the engine rather than assuming it.** The first version of the app's
selection path built `--select` as `<section>:<index>` groups. The engine's `--select` is nothing of the
sort: `lib/ui.ps1` -> `Read-MultiSelect` takes **1-based indexes against one prompt** and consumes the flag
as a **queue**, one value per interactive section in whatever order they happen to run. A front end using it
would have to predict both the ordering and the numbering the engine will produce. The app therefore writes
a **`--select-file`** of full paths, which the engine matches case-insensitively against whatever each prompt
actually offers and which reports a line that matches nothing. Recorded here because the wrong version looked
entirely plausible.

**The ten appearance axes now live in one file, `desktop/src/lib/axes.json`.** `theme.ts` reads it at runtime;
`scripts/gen-prepaint.mjs` reads it at build time and writes `public/prepaint.js`, the synchronous head script
that applies every axis before the body is parsed. 🔴 A generator rather than two hand-written copies, because
the pre-paint pass cannot be a module script (deferred, so it would flash) and the alternative to generating
is retyping the table where it can drift. `yarn check:prepaint` fails the build on drift and was watched
failing on a planted default change.

🔴 **Rust cannot be compiled on this machine, and the error does not say so.** `cargo fmt --check` runs and is
clean. `cargo clippy` fails at link time with `link: extra operand ...rcgu.o / Try 'link --help'` - because a
GNU coreutils `link.exe` precedes MSVC's on PATH, so Cargo invokes the wrong program entirely. It reads like a
Rust or Cargo bug. It is owner row 22, and `.github/workflows/desktop-ci.yml` is the only Rust evidence until
that UAC click.

**The storytelling pass reached GATE 4 for three surfaces and stopped there.** 375 numbered slots across the
eleven desktop screens; 331 kept as already on voice. 🔴 **Seven `NEEDS DECISION` items went to the owner,
and two of them concern copy already in the tree**: Home and Account state that there is no paid tier and
nothing to buy, which `~/.claude/rules/00-house-rules.md` forbids writing anywhere on the grounds that the
claim outlives the decision it describes. Until that is answered, those two sentences are the only thing in
the product carrying a known rule violation.

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
| 9b | No `<textarea>` in a shipped product | zero in any component. The one match in `src/styles/shell.css` is the rule's own comment |
| 11 | ONE theme control, applied pre-paint from one table | `src/lib/axes.json` is the single table; `public/prepaint.js` is GENERATED from it and `yarn check:prepaint` fails the build on drift |
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
`yarn sync:cli`, but only when that runs.

### Session 7 decisions (2026-09-05, the audit) - scope, the WIP commit, the layout, storytelling

Asked to audit the whole project and rewrite its records, the owner settled four questions. His answers,
verbatim, and what each one changed:

- **"Yes, include it"** - asked whether "100% feature-complete and production-ready" includes the desktop app,
  given that the 2026-09-03 decision had excluded it from the CLI percentage. So the headline number now
  covers the whole project (CLI, docs site, records, desktop app, storytelling); the narrower 2026-09-03 scope
  is still reported beside it, because that is the number the earlier records were written against.
- **"Commit as its own design commit"** - the previous desktop session left twenty-one files uncommitted
  (the eight A4 screens, their `page-*.js`, the contents index and the NAV wiring). They were committed as
  `2721b75` after a static check resolved 456 local links and every NAV href, and pushed before the audit
  commit, so the work could not be lost. This is the owner's explicit authorisation for a second commit in one
  prompt.
- **"Keep this layout as is"** - the two repositories now sit under `D:\work\windows-cleanup-root\` and the
  inner folder names stay. `MANUAL-TASKS` row 4 (rename to `windowsweep`) is closed as superseded.
- **"Retrofit everything"** - asked how the fleet storytelling rule applies to a project that shipped its
  README, thirteen docs pages and a click dummy without a Story Bible, he chose the full retrofit. Phase P7:
  `/story-init` and the Bible (GATE 1), the content map (GATE 2), then every product-voice surface through the
  pipeline - the README, the docs pages, `llms.txt`, the CLI console strings and the desktop copy, whose words
  are amended in the click dummy before the app is written.

He also directed the session split: **"make sure fable 5.1 save the whole implementation plan fully and
properly for opus 5, and once done stop"** - Fable wrote the handoff at
`C:\Users\PC\.claude\plans\please-audit-the-whole-streamed-nest.md` and stopped; Opus 5 executed it without
re-planning.

### Session 6 decisions (2026-09-05) - the dummy approved, both gates pre-authorised, downloads lifted

- **Click dummy GATE 1 approved.** Owner, verbatim: *"approved, looks great, get all remaining work fully
  done now"*. Direction 02 "Reclaim" is the desktop app's design language: the Reclaim Map treemap as the
  signature element, Archivo's width axis carrying hierarchy, the ten-axis pre-paint theme control, three
  treatments (lime 128 registered, sky 231, plum 320) in light and dark, and progressive disclosure so the
  default view stays short.
- **GATES 2 and 3 are approved IN ADVANCE.** Asked where to stop - at the gallery, at the finished dummy, or
  straight through - he chose **"Straight through to the app"**. This is the record that satisfies the
  click-dummy rule *"nothing is created under `desktop/` beyond `design/` until gate 3 is recorded"*; nothing
  else authorises it, and no later reader should infer the agent self-approved. He reviews the design once,
  translated into the app. **GATE 4 (parity) still closes only after the app exists.**
- **TASK-001 lifted in full.** Asked whether to lift the download gate, he chose **"Lift it fully"**: rustup
  plus Visual Studio 2022 Build Tools with the C++ workload (his UAC click, `MANUAL-TASKS` row 22), the
  `yarn install` trees for `desktop/` and `windowsweep-docs`, and `firebase-tools`. This supersedes the
  2026-09-03 directive *"for now do not download on this net please"* for this machine. `PENDING-TASKS.md`
  TASK-001 is closed to `docs/DONE-TASKS.md`.
- **What the lift does not change:** the CLI still makes zero network calls and its self-test still asserts
  it; no real (non `--dry-run`) cleanup and no admin section is ever run from an agent session; the Google
  OAuth desktop client (row 15) and the four telemetry keys (row 16) remain Cloud-Console clicks, so sign-in
  and analytics ship compiled and dormant until he provides them.

### Session 4 decisions (2026-09-04) - unverified target paths, and what follows 1.1.0

- **Unverified target paths: verified only.** A path becomes a target only once it has been seen on a real
  machine holding regenerable data, exactly as `remaining-work.md` requires. Anything unverifiable becomes a
  documented "candidate targets awaiting verification" table in `docs/sections.md`, plus one
  `docs/MANUAL-TASKS.md` row (20) carrying a paste-ready read-only probe the owner runs where those apps
  exist. The rows land in a follow-up release once he pastes the output. Consequences of that choice, all
  recorded rather than quietly absorbed: RW-064 and RW-065 shipped only their verified halves and stay
  `in_progress`; **section 26 was not created at all**, so the number is still free.
- 🔴 **`C:\Intel` was inspected and REJECTED, not deferred.** It exists on the build machine but holds
  `Thunderbolt`, `Logs` and a hidden `GfxCPLBatchFiles` - driver support content, not installer extraction
  leftovers. It will not become a target. This is exactly the failure the verification rule exists to catch:
  the path was in the specification, it exists, and clearing it would have been wrong.
- **After 1.1.0, continue straight into P6-A** on Opus - the design argument, the click dummy, the `desktop/`
  code and its CI workflows - with no review round in between.

### Session 5 decision (2026-09-04, later the same day) - the desktop UI direction

**Direction 01 of the desktop click dummy was REJECTED**, the same day it was delivered. His words, verbatim:

> *"about the desktop app the UI UX is very basic and not attractive at all, please plan and create a great
> UI UX for the desktop app, use click-dummy custom skill, create a new version, this one is rejected, i do
> not likeit at all"*

The page is archived byte-identical at
`desktop/design/windowsweep-click-dummy/_rejected/01-instrument-panel-2026-09-04/` with a five-point
post-mortem. The durable lesson, recorded because it will apply to the next design phase too:

- 🔴 **The design read is the decision that matters, and it was wrong.** windowsweep-desktop was read as a
  dashboard / trust-first surface and given VARIANCE 3-5 / MOTION 2-4 / DENSITY 7-8. It is a **premium
  consumer utility opened for two minutes a month**, where being impressive *is* the product. The correct
  dials are 7 / 6 / 3 on the moment screens, with cockpit density confined to the catalogue and the picker.
- 🔴 **The external design-craft set is mandatory before a design phase and was not copied.**
  `-design-process` and `-cloned-skills-library` were both skipped, and their omission is a *recorded* cause
  of this exact rejection elsewhere in the fleet. They now live in `.claude/skills/` (`EXTERNAL-SKILLS.md`).

**Direction 02, "Reclaim", now stands** and is at GATE 1: three screens x three treatments x light/dark,
a D3 treemap as the signature element, Archivo's width axis as the hierarchy device, a ten-axis pre-paint
theme control, and **zero network dependencies** - it opens by double-click, offline. Argument:
`desktop/design/README.md`. The registered hue (128, lime) was re-checked and kept; the hue was never the
problem. `info` is deliberately not declared as a semantic colour, and the accent/success separation is
22 degrees carried by chroma and a glyph, with the honest floor written into `tokens.css`.

### Session 3 decisions (2026-09-03) - the desktop app, downloads and telemetry

Recorded verbatim; they govern phase P6 and every session until the owner changes them.

- **Desktop account model.** *"implement auth, just so we can have user emails info, provide ability to store
  run results and settig etc and revert setting state when logged in, so actual features, but keep runs free,
  so they get best value"* -> the desktop app gets **optional Google sign-in for sync**: the account stores the
  user's email, settings and run history and restores settings on sign-in. **Runs are never gated, there is no
  paid tier and no plan set for this app** - an explicit owner exemption from the fleet plan-set rule, revisited
  only when he says so.
- **Toolchain downloads.** *"add that as pending task, i will ask you to download all that you need, and when i
  does, then please download and setup that part, for now do not download on this net please"* -> no toolchain
  or dependency-tree download happens on this machine until he gives the go-ahead: `PENDING-TASKS.md` TASK-001
  and `docs/MANUAL-TASKS.md` row 14. CI does every install and build that needs a dependency tree meanwhile.
- **Desktop telemetry.** Full fleet observability (GA4, Amplitude, Clarity and Sentry) in the desktop app,
  behind a first-run consent dialog with every provider off until accepted. **The CLI keeps its zero-network
  promise unchanged**; the desktop README, the docs site and the README disclose what the app sends.
- **Model workflow.** Fable 5.1 plans and reviews; Opus 5 executes the saved plan without re-planning. The
  Session 1 plan is `C:/Users/PC/.claude/plans/please-plan-and-get-agile-fairy.md`.

Derived from those decisions by the agent, under the standing rules:

- The desktop app lives in `desktop/` of this repository (the macleanup pattern), releases as `desktop-vX.Y.Z`
  with a `latest.json` updater manifest, carries the permanent identifier `com.aoneahsan.windowsweep`, and its
  version equals the CLI version it bundles.
- The admin surface for user emails is the Firebase console for this phase; a web admin panel is a later,
  separate phase. This is a recorded deviation from the fleet platform-admin rule.
- Registered palette: **primary hue 128 (lime)**, light accent `#4d7c0f`, dark accent `#a3e635` with dark
  on-accent text. The registry had no free 25-degree arc; 128 is 24 degrees from taxease (104) and wakalat
  (152), the widest gap available. Success moves to hue 158 so brand and success stay distinguishable. The logo
  mark keeps its sky-blue gradient. Free treatments: `sky` (231) and `plum` (320).
- Registered ports: 5972 (docs site start), 5973 (docs site serve), 5974 (desktop Vite dev URL).

## External records and registrations

- **FilesHub project id 60** (`slug: windowsweep`, public id `01M1M5FCY6TMM6KGC0W6GE79KY`), created 2026-09-03.
  Its credential vault is empty by design until phase P6 seeds the desktop app's Firebase and telemetry keys.
- **Palette registry:** primary hue **128** (lime), light `#4d7c0f`, dark `#a3e635` with dark on-accent text.
  Registered 2026-09-03 in `~/.claude/palettes/project-palettes.json`.
- **Dev ports:** 5972 (docs site start), 5973 (docs site serve), 5974 (desktop Vite dev URL), in
  `~/.dev-ports.json`.
- **Portfolio:** `apps/WINDOWSWEEP_portfolio-info_2026-09-05.md` in the notebook, with a byte-identical copy at
  this repository's root (outside the npm `files` allowlist). Refreshed to 1.1.0 by the 2026-09-05 audit; the
  master links entry reads `Published v1.1.0 (2026-09-04)` with `ownerReview` still empty (owner row 5).
- **ORCID:** `windowsweep.bib` (`aoneahsan-windowsweep-2026`) in the notebook's ORCID folder and appended to
  `aoneahsan-all-works.bib`; the import and the work-type retype are owner rows in that folder's
  `MANUAL-TASKS.md` (row 24).
- **Documentation site:** `aoneahsan/windowsweep-docs` at `D:\work\windows-cleanup-root\windowsweep-docs`,
  deployed to GitHub Pages and green. The domain
  `windowsweep-docs.aoneahsan.com` does not resolve yet; `package.json` `homepage`, the README links and
  `WS_DOCS` in `lib/constants.ps1` switch only after it probes 200.

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
  [13]-[17]. 151 checks in total (junction, dry-run, keep-newest, extension, catalogue and contract fixtures).
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

## Verified runs

### 2026-09-03 - safe batch, developer mode, not elevated (build machine, Windows 10 Pro for Workstations 19045)
- Drive C: free space 2,033,340,416 -> 25,746,153,472 bytes (+22.08 GB); the run's own report counted
  21,319,077,118 bytes in 11m 31s over 11 sections, plus about 1.5 GB removed by an interrupted first pass.
- Per section: 1 package caches 12.16 GB (yarn v1 alone 10.8 GB in 340,734 files idle 100+ days), 6 editors
  4.30 GB (incl. two uninstalled `openai.chatgpt` extension leftovers, 1.95 GB), 10 user temp 3.35 GB, 8 apps
  0.92 GB, 7 browsers 0.46 GB (Edge + Brave), 9 Windows caches 87 MB, 2 build tools 40 MB, 3 and 21 nothing.
- Skipped by design and left to the owner: Chrome (open), Slack and Granola (open), Docker (daemon not running),
  every admin section (not elevated), hibernation (15.9 GB, admin) - rows in `docs/MANUAL-TASKS.md`.
- Protected spot-check before/after: `.ssh` (4 files, newest mtime), Documents (90 files, newest mtime),
  Desktop, AVDs (2), Gradle wrapper dists (2), Android SDK, installed VS Code extensions (16) all unchanged;
  extension folders went 18 -> 16, exactly the two leftovers.
- The first real pass exposed a hot-path defect: the per-file protection check cost 10.6 ms (path resolution
  for ~70 subtrees plus 50 wildcard compiles per call), so 400k yarn files would have taken over four hours.
  The pass was stopped (every deletion is atomic), `Get-ProtectionReason` was rewritten over pre-normalized
  prefixes and precompiled `WildcardPattern` objects (0.58 ms/call, identical verdicts on 35 probe paths,
  self-test guards green), and the run restarted. Keep the guard table-driven; never reintroduce per-call
  path resolution there.

### Not yet run for real (P1 in `remaining-work.md`)
Sections 12-16 and 20 (elevation), `--elevate` itself, section 4 (no idle AVD), 5 (daemon off), 7 for Chrome,
8 for Slack and Granola, 17-19 (interactive), the weekly Scheduled Task, any Windows 11 machine, the `--pwsh`
path on a machine with PowerShell 7. Record each here with numbers when it happens.

## Release record
- 2026-09-03: `ac72188` (first commit, 72 files) and `70c6738` pushed to `main`; repo created public with
  `gh repo create`, Issues enabled, ruleset 22181256 "Protect main (PR + approval; owner bypass)" active
  (deletion, non-fast-forward, PR with 1 approval, required check `ci`; bypass = Repository admin). Direct
  owner pushes report `Bypassed rule violations for refs/heads/main` - expected, never `--force`/`--admin`.
- 2026-09-03T09:15:18Z: `windowsweep@1.0.0` published to npm by `aoneahsan` (37 files, 263,214 bytes
  unpacked; built from `70c6738`); verified with `npm view` and `npx -y windowsweep@1.0.0 --version` from a
  fresh cache.
- 2026-09-03: `5109557` (tracker close-out, real-run and publish records, WH001) and `84c732f` (the
  `Write-LogLine` rename that made CI green) pushed to `main`; not yet on npm.
- 2026-09-03T17:00Z: `windowsweep@1.0.1` published to npm by `aoneahsan` (38 files, 81.4 kB packed,
  273.1 kB unpacked; built from `edaa5cf`). The publish gate ran in full: clean pushed tree, CI green on both
  PowerShell hosts, registry at 1.0.0, tarball allowlist verified, a content-regression diff against the 1.0.0
  tarball (no file lost, `modules/self_test_extra.ps1` added), a smoke-install of the packed tarball into a
  temporary prefix (`--version`, `--list`, `--self-test` 114/114), then `npm view` = 1.0.1 and
  `npx -y windowsweep@1.0.1 --version` from `%TEMP%`.
- 2026-09-03: annotated tags `v1.0.0` (on `70c6738`, the commit the 1.0.0 tarball was built from) and `v1.0.1`
  (on `edaa5cf`) pushed, with a GitHub Release for each carrying its changelog entry. Every release from here
  on gets both.
- 2026-09-04T09:12Z: `windowsweep@1.1.0` published to npm by `aoneahsan` (44 files, 109.0 kB packed,
  365.6 kB unpacked; built from `3c4d54e`). The publish gate ran in full: clean pushed tree, CI run
  33856301415 green on both PowerShell hosts, registry at 1.0.1, tarball allowlist verified, a
  content-regression diff against the 1.0.1 tarball (**no file lost**; six added - the AI guide and the five
  new modules), a smoke-install of the packed tarball into a temporary prefix (`--version` 1.1.0, `--list`
  26 sections, `--self-test` 151/151), then `npm view --prefer-online` = 1.1.0 and
  `npx -y windowsweep@1.1.0 --version` from `%TEMP%`. Annotated tag `v1.1.0` on `3c4d54e` with a GitHub
  Release. 🔴 The `tar` on PATH here is Git Bash's, which reads `C:\...` as a remote host - the diff step
  uses `%SystemRoot%\System32\tar.exe` explicitly and refuses to compare fewer than 30 extracted files, so a
  failed extraction can never read as "nothing disappeared".
- Verify a published version from a directory OUTSIDE this repo: inside it, npx resolves the same-named local
  package and reports `'windowsweep' is not recognized` (`docs/troubleshooting.md`).

## Open material unknowns

- **None for the CLI, and none for the desktop app's design** - both were settled by the owner decisions
  recorded above. What is outstanding is owner *input*, not owner *decisions*: rows 15 (the Google OAuth
  desktop client id), 16 (the GA4 / Amplitude / Clarity / Sentry keys) and 22 (the Build Tools UAC click); the
  P1 verification runs (rows 1, 2, 3, 6, 7, 8, 9, 10, 19, 21); row 20 (the candidate-path probe that settles
  RW-064, RW-065 and RW-066); rows 11-12 (the docs DNS record and Pages HTTPS); rows 5 and 13 (the
  master-links review and the ORCID import); and the four storytelling gates as phase P7 reaches them.
