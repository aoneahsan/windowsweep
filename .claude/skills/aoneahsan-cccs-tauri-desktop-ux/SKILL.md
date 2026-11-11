---
name: aoneahsan-cccs-tauri-desktop-ux
description: 'Desktop interaction conventions for Tauri apps: window management and remembered state, native menus and the macOS-vs-Windows differences, system tray and close-to-tray, global shortcuts, drag-and-drop, following the OS light and dark preference, keyboard-first navigation. Use when designing any desktop surface.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/urls/tauri-v2.md
---

# Tauri desktop UX

A desktop app is judged against native applications, not against websites. The gap is rarely visual — it is
the conventions: what the close button does, whether the window remembers where it was, whether the menu bar
is in the right place.

**The standard:** **desktop conventions differ per OS and must be respected, not averaged.** macOS keeps a
single menu bar at the top of the screen and an app alive after the last window closes; Windows and Linux put
the menu in the window and quit with it.

## Windows

Set a `minWidth`/`minHeight` a real layout survives — the responsive thinking from web applies, because a
user *will* make it narrow. Persist size and position with the **Window State** plugin; an app that reopens
centred at default size every time feels temporary.

```rust
tauri::Builder::default()
    .plugin(tauri_plugin_window_state::Builder::default().build())
```

Multi-window: one purpose per window (a settings window, a detached preview). Each window gets its **own
capability entry** — that is the point of per-window capabilities.

## Menus

```rust
// Menus are native. On macOS the app menu (with About/Quit) is expected and
// its absence is conspicuous; on Windows/Linux the menu sits in the window.
let file = SubmenuBuilder::new(app, "File")
    .text("new", "New")
    .separator()
    .text("close", "Close Window")
    .build()?;
```

Use the platform's accelerator conventions — `Cmd` on macOS, `Ctrl` elsewhere; Tauri's `CmdOrCtrl` handles
it. A context menu on right-click is expected wherever there are per-item actions.

## Tray and the close button

🔴 **Closing a window is not the same as quitting**, and guessing wrong is the most annoying desktop bug
there is. Decide deliberately:

| App type | Close should |
|---|---|
| Document/editor | Close the window; quit when the last one closes (except macOS) |
| Background utility, monitor, sync client | **Hide to tray**, keep running |

If it hides to tray, say so the first time — a window that vanishes with no explanation reads as a crash. The
tray menu must always offer a genuine **Quit**.

## Global shortcuts

Register sparingly and make them **user-configurable**: a global hotkey is taken from every other app on the
system, and a collision is invisible to the user. Unregister on exit.

## Theme

Follow the OS light/dark preference by default and let the user override it — the same dual-layer contract as
`aoneahsan-cccs-flutter-theming` and the web theme rules.

```ts
import { getCurrentWindow } from '@tauri-apps/api/window';
const unlisten = await getCurrentWindow().onThemeChanged(({ payload }) => applyTheme(payload));
```

## Keyboard and drag-drop

Everything reachable by keyboard: logical tab order, visible focus, Escape closes, Enter confirms.
Drag-and-drop onto the window is expected wherever files are the subject — accept the drop, show a target
state, and validate what arrives.

## Common mistakes
- 🔴 **macOS privacy prompts block a background command silently** (macleanup, 2026-10-30): a shell tool the app
  runs that reads `~/Desktop`, `~/Documents`, `~/Downloads`, `~/Music`, `~/Movies` or `~/Pictures` makes macOS ask
  for access — and the command WAITS on the dialog, which looks like a minutes-long hang. Give every folder the app
  reads an `NS*UsageDescription` in `Info.plist`; do not read media libraries at all unless the feature needs them
  (a `du ~/*` asks for Apple Music and Photos). An ad-hoc-signed rebuild is a new identity: every prompt returns.

| Mistake | What happens | Instead |
|---|---|---|
| Window opens default-size every launch | Feels unfinished | Window State plugin |
| Close silently hides to tray | Reads as a crash | Tell the user once; always offer Quit |
| macOS quitting on last window close | Breaks a platform convention | Keep the app alive on macOS |
| Hard-coded `Ctrl` accelerators | Wrong on macOS | `CmdOrCtrl` |
| Fixed global shortcut | Silent collision with another app | Configurable, unregistered on exit |
| Ignoring the OS theme | Stands out against every native app | Follow it, allow override |

## Related skills

`aoneahsan-cccs-tauri` (windows in config) · `-tauri-plugins` (tray, shortcuts, window state) ·
`-react-accessibility` (keyboard and focus) · `-frontend-design` (visual direction).
