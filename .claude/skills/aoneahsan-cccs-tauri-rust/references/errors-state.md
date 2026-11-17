# Tauri Rust — errors, state and background work

## A richer error shape

A plain string is enough for display. When the frontend must *branch* on the failure, send a tagged object:

```rust
use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("not found")]
    NotFound,
    #[error("unauthorised")]
    Unauthorised,
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
    #[error("{0}")]
    Other(String),
}

// A tagged shape lets the UI distinguish "sign in again" from "try again"
// without string-matching a message that will change.
#[derive(Serialize)]
struct ErrorPayload<'a> { code: &'a str, message: String }

impl Serialize for AppError {
    fn serialize<S: serde::Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        let code = match self {
            AppError::NotFound => "not_found",
            AppError::Unauthorised => "unauthorised",
            AppError::Io(_) => "io",
            AppError::Other(_) => "other",
        };
        ErrorPayload { code, message: self.to_string() }.serialize(s)
    }
}
```

```ts
type IpcError = { code: 'not_found' | 'unauthorised' | 'io' | 'other'; message: string };
```

## Never leak internals in a message

An error crossing to the frontend can end up in a log or a screenshot. Keep paths, connection strings and
tokens out of it — the same rule as the fleet's env-error policy: name what failed, not the value.

```rust
// ❌ AppError::Other(format!("failed to open {}", db_path))
// ✅ AppError::Other("failed to open the local database".into())   + log the path internally
```

## State patterns

```rust
// Several independent pieces of state: manage each separately rather than
// one god-struct behind one lock — a single mutex serialises unrelated work.
app.manage(Mutex::new(Settings::default()));
app.manage(DbPool::connect(&path)?);          // already thread-safe: no mutex needed
app.manage(tokio::sync::Mutex::new(SyncQueue::default()));
```

Something already internally synchronised (a connection pool, an `Arc`-based client) does **not** need
another mutex.

```rust
// Keep the critical section tiny: clone what you need and drop the guard
// before doing IO, or you hold the lock across an await/blocking call.
#[tauri::command]
async fn sync(state: State<'_, tokio::sync::Mutex<SyncQueue>>) -> AppResult<usize> {
    let pending = { state.lock().await.take_pending() };   // guard dropped here
    let count = upload_all(pending).await?;                 // no lock held
    Ok(count)
}
```

## Background work

```rust
use tauri::{AppHandle, Emitter, Manager};

// Spawned in setup, owns an AppHandle so it can emit to the frontend.
// Long-running tasks need a shutdown path or they outlive the window.
Builder::default()
    .setup(|app| {
        let handle: AppHandle = app.handle().clone();
        tauri::async_runtime::spawn(async move {
            loop {
                match do_periodic_work().await {
                    Ok(n) => { let _ = handle.emit("sync://done", n); }
                    // Log and continue: a background task that dies on the
                    // first error looks identical to one that never ran.
                    Err(e) => { let _ = handle.emit("sync://error", e.to_string()); }
                }
                tokio::time::sleep(std::time::Duration::from_secs(300)).await;
            }
        });
        Ok(())
    })
```

## Module layout

```
src-tauri/src/
  main.rs              thin: calls lib::run()
  lib.rs               the Builder, setup, invoke_handler
  error.rs             AppError + AppResult
  state.rs             managed state structs
  commands/
    mod.rs
    profile.rs
    files.rs
```

Every command still registers in the **one** `generate_handler!` in `lib.rs`:

```rust
.invoke_handler(tauri::generate_handler![
    commands::profile::fetch_profile,
    commands::profile::update_profile,
    commands::files::pick_file,
])
```

## Testing a command

Command functions are ordinary Rust functions — the logic inside them is testable without Tauri. Keep the
`#[tauri::command]` wrapper thin and put the substance in a plain function it calls, which is testable
directly. (The fleet writes automated tests only on request; this is what makes it cheap when asked.)
