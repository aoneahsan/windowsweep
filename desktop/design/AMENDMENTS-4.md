# windowsweep desktop - the amendment log, part 4 (2026-11-13, release 1.5.0, onwards)

> Continues [`AMENDMENTS-3.md`](AMENDMENTS-3.md). Part 3 had room left; part 4 starts at the 1.5.0 amendment so the
> release's dummy changes read as one set (asked for in the dispatch that drew them). 🔴 **The next amendment goes at
> the bottom of this file**, and a new part starts when this one would pass 500 lines. The rule is unchanged: a
> divergence is written into the dummy first, with its reason here, and only then does the app match.

## 1.5.0 - the full uninstaller and the updaters (D109, D110, D111), drawn 2026-11-13

The owner asked on 2026-11-13 for a full software uninstaller and a system, driver and app updater. The engine's
catalogue (`lib/constants.ps1`) now has section 26 as one list of desktop programs, Store apps and broken entries
(D109), 27 with five leftover kinds, and a new tier `update` for sections 30-32 (D110), never BIOS or firmware
(D111). Each amendment below names its surface, what the dummy drew before, what it draws now, and why. Every
amendment keeps the cockpit regime, the lime, sky and plum treatments, the nine appearance axes and the default
pointer; no new layout system, colour hue or navigation destination is added. The owner still has to review this
set in writing, and D113's lean story review covers the new prose before the app ships it. App parity is a
separate GATE 4 after implementation.

## A4-01 - the catalogue: rows 30-32, the `update` tier, and the engine's own titles

- **Surface:** `seed.js` (SECTIONS, TIERS, INTERACTIVE), `tokens.css` section 5, `shared.css` `.tier-update`,
  `sections.html` through `page-sections.js`, `g-display.js`.
- **Before:** 30 rows (0-29). Titles 26-29 read *"Uninstall programs you pick, then offer leftover folders"*,
  *"Leftover program folders -> Recycle Bin"*, and 28 and 29 had been shortened in 1.4.0. Six tiers.
- **After:** 33 rows, each transcribed from the engine and compared mechanically against `lib/constants.ps1`.
  26-29 carry the engine's full titles; 30 `winupdate`, 31 `drivers` and 32 `appupdates` are tier `update`, batch
  `interactive`, admin false (listing needs no permission). INTERACTIVE gains 30-32 (nine sections, as the engine's
  help says). The `update` chip is a ring, not a filled square: `--c-tier-update` is the neutral hue lifted clear of
  config and report (L .700 C .050 dark, L .540 C .050 light), and the ring is the second channel, as the hatch is
  for `permanent`. The display gallery shows it beside the other six.
- **Reason:** the dummy transcribes the engine; the app reads the engine and showed the long titles already. An
  install tier needs its own chip because it is the one tier that adds rather than reclaims. A ring keeps it legible
  without colour, and a neutral hue keeps the accent for the three things it is spent on.

## A4-02 - Sections: counted, and the long titles no longer push the table

- **Surface:** `sections.html`, `page-sections.js`.
- **Before:** *"All 30"*, the empty state *"All 30 are still there"*, a status bar reading *"26 of 26 shown"* (the
  second number was a literal from 1.1.0), titles on one line clipped at a fixed 46rem.
- **After:** *All 33*, *All 33 are still there*, *33 of 33 shown*, all three counted from the catalogue, as the app
  counts (`sections.filter.all`, `sections.emptyBody`, `sections.shownCount`). The title line yields to its cell
  (still one line, ellipsised, the full words in the cell and in its hover title). An `update` row's Reclaimable is
  a dash, except 31, whose old driver packages reclaim space (2.3 GB in the seed). Expanding 30-32 lists their rows
  as *name · 87.0 MB download / size unknown / reclaims 1.1 GB · install / run / remove*.
- **Reason:** live numbers belong to the product. With the engine's 26-29 titles the fixed 46rem line pushed
  Reclaimable and the expander off the table at 1440 (measured); yielding keeps every column in view at 1440 and 760.

## A4-03 - the rail's two counts

