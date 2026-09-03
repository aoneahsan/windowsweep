# FAQ

**Will it delete my code, documents or photos?**
No. Documents, Pictures, Desktop, Music, Videos and cloud-sync folders are protected roots the chokepoint
refuses outright. The only project-adjacent target is section 17, which lists build artefacts (`node_modules`,
`dist`, ...) in idle projects and removes nothing you did not select.

**Does it phone home?**
No. The source contains no HTTP or socket call; the self-test greps for them. `--report-issue` opens your
browser at a pre-filled GitHub page after you confirm, and you submit it yourself.

**Why is there no undo?**
Caches regenerate; an undo copy would consume the disk you are trying to free. Personal files (sections 18 and
19) go to the Recycle Bin instead, which is Windows' undo. Every deletion is recorded in the session log.

**Why does it keep files used in the last 100 days?**
Because a developer's caches are what make the next install or build fast. The idle gate keeps recent work;
`--days`, `--purge-all` and developer mode off are the knobs when you want more. See
[Developer mode](./developer-mode.md).

**Why is Chrome skipped?**
An open browser keeps its cache files locked and half-written. Close it and run `windowsweep --only 7 --yes`.

**Why never Prefetch?**
Windows uses Prefetch to start programs faster and repopulates it if cleared, so clearing it makes the machine
slower for a while and frees almost nothing.

**Will freeing space make my PC faster?**
A system drive below roughly 10% free slows Windows badly (temp files, updates, paging and browser caches all
fight for room), so getting out of that zone helps a lot. Beyond that, disk cleanup is about space, not speed.

**Is a weekly Scheduled Task safe?**
`--install-task` schedules `--all --yes`: the safe batch only, under your account, no admin sections, no
personal files, no deep sections. Review the first run's report before scheduling.

**Why PowerShell rather than an .exe?**
Every Windows machine has PowerShell 5.1, so there is no runtime to install and no binary to trust. The source
is readable in an afternoon and the self-test runs on your machine.

**Does it run on Windows Server?**
The engine uses nothing newer than Windows 10 1809 / Server 2019. CI runs the self-test and a dry-run of
the safe batch on Windows Server (GitHub's `windows-latest`) on every push. Real cleanups have been verified
on Windows 10 so far; a Windows 11 run is on the verification list.

**Where are the logs?**
`%USERPROFILE%\.windowsweep\logs\`. Reports are beside them; `windowsweep --reports` browses them.

Last Updated: 2026-09-03
