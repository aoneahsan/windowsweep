# Overview — `aoneahsan-cccs-tauri-plugins`

## Purpose

The official plugin catalogue and how to wire one correctly. Its central rule exists because the failure is
confusing rather than obvious: a plugin added to Cargo and to package.json **compiles perfectly and fails at
runtime**, because the third wiring step — the capability permission — is the one people forget.

## What this skill does

- Establishes the **three-place wiring** (Rust crate, JS package, capability permission) with the commands.
- Carries the **full official catalogue** split by desktop-only, mobile-only, and both.
- Names what a **desktop app loses when extended to mobile**.
- Gives a **choosing table** for the overlapping options (Store vs SQL vs Stronghold, Opener vs Shell).
- Requires **scoping the dangerous plugins** — filesystem paths and shell commands — with a worked capability
  example.
- States when a **custom plugin** is warranted versus a plain command.

## When it gets invoked

- Adding any native capability to a Tauri app.
- Wiring or debugging a plugin.
- A plugin call denied by the permission system.
- Choosing where to persist settings, data or secrets.
- Planning a desktop-to-mobile extension.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Every Tauri project |
| Stack override | Plugins are Tauri's native surface; no analogue elsewhere |

## Sources

| Source | Record |
|---|---|
| v2.tauri.app plugin catalogue and security/capabilities | `_source-understanding/urls/tauri-v2.md` |

## Related skills

- `aoneahsan-cccs-tauri` — the capability model these plug into
- `aoneahsan-cccs-tauri-rust` — the Rust side of plugin registration
- `aoneahsan-cccs-tauri-mobile` — the support matrix in practice
- `aoneahsan-cccs-tauri-desktop-ux` — tray, shortcuts and window plugins
- `aoneahsan-cccs-tauri-distribution` — the updater plugin

## Maintenance

- **Living registries this skill points at:** none. The plugin list is versioned — verify against
  v2.tauri.app when a detail matters. Docs-derived; no Tauri project in the fleet yet.
- **Last reviewed:** 2026-07-21
