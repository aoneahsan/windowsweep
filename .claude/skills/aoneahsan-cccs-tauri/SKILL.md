---
name: aoneahsan-cccs-tauri
description: 'Tauri v2 desktop apps: the Rust-core plus system-webview architecture, scaffolding with a React frontend, tauri.conf.json and the permanent identifier, the dev loop and its gates, IPC between frontend and Rust, and the capability-based security model that replaced v1''s allowlist. Use when starting or working on a Tauri app.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/urls/tauri-v2.md
---

# Tauri v2

A Rust core plus **the operating system's existing webview** — TAO for windows, WRY for the webview. No
browser engine is bundled, so a minimal app is **under 600 KB** against Electron's Chromium payload. Desktop
and mobile.

**The standard:** **capabilities are least-privilege, per window.** Every file in `src-tauri/capabilities/`
is **enabled by default**, so a permissive capability dropped in "temporarily" is live immediately and
invisibly.

## Scaffold

```bash
npm create tauri-app@latest        # choose React + TypeScript + Vite
```

The frontend is the house React stack — reuse `aoneahsan-cccs-react` and its siblings. Tauri does not change
how the UI is written; it changes what the UI can reach.

```
src/                    the React app
src-tauri/
  src/main.rs, lib.rs   the Rust core and commands
  tauri.conf.json       identifier, windows, bundle, plugin config
  capabilities/*.json   what each window may do
  Cargo.toml
```

## `tauri.conf.json`

```jsonc
{
  "productName": "My App",
  // ⚠️ PERMANENT once released — it keys the install, the updater and the
  // OS's per-app storage. Changing it orphans every existing install.
  "identifier": "com.aoneahsan.myapp",
  "build": {
    "beforeDevCommand": "yarn dev",
    "devUrl": "http://localhost:5910",
    "beforeBuildCommand": "yarn build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [{ "title": "My App", "width": 1200, "height": 800, "resizable": true }],
    "security": { "csp": "default-src 'self'; img-src 'self' data:" }
  }
}
```

## The dev loop

`tauri dev` builds the Rust core, opens the webview and **watches `src-tauri/` to rebuild and restart**. It is
a long-lived process — **run-to-verify only**, then kill it. The gates are one-shot:

```bash
cargo fmt --check --manifest-path src-tauri/Cargo.toml
cargo clippy --manifest-path src-tauri/Cargo.toml -- -D warnings
yarn typecheck && yarn lint
yarn tauri build
```

## IPC

```rust
#[tauri::command]
fn greet(name: String) -> String { format!("Hello, {name}!") }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    // 🔴 ONE generate_handler! with every command. Calling invoke_handler
    // twice silently keeps only the last call — the earlier commands simply
    // do not exist at runtime, with no error.
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

```ts
import { invoke } from '@tauri-apps/api/core';
// Rust snake_case params are camelCase from JS by default.
const msg = await invoke<string>('greet', { name: 'Ahsan' });
```

A command in `lib.rs` **cannot be `pub`** — the macro's generated glue fails to compile.

## Capabilities

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-capability",
  "description": "Capability for the main window",
  "windows": ["main"],
  "permissions": ["core:path:default", "core:event:default", "core:window:default"]
}
```

Permissions are named `plugin:name-command`. Scope `windows` explicitly — never a blanket `"*"` alongside
broad permissions.

## Common mistakes

| Mistake | What happens | Instead |
|---|---|---|
| Two `invoke_handler` calls | Earlier commands vanish, no error | One `generate_handler!` |
| `pub` command in `lib.rs` | Compile failure in generated glue | Drop `pub` |
| Broad capability "for now" | Live grant, immediately | Least privilege, scoped windows |
| Changing `identifier` after release | Every install orphaned | Treat as permanent |
| `tauri dev` as the check | Long-lived process | One-shot clippy + build |

## Going deeper

- `references/setup.md` — project creation, config reference, dev workflow, debugging.
- `references/ipc.md` — commands, events, payload typing, and the frontend seam.

## Related skills

`aoneahsan-cccs-tauri-rust` · `-tauri-plugins` · `-tauri-desktop-ux` · `-tauri-distribution` ·
`-tauri-mobile` · `-react` (the frontend).
