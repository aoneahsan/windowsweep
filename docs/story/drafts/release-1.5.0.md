# release-1.5.0 — release words

Content-map row 27, README row 1, and the docs rows 3-6 that carry the scoped network promise.

## Shared desktop summary

Uninstall programs and Store apps from one list, then clear what they leave behind: folders, registry keys (each exported to a .reg file first), dead Start-menu shortcuts, startup entries and scheduled tasks. You pick every row. Three new sections install what you pick: Windows updates (30), drivers (31; BIOS and firmware are never offered) and app updates through winget (32). Cleanup still never touches the network; only those three sections, when you run them, ask Windows Update or winget.

## Updater line

Uninstall programs and Store apps from one list, then clear what they leave behind. New sections install the Windows, driver and app updates you pick; BIOS and firmware are never offered.

## CLI detail

Section 26 now lists Store apps and broken entries beside desktop programs, and offers what a removed program left behind; section 27 finds the same leftovers later. New sections 30, 31 and 32 install the Windows, driver and app updates you pick. A registry key is exported to a .reg file before it goes. BIOS and firmware are never offered.

## Sources and review

None rests on a fixture. Every claim was read against the 1.5.0 engine: `modules/uninstall.ps1`, `store_apps.ps1`, `leftovers.ps1`, `leftovers_more.ps1`, `lib/registry.ps1`, `updates_windows.ps1`, `updates_drivers.ps1`, `updates_apps.ps1`, and the catalogue in `lib/constants.ps1`. The P52 runs of 2026-11-13 and 2026-11-14 back the numbers the docs cite (`../../../machine-evidence/p52-2026-11-13/`): 40 picked, 39 removed in the first run and AChat in the second; 326 MB of leftovers recycled; four registry keys removed with backups; KB890830 and KB5131096 installed; eleven winget updates in the elevated run and stripe in the unelevated retry.

Round 1 (lean, D113): developmental and line passes keep each sentence to one fact a reader can check; copy pass aligns "update sections" and "PC maker" with the glossary. Fact checking removed two claims before they shipped: "every registry change" (sections 13, 29 and 31 still set named values) became "a registry key it removes", and the maker's updater left every sentence after D114, when its command line queued firmware past a driver-only switch. Hook, SEO/AEO and emotion passes keep the wording plain. There is no humour. Finalizer: READY, FACT-CONSISTENCY PASS, zero NEEDS DECISION; D113 covers publication after the release gates and the visual checks.
