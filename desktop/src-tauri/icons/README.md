# Icons

`icon.svg` is the master. Everything else here is exported from it:

```bash
yarn tauri icon src-tauri/icons/icon.svg
```

🔴 **Re-export; never hand-edit a PNG.** The mark is the product's one visual
metaphor - the sweep, three strokes of decreasing weight - taken from the hero of
the approved click dummy, and its colours are the registered palette converted
from the OKLCH tokens rather than picked by eye (accent `#a1da44`, hue 128).

## What is deliberately pruned after each export

`tauri icon` writes the full cross-platform set. This app ships **NSIS and MSI on
Windows only**, so these are deleted:

| Removed | Why |
|---|---|
| `android/`, `ios/` | No mobile target, and the owner has no Apple Developer account (`~/.claude/rules/ios-platform-removal.md`) |
| `icon.icns` | macOS bundle icon; there is no macOS build |
| `Square*Logo.png`, `StoreLogo.png` | Windows Store (MSIX) assets; the bundle targets are `nsis` and `msi` |

The four `tauri.conf.json` references - `32x32.png`, `128x128.png`,
`128x128@2x.png`, `icon.ico` - plus `64x64.png` and `icon.png` are what the build
actually reads. If an MSIX or macOS target is ever added, re-run the export and
keep that platform's files rather than restoring them by hand.
