# AI integration guide

This is the contract an automated caller can rely on: what windowsweep promises, what it refuses, what it
prints, and what it returns. It is written for an agent or a script rather than a person. For what the tool
*is*, read the [README](https://github.com/aoneahsan/windowsweep#readme); for what each section touches, read
[Sections 0-21](https://github.com/aoneahsan/windowsweep/blob/main/docs/sections.md).

**windowsweep deletes files.** Every command below that is not marked read-only can remove data. There is no
undo for caches. Treat a real run as an irreversible operation and preview it first.

## The safe sequence

```powershell
npx windowsweep --self-test --no-color --no-report     # read-only: proves the guards on this machine
npx windowsweep --scan --no-color --no-report          # read-only: every target and its size
npx windowsweep --dry-run --all --yes --no-color       # writes nothing; reports what a real run would remove
npx windowsweep --all --yes --no-color                 # the real safe batch
```

Add `--json` when a program reads the result. In that mode **stdout carries exactly one line, the JSON
summary**, and every human-readable line goes to stderr. `--json` also implies `--quiet`.

## What `--yes` covers, and what it never covers

`--yes` auto-confirms **regenerable caches only**: sections 0-3, 5-10, 21, and 12-14 when the console is
already elevated.

| Never covered by `--yes` | Behaviour |
|---|---|
| Sections 17, 18, 19 | The selection prompt appears even with `--yes` and defaults to none. With no console attached nothing is selected. Section 17 asks a final question `--yes` does not answer |
| Sections 11, 15, 16, 20 | Deep. Refused in batch mode unless `--i-understand-deep` is also passed |
| `--uninstall-data` | Always asks; `--yes` does not answer it |
| `--purge-all` | From a console it asks for a typed `purge` once per run. In a batch run `--yes` is the confirmation |

In batch mode (`--all`, `--only`, `--profile`) sections 17, 18 and 19 are refused outright and reported as
`refused`; they need a person at the keyboard.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Success |
| 1 | A section failed, or the self-test found a failure |
| 2 | Usage error, or an interactive mode was started without a console |
| 3 | A section named in `--only` was refused, or an installer was started from `npx` |
| 130 | Interrupted before the run finished (Ctrl-C) |

## Flags that matter to automation

| Flag | Effect |
|---|---|
| `--json` | One JSON line on stdout; everything else on stderr. Implies `--quiet` |
| `--no-color`, `--ascii` | Disable colour and Unicode glyphs. Both are automatic when output is redirected |
| `--no-report` | Skip the JSON report file; the session log is still written |
| `--cleanup-logs` | Delete this run's log at exit; reports are kept |
| `--quiet` | Fewer informational lines |
| `--only L`, `--profile NAME`, `--exclude L` | Choose sections: `--only 1,3,5-7`; profiles `dev`, `minimal`, `cache-only`, `system`, `deep`, `audit` |
| `--days N`, `--temp-days N` | Idle windows, default 100 and 3 |
| `--developer`, `--not-developer` | Override the saved developer answer for this run |
| `--scan-roots "P1;P2"`, `--exclude-path P` | Section 17 roots and exclusions |
| `--logs-dir P`, `--reports-dir P` | Redirect this run's output |
| `--pwsh` | Launcher only: run the engine on PowerShell 7 |

A non-interactive run with no saved developer answer defaults to developer mode **on**, the conservative
choice, and says so.

## The `--json` line

```json
{"tool":"windowsweep","version":"1.0.1","mode":"all","dry_run":false,"elevated":false,"developer":true,
 "freed_bytes":0,"estimated_bytes":0,
 "sections":[{"section":1,"status":"ran","freed_bytes":0}],
 "refusals":[],"log_file":"...","report_file":"..."}
```

| Key | Meaning |
|---|---|
| `tool`, `version` | Always `windowsweep` and the running version |
| `mode` | `all`, `only`, `scan`, `walkthrough`, `menu`, ... |
| `dry_run`, `elevated` | The two booleans that change what a run does |
| `developer` | `true`, `false`, or `null` in a mode that never resolves the question (`--scan`, `--list`) |
| `freed_bytes` | Real bytes removed. `0` in a dry-run |
| `estimated_bytes` | What a dry-run says a real run would remove. `0` in a real run |
| `sections[]` | One entry per section attempted: `section`, `status`, `freed_bytes` |
| `refusals[]` | Human-readable reasons a section was refused in batch mode |
| `log_file`, `report_file` | Absolute paths, or `null` under `--no-report` |

`status` is one of `ran`, `dry-run`, `skipped`, `refused`, `failed`.

## Where output lands

| Item | Path |
|---|---|
| Session logs | `%USERPROFILE%\.windowsweep\logs\` |
| JSON reports and exports | `%USERPROFILE%\.windowsweep\reports\` |
| Debug and crash bundles | `%USERPROFILE%\.windowsweep\feedback\` |
| Settings | `%USERPROFILE%\.windowsweep\config.json` |

Override the root with `WINDOWSWEEP_HOME`, or the two folders with `--logs-dir` / `--reports-dir`
(`WINDOWSWEEP_LOG_DIR` / `WINDOWSWEEP_REPORTS_DIR`). `WINDOWSWEEP_NO_COLOR`, `NO_COLOR` and
`WINDOWSWEEP_ASCII` are honoured; `WINDOWSWEEP_SHELL=pwsh` selects PowerShell 7 through the Node launcher.

The report file is schema-versioned JSON (`schema_version: 1`) with five top-level blocks: `credits`, `meta`
(times, host, OS, PowerShell version, mode, the three flags, the idle windows, the launcher), `disk`
(`before` and `after` snapshots per fixed drive), `steps` (one row per section with `status` and
`freed_bytes`), and `totals`. `--export md|html|both [N|latest|all]` renders any report to Markdown or a
self-contained HTML page without extra tools.

## Elevation

Sections 12-16 and 20 need Administrator rights. Without them the runner skips each with the exact command
to run. `--elevate` relaunches the whole run through a UAC prompt: **a new elevated window opens with its own
log and report**, and the original process waits and returns the child's exit code. That prompt cannot be
answered by a script, so `--elevate` does not belong in an unattended context.

## Guarantees

- **No network calls of its own.** The self-test greps the source for HTTP and socket calls and fails the run
  if it finds one. There is no telemetry and no update check.
- **Every deletion passes one chokepoint** with a declared root, and is refused if it falls outside it.
- **Protected paths are refused regardless of flags**: drive roots, Windows, Program Files, the profile root,
  personal folders, credentials, toolchains, browser and editor state. No flag bypasses this.
- **Junctions and symlinks are removed as links, never followed.**
- **`--dry-run` and `--scan` write nothing** but the log and the report.
- **Section numbers 0-21 are a public contract.** A section may be retired as a no-op; a number is never
  reused.
- **Zero runtime dependencies.** The package is PowerShell plus a Node launcher that uses only built-in
  modules.

## Do not

- Do not run `npx windowsweep` from a directory that contains a checkout of this repository: npx resolves the
  local package and the command fails. Run it from anywhere else.
- Do not schedule `npx windowsweep` as a task action. The npx cache is evicted and the task breaks; install
  globally and use `--install-task`, which refuses under npx for this reason.
- Do not pipe `y` into the tool to force a personal section. Sections 17, 18 and 19 are interactive by design
  and a piped answer selects nothing.
- Do not treat a green `--dry-run` as proof that a real run frees the same amount: an app that is open at run
  time keeps its caches.

## Coming in 1.1.0

`--select`, `--select-file`, a `candidates[]` array, a `targets[]` array, per-section progress lines and
`--list --json`, so a GUI or a script can drive the interactive sections. See the
[changelog](https://github.com/aoneahsan/windowsweep/blob/main/CHANGELOG.md) when it ships.
