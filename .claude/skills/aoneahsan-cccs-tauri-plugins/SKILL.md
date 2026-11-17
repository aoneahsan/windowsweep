---
name: aoneahsan-cccs-tauri-plugins
description: 'Official Tauri v2 plugins: the full catalogue with desktop and mobile support, the three-place wiring every plugin needs, scoping filesystem and shell permissions, choosing between the store plugin and a database, and when a custom plugin is warranted. Use when adding any native capability, or when a call is denied.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/urls/tauri-v2.md
---

# Tauri v2 plugins

**The standard:** every plugin is wired in **three places** — the Rust crate, the JS package, and a
**capability permission**. Miss the third and the call fails at runtime with a permission error while
everything compiles.

```bash
# 1. Rust crate + 2. JS package (the CLI does both)
yarn tauri add store
```

```rust
// 3a. Register in the builder
tauri::Builder::default().plugin(tauri_plugin_store::Builder::new().build())
```

```json
// 3b. Grant the permission — src-tauri/capabilities/main.json
{ "identifier": "main", "windows": ["main"], "permissions": ["store:default"] }
```

## Catalogue

**Desktop + mobile:** Store (key-value) · File System · SQL (sqlx) · HTTP Client · Notifications ·
Clipboard · Deep Linking · Updater · Logging · OS Information · Process (incl. `relaunch`) · Opener ·
Upload · Websocket · Stronghold (encrypted store) · Persisted Scope · Window Customization

**Desktop only:** Dialog · Shell · Global Shortcut · Window State · Single Instance · Autostart · CLI ·
Positioner · Localhost · System Tray

**Mobile only:** Barcode Scanner · Biometric · Geolocation · Haptics · NFC

A desktop app extended to mobile **loses the desktop-only plugins** — dialogs, shell, tray, global shortcuts,
window state. Design the feature so it degrades rather than assuming they exist.

## Choosing

| Need | Plugin |
|---|---|
| Settings, small key-value | **Store** |
| Relational data, queries | **SQL** |
| Secrets, credentials | **Stronghold** — never Store |
| HTTP from the frontend | **HTTP Client** (goes through Rust, so no browser CORS) |
| Open a file or URL externally | **Opener** — not Shell |
| Run a program | **Shell**, scoped tightly |
| One running instance | **Single Instance** |
| Remember window size/position | **Window State** |

## Scope the dangerous ones

Filesystem and shell are where a permission grant becomes a security decision.

```json
{
  "identifier": "main",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "store:default",
    {
      "identifier": "fs:allow-read-text-file",
      // Scope to the directory the app owns. "fs:default" plus a broad scope
      // is read access to the user's whole disk from the webview.
      "allow": [{ "path": "$APPDATA/**" }]
    }
  ]
}
```

For Shell, allowlist **specific commands with fixed arguments** — never a pass-through that lets the frontend
choose the binary.

## Custom plugins

Warranted when you need a **reusable** native capability across projects, or platform-specific Kotlin/Swift.
For one app's own logic, a plain `#[tauri::command]` is simpler and needs no permission plumbing.

## Common mistakes

| Mistake | What happens | Instead |
|---|---|---|
| Crate and package added, no permission | Runtime permission error, compiles fine | Add the capability entry |
| `fs:default` unscoped | Webview can read the user's disk | Scope `allow` paths |
| Shell with frontend-chosen binary | Arbitrary execution | Fixed commands and arguments |
| Secrets in Store | Plain on disk | Stronghold |
| Assuming a desktop plugin on mobile | Fails on mobile only | Check the support matrix |

## Going deeper

- `references/catalog.md` — per-plugin wiring, scoping examples, and the mobile matrix.

## Related skills

`aoneahsan-cccs-tauri` (capabilities) · `-tauri-rust` · `-tauri-mobile` (support gaps) ·
`-tauri-desktop-ux` (tray, shortcuts, windows) · `-tauri-distribution` (updater).
