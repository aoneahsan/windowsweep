# Package inventory - windowsweep

The dependency and manifest record for this package. Keep it accurate on every add, removal or upgrade.

Last Updated: 2026-09-26 (the hook line gains `--relative --max-arg-length 8000`, the fleet baseline. Earlier
2026-09-25, D37: the desktop manifest at latest stable and on the fleet package baseline. Earlier 2026-09-05: the
desktop app added a SECOND manifest, deliberately isolated from this one)

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
263.2 kB). `docs/` is not shipped; the README links every page by absolute URL. `PENDING-TASKS.md` and the
portfolio-info copy are outside the allowlist and never ship; CI asserts each by name. The three planning
files (`remaining-work.md`, `remaining-work-summary.md`, `what-this-project-consists-of.md`) **left this
repository on 2026-09-07** for the workspace folder above it, so they cannot reach a tarball at all - CI
still names them, which is now a guard against one being put back rather than a live exclusion.

Confirmed absent from the tarball: `CLAUDE.md`, `AGENTS.md`, `docs/`, `temp/`, `.github/`, `.npmrc`, `.env*`,
logs, reports, bundles.

## Verification

```powershell
npm pack --dry-run                                   # the allowlist only
npm run version:check                                # package.json == VERSION == lib/constants.ps1
node bin/windowsweep.js --self-test --no-color       # 155 checks
```


## The desktop application's dependencies (`desktop/package.json`)

Added 2026-09-05 with the first application code under `desktop/`; brought to latest stable and the fleet package
baseline on 2026-09-25 (D37). Installed with **yarn 4.17.1**, `npmMinimalAgeGate: 0`, `nodeLinker: node-modules`;
Node from `desktop/.nvmrc` (`24.13.0`), `engines.node` `>=22`.

| Package | Version | Why |
|---|---|---|
| `@amplitude/analytics-browser` | `^2.47.0` | Gated on its key. 🔴 Its ready flag is set on the init **promise**, never the call |
| `@sentry/browser` | `^11.0.0` | Gated on its DSN. 🔴 v11 removed `sendDefaultPii`, and its replacement `dataCollection` COLLECTS every category it is not told about, so `lib/analytics.ts` names each one off; `beforeSend` still strips file paths |
| `@supabase/supabase-js` | `^2.117.2` | Sign-in and sync (below) |
| `@tanstack/react-router` | `^1.170.39` | Routing, on **hash history** - the packaged app has no server to resolve a path |
| `@tauri-apps/api` | `^2.11.1` | The IPC bridge to the Rust side |
| `@tauri-apps/plugin-dialog` | `^2.7.3` | used by the screens |
| `@tauri-apps/plugin-opener` | `^2.5.5` | used by the screens |
| `@tauri-apps/plugin-os` | `^2.3.2` | used by the screens |
| `@tauri-apps/plugin-process` | `^2.3.1` | used by the screens |
| `@tauri-apps/plugin-updater` | `^2.12.0` | The boot-time update check |
| `d3-array` | `^3.2.4` | used by the screens |
| `d3-format` | `^3.1.2` | used by the screens |
| `d3-hierarchy` | `^3.1.2` | The treemap on Home and the run screen |
| `d3-scale` | `^4.0.2` | used by the screens |
| `d3-shape` | `^3.2.0` | used by the screens |
| `d3-time-format` | `^4.1.0` | used by the screens |
| `drizzle-orm` | `^0.45.3` | The schema at `src/db/schema/` (below) |
| `i18next` | `^26.4.2` | Every user-visible string, from day one |
| `motion` | `^13.4.4` | Entrance and state motion, gated on the `motion` axis AND the OS query |
| `react` | `^19.3.0` | used by the screens |
| `react-aria-components` | `^1.21.1` | The interactive primitives. The click dummy specifies the look; RAC owns the DOM |
| `react-dom` | `^19.3.0` | used by the screens |
| `react-i18next` | `^17.0.15` | The React binding |
| `zustand` | `^5.0.15` | The one store |

