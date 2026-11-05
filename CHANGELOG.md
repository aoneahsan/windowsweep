# Changelog

All notable changes to `windowsweep` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [1.4.2] - 2026-11-05

### Added

- **Desktop tours.** Each main screen has **Tour this page** in the header. Its steps name the controls on that
  screen, skip any that are hidden in your current state, and close before a run starts. **Walk through
  windowsweep** shows the path from scan to report in seven screens captured from 1.4.1. Neither starts a
  cleanup or spends a real-run claim.

### Changed

- **The desktop app installs its updates.** When the update check finds a newer build, the app downloads it in the
  background and installs it when you close the window, so the next start is the new version. **Install and
  restart** still installs at once. A run in progress is never interrupted for an update.
- **An elevated run's log reaches the window as it is written.** The app watches the run folder instead of
  re-reading it every 0.7 seconds.

### Fixed

- **Release notices follow the newest record.** A notice the app stored no longer outranks a newer, lower release
  record, so a corrected release takes effect on the next check, and a record at or below the running version
  clears the notice.
- The command-line tool is unchanged in this release. It moves to 1.4.2 so the CLI and the desktop app stay on one
  version.

## [1.4.1] - 2026-11-03

### Fixed

- The desktop app now reads published release records on start, resume and reconnect. An urgent release blocks an older build immediately; a normal release is announced immediately and required from the next start. Its Update button uses the signed updater.
- Removed the desktop updater's six-hour network timer. Release broadcasts and lifecycle events trigger the checks.
- Corrected the package's release notes and documentation for section 19's Recycle Bin rule and section 26's permanent uninstall action.

## [1.4.0] - 2026-11-03

### Added

- **Section 26 - uninstall the programs you pick.** It lists the installed programs - never Windows parts,
  runtimes, drivers, hardware software, build kits or patches - and removes the ones you select with their own
  uninstaller, one at a time, silently where the uninstaller has a silent form (MSI, Inno Setup, NSIS, Chromium
  family, WiX bundles, winget, Docker Desktop, Qt, Adobe Creative Cloud, rustup) and in the vendor's own window
  otherwise. A program installed for all users needs an elevated run. After a real uninstall it offers the
  folders the program left for the Recycle Bin. `--yes` never selects here; `--select` or `--select-file` does.
- **Section 27 - folders uninstalled programs left behind.** It lists the top-level folders in Program Files,
  both Common Files and ProgramData that no installed program, service, driver, PATH or environment entry, Run
  entry, shortcut, scheduled task or running process still uses and that have been idle `--days`, and moves the
  ones you pick to the Recycle Bin. A folder inside a protected location is shown, never removed, and an
  unreadable registry offers nothing. Registered COM servers and type libraries count as use too (shared Office
  and ADO components live in Common Files and are registered only that way), and shared Microsoft folders,
  install caches and hardware-driver folders are never offered. It also lists environment entries that name
  something that no longer exists (report only). Administrator; it joins the elevated walkthrough.
- **`--json` candidates can carry a `label`.** Section 26's program candidates use the program's uninstall
  registry key as their `path` and its name as `label`; the folders it offers after an uninstall carry
  `leftover: <program>`.
- **Section 4 also clears what emulators leave behind.** It looks in every folder the emulator may keep AVDs in
  (`ANDROID_AVD_HOME`, `ANDROID_EMULATOR_HOME`, `ANDROID_SDK_HOME`, `ANDROID_PREFS_ROOT`), moves pointer `.ini` files
  whose AVD is gone to the Recycle Bin, and removes system images no remaining AVD uses - and the emulator once no
  AVD is left - with the SDK's own `sdkmanager`. An AVD whose settings name no image keeps every image, and a folder
  an interrupted SDK install left is named for you to remove.
- **`--browser-profile-roots "P1;P2"` (config `browserProfileRoots`) for section 7.** Folders holding test or
  automation browser profiles: section 7 clears the cache folders of each Chromium profile found in them, and skips
  a profile a running browser holds. Only those cache folders are opened up; the profiles stay protected.
