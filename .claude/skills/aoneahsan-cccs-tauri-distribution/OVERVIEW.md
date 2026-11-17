# Overview — `aoneahsan-cccs-tauri-distribution`

## Purpose

Turning a Tauri app into something users can install and keep updated — and being honest about what this
fleet can actually ship. Code signing is where the zero-cost rule collides with platform reality: Windows
certificates cost money and macOS notarization needs an Apple Developer account, neither of which the owner
has. The skill states that plainly rather than describing a release path that does not exist.

## What this skill does

- Gives the **build commands and per-OS bundle formats**, and states that each OS must be built on itself.
- Requires **icons generated from the one master SVG** via direct CLI.
- Sets out the **honest signing position** per platform — Linux clean, Windows unsigned with a documented
  SmartScreen warning, macOS effectively blocked.
- Treats the **updater private key as a real secret**: `~/.secrets/tauri/`, injected as
  `TAURI_SIGNING_PRIVATE_KEY`, public key only in config.
- Covers the **updater wiring** end to end and the two ways it silently ends up unverifiable.
- Requires **prompting before install** rather than restarting a user mid-work.
- Names **GitHub Releases** as the free channel and requires a **single-source version cascade**.

## When it gets invoked

- Producing installers or a release build.
- Setting up auto-updates.
- Planning how a desktop app reaches users.
- Generating app icons.
- A user reports a security warning on install.

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Tauri desktop apps being released |
| Stack override | Mobile store releases go through `aoneahsan-cccs-tauri-mobile` and the Play playbook |

## Sources

| Source | Record |
|---|---|
| v2.tauri.app distribute, plugin/updater | `_source-understanding/urls/tauri-v2.md` |
| The zero-cost constraint and the secrets-store rule | `~/.claude/rules/zero-cost.md`, `project-config.md` — applied, not copied |

## Related skills

- `aoneahsan-cccs-tauri` — identifier permanence and bundle config
- `aoneahsan-cccs-tauri-plugins` — the updater and process plugins
- `aoneahsan-cccs-tauri-mobile` — store distribution
- `aoneahsan-cccs-git-workflow` — the release commit and version cascade

## Maintenance

- **Living registries this skill points at:** `~/.claude/rules/zero-cost.md`,
  `~/.claude/rules/project-config.md` (the secrets store) — consult when present. Docs-derived; no Tauri
  project in the fleet yet.
- **Last reviewed:** 2026-07-21
