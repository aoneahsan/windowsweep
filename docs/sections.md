# Sections 0-32

Every cleanup operation lives in one numbered section. Numbers are a public contract: a section may be
retired as a no-op, never renumbered. `windowsweep --list` prints the table; `--list-targets` prints every
path each section can reach on your machine.

| # | Section | Tier | Admin | Batch |
|---|---|---|---|---|
| 0 | System health report | report | - | safe |
| 1 | Package-manager caches | rebuilds | - | safe, developer-gated |
| 2 | Build-tool caches | rebuilds | - | safe, developer-gated |
| 3 | Test-runner browsers | rebuilds | - | safe, developer-gated |
| 4 | Android emulators (AVDs) | slow | - | opt-in, developer-gated |
| 5 | Docker | rebuilds | - | safe, developer-gated |
| 6 | Editor caches and extensions | rebuilds | - | safe |
| 7 | Browser caches | rebuilds | - | safe |
| 8 | Desktop-app caches | rebuilds | - | safe |
| 9 | Windows user caches | rebuilds | - | safe |
| 10 | User temp | rebuilds | - | safe |
| 11 | Recycle Bin | permanent | - | deep |
| 12 | Windows Update and system temp | rebuilds | admin | safe when elevated |
| 13 | Disk Cleanup engine | rebuilds | admin | safe when elevated |
| 14 | Component store (DISM) | rebuilds | admin | opt-in |
| 15 | Hibernation file | config | admin | deep |
| 16 | Event logs | permanent | admin | deep |
| 17 | Stale project build artefacts | rebuilds | - | interactive, developer-gated |
| 18 | Partial downloads | Recycle Bin | - | interactive |
| 19 | Large or old personal files | Recycle Bin | - | interactive |
| 20 | Disk-image compaction | config | admin | deep, developer-gated |
| 21 | Disk usage report | report | - | safe |
| 22 | Global packages audit | report | - | safe, audit only |
| 23 | Orphaned application data | Recycle Bin | - | interactive |
| 24 | Installed programs not modified for N+ days | report | - | safe, audit only |
| 25 | Startup items audit | report | - | safe, audit only |
| 26 | Uninstall programs and Store apps | permanent | per program | interactive |
| 27 | Leftovers of uninstalled programs | Recycle Bin | admin | interactive |
| 28 | Superseded tool releases | rebuilds | - | safe |
| 29 | Chrome on-device AI model policy | config | admin | deep |
| 30 | Windows updates you pick | update | to install | interactive |
| 31 | Driver updates you pick from Windows Update, and old driver packages | update | to install or remove | interactive |
| 32 | App updates you pick (winget) | update | - | interactive |

"Developer-gated" means the idle gate applies when the developer answer is yes; otherwise the cache is cleared completely. "Developer-only" means the section does not run at all when the answer is no ([Developer mode](./developer-mode.md)). Every section honours `--dry-run`. Tier `recycle` means the item goes to the Recycle Bin (`--list` shows `recycle`). Tier `update`, in 30-32 only, installs what Windows Update or winget downloads for the rows you pick.

## 0 - System health report

Read-only. Windows build, uptime, RAM, PowerShell version, elevation state (and whether the account can
elevate), developer mode and detected tooling, a drive table with a warning under 10% free, `hiberfil.sys` size
and hibernation state, page file, Docker/WSL disk images, WSL distros, startup-item count, Storage Sense,
last-access tracking, and the running apps whose caches will be skipped.

## 1 - Package-manager caches

npm (`_cacache`, `_npx`, `_logs`), Yarn v1 and Berry, pnpm (`pnpm store prune` when pnpm is installed),
bun, deno, pip, uv (`uv cache prune` first), poetry, Composer, NuGet (http/plugins/scratch caches and the global
packages folder), Cargo registry and git checkouts, Go build and module caches, Dart/Flutter pub cache, Electron
and node-gyp download caches, Scoop's installer cache. Globally installed packages and version managers are
protected. `--purge-all` clears everything (and runs `npm cache clean --force`).

## 2 - Build-tool caches