- **`--temp-roots "P1;P2"` (config `tempRoots`) for section 10.** Folders you use as scratch space: each entry
  nothing wrote for `--temp-days` goes whole, unless a running program's command line names it.
- **Section 24 shows when each program last ran.** In an elevated run it reads Windows Prefetch and adds a RAN
  column; "none" means no run is on record. File names many programs ship (`uninstall.exe`, `update.exe`,
  `setup.exe`, crash handlers) never count, because Prefetch records a run by file name only.
- **Section 19 is now a data scanner: large or old personal files.** It lists files in Downloads, and in folders
  you add with `--personal-roots "P1;P2"` (config `personalRoots`), that are large (`--large-file-mb` or more, at
  any age) or old (untouched for `--days`, at any size) - each file once, with its reason, age and the timestamps
  that age came from. A folder is refused as a root when it is a drive root, your profile folder, inside Windows,
  Program Files, ProgramData or AppData, a link, or protected. Removal stays yours: exact files only, never by
  `--yes`, always the Recycle Bin - and a file that changed after the list was made, or is now reached through a
  link, is refused. File names and paths stay on your machine. `--json` candidates for section 19 add `reason`
  (`large`/`old`/`both`), `age_basis` (`write` or `write+access`), `modified`, `root` and `selectable` (with
  `skip_reason` and `index` 0 for a file that cannot be picked); the summary adds `personal_roots`.
- **Section 28 - superseded tool releases and old downloaded updates.** Tools that update themselves often keep
  every old release. This removes the superseded ones and keeps the release in use, any newer one and the newest
  older one; a release a running program uses is skipped. It covers Codex standalone releases, Electron updaters
  named without "@" (installers and pending updates idle 7+ days), Ollama's downloaded update and - in developer
  mode, with `--scan-roots` - Node versions no project asks for, removed with nvm itself. It joins `--all` and the
  `dev` and `deep` profiles.
- **Section 29 - Chrome's on-device AI model.** Chrome downloads a model of several GB and fetches it again if the
  folder is deleted. This sets the `GenAILocalFoundationalModelSettings` policy that stops the download; Chrome
  then removes the model on its next start, and the folder goes at once when Chrome is closed. Chrome shows
  "Managed by your organization" while the policy is set; the section prints the one-line undo. It is a deep,
  administrator section that no batch or profile runs.

### Changed

- **Idle age uses write time where last-access is live.** When nearly every file written a week or more ago
  was also "read" in the last day - an indexer, a backup, an antivirus or a disk scanner reading everything -
  last-access says nothing, and the idle gate used to keep every file. Each root is now sampled once; where
  last-access is live, idle age uses write and creation time, the log says so, and `--json` lists those volumes
  in `access_live_volumes`. Everywhere else the rule is unchanged. The sample walks on until it holds enough old
  files, so a folder of mostly new files - a busy temp folder - is judged on its own and the answer no longer
  depends on which section ran first.
- **More folders are protected roots.** Both Common Files folders and `ProgramData\Microsoft` can never be
  removed as a whole, whatever an installer registered as its own folder.

### Fixed

- **`--exclude-path` now also holds inside the tool's own exceptions.** An exception (the Android SDK temp
  folders, and from this release the superseded Codex releases) used to let a path through even when you had
  excluded it.
- **Section 23 no longer offers folders that still belong to something.** It offered the desktop app's own
  data folder, a Store app's data, an installed program known by its initials, and a tool running from its
  own folder. A reverse-DNS folder name (`com.vendor.app`) is now matched segment by segment, a shared vendor
  stem counts as a claim, a program of three or more words also claims its initials, and the folders in a
  running program's command-line paths count as claimed. The desktop app's install and data folders are
  protected outright.
- **`--json` is one line again on every run.** Section 12's Delivery Optimization step printed two lines to
  stdout ahead of the JSON document. Its words now go to the log, and the runner discards anything a section
  leaves on its output stream.

## [1.3.2] - 2026-09-28

No change to what is cleaned, how it is decided, or what is refused: the engine is 1.3.1's, file for file.
The version moves so the desktop app and the engine it bundles keep one number, and `desktop-v1.3.2` fixes
the app's Google sign-in.

