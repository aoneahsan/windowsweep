# Tauri signing, updates and the release checklist

## The signing reality, per platform

| Platform | Requirement | Cost | Status in this fleet |
|---|---|---|---|
| Linux | none | free | ✅ ships cleanly |
| Windows | code-signing certificate (OV or EV) | **paid, annual** | ⚠️ unsigned — SmartScreen warns |
| macOS | Apple Developer account + notarization | **paid, annual** | ❌ Gatekeeper blocks unsigned builds |

**Never describe a signed Windows or notarized macOS release as available.** If the owner asks for one, that
is a spending decision — surface it as an owner question rather than assuming.

### Documenting the Windows warning honestly

On a download page or release note:

> This installer is not code-signed. Windows SmartScreen will show a
> "Windows protected your PC" warning. Choose **More info → Run anyway** to install.
> Signing requires a paid certificate we do not currently hold.

That is a true, complete explanation. Telling users to "ignore the warning" without saying why is not.

## The updater

### Keys

```bash
# The keypair. The private key NEVER enters the repo.
yarn tauri signer generate -- -w ~/.secrets/tauri/myapp.key
chmod 600 ~/.secrets/tauri/myapp.key
```

Add a row to `~/.secrets/INDEX.md` naming the service, the file, and what consumes it. Losing this key means
**existing installs can never be updated again** — a new key is a new trust root, so back it up where the
owner keeps backups.

### Config

```jsonc
{
  "bundle": { "createUpdaterArtifacts": true },
  "plugins": {
    "updater": {
      "pubkey": "dW50cnVzdGVkIGNvbW1lbnQ6...",
      "endpoints": [
        "https://github.com/aoneahsan/myapp/releases/latest/download/latest.json"
      ]
    }
  }
}
```

Endpoint variables: `{{target}}` (linux/windows/darwin), `{{arch}}` (x86_64/aarch64/i686/armv7),
`{{current_version}}`.

### Building with the key

```bash
export TAURI_SIGNING_PRIVATE_KEY="$(cat ~/.secrets/tauri/myapp.key)"
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD="…"   # if the key has one
yarn tauri build
```

`.sig` files appear beside the installers. **No key in the environment means no `.sig` files**, and the
updater then cannot verify anything — the build still succeeds, which is what makes this easy to miss.

### The manifest

```json
{
  "version": "1.2.0",
  "notes": "Fixes the export dialog.",
  "pub_date": "2026-07-21T10:00:00Z",
  "platforms": {
    "linux-x86_64":   { "signature": "<contents of the .sig file>", "url": "https://…/myapp.AppImage" },
    "windows-x86_64": { "signature": "<contents of the .sig file>", "url": "https://…/myapp-setup.exe" },
    "darwin-aarch64": { "signature": "<contents of the .sig file>", "url": "https://…/myapp.app.tar.gz" }
  }
}
```

Required: `version`, and per platform `url` + `signature`. The signature is the **contents** of the `.sig`
file, not a path to it.

### Checking from the app

```ts
import { check } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { ask } from '@tauri-apps/plugin-dialog';

export async function checkForUpdate({ silent = true } = {}) {
  try {
    const update = await check();
    if (!update) { if (!silent) await info('You are up to date.'); return; }

    // Ask first. A desktop app that restarts itself mid-work is worse than
    // one that is a version behind.
    const yes = await ask(`Version ${update.version} is available.\n\n${update.body ?? ''}\n\nInstall now?`,
      { title: 'Update available', kind: 'info' });
    if (!yes) return;

    await update.downloadAndInstall((e) => {
      if (e.event === 'Progress') setProgress(e.data.chunkLength);
    });
    await relaunch();
  } catch (e) {
    // An unreachable update server must never break the app.
    log.warn(`Update check failed: ${e}`);
  }
}
```

Check on launch (silently) and from a "Check for updates" menu item (with feedback either way).

## Release checklist

1. Version bumped in `package.json`; changelog entry written; download page updated.
2. `cargo fmt --check`, `cargo clippy -- -D warnings`, frontend typecheck and lint all clean.
3. `yarn tauri build` on each target OS, with the signing key in the environment.
4. `.sig` files present beside every installer (if the updater is enabled).
5. Installers smoke-tested: fresh install, and an upgrade over the previous version.
6. GitHub Release created with the installers and `latest.json` attached.
7. Update tested from the **previous** version, not just a fresh install.
8. USER-ONLY steps recorded in `docs/MANUAL-TASKS.md` — anything needing a paid certificate or an Apple
   account.

## CI awareness

`tauri-apps/tauri-action` builds per-OS runners and drafts a GitHub Release. Keys go in repository secrets,
never in the workflow file. This is the only practical way to produce macOS, Windows and Linux artefacts from
one release — but it is a workflow file, not a helper script, so it stays within the fleet's no-scripts rule.

## Measured on windowsweep, 2026-11-07

- **`releases/latest/download/<asset>` lags the API.** For about a minute after a new Latest, the redirect still served the
  previous release's `latest.json` while `GET /releases/latest` already named the new tag. Wait on the redirect itself (a
  bounded until-loop on its `Location`), then byte-compare the served manifest with the kit.
- **An installed-updater proof closes only after the background download is staged.** The splash says "ready" when the check
  finds the release; the close-to-install hook is armed when the download finishes. Closing one second after the notice
  installed nothing; waiting 45 s installed in 3 s. A fresh isolated WebView2 profile also creates an anonymous device
  session on its first launch: find it in the profile's Local Storage, then delete exactly that user.

## Windows release assets and updater proof (windowsweep, 2026-11-08)

- A variable WOFF2 lost its cmap when read directly with fontkit. Unpack it to TTF with fontTools before outlining text for installer artwork.
- libvips doubled the scale of artwork specified in millimetres. Export print PNGs with pixel dimensions and `--withDensity`; inspect the rendered size.
- `png-to-ico` inserted an upscaled 256-pixel entry. Build the ICO with Pillow from actual rendered sizes, then inspect its entries.
- An XML comment cannot contain `--`. The Tauri icon export and SVG parsers refuse such a master; validate the SVG before icon generation.
- Tauri's NSIS setup kept the stock icon and Welcome/Finish picture until `installerIcon`, `uninstallerIcon` and `sidebarImage` were set. Extract the built setup's icon and capture its first page before claiming the installer uses the brand kit.
- An unbundled Tauri build reads the manifest's generic platform key (the MSI in this case). NSIS preserves build timestamps, so `uninstall.exe` modification time marks an actual install more reliably than the setup file. Prove the update on a local test channel and read the installed version after the window closes.
