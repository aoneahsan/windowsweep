# 1.5.0 click dummy addendum

Status: drawn 2026-11-13 for the full uninstaller and the updaters (D109, D110, D111); in review. The owner's written
review is owed, and D113's lean story review covers the new prose before the app ships it.

| Kind | Count | Source |
|---|---:|---|
| Current product screens | 12 | `page-contents.js`: 12 rows, of which Consent is retired; plus `walkthrough.html` |
| Screens changed by 1.5.0 | 3 | Sections, Picker, Elevation (Admin) |
| Screens with reworded lines only | 2 | Home (privacy ledger), Settings (Privacy tab) |
| Email specimens changed | 1 | `emails.html` `email-welcome` (one sentence) |
| Component gallery files changed | 1 | `gallery-display.html` (the `update` tier chip) |
| New page scripts | 2 | `picker-columns.js`, `picker-install.js` (Picker only) |
| Flat HTML files | 23 | unchanged: no page added or removed |
| 1.5.0 rows below | 7 | 7 drawn, 0 remaining, 0 approved |

| # | Surface | Dummy file | App route | Covers | Status |
|---|---|---|---|---|---|
| 17.1 | Catalogue rows 30-32 and the `update` tier | `sections.html` (+ `seed.js`, `tokens.css`, `shared.css`) | `/sections` | 33 rows with the engine's titles for 26-32, the ring chip, counted All/shown/empty, update Reclaimable and detail rows, titles that yield to the cell (A4-01, A4-02) | 🔄 in review |
| 17.2 | Picker 26, the full uninstaller | `picker.html?section=26` (+ `&elevated=1`) | `/picker?section=26` | Program / Kind / Ran / Size, three kinds, eight Store rows from this PC, a broken entry, the Ran note, the uninstall confirmation (A4-05, A4-06) | 🔄 in review |
| 17.3 | Picker 27, five leftover kinds | `picker.html?section=27` | `/picker?section=27` | folder, shortcut, registry key, startup entry, scheduled task, each row's fate, the registry-backups folder, the admin not-asked state (A4-07) | 🔄 in review |
| 17.4 | Picker install mode 30-32 | `picker.html?section=30`, `31`, `32` | `/picker?section=30..32` | the Updates chips, install columns, Download and needs-admin, no Recycle Bin choice, reclaim-only accent figure, the built verb (mixed: *Install 2, remove 3*; the PC maker's driver tool named, never run, A4-15), separate selections, the install confirmation, 31's report blocks and firmware line, 32's running app, the room under the table (A4-08 to A4-12) | 🔄 in review |
| 17.5 | Admin, installing updates and drivers | `elevation.html` | `/elevation` | counted eyebrow and title, the new band with the 30 and 31 cards, the section 32 line (A4-13) | 🔄 in review |
| 17.6 | The privacy promise, scoped | `index.html`, `settings.html` (Privacy), `emails.html` (`email-welcome`), `gallery.html` (offline banner, `g-actions.js`) | `/`, `/settings`, the welcome email | *Cleanup never touches the network* and the 30-32 hand-off, in place of *no network calls* (A4-14) | 🔄 in review |
| 17.7 | Rail counts and Home's cards | every page's rail (`app.js`), `index.html` | every route, `/` | Sections 33 and Choose 9 counted; Home's needs-a-person cards stay reclaim-only (A4-03, A4-04) | 🔄 in review |

The design keeps the lime, sky and plum treatments, nine appearance axes and the default pointer. No new hue,
navigation destination or layout system; `tokens.css` gains one tier token pair and `shared.css` the ring chip.
Picker's chosen rows stay in memory as before, so nothing new is persisted and the `wsdummy` namespace is unchanged.

**Review evidence:** `gate4/<surface>-<width>-<theme>-dummy-1.5.0.png` at 760 and 1440, dark and light, for
`sections`, `picker-26`, `picker-26-elevated`, `picker-26-confirm`, `picker-27`, `picker-30`, `picker-31`,
`picker-31-confirm`, `picker-31-report`, `picker-32`, `elevation`, `elevation-updates`, `home-privacy` and
`settings-privacy` (56 captures). Checks and their results are in `AMENDMENTS-4.md` → Evidence.

**Next gate:** the owner writes an approval or changes for rows 17.1-17.7. The app then follows the dummy, using
`windowsweep-click-dummy/PARITY-MANIFEST.json` → `strings150` as its word list; the 1.5.0 GATE 4 pair has not run.
