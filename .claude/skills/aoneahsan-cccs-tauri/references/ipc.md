# Tauri v2 IPC

## Commands

```rust
// src-tauri/src/lib.rs
#[tauri::command]
fn greet(name: String) -> String {
    format!("Hello, {name}!")
}

// Async for anything that waits. Borrowed types like &str are not supported
// directly — take an owned String, or wrap the return in Result.
#[tauri::command]
async fn fetch_profile(id: String) -> Result<Profile, AppError> {
    let profile = api::get_profile(&id).await?;
    Ok(profile)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // 🔴 EVERY command in ONE generate_handler!. A second invoke_handler
        // call silently replaces the first — the earlier commands are simply
        // absent at runtime, with no warning at compile time.
        .invoke_handler(tauri::generate_handler![greet, fetch_profile])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**A command in `lib.rs` cannot be `pub`** — the macro's generated glue will not compile.

## Calling from the frontend

```ts
import { invoke } from '@tauri-apps/api/core';

// Rust `invoke_message: String` is `invokeMessage` here — camelCase by
// default. Use #[tauri::command(rename_all = "snake_case")] to match Rust.
const greeting = await invoke<string>('greet', { name: 'Ahsan' });
```

Type the boundary once and never call `invoke` raw from a component:

```ts
// src/lib/ipc.ts — the single typed seam between React and Rust.
export const ipc = {
  greet: (name: string) => invoke<string>('greet', { name }),
  fetchProfile: (id: string) => invoke<Profile>('fetch_profile', { id }),
};
```

That keeps command-name strings in one file, so a rename is one edit rather than a runtime error found by a
user.

## Errors

A `Result::Err` rejects the JS promise. The error type must be serialisable:

```rust
use serde::Serialize;

// thiserror gives the Display impl and the From conversions; the manual
// Serialize keeps the wire shape a plain string the frontend can show.
#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("not found")]
    NotFound,
    #[error("network error: {0}")]
    Network(String),
}

impl Serialize for AppError {
    fn serialize<S: serde::Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&self.to_string())
    }
}
```

```ts
try {
  await ipc.fetchProfile(id);
} catch (e) {
  // e is whatever the Rust error serialised to — a string here.
  showError(String(e));
}
```

🔴 **Never panic in a command.** A JS exception is recoverable; a Rust panic can take down the process. Return
`Result`, and treat `unwrap()` in a command as a bug.

## Events

Commands are request/response; events are push.

```rust
use tauri::{AppHandle, Emitter};

fn report_progress(app: &AppHandle, done: u64, total: u64) {
    // Emitting to the whole app is fine for broadcast state; use
    // emit_to(window_label, ..) when only one window should hear it.
    let _ = app.emit("download://progress", (done, total));
}
```

```ts
import { listen } from '@tauri-apps/api/event';

// listen returns an unlisten function — call it on unmount or the handler
// leaks and fires against a dead component.
useEffect(() => {
  const p = listen<[number, number]>('download://progress', (e) => setProgress(e.payload));
  return () => { p.then((unlisten) => unlisten()); };
}, []);
```

Namespace event names (`domain://event`) so they stay greppable as they multiply.

## Which to use

| Situation | Mechanism |
|---|---|
| Frontend asks for something and waits | Command |
| Rust has news the frontend did not request | Event |
| Long operation with progress | Command to start + events for progress |
| Streaming data | Events, or a channel |

## Permissions

An IPC command you wrote needs no capability entry — capabilities gate **core and plugin** APIs, not your own
commands. That is precisely why a command that wraps a dangerous operation deserves scrutiny: it is your
responsibility, not the permission system's.
