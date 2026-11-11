# Overview — `aoneahsan-cccs-tauri-desktop-ux`

## Purpose

Making a Tauri app behave like a desktop application rather than a website in a window. The failures this
prevents are conventions rather than bugs — a close button that hides without saying so, a window that
forgets where it was, a menu bar in the wrong place on macOS. Users notice all three immediately and none of
them appear in a build log.

## What this skill does

- Requires **remembered window state** and a minimum size a real layout survives.
- Assigns **one purpose per window** and ties multi-window to per-window capabilities.
- Covers **native menus**, the macOS-versus-Windows/Linux differences, and `CmdOrCtrl` accelerators.
- Makes the **close-button decision explicit**, with a table by app type and the rule that hiding to tray
  must be announced and always paired with a real Quit.
- Requires **global shortcuts to be sparse, configurable and unregistered on exit**.
- Requires **following the OS theme** with a user override.
- Requires **keyboard operability** and drag-and-drop where files are the subject.

## When it gets invoked

- Designing or reviewing any desktop surface.
- Adding a menu, tray icon, or global shortcut.
- Deciding what the close button does.
- Adding a second window.
- Wiring dark mode on desktop.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Tauri desktop apps |
| Stack override | Desktop conventions; the mobile arm is `aoneahsan-cccs-tauri-mobile` |

## Sources

| Source | Record |
|---|---|
| v2.tauri.app window, menu, tray and plugin documentation | `_source-understanding/urls/tauri-v2.md` |

## Related skills

- `aoneahsan-cccs-tauri` — window configuration and capabilities
- `aoneahsan-cccs-tauri-plugins` — tray, global shortcut, window state plugins
- `aoneahsan-cccs-react-accessibility` — keyboard and focus in the frontend
- `aoneahsan-cccs-frontend-design` — visual direction

## Maintenance

- **Living registries this skill points at:** none. Docs-derived; no Tauri project in the fleet yet.
- **Last reviewed:** 2026-07-21
