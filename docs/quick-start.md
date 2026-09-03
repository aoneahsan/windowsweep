# Quick start

Four commands, from "prove it is safe" to "reclaim the space". Nothing is deleted until the fourth.

## 1. Verify the safety guards on your machine

```powershell
npx windowsweep --self-test
```

The self-test parses every script, checks that every declared target lies outside the protected paths, and runs
a fixture with a real junction to prove links are never followed and that `--dry-run` writes nothing. It ends
with a pass count and exits non-zero on any failure.

## 2. See what is there

```powershell
npx windowsweep --scan
```

Read-only. Prints a health report (drives, hibernation file, disk images, running apps that block cache
steps), every target with its size on disk, and the personal-file scanners' findings.

## 3. Rehearse the cleanup

```powershell
npx windowsweep --dry-run --all --yes
```

Runs the safe batch exactly as a real run would, printing `[dry-run] would ...` lines and an estimate per
section, and writes a JSON report you can export. A non-interactive run defaults to developer mode on; pass
`--not-developer` if that is wrong for the machine.

## 4. Clean

```powershell
npx windowsweep
```

The guided walkthrough. On the first run it asks whether you are a developer (see
[Developer mode](./developer-mode.md)), shows a pre-scan, then visits each section: `a` runs it, `s` skips it,
`q` stops. Every section names what it removes before it acts, keeps a running total, and the summary at the
end lists the log, the report and the follow-up commands (admin sections, browsers that were open).

Unattended alternative, for a Scheduled Task or a script:

```powershell
npx windowsweep --all --yes
```

## 5. The admin step

Sections 12-16 need an elevated console. When you are at the keyboard:

```powershell
npx windowsweep --profile system --yes --elevate
```

Details and the hibernation decision: [Admin sections and elevation](./admin-and-elevation.md).

Last Updated: 2026-09-03
