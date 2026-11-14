# CLI reference

```powershell
windowsweep [mode] [options]
```

The flags are identical through `npx windowsweep`, the global `windowsweep` command, `windowsweep.cmd` and
`powershell -File windowsweep.ps1`. With no mode, the guided walkthrough starts. Modes marked with a fire mark
delete files (subject to every guard in the [safety model](./safety-model.md)).

## Modes

| Mode | Flags | What it does |
|---|---|---|
| Walkthrough (default) | `-w`, `--walkthrough` | 🔥 Guided run through every section, one confirmation per step |
| Menu | `-m`, `--menu` | 🔥 Pick one section at a time; toggle dry-run and auto-yes |
| Safe batch | `-a`, `--all` | 🔥 Sections 0,1,2,3,5,6,7,8,9,10,21,28 (+12,13 when elevated), no prompts with `--yes` |
| Only | `--only L` | 🔥 Exactly these sections, e.g. `--only 1,3,5-7` |
| Profile | `--profile NAME` | 🔥 A named bundle - see [Profiles](./profiles.md) |
| Scan | `-s`, `--scan` | Read-only: health report, every target with its size, personal-file scanners |
| List | `--list` | The section catalogue |
| List targets | `--list-targets` | Every path the tool can touch, plus the protected list |
| Self-test | `--self-test` | Syntax, ASCII-only source, guards, junction and dry-run fixtures; exit 1 on failure |
| Reports | `--reports` | Reports manager: list, view, export, open, delete |
| Export | `--export F [ID]` | `F` = `md`, `html`, `both`; `ID` = `N`, `latest` (default), `all` |
| Stats | `--stats` | Run history and total reclaimed |
| Prune history | `--prune-history [N]` | Delete logs, reports and bundles older than N days (default 90) |
| Feedback | `--feedback` | How to report a bug; nothing is sent |
| Report issue | `--report-issue` | Opens a pre-filled GitHub issue in your browser after confirming |
| Debug bundle | `--debug-bundle` | Zips the latest log, report and a manifest under `~\.windowsweep\feedback` |
| Scheduled task | `--install-task`, `--uninstall-task` | Weekly `--all --yes --quiet --no-color --notify` on Sundays at 03:00, as your user, start-when-available, with a three-hour limit (refused under `npx`; install globally first) |
| Profile alias | `--install-alias`, `--uninstall-alias` | A `cleanup` function in your PowerShell profile (refused under `npx`; install globally first) |
| Uninstall data | `--uninstall-data` | Removes `~\.windowsweep` after a confirmation that `--yes` never answers |
| Version | `-V`, `--version` | Version and author |
| Help | `-h`, `--help` | The flag list |

## Options

| Flag | Default | What it does |
|---|---|---|
| `--dry-run`, `-n` | off | Delete nothing; print what would go and estimate the total |
| `-y`, `--yes` | off | Auto-confirm regenerable-cache steps. Never applies to personal files |
| `--i-understand-deep` | off | Allow deep sections (11, 15, 16, 20) unattended, with `--yes` |
| `--elevate` | off | Relaunch elevated through a UAC prompt; the elevated run writes its own log |
| `-d N`, `--days N` | 100 | Idle window for caches: a file goes when its newest timestamp is N+ days old |
| `--temp-days N` | 3 | Idle window for temp folders (sections 10 and 12) |
| `--purge-all` | off | 🔥 Clear cache targets completely instead of pruning idle files (a console run asks for a typed `purge` once; `--yes` confirms in batch) |
| `--developer` / `--not-developer` | saved answer | Override developer mode for this run only |
| `--forget-developer` | - | Ask the developer question again |
| `--scan-roots "P1;P2"` | auto-detected | Project roots for section 17 (semicolon-separated) |
| `--personal-roots "P1;P2"` | Downloads only | Extra folders for section 19. An explicit empty value keeps the scope at Downloads even if config names roots |
| `--browser-profile-roots "P1;P2"` | none | Test or automation browser profile roots for section 7; only known cache leaves are eligible |
| `--temp-roots "P1;P2"` | none | Scratch folders for section 10; idle entries not held by a program may be removed |
| `--exclude-path P` | - | Never scan or touch this tree, in **any** section (repeatable). Since 1.2.0 the deletion chokepoint itself refuses an excluded path, so it holds everywhere rather than only in section 17 |
| `--exclude L` | - | Drop sections from `--all` or a profile |
| `--large-file-mb N` | 100 | Large-file threshold for section 19; files older than `--days` qualify at any size |
| `--hiberfil off|reduced|keep` | ask | What section 15 does |
| `--reset-base` | off | Add `/ResetBase` to section 14 |
| `--permanent` | off | Supported selected leftovers can be deleted instead of recycled; section 19 always recycles selected personal files |
| `--logs-dir P`, `--reports-dir P` | `~\.windowsweep\...` | Where logs and reports are written |
| `--no-report` | off | Skip the JSON report (the log is still written) |
| `--cleanup-logs` | off | Delete this run's log at exit; reports are kept |
| `--select L` | off | Pre-answer the next interactive selection, e.g. `--select 1,3-5`. Repeatable; the lists are consumed in the order the prompts appear |
| `--select-file P` | off | UTF-8 file of one row per line: a full path, or the row's own key such as `appx:...` or `wu:...` ([line formats](#lines-in-a-selection-file)). `#` comments and blank lines are skipped; lines match each prompt's candidates case-insensitively |
| `--notify` | off | Show a Windows notification when the run ends. Never changes the exit code and never writes to stdout |
| `--json` | off | One-line JSON summary on stdout; everything else goes to stderr |
| `-q`, `--quiet` | off | Fewer informational lines |
| `--no-color` | auto | Disable colour (also `NO_COLOR` or `WINDOWSWEEP_NO_COLOR=1`; off when output is redirected) |
| `--ascii` | auto | Plain ASCII glyphs (also `WINDOWSWEEP_ASCII=1`; automatic when output is redirected) |
| `--pwsh` | off | Launcher only: run the engine on PowerShell 7 |