### Changed

- **The version is 1.3.2, the desktop app's number.** The app bundles this engine and the two keep one number;
  the app's 1.3.2 fixes its Google sign-in. No section, target, flag or protection changed.

## [1.3.1] - 2026-09-25

No change to what is cleaned, how it is decided, or what is refused. This release names the team as the
tool's maker instead of one person, and points the web address it prints at the product's own site.

### Changed

- **The maker lines name the team.** The end-of-run line, the walkthrough and the usage header read
  *by the windowsweep team*; `--version` and the session log's header read `Author: The windowsweep team`.
- **The web address the tool prints is the product's own site**, `https://windowsweep.aoneahsan.com`,
  instead of a personal site: the `Web:` row of `--version` and `--feedback`, the session log's header and
  the walkthrough. The contact form lives there.
- **The report credits** keep their four keys and their string type, so a reader of `schema_version: 1`
  keeps working: `author.name` is `the windowsweep team`, `author.website` is the product's site, and
  `author.email` and `author.linkedin` are empty strings. A report written earlier keeps what it recorded.
- **The Email and LinkedIn rows of `--version` are gone**, and so is the email address in the usage
  header and the session log's header. The address stays where it is a contact channel: the crash message
  and `--feedback`.

### Fixed

- **The README's install-size row inside the 1.3.0 package** said 44 files and about 396 kB unpacked;
  that package held 46 files and about 400 kB, because the two files 1.3.0 split out were never counted.
  The row is measured from this package.

## [1.3.0] - 2026-09-17

No change to what is cleaned, how it is decided, or what is refused. This release moves one printed
address, splits two files that had grown past the project's own 500-line ceiling, and corrects the
version rows inside the published package.

### Changed

- **The documentation address the tool carries is now the documentation site**,
  `https://windowsweep-docs.aoneahsan.com`, instead of the README on GitHub. The site has served the
  same pages over HTTPS since 2026-09-12.
- **`lib/external.ps1`** takes `Invoke-External`, `Test-CommandPresent`, `Test-ProcessRunning`,
  `Test-IsAdmin`, `Test-CanElevate` and `Invoke-Elevated` out of `lib/safety.ps1`, which is back under
  500 lines. The deletion chokepoint stays where it was: running a process and raising privilege are a
  different job from refusing a path.
- **`modules/self_test_contract.ps1`** takes self-test group [18] out of `modules/self_test_extra.ps1`,
  same fixture, same checks. Both moves are verbatim, and each was watched failing on a planted defect
  before it was believed.
- **The self-test grew by the two new files**, because groups [3] and [4] check every engine file by
  name. No check was added, changed or removed - the suite is the same suite, counting one more file
  twice.

### Fixed

- **The README at-a-glance rows inside the published package** were stale at 1.1.0 through the 1.2.0
  cascade. They are correct here.

## [1.2.0] - 2026-09-08

### Added

- **`targets[].newest_write_utc` in `--scan --json`.** ISO 8601 UTC, the newest of write, access and creation
  time found anywhere under the target - the same rule the idle gate uses - or `null` when the target is
  absent or holds no files. It costs no extra walk: under `--json` the size pass already enumerates every
  file, so the timestamp comes out of that same enumeration. A human `--scan` keeps the faster path.
- **`protected` in `--list --json`.** `subtrees` (every protected folder, resolved for this machine) and
  `categories` (the same four sentences `--list-targets` prints). Both readers now take the category list
  from one constant, so the machine-readable copy cannot quietly promise less than the console does.
- **`excluded[]` in the `--json` summary**, naming every path an exclusion actually kept, once each.

### Changed

- **`--exclude-path` is honoured in every section, not only section 17.** It was parsed globally and read by
  exactly one consumer, so someone who excluded a folder was protected in one section and silently not in the
  other twenty-five. It is now enforced at the deletion chokepoint itself - the one place every section
  already passes through - and an excluded path is refused, logged as `excluded: <path>` and reported in
  `excluded[]`. The same reach applies to `excludePaths` in the config file. **No deletion behaviour widens:
  `--exclude-path` only ever refuses more.** A path that is both protected and excluded still reports the
  protected reason, because that is the promise no flag can lift.

