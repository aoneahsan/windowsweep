# Tauri v2 plugin catalogue

Support column: **D** desktop, **M** mobile. Verify against v2.tauri.app when a detail matters — the list is
versioned.

| Plugin | Support | What it does |
|---|---|---|
| Store | D+M | Persistent key-value storage |
| File System | D+M | Filesystem access (scope it) |
| SQL | D+M | Database access via sqlx |
| HTTP Client | D+M | HTTP from Rust — no browser CORS |
| Notifications | D+M | Native notifications |
| Clipboard | D+M | Read/write the system clipboard |
| Deep Linking | D+M | Register the app as a URL handler |
| Updater | D+M | In-app updates |
| Logging | D+M | Configurable logging |
| OS Information | D+M | Platform, version, arch |
| Process | D+M | Current process, `relaunch`, `exit` |
| Opener | D+M | Open files/URLs in external apps |
| Upload | D+M | HTTP file uploads |
| Websocket | D+M | Rust WebSocket client from JS |
| Stronghold | D+M | Encrypted secure database |
| Persisted Scope | D+M | Persist runtime scope changes |
| Window Customization | D+M | Window appearance and behaviour |
| Dialog | **D** | Native open/save/message dialogs |
| Shell | **D** | Spawn child processes |
| Global Shortcut | **D** | System-wide hotkeys |
| Window State | **D** | Persist window size and position |
| Single Instance | **D** | Enforce one running instance |
| Autostart | **D** | Launch at system startup |
| CLI | **D** | Parse command-line arguments |
| Positioner | **D** | Move windows to common positions |
| Localhost | **D** | Localhost server in production |
| System Tray | **D** | Tray integration |
| Barcode Scanner | **M** | Camera QR / EAN-13 scanning |
| Biometric | **M** | Biometric authentication prompt |
| Geolocation | **M** | Position, altitude, heading, speed |
| Haptics | **M** | Haptic feedback / vibration |
| NFC | **M** | Read/write NFC tags |

## Store

```bash
yarn tauri add store
```

```ts
import { load } from '@tauri-apps/plugin-store';

// autoSave batches writes; pass false and call save() explicitly when you
// need a guaranteed flush before an action (e.g. before relaunch).
const store = await load('settings.json', { autoSave: true });
await store.set('theme', 'dark');
const theme = await store.get<string>('theme');
```

Permission: `"store:default"`. Settings only — **secrets go to Stronghold.**

## File System — scoping

```json
{
  "identifier": "main",
  "windows": ["main"],
  "permissions": [
    "core:default",
    {
      "identifier": "fs:allow-read-text-file",
      "allow": [{ "path": "$APPDATA/**" }, { "path": "$APPCONFIG/**" }]
    },
    { "identifier": "fs:allow-write-text-file", "allow": [{ "path": "$APPDATA/**" }] }
  ]
}
```

Variables: `$APPDATA`, `$APPCONFIG`, `$APPCACHE`, `$DOCUMENT`, `$DOWNLOAD`, `$HOME`, `$RESOURCE`.

🔴 **`fs:default` with no scope gives the webview access to the user's filesystem.** If the frontend is ever
compromised — a dependency, an injected script — that is the blast radius. Grant the narrowest path set that
works. When the user picks a file through a dialog, **Persisted Scope** keeps that grant across restarts
without widening the static scope.

## Shell

```json
{
  "identifier": "shell:allow-execute",
  "allow": [{
    "name": "git-status",
    "cmd": "git",
    "args": ["status", "--porcelain"]    // FIXED arguments
  }]
}
```

```ts
import { Command } from '@tauri-apps/plugin-shell';
const out = await Command.create('git-status').execute();
```

Never expose a command whose binary or arguments the frontend chooses freely — that is arbitrary code
execution through a webview.

## SQL

```bash
yarn tauri add sql --features sqlite
```

```ts
import Database from '@tauri-apps/plugin-sql';
const db = await Database.load('sqlite:app.db');
// Parameterised, always — string interpolation here is SQL injection.
await db.execute('INSERT INTO notes (title) VALUES ($1)', [title]);
const rows = await db.select<Note[]>('SELECT * FROM notes ORDER BY id DESC LIMIT $1', [20]);
```

The fleet's data-fetch budget applies: every list query carries a limit.

## Single Instance

```rust
// Must be registered FIRST, before other plugins, so a second launch is
// intercepted before the rest of the app initialises.
tauri::Builder::default()
    .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
        if let Some(w) = app.get_webview_window("main") {
            let _ = w.set_focus();
        }
    }))
```

## Logging

```rust
tauri::Builder::default().plugin(
    tauri_plugin_log::Builder::new()
        .level(log::LevelFilter::Warn)     // warn by default, matching the fleet logger rule
        .build(),
)
```

Use this rather than `println!` for anything shipped — the frontend equivalent of the no-`console.*` rule.
