# Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `running scripts is disabled on this system` | You started `windowsweep.ps1` directly under the default `Restricted` policy | Use `npx windowsweep`, `windowsweep.cmd`, or `powershell -ExecutionPolicy Bypass -File windowsweep.ps1 ...` |
| `REFUSE (inside protected: ...)` | The path resolves inside a protected folder, sometimes through a junction into your profile | Working as designed. `--list-targets` shows the protected list; nothing bypasses it |
| `skipped: chrome is running` | The browser or app is open and holds its cache | Close it and run `windowsweep --only 7 --yes` (the section number is in the message) |
| `needs Administrator rights - skipped` | The console is not elevated | `windowsweep --only 12 --yes --elevate`, or run the profile `system` with `--elevate` |
| `The walkthrough needs an interactive console` | stdin is redirected (a script, a Scheduled Task, CI) | Use `--all --yes`, `--only ... --yes`, `--scan` or `--dry-run` |
| `refused in batch mode without --i-understand-deep` | A deep section (11, 15, 16, 20) was named in `--only` or a profile | Add `--i-understand-deep` with `--yes`, or run it from the menu |
| `section 17 is interactive-only` | Personal sections never run unattended | Run `windowsweep --only 17` from a console; `--dry-run` lists candidates |
| Reclaimed less than the dry-run estimated | Files were created or locked between the two runs, or an app started in between | Re-run; compare the log's `skip (locked)` lines |
| Reclaimed less than `--scan` showed on disk | The idle gate kept files used within the window; running apps were skipped | Lower `--days`, close the apps, or use `--purge-all` for a full clear |
| `Docker daemon is not running` | Docker Desktop is stopped | Start Docker Desktop and re-run section 5 |
| `elevation refused or failed` | The UAC prompt was cancelled, or the account is a standard user | Approve the prompt; a standard user needs an administrator to run the admin sections |
| Glyphs render as `?` or boxes | The console font lacks the box-drawing characters | `--ascii`, or `WINDOWSWEEP_ASCII=1` |
| An editor extension folder was removed | The editor's `extensions.json` no longer referenced it (uninstalled or superseded) | Reinstall the extension from the editor; the tool never removes a referenced folder |
| Cypress/Playwright kept a version I expected to go | One file inside it was touched within the window, or it is the newest of its kind | Lower `--days`, or remove the version by hand |
| A crash bundle appeared | The run exited with an unexpected error | Inspect `~\.windowsweep\feedback\crash-*.zip`, then `windowsweep --report-issue` |
| `npm ERR! notsup Unsupported platform` | Installing on Linux or macOS | This package is Windows-only: use `npx linux-cleanup` or `npx macleanup` |
| `'windowsweep' is not recognized as an internal or external command` from `npx windowsweep` | You ran it inside a clone of this repository, whose own `package.json` is named `windowsweep`; npx picks that local package and finds no installed bin | Run `npx windowsweep` from any other directory, or `node bin\windowsweep.js` inside the clone |

Every skipped or refused path is in the session log at `~\.windowsweep\logs\` with its reason.

Last Updated: 2026-09-03