### Development

| Package | Version | Why |
|---|---|---|
| `@eslint-react/eslint-plugin` | `^5.20.8` | React rules (`recommended-typescript`), in place of `eslint-plugin-react` |
| `@tailwindcss/vite` | `^4.3.3` | Tailwind v4 |
| `@tauri-apps/cli` | `^2.11.5` | `tauri dev` / `tauri build`; it refuses a mismatched Tauri pair (below) |
| `@types/d3-array` | `^3.2.2` | |
| `@types/d3-format` | `^3.0.4` | |
| `@types/d3-hierarchy` | `^3.1.7` | |
| `@types/d3-scale` | `^4.0.9` | |
| `@types/d3-shape` | `^3.2.0` | |
| `@types/d3-time-format` | `^4.0.3` | |
| `@types/node` | `^26.6.2` | The Vite config, `vite/` and the vitest config |
| `@types/react` | `^19.3.0` | |
| `@types/react-dom` | `^19.3.0` | |
| `@vitejs/plugin-react` | `^6.1.1` | |
| `drizzle-kit` | `~0.31.11` | Migrations (below) |
| `eslint` | `~10.11.0` | The lint gate, 0 warnings |
| `eslint-plugin-react-hooks` | `^7.1.1` | |
| `globals` | `^17.12.0` | |
| `husky` | `^9.1.7` | The pre-commit hook (below) |
| `lint-staged` | `^17.5.1` | What the hook runs |
| `prettier` | `^3.9.9` | The fleet format |
| `tailwindcss` | `^4.3.3` | |
| `typescript` | `~6.0.3` | Pinned (below) |
| `typescript-eslint` | `^8.70.1` | Type-checked linting over `src` |
| `vite` | `^8.3.1` | |
| `vitest` | `^5.0.2` | `yarn test`, the pre-approved classes only |

### The 2026-09-25 pass (D37)

`npx -y npm-check-updates -u --reject typescript`, then `yarn install`. Locked versions, before and after:

| Package | Before | After | |
|---|---|---|---|
| `@sentry/browser` | 10.73.0 | 11.0.0 | **major** |
| `eslint` | 9.39.5 | 10.11.0 | **major** |
| `@types/node` | 24.13.3 | 26.6.2 | **major** |
| `@amplitude/analytics-browser` | 2.45.8 | 2.47.0 | |
| `@supabase/supabase-js` | 2.115.0 | 2.117.2 | |
| `@tanstack/react-router` | 1.170.32 | 1.170.39 | |
| `@tauri-apps/plugin-updater` | 2.11.0 | 2.12.0 | its crate moved with it (below) |
| `drizzle-orm` | 0.45.2 | 0.45.3 | |
| `motion` | 13.2.0 | 13.4.4 | |
| `react`, `react-dom` | 19.2.8 | 19.3.0 | |
| `react-i18next` | 17.0.13 | 17.0.15 | |
| `@eslint-react/eslint-plugin` | 5.18.7 | 5.20.8 | |
| `@tauri-apps/cli` | 2.11.4 | 2.11.5 | |
| `@types/react` | 19.2.18 | 19.3.0 | |
| `@types/react-dom` | 19.2.7 | 19.3.0 | |
| `drizzle-kit` | 0.31.10 | 0.31.11 | |
| `typescript-eslint` | 8.69.0 | 8.70.1 | |
| `vite` | 8.2.2 | 8.3.1 | |
| `husky`, `lint-staged`, `prettier`, `vitest` | - | 9.1.7, 17.5.1, 3.9.9, 5.0.2 | added |