### Fixed

- 🔴 **`--exclude-path` only ever refused the path you named, never anything inside it.** The normalised
  prefix was built with a PowerShell literal `'\'`, which is **two** characters, so the prefix ended in a
  doubled backslash and no child path could ever match it. Excluding a folder protected the folder and
  nothing in it - which is the opposite of what anyone excluding a folder means. The self-test check that
  was supposed to cover this asserted only on the excluded path itself, so it passed throughout; it now
  asserts on a child, and the fix was watched failing on the original bug reintroduced.
- 🔴 **A dry-run counted files a real run would skip.** `Remove-StaleFiles` applied the protection guard
  only in its real-run loop, so the rehearsal's estimate included protected and excluded files that the run
  then refused - for exactly the files a person most wants the two numbers to agree about. One filter now
  decides both, and a check proves a dry-run and a real prune report the same count and the same bytes.
- **`--help` said `--permanent` covers "Sections 18/19".** It reaches **18, 19 and 23**: `Send-ToRecycleBin`
  is called from `modules/personal.ps1` (18, 19) and from `modules/orphaned_appdata.ps1` (23). Someone who
  passed `--permanent` believing it applied to two sections would have had section 23's orphaned
  application data deleted outright instead of recycled. The reference docs already said 18, 19 and 23;
  only the engine's own help text - the one place a person actually reads it from - was wrong.
- **Section 22 declared `Dev = $true` with no behavioural branch**, so `--list --json` advertised a developer
  flag that changed nothing. It now reads `false`, and the Dev column in `docs/sections.md` agrees.
- 🔴 **`--scan` parsed `--developer` and `--not-developer` and then never read them.**
  `Resolve-DeveloperMode` ran only for the walkthrough, the menu, `--all` and `--only`, so in scan mode the
  flag reached `DeveloperFlag` and nothing looked at it: section 0 printed `Developer mode: not decided yet`
  whatever you passed, and `--json` returned `developer: null`. The desktop window sends those flags to
  `--scan` and could not read back the setting it had just sent. A scan now resolves it from the flag or the
  saved answer and stops there - it may not ask the question, may not write `config.json`, and may not invent
  a decision you never made, so with neither a flag nor a saved answer it still reports "not decided yet",
  which is the truth. **No scan result changes:** the scan reports what is on disk, not what a run would
  remove, and `Show-ScanTable` never read the developer answer in the first place.
- **The hibernation target's one-line note contradicted the section's own explanation two lines below.** It
  said `reduced` keeps Fast Startup "at roughly 40% of RAM", which is the size of the **whole** file; the
  section intro says `reduced` is about half of that. The note now states the figure once, on the thing it
  belongs to: the full file is about 40% of RAM and `reduced` keeps roughly half that.

## [1.1.0] - 2026-09-04

### Added

- **Section 22 - global packages audit.** Lists what npm, pnpm, yarn, bun and deno installed globally with
  size and idle days, flags the ones no recent project references, and prints the exact uninstall command.
  It never uninstalls anything and declares no deletable target: several of those roots are protected paths.
- **Section 23 - orphaned application data.** Top-level folders under `%APPDATA%` and `%LOCALAPPDATA%` that
  no installed program, Store package or running process claims and that nothing has touched for `--days`+
  days. Interactive, Recycle Bin, and it **fails closed** - an unreadable uninstall registry produces zero
  candidates rather than treating everything as orphaned. Every vendor folder another section already cleans
  is excluded automatically, derived from the declared target list so the exclusions cannot drift.
- **Section 24 - installed programs not modified for N+ days.** Report only, largest first, with
  `winget uninstall --id` when one `winget list` call resolves the program and its own `UninstallString`
  otherwise; Store apps listed separately. It never runs an uninstaller.
- **Section 25 - startup items audit.** Run and RunOnce keys, both Startup folders, logon-triggered scheduled
  tasks and `Win32_StartupCommand` in one table with each item's enabled state. It changes nothing.
