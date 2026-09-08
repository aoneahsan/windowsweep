# FAQ

**Will it delete my code, documents or photos?**
No. Documents, Pictures, Desktop, Music, Videos and cloud-sync folders are protected roots the chokepoint
refuses outright. The only project-adjacent target is section 17, which lists build artefacts (`node_modules`,
`dist`, ...) in idle projects and removes nothing you did not select.

**Does it phone home?**
**Does it phone home?**
No. The command-line tool makes no network calls at all. Self-test check [9] greps every source file for seven call shapes (`Invoke-WebRequest`, `Invoke-RestMethod`, `Net.WebClient`, `HttpClient`, `Sockets.TcpClient`, `curl.exe` and `wget`) and fails the run if it finds one. `--report-issue` opens your browser at a pre-filled GitHub page after you confirm, and you submit it yourself. The desktop window is a different answer: it sends usage and crash reports to improve the product, and there is no switch. What it sends is listed on the [Desktop app](./desktop.md) page.

The tools windowsweep runs for you keep their own habits: `winget` and `npm` may check their own sources and
send their own telemetry; the engine itself never does. Section 24 runs `winget list`, which refreshes
its own sources and is the one most likely to show in a firewall log; sections 1 and 22 run `npm`
commands, and npm checks the registry for its own updates unless you set `update-notifier=false`.

**Why is there no undo?**
**Why is there no undo?**
Caches regenerate; an undo copy would consume the disk you are trying to free. Personal files - sections 18, 19 and 23 - go to the Recycle Bin instead, which is Windows' undo. Every deletion is recorded in the session log, which is a record rather than a restore.

**Why does it keep files used in the last 100 days?**
Because a developer's caches are what make the next install or build fast. The idle gate keeps recent work;
`--days`, `--purge-all` and developer mode off are the knobs when you want more. See
[Developer mode](./developer-mode.md).

**Why is Chrome skipped?**
An open browser keeps its cache files locked and half-written. Close it and run `windowsweep --only 7 --yes`.

**Why never Prefetch?**
**Why never Prefetch?**
Windows uses Prefetch to start programs faster and rebuilds it if cleared, so clearing it makes the machine slower for a while and frees little. It is a protected subtree; no flag reaches it.

**Will freeing space make my PC faster?**
**Will freeing space make my PC faster?**
Mostly no. Disk cleanup is about space. The exception is a system drive with very little room left: Windows needs free space to page, to stage updates and to hold temp files, and below roughly 10% those start competing. Section 0 warns at that line, so `windowsweep --scan` tells you whether you are in that zone.

**Is a weekly Scheduled Task safe?**
`--install-task` schedules `--all --yes --quiet --no-color --notify`: the safe batch only, under your
account, no admin sections, no
personal files, no deep sections. Review the first run's report before scheduling. Install globally first
(`npm install -g windowsweep`); from `npx` the installer refuses because that cache is evicted.

**Why PowerShell rather than an .exe?**
**Why PowerShell rather than an .exe?**
Every Windows machine has PowerShell 5.1, so there is no runtime to install and no binary to trust. The engine is 5,588 lines of readable script across `windowsweep.ps1`, `lib/` and `modules/`, and `--self-test` runs 155 checks of it on your machine.

**Does it run on Windows Server?**
The engine uses nothing newer than Windows 10 1809 / Server 2019. CI runs the self-test and a dry-run of
the safe batch on Windows Server (GitHub's `windows-latest`) on every push to `main` and on every pull request. Real cleanups have been verified
on Windows 10 so far; a Windows 11 run is on the verification list.

**Where are the logs?**
**Where are the logs?**
`%USERPROFILE%\.windowsweep\logs\`. Reports are beside them; `windowsweep --reports` browses them, and `--stats` prints the run history and the total reclaimed.

Last Updated: 2026-09-05
