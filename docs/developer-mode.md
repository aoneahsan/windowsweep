# Developer mode

The first interactive run asks one question:

> Are you a developer on this machine?

The first interactive run asks one question:

> Are you a developer on this machine?

The answer is saved in `%USERPROFILE%\.windowsweep\config.json`. It decides how sections 1, 2, 3 and 5 treat the caches that make a developer's day fast, and whether sections 4, 17 and 20 run at all. The desktop window carries the same answer as a switch, on Home and in Settings, and passes it to this same engine - see [Desktop app](./desktop.md).

## Developer mode on

- Package-manager, build-tool and test-runner caches are **pruned by the idle gate**: a file goes only when its
  newest timestamp is `--days` old (default 100). A package you installed last month stays cached.
- - Versioned tool caches (Cypress, Playwright, Gradle distributions) keep their **newest version** whenever the idle gate is running. `--purge-all` replaces the gate with a full clear, and the newest version goes with the rest.
- Docker removes dangling layers, build cache idle for the window, and images no container uses that are older
  than the window. Volumes are never touched.
- - Section 17 scans your project roots for build artefacts in projects nobody touched for the window. It never scans a whole drive. It never enters `.git`, AppData or a toolchain folder. What it finds is a list you pick from, item by item, and `--yes` does not answer that prompt. Section 17 is in the Rebuilds tier, so what you pick is deleted rather than recycled: a `node_modules` folder is rebuilt by its package manager, never restored from a copy.
- Toolchains stay protected in every mode: nvm, Volta, corepack, global npm/pnpm/bun/deno packages, cargo and
  go binaries, the Android SDK.

## Developer mode off

- Sections 1, 2, 3 **clear** their caches completely - there is no work to keep warm.
- Section 5 runs `docker system prune -a -f` (volumes still untouched).
- Sections 4, 17 and 20 are skipped with a note.

## Flags

| Flag | Effect |
|---|---|
| `--developer` / `--not-developer` | Override the saved answer for this run |
| `--forget-developer` | Ask the question again on the next interactive run |
| `--purge-all` | Clear the cache targets completely even in developer mode. From a console it asks you to type `purge` once per run; in batch runs `--yes` is the confirmation |
| `-d N`, `--days N` | Move the idle window (a lower number is more aggressive) |

A non-interactive run with no saved answer (a Scheduled Task on a fresh machine, `--json`) defaults to
developer mode **on**, the conservative choice, and says so.

## Why 100 days, and why "newest of the three timestamps"

Windows keeps last-access times off on most volumes, so the tool takes the newest of last-write, last-access
and creation time as the "last touched" estimate. That can only make a file look fresher than it is, never
older, so a mistake keeps a cache entry instead of removing one. The 100-day default matches the sibling tools
for Linux and macOS; an entry a project needed in the last three months is the kind a developer misses.

## Being more aggressive, and what it costs

A shorter idle window removes caches a project may want next week; `--purge-all` removes all of them, newest version included. Neither is free, and neither reaches anything the chokepoint refuses.

```powershell
windowsweep --scan                                  # sizes first
windowsweep --dry-run --profile dev --days 30       # see what a 30-day window would take
windowsweep --profile dev --days 30 --yes
windowsweep --only 1 --purge-all --yes              # empty the package caches entirely
```

Last Updated: 2026-09-07