- **Surface:** `app.js` NAV and `buildRail`.
- **Before:** literal badges *26* (Sections) and *4* (Choose), the 1.1.0 counts.
- **After:** counted from `seed.js` the way `Shell.tsx` counts the engine's catalogue: *33* and *9* in 1.5.0.
- **Reason:** the app already counts; the dummy's literals had been wrong since 1.4.0.

## A4-04 - Home's "needs a person" stays reclaim-only

- **Surface:** `db.js` `needsAPerson()` (Home's cards, `wire.js renderNeeds`).
- **Before:** every interactive section got a card.
- **After:** sections of tier `update` are left out, so Home shows the same six cards as before.
- **Reason:** those cards are space waiting on a person. Sections 30-32 add software, so a card reading *0 B, 0 items
  waiting* would be noise; they are reached from the Choose screen and from Admin (A4-13).

## A4-05 - Picker, section 26: one list of three kinds, with Ran

- **Surface:** `picker.html` (Ran note, column hooks), `picker-columns.js` (new), `page-picker.js` META, `seed.js`.
- **Before:** two desktop programs; Path / Project / Idle / Size, the registry key as the main text and the name in
  the Project column, *"Uninstall programs you pick"*.
- **After:** Program / Kind / Ran / Size. The name leads; the registry key or `appx:` package name sits under it in
  mono. Kind is a badge: *desktop program*, *Store app*, or *broken entry* (warn). Eight Store rows are this PC's own
  (Cortana, Xbox Console Companion, Skype, Mail and Calendar, Paint 3D, Microsoft Solitaire Collection, Facebook,
  Pinterest; package names and sizes read on 2026-11-13). The broken row (demo) says *Its uninstaller is gone:* and
  the missing path. Ran is the days since Windows last saw the program start; Windows tells only an elevated window,
  so an ordinary list shows a dash on every row and a note above the table says why. `picker.html?section=26&elevated=1`
  draws the elevated list. Title *Uninstall programs and Store apps you pick*; the lede and the bar line say Store
  apps go for this Windows account, a broken entry is cleared from Apps after a .reg backup, and a second list then
  offers what the removed programs left (described, as 1.4.0 described it; the window's drawing of that second list
  is not decided here). The secondary line yields to its cell, so Kind, Ran and Size stay in view at 760.
- **Reason:** D109 makes 26 the full uninstaller. The note sits where the dashes are rather than in a hidden tooltip.
  The dummy does not invent an in-window way to elevate the list; it states the limit.

## A4-06 - Picker, section 26: the uninstall confirmation is drawn

- **Surface:** `picker.html` `#pick-confirm`, `picker-install.js` `paintUninstall` / `paintPermanent`.
- **Before:** the dummy asked only before a Permanent removal. The app has asked before any uninstall since 1.4.0
  (`PickerConfirm.tsx`, `picker.confirmUninstall*`) in words the dummy never drew, and *"will run their own
  uninstallers"* is false of Store apps and broken entries.
- **After:** any 26 row opens the same destructive dialog whichever mode is set: *Uninstall the chosen programs and
  apps?*, then only the lines that apply (desktop programs and the silent-form window, Store apps for this account,
  the broken entry's .reg backup, *None of this goes to the Recycle Bin. A second list then offers what the programs
  left.*, and the other rows following the bar's choice). Button *Uninstall*; Cancel focused first; Escape is Cancel.
- **Reason:** an uninstall is permanent either way, so it asks; and the dummy owns the words.

## A4-07 - Picker, section 27: five kinds, each with its fate

- **Surface:** `picker-columns.js`, `page-picker.js` META and not-asked state, `picker.html` bar line, `seed.js`.
- **Before:** two folders, *"Leftover program folders"*, and the bar line *"needs administrator permission before it can
  move chosen folders to the Recycle Bin"*.
- **After:** Path / Kind / Idle / Size with kinds *folder*, *shortcut*, *registry key*, *startup entry*, *scheduled task*.
  Under each path, what happens to it: *Goes to the Recycle Bin*; *Backed up to a .reg file first; double-clicking that
  file puts the key back*; *Starts ... which is gone · backed up to a .reg file first*; *Exported to an XML file first;
  Task Scheduler can import it back*. Title *Leftovers of uninstalled programs*. The bar names the run's
  `registry-backups` folder and that a key whose backup cannot be written is kept (`lib/registry.ps1`). The not-asked
  state draws the app's admin wording with *these leftovers* in place of *these folders*. Path-first rows keep 1.4.0's
  clip and the table's own sideways scroll at 760.
- **Reason:** D109 widens 27; each row says what happens to it before it is chosen.

## A4-08 - Picker, sections 30-32: the install mode

- **Surface:** `picker.html` (chips, bar, room under the table), `picker-columns.js`, `picker-install.js` (new),
  `page-picker.js`.
- **Before:** no update sections.
- **After:** an *Updates* label and three chips (*30 · Windows updates*, *31 · drivers*, *32 · app updates*), kept
  together when the row wraps. Columns: Update / Category / Needs / Download (30), Driver / Action / Needs / Download
  (31: an *install*, *run* or *remove* badge over its source), App / Version / Needs / Download (32: *2.54.0 → 2.56.0.4*).
  Needs is the *admin* badge per row; Download is the size the tool reports or *size unknown*, never a guess. The bar
  loses Recycle Bin / Permanent. Its accent figure counts only space reclaimed (31's old packages), labelled *to
  reclaim*, and hides when there is none; the download is said in words (*469.0 MB to download, plus 1 of unknown size*,
  *download size unknown*, *nothing to download*). The verb comes from the rows: *Install 3 updates*, *Run Lenovo
  System Update*, *Remove 3 old packages*, and for a mixed choice in 31 every part with its count, *Install 2, run 1,
  remove 3*. The bar's lines name the source of each kind chosen, say Windows asks for permission first when 30 or 31
  is chosen, and end on *windowsweep never restarts your PC; Windows says when a restart is due.* The two selections
  never merge: the bar acts on the mode in view, Clear clears only what the bar shows, and rows chosen in the other
  mode are named in one line (*1 more row stays chosen in section 26; it runs separately.*).
- **Reason:** D110. A button that names every part never says less than the run will do, and a generic verb (Apply,
  Go) would hide that something is being removed. Counting only reclaim in the accent figure is the dispatch's rule
  that install rows never reach a frees total; it holds by construction, because a row's `bytes` is what it reclaims.

## A4-09 - the install confirmation

- **Surface:** `picker.html` `#pick-install-confirm`, `picker-install.js` `paintConfirm`.
- **Before:** none.
- **After:** every install press asks first. Title and button are the bar's verb (*Install 2, run 1, remove 3?*). Lines,
  each only for work chosen: *Windows Update downloads each update, one at a time.* · *Lenovo System Update fetches its
  own driver and app packages.* · *BIOS and firmware updates are never offered.* · the winget line (publisher, one at a
  time, a running app skipped, an installer that changes the whole PC may show its own Windows permission prompt) · the
  old-package line (deleted from the driver store, not the Recycle Bin; the newest two stay, so Roll Back works) ·
  *Windows updates and drivers need an elevated window, so Windows asks for your permission first.* · and always
  *windowsweep never restarts your PC. When an update needs a restart, Windows says so.* Not the destructive style;
  Cancel focused first; Escape is Cancel; focus returns to the bar's button.
- **Reason:** an install reaches beyond this machine and this window cannot undo it, so it confirms even though
  nothing of the person's is lost (undo beats confirm only where the action can be walked back).

## A4-10 - section 31's report blocks and the firmware line

- **Surface:** `picker.html` `[data-ws-driver-report]`, `seed.js` DRIVER_REPORT, `page-picker.js` META 31.
- **Before:** none.
- **After:** under 31's table, two panels marked *Report only · section 31*: *Devices with problems* (Device Manager's
  own code wording) and *Oldest third-party drivers*, then *Both lists are for reading. Section 31 changes nothing in
  them; Device Manager shows the same devices and drivers.* The lede ends *BIOS and firmware updates are never
  offered.*, said again in the confirmation.
- **Reason:** D111, the owner's explicit order, said plainly on the screen where drivers are chosen.

## A4-11 - section 32's running app

- **Surface:** `picker-columns.js`, `seed.js` (Slack `running`).
- **Before:** none.
- **After:** a *running* badge beside the name and its own line, *Close it first, or it is skipped*, never truncated.
- **Reason:** the engine skips a running app; the row says what the person has to do.

## A4-12 - Picker, smaller changes

- **Surface:** `picker.html`, `page-picker.js`, `page-contents.js`.
- **Before / After:** the note now reads *These nine sections refuse to act on --yes alone*; the search reads *Filter
  by name* in install mode; *Drive this from a file instead* is not drawn for 30-32 (the selection file's line format
  for an update, a KB number or a winget id, is the engine's to settle first); the page description and the Contents
  row name 30-32. The room under the last block now grows to the bar's height while the bar shows (`fitRoom`, also
  watching the text-size and density axes): a five-line install bar at 760 covered the note by 88 px, and section 17's
  ordinary bar already covered it by 28 px.
- **Reason:** counts and words true of nine sections; nothing on the page hidden behind its own bar.

## A4-13 - Admin: installing updates and drivers needs permission too

- **Surface:** `elevation.html`, `page-elevation.js`.
- **Before:** *"Sections 12–16 and 20"* and *"Six sections need Windows to ask your permission."*, static, while the cards
  already included section 29.
- **After:** both counted from the catalogue the way the app does (`formatIdRanges`): *Sections 12–16, 20 and 29* and *7
  sections need Windows to ask your permission.* (a live number). A new band after *What happens when you press it*:
  *Installing Windows updates and drivers needs permission too*, a line saying 30 and 31 list without asking and
  install in the elevated window, and two cards in the existing card pattern (30, 31, *admin*, the engine title, *Listing
  needs no permission. Installing the updates you pick does.* / *... Installing a driver, running your PC maker's updater
  or removing an old driver package does.*, and *Choose updates* / *Choose drivers*, drawn as Home's *Choose items*). Under
  them: *App updates in section 32 run without one. An installer that changes the whole PC shows its own Windows
  permission prompt.*
- **Reason:** the screen that explains permission must be true of 1.5.0. The cards link to the Choose screen and carry
  no switch, because rows are picked there (27's rule, AMENDMENTS-3, 2026-11-03).

## A4-14 - the engine's privacy promise, scoped (D110)

- **Surface:** `index.html` (Home's *What leaves this machine*, `home.privacyIntro`), `page-settings.js` (Privacy note,
  `settings.privacy.note`), `emails.html` (`email-welcome` body), `g-actions.js` (offline banner, dummy only),
  `README.md` section 8.
- **Before:** *"The cleanup engine makes no network calls at all"*, *"zero network calls"*, *"The command-line engine
  still makes no network calls"*, *"the engine never needed the network"*.
- **After:** *Cleanup never touches the network. Only sections 30–32, for the rows you pick, ask Windows Update, winget or
  your PC maker's updater to download; the engine itself sends nothing, and its own tests check that.* (Home; Settings
  keeps *test suite asserts that*), the welcome email's *Cleanup in the command-line engine still never touches the
  network*, and the banner's *Cleaning still works – it never needed the network.* These follow the engine's own help
  text and D110 (self-test check [9] stays).
- **Declared unchanged:** `consent.html` and `page-consent.js` (the retired 1.3.2 reference, true of 1.3.2), the 1.4.0
  release email (`email-release-140`, true of 1.4.0), and every line about the dummy itself working offline.
- **Reason:** a claim a reader can falsify in one command loses the strong claim with it; scoped, it stays true.
  The welcome email's composer parity test (D92) reads this page, so the composer follows this sentence.

## Evidence

Captured headless in Chrome for Testing 151 from a throwaway profile, at 1440 and 760, dark and light:
`gate4/<surface>-<width>-<theme>-dummy-1.5.0.png` for `sections`, `picker-26`, `picker-26-elevated`,
`picker-26-confirm`, `picker-27`, `picker-30`, `picker-31`, `picker-31-confirm`, `picker-31-report`, `picker-32`,
`elevation`, `elevation-updates`, `home-privacy` and `settings-privacy`. On every load: no console error, warning or
exception; the in-dummy overflow and axes gates pass; no sideways scroll in the document, the content pane, or (except
path-first 27, by design) the table. Keyboard: the new chips, row switches, bar buttons, expanders and Admin buttons
are reached by Tab and work by Space and Enter; both confirmations open with Cancel focused, trap focus, close on
Escape and hand focus back. Each announces as a modal alertdialog named by its title and described by its visible
lines only. Sky and plum checked at 1440 and 760. The physical key read `strata:wsdummy:*`.

Found and left for its own fix: the review tools' storage-namespace gate (`app.js` `gates.storageNamespace`) throws,
because it passes `keysSync` an options object where strata-storage 3.1.3 expects a pattern. It predates 1.5.0; the
physical-key read above is the check that stood in for it.

## A4-15 - section 31 never runs the PC maker's tool (real-machine firmware evidence, 2026-11-14)

- **Surface:** `seed.js` (section 31's title, the `update` tier's blurb, the Lenovo row), `picker-columns.js`,
  `picker-install.js`, `picker.html` (the bar's drivers line, the install confirmation), `page-picker.js` META 31,
  `page-elevation.js` PICKED 31, `index.html` and `page-settings.js` (the network sentence), `README.md` section 8,
  `PARITY-MANIFEST.json` `strings150` 7, 17, 32, 33, 40, 50, 52, 69, 80, 82, 83 and the 31 review state.
- **Before:** section 31 offered *Lenovo System Update* as a `run` row (*PC maker's updater*), the bar could read
  *Run Lenovo System Update* or *Install 2, run 1, remove 3*, the confirmation said *Lenovo System Update fetches its own
  driver and app packages.*, and the network sentence named *Windows Update, winget or your PC maker's updater*.
- **After:** no row runs a maker's tool, so the install mode has two verbs: *Install 3 updates*, *Remove 3 old
  packages*, and for a mixed choice in 31 *Install 2, remove 3*. The bar's drivers line reads *Drivers come from Windows
  Update, one at a time.* The 31 lede ends *BIOS and firmware updates are never offered, and your PC maker's own driver
  tool is named, never run.*, the engine's own words; the confirmation drops the maker line and, wherever drivers are
  chosen, adds *Your PC maker's own driver tool is named in the log, never run.* under the firmware line. Admin's 31
  card reads *Driver updates list without permission; old driver packages list only in an elevated window. Installing a
  driver or removing a package needs permission.* The network sentence reads *Only sections 30–32, for the rows you
  pick, ask Windows Update or winget to download* (Settings keeps *test suite asserts that*). Section 31's title follows
  the engine: *Driver updates you pick from Windows Update, and old driver packages - never BIOS or firmware*.
- **Reason:** on the owner's ThinkPad (the P52, 2026-11-14) the engine ran Lenovo System Update with its driver-and-app
  switch (`-packagetypes 1,2`), and System Update still queued an IR-camera FIRMWARE package (type 4); a package it
  started then hung for 13 hours behind a prompt nobody could see. The rule is absolute - never BIOS or firmware (D111) -
  so the engine no longer starts any PC maker's tool (`modules/updates_drivers.ps1` `Show-MakerUpdater`: report only,
  naming Lenovo System Update, Dell Command | Update or HP Image Assistant with *leave anything marked BIOS or firmware
  unticked*). The dummy states what the engine does and nothing more. The two new lines (the 31 lede's last clause and
  the confirmation's maker-tool line) are new prose for D113's lean story review.
- **Evidence:** re-captured headless in Chrome for Testing 151 from a throwaway profile, at 1440 and 760, dark and light,
  `gate4/<surface>-<width>-<theme>-dummy-1.5.0.png` for `sections`, `picker-31`, `picker-31-confirm`,
  `picker-31-report`, `elevation`, `elevation-updates`, `home-privacy` and `settings-privacy`; the other 1.5.0
  captures show nothing this amendment touched and stand.