Options may also be written `--days=30`.

## Scripting the interactive sections

Sections 17, 18, 19, 23, 26, 27 and 30-32 normally need a person choosing items, and they refuse to run
unattended. Two flags let a script or a GUI supply that choice in advance:

```powershell
# by index, one list per prompt, in the order the prompts appear
windowsweep --only 17 --select 1,3-5

# by path: list what you want removed, one full path per line
windowsweep --only 17,18 --select-file .\picks.txt
```

- Either flag lifts the interactive refusal, because a person did choose - and the selection also answers
  that section's final confirmation, so the run does not stall waiting for a keypress.
- **`--yes` still selects nothing.** It never has, and neither flag changes that.
- `--select` is consumed one list per prompt. A run with more prompts than lists falls back to the console
  for the rest, and selects nothing when there is no console.
- `--select-file` is offered to every prompt, so a line that matches nothing in a given section is normal;
  it is reported once and skipped.
- Section 19 requires exact `--select-file` paths for scripted removal. A selected file that changes
  after discovery is kept. After a real removal, section 26 asks two more questions, the leftover folders
  and then the registry keys, shortcuts, startup entries and tasks; a queued `--select` never answers
  them, so name those rows in `--select-file`.
- Nothing here reaches a path the deletion chokepoint would otherwise refuse.

The usual pairing is to list the candidates first and then act on the ones you want:

```powershell
windowsweep --only 17 --dry-run --json        # read .candidates[] from the one stdout line
windowsweep --only 17 --select-file .\picks.txt
```

### Lines in a selection file

Each line is the `path` a `--dry-run --json` run reports for that row in `candidates[]`, so the reliable
way to write one is to copy it from there.

| Section | One line per row |
|---|---|
| 17, 18, 19, 23 | the full path the section listed |
| 26 | the program's uninstall key, such as `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\<key>`, or `appx:<PackageFullName>` for a Store app |
| 26's leftover lists, 27 | a folder path; a registry key; `<RunKey>::<Value>` for a startup entry, with the Run key written out in full; `task:<path><name>` for a scheduled task, such as `task:\Vendor\Updater`; the full path of a shortcut |
| 30 | `wu:<UpdateID>` |
| 31 | `wu:<UpdateID>` for a Windows Update driver, `oem:<oemNN.inf>` for an old driver package |
| 32 | `winget:<PackageId>` |

Section 26's leftover lists appear only after a real removal, so a dry-run cannot show their lines. A
later run of section 27 offers whatever is still there, read from the uninstall history.

## Machine-readable output

`--json` writes exactly one line to stdout; every human line goes to stderr. The document carries:

