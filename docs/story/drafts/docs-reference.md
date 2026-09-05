# docs-reference — sections, CLI, profiles, elevation, reports

<!-- story-lint: allow "elevate" -->

Content-map row **5** · surfaces `docs/sections.md`, `docs/cli-reference.md`, `docs/profiles.md`,
`docs/admin-and-elevation.md`, `docs/reports-and-logs.md` · awareness **evaluating** · structure **reference
tables with a prose line per entry saying what it does not touch** · tone bands **P dominant, minimal R** ·
length **reference length** · CTA none · schema none.

Row 5 asks for one thing above all else, and it is not tone. Every entry gets a prose line saying what it
does **not** touch. That is the work. Eleven of the twenty-six section entries already carried such a line,
so the slots below split into the ones that add it and the ones that record it as already present and on
voice.

## What is out of scope, and why

The tables that are factual records of the engine's own vocabulary keep their cells: the section catalogue at
`sections.md` lines 7-34, the mode and option tables at `cli-reference.md` lines 13-67, the exit codes, the
environment variables, the config keys, and the `<stamp>` tree in `reports-and-logs.md`. Those are governed
by this repository's IRON rule 4 rather than by voice, and rewriting a cell there is how a documented
contract drifts from `lib/constants.ps1`.

Two cells are exceptions and are corrected, because they are factually wrong rather than merely terse. Both
are named at S-002 and S-003.

| File | Slot range | Count |
|---|---|---|
| §A `docs/sections.md` — the two table notes and the 26 entries | S-001 – S-033 | 33 |
| §B `docs/cli-reference.md` | S-034 – S-046 | 13 |
| §C `docs/profiles.md` | S-047 – S-053 | 7 |
| §D `docs/admin-and-elevation.md` | S-054 – S-063 | 10 |
| §E `docs/reports-and-logs.md` | S-064 – S-072 | 9 |
| **Total** | | **72** |

---

## §A `docs/sections.md`

### S-001 · sections.md:3-5 · the opener
```
Every cleanup operation lives in one numbered section. Numbers are a public contract: a section may be retired as a no-op, never renumbered. `windowsweep --list` prints the table; `--list-targets` prints every path each section can reach on your machine. Each entry below ends with what the section leaves alone.
```
**Was:** ... `windowsweep --list` prints the table; `--list-targets` prints every path each section can reach
on your machine.

**Change:** one clause added at the end. It is the page's contract with the reader, and row 5 is the reason
it exists: a reference entry that says only what a section removes leaves the evaluating reader to infer the
boundary. The clause tells them the boundary is stated rather than inferred, which changes how the rest of
the page reads.

### S-002 · sections.md:10-14, 26, 29 · the Batch column · the developer-gated cells
```
| 1 | Package-manager caches | rebuilds | - | safe, developer-gated |
| 2 | Build-tool caches | rebuilds | - | safe, developer-gated |
| 3 | Test-runner browsers | rebuilds | - | safe, developer-gated |
| 4 | Android emulators (AVDs) | slow | - | opt-in, developer-only |
| 5 | Docker | rebuilds | - | safe, developer-gated |
| 17 | Stale project build artefacts | rebuilds | - | interactive, developer-only |
| 20 | Disk-image compaction | config | admin | deep, developer-only |
```
**Was:** rows 1, 2, 3 and 5 read "safe, developer-gated"; row 4 read "opt-in"; row 17 read "interactive";
row 20 read "deep".

**Change:** three cells gain a marker, and it is a different marker on purpose. `Dev = $true` is set on
sections 1, 2, 3, 4, 5, 17, 20 and 22 in `lib/constants.ps1`, and `modules/runner.ps1` line 105 **skips 4,
17 and 20 outright** when the developer answer is no. That is not the pruning-versus-clearing behaviour
"developer-gated" describes, so a second term is needed rather than a fourth use of the first one.
`developer-only` says what happens. Row 22 is handled at S-003, because its case is different again.

### S-003 · sections.md:31 · the Batch column · section 22
```
| 22 | Global packages audit | report | - | safe, audit only |
```
**Was:** identical.

**Change:** none. This is a deliberate decision not to document a defect. Section 22 carries
`Dev = $true` in the catalogue, so `--list --json` exports `dev: true` for it. Nothing in the engine
branches on that flag for section 22, and the section reports the same list either way. Marking the cell
"developer-gated" would document a behaviour that does not exist; leaving it unmarked keeps the page honest
about the engine and leaves one row of `--list --json` unexplained by this table. **The flag is reported as a
catalogue defect** in this draft's findings, and `ai-guide` S-036 tells a machine caller how to read the
field without relying on it.

### S-004 · sections.md:36-38 · the note under the table
```
"Developer-gated" means the idle gate applies when the developer answer is yes and the cache is cleared completely otherwise. "Developer-only" means the section does not run at all when the answer is no ([Developer mode](./developer-mode.md)). Every section honours `--dry-run`. Tier `recycle` means the item goes to the Recycle Bin (`--list` shows `recycle`).
```
**Was:** "Developer-gated" means the idle gate applies in developer mode and the cache is cleared completely
otherwise ([Developer mode](./developer-mode.md)). Every section honours `--dry-run`. Tier `recycle` means
the item goes to the Recycle Bin (`--list` shows `recycle`).

**Change:** the second term is defined, since S-002 introduced it. "In developer mode" also becomes "when the
developer answer is yes", which is the same fact without the phrase that reads as a product mode a reader
might have to enable.

### S-005 · sections.md:42-45 · section 0
```
Read-only. Windows build, uptime, RAM, PowerShell version, elevation state (and whether the account can elevate), developer mode and detected tooling, a drive table with a warning under 10% free, `hiberfil.sys` size and hibernation state, page file, Docker/WSL disk images, WSL distros, startup-item count, Storage Sense, last-access tracking, and the running apps whose caches will be skipped. It changes nothing and declares no deletable target.
```
**Was:** the same list with no closing sentence.

**Change:** the closing sentence is added. "Read-only" opens the entry, which is good, and the row-5 line
makes it checkable: `Get-Targets00` in `modules/health.ps1` returns an empty array, so this section has
nothing the chokepoint could be asked to remove.

### S-006 · sections.md:49-53 · section 1
```
npm (`_cacache`, `_npx`, `_logs`), Yarn v1 and Berry, pnpm (`pnpm store prune` when pnpm is installed), bun, deno, pip, uv (`uv cache prune` first), poetry, Composer, NuGet (http/plugins/scratch caches and the global packages folder), Cargo registry and git checkouts, Go build and module caches, Dart/Flutter pub cache, Electron and node-gyp download caches, Scoop's installer cache. `--purge-all` clears everything (and runs `npm cache clean --force`).

Not touched: globally installed packages, `%APPDATA%\npm`, nvm, Volta, fnm, corepack, the pnpm global store, and the bun, deno, cargo and go binary folders. Those are protected subtrees, so this section could not reach them even if a target named one.
```
**Was:** ... Scoop's installer cache. Globally installed packages and version managers are protected.
`--purge-all` clears everything (and runs `npm cache clean --force`).

