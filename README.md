<div align="center">

<img src="https://raw.githubusercontent.com/aoneahsan/windowsweep/main/assets/logo/windowsweep-mark.svg" alt="windowsweep logo" width="120" />

<h1>windowsweep</h1>

<p><strong>Safe-by-default Windows cleanup CLI - developer-aware, dry-run first, zero install via npx.</strong></p>

[![npm version](https://img.shields.io/npm/v/windowsweep.svg)](https://www.npmjs.com/package/windowsweep)
[![downloads](https://img.shields.io/npm/dm/windowsweep.svg)](https://www.npmjs.com/package/windowsweep)
[![license](https://img.shields.io/npm/l/windowsweep.svg)](https://github.com/aoneahsan/windowsweep/blob/main/LICENSE)
[![ci](https://github.com/aoneahsan/windowsweep/actions/workflows/ci.yml/badge.svg)](https://github.com/aoneahsan/windowsweep/actions/workflows/ci.yml)
[![node](https://img.shields.io/node/v/windowsweep.svg)](https://nodejs.org)
[![platform](https://img.shields.io/badge/platform-Windows%2010%20%7C%2011-0078d4?logo=windows&logoColor=white)](https://github.com/aoneahsan/windowsweep#platform-support)

[Docs](https://github.com/aoneahsan/windowsweep/blob/main/docs/README.md) · [npm](https://www.npmjs.com/package/windowsweep) · [GitHub](https://github.com/aoneahsan/windowsweep) · [Changelog](https://github.com/aoneahsan/windowsweep/blob/main/CHANGELOG.md) · [Contributing](https://github.com/aoneahsan/windowsweep/blob/main/CONTRIBUTING.md) · [Support](https://github.com/aoneahsan/windowsweep/issues)

</div>

> [!IMPORTANT]
> **This tool deletes files.** Most of what it removes are caches that rebuild themselves; personal files it
> lists go to the Recycle Bin; two sections (emptying the Recycle Bin, clearing event logs) are permanent and
> gated behind a separate flag. Start with `npx windowsweep --scan`, which deletes nothing, then
> `npx windowsweep --dry-run --all --yes`, which shows exactly what a real run would remove.
> **Windows only** - npm refuses to install it elsewhere.

`windowsweep` reclaims the disk space that quietly disappears on a Windows machine: package-manager and build
caches, browser and app caches, Windows temp and update leftovers, stale `node_modules`, half-finished downloads.
It is a PowerShell tool with a thin Node launcher, so `npx windowsweep` runs it with nothing to install. What
sets it apart is restraint: it asks whether you are a developer and keeps the caches you used in the last
100 days, it names every path before touching it, it never follows a junction, and it makes no network calls.
It is the Windows member of a family with [linux-cleanup](https://github.com/aoneahsan/linux-cleanup) and
[macleanup](https://github.com/aoneahsan/macleanup).

| | |
|---|---|
| **Version** | `1.0.0` |
| **License** | MIT |
| **Node** | `>=14` (launcher only) |
| **Runtime** | Windows PowerShell 5.1 (built in) or PowerShell 7 |
| **Platforms** | Windows 10 (1809+) and Windows 11 |
| **Install size** | ~78 kB packed · ~263 kB unpacked · 37 files · no dependencies |
| **Undo** | Recycle Bin for personal files; none for caches (they regenerate) |
| **Status** | Stable · actively maintained |

<a id="table-of-contents"></a>
## 🧭 Table of Contents&nbsp;[#](#table-of-contents)

- [💡 Why windowsweep](#why-windowsweep)
- [✨ Features](#features)
- [📱 Platform Support](#platform-support)
- [📋 Requirements](#requirements)
- [📦 Installation](#installation)
- [🚀 Quick Start](#quick-start)
- [🛠️ Usage](#usage)
- [⚙️ Configuration](#configuration)
- [💻 Command Line](#command-line)
- [🧪 Examples](#examples)
- [🎛️ Advanced Features](#advanced-features)
- [🚑 Recovery & Troubleshooting](#recovery-troubleshooting)
- [🚧 Limitations](#limitations)
- [❓ FAQ](#faq)
- [📚 Documentation](#documentation)
- [🔄 Changelog](#changelog)
- [🤝 Contributing](#contributing)
- [🗂️ Repository](#repository)
- [💬 Support](#support)
- [📄 License](#license)
- [👤 Author](#author)
- [🔗 Links](#links)
- [🏷️ Keywords](#keywords)

<a id="why-windowsweep"></a>
## 💡 Why windowsweep&nbsp;[#](#why-windowsweep)

A Windows machine that is also a development machine fills up in places Disk Cleanup has never heard of: the
Yarn and npm caches, Gradle, Cypress and Playwright browsers, Android emulator images, Docker's virtual disk,
`node_modules` for a project you finished in spring, editor caches, two hundred profiles' worth of Chrome cache.
Clearing them by hand means keeping a private list of paths and remembering which ones bite back.

A cleaner that wipes every cache it finds trades one problem for another: the next `yarn install` re-downloads
twelve gigabytes and your afternoon is gone. `windowsweep` takes the narrower path.

| | `windowsweep` | Windows Disk Cleanup / Storage Sense | A wipe-everything cleaner |
|---|---|---|---|
| **Knows developer caches** | yarn, npm, pnpm, Gradle, Cypress, Playwright, AVDs, Docker, editors | no | some |
| **Default action** | prune files idle 100+ days; keep the newest version of every tool | fixed categories | wipe the whole cache |
| **Personal folders** | hard refusal, no flag bypasses it | out of scope | usually configurable |
| **Junctions and symlinks** | never followed | n/a | varies |
| **Dry-run** | every section, exact estimate | no | sometimes |
| **Unattended use** | `--all --yes`, Scheduled Task | Storage Sense | GUI-first |
| **Network calls** | none | Microsoft telemetry | varies |

Nothing here can promise a number. How much comes back depends on your disk; `--scan` measures it.

**Not the right tool when** you want a graphical, set-and-forget cleaner; when you are on Linux or macOS (use the
siblings); when you want an undo for caches (there is none - they regenerate); or when you are looking for a
security scanner or a registry cleaner. It reclaims disk space, nothing else.

<a id="features"></a>
## ✨ Features&nbsp;[#](#features)

- **Developer mode** - one question on the first run. Yes keeps package, build and test-runner caches used in
  the last 100 days and the newest version of every versioned tool; no clears them completely.
- **22 numbered sections** - from package-manager caches to Windows Update leftovers, each naming its paths
  before it acts. Numbers are a public contract.
- **One deletion chokepoint** - refuses drive roots, Windows, Program Files, your profile root, personal
  folders, credentials, toolchains and browser or editor state; asserts every deletion sits inside its declared
  target; never follows a junction or symlink; handles paths beyond 260 characters; skips files another program
  has open.
- **A dry-run that writes nothing** - `--dry-run` short-circuits every deletion and every destructive command
  and reports an exact estimate. `--scan` and `--list-targets` are read-only.
- **Personal files go to the Recycle Bin** - partial downloads and large stale files are listed, you pick, and
  Windows keeps the undo.
- **Batch policy** - `--all` runs the safe batch only; deep sections need `--i-understand-deep`; personal
  sections never run unattended.
- **Admin awareness** - sections that need Administrator rights skip with the exact command when the console
  is not elevated; `--elevate` relaunches through a UAC prompt.
- **Running-app guard** - an open browser, editor or app keeps its caches; the tool tells you which to close.
- **Session reports** - schema-versioned JSON, exportable to Markdown or a self-contained HTML page, plus
  `--json` for scripts.
- **Self-test** - proves the guards on your machine with a real junction, a 400-character path and a dry-run
  fixture before you trust it.
- **Offline by design** - zero network calls, no telemetry, no update check. Crash bundles stay on disk.

<a id="platform-support"></a>
## 📱 Platform Support&nbsp;[#](#platform-support)

| Platform | Supported | Notes |
|---|---|---|
| Windows 11 | ✅ | Same engine and PowerShell hosts; a real run on Windows 11 is on the verification list ([roadmap](https://github.com/aoneahsan/windowsweep/blob/main/remaining-work-summary.md)) |
| Windows 10 (1809 and later) | ✅ | The primary development target; every real run so far |
| Windows Server 2019+ | ⚠️ | Uses nothing newer than 1809; CI runs the self-test and a dry-run on Windows Server (`windows-latest`) on every push, but no real cleanup has been run on Server |
| Linux | ❌ | `os: ["win32"]` makes npm refuse to install; use [linux-cleanup](https://github.com/aoneahsan/linux-cleanup) |
| macOS | ❌ | Use [macleanup](https://github.com/aoneahsan/macleanup) |

<a id="requirements"></a>
## 📋 Requirements&nbsp;[#](#requirements)

| Requirement | Version | Why |
|---|---|---|
| Windows PowerShell | `5.1` | Ships with Windows 10 and 11; the engine is written for it. PowerShell 7 also works (`--pwsh`) |
| Node.js | `>=14` | Only for `npx` and `npm install -g`. The `.cmd` launcher and `windowsweep.ps1` need no Node |
| Administrator rights | optional | Only sections 12-16 and 20 (Windows Update cache, Disk Cleanup engine, DISM, hibernation, event logs, disk-image compaction) |
| `docker` | optional | Section 5 only |

`windowsweep --self-test` reports which optional tools are missing on your machine.

<a id="installation"></a>
## 📦 Installation&nbsp;[#](#installation)

No install needed:

```powershell
npx windowsweep --scan
```

To keep it on your `PATH`:

```powershell
npm install -g windowsweep
```

Or clone the repository and run it without Node:

```powershell
git clone https://github.com/aoneahsan/windowsweep.git
cd windowsweep
.\windowsweep.cmd --self-test
```

Both launchers start PowerShell with `-ExecutionPolicy Bypass`, so the machine's script policy never blocks a
run. Logs and reports land in `%USERPROFILE%\.windowsweep\` on every path - outside the npm cache, so history
survives `npx` evictions. Full detail:
[Installation](https://github.com/aoneahsan/windowsweep/blob/main/docs/installation.md).

<a id="quick-start"></a>
## 🚀 Quick Start&nbsp;[#](#quick-start)

Prove the guards, look, rehearse, then clean:

```powershell
npx windowsweep --self-test
npx windowsweep --scan
npx windowsweep --dry-run --all --yes
npx windowsweep
```

The last command is the guided walkthrough: it asks the developer question, shows a pre-scan, then visits each
section with `a` run / `s` skip / `q` quit and a running total.

<a id="usage"></a>
## 🛠️ Usage&nbsp;[#](#usage)

### The sections

**Tier** says what happens to the data: *report* deletes nothing, *rebuilds* comes back on its own, *slow*
comes back but costs minutes, *Recycle Bin* is recoverable until you empty it, *permanent* is not, *config*
changes a setting.

| # | Section | Tier | Admin | Batch |
|---|---|---|:-:|---|
| 0 | System health report | report | - | safe |
| 1 | Package-manager caches (npm, yarn, pnpm, bun, deno, pip, uv, Composer, NuGet, Cargo, Go, pub) | rebuilds | - | safe · developer-gated |
| 2 | Build-tool caches (Gradle, Maven, Android, Unity, JetBrains) | rebuilds | - | safe · developer-gated |
| 3 | Test-runner browsers (Cypress, Playwright, Puppeteer) - newest kept | rebuilds | - | safe · developer-gated |
| 4 | Android emulators idle N+ days | slow | - | opt-in |
| 5 | Docker: dangling layers, build cache, unused images older than N days | rebuilds | - | safe · developer-gated |
| 6 | Editor caches, dead workspace storage, uninstalled extension folders | rebuilds | - | safe |
| 7 | Browser caches, every profile (Chrome, Edge, Brave, Vivaldi, Opera, Firefox, ...) | rebuilds | - | safe |
| 8 | Desktop-app caches (Slack, Teams, Discord, Postman, Figma, Spotify, ...) | rebuilds | - | safe |
| 9 | Windows user caches (shader caches, error reports, crash dumps, Store-app temp) | rebuilds | - | safe |
| 10 | User temp files idle 3+ days | rebuilds | - | safe |
| 11 | Empty the Recycle Bin | **permanent** | - | deep |
| 12 | Windows Update cache, Delivery Optimization, `Windows\Temp`, servicing logs | rebuilds | yes | safe when elevated |
| 13 | Disk Cleanup engine with a curated handler list | rebuilds | yes | safe when elevated |
| 14 | Component store cleanup (DISM) | rebuilds | yes | opt-in |
| 15 | Hibernation file off or reduced | config | yes | deep |
| 16 | Clear Windows Event Logs | **permanent** | yes | deep |
| 17 | Stale project build artefacts (`node_modules`, `dist`, `.next`, `target`, ...) | rebuilds | - | interactive |
| 18 | Partial / orphan downloads | Recycle Bin | - | interactive |
| 19 | Large stale personal files in Downloads | Recycle Bin | - | interactive |
| 20 | Docker Desktop / WSL disk-image compaction | config | yes | deep |
| 21 | Disk usage report | report | - | safe |

*Safe* sections run in `--all`; *opt-in* ones run when named in `--only` or a profile; *deep* ones also need
`--i-understand-deep`; *interactive* ones never run unattended. Every section is documented in
[Sections 0-21](https://github.com/aoneahsan/windowsweep/blob/main/docs/sections.md).

### Clean interactively

```powershell
windowsweep            # guided walkthrough, one confirmation per step
windowsweep --menu     # jump to one section; toggle dry-run and auto-yes
```

### Clean unattended

```powershell
windowsweep --all --yes
windowsweep --profile dev --yes
windowsweep --only 1,7,10 --yes
```

`--yes` applies to regenerable caches only. No flag combination batch-deletes personal files.

### System-level cleanup

```powershell
windowsweep --profile system --yes --elevate
```

Relaunches through a UAC prompt and runs the Windows Update, Disk Cleanup and DISM sections. Add the
hibernation file with `--only 12,13,14,15 --hiberfil off --yes --i-understand-deep --elevate`.

<a id="configuration"></a>
## ⚙️ Configuration&nbsp;[#](#configuration)

There is no configuration you must do. Defaults live in `%USERPROFILE%\.windowsweep\config.json`
(`developer`, `days`, `tempDays`, `largeFileMb`, `scanRoots`, `excludePaths`); flags always win.

| Variable | Default | What it does |
|---|---|---|
| `WINDOWSWEEP_HOME` | `%USERPROFILE%\.windowsweep` | Data directory for logs, reports, bundles and config |
| `WINDOWSWEEP_LOG_DIR`, `WINDOWSWEEP_REPORTS_DIR` | under the data directory | Same as `--logs-dir` / `--reports-dir` |
| `WINDOWSWEEP_SHELL` | `powershell` | `pwsh` runs the engine on PowerShell 7 (launcher only) |
| `NO_COLOR`, `WINDOWSWEEP_NO_COLOR` | unset | Disable colour |
| `WINDOWSWEEP_ASCII` | unset | Plain ASCII glyphs |

Full reference: [CLI reference](https://github.com/aoneahsan/windowsweep/blob/main/docs/cli-reference.md).

<a id="command-line"></a>
## 💻 Command Line&nbsp;[#](#command-line)

```powershell
windowsweep [mode] [options]
```

| Mode | Flag | What it does |
|---|---|---|
| Walkthrough | *(default)* · `-w` | 🔥 Every section, one confirmation per step |
| Menu | `-m` | 🔥 One section at a time |
| Safe batch | `-a`, `--all` | 🔥 Sections 0,1,2,3,5,6,7,8,9,10,21 (+12,13 when elevated) |
| Only / profile / exclude | `--only L`, `--profile NAME`, `--exclude L` | 🔥 Exactly these sections; profiles `dev`, `minimal`, `cache-only`, `system`, `deep`, `audit` |
| Scan | `-s`, `--scan` | Read-only: health, sizes, personal-file scanners |
| List targets | `--list`, `--list-targets` | The catalogue; every path the tool can touch |
| Self-test | `--self-test` | Syntax, ASCII-only source, guards, junction and dry-run fixtures |
| Reports | `--reports`, `--export F [ID]`, `--stats`, `--prune-history N` | Browse, export (md/html), summarise, prune |
| Setup | `--install-task`, `--install-alias` (and `--uninstall-*`) | Weekly Scheduled Task; `cleanup` profile function |
| Feedback | `--feedback`, `--report-issue`, `--debug-bundle` | Offline help; a pre-filled issue you review first |
| Version / help | `-V`, `-h` | |

| Option | Default | What it does |
|---|---|---|
| `--dry-run` | off | Delete nothing; show what would go and how much it frees |
| `-y`, `--yes` | off | Auto-confirm regenerable caches. Never personal files |
| `--i-understand-deep` | off | Allow sections 11, 15, 16, 20 unattended (with `--yes`) |
| `--elevate` | off | Relaunch elevated through a UAC prompt |
| `-d N`, `--days N` | `100` | Idle window: a file goes when its newest timestamp is N+ days old |
| `--temp-days N` | `3` | Idle window for temp folders |
| `--purge-all` | off | 🔥 Clear cache targets completely instead of pruning idle files |
| `--developer`, `--not-developer`, `--forget-developer` | saved answer | Override or re-ask the developer question |
| `--scan-roots "P1;P2"`, `--exclude-path P` | auto | Section 17 roots and exclusions |
| `--hiberfil off\|reduced\|keep` | ask | What section 15 does |
| `--permanent` | off | Sections 18/19 delete instead of using the Recycle Bin |
| `--json`, `--quiet`, `--no-color`, `--ascii`, `--no-report`, `--cleanup-logs` | off | Output and record controls |

Every flag, exit code and environment variable:
[CLI reference](https://github.com/aoneahsan/windowsweep/blob/main/docs/cli-reference.md).

<a id="examples"></a>
## 🧪 Examples&nbsp;[#](#examples)

| Goal | Command |
|---|---|
| See what is reclaimable, risk-free | `windowsweep --scan` |
| Rehearse tonight's cleanup | `windowsweep --dry-run --all --yes` |
| Reclaim the most space as a developer | `windowsweep --profile dev --yes` |
| Reclaim everything a non-developer can | `windowsweep --all --yes --not-developer` |
| Find `node_modules` in projects idle 6 months | `windowsweep --only 17 --days 180 --scan-roots "D:\work"` |
| Free the browser caches after closing the browsers | `windowsweep --only 7 --yes` |
| Run the admin sections | `windowsweep --profile system --yes --elevate` |
| Weekly unattended run | `windowsweep --install-task` |
| Machine-readable output for a script | `windowsweep --all --yes --json` |

<a id="advanced-features"></a>
## 🎛️ Advanced Features&nbsp;[#](#advanced-features)

- **Profiles** - `dev`, `minimal`, `cache-only`, `system`, `deep`, `audit`.
  [Docs](https://github.com/aoneahsan/windowsweep/blob/main/docs/profiles.md)
- **Keep-newest rule** - Cypress, Playwright, Gradle distributions and Squirrel app installs keep their newest
  version whatever the idle gate says.
  [Docs](https://github.com/aoneahsan/windowsweep/blob/main/docs/safety-model.md)
- **Editor hygiene** - workspace storage whose folder is gone and extension folders the editor's own
  `extensions.json` no longer references.
  [Docs](https://github.com/aoneahsan/windowsweep/blob/main/docs/sections.md)
- **Disk-image compaction** - hands back the space a Docker Desktop or WSL `.vhdx` never returns on its own.
  [Docs](https://github.com/aoneahsan/windowsweep/blob/main/docs/admin-and-elevation.md)
- **Report export** - schema-versioned JSON to Markdown or a self-contained HTML page, no extra tools.
  [Docs](https://github.com/aoneahsan/windowsweep/blob/main/docs/reports-and-logs.md)
- **Crash bundles** - captured locally on an unexpected exit, never transmitted.

<a id="recovery-troubleshooting"></a>
## 🚑 Recovery & Troubleshooting&nbsp;[#](#recovery-troubleshooting)

| Symptom | Cause | Fix |
|---|---|---|
| `running scripts is disabled on this system` | `windowsweep.ps1` started directly under the `Restricted` policy | Use `npx windowsweep`, `windowsweep.cmd`, or `powershell -ExecutionPolicy Bypass -File windowsweep.ps1` |
| `REFUSE (inside protected: ...)` | The path resolves inside a protected folder | Working as designed; `--list-targets` shows the list |
| `skipped: chrome is running` | The browser or app is open | Close it and run the section again |
| `needs Administrator rights - skipped` | The console is not elevated | Add `--elevate`, or run the `system` profile |
| `The walkthrough needs an interactive console` | stdin is redirected | Use `--all --yes` or `--dry-run` |
| Reclaimed less than `--scan` showed | The idle gate kept recently used files; open apps were skipped | Lower `--days`, close the apps, or `--purge-all` |
| An extension folder was removed | The editor's `extensions.json` no longer referenced it | Reinstall from the editor; referenced folders are never touched |

More: [Troubleshooting](https://github.com/aoneahsan/windowsweep/blob/main/docs/troubleshooting.md).

<a id="limitations"></a>
## 🚧 Limitations&nbsp;[#](#limitations)

- **No undo for caches.** They regenerate on next use; that is the whole design. Personal files use the Recycle
  Bin instead.
- **Windows only.** Linux and macOS are blocked at install and at launch.
- **It cannot promise a number.** `--scan` measures your disk; the README will not guess.
- **The idle gate is conservative.** Windows keeps last-access times off on most volumes, so the tool reads the
  newest of write, access and creation time - a file can only look fresher than it is, never older. Some old
  caches survive the default window; `--days` and `--purge-all` exist for that.
- **Admin sections need an elevated console** and a UAC click; a Scheduled Task runs the safe batch only.
- **Disk Cleanup (section 13) cannot preview** how much it will free; its dry-run lists the handlers only.
- **No automated test suite beyond `--self-test`.** Correctness rests on the self-test's fixtures, dry-runs and
  real runs on Windows 10 and 11.

<a id="faq"></a>
## ❓ FAQ&nbsp;[#](#faq)

**Will it delete my code or documents?**
Not from a protected folder, and not without asking. Documents, Desktop, Pictures and cloud-sync folders are
hard refusals. Section 17 lists build artefacts in idle projects and removes only what you select.

**Does it phone home?**
No. Zero network calls, no telemetry, no update check. The self-test greps the source for HTTP and socket
calls; `--report-issue` opens your browser at a pre-filled page you submit yourself.

**Why keep files used in the last 100 days?**
Because a developer's caches are what make the next install fast. `--days 30` or `--purge-all` when you want
more, `--not-developer` when the machine has no development on it.

**Why is Chrome skipped?**
An open browser keeps its cache files locked and half-written. Close it and run `windowsweep --only 7 --yes`.

**Why PowerShell rather than an .exe?**
Every Windows machine has PowerShell 5.1: no runtime to install, no binary to trust, and the source is readable
in an afternoon.

More: [FAQ](https://github.com/aoneahsan/windowsweep/blob/main/docs/faq.md).

<a id="documentation"></a>
## 📚 Documentation&nbsp;[#](#documentation)

| Document | Read it when |
|---|---|
| [Documentation index](https://github.com/aoneahsan/windowsweep/blob/main/docs/README.md) | you want the full map |
| [Quick start](https://github.com/aoneahsan/windowsweep/blob/main/docs/quick-start.md) | running your first cleanup |
| [Safety model](https://github.com/aoneahsan/windowsweep/blob/main/docs/safety-model.md) | you want every guarantee spelled out before deleting anything |
| [Developer mode](https://github.com/aoneahsan/windowsweep/blob/main/docs/developer-mode.md) | you want to know what the first question changes |
| [Sections 0-21](https://github.com/aoneahsan/windowsweep/blob/main/docs/sections.md) | you want to know precisely what one section touches |
| [CLI reference](https://github.com/aoneahsan/windowsweep/blob/main/docs/cli-reference.md) | you need an exact flag, exit code or variable |
| [Admin sections and elevation](https://github.com/aoneahsan/windowsweep/blob/main/docs/admin-and-elevation.md) | before running the system profile or touching the hibernation file |
| [Reports and logs](https://github.com/aoneahsan/windowsweep/blob/main/docs/reports-and-logs.md) | parsing the JSON or finding a log |
| [Troubleshooting](https://github.com/aoneahsan/windowsweep/blob/main/docs/troubleshooting.md) | something failed |
| [Roadmap and remaining work](https://github.com/aoneahsan/windowsweep/blob/main/remaining-work-summary.md) | you want to know what is verified, what is planned (1.1, the docs site) and what is still open |

<a id="changelog"></a>
## 🔄 Changelog&nbsp;[#](#changelog)

Latest release: **`1.0.0`** - first release: 22 sections, developer mode, the deletion chokepoint, dry-run, reports.
Full history: [CHANGELOG.md](https://github.com/aoneahsan/windowsweep/blob/main/CHANGELOG.md).

<a id="contributing"></a>
## 🤝 Contributing&nbsp;[#](#contributing)

Fork and open a pull request - no special access needed. See
[CONTRIBUTING.md](https://github.com/aoneahsan/windowsweep/blob/main/CONTRIBUTING.md) for setup, the
safety-first coding standards, and how to request collaborator access. `main` is protected: every change lands
through a reviewed PR.

<a id="repository"></a>
## 🗂️ Repository&nbsp;[#](#repository)

```text
windowsweep.ps1   entry point: argument parsing and dispatch (published)
windowsweep.cmd   launcher for machines without Node (published)
bin/              Node launcher used by npx and global install (published)
lib/              constants, UI, logging, filesystem walker, the safety chokepoint, config, scan, actions
modules/          one file per section group, plus walkthrough, menu, reports, self-test, crash trap
docs/             the manual (not shipped in the npm tarball)
assets/logo/      SVG logo masters
```

<a id="support"></a>
## 💬 Support&nbsp;[#](#support)

Questions and bugs: [open an issue](https://github.com/aoneahsan/windowsweep/issues). For a bug, run
`windowsweep --debug-bundle` first and attach the zip after reviewing it - it contains paths from your machine.
Security reports go privately to [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com); see
[SECURITY.md](https://github.com/aoneahsan/windowsweep/blob/main/SECURITY.md).

If this tool saved you time, you can support its maintenance at
[aoneahsan.com/payment](https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep).

<a id="license"></a>
## 📄 License&nbsp;[#](#license)

MIT © Ahsan Mahmood - see
[LICENSE](https://github.com/aoneahsan/windowsweep/blob/main/LICENSE). Provided "AS IS", without warranty;
this tool deletes files, so review what it proposes before confirming.

<a id="author"></a>
## 👤 Author&nbsp;[#](#author)

**Ahsan Mahmood** - [aoneahsan.com](https://aoneahsan.com) · [GitHub](https://github.com/aoneahsan) ·
[LinkedIn](https://linkedin.com/in/aoneahsan) · [aoneahsan@gmail.com](mailto:aoneahsan@gmail.com)

<a id="links"></a>
## 🔗 Links&nbsp;[#](#links)

| | |
|---|---|
| Documentation | https://github.com/aoneahsan/windowsweep/blob/main/docs/README.md |
| npm | https://www.npmjs.com/package/windowsweep |
| Repository | https://github.com/aoneahsan/windowsweep |
| Issues | https://github.com/aoneahsan/windowsweep/issues |
| Changelog | https://github.com/aoneahsan/windowsweep/blob/main/CHANGELOG.md |
| Contributing | https://github.com/aoneahsan/windowsweep/blob/main/CONTRIBUTING.md |
| Linux sibling | https://github.com/aoneahsan/linux-cleanup |
| macOS sibling | https://github.com/aoneahsan/macleanup |
| Support the project | https://aoneahsan.com/payment?project-id=windowsweep&project-identifier=windowsweep |

<a id="keywords"></a>
## 🏷️ Keywords&nbsp;[#](#keywords)

*windows · cleanup · disk-cleanup · cache-cleanup · disk-space · temp-files · node-modules · npm-cache ·
yarn-cache · developer-tools · powershell · cli · dry-run*
