---
name: aoneahsan-cccs-tauri-distribution
description: 'Building and shipping Tauri apps: bundle formats per OS, generating icons from one master SVG, the updater plugin and its minisign keypair, the honest signing position given no code-signing certificate or Apple account, version cascade, and GitHub Releases as the free channel. Use when producing installers or planning a release.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/urls/tauri-v2.md
---

# Tauri distribution

**The standard:** the **updater's private key is a real secret.** It lives in `~/.secrets/tauri/`, registered
in `INDEX.md`, and reaches the build only as the `TAURI_SIGNING_PRIVATE_KEY` environment variable. Only the
**public** key goes in `tauri.conf.json`. Leak the private key and anyone can push a signed "update" to every
install.

🔴 **Lose the private key and every shipped install stops updating** — users must reinstall by hand. That
happened to macleanup 4.6.x (generated on one machine in June 2026, never backed up; owner, 2026-10-30: *"we must
not face this same key issue ever again"*). So, **the same day the keypair is generated**: copy the key, its
password and the `.pub` into the project's FilesHub vault (`general_files.bk_<project>_tauri_updater_key`,
`…_password`, `…_pub`); compare the three checksums (local, download, `X-Checksum-Sha256`); **prove a restore**
by running `yarn tauri signer sign -f <downloaded key> <file>` and verifying that `.sig` against the
`pubkey` in `tauri.conf.json` (Ed25519 over BLAKE2b-512 for the `ED` algorithm; Node's `crypto` does it); and
name the vault keys in the project's `CLAUDE.md` + `AGENTS.md`. A release is never built with a key that is not
in the vault.

## Building

```bash
yarn tauri build                              # all default bundles for this OS
yarn tauri build --bundles deb,appimage       # specific formats
yarn tauri build --no-bundle                  # binary only
```

**You can only build for the OS you are on** — a macOS `.dmg` needs a Mac. Cross-platform releases mean CI
runners per OS.

| OS | Formats |
|---|---|
| Linux | AppImage, `.deb`, `.rpm`, Snap, AUR |
| macOS | `.dmg` / `.app`, App Store |
| Windows | NSIS / MSI installer, Microsoft Store |

## Icons from one master

```bash
yarn tauri icon path/to/master-logo.png       # writes every platform size
```

Export the PNG from the **one master SVG** (`rsvg-convert`, ImageMagick `magick`, or `npx -y sharp-cli` —
direct CLI, never a script file), consistent with the fleet's SVG-first rule.

## The honest signing position

This is where the zero-cost rule meets platform reality. **Do not imply a signed release is available when it
is not.**

| Platform | Reality |
|---|---|
| **Linux** | No signing needed. Ships cleanly. |
| **Windows** | A code-signing certificate **costs money** and the owner has none. An unsigned installer triggers a **SmartScreen warning** — document it for users; do not pretend it will not appear. |
| **macOS** | Signing and notarization require an **Apple Developer account**, which the owner does not have. Unsigned builds are blocked by Gatekeeper for ordinary users. USER-ONLY if an account is ever obtained. |

So the shippable story today is **Linux cleanly, Windows unsigned with an honest warning note, macOS
effectively blocked**.

## The updater

```bash
yarn tauri signer generate -- -w ~/.secrets/tauri/myapp.key   # minisign keypair
```

```jsonc
{
  "bundle": { "createUpdaterArtifacts": true },
  "plugins": {
    "updater": {
      "pubkey": "<the PUBLIC key — safe to commit>",
      "endpoints": ["https://releases.example.com/{{target}}/{{arch}}/{{current_version}}"]
    }
  }
}
```

```ts
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';

const update = await check();
if (update) {
  await update.downloadAndInstall();
  await relaunch();
}
```

Prompt before installing unless the update is genuinely mandatory — a desktop app that restarts itself
mid-work is worse than one that is a version behind.

🔴 Without `createUpdaterArtifacts` **or** without the signing key in the build environment, you get
installers with **no `.sig` files** and the updater silently cannot verify anything.

## Distribution and versioning

**GitHub Releases** is the free channel — it hosts the installers and can serve the update manifest
(`version`, and per platform `url` + `signature`). Bump the version in one place (`package.json`, inherited by
`tauri.conf.json`) and cascade it to the changelog and any website download page in the same change.

## Common mistakes

| Mistake | What happens | Instead |
|---|---|---|
| Private key in the repo or config | Anyone can sign updates for your users | `~/.secrets/`, env var at build |
| Private key only on one machine | A lost or replaced Mac ends updates for every install | Vault backup + restore proof the day it is generated |
| Promising a signed Windows build | Costs money the project does not have | Ship unsigned, document SmartScreen |
| Updater without `createUpdaterArtifacts` | No `.sig` files, verification impossible | Enable it and set the key |
| Silent auto-install | Restarts the user mid-work | Prompt, unless mandatory |
| Expecting one machine to build all OSes | Cannot be done | CI runner per OS |

## Going deeper

- `references/signing.md` — per-platform detail, the update manifest, and the release checklist.

## Related skills

`aoneahsan-cccs-tauri` (identifier, config) · `-tauri-plugins` (updater, process) ·
`-tauri-mobile` (store releases) · `-git-workflow` (the release commit).