**Change:** the one-clause protection note becomes a named list, and it moves to the end where row 5 puts it.
"Globally installed packages and version managers are protected" is true and unverifiable by a reader.
Every name in the replacement is a protected subtree at `lib/safety.ps1` lines 37-38, so each one can be
checked against `--list-targets` on the reader's own machine. The last
sentence is the reason the note is a guarantee rather than a promise about this section's target list.

### S-007 · sections.md:57-61 · section 2
```
Gradle caches (idle files), wrapper distributions (keep newest), daemon logs older than 7 days and `.tmp`; Maven's local repository (idle files); Android SDK manager cache, build cache and download leftovers; Unity's cache; JetBrains IDE caches per IDE version, removed only when that whole version has been idle for the window; .NET telemetry storage. Idle Gradle daemons are stopped first so their files are not locked.

Not touched: the Android SDK itself, the JetBrains Toolbox, and your Gradle and Maven configuration. Only two paths inside the SDK are reachable at all - `.temp` and `.downloadIntermediates`, the SDK manager's download scratch.
```
**Was:** the same first sentence, with "(the Toolbox itself is protected)" inline after the JetBrains clause,
and no closing note.

**Change:** the inline parenthesis becomes the entry's row-5 line and gains two more names. The SDK detail is
the interesting one, and it is the only place in this documentation that the exception list from
`lib/safety.ps1` line 45 becomes visible next to the section that uses it. `docs-safety` S-007 states the same
two paths on the safety page; a reader who meets them here can find out why there.

### S-008 · sections.md:65-67 · section 3
```
Cypress versions, Playwright browsers (per browser family), Playwright-Go and Puppeteer downloads. The newest build of each family is always kept while the idle gate is running; a missing build is re-downloaded by the next `npx cypress install` or `npx playwright install`.

Not touched: anything under a Chrome-for-Testing folder, which the pattern list refuses by name so a real browser install is never mistaken for a test runner's copy.
```
**Was:** Cypress versions, Playwright browsers (per browser family), Playwright-Go and Puppeteer downloads.
The newest build of each family is always kept; older builds go once idle for the window. A missing build is
re-downloaded by the next `npx cypress install` / `npx playwright install`.

**Change:** two things. "Always kept" gains its condition, for the reason `docs-safety` S-017 sets out:
`--purge-all` and a "no" developer answer both replace the idle gate with a clear, and keep-newest goes with
it. And the row-5 line names a refusal a reader of this entry would not guess: `*chrome-for-testing*` and
`*\Chrome for Testing*` are both in the pattern list at `lib/safety.ps1` line 50.

### S-009 · sections.md:71-73 · section 4
```
Each `.avd` folder plus its `.ini` is one unit, removed only when nothing inside it changed for the window (booting an emulator updates its files). Skipped while an emulator is running, and skipped entirely when the developer answer is no. Not part of `--all`; run it with `--only 4 --yes` or from the walkthrough.

Not touched: the Android SDK, the emulator binaries, and any AVD that changed inside the window. An image removed here is recreated in Android Studio, which takes minutes rather than seconds - that is why this section is its own tier.
```
**Was:** ... Skipped while an emulator is running. Not part of `--all`; run it with `--only 4 --yes` or from
the walkthrough.

**Change:** the developer-answer behaviour is added to match S-002's new marker, and a row-5 line closes the
entry. The cost sentence belongs here rather than only in the tier table, because this is the page a reader
consults before naming section 4 in `--only`.

### S-010 · sections.md:77-80 · section 5
```
Needs the Docker CLI and a running daemon. Developer mode: `docker image prune -f` (dangling layers), `docker builder prune --filter until=<N days>`, `docker image prune -a --filter until=<N days>` (images no container uses, older than the window). Developer mode off or `--purge-all`: `docker system prune -a -f`.

Not touched: volumes, in any mode. Containers are not removed either, and the disk image itself only shrinks through section 20.
```
**Was:** ... Developer mode off or `--purge-all`: `docker system prune -a -f`. Volumes are never touched. The
disk image itself only shrinks through section 20.

**Change:** the two existing refusals are grouped into the row-5 line and one is added. Containers are worth
naming because `docker system prune -a -f` is the command most likely to make a reader wonder, and it removes
stopped containers - which are Docker's business rather than a path this tool reaches. Volumes staying is the
first thing a Docker user checks, so it goes first and gets its own sentence.

### S-011 · sections.md:84-89 · section 6
```
VS Code, VS Code Insiders, VSCodium, Cursor and Windsurf: `Cache`, `CachedData`, `CachedProfilesData`, `CachedExtensionVSIXs`, `Code Cache`, `GPUCache`, Dawn caches, service-worker caches, crash reports, logs older than 7 days, `workspaceStorage` entries whose folder no longer exists, and extension folders the editor's own `extensions.json` does not reference (uninstalled or superseded versions). Visual Studio's ComponentModelCache, designer shadow cache, AppInsights and SQM logs. A running editor is left alone except for its VSIX cache and old logs.

Not touched: `settings.json`, `keybindings.json`, snippets, `globalStorage`, local `History`, and any extension folder `extensions.json` still references. Each of those is in the pattern list, and every folder this section resolves must also pass the known-cache-leaf allowlist in `lib/actions.ps1` before it can be removed.
```
**Was:** the same first three sentences, with no closing note.

**Change:** a row-5 line for the entry a reader is most nervous about, because an editor holds settings a
person spent years accumulating. The five protected names are in `lib/safety.ps1` line 58. The second sentence is the second guard.
`docs-safety` S-013 documents it in full. An editor target is one of four layout kinds it applies to,
alongside Chromium, Firefox and Electron.

### S-012 · sections.md:93-96 · section 7
```
Chrome (stable, Beta, Dev, Canary), Edge, Brave, Vivaldi, Opera and Opera GX, Chromium, Arc, Firefox, LibreWolf and Waterfox. For every profile: `Cache`, `Code Cache`, `GPUCache`, shader and Dawn caches, the service-worker script cache; at the root: shader caches, Crashpad reports, SwReporter. A browser that is open is skipped entirely.

Not touched: profile folders as a whole, Local Storage, Session Storage, IndexedDB, cookies, `Login Data`, `Web Data`, bookmarks, history, sessions, extensions, extension state, Sync Data, preferences, and the PWA CacheStorage. On Firefox: `places.sqlite`, `key4.db`, `logins.json`, `cookies.sqlite`, `prefs.js` and the profile `storage` folder. Signing out of nothing is the test this section is written to pass.
```
**Was:** the same first three sentences, plus "Profile data is never touched." after the second one.

**Change:** "Profile data is never touched" becomes the list it stands for. Thirty-four of the 50 patterns
in `lib/safety.ps1` are browser profile state - twenty-seven Chromium at lines 51-57, seven Firefox at lines
60-61 - and naming them is the difference between a claim and a checkable one, on the entry a reader arrives
at asking whether this will log them out. The closing sentence is the reader's own
test, stated in their terms.

