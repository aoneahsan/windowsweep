---
name: aoneahsan-cccs-tauri-rust
description: 'The Rust side of Tauri apps: command signatures and async rules, serialisable error enums instead of panics, managed application state with the right mutex for sync vs async, builder setup hooks, cargo dependency discipline, and the clippy and fmt gates. Use when writing Rust in src-tauri or when a command panics.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/urls/tauri-v2.md
---

# Rust for Tauri

You do not need deep Rust to write a good Tauri backend — you need a small, disciplined subset. Most Tauri
Rust is: take arguments, do IO, return `Result`.

**The standard:** **never panic across the IPC boundary.** A JS exception is recoverable; a Rust panic can
take down the process. Every command returns `Result`, and `unwrap()` in a command is a bug.

## Errors

```rust
use serde::Serialize;

// thiserror writes Display and the From conversions; the manual Serialize
// controls the wire shape the frontend actually receives.
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("not found")]
    NotFound,
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),      // `?` on any io::Error now works
    #[error("invalid input: {0}")]
    Invalid(String),
}

impl Serialize for AppError {
    fn serialize<S: serde::Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&self.to_string())
    }
}

pub type AppResult<T> = Result<T, AppError>;
```

`#[from]` is what makes `?` ergonomic — without it every fallible call needs a manual `map_err`.

## State

```rust
use std::sync::Mutex;
use tauri::{Builder, Manager, State};

#[derive(Default)]
struct AppState { counter: u32 }

Builder::default()
    .setup(|app| {
        // No Arc needed — Tauri handles sharing for managed state.
        app.manage(Mutex::new(AppState::default()));
        Ok(())
    })

#[tauri::command]
fn increment(state: State<'_, Mutex<AppState>>) -> Result<u32, AppError> {
    let mut s = state.lock().map_err(|_| AppError::Invalid("state poisoned".into()))?;
    s.counter += 1;
    Ok(s.counter)
}
```

🔴 **Match the mutex to the command.** `std::sync::Mutex` in a sync command; **tokio's `Mutex` in an `async`
command** (`.lock().await`). Holding a `std` mutex guard across an `.await` deadlocks — the compiler will not
always stop you.

Outside a command: `app_handle.state::<Mutex<AppState>>()`.

## Async commands

```rust
// Borrowed types like &str are not supported directly. Take owned values,
// or wrap the return in Result.
#[tauri::command]
async fn fetch(url: String) -> AppResult<String> {
    let body = reqwest::get(&url).await.map_err(|e| AppError::Invalid(e.to_string()))?;
    Ok(body.text().await.map_err(|e| AppError::Invalid(e.to_string()))?)
}
```

Anything that blocks — filesystem walks, hashing, image work — goes to `tauri::async_runtime::spawn_blocking`
or it stalls the runtime.

## Setup hooks

`.setup(|app| { ... })` runs once before windows show: seed managed state, open a database, register a tray,
start a background task. Return `Err` and the app fails to start — appropriate when a missing prerequisite
makes it useless, but prefer degrading where you can.

## Cargo

Keep features minimal (`default-features = false` plus what you need) — features are compile time and binary
size. Group commands into `src/commands/` modules as they multiply rather than growing `lib.rs` past the
fleet's 500-line ceiling. Keep `main.rs` thin so the mobile entry point in `lib.rs` serves both targets.

## Gates

```bash
cargo fmt --check --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
```

Clippy at deny-warnings catches most of what a Rust reviewer would.

## Common mistakes

| Mistake | What happens | Instead |
|---|---|---|
| `unwrap()` in a command | Panic takes down the process | Return `Result` |
| `std::sync::Mutex` in async | Deadlock across `.await` | tokio `Mutex` |
| `&str` parameter in an async command | Does not compile | Owned `String` |
| Blocking work on the async runtime | UI stalls | `spawn_blocking` |
| Error type without `Serialize` | Will not cross IPC | `thiserror` + manual `Serialize` |

## Going deeper

- `references/errors-state.md` — richer error shapes, state patterns, and background tasks.

## Related skills

`aoneahsan-cccs-tauri` (IPC and config) · `-tauri-plugins` · `-tauri-distribution` ·
`-programming-principles` (module design).