Gradle caches (idle files), wrapper distributions (keep newest), daemon logs older than 7 days and `.tmp`;
Maven's local repository (idle files); Android SDK manager cache, build cache and download leftovers; Unity's
cache; JetBrains IDE caches per IDE version, removed only when that whole version has been idle for the window
(the Toolbox itself is protected); .NET telemetry storage. Idle Gradle daemons are stopped first so their files
are not locked.

## 3 - Test-runner browsers

Cypress versions, Playwright browsers (per browser family), Playwright-Go and Puppeteer downloads. The newest build of each family is always kept while the idle gate is running; a missing build is re-downloaded by the next `npx cypress install` or `npx playwright install`.

Not touched: anything under a Chrome-for-Testing folder. The pattern list refuses it by name, so a real browser install is never mistaken for a test runner's copy.

## 4 - Android emulators

Each `.avd` folder plus its `.ini` is one unit, removed only when nothing inside it changed for the window
(booting an emulator updates its files). Skipped while an emulator is running. Not part of `--all`; run it with
`--only 4 --yes` or from the walkthrough.
Section 4 also identifies unused Android SDK system images and dangling AVD `.ini` pointers. SDK images are
uninstalled through `sdkmanager`; a live AVD keeps its image.

## 5 - Docker

Needs the Docker CLI and a running daemon. Developer mode: `docker image prune -f` (dangling layers),
`docker builder prune --filter until=<N days>`, `docker image prune -a --filter until=<N days>` (images no
container uses, older than the window). Developer mode off or `--purge-all`: `docker system prune -a -f`.
Volumes are never touched. The disk image itself only shrinks through section 20.

## 6 - Editor caches and extensions

VS Code, VS Code Insiders, VSCodium, Cursor and Windsurf: `Cache`, `CachedData`, `CachedProfilesData`,
`CachedExtensionVSIXs`, `Code Cache`, `GPUCache`, Dawn caches, service-worker caches, crash reports, logs older
than 7 days, `workspaceStorage` entries whose folder no longer exists, and extension folders the editor's own
`extensions.json` does not reference (uninstalled or superseded versions). Visual Studio's ComponentModelCache,
designer shadow cache, AppInsights and SQM logs. A running editor is left alone except for its VSIX cache and
old logs.

## 7 - Browser caches

Chrome (stable, Beta, Dev, Canary), Edge, Brave, Vivaldi, Opera and Opera GX, Chromium, Arc, Firefox,
LibreWolf and Waterfox. For every profile: `Cache`, `Code Cache`, `GPUCache`, shader and Dawn caches, the
service-worker script cache; at the root: shader caches, Crashpad reports, SwReporter. Profile data is never
touched. A browser that is open is skipped entirely.
`--browser-profile-roots "P1;P2"` also names test or automation profile roots. Only known cache leaves
inside those declared roots are eligible; profiles and their saved data remain protected.

## 8 - Desktop-app caches

Discord (and Canary/PTB), Slack (installer and Store), Teams classic and new, Zoom logs, Spotify's streaming
cache, Postman, Figma, Notion, Signal, Skype, GitHub Desktop, Obsidian, the Claude desktop app, Linear,
Granola, Insomnia, Steam and Epic web caches and logs, Adobe media caches (idle files), OBS logs and crash
reports, Squirrel installer temp, pending Electron updater downloads older than 7 days, and superseded Squirrel
`app-x.y.z` versions (Discord, Postman, Figma, GitHub Desktop, Slack). Running apps are skipped.

## 9 - Windows user caches

INetCache, the user Windows Error Reporting queue, crash dumps older than 7 days, DirectX / NVIDIA / AMD /
Intel shader caches, the Remote Desktop bitmap cache, OneDrive logs, Store-app `TempState`, `AC\Temp` and
`AC\INetCache`, themes' cached files, PowerShell startup profile data, CLR usage logs, Explorer's
thumbcache/iconcache leftovers and startup logs, the schema cache, per-user Delivery Optimization cache, the
certificate URL cache, diagnostics results older than 30 days, and `ipconfig /flushdns`.