- **`--select L` and `--select-file P`.** Answer an interactive section's selection in advance, by index or
  by full path. Either flag lets sections 17, 18, 19 and 23 run unattended - a person did choose - and the
  selection answers that section's final confirmation. `--yes` alone still selects nothing.
- **`--notify`.** A Windows notification when a run ends: a real toast on Windows PowerShell 5.1, a tray
  balloon on PowerShell 7. It never changes the exit code and never writes to stdout. `--install-task` adds
  it to the weekly task, so the Sunday run reports itself.
- **`--json` additions.** `candidates[]` (what an interactive section offered) and `targets[]` (what scan
  mode measured), both always present so a caller can rely on the shape, plus per-section progress lines on
  stderr: `##windowsweep section=NN event=start|end status=<status> freed_bytes=<n>`.
- **`--list --json`** prints the section catalogue - sections, tiers, batch policy, the safe batch, the
  profiles and the walkthrough order - so a front end reads it instead of hard-coding it.
- Section 1 gained the Hugging Face model cache (`~\.cache\huggingface\hub`, pruned by the idle gate,
  developer-gated). Section 9 lists `wsreset.exe` as the Microsoft Store cache lever and offers it as a next
  step rather than running it: `wsreset` has no silent mode and always opens the Store.
- Section 17 recognises `.nx`, `.mypy_cache`, `.ruff_cache`, `.tox`, `.eggs`, `.output` and `.serverless`,
  and treats `.cache` as an artefact only when a Gatsby or Parcel config sits beside it. `.venv`, `venv` and
  `.terraform` are deliberately still excluded.
- `docs/sections.md` records the candidate targets that are researched but **not** shipped because the
  software is not installed on the build machine, and why `C:\Intel` was inspected and rejected.

### Fixed

- `Get-OrphanExclusions` returned its exclusion set as an unrolled array, whose `.Contains` is
  case-sensitive, so a folder named `slack` would have slipped past the `Slack` entry. Found by a new check
  before the section shipped.
- Section 24's idle measurement used the newest of write, access and creation time. Last-access is live on
  many systems, so every install folder read as touched today and the section could never report anything;
  it now reads last-write only, which is what "not modified" means.

### Changed

- The target table is collected from the section catalogue instead of a literal `0..21` range, so a new
  section is reachable by `--scan`, `--list-targets` and the safety checks the moment it is declared. The
  menu's prompt range is derived the same way.
- Profile `audit` is now `0, 21, 22, 24, 25`. The three new report sections are read-only and safe, but stay
  out of `--all` so a cleanup run remains a cleanup run.
- Self-test: 27 more checks (151 total) cover the catalogue, section 23's fail-closed gate and derived
  exclusions, section 22 declaring nothing deletable, the scripted-selection flags, the `--json` and
  catalogue shapes, the progress-line format, the global-package verdict, the startup-state rule and the
  artefact list. Each was proved red against a planted defect before it was kept.
- Self-test: ten more checks cover the argument parser, section lists, docker size text, the layout-guard leaf
  test, the `--json` shape, superseded versions, the Chromium layout, workspace storage, stale artefacts and
  the report exporters. `Test-KnownCacheLeaf` and `Get-JsonSummary` were split out of `Invoke-TargetList` and
  `Write-JsonSummary` so the logic can be exercised directly; no behaviour changed.
- `AI-INTEGRATION-GUIDE.md` ships in the npm package and is mirrored on the documentation site: the contract
  an agent or a script relies on - the safe command sequence, what `--yes` never covers, exit codes, the
  `--json` line, output paths and the guarantees.
- A documentation site at `windowsweep-docs.aoneahsan.com` (Docusaurus on GitHub Pages), mirroring `docs/`.

## [1.0.1] - 2026-09-03

### Fixed

