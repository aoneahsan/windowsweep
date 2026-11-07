# windowsweep brand kit

Made on 2026-11-08 from what the product ships today. The mark is the website header's `BrandMark`
(`windowsweep-web/src/components/ui/Icon.tsx`): two strokes of the same weight in a 32 px box. The lockup is
the header's own row: the mark, a 12 px gap, then the name in Archivo at weight 640 and 112% width, 18 px,
-0.015 em. It was checked against the live header in Chrome: the name starts 44 px from the mark's box, runs
131.6 px and sits on a baseline 21.42 px down. Text is outlined from the site's own
`public/fonts/archivo-latin.woff2`, kerning included, so no font is needed to open a file. The tagline is the
approved home heading, "It names every path before it touches one." (`home.hero.title`).

The colours are the OKLCH tokens in `windowsweep-web/src/styles/palette.css`, converted to sRGB:

| Token | Light appearance | Dark appearance (the default) |
|---|---|---|
| `--c-accent`, the sweep | `#4e7500` | `#a1da44` |
| `--c-ink`, the name | `#1b1f16` | `#f1f3ee` |
| `--c-ink-2`, the tagline | `#565a51` | `#b3b7af` |
| `--c-app`, the ground | `#f5f7f2` | `#0e100b` |

A file without `-reversed` or `-mono` in its name is drawn for a light ground. `-reversed` is for a dark one.
`-mono` is one colour, exactly as the header draws itself in the light appearance.

## Files

Run the commands from this folder. `sharp-cli` renders SVG through librsvg, the engine behind
`rsvg-convert`. The `.ico` is packed with Pillow from the three favicon PNGs, so each size keeps its own
render.

| File | Use | PNG made with |
|---|---|---|
| `mark.svg/.png` | The mark alone, 1024 px, transparent, for light grounds | `npx -y sharp-cli@6.1.0 -i mark.svg -o mark.png` |
| `favicon.svg` | The live favicon's dark tile carrying the header's two strokes | Source for the four files below |
| `favicon-16/32/48.png` | Favicon sizes, each rendered at 8x and reduced | `npx -y sharp-cli@6.1.0 --density 576 --withDensity 72 -i favicon.svg -o favicon-32.png resize 32 32` (same for 16 and 48) |
| `favicon.ico` | 16, 32 and 48 in one file | `python -c "from PIL import Image as I; I.open('favicon-48.png').save('favicon.ico', sizes=[(16,16),(32,32),(48,48)], append_images=[I.open('favicon-16.png'), I.open('favicon-32.png')])"` |
| `apple-touch-icon.png` | 180 px, opaque, square (iOS rounds it) | `npx -y sharp-cli@6.1.0 --density 576 --withDensity 72 -i favicon.svg -o apple-touch-icon.png resize 180 180 -- flatten "#0e100b"` |
| `in-app-logo.svg/.png` | The desktop app's title bar as the app draws it: its own `TitleMark`, the name in Archivo 600 at 15 px, 0.02 em, dark appearance. For dark grounds | `npx -y sharp-cli@6.1.0 -i in-app-logo.svg -o in-app-logo.png` |
| `logo-horizontal.svg/.png` | Mark left, name right: the header row at 8x | `npx -y sharp-cli@6.1.0 -i logo-horizontal.svg -o logo-horizontal.png` |
| `logo-stacked.svg/.png` | Mark above, name below | `npx -y sharp-cli@6.1.0 -i logo-stacked.svg -o logo-stacked.png` |
| `logo-stacked-tagline.svg/.png` | Mark, name, and the tagline over two lines | `npx -y sharp-cli@6.1.0 -i logo-stacked-tagline.svg -o logo-stacked-tagline.png` |
| `logo-horizontal-mono.svg/.png` | One colour, `#1b1f16` | `npx -y sharp-cli@6.1.0 -i logo-horizontal-mono.svg -o logo-horizontal-mono.png` |
| `logo-horizontal-reversed.svg/.png` | For dark grounds | `npx -y sharp-cli@6.1.0 -i logo-horizontal-reversed.svg -o logo-horizontal-reversed.png` |
| `splash-light.svg/.png`, `splash-dark.svg/.png` | 2732 x 2732, the mark 820 px wide in the centre, on each appearance's ground. The website has no `resources/` folder to match | `npx -y sharp-cli@6.1.0 -i splash-light.svg -o splash-light.png` (same for dark) |

## Print set (`print/`)

For jerseys and T-shirts: five layouts in three colourways, named `<layout>-<white|black|color>`. Each one is
an SVG master, a vector PDF and a transparent PNG, 4096 px on the long side at 300 dpi, which is 346.8 mm.
Every shape is a flat fill: the strokes are expanded into outlines that stay within 0.0008 px of the true
edge (measured in the mark's 32 px box), the text is outlined, and nothing uses a gradient, a shadow or
partial opacity.

| Colourway | Colours | For |
|---|---|---|
| `white` | `#FFFFFF` only | Black and dark garments |
| `black` | `#000000` only | White and light garments |
| `color` | `#4e7500` sweep, `#1b1f16` name, `#565a51` tagline: the light appearance's accent, ink and ink-2 | White and light garments. On black, use `white` |

| Layout | What | Smallest print width |
|---|---|---|
| `icon` | The mark alone | 8 mm: the strokes are 0.45 mm |
| `horizontal` | Mark left, name right | 25 mm: the strokes are 0.25 mm |
| `stacked` | Mark above, name below | 20 mm |
| `stacked-tagline` | Mark, name, tagline | 25 mm: the tagline's capitals are 1.1 mm |
| `horizontal-tagline` | Mark left; name and tagline right | 40 mm: the tagline's capitals are 1 mm. At 25 mm they fall to 0.65 mm, so use `horizontal` there |

```bash
npx -y sharp-cli@6.1.0 --withDensity 300 -i print/stacked-white.svg -o print/stacked-white.png
svg2pdf --dpi 300 print/stacked-white.svg print/stacked-white.pdf
```

The same two commands make every other print file. `svg2pdf` is typst's converter (`cargo install svg2pdf-cli`).

## The marks that differ from the header

- The live favicon (`windowsweep-web/public/favicon.svg`) draws the second stroke at 55% and sets the two
  further apart.
- The desktop title bar's `TitleMark` draws a thinner second stroke at 45%.
- The desktop app icon (`desktop/src-tauri/icons/icon.svg`) and the email logo carry three strokes of falling
  weight, taken from the click dummy's hero.
- The old blue window-and-squeegee mark in `assets/logo/` predates all of these.

This kit follows the header: two strokes, one weight, full strength. `favicon.svg` keeps the live favicon's
tile and its 2.6 stroke weight, so the mark still reads at 16 px.