## 10 - User temp

`%TEMP%`, `%TMP%`, `AppData\Local\Temp` and `AppData\LocalLow\Temp`: files idle `--temp-days`+ days
(default 3), then empty folders. Files a running program holds open are skipped.
`--temp-roots "P1;P2"` adds scratch folders. An entry is eligible only after nothing inside it was
written for the temp window and no running program uses it.

## 11 - Recycle Bin

`Clear-RecycleBin -Force` on every drive after a separate confirmation. Permanent. Deep-gated.

Not touched: nothing is spared. This is the one section whose whole purpose is to remove what the Recycle Bin was holding for you, including anything sections 18, 19, 23, 26 and 27 put there. It asks a question of its own, and `--yes` does not answer it.

## 12 - Windows Update and system temp (admin)

Stops `wuauserv` and `bits`, clears `SoftwareDistribution\Download`, restarts them; runs
`Delete-DeliveryOptimizationCache`; prunes `C:\Windows\Temp` and the service-profile temp folders by
`--temp-days`; CBS, DISM and Windows Update logs older than 30 days; live kernel reports older than 7 days; the
system Windows Error Reporting queue, archive and temp.

## 13 - Disk Cleanup engine (admin)

Runs `cleanmgr /sagerun:77` with a curated handler list: Temporary Files, Temporary Setup Files, Setup and
Upgrade logs, Update Cleanup, Delivery Optimization Files, Thumbnail Cache, D3D Shader Cache, System error
memory dumps and minidumps, Windows Error Reporting Files, Previous Installations, Old ChkDsk Files, Content
Indexer Cleaner, Device Driver Packages, Downloaded Program Files, Offline Pages, Diagnostic Data Viewer
database, BranchCache, RetailDemo content, Windows Defender, Active Setup Temp Folders, Temporary Sync Files,
Upgrade Discarded Files. Never enabled: DownloadsFolder, Recycle Bin, User file versions, Windows ESD
installation files, Language Pack. The registry flags are removed afterwards. Cleanmgr cannot preview sizes, so
the dry-run lists the handlers only.

## 14 - Component store (admin)

`Dism /Online /Cleanup-Image /AnalyzeComponentStore` (read-only) then `/StartComponentCleanup`. Slow, and
not in the safe batch: its batch is `optin`, so it runs only when you name it with `--only 14` or through
`--profile system`.
`--reset-base` adds `/ResetBase`, which also removes the ability to uninstall installed updates. Opt-in.

## 15 - Hibernation file (admin)

`hiberfil.sys` is about 40% of RAM. `--hiberfil off` removes it (`powercfg /hibernate off`): Sleep still works;
Hibernate, Fast Startup and hibernate-on-critical-battery do not. `--hiberfil reduced` keeps Fast Startup at a
smaller file. `keep` leaves it. Interactive runs ask; batch runs need the flag. Deep-gated.

## 16 - Event logs (admin)

`wevtutil cl` for every log. Permanent loss of troubleshooting history. Deep-gated.

Not touched: the log configuration, the channels themselves and their sizes. Only the recorded events go, and nothing puts them back. Section 11 is the other deep-gated permanent section; section 26 can also permanently uninstall a program you select.

## 17 - Stale project build artefacts

Scans project roots (auto-detected folders such as `~\source\repos`, `~\Projects`, `~\code`, `D:\work`, or
`--scan-roots "P1;P2"`) for `node_modules`, `dist`, `build`, `out`, `.next`, `.nuxt`, `.turbo`, `.vite`,
`.svelte-kit`, `.astro`, `.parcel-cache`, `target`, `vendor`, `coverage`, `.nyc_output`, `__pycache__`,
`.pytest_cache`, `.dart_tool`, `.angular` and `bin`/`obj` beside a `.csproj`. A folder is listed only when its
parent looks like a project and the project's source files have been idle for the window. You select what goes.
Refuses to scan a whole drive or the profile root; never enters `.git`, AppData or toolchain folders. Writes
`stale-builds-<stamp>.txt` even in dry-run. Interactive only. `--yes` never selects here: the prompt appears
even with `--yes`, Enter selects nothing, and the final question is never auto-answered.