- **Sections 17, 18 and 19 no longer pre-select every item under `--yes`.** In the walkthrough and the menu
  with auto-yes on, section 17 could remove every listed build artefact without a person choosing one, and
  18/19 pre-selected everything before their final question. The selection prompt now appears even with
  `--yes`, defaults to none, and section 17's final confirmation is never auto-answered. Batch mode already
  refused these sections and is unchanged. (RW-002)
- Section 19's title no longer names Desktop; only Downloads is scanned. (RW-003)
- Sections 18 and 19 report the tier `recycle` instead of `permanent` in `--list`. (RW-004)
- `--purge-all` from a console asks you to type `purge` once per run, as documented; `--yes` remains the
  confirmation in batch runs. (RW-005)
- A running editor's VSIX download cache is cleared as documented: it is its own target without the
  running-editor guard. (RW-006)
- `--install-task` and `--install-alias` refuse to run under `npx` (exit 3) and print the global-install
  steps; the npx cache is evicted and the task or alias would break later. (RW-007)
- The engine exits 130 when a run is interrupted before it finished; previously only the Node launcher
  did. (RW-008)
- `--uninstall-data` always asks; `--yes` no longer removes your history unattended. (RW-010)

### Changed

- Internal rename `Write-Log` -> `Write-LogLine` (18 call sites) so PSScriptAnalyzer's
  `PSAvoidOverwritingBuiltInCmdlets` passes under PowerShell 7 in CI. No behaviour change.
- Self-test: four new checks prove the `--yes` asymmetry at the helper and at the section 17/18/19 call sites,
  and that every picker call in `modules/` carries `-NoAutoYes` (114 checks).
- Keywords trimmed to twelve (`temp-files` dropped). (RW-011)

## [1.0.0] - 2026-09-03

First release. The Windows member of the cleanup family beside
[linux-cleanup](https://github.com/aoneahsan/linux-cleanup) and
[macleanup](https://github.com/aoneahsan/macleanup).

### Added

- **22 numbered sections** (0-21): package-manager caches, build-tool caches, test-runner browsers, Android
  emulators, Docker, editor caches, browser caches, desktop-app caches, Windows user caches, user temp, Recycle
  Bin, Windows Update cache, the Disk Cleanup engine, DISM component-store cleanup, the hibernation file, event
  logs, stale project build artefacts, partial downloads, large stale personal files, disk-image compaction and
  a disk-usage report. Section numbers are a public contract from this release on.
- **Developer mode.** The first interactive run asks whether you are a developer. Yes means package, build and
  test-runner caches are pruned only when idle 100+ days and the newest version of every versioned tool cache
  is kept; no means those caches are cleared completely. The answer is saved and can be re-asked with
  `--forget-developer`.
- **A dry-run that writes nothing** (`--dry-run`), a read-only scan (`--scan`) and `--list-targets`.
- **One deletion chokepoint** that refuses drive roots, Windows, Program Files, the profile root, personal
  folders, credentials, toolchains and browser/editor state, asserts every deletion lies inside its declared
  target root, never follows junctions or symlinks, handles paths longer than 260 characters and skips files
  another program has open.
- **Batch policy.** `--all` runs the safe batch only; deep sections (11, 15, 16, 20) need
  `--i-understand-deep`; personal sections (17, 18, 19) never run unattended and use the Recycle Bin.
- **Admin awareness.** Admin sections skip with the exact command when not elevated; `--elevate` relaunches
  through a UAC prompt.
- **Session reports** as schema-versioned JSON with Markdown and HTML export, a reports manager, run history
  (`--stats`), history pruning and `--json` for scripting.
- **Weekly Scheduled Task** (`--install-task`) and a PowerShell profile alias (`--install-alias`).
- **Self-test** (`--self-test`): script syntax, ASCII-only source, the protection lists, a real junction
  fixture, the dry-run guarantee, keep-newest, long paths and the extension-leftover rule.
- **Crash bundles** written locally on unexpected exit; `--debug-bundle` and `--report-issue` for bug reports.
  Nothing is ever transmitted.
- Node launcher for `npx windowsweep`, a `.cmd` launcher for machines without Node, and a `ci` workflow that
  runs the self-test and a dry-run on both Windows PowerShell 5.1 and PowerShell 7.
