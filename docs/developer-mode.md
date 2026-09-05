# Developer mode

The first interactive run asks one question:

> Are you a developer on this machine?

The answer is saved in `~\.windowsweep\config.json` and decides how sections 1-5 treat the caches that make a
developer's day fast.

## Developer mode on

- Package-manager, build-tool and test-runner caches are **pruned by the idle gate**: a file goes only when its
  newest timestamp is `--days` old (default 100). A package you installed last month stays cached.
- Versioned tool caches (Cypress, Playwright, Gradle distributions) keep their **newest version** under the
  idle gate. 🔴 `--purge-all` removes that protection along with the gate - it rewrites those targets to clear
  completely, newest version included. The safety-model page always said "by the idle gate"; this page said
  "unconditionally", and the two disagreed in exactly the case where it mattered.
- Docker removes dangling layers, build cache idle for the window, and images no container uses that are older
  than the window. Volumes are never touched.
- Section 17 scans your project roots for build artefacts in projects nobody touched for the window.
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

## Being more aggressive safely

```powershell
windowsweep --scan                                  # sizes first
windowsweep --dry-run --profile dev --days 30       # see what a 30-day window would take
windowsweep --profile dev --days 30 --yes
windowsweep --only 1 --purge-all --yes              # empty the package caches entirely
```

Last Updated: 2026-09-03