## 18 - Partial downloads

`.crdownload`, `.part`, `.partial`, `.fdmdownload`, `.opdownload`, `.!ut`, `.aria2`, `.download`, `.bc!`
and `.tmp` files in Downloads (4 levels deep). You select; selected files go to the Recycle Bin. Interactive
only; `--yes` never selects and never answers the final question.

## 19 - Large or old personal files

Downloads is scanned by default. `--personal-roots "P1;P2"` adds folders you choose; drive roots,
system and program folders, the profile root, links and missing folders are refused with reasons. A file
qualifies when it is at least `--large-file-mb` MB (default 100) **or** at least `--days` days old,
regardless of size. The engine offers at most 500 selectable files at once, largest first, and reports
protected files as unselectable rows. Large and old describe a file, not whether you still need it.
You select paths one by one with `--select-file`; `--yes` never chooses them. Selected files go to the
Recycle Bin even when `--permanent` is set. Immediately before removal the engine checks that each is still the same file,
size and write time, and that no path component became a link; a changed file is kept.

## 20 - Disk-image compaction (admin)

Lists Docker Desktop and WSL `.vhdx` files, stops Docker Desktop and runs `wsl --shutdown`, then
`diskpart` `compact vdisk` on the ones you select. A virtual disk grows with writes but never shrinks on its
own; compaction returns the free space to Windows. Restart Docker Desktop afterwards. Deep-gated.

## 21 - Disk usage report

Read-only: drive table, hibernation file, disk images, and the 20 largest entries of your profile,
`AppData\Local`, `AppData\Roaming` and the system drive root, with protected entries marked. Writes
`disk-usage-<stamp>.txt`.

## 22 - Global packages audit

Read-only. Lists what `npm`, `pnpm`, `yarn`, `bun` and `deno` installed globally, with each package's
version, size and how long it has been since anything touched it, then prints the exact uninstall command
for the ones nothing seems to need. **It never uninstalls anything**, in any mode - several of these roots
(`nvm4w`, `AppData\Roaming\npm`, `pnpm\global`, `.bun`, `.deno\bin`) are protected paths the tool refuses to
delete from, so the section declares no deletable target at all.

A package is a *candidate* only when all three are true: nothing has touched it for `--days`+ days, no
`package.json` under your project scan roots that changed inside that window names it (dependencies or a
`scripts` line), and it is not one of `npm`, `corepack`, `pnpm`, `yarn` or `windowsweep`. A candidate that a
project also installs locally is marked, because the local copy is the one that actually runs.

Windows keeps no record of when a command last ran, so "idle" here means the package folder's own files have
not changed. Writes `global-packages-<stamp>.txt`. Part of the `audit` profile.

## 23 - Orphaned application data

Interactive only. Top-level folders under `%APPDATA%` and `%LOCALAPPDATA%` that no installed program claims
and that nothing has touched for `--days`+ days - what an uninstaller left behind. You select what goes and
it lands in the **Recycle Bin** (`--permanent` deletes instead). `--yes` never selects here; `--dry-run`
lists and removes nothing.

A folder is claimed - and therefore never offered - when any of these names it: an entry in the three
uninstall registry hives (display name, publisher, or the leaf of its install location), a folder under
`Program Files`, `Program Files (x86)`, `%LOCALAPPDATA%\Programs` or `WindowsApps`, a Store package, or a
running process. Matching is deliberately generous: a token that merely starts with the folder name, or the
reverse, counts as a claim, because wrongly calling something orphaned is the expensive mistake.

**It fails closed.** If the uninstall hives cannot be read at all, the section reports that and produces
**zero** candidates - an empty list of installed programs must never read as "everything is orphaned".

