# Overview — `aoneahsan-cccs-tauri-rust`

## Purpose

The Rust subset a Tauri backend actually needs. It exists separately from the core Tauri skill because the
failure modes are Rust-shaped rather than Tauri-shaped: a panic that kills the process where a JS exception
would have been caught, and a mutex choice that deadlocks only under async.

## What this skill does

- Establishes **never panic across IPC** and `Result` returns as the rule.
- Gives the **`thiserror` + manual `Serialize` error enum**, including why `#[from]` matters for `?`.
- Teaches **managed state**: `app.manage` in `setup`, `State<'_, T>` extraction, and that **no `Arc` is
  needed**.
- Draws the **sync vs async mutex** distinction and names the deadlock it prevents.
- Covers **async command constraints** (owned parameters) and `spawn_blocking` for blocking work.
- Explains **setup hooks** and when failing to start is appropriate.
- Sets **cargo discipline** (minimal features, module splitting, thin `main.rs`) and the
  **clippy/fmt gates**.

## When it gets invoked

- Writing or reviewing any Rust under `src-tauri/`.
- Adding managed application state.
- Designing an error type that crosses to the frontend.
- A command panics, deadlocks, or fails to compile.
- Adding a Rust dependency.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Every Tauri project |
| Stack override | Rust is not optional in Tauri — this is the backend language |

## Sources

| Source | Record |
|---|---|
| v2.tauri.app calling-rust, state-management | `_source-understanding/urls/tauri-v2.md` |

## Related skills

- `aoneahsan-cccs-tauri` — IPC, config and the capability model
- `aoneahsan-cccs-tauri-plugins` — plugins that expose Rust capability
- `aoneahsan-cccs-tauri-distribution` — building and shipping the binary
- `aoneahsan-cccs-programming-principles` — module design as `lib.rs` grows

## Maintenance

- **Living registries this skill points at:** none. Docs-derived — no Tauri project exists in the fleet yet.
- **Last reviewed:** 2026-07-21
