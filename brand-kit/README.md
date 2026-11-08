# windowsweep brand kit

Drawn from the live header at `https://windowsweep.aoneahsan.com` (1440 px, checked 2026-11-08, site 1.4.5): the mark is `BrandMark` in `windowsweep-web/src/components/ui/Icon.tsx`, two sweep curves on a 32-unit box, stroke 1.8, round caps, both at full strength, drawn in `currentColor` (the page ink). The name is Archivo at weight 640 and width 112% (`--wd-wide`), 18 px, tracking -0.015em, from `windowsweep-web/public/fonts/archivo-latin.woff2`, instanced and outlined to paths. The header geometry is kept exactly: mark box 32, name starting 44 from the box's left edge, baseline 21.42 below its top (measured in the live page). Colours are the default `lime` treatment from `windowsweep-web/src/styles/palette.css`, converted from OKLCH. Run each command inside this folder.

**The line** on the tagline files is the console strapline, word for word: `names every path before it touches one`. It was recorded as the short strapline in `docs/story/decision-log.md` (the `Write-Banner` decision, beside the GATE 4 tagline entry) and is the live hero heading in sentence form ("It names every path before it touches one.", `home.hero.title`). It is set in JetBrains Mono 500 from `windowsweep-web/public/fonts/jetbrainsmono-latin.woff2`, because it is the line the CLI prints, and sized so its ink is exactly as wide as the name. The 99-character listing tagline (GATE 4, surface 2) was not used: it is written to be read cold in a search list, not on a shirt.

**One mark is live, the header's, and this kit draws it.** From 1.4.6 (2026-11-08) every place below carries it; three of them used to draw their own.

- Header (public site): the two strokes described above, in the page ink.
- Site favicon (`windowsweep-web/public/favicon.svg`, with `favicon.ico` and `apple-touch-icon.png` beside it): this kit's three files, from 1.4.6. Before that the favicon drew other curves (`M4 20…`, `M4 25.4…`), stroke 2.6, the lower one at 0.55 opacity, `#a3e635` on `#111a12`, and the site had no `.ico` or touch icon.
- Desktop app icon (`desktop/src-tauri/icons/icon.svg`): this kit's `favicon.svg` drawn at 512, from 1.4.6, exported by `yarn tauri icon`. Its `64x64.png` is also the email logo (`windowsweep-web/public/email/windowsweep-logo@2x.png`, shown at 32 px). Before that, three strokes of falling weight (52, 24, 11) with 0.5 and 0.3 opacity, on a gradient tile, in the app and in every email.
- Docs site logo and favicon: since 2026-11-08 the header's mark (`windowsweep-docs/static/img/logo.svg` and `logo-dark.svg`, in each appearance's page ink) and this kit's `favicon.svg`. They, `assets/logo/` and both social cards (the site's `public/og/svg/site-card.svg`, the docs' `static/img/social-card.svg`) used to carry an older, unrelated drawing, a single glass pane wiped with a squeegee in a sky-blue gradient; `assets/logo/` is gone and the cards were redrawn with the header's mark the same day.

The header mark is drawn for this product (not an icon-library glyph), and it has no window panes in it.

| File | Use | Command |
| --- | --- | --- |
| `mark.svg`, `mark.png` | The two strokes alone, 1024 px, transparent, light-theme accent `#4E7500` | `rsvg-convert -w 1024 -h 1024 mark.svg -o mark.png` |
| `favicon.svg` | Browser tab: the header strokes in `#A1DA44` on the dark page `#0E100B` (rx 7 of 32), scaled to 0.82 and thickened to 3 so the 16 px size keeps two strokes | Master |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png` | Tab fallbacks | `for s in 16 32 48; do rsvg-convert -w $s -h $s favicon.svg -o favicon-$s.png; done` |
| `favicon.ico` | Older browsers and crawlers (16, 32, 48) | `convert favicon-16.png favicon-32.png favicon-48.png favicon.ico` |
| `apple-touch-icon.svg`, `apple-touch-icon.png` | iOS home screen, 180 px, opaque, full-bleed `#0E100B` | `rsvg-convert -w 180 -h 180 apple-touch-icon.svg \| convert - -alpha off -define png:exclude-chunks=date,time apple-touch-icon.png` |
| `in-app-logo.svg`, `in-app-logo.png` | The header's 59 px bar on the light page `#F5F7F2`, 16 px inset; the version pill is left out because it changes every release | `rsvg-convert -h 128 in-app-logo.svg -o in-app-logo.png` |
| `logo-horizontal.svg`, `logo-horizontal.png` | Mark left, name right, light grounds, header spacing and colours (all `#1B1F16`, as the header draws it) | `rsvg-convert -h 256 logo-horizontal.svg -o logo-horizontal.png` |
| `logo-horizontal-mono.svg`, `logo-horizontal-mono.png` | One colour, `#1B1F16` | `rsvg-convert -h 256 logo-horizontal-mono.svg -o logo-horizontal-mono.png` |
| `logo-horizontal-reversed.svg`, `logo-horizontal-reversed.png` | Dark grounds, the dark-appearance ink `#F1F3EE` | `rsvg-convert -h 256 logo-horizontal-reversed.svg -o logo-horizontal-reversed.png` |
| `logo-stacked.svg`, `logo-stacked.png` | Mark (2x) above, name below, light grounds | `rsvg-convert -w 1024 logo-stacked.svg -o logo-stacked.png` |
| `logo-stacked-tagline.svg`, `logo-stacked-tagline.png` | Mark, name, and the strapline in `#565A51` | `rsvg-convert -w 1024 logo-stacked-tagline.svg -o logo-stacked-tagline.png` |
| `splash-light.svg`, `splash-light.png` | Launch screen, 2732 px, the strokes in `#4E7500` centred on the light page `#F5F7F2` | `rsvg-convert -w 2732 -h 2732 splash-light.svg -o splash-light.png` |
| `splash-dark.svg`, `splash-dark.png` | Launch screen, 2732 px, the strokes in `#A1DA44` on the dark page `#0E100B` | `rsvg-convert -w 2732 -h 2732 splash-dark.svg -o splash-dark.png` |