Never offered: `Microsoft`, `Windows`, `Packages` (Store apps own their own lifecycle), `Programs`, `Temp`,
`Comms`, `ConnectedDevicesPlatform`, `D3DSCache`, `Google`, `Mozilla`, `CrashDumps`, `VirtualStore`,
`PeerDistRepub`, `Publishers`, `History`, `IconCache`, `ElevatedDiagnostics`, the shell folders, and the
platform folders `IsolatedStorage`, `ToastNotificationManagerCompat`, `AppV`, `Package Cache`, `DBG` and the
`CLR_v4.0` pair. On top of that, **every vendor folder another section already cleans is excluded
automatically**, derived from the declared target list at run time so it cannot drift.

## 24 - Installed programs not modified for N+ days

Read-only. Reads the three uninstall hives and lists non-system programs, largest first, whose files under
their install location have not been modified for `--days`+ days, each with the command that removes it -
`winget uninstall --id <id>` when one `winget list` call resolves it, otherwise the program's own
`UninstallString`. Store apps are listed separately with `Remove-AppxPackage` hints. This report never runs
an uninstaller; section 26 does that only for a program or Store app you select.

The number is **"not modified", not "not used"**: Windows keeps no reliable last-launched record. It is
measured from last-write times only, because last-access is live on many systems and would report every
program as touched today. A program with no recorded install location cannot be measured and is not listed.
Writes `installed-programs-<stamp>.txt`. Part of the `audit` profile.
When elevated, the report also shows days since a program last ran where Prefetch supplies a credible
program-specific match. A shared executable such as `uninstall.exe` never counts as a run.

## 25 - Startup items audit

Read-only. One table of everything that launches at sign-in or boot: `Run` and `RunOnce` under HKCU, HKLM and
`WOW6432Node`, both Startup folders, scheduled tasks with a logon trigger, and `Win32_StartupCommand`, each
marked enabled or disabled. **It changes nothing** - the tool shows them, you change them in Task Manager >
Startup, where you can undo it.

The enabled/disabled state comes from Explorer's `StartupApproved` record, and specifically from the disable
timestamp it stores: a value carrying a real timestamp was switched off, one whose timestamp is zero is on. A
value too short to read is reported as `unknown` rather than guessed. Writes `startup-items-<stamp>.txt`.
Part of the `audit` profile. A startup entry whose program file is gone is offered in section 27, with a
`.reg` backup first.

## 26 - Uninstall programs and Store apps

Interactive only. One list, largest first, with a KIND column:

| KIND | The row | What picking it does |
|---|---|---|
| `desktop` | a program in Apps, one row per uninstall entry | runs its own registered uninstaller, silently when a known silent form exists; otherwise its own window opens and you finish there |
| `store` | a Store app installed for your Windows account | Windows' own `Remove-AppxPackage`, for this account only |
| `broken` | an entry whose uninstaller file is gone, so running it could only fail | clears the entry from Apps after a `.reg` backup |

HOW names the method. NEEDS says `admin` for a program installed for all users, which only an elevated
run can remove. RAN is how many days ago Windows last saw the program run, or `none` when no run is on
record; only an elevated run can read it. Rows go one at a time, and a program or app that is running is
skipped until you close it.

Never listed: Windows parts, runtimes, drivers, the apps that drive your hardware, build kits, frameworks,
codecs, the Store and winget, WSL, and windowsweep itself. Windows may put an inbox Store app back for a
new account or after a feature update.

Uninstalling is permanent and can remove the program's settings. Every real removal is recorded in
`%USERPROFILE%\.windowsweep\uninstalled.jsonl`, which section 27 reads later; a dry-run records nothing.

