# FAQ

**Will it delete my code, documents or photos?**
Documents, Pictures, Desktop, Music, Videos and cloud-sync folders are protected roots. Section 19 scans
Downloads and folders you add, so it can offer a personal or code file there when it is large or old.
It removes only the exact files you pick, sends them to the Recycle Bin by default, and refuses a file
that changed after the scan. Section 17 separately offers stale build artefacts, not source files.

**Does it phone home?**
No. The command-line tool makes no network calls at all. Self-test check [9] greps every source file for seven call shapes (`Invoke-WebRequest`, `Invoke-RestMethod`, `Net.WebClient`, `HttpClient`, `Sockets.TcpClient`, `curl.exe` and `wget`) and fails the run if it finds one. `--report-issue` opens your browser at a pre-filled GitHub page after you confirm, and you submit it yourself. The desktop window is a different answer: it sends usage and crash reports to improve the product, and there is no switch. What it sends is listed on the [Desktop app](./desktop.md) page.

The tools windowsweep runs for you keep their own habits: `winget` and `npm` may check their own sources and
send their own telemetry; the engine itself never does. Section 24 runs `winget list`, which refreshes
its own sources and is the one most likely to show in a firewall log; sections 1 and 22 run `npm`
commands, and npm checks the registry for its own updates unless you set `update-notifier=false`.

**Why is there no undo?**
Caches regenerate; an undo copy would consume the disk you are trying to free. Chosen files and leftover
folders in sections 18, 19, 23 and 27 go to the Recycle Bin by default. Section 26 runs a program's own
uninstaller, and that has no undo. The session log records what happened; it is not a restore command.

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
engine is readable script across `windowsweep.ps1`, `lib/` and `modules/`, and `--self-test` runs 221
checks on your machine in the 1.4.0 source tree.

**Does it run on Windows Server?**
The engine uses nothing newer than Windows 10 1809 / Server 2019. Real cleanups have been verified
on Windows 10 so far; a Windows 11 run is on the verification list. No real cleanup has been verified on Server.

**Where are the logs?**
`%USERPROFILE%\.windowsweep\logs\`. Reports are beside them; `windowsweep --reports` browses them, and `--stats` prints the run history and the total reclaimed.

Last Updated: 2026-11-03
