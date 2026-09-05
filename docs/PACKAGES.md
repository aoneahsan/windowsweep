# Package inventory - windowsweep

The dependency and manifest record for this package. Keep it accurate on every add, removal or upgrade.

Last Updated: 2026-09-05 (the desktop app added a SECOND manifest, deliberately isolated from this one)

## Manifest units

**Two, and they are deliberately NOT a workspace.**

1. `package.json` at the repository root - the published npm package. Zero dependencies, no build step.
2. `desktop/package.json` - the Tauri desktop application. It carries its own `yarn.lock` and its own
   `.yarnrc.yml`, and an **empty `yarn.lock` at the root would be required to make yarn treat them as one
   project**, which is exactly what is avoided.

🔴 **Why they are separate rather than a workspace.** A workspace would hoist the desktop app's ~370
dependencies into a root `node_modules`, and the published tarball's whole argument is that a user running
`npx windowsweep` downloads one file with nothing behind it. Keeping them apart means the CLI's dependency
count cannot drift upward because the desktop app needed a chart library. CI proves it: the tarball sweep in
`ci.yml` fails if `desktop/` appears in `npm pack --dry-run`, and that check was watched failing against a
planted `desktop/package.json` entry on 2026-09-05.

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
| `files` | allowlist of 11 entries | An allowlist, never `.npmignore`; verified against `npm pack --dry-run` |
| `publishConfig.access` | `public` | Unscoped public package |
| `preferGlobal` | `true` | Harmless legacy hint |

## Published contents

`npm pack` emits the launcher, `lib/`, `modules/`, both entry files, `README.md`, `LICENSE`, `CHANGELOG.md`,
`SECURITY.md`, `VERSION`, `AI-INTEGRATION-GUIDE.md` and `package.json`. The 1.1.0 release tarball is 44
files, 108.9 kB packed and 365.6 kB unpacked (1.0.1: 38 files, 81.4 kB / 273.1 kB; 1.0.0: 37 files, 78.1 kB /
263.2 kB). `docs/` is not shipped; the README links every page by absolute URL. The three
root planning files (`remaining-work.md`, `remaining-work-summary.md`, `what-this-project-consists-of.md`),
`PENDING-TASKS.md` and the portfolio-info copy are outside the allowlist and never ship; CI asserts each by
name.

Confirmed absent from the tarball: `CLAUDE.md`, `AGENTS.md`, `docs/`, `temp/`, `.github/`, `.npmrc`, `.env*`,
logs, reports, bundles.

## Verification

```powershell
npm pack --dry-run                                   # the allowlist only
npm run version:check                                # package.json == VERSION == lib/constants.ps1
node bin/windowsweep.js --self-test --no-color       # 151 checks
```


## The desktop application's dependencies (`desktop/package.json`)

Added 2026-09-05 with the first application code under `desktop/`. Installed with **yarn 4.17.1**,
`npmMinimalAgeGate: 0`, `nodeLinker: node-modules`.

| Package | Version | Why |
|---|---|---|
| `@amplitude/analytics-browser` | `^2.45.8` | Consent-gated. 🔴 Its ready flag is set on the init **promise**, never the call |
| `@sentry/browser` | `^10.73.0` | Consent-gated; `beforeSend` strips file paths |
| `@tanstack/react-router` | `^1.170.32` | Routing, on **hash history** - the packaged app has no server to resolve a path |
| `@tauri-apps/api` | `^2.11.1` | The IPC bridge to the Rust side |
| `@tauri-apps/plugin-dialog` | `^2.4.0` | used by the screens |
| `@tauri-apps/plugin-opener` | `^2.5.0` | used by the screens |
| `@tauri-apps/plugin-os` | `^2.3.1` | used by the screens |
| `@tauri-apps/plugin-process` | `^2.3.0` | used by the screens |
| `@tauri-apps/plugin-updater` | `^2.9.0` | used by the screens |
| `d3-array` | `^3.2.4` | used by the screens |
| `d3-format` | `^3.1.0` | used by the screens |
| `d3-hierarchy` | `^3.1.2` | The treemap on Home and the run screen |
| `d3-scale` | `^4.0.2` | used by the screens |
| `d3-shape` | `^3.2.0` | used by the screens |
| `d3-time-format` | `^4.1.0` | used by the screens |
| `i18next` | `^26.4.2` | Every user-visible string, from day one |
| `motion` | `^13.2.0` | Entrance and state motion, gated on the `motion` axis AND the OS query |
| `react` | `^19.2.0` | used by the screens |
| `react-aria-components` | `^1.21.1` | The interactive primitives. The click dummy specifies the look; RAC owns the DOM |
| `react-dom` | `^19.2.0` | used by the screens |
| `react-i18next` | `^17.0.13` | The React binding |
| `zustand` | `^5.0.15` | The one store |

### Development

| Package | Version |
|---|---|
| `@eslint-react/eslint-plugin` | `^5.18.7` |
| `@tailwindcss/vite` | `^4.3.3` |
| `@tauri-apps/cli` | `^2.11.4` |
| `@types/d3-array` | `^3.2.2` |
| `@types/d3-format` | `^3.0.4` |
| `@types/d3-hierarchy` | `^3.1.7` |
| `@types/d3-scale` | `^4.0.9` |
| `@types/d3-shape` | `^3.1.7` |
| `@types/d3-time-format` | `^4.0.3` |
| `@types/node` | `^24.10.1` |
| `@types/react` | `^19.2.2` |
| `@types/react-dom` | `^19.2.2` |
| `@vitejs/plugin-react` | `^6.1.1` |
| `eslint` | `~9.39.5` |
| `eslint-plugin-react-hooks` | `^7.1.1` |
| `globals` | `^17.12.0` |
| `tailwindcss` | `^4.3.3` |
| `typescript` | `~6.0.3` |
| `typescript-eslint` | `^8.69.0` |
| `vite` | `^8.2.2` |

🔴 **Two pins are deliberate and must not be raised by an `ncu -u`:**

- **`typescript` `~6.0.3`.** TypeScript 7 is the registry's latest and is blocked fleet-wide:
  `@typescript-eslint/typescript-estree` peers `<6.1.0`, so TS 7 removes `yarn lint` entirely.
- **`eslint` `~9.39.5`.** ESLint 10 is the registry's latest. The block is one plugin, not the major:
  `eslint-plugin-react` never gained an ESLint 10 peer range. This project uses
  `@eslint-react/eslint-plugin` instead, so it is not blocked in principle - the pin is kept because nothing
  yet needs 10 and the pair is verified working.

**`@eslint/js` is deliberately absent.** It is banned fleet-wide for broken versioning, so the handful of core
rules this project wants are written out in `eslint.config.js` rather than spread in from its recommended set.

### Rust (`desktop/src-tauri/Cargo.toml`)

`tauri` 2 with the `protocol-asset` feature, plus the `dialog`, `opener`, `os`, `process` and `updater`
plugins, `serde`/`serde_json`, `tiny_http` (the OAuth loopback listener) and `url`. No shell or filesystem
plugin: the engine is launched by a Rust command with a fixed executable and a validated argument allowlist,
so the webview cannot aim a process anywhere of its own choosing.