### S-013 · sections.md:100-104 · section 8
```
Discord (and Canary/PTB), Slack (installer and Store), Teams classic and new, Zoom logs, Spotify's streaming cache, Postman, Figma, Notion, Signal, Skype, GitHub Desktop, Obsidian, the Claude desktop app, Linear, Granola, Insomnia, Steam and Epic web caches and logs, Adobe media caches (idle files), OBS logs and crash reports, Squirrel installer temp, pending Electron updater downloads older than 7 days, and superseded Squirrel `app-x.y.z` versions (Discord, Postman, Figma, GitHub Desktop, Slack). Running apps are skipped.

Not touched: the current version of any Squirrel app, Store-app `LocalState`, `Settings` and `RoamingState`, and anything a running process holds open. Signal's and Obsidian's own data are outside the cache folders this section names, so a message history or a vault is never in scope.
```
**Was:** the same first two sentences, with no closing note.

**Change:** a row-5 line naming three refusals, the second of which is a pattern in `lib/safety.ps1` line 49.
Signal and Obsidian are singled out because they are the two apps in that long list whose data a reader would
most regret, and because the honest answer is about folder layout rather than a special case.

### S-014 · sections.md:108-112 · section 9
```
INetCache, the user Windows Error Reporting queue, crash dumps older than 7 days, DirectX / NVIDIA / AMD / Intel shader caches, the Remote Desktop bitmap cache, OneDrive logs, Store-app `TempState`, `AC\Temp` and `AC\INetCache`, themes' cached files, PowerShell startup profile data, CLR usage logs, Explorer's thumbcache/iconcache leftovers and startup logs, the schema cache, per-user Delivery Optimization cache, the certificate URL cache, diagnostics results older than 30 days, and `ipconfig /flushdns`.

Not touched: your OneDrive folder, which is a protected pattern - only OneDrive's log files are in scope. Nor Prefetch, which Windows uses to start programs faster; clearing it makes the machine slower for a while and frees little.
```
**Was:** the same list, with no closing note.

**Change:** a row-5 line. The entry needs one, because its first word is `INetCache` and its sixth item is
`OneDrive logs`. A reader scanning that list will stop at OneDrive, and the distinction between a log file and
the synchronised folder is the one they need. Prefetch is named because it is the only Windows cache a reader
might expect this section to clear, and the reason it does not is a fact about Windows rather than a policy.

### S-015 · sections.md:116-117 · section 10
```
`%TEMP%`, `%TMP%`, `AppData\Local\Temp` and `AppData\LocalLow\Temp`: files idle `--temp-days`+ days (default 3), then empty folders. Files a running program holds open are skipped.

Not touched: anything written in the last three days, which is the default window and is deliberately short here rather than 100 - a temp file is temporary by contract.
```
**Was:** the same first two sentences, with no closing note.

**Change:** a row-5 line explaining the one number on the page that differs from every other idle window.
`--temp-days` defaults to 3 in `lib/config.ps1`, against `--days` at 100, and a reader who has read the rest
of the documentation will assume a typo unless the entry says otherwise.

### S-016 · sections.md:121 · section 11
```
`Clear-RecycleBin -Force` on every drive after a separate confirmation. Permanent. Deep-gated.

Not touched: nothing is spared. This is the one section whose whole purpose is to remove what the Recycle Bin was holding for you, including anything sections 18, 19 and 23 put there. It asks a question of its own, and `--yes` does not answer it.
```
**Was:** `Clear-RecycleBin -Force` on every drive after a separate confirmation. Permanent. Deep-gated.

**Change:** the row-5 line, and it is the only one on the page that has nothing to list. Saying so plainly is
better than omitting the line, because a reader working down the page has learned to expect one. The middle
sentence is the fact that makes the section dangerous in a way its own name does not convey: it empties the
undo that three other sections rely on. Verified against `modules/windows_user.ps1` lines 105-118, where the
confirmation uses `Confirm-Ui` with a typed default of `n`.

### S-017 · sections.md:125-128 · section 12
```
Stops `wuauserv` and `bits`, clears `SoftwareDistribution\Download`, restarts them; runs `Delete-DeliveryOptimizationCache`; prunes `C:\Windows\Temp` and the service-profile temp folders by `--temp-days`; CBS, DISM and Windows Update logs older than 30 days; live kernel reports older than 7 days; the system Windows Error Reporting queue, archive and temp.

Not touched: installed updates, the ability to uninstall them, `Windows\servicing`, `Windows\Installer` and WinSxS. This section removes downloaded installers Windows has already applied, so the next update check re-downloads what it needs.
```
**Was:** the same list, with no closing note.

**Change:** a row-5 line, and the first item on it is what an evaluating reader actually fears about a
Windows Update section, which is losing the ability to roll an update back. That capability lives in WinSxS
and `Windows\Installer`, both protected subtrees, and it is removed only by section 14 with `--reset-base`.
The last sentence prices it. What this section costs is a re-download, and saying so is more use to an
evaluating reader than the reassurance above it.

### S-018 · sections.md:132-139 · section 13
```
Runs `cleanmgr /sagerun:77` with a curated handler list of 25: Temporary Files, Temporary Setup Files, Internet Cache Files, Setup Log Files, Windows Upgrade Log Files, Update Cleanup, Delivery Optimization Files, Thumbnail Cache, D3D Shader Cache, System error memory dump files, System error minidump files, Windows Error Reporting Files, Previous Installations, Old ChkDsk Files, Content Indexer Cleaner, Device Driver Packages, Downloaded Program Files, Offline Pages Files, Diagnostic Data Viewer database files, BranchCache, RetailDemo Offline Content, Windows Defender, Active Setup Temp Folders, Temporary Sync Files, Upgrade Discarded Files. The registry flags are removed afterwards. Cleanmgr cannot report a size in advance, so the dry-run lists the handlers only.

Not touched, and never enabled in the list: DownloadsFolder, Recycle Bin, User file versions, Windows ESD installation files, Language Pack. Those five are the handlers a Disk Cleanup run is most often blamed for, and windowsweep does not switch them on.
```
**Was:** the same paragraph with a 22-phrase list that omitted `Internet Cache Files`, wrote "Setup and
Upgrade logs" for two handlers and "System error memory dumps and minidumps" for two more, put the "never
enabled" five inline mid-paragraph, and ended "Cleanmgr cannot preview sizes".

**Change:** the list is reconciled against `WS_CLEANMGR_HANDLERS` in `modules/system_admin.ps1` lines 71-78,
which declares **25** handlers. The old prose named 24 of them: two pairs were collapsed into one phrase
each, which is defensible, and **`Internet Cache Files` was missing altogether**, which is not. That handler
is the legacy Internet Explorer and Edge cache, and it is the one a reader might specifically want to know
about, because it overlaps section 9's `INetCache`. Every handler is now written with the name the registry
uses, so a reader can match the page against the `HKLM:\...\VolumeCaches` key on their own machine and
confirm that the list printed here is the list the tool actually switches on. The count is stated so the
next reader can check it in one glance. The five never-enabled handlers become the row-5 line.

