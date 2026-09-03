# windowsweep v1 - overview

Last Updated: 2026-09-03

## What

The first release of `windowsweep`: a safe, developer-aware disk and cache cleanup CLI for Windows 10/11,
built as a Windows PowerShell 5.1 engine behind a dependency-free Node launcher, published as a public GitHub
repository and an npm package. The Windows member of the family with `linux-cleanup` and `macleanup`.

## Why

The owner's workstation had 1.8 GB free on a 273 GB system drive and no Windows tool in the family. The
existing cleaners either know nothing about developer caches or wipe them wholesale; the requirement was a
tool that asks whether the user is a developer, keeps the caches used in the last 100 days, names every path
before touching it, never follows a junction, ships a real dry-run and makes no network calls.

## Acceptance criteria

- `--self-test` passes on Windows PowerShell 5.1 and PowerShell 7, and fails on a planted defect of either
  shape (a protected path leaked into a target list; a syntax error).
- `--dry-run --all --yes` changes nothing on disk and reports a per-section estimate.
- Every deletion goes through the chokepoint with a declared root; the protected lists refuse drive roots,
  Windows, Program Files, the profile root, personal folders, credentials, toolchains and browser/editor state.
- Developer mode prunes by the 100-day idle gate and keeps the newest version of every versioned tool cache;
  non-developer mode clears those caches.
- Deep sections need `--i-understand-deep`; personal sections never run unattended and use the Recycle Bin.
- Admin sections skip with the exact `--elevate` command when not elevated.
- The real run on the owner's machine reclaims space without touching a protected path.
- Public repo with protected `main`, CI on both hosts, canonical README, and the package published to npm.

## Phases

Tracked in `00-tracker.json` (A scaffold and engine, B user-level sections, C admin/personal sections and
modes, D docs and package files, E verification and the real run, F git and GitHub, G npm publish, H record).