Right after a real removal of a desktop program, a second list offers what it left: folders (its install
folder, and folders named like it, AppData included), its own registry keys, Start-menu shortcuts, and
startup entries and scheduled tasks that ran a file from its folder and now point at nothing. Registry
keys and startup entries are exported to a `.reg` file first and a task is saved as XML first
([the registry chokepoint](./safety-model.md#the-registry-chokepoint)); folders and shortcuts go to the
Recycle Bin, or are deleted outright with `--permanent`. A dry-run stops before this list, because nothing
was removed. `--yes` never selects a row in either list.

On the build machine, a ThinkPad P52 on Windows 10 22H2, one run on 2026-11-13 picked 40 rows and removed
39 in 2.1 minutes: 8 desktop programs, Camtasia 2022 among them at 21 seconds, and 31 Store apps,
reclaiming 3.9 GB. The 40th, the AChat Chrome web app, waits on Chrome's own confirmation. The second
list found 8 folders (TechSmith's data, 180 MB in ProgramData and 107 MB in local AppData; Hubstaff,
31 MB; calibre's cache) and 4 registry keys (`Adobe\Shockwave 11` and `12`, `Netsoft Holdings`,
`HWiNFO64`).

## 27 - Leftovers of uninstalled programs

Interactive and elevated. Three lists, and you pick from each:

1. **Folders.** Top-level folders under both Program Files folders, their Common Files, ProgramData and
   `%LOCALAPPDATA%\Programs` that nothing claims and nothing has touched for `--days`+ days. Installed
   programs, uninstall entries, services, drivers, environment and PATH entries, Run entries, shortcuts,
   registered COM servers, scheduled tasks and running processes can claim a folder and keep it. The
   folders of programs section 26 removed earlier come from the uninstall history and skip the idle wait.
2. **Registry keys, shortcuts, startup entries and tasks.** The registry keys of programs in the uninstall
   history that are still gone, and any Start-menu shortcut, startup entry or scheduled task outside
   `\Microsoft\` whose file is gone, whoever installed it. Registry keys and startup entries are exported
   to a `.reg` file first and a task is saved as XML first; shortcuts go to the Recycle Bin. A Desktop
   shortcut is reported, never removed, because the Desktop is protected.
3. **Environment entries** that name something no longer there, report only. Remove them in System
   Properties > Environment Variables.

Shared keys are never offered: Microsoft, Classes, Policies, the hardware makers, the toolchains and the
browsers. A vendor key is offered whole only when everything under it belongs to removed programs and no
installed program claims the vendor; otherwise only the matching keys under it are. If the
installed-program registry cannot be read, no folder is offered. Protected and excluded folders are
reported with their reason. Picked folders and shortcuts go to the Recycle Bin, or are deleted outright
with `--permanent`.

On the build machine on 2026-11-13, an elevated dry-run of 27 found a "Malwarebytes Anti-Exploit" Run
entry still pointing at a deleted `mbae.exe`, and two Start-menu shortcuts that point at nothing.

## 28 - Superseded tool releases

Safe batch. Removes old Codex standalone releases, downloaded Electron updater installers, superseded
Ollama versions and Node versions no current project requests. The current version and the newest
previous Codex release are kept. It can run in `--all`, `dev` and `deep`; dry-run shows the choices.

## 29 - Chrome on-device AI model policy

Deep and elevated. Sets Chrome's `GenAILocalFoundationalModelSettings` policy to `1`; Chrome then
removes its downloaded on-device model. Chrome displays “Managed by your organization” for this
policy. The policy remains until you remove it; the model may return after that.

## 30 - Windows updates you pick

Interactive. Windows Update is asked what this PC still lacks: security and quality updates, Defender
definitions and the malware removal tool. Optional updates, the feature upgrades and previews, are left out
and counted; they install from Settings > Windows Update. The list shows SIZE, KB, TITLE and CATEGORY. A
size Windows Update does not give shows as `unknown`, and so does one above 20 GB: for a cumulative update
it reports the whole express payload, more than 100 GB for KB5131096 on the build machine. Each update you
pick is downloaded and installed by Windows Update itself, one at a time, after you confirm.

Installing needs an elevated run: an unelevated real run lists the updates, then refuses before asking
you to pick (`windowsweep --only 30 --elevate`). windowsweep never restarts your PC. It says when Windows
wants a restart, and warns at the start when an earlier update is still waiting for one. A dry-run
downloads and installs nothing.

On the build machine on 2026-11-13, section 30 listed KB5131096, the November cumulative update, and
KB890830, the malware removal tool.

## 31 - Driver updates you pick from Windows Update, and old driver packages

Interactive. Three things come first, for reading only: the devices Windows reports a problem with, each
problem in words; the oldest third-party drivers, older than 3 years, the 15 oldest shown; and your PC
maker's own driver tool. Old is not wrong; a driver that works can stay. Then one numbered list holds two
kinds of offer:

- **Windows Update drivers** for this PC. Optional ones are listed too, marked `optional`.
- **Old third-party driver packages** in the driver store. The newest two copies of each driver always
  stay, so Device Manager's Roll Back keeps working, and inbox and boot-critical packages are never
  offered. Removal is Windows' own `pnputil /delete-driver` without `/force`, so Windows keeps a package a
  device still uses, and the section reports it as kept. Only an elevated run can read the driver store.

Your PC maker's own driver tool is named, never run: Lenovo System Update on a Lenovo, Dell Command | Update
on a Dell, HP Image Assistant on an HP, each with its winget id and the advice to leave anything marked BIOS
or firmware unticked. On the build machine on 2026-11-14, a pre-release build of this section did run
Lenovo System Update with its driver-and-app-only switch (`-packagetypes 1,2`), and System Update still
queued an IR-camera firmware package (type 4, "Integrated IR Camera Device Firmware"); a Lenovo package it
started then waited 13 hours behind a prompt nobody could see. The run was stopped before the firmware was
downloaded, and windowsweep no longer runs any PC maker's tool.

BIOS and firmware are never offered: a Windows Update driver whose class or title names BIOS, UEFI or
firmware is held back and counted. Installing a driver and removing an old package need an elevated run;
an unelevated real run lists, then refuses before asking. Nothing here restarts your PC.

On the build machine on 2026-11-13, an elevated run found no device with a problem, no Windows Update
driver and no driver with more than two copies in the store.

## 32 - App updates you pick

Interactive. winget lists the apps it can update, with the installed version, the available one and the
source. Each app you pick is upgraded silently from its publisher's package through winget, one at a time,
after you confirm. An app that is running is skipped until you close it. No elevation is needed, though an
installer that writes for every user may show its own UAC prompt. An app whose Id winget cut short in its
table is not offered, because a cut Id cannot name the package; the apps in winget's second list, which it
updates only when each is named, are counted and not offered. Without winget, which comes with App
Installer from the Microsoft Store, the section has nothing to ask. A dry-run updates nothing.

On the build machine on 2026-11-13, section 32 listed 20 winget updates.

## Candidate targets awaiting verification

A path becomes a target only once it has been seen on a real machine holding only regenerable data. These are
researched but **not shipped**, because the software is not installed on the build machine and a guessed path
is exactly what this rule exists to prevent. Each will be added once its folder can be confirmed.

| Would join | Candidate | What has to be seen first |
|---|---|---|
| 8 | Telegram Desktop `tdata\user_data\cache` and `media_cache` | Telegram installed; the two folders present |
| 8 | WhatsApp (Store) cache leaf under its package `LocalCache` | the exact leaf name, which the package layout decides |
| 8 | Microsoft Office `16.0\OfficeFileCache` (prune only, Office guards) | Office installed - it holds unsynced changes, so it is pruned, never cleared |
| 8 | Steam `steamapps\shadercache` per library in `libraryfolders.vdf` | Steam with games installed (the build machine has Steam but no games) |
| 8 | WebView2 `%LOCALAPPDATA%\*\EBWebView` as a Chromium layout | a host app that uses it; the layout itself is already proven by the Teams target |
| 1 | `~\.cache\torch` | PyTorch installed |
| 1 | `conda clean --all --yes` | conda on `PATH` |
| new | Driver and upgrade leftovers: `C:\NVIDIA`, `ProgramData\NVIDIA Corporation\Downloader`, `C:\AMD`, `C:\ESD` | any of them present on a machine with that vendor's driver |

**`C:\Intel` was inspected and rejected.** It exists on the build machine but holds `Thunderbolt`, `Logs` and
a hidden `GfxCPLBatchFiles` - driver support content, not installer extraction leftovers. It will not become
a target.

Last Updated: 2026-11-14