### S-019 · sections.md:143-144 · section 14
```
`Dism /Online /Cleanup-Image /AnalyzeComponentStore` (read-only) then `/StartComponentCleanup`. Slow. Opt-in, so `--all` never includes it even on an elevated console.

Not touched by default: the ability to uninstall installed updates. `--reset-base` removes exactly that, which is why it is a separate flag rather than the default.
```
**Was:** `Dism /Online /Cleanup-Image /AnalyzeComponentStore` (read-only) then `/StartComponentCleanup`. Slow,
safe. `--reset-base` adds `/ResetBase`, which also removes the ability to uninstall installed updates.
Opt-in.

**Change:** "safe" goes, being the adjective this voice replaces with the refusal underneath it - and the
refusal is that the default leaves rollback intact. The `--reset-base` consequence moves into the row-5 line
where it reads as the price of a flag rather than as a footnote. "Opt-in" gains its consequence, because
`WS_SAFE_BATCH_ADMIN` is `@(12, 13)` and a reader could reasonably assume all three admin cache sections join
`--all` when elevated. They do not.

### S-020 · sections.md:148-150 · section 15
```
`hiberfil.sys` is about 40% of RAM. `--hiberfil off` removes it (`powercfg /hibernate off`): Sleep still works; Hibernate, Fast Startup and hibernate-on-critical-battery do not. `--hiberfil reduced` keeps Fast Startup at a smaller file. `keep` leaves it. Interactive runs ask; batch runs need the flag. Deep-gated.

Not touched by windowsweep directly: the file itself. `hiberfil.sys` is a protected file name, so only `powercfg` ever removes it, and `powercfg /hibernate on` puts it back.
```
**Was:** the same paragraph with no closing note.

**Change:** the row-5 line, and it is the most reassuring one on the page. `hiberfil.sys` is in the protected
basename list at `lib/safety.ps1` line 64, so the chokepoint refuses it outright and the section works by
asking Windows to release it. The reversal command is in the same sentence, which is where a reader deciding
about this section wants it.

### S-021 · sections.md:154 · section 16
```
`wevtutil cl` for every log. Permanent loss of troubleshooting history. Deep-gated.

Not touched: the log configuration, the channels themselves and their sizes. What goes is the recorded events, and nothing puts them back - which is why this and section 11 are the only two sections in the permanent tier.
```
**Was:** `wevtutil cl` for every log. Permanent loss of troubleshooting history. Deep-gated.

**Change:** the row-5 line. `wevtutil cl` clears a channel's records without removing the channel, and that
distinction is worth one sentence on the page a reader consults before running it. The cross-reference to the
tier is there because two sections is a small enough number to state, and it tells the reader the permanent
tier is a short list rather than an open category.

### S-022 · sections.md:158-165 · section 17
```
Scans project roots (auto-detected folders such as `~\source\repos`, `~\Projects`, `~\code`, `D:\work`, or `--scan-roots "P1;P2"`) for `node_modules`, `dist`, `build`, `out`, `.next`, `.nuxt`, `.turbo`, `.vite`, `.svelte-kit`, `.astro`, `.parcel-cache`, `target`, `vendor`, `coverage`, `.nyc_output`, `__pycache__`, `.pytest_cache`, `.dart_tool`, `.angular` and `bin`/`obj` beside a `.csproj`. A folder is listed only when its parent looks like a project and the project's source files have been idle for the window. You select what goes. Writes `stale-builds-<stamp>.txt` even in dry-run. Interactive only. `--yes` never selects here: the prompt appears even with `--yes`, Enter selects nothing, and the final question is never auto-answered.

Not touched: a whole drive or your profile root, both of which it refuses to scan; `.git`, AppData and toolchain folders, which it never enters; source files of any kind; and anything you do not tick. Skipped entirely when the developer answer is no.
```
**Was:** the same first paragraph with "Refuses to scan a whole drive or the profile root; never enters
`.git`, AppData or toolchain folders." sitting mid-paragraph before the `stale-builds` sentence.

**Change:** the existing refusals move. Two more join them, and "source files of any kind" is the one
worth stating on a section that reads a project in order to decide whether its build output has gone stale,
because that is precisely the fear the entry creates. "Anything you do not tick" restates the selection guarantee in the reader's
words rather than in `--yes` terms. The developer-answer sentence matches S-002's new marker.

### S-023 · sections.md:169-171 · section 18
```
`.crdownload`, `.part`, `.partial`, `.fdmdownload`, `.opdownload`, `.!ut`, `.aria2`, `.download`, `.bc!` and `.tmp` files in Downloads (4 levels deep). You select; selected files go to the Recycle Bin. Interactive only; `--yes` never selects and never answers the final question.

Not touched: finished downloads, anything outside your Downloads folder, and anything more than four levels below it. A `.tmp` file that is part of a download in progress will be listed - close the download manager first, or leave it unticked.
```
**Was:** the same first paragraph with no closing note.

**Change:** the row-5 line, and its last sentence is the entry's honest limitation. This section matches by
extension rather than by asking a download manager what is live, so a resumable download's scratch file can
appear in the list. Saying so is the difference between a reader losing a partial download and a reader
leaving a box unticked.

### S-024 · sections.md:175-177 · section 19
```
Files of `--large-file-mb`+ MB (default 100) in Downloads that nothing touched for the window, largest first. You select; selected files go to the Recycle Bin (`--permanent` deletes instead). Interactive only; `--yes` never selects and never answers the final question.

Not touched: anything outside Downloads, anything under the size threshold, and anything touched inside the window. It never looks at Documents, Desktop or Pictures, which are protected subtrees the chokepoint refuses whatever this section declares.
```
**Was:** the same first paragraph with no closing note.

**Change:** the row-5 line names the three filters and then the three folders. The second sentence is the one
that matters: a section called "large stale personal files" invites exactly one question, and the answer is a
protected-subtree refusal rather than a scoping decision this section makes.

### S-025 · sections.md:181-183 · section 20
```
Lists Docker Desktop and WSL `.vhdx` files, stops Docker Desktop and runs `wsl --shutdown`, then `diskpart` `compact vdisk` on the ones you select. A virtual disk grows with writes but never shrinks on its own; compaction returns the free space to Windows. Restart Docker Desktop afterwards. Deep-gated, and skipped entirely when the developer answer is no.

Not touched: the contents of the disk image. Compaction reclaims blocks the filesystem inside the image has already released, so no container, image, volume or WSL file is removed. What it does cost is every running container and distro, because both are stopped first.
```
**Was:** ... Restart Docker Desktop afterwards. Deep-gated.

**Change:** the developer-answer behaviour is added to match S-002, and the row-5 line answers the question a
reader has about the word "compaction". Nothing inside the image goes, which is the reassurance, and both
Docker and WSL are stopped, which is the cost. Stating them in that order and in one entry is what row 5 asks
for.