There is no `resources/` folder (the product is a desktop app and a website), so the splash follows the page colours.

| Token | Light | Dark |
| --- | --- | --- |
| `--c-accent` (mark in colour) | `#4E7500` oklch(0.512 0.145 128) | `#A1DA44` oklch(0.820 0.185 128) |
| `--c-ink` (name, header mark) | `#1B1F16` oklch(0.232 0.017 128) | `#F1F3EE` oklch(0.962 0.008 128) |
| `--c-ink-2` (strapline) | `#565A51` oklch(0.462 0.015 128) | `#B3B7AF` oklch(0.775 0.012 128) |
| `--c-app` (page) | `#F5F7F2` oklch(0.973 0.007 128) | `#0E100B` oklch(0.168 0.010 128) |

## Print set (`print/`)

For jerseys, T-shirts and any printer. 5 layouts x 4 colourways = 20 logos, each `<layout>-<white|black|color-dark|color-light>` as SVG master, PDF and transparent PNG (4096 px on the long side, 300 dpi). Flat fills only, no outline around anything, text outlined, strokes expanded to filled shapes, nothing to install. Run the command inside `print/`.

On screen the strokes are 1.8 on the 32 box, lighter than the name's stems (2.46 at the same scale). For print they are 2.4, the name's own stem weight, so the mark and the name print as one weight and the horizontal logo still holds at 25 mm. The curves themselves are unchanged.

| Layout | What | Smallest print width (ink) |
| --- | --- | --- |
| `icon` | The two strokes alone | 6 mm (strokes 0.47 mm) |
| `horizontal` | Mark left, name right, header spacing | 22 mm (strokes 0.3 mm, name cap height 1.6 mm) |
| `stacked` | Mark (2x) above, name below | 16 mm (name cap height 1.5 mm) |
| `horizontal-tagline` | Mark left, name and strapline right; the mark runs from the top of the name to the strapline's baseline | 85 mm (strapline cap height 2 mm) |
| `stacked-tagline` | Mark, name, strapline stacked | 62 mm (strapline cap height 2 mm) |

Below its smallest width, a tagline layout drops to the same layout without the strapline.

| Colourway | Cloth | Colours |
| --- | --- | --- |
| `white` | Black or dark, back panels | `#FFFFFF` only |
| `black` | White or light, back panels | `#000000` only |
| `color-dark` | Black, dark or painted fronts and shoulders | Mark `#A1DA44` (dark accent), name and strapline `#FFFFFF` |
| `color-light` | White or light fronts and shoulders | Mark `#4E7500` (light accent), name and strapline `#1B1F16` (light ink) |

- Never add an outline to make a logo readable. Pick the colourway for the cloth. On busy art, the art gives way behind the type.
- PDFs are vector and sRGB. Match the hex values with your printer; no Pantone number has been assigned.

```bash
for f in *.svg; do b=${f%.svg}; rsvg-convert -f pdf "$f" -o "$b.pdf"; rsvg-convert -a -w 4096 -h 4096 "$f" | convert - -define png:exclude-chunks=date,time -units PixelsPerInch -density 300 "PNG32:$b.png"; done
```

Check the rules: `grep -liE 'gradient|filter|opacity|stroke|<image|mask|clip|<text' *.svg` prints nothing, and `grep -oE 'fill="#[0-9A-Fa-f]+"' stacked-white.svg | sort -u` prints one line.

### Mockups (`print/mockups/`)

| File | Shows |
| --- | --- |
| `jersey-black-front-and-back.png` | Front chest `stacked-tagline-color-dark` about 45% of the chest's width, left chest `icon-color-dark` where a crest goes, right sleeve `icon-color-dark`, shorts right leg `icon-white`, upper back `stacked-white` about half the back's width |
| `jersey-white-back.png` | The same front, the back's black panel recoloured white (collar and shoulder trim left black) with `stacked-black` |

Both are 2208 px, for showing placement only, never for printing. They start from `production-projects/tshirt-design-i-will-print-my-products-logos-on.jpeg` as already cleaned for the Trizlink kit (upscaled 3x, the sample brand's chest logo, crest, small logo, player name and number, shorts number and logo, hem label and contact line removed); the white-back base is the same cleaned image with the back panel recoloured. Our logos are placed flat, without the cloth's folds, lightly shaded by the shirt's own light. The paint is darkened in a soft oval behind the front lockup, the left-chest icon and the sleeve icon, so the lime strokes and the white name and strapline read. The paint artwork is the sample's, not ours.
