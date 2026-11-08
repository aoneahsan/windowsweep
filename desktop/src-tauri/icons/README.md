# Icons

`icon.svg` is the master. Everything else here is exported from it:

```bash
yarn tauri icon src-tauri/icons/icon.svg
```

🔴 **Re-export; never hand-edit a PNG.** The mark is the website header's two
sweep curves, as `brand-kit/` draws them: the tile is the kit's `favicon.svg` at
512 (scale 0.82, stroke 3, so 16 px still shows two strokes), on the dark page
colour, and its colours are the registered palette converted from the OKLCH
tokens rather than picked by eye (accent `#a1da44`, hue 128). In 1.4.6 it
replaced the drawing every desktop release from 1.1.0 carried (three strokes of
falling weight on a gradient).

`64x64.png` is also the email logo: copy it to the website's
`public/email/windowsweep-logo@2x.png` after an export (every email shows it at
32 px, from the site), and the desktop dummy's email previews read `128x128.png`.

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

## The installer's own pictures

`bundle.windows.nsis` gives the setup and its uninstaller this folder's `icon.ico`,
and the Welcome and Finish pages the picture in `../installer/sidebar.bmp`
(164 x 314, exported from `sidebar.svg` beside it; the command is in that file).
Before 1.4.6 the setup showed NSIS's stock icon and stock picture.