Only the range floor moved, to the version already locked, for `@tauri-apps/plugin-dialog` / `-opener` / `-os` /
`-process`, `d3-format` and `@types/d3-shape`. **Nothing was removed.** Fixed forward in the same pass:
`sendDefaultPii` -> `dataCollection` (TS2353 until converted); `eslint.config.js` moved from typescript-eslint's
deprecated `tseslint.config()` to ESLint's own `defineConfig()`; `vite.config.ts` lost `chunkSizeWarningLimit: 900`
(largest chunk 416 kB, so Vite's 500 kB default warns on nothing).

Every install prints `YN0004` for three copies of esbuild (drizzle-kit's, `@esbuild-kit/core-utils`', tsx's):
Yarn 4.17's default `enableScripts: false`. The same three were locked before this pass, and esbuild runs from its
platform package without its build script.

🔴 **The pins, re-measured 2026-09-25:**

- **`typescript` `~6.0.3`.** TypeScript 7.0.2 is the registry's `latest` and is blocked fleet-wide:
  `@typescript-eslint/typescript-estree` 8.70.1 peers `typescript >=4.8.4 <6.1.0`, so TS 7 removes `yarn lint`.
  6.0.3 is the newest 6.0.x. `yarn deps:update` runs the fleet's plain `ncu -u`, which proposes 7 - read
  `~/.claude/rules/package-version-known-issues.md` first and keep `~6.0.3`. `yarn deps:update` passes `--reject typescript`, because
  `npm-check-updates -u` moves a package past its own tilde range - without it the script would break this pin.
- **`drizzle-kit` `~0.31` and `drizzle-orm` `^0.45`** - the ledger's stable lines (below). Today they are also the
  registry's `latest` (0.31.11 / 0.45.3), so `ncu -u` moves them only within the lines.
- **ESLint is no longer pinned.** The `~9.39.5` pin ended with ESLint 10 fleet-wide (owner, 2026-09-17). The block
  was one plugin, `eslint-plugin-react`, which this project never used. The gate was watched failing under 10.11.0
  on planted `no-console`, `no-floating-promises`, `require-await` and i18n-text defects.

**`@eslint/js` is deliberately absent.** It is banned fleet-wide for broken versioning, so the handful of core
rules this project wants are written out in `eslint.config.js` rather than spread in from its recommended set.

### 🔴 The Tauri pairs - each npm package on its crate's major.minor

The Tauri CLI refuses `tauri dev` and `tauri build` when an `@tauri-apps/*` npm package and its Rust crate differ in
major.minor. So when an `ncu` pass moves one, the crate follows with `cargo update -p <that crate>` - that crate
only, dry run first, proved with `cargo check` - or the npm package is held at the crate's minor with the reason
written here.

| npm package | Locked | Rust crate (`src-tauri/Cargo.lock`) | Locked |
|---|---|---|---|
| `@tauri-apps/api` | 2.11.1 | `tauri` | 2.11.5 |
| `@tauri-apps/plugin-dialog` | 2.7.3 | `tauri-plugin-dialog` | 2.7.3 |
| `@tauri-apps/plugin-opener` | 2.5.5 | `tauri-plugin-opener` | 2.5.5 |
| `@tauri-apps/plugin-os` | 2.3.2 | `tauri-plugin-os` | 2.3.2 |
| `@tauri-apps/plugin-process` | 2.3.1 | `tauri-plugin-process` | 2.3.1 |
| `@tauri-apps/plugin-updater` | 2.12.0 | `tauri-plugin-updater` | 2.12.0 |

On 2026-09-25 `ncu` moved `@tauri-apps/plugin-updater` to 2.12.0, and `cargo update -p tauri-plugin-updater` moved
the crate 2.11.0 -> 2.12.0: one package, version and checksum only, no new dependency. `cargo check` is green and
`tauri dev` started without a mismatch. 2.12.0's one breaking change moved `allowDowngrades` from `check()` into the
`plugins.updater` config; `lib/updater.ts` passes only `timeout`, so downgrades stay refused, as before.
`@tauri-apps/cli` has no crate of its own - it is the checker.

### The toolchain baseline (D37)

| File | What |
|---|---|
| `desktop/.nvmrc` | `24.13.0` |
| `desktop/.prettierrc`, `.prettierignore` | The fleet format. Ignored: `design/` (GATE 4 compares the dummy byte for byte), `*.md`, `dist`, `src-tauri`, `public/prepaint.js`, drizzle's `supabase/migrations/meta`. 🔴 The tree was **not** reformatted in one sweep: `yarn format:check` lists 99 files, and the hook formats each the first time a commit touches it |
| `desktop/.husky/pre-commit`, `desktop/.lintstagedrc.json` | `eslint --fix` + `prettier --write` on staged `src/**/*.{ts,tsx}`; `prettier --write` on `*.{json,md,css}` |
| `desktop/vitest.config.ts` | Node environment, `src/**/*.test.ts`, and `TZ=America/New_York` - a zone with daylight saving, so the 23- and 25-hour days run |

🔴 **Husky lives in `desktop/`, never in the root `package.json`.** The root is the published npm package, and a root
`postinstall` would run on every user's `npm i windowsweep`. So `desktop/package.json` carries
`"postinstall": "cd .. && husky desktop/.husky"`: Yarn 4 never runs a project's `prepare`, and husky refuses a `..`
in its argument, hence the `cd`. It sets the repository's `core.hooksPath` to `desktop/.husky/_`. The hook runs
`cd desktop && yarn lint-staged --no-stash --relative --max-arg-length 8000`, and lint-staged reaches only files under
`desktop/`, so a commit that stages only CLI files runs nothing. `--no-stash` because lint-staged's default backup is
`git stash`, which the house rule bans; `--relative --max-arg-length 8000` because Windows caps a command line at 8,191
characters and lint-staged 17 splits a long file list only when that length is set (the fleet baseline since
2026-09-25). A fresh clone gets the hook on its first `yarn install` in `desktop/`; an existing checkout
runs `yarn postinstall` once. `.gitattributes` keeps the hook and `.nvmrc` LF.

`yarn test` covers two of the pre-approved classes, 11 cases, each watched failing on a planted defect:
`src/lib/sync.test.ts` (`reconcileSettings` - newest wins, compared as instants, no Undo on a tie) and
`src/lib/history-dates.test.ts` (local calendar days, across the clock changes, and the local report stamp).

### The backend moved to Supabase on 2026-09-05

`@supabase/supabase-js` `^2.115.0` replaced the hand-rolled Firebase REST calls (there was never a Firebase SDK
dependency - `auth.ts` and `sync.ts` used plain `fetch`). Added with it: **`drizzle-orm` `^0.45.2`** and
**`drizzle-kit` `~0.31.10`**, which are the fleet's schema-and-migration standard rather than this project's
choice.

🔴 **Both Drizzle pins are load-bearing.** The `@rc` / 1.0-beta line emits a *directory* per migration, which
the Supabase CLI cannot read - so `supabase db push` reports success having applied **nothing**. Stay on
`drizzle-kit ~0.31` and `drizzle-orm ^0.45`; today those are also the registry's `latest`, so an `ncu -u` moves
them only within those lines (0.31.11 / 0.45.3 on 2026-09-25) rather than onto the trap.

### Rust (`desktop/src-tauri/Cargo.toml`)

`tauri` 2 with the `protocol-asset` feature, plus the `dialog`, `opener`, `os`, `process` and `updater`
plugins, `serde`/`serde_json`, `tiny_http` (the OAuth loopback listener) and `url`. No shell or filesystem
plugin: the engine is launched by a Rust command with a fixed executable and a validated argument allowlist,
so the webview cannot aim a process anywhere of its own choosing.

Every crate is required as `"2"` in `Cargo.toml` and pinned exactly by `Cargo.lock`. A Tauri crate moves only with
its npm package (the pairs above), by `cargo update -p <crate>` and nothing broader; the 2026-09-25 pass moved
`tauri-plugin-updater` alone, 2.11.0 -> 2.12.0.
