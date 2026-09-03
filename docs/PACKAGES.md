# Package inventory - windowsweep

The dependency and manifest record for this package. Keep it accurate on every add, removal or upgrade.

Last Updated: 2026-09-03

## Manifest units

One `package.json`, at the repository root. No workspaces, no build step, no second manifest.

## Dependencies

**None - of any kind.** No `dependencies`, `devDependencies`, `peerDependencies` or `optionalDependencies`.

Deliberate and worth preserving: the package is PowerShell plus a ~100-line Node launcher that uses only
built-in modules (`path`, `fs`, `os`, `child_process`). A user running `npx windowsweep` downloads one tarball
and nothing else, which matters for a tool that deletes files and can run elevated. Adding a runtime dependency
is a design decision, not a convenience.

## External commands (not npm packages)

Resolved at runtime with `Get-Command`; every one degrades gracefully when absent. `--self-test` reports which
are missing.

| Command | Required? | Used for |
|---|---|---|
| `powershell.exe` 5.1 (or `pwsh`) | required | The engine |
| `robocopy.exe` | optional | Fast size measurement (`/L`); the .NET walker is the fallback |
| `docker` | optional | Section 5 |
| `cleanmgr.exe`, `Dism.exe`, `powercfg.exe`, `wevtutil.exe`, `diskpart.exe`, `wsl.exe` | optional, admin | Sections 13, 14, 15, 16, 20 |
| `npm`, `yarn`, `pnpm`, `uv`, `pip`, `composer`, `gradle` | optional | Tool-native prunes and cache-path discovery in sections 1-2 |
| `whoami.exe`, `ipconfig.exe`, `fsutil.exe` | optional | Elevation capability, DNS flush, last-access tracking report |

## Manifest decisions

| Field | Value | Why |
|---|---|---|
| `bin` | `{ "windowsweep": "bin/windowsweep.js" }` | One command, same as the package name |
| `main` | absent | A CLI has no importable surface; omitting it avoids declaring an entry point that would be a major change to remove later |
| `engines.node` | `>=14` | The launcher uses no syntax or API newer than Node 14 |
| `os` | `["win32"]` | npm refuses to install elsewhere; the launcher independently exits 2 on any other platform |
| `files` | allowlist of 10 entries | An allowlist, never `.npmignore`; verified against `npm pack --dry-run` |
| `publishConfig.access` | `public` | Unscoped public package |
| `preferGlobal` | `true` | Harmless legacy hint |

## Published contents

`npm pack` emits the launcher, `lib/`, `modules/`, both entry files, `README.md`, `LICENSE`, `CHANGELOG.md`,
`SECURITY.md`, `VERSION` and `package.json` - 37 files, 78.1 kB packed, 263.2 kB unpacked (`npm pack`,
2026-09-03, the 1.0.0 release tarball). `docs/` is not shipped;
the README links every page by absolute URL.

Confirmed absent from the tarball: `CLAUDE.md`, `AGENTS.md`, `docs/`, `temp/`, `.github/`, `.npmrc`, `.env*`,
logs, reports, bundles.

## Verification

```powershell
npm pack --dry-run                                   # the allowlist only
npm run version:check                                # package.json == VERSION == lib/constants.ps1
node bin/windowsweep.js --self-test --no-color       # 108 checks
```
