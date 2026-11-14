# FAQ

**Will it delete my code, documents or photos?**
Documents, Pictures, Desktop, Music, Videos and cloud-sync folders are protected roots. Section 19 scans
Downloads and folders you add, so it can offer a personal or code file there when it is large or old.
It removes only the exact files you pick, always sends them to the Recycle Bin, and refuses a file
that changed after the scan. Section 17 separately offers stale build artefacts, not source files.

**Does it phone home?**
No. Cleanup never touches the network, and the engine's own code holds no network call: self-test check [9] greps every source file for seven call shapes (`Invoke-WebRequest`, `Invoke-RestMethod`, `Net.WebClient`, `HttpClient`, `Sockets.TcpClient`, `curl.exe` and `wget`) and fails the build if it finds one. Only sections 30, 31 and 32, for the rows you pick, ask Windows Update or winget to download; windowsweep itself sends nothing. `--report-issue` opens your browser at a pre-filled GitHub page after you confirm, and you submit it yourself. The desktop window is a different answer: it sends usage and crash reports to improve the product, and there is no switch. What it sends is listed on the [Desktop app](./desktop.md) page.

The tools windowsweep runs for you keep their own habits: `winget` and `npm` may check their own sources and
send their own telemetry; the engine itself never does. Section 24 runs `winget list`, which refreshes
its own sources; sections 1 and 22 run `npm` commands, and npm checks the registry for its own updates
unless you set `update-notifier=false`. Sections 30 and 31 ask Windows Update for their lists and section
32 asks winget, so each of those reaches out as soon as it runs, before you pick anything.

**Will it install updates or restart my PC on its own?**
No. Sections 30, 31 and 32 list what Windows Update and winget offer, and install only the rows you pick,
one at a time, after you confirm. They never run in `--all`, a profile or the walkthrough, and `--yes`
never picks for them. Nothing in them restarts your PC; windowsweep says when Windows wants a restart. BIOS
and firmware are never offered, and section 31 names your PC maker's own driver tool without running it:
on a ThinkPad, Lenovo System Update queued a firmware package past its driver-only switch.

**Why is there no undo?**
Caches regenerate; an undo copy would consume the disk you are trying to free. Section 19 always sends
chosen files to the Recycle Bin. Chosen items in sections 18, 23, 26 and 27 go there too, unless you pass
`--permanent`. Section 26 runs a program's own uninstaller, or `Remove-AppxPackage` for a Store app, and
that has no undo. The registry is the exception: a key or startup entry removed in section 26 or 27 is
exported to a `.reg` file first, and a task to XML. The session log records what happened; it is not a
restore command.

**Is it a registry cleaner?**
No. It removes registry entries only for rows you pick that belong to programs already gone: a removed
program's own keys, a startup entry whose program file is gone, and an uninstall entry whose uninstaller
is gone. Shared keys (Microsoft, Classes, Policies, hardware makers, toolchains, browsers) are never
offered. Each key is exported as a `.reg` file to `registry-backups` in the reports folder before it goes;
double-click the file to put it back.

**Can it remove Store apps?**
Yes, in section 26, for your Windows account. Store apps sit in the same list as desktop programs, and each
one you pick is removed with Windows' own `Remove-AppxPackage`, one at a time, never while it is running.
Frameworks, runtimes, codecs, the Store and winget, WSL and the apps that drive your hardware are never
listed. Windows may put an inbox app back for a new account or after a feature update.

**Why does it keep files used in the last 100 days?**
Because a developer's caches are what make the next install or build fast. The idle gate keeps recent work;
`--days`, `--purge-all` and developer mode off are the knobs when you want more. See
[Developer mode](./developer-mode.md).

**How does it decide a file is old?**
The engine checks whether last-access tracking is live on each volume. If it is, the age uses write and
creation time; otherwise it uses the newest of write, access and creation. Section 19 shows the basis on
each candidate. An old timestamp does not prove a file is unneeded, so the scanner selects nothing for you.

**Why is Chrome skipped?**
An open browser keeps its cache files locked and half-written. Close it and run `windowsweep --only 7 --yes`.

**Why never Prefetch?**
Windows uses Prefetch to start programs faster and rebuilds it if cleared, so clearing it makes the machine slower for a while and frees little. It is a protected subtree; no flag reaches it.

**Will freeing space make my PC faster?**
Mostly no. Disk cleanup is about space. The exception is a system drive with very little room left: Windows needs free space to page, to stage updates and to hold temp files, and below roughly 10% those start competing. Section 0 warns at that line, so `windowsweep --scan` tells you whether you are in that zone.

**Is a weekly Scheduled Task safe?**
`--install-task` schedules `--all --yes --quiet --no-color --notify`: the safe batch only, under your
account, no personal files and no deep sections. If the task runs elevated, the safe admin sections
can join the batch. Review the first run's report before scheduling. Install globally first
(`npm install -g windowsweep`); from `npx` the installer refuses because that cache is evicted.

**Why PowerShell rather than an .exe?**
Every Windows machine has PowerShell 5.1, so there is no runtime to install and no binary to trust. The
engine is readable script across `windowsweep.ps1`, `lib/` and `modules/`, and `--self-test` runs 223
checks on your machine in 1.4.0.

**Does it run on Windows Server?**
The engine uses nothing newer than Windows 10 1809 / Server 2019. Real cleanups have been verified
on Windows 10 so far; a Windows 11 run is on the verification list. No real cleanup has been verified on Server.

**Where are the logs?**
`%USERPROFILE%\.windowsweep\logs\`. Reports are beside them; `windowsweep --reports` browses them, and `--stats` prints the run history and the total reclaimed. Registry backups go to `reports\registry-backups\`.

Last Updated: 2026-11-14