### S-026 · sections.md:187-189 · section 21
```
Read-only: drive table, hibernation file, disk images, and the 20 largest entries of your profile, `AppData\Local`, `AppData\Roaming` and the system drive root, with protected entries marked. Writes `disk-usage-<stamp>.txt`.

Not touched: anything. This section declares no deletable target and exists to tell you where the space went, including inside folders no section will ever clear.
```
**Was:** the same first two sentences with no closing note.

**Change:** the row-5 line, whose second half is the point of a read-only report next to a deletion tool: it
tells the truth about space this product cannot reclaim. The "20 largest" figure was checked -
`modules/disk_usage.ps1` line 41 passes `-Top 20`.

### S-027 · sections.md:193-205 · section 22
```
Read-only. Lists what `npm`, `pnpm`, `yarn`, `bun` and `deno` installed globally, with each package's version, size and how long it has been since anything touched it, then prints the exact uninstall command for the ones nothing seems to need. **It never uninstalls anything**, in any mode - several of these roots (`nvm4w`, `AppData\Roaming\npm`, `pnpm\global`, `.bun`, `.deno\bin`) are protected paths the tool refuses to delete from, so the section declares no deletable target at all.
```
**Was:** identical.

**Change:** none. This entry already carries its row-5 line, and it carries it in the strongest available
form: the section cannot delete because the paths are refused, rather than because the code chooses not to.
The two paragraphs after it (the three-condition candidate rule and the "Windows keeps no record of when a
command last ran" note) are also unchanged and are the most honest sentences on the page.

### S-028 · sections.md:209-228 · section 23
```
Interactive only. Top-level folders under `%APPDATA%` and `%LOCALAPPDATA%` that no installed program claims and that nothing has touched for `--days`+ days - what an uninstaller left behind. You select what goes and it lands in the **Recycle Bin** (`--permanent` deletes instead). `--yes` never selects here; `--dry-run` lists and removes nothing.

This is not an audit. Sections 22, 24 and 25 report and delete nothing; this one asks you to pick, row by row, and what you pick is removed.
```
**Was:** the same first paragraph, with no second one.

**Change:** two sentences added, and they exist because this section was described as a read-only audit in
the README until this morning. That was corrected there. The same misreading is available to anyone who
scans this page's table, sees three `report`-tier audit rows and a fourth interactive row in the same
1.1.0 batch, and infers wrongly. The three paragraphs that follow in the file - the claim rule, the
fails-closed guarantee and the never-offered list - are unchanged and already do row 5's job thoroughly. The
`68 AppData folders` figure in the fails-closed area was checked against self-test check [15], which printed
`section 23 excludes all 68 AppData folder(s) other sections already clean`.

### S-029 · sections.md:232-241 · section 24
```
Read-only. Reads the three uninstall hives and lists non-system programs, largest first, whose files under their install location have not been modified for `--days`+ days, each with the command that removes it - `winget uninstall --id <id>` when one `winget list` call resolves it, otherwise the program's own `UninstallString`. Store apps are listed separately with `Remove-AppxPackage` hints. **It never runs an uninstaller.**
```
**Was:** identical.

**Change:** none. The bold sentence is the row-5 line and it is in the right place. The paragraph after it -
"not modified", not "not used", because Windows keeps no reliable last-launched record - is the kind of
limitation the Bible puts beside the claim rather than in an appendix, and it is already there.

### S-030 · sections.md:245-248 · section 25
```
Read-only. One table of everything that launches at sign-in or boot: `Run` and `RunOnce` under HKCU, HKLM and `WOW6432Node`, both Startup folders, scheduled tasks with a logon trigger, and `Win32_StartupCommand`, each marked enabled or disabled. **It changes nothing** - the tool shows them, you change them in Task Manager > Startup, where you can undo it.
```
**Was:** identical.

**Change:** none. It says what it does not do, and then where the reader should go instead, and that the
place it sends them has an undo. Three facts, no adjectives.

### S-031 · sections.md:255-259 · the candidate table's lead-in
```
A path becomes a target only once it has been seen on a real machine holding only regenerable data. These are researched but **not shipped**, because the software is not installed on the build machine and a guessed path is exactly what this rule exists to prevent. Each will be added once its folder can be confirmed.
```
**Was:** identical.

**Change:** none. This paragraph is the clearest statement of the product's stance anywhere in the
documentation, and it is on a reference page rather than in the pitch. Leave it.

### S-032 · sections.md:272-274 · the rejected candidate
```
**`C:\Intel` was inspected and rejected.** It exists on the build machine but holds `Thunderbolt`, `Logs` and a hidden `GfxCPLBatchFiles` - driver support content, not installer extraction leftovers. It will not become a target.
```
**Was:** identical.

**Change:** none, and it is worth saying why a rejected candidate is kept on a reference page. It records a
decision with its evidence, so the next person who notices `C:\Intel` taking up space does not re-open it.
That is what a frozen contract needs from its documentation.

### S-033 · sections.md:276 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-04

**Change:** the date moves with the corrections above it.

---

## §B `docs/cli-reference.md`

### S-034 · cli-reference.md:7-9 · the lead-in
```
The flags are identical through `npx windowsweep`, the global `windowsweep` command, `windowsweep.cmd` and `powershell -File windowsweep.ps1`. With no mode, the guided walkthrough starts. Modes marked with a fire mark delete files, subject to every guard in the [safety model](./safety-model.md). Everything unmarked reads and reports; two of them, `--scan` and `--list-targets`, are the ones to run first.
```
**Was:** ... Modes marked with a fire mark delete files (subject to every guard in the
[safety model](./safety-model.md)).

**Change:** the parenthesis is unwrapped and one sentence is added. A reference page that marks the
destructive modes should also say what the unmarked ones are, because a reader scanning a 21-row table for a
place to start will otherwise count fire marks and stop. Naming the two read-only modes is row 5's line
applied to the table as a whole.

### S-035 · cli-reference.md:69 · the inline-value note
```
Options may also be written `--days=30`.
```
**Was:** identical.

**Change:** none. Six words for a parsing rule.

### S-036 · cli-reference.md:70 · NEW · what the option table does not cover
```
No flag on this page changes which paths windowsweep may reach. `--purge-all` changes how much of a cache goes, `--select` and `--select-file` name items inside what a section already offers, `--permanent` swaps the Recycle Bin for a delete, and `--i-understand-deep` unlocks four sections. The protected lists are unaffected by all of them.
```
**Was:** (new — the table is followed directly by the scripting section.)

**Change:** added, and it is the row-5 line for the whole option table. A reader working through 27 flags is
building a mental model of what can be turned off, and the answer is that the boundary is not one of them.
Four flags are named because they are the four a reader would test the claim with, and each was checked in
`lib/actions.ps1`, `modules/runner.ps1` and `lib/safety.ps1`. It matches `docs-safety` S-006 word for word on
the substance.

### S-037 · cli-reference.md:73-74 · Scripting · the lead-in
```
Sections 17, 18, 19 and 23 normally need a person choosing items, and they refuse to run unattended. Two flags let a script or a GUI supply that choice in advance:
```
**Was:** identical.

**Change:** none.

### S-038 · cli-reference.md:84-91 · Scripting · the five rules
```
- Either flag lifts the interactive refusal, because a person did choose - and the selection also answers that section's final confirmation, so the run does not stall waiting for a keypress.
- **`--yes` still selects nothing.** It never has, and neither flag changes that.
- `--select` is consumed one list per prompt. A run with more prompts than lists falls back to the console for the rest, and selects nothing when there is no console.
- `--select-file` is offered to every prompt, so a line that matches nothing in a given section is normal; it is reported once and skipped.
- Nothing here reaches a path the deletion chokepoint would otherwise refuse.
```
**Was:** identical.

**Change:** none. The last bullet is the row-5 line and it is already the last thing a reader sees before the
examples. Verified against self-test check [16], which round-trips all three behaviours.

### S-039 · cli-reference.md:93 · Scripting · the pairing
```
The usual pairing is to list the candidates first and then act on the ones you want:
```
**Was:** identical.

**Change:** none.

### S-040 · cli-reference.md:102 · Machine-readable output · the lead-in
```
`--json` writes exactly one line to stdout; every human line goes to stderr. The document carries:
```
**Was:** identical.

**Change:** none. The stronger statement about when that line is **not** written belongs to the machine
contract and is `ai-guide` S-020, not here.

### S-041 · cli-reference.md:113-114 · the always-present keys
```
`candidates` and `targets` are always present, as empty arrays when nothing was collected, so a caller can rely on the shape.
```
**Was:** identical.

**Change:** none.

### S-042 · cli-reference.md:116 · the progress lines
```
In `--json` mode each section also brackets itself on **stderr** so a caller can show progress:
```
**Was:** identical.

**Change:** none. The emphasis on stderr is doing real work, because the promise above it is that stdout
carries one line.

### S-043 · cli-reference.md:123-125 · `--list --json`
```
`--list --json` prints the section catalogue instead of the human table - `sections[]` (`id`, `key`, `title`, `tier`, `admin`, `batch`, `dev`), `safe_batch`, `safe_batch_admin`, `profiles`, `walkthrough` and `walkthrough_admin` - so a front end reads the catalogue rather than hard-coding it.

`dev` is the catalogue's developer flag, set on sections 1, 2, 3, 4, 5, 17, 20 and 22. It describes the catalogue rather than promising one behaviour: sections 1, 2, 3 and 5 prune by the idle gate instead of clearing when the answer is yes, and sections 4, 17 and 20 do not run at all when it is no.
```
**Was:** the first paragraph only.

**Change:** one paragraph added. The field was named in a list of seven and defined nowhere, on the page that
is meant to be the contract for reading the catalogue. A front end that treats `dev: true` as one behaviour
gets two of the three cases wrong. Verified against `lib/constants.ps1` for the flag and
`modules/runner.ps1` line 105 for the skip. Section 22 is included in the list because the JSON says so;
what its flag does is a catalogue defect reported separately rather than described here as intent.

### S-044 · cli-reference.md:127 · Exit codes · heading and the row-5 line
```
## Exit codes

Every mode returns one of these five. Nothing else is ever returned, and a non-zero code never means a partial deletion was left in an unknown state: a failed section is recorded in the report with `status: failed` and the rest of the run continues.
```
**Was:** ## Exit codes (heading only, table follows).

**Change:** a lead-in added. Five codes with no prose around them leave the reader to guess the one thing
they need, which is what a failure means for their disk. It does not mean a half-finished delete, because
every deletion is a single path through `Remove-PathSafe` and a failure is recorded rather than retried.
Verified against `modules/runner.ps1`, which adds a report step per section and carries on.

### S-045 · cli-reference.md:150 · Config file · the lead-in
```
`%USERPROFILE%\.windowsweep\config.json` stores defaults; flags always win. Nothing else is stored there: no history, no path list and no record of what a run removed. Those live in the logs and reports.
```
**Was:** `~\.windowsweep\config.json` stores defaults; flags always win.

**Change:** the path notation and a row-5 line. The `~\` form is the sweep `docs-start` S-009 begins. The
added sentences matter on a reference page because `config.json` is the one file a reader might inspect
expecting to find what the tool knows about them, and the answer is six keys, all of them listed in the table
below.

### S-046 · cli-reference.md:161 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves with the two additions above it.

---

## §C `docs/profiles.md`

### S-047 · profiles.md:3-4 · the opener
```
A profile is a named list of sections, resolved exactly like `--only`. Subtract with `--exclude`. Rehearse any profile with `--dry-run` the first time. A profile adds nothing a section does not already do: it names sections, and every guard, gate and refusal is the section's own.
```
**Was:** A profile is a named list of sections, resolved exactly like `--only`. Subtract with `--exclude`.
Preview any profile with `--dry-run` the first time.

**Change:** two things. "Preview" is the glossary's reserved word and the flag is called `--dry-run`, so the
verb becomes "rehearse" as it is everywhere else in this documentation. And the row-5 line is added, because
a named bundle is exactly the kind of thing a reader suspects of having its own behaviour. It does not.

### S-048 · profiles.md:9 · the `minimal` row
```
| `minimal` | 7, 8, 9, 10 | A quick weekly pass over browser, app and Windows caches plus temp |
```
**Was:** | `minimal` | 7, 8, 9, 10 | Quick weekly sweep of browser, app and Windows caches plus temp |

**Change:** one word. "Sweep" is the product's visual motif and the glossary bans it as a verb or an action
noun, which is what it is here. "Pass" carries the same meaning. The four section numbers were checked
against `WS_PROFILES` and are right, as are all six rows.

### S-049 · profiles.md:10 · the `cache-only` row
```
| `cache-only` | 1, 2, 3, 6, 7, 8, 9 | Every cache layer, nothing else - the "something is misbehaving" reset |
```
**Was:** identical.

**Change:** none. "Nothing else" is the row's own refusal and the quoted phrase is the reason a reader picks
it.

### S-050 · profiles.md:12 · the `deep` row
```
| `deep` | 0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 21 | The monthly pass: everything except the deep-gated and interactive sections |
```
**Was:** | `deep` | 0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 21 | The monthly clean, everything except the
deep-gated and interactive sections |

**Change:** "clean" is the glossary's banned verb used as a noun, and the row also needed a colon rather than
a comma to stop the two halves reading as one list. The fourteen numbers match `WS_PROFILES['deep']` exactly.
The name is worth a note. A profile called `deep` that **excludes** the deep tier is confusing, and the
name is also a frozen public identifier, so the cell carries the explanation rather than the name changing.

### S-051 · profiles.md:22-28 · the notes
```
Notes:

- `dev` includes section 17, which is interactive-only: in a batch run it is refused and reported; run the profile from a console to select artefacts, or use `--dry-run` to list them.
- `dev` includes section 4 (AVDs), which needs `--yes` in batch mode and honours the per-AVD idle gate. Both 4 and 17 are skipped entirely when the developer answer is no.
- `system` needs an elevated console; without `--elevate` every section in it is skipped with the command to run.
- No profile includes 11, 15, 16 or 20. Those are deep sections and need `--i-understand-deep` explicitly, named in `--only`.
- No profile reaches sections 18, 19 or 23. Personal files are never selected by a profile.
```
**Was:** the same four notes; the second ended at "per-AVD idle gate", and the fifth did not exist.

**Change:** one sentence and one whole note. The developer-answer sentence matches `sections.md` S-002's new
marker, and it belongs here because `dev` is the profile a developer runs and two of its seven sections
vanish on a "no". The new final note closes the page's remaining gap: three interactive sections appear in no
profile at all, and a reader checking whether a profile can reach their Downloads folder should find the
answer here rather than by reading six rows and inferring.

### S-052 · profiles.md:30 · NEW · what a profile cannot do
```
A profile cannot add a section that is not in its list, cannot lift a deep gate, and cannot answer an interactive prompt. `--exclude` removes sections from a profile; nothing adds one.
```
**Was:** (new — the page ends on the notes.)

**Change:** added as the page's row-5 line at the file level. `Get-RequestedSections` in
`modules/runner.ps1` resolves a profile to its literal list and then applies `--exclude` as a subtraction,
with no addition path anywhere. An evaluating reader deciding whether a profile is a safe thing to hand a
colleague wants that stated once.

### S-053 · profiles.md:30 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves with the edits above it.

---

## §D `docs/admin-and-elevation.md`

### S-054 · admin-and-elevation.md:3-5 · the opener
```
Sections 12, 13, 14, 15, 16 and 20 change things only an administrator may change. windowsweep never asks for a password and never stores one; it detects whether the current console is elevated and, when it is not, skips those sections with the exact command that runs them.
```
**Was:** identical.

**Change:** none. The list is right - `Admin = $true` on exactly those six in `lib/constants.ps1` - and the
password sentence is a refusal in the right place, which is the second sentence of the page about
elevation. `docs-start` S-022 corrects the quick start to agree with this list.

### S-055 · admin-and-elevation.md:18-19 · the batch note
```
12 and 13 join `--all` automatically when the console is already elevated. 14 is opt-in, because it is slow, and stays out of `--all` even when elevated. 15, 16 and 20 are deep-gated.
```
**Was:** 12 and 13 join `--all` automatically when the console is already elevated. 14 is opt-in (it is
slow). 15, 16 and 20 are deep-gated.

**Change:** the parenthesis becomes a clause. `WS_SAFE_BATCH_ADMIN` is `@(12, 13)`, so 14 is not in `--all`
under any circumstances, and a reader who has just read the previous sentence will otherwise assume that
elevation was the only thing missing.

### S-056 · admin-and-elevation.md:20 · NEW · what elevation does not change
```
Elevation changes which sections can run. It changes nothing about what any of them may reach: the protected lists, the declared roots and the chokepoint are identical in an elevated run, which is why an elevated run still refuses `C:\Windows\System32`.
```
**Was:** (new — the `--elevate` heading follows the batch note directly.)

**Change:** added, and it is this page's row-5 line. Administrator rights are the one thing a reader might
expect to widen a tool's reach, and on this tool they do not: `Initialize-Safety` builds the same tables
regardless of token, and `Get-ProtectionReason` is the same function in both processes. The example is
concrete because an abstract claim about "the same guards" is exactly what a sceptical reader discounts.

### S-057 · admin-and-elevation.md:27-30 · `--elevate`
```
The tool relaunches itself through `Start-Process -Verb RunAs`, Windows shows the UAC prompt, and the elevated run opens in a new window with its own log and report under `%USERPROFILE%\.windowsweep`. The original window waits and prints the child's exit code. Your account must be a member of Administrators; a standard user is told so by section 0. No script can answer that prompt, so `--elevate` does not belong in an unattended run.
```
**Was:** the same three sentences with `~\.windowsweep`, and no fourth.

**Change:** the path notation, and one sentence added. `AI-INTEGRATION-GUIDE.md` already tells a machine
caller that `--elevate` cannot be scripted; the page a human reads about elevation should say it too, because
the person most likely to put `--elevate` in a Scheduled Task is reading this page and not that one.

### S-058 · admin-and-elevation.md:32 · the one-liner
```
The one-liner that also removes the hibernation file:
```
**Was:** identical.

**Change:** none. The command under it was checked against `modules/walkthrough.ps1` line 55, which prints
the same one.

### S-059 · admin-and-elevation.md:40 · the hibernation opener
```
`hiberfil.sys` holds a copy of RAM and is roughly 40% of it - 16 GB on a 40 GB machine - permanently, on the system drive.
```
**Was:** identical.

**Change:** none. The arithmetic is right and the example is the shape of specific the Bible asks for. The
40% figure matches what section 15 prints, and `windowsweep --scan` reports the file's real size on the
reader's own machine, which is where an exact number belongs.

### S-060 · admin-and-elevation.md:49-50 · the closing note on hibernation
```
Running speed is unaffected either way; the gain is disk space, which matters most on a nearly full system drive. Reverse it any time with `powercfg /hibernate on`. Nothing else changes: no power plan, no sleep setting and no BIOS option.
```
**Was:** Running speed is unaffected either way; the gain is disk space, which matters most on a nearly full
system drive. Reverse it any time with `powercfg /hibernate on`.

**Change:** the row-5 line is added. This is the one section on the page that changes a Windows setting rather
than removing files, so the useful thing to state is the edge of what it changes. Three named non-effects is
more reassuring than one adjective, and each is true: section 15 calls `powercfg /hibernate` and nothing else.

### S-061 · admin-and-elevation.md:52 · the why heading
```
## Why some caches are admin-only
```
**Was:** identical.

**Change:** none.

### S-062 · admin-and-elevation.md:54-56 · the why paragraph
```
`C:\Windows\Temp`, the Windows Update download cache and the system Error Reporting queues are owned by the system; the Explorer thumbnail and icon databases are locked by Explorer and are rebuilt cleanly only through Disk Cleanup; WinSxS may only be touched by DISM. Everything a non-elevated user owns is handled by sections 1-10, which is where a first run should start.
```
**Was:** ... Everything a non-elevated user owns is handled by sections 1-10.

**Change:** a clause added. The paragraph explains why six sections need rights the reader may not want to
give, and the useful next sentence is that they do not have to: ten sections run without any of it. That is
the page's only piece of guidance and it costs seven words.

### S-063 · admin-and-elevation.md:58 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-03

**Change:** the date moves with the edits above it.

---

## §E `docs/reports-and-logs.md`

### S-064 · reports-and-logs.md:3-4 · the opener
```
Every run writes under `%USERPROFILE%\.windowsweep`, never inside the npm cache or the repository, so history survives every `npx` invocation. Every run means every run: `--scan` and `--dry-run` write here too, and `--no-report` and `--cleanup-logs` are the two flags that stop them.
```
**Was:** Every run writes under `%USERPROFILE%\.windowsweep`, never inside the npm cache or the repository,
so history survives every `npx` invocation.

**Change:** one sentence added, and it closes the same gap `docs-start` S-017 and `docs-safety` S-024 close
on their own pages. A reader who believes `--scan` is read-only in the strict sense will be surprised by a
log file, and this is the page whose whole subject is what gets written. Naming the two flags that suppress
each half is the row-5 line.

### S-065 · reports-and-logs.md:18 · the stamp
```
`<stamp>` is `yyyy-MM-dd_HHmmss-<pid>`, so concurrent runs never share a file.
```
**Was:** identical.

**Change:** none. Verified against `windowsweep.ps1` line 206, which builds it from `Get-Date -Format
'yyyy-MM-dd_HHmmss'` and `$PID`.

### S-066 · reports-and-logs.md:22-25 · the log
```
Plain text, one timestamped line per event: every path removed with its size, every path skipped as in use, every refusal with its reason, every external command with its exit code, and a credit header naming the tool version, mode, host, user, elevation and dry-run state. `--cleanup-logs` deletes this run's log at exit; `--prune-history N` removes logs, reports and bundles older than N days.

The log records what happened. It is not a way to undo it: there is no restore command and no copy of a removed file anywhere under this folder.
```
**Was:** the first paragraph only.

**Change:** one paragraph added. A page that describes a per-path record of every deletion invites the reader
to treat it as a safety net, and the honest answer is that it is evidence rather than a backup. It matches
`docs-safety` S-025, which makes the same statement on the safety page.

### S-067 · reports-and-logs.md:43-44 · the report status note
```
`status` is one of `ran`, `dry-run`, `skipped`, `refused`, `failed`. In a dry-run the estimate lives in `total_estimated_bytes` and `total_reclaimed_bytes` stays 0.
```
**Was:** identical.

**Change:** none. Five values and the one asymmetry a reader parsing the file needs.

### S-068 · reports-and-logs.md:45 · NEW · what the report does not contain
```
The report contains paths, sizes, section outcomes and the machine's own name, version and user. It contains no file contents, no registry values and no list of what a section decided to keep. A skipped path appears in the log with its reason; a kept cache entry does not appear anywhere.
```
**Was:** (new — the exports section follows the status note.)

**Change:** added as this page's structural row-5 line. Two readers need it. One is deciding whether to attach
a report to a public issue, and the Privacy section below tells them to review it without saying what is in
it. The other is trying to work out why a cache survived, and the answer is that the report records outcomes
rather than decisions, so the log's `kept` lines are the place to look.

### S-069 · reports-and-logs.md:49 · the reports-manager keys
```
windowsweep --reports                # list, then: cm N | ch N | cb N | all | v N | o N | d N | q
```
**Was:** identical.

**Change:** none. Verified character for character against `modules/reports.ps1` line 161, which prints the
same eight actions in the same order.

### S-070 · reports-and-logs.md:56-57 · the HTML export
```
The HTML export is a single self-contained file that follows the system light/dark preference. No external tool is needed for any conversion, and the file references nothing on the network.
```
**Was:** The HTML export is a single self-contained file that follows the system light/dark preference. No
external tool is needed for any conversion.

**Change:** a clause added. "Self-contained" is a word people use loosely about an HTML file that still pulls
a font or a stylesheet, and this one does not: `modules/reports.ps1` inlines its CSS, including the
`prefers-color-scheme` block at line 96. On a product whose claim is that it makes no network calls, an
export that would make one when opened is worth ruling out explicitly.

### S-071 · reports-and-logs.md:61-62 · Privacy
```
Logs and reports contain paths from your machine and a snapshot of cache sizes. Nothing is transmitted: the command-line tool makes no network calls of its own. Review a bundle before attaching it to an issue - the paths in it include your user name and your project folders.
```
**Was:** Logs and reports contain paths from your machine and a snapshot of cache sizes. Nothing is
transmitted: windowsweep makes no network calls. Review a bundle before attaching it to an issue.

**Change:** two things. "windowsweep makes no network calls" becomes "the command-line tool makes no network
calls of its own", which is the qualification `docs-start` S-002 explains and which keeps the sentence true
beside a desktop application that can send analytics. And the review instruction gains its reason: a reader
told to review a bundle without being told what to look for will skim it. The user name and the project paths
are the two things in a log that identify a person.

### S-072 · reports-and-logs.md:64 · the footer
```
Last Updated: 2026-09-05
```
**Was:** Last Updated: 2026-09-05

**Change:** none. This page was already stamped today.

---

## SELF-CHECK

**Palette.** P dominant, as row 5 requires. R is minimal. It is structural rather than decorative, and
it appears exactly where the row says it should, which is at the end of an entry. P carries every entry: each slot names a file, a line, a count or a command, and the two corrections at S-002
and S-018 are argued from `lib/constants.ps1` and `modules/system_admin.ps1` rather than from reading.
R appears once per entry by design, which is what row 5's "prose line saying what it does not touch" is, and
it is a specific refusal every time: volumes, profile folders, the SDK, rollback, source files, the file name
itself. No W anywhere, which suits a reference set; the driest thing here is S-016's *"nothing is spared"*
and that is a fact rather than an aside.

**Rhythm.** Shortest shipping sentence: *"Not touched: anything."* (three words, S-026), and *"This is not an
audit."* at five (S-028). Longest: section 18's extension list at 46 words, which is a list and reads as one.
Median across the added row-5 lines is around 26 words. Longer than the fingerprint, on purpose. Each
line has to name a refusal and then say why it holds, which does not fit in the 12-16 words the
fingerprint asks for elsewhere.

**Length.** Row 5's cap is "reference length", with no figure. `sections.md` measures 2,470 words today and
lands near 3,250; `cli-reference.md` 1,430 to about 1,570; `profiles.md` 255 to about 330;
`admin-and-elevation.md` 422 to about 500; `reports-and-logs.md` 170 prose words to about 290. Every increase
is a row-5 line or a corrected count.

**Unsure spots.** One recorded as a deliberate non-change: S-003 leaves section 22's Batch cell alone rather
than describing a catalogue flag that has no effect, and reports the flag instead. That is a judgement, and
the alternative would have been to write a sentence explaining an engine defect on a reference page.

**Banned-phrase sweep.** Run with a script over the fenced shipping strings only, 3,861 words of them,
against the shared list plus this project's own bans. Two hits. Both are deliberate, and both are frozen
vocabulary rather than voice: **`safe`** as the literal `Batch` value in the `sections.md` table cells at
S-002 and S-003, and **`clean`** inside the command string `npm cache clean --force` at S-006, which is
npm's own command rather than a description of what this tool does. Four occurrences were removed instead
of kept: `preview` at S-018, where it described what `cleanmgr` cannot do and still collided with the
glossary's reserved word; `safe` as an adjective at S-019; `sweep` at S-048; `clean` as a noun at S-050.
Nothing matched `just`, `simply`, `easily`, a superlative or a first-person plural.
