# Overview — `aoneahsan-cccs-tauri`

## Purpose

The root Tauri skill: what Tauri v2 is, how a project is shaped, and the two things most likely to cost hours
if unknown — the **capability model auto-enables every file in `capabilities/`**, and **calling
`invoke_handler` twice silently discards the earlier commands**. Both fail without an error message.

## What this skill does

- Explains the **architecture** (Rust core + system webview via TAO/WRY) and the size consequence.
- Gives the **scaffold** and the project layout, and establishes that the frontend is the house React stack.
- Covers **`tauri.conf.json`** essentials, marking `identifier` as permanent after release.
- Sets the **dev-loop position**: `tauri dev` is run-to-verify only; the gates are one-shot
  `cargo fmt`/`clippy` plus the frontend gates plus `tauri build`.
- Teaches **IPC** with the two documented traps (single `generate_handler!`, no `pub` in `lib.rs`) and the
  camelCase/snake_case argument convention.
- Establishes the **capability model** — per-window, least-privilege, `plugin:name-command` naming — and
  warns that everything in the directory is enabled by default.

## When it gets invoked

- Starting a Tauri app, or working on an existing one.
- Editing `tauri.conf.json` or a capability file.
- Wiring a frontend call to Rust.
- Granting a permission, or debugging one that is denied.
- Choosing between Tauri and another desktop approach.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Desktop applications; Tauri is the fleet's desktop stack |
| Stack override | The frontend follows the house React rules; Tauri governs the native seam |

## Sources

| Source | Record |
|---|---|
| v2.tauri.app start, prerequisites, develop, calling-rust, security/capabilities | `_source-understanding/urls/tauri-v2.md` |

## Related skills

- `aoneahsan-cccs-tauri-rust` — the Rust side in depth
- `aoneahsan-cccs-tauri-plugins` — the official plugin catalogue and wiring
- `aoneahsan-cccs-tauri-desktop-ux` — windows, menus, tray, shortcuts
- `aoneahsan-cccs-tauri-distribution` — bundling, signing, updates
- `aoneahsan-cccs-react` — the frontend stack

## Maintenance

- **Living registries this skill points at:** none. **No Tauri project exists in the fleet yet** — this
  family is docs-derived, so verify against v2.tauri.app when a detail matters.
- **Last reviewed:** 2026-07-21