| Key | Meaning |
|---|---|
| `tool`, `version`, `mode`, `dry_run`, `elevated`, `developer` | what ran |
| `freed_bytes`, `estimated_bytes` | reclaimed, and the dry-run estimate |
| `sections[]` | `section`, `status` (`ran`, `dry-run`, `skipped`, `refused`, `failed`), `freed_bytes` |
| `candidates[]` | what an interactive section offered: `section`, `index`, `path`, `bytes`, `idle_days`, `project`; an optional `label`, the row's display name; section-specific fields below |
| `personal_roots[]` | section 19's root verdicts: `path`, `accepted`, `reason`; otherwise empty |
| `driver_report` | section 31's two reports: `problems[]` (`name`, `code`, `problem`) and `oldest[]` (`device`, `provider`, `version`, `date`); `null` unless section 31 ran |
| `access_live_volumes[]` | volumes where idle age uses write/creation time because last-access is live |
| `targets[]` | in scan mode: `section`, `label`, `path`, `bytes` |
| `refusals[]`, `log_file`, `report_file` | what was refused, and where the run was recorded |

`candidates` and `targets` are always present, as empty arrays when nothing was collected, so a caller can
rely on the shape.
Section 19 candidates also carry `reason` (`large`, `old`, `both`), `age_basis`, `modified`, `root`
and `selectable`. A refused row has `index: 0` and `skip_reason`, and must never be offered for selection.

Sections 26, 27 and 30-32 add their own fields after the shared ones:

| Rows | Extra fields |
|---|---|
| 26, the first list | `kind` (`desktop`, `store`, `broken`), `strategy`, `needs_admin`, `ran`, `publisher`, `version` |
| 26 and 27, registry keys, shortcuts, startup entries and tasks | `kind` (`registry`, `shortcut`, `startup`, `task`), `needs_admin` |
| 30 | `kind` (`windows-update`), `kb`, `category`, `severity`, `reboot_likely`, `needs_admin` |
| 31 | `kind` (`driver-update`, `driver-package`) and `needs_admin`; a driver update adds `driver_class`, `driver_provider`, `driver_date` and `optional`, a package adds `provider`, `class`, `version` and `date` |
| 32 | `kind` (`app-update`), `id`, `version`, `available`, `source`, `needs_admin` |

In `--json` mode each section also brackets itself on **stderr** so a caller can show progress:

```text
##windowsweep section=7 event=start
##windowsweep section=7 event=end status=ran freed_bytes=4096
```

`--list --json` prints the section catalogue instead of the human table - `sections[]` (`id`, `key`, `title`,
`tier`, `admin`, `batch`, `dev`), `safe_batch`, `safe_batch_admin`, `profiles`, `walkthrough` and
`walkthrough_admin` - so a front end reads the catalogue rather than hard-coding it.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | A section failed, or the self-test found a failure |
| 2 | Usage error, or an interactive mode was started without a console |
| 3 | A section named in `--only` was refused (deep without `--i-understand-deep`, or interactive-only), or an installer was started from `npx` |
| 130 | Interrupted with Ctrl-C (the engine exits 130 from its exit handler; the Node launcher also returns 130 when it forwards the signal) |

## Environment variables

| Variable | Default | Effect |
|---|---|---|
| `WINDOWSWEEP_HOME` | `%USERPROFILE%\.windowsweep` | Data directory |
| `WINDOWSWEEP_LOG_DIR`, `WINDOWSWEEP_REPORTS_DIR` | under the data directory | Same as `--logs-dir` / `--reports-dir` |
| `WINDOWSWEEP_SHELL` | `powershell` | `pwsh` runs the engine on PowerShell 7 (launcher only) |
| `WINDOWSWEEP_NO_COLOR`, `NO_COLOR` | unset | Disable colour |
| `WINDOWSWEEP_ASCII` | unset | Plain glyphs |
| `WINDOWSWEEP_VERSION`, `WINDOWSWEEP_LAUNCHER`, `WINDOWSWEEP_NPX` | set by the launcher | Version and launcher facts shown in logs and reports |

## Config file

`%USERPROFILE%\.windowsweep\config.json` stores defaults; flags always win. Nothing else is kept there: no history, no path list and no record of what a run removed. Those live in the logs and reports, and section 26's record of what it removed is its own file beside them, `uninstalled.jsonl` ([Reports and logs](./reports-and-logs.md)).

| Key | Default | Meaning |
|---|---|---|
| `developer` | `null` | The saved developer answer (`true` / `false`) |
| `days` | 100 | Idle window |
| `tempDays` | 3 | Temp idle window |
| `largeFileMb` | 100 | Section 19 minimum size |
| `scanRoots` | `[]` | Section 17 roots |
| `excludePaths` | `[]` | Trees to leave alone, in **every** section - the same reach as `--exclude-path` |
| `personalRoots` | `[]` | Extra section 19 folders; Downloads is always first when it exists |
| `browserProfileRoots` | `[]` | Test or automation profile roots for section 7 |
| `tempRoots` | `[]` | Scratch folders for section 10 |

Last Updated: 2026-11-14
