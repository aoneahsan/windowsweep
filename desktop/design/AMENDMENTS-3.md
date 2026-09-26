# windowsweep desktop - the amendment log, part 3 (2026-09-25, after the releases, onwards)

> Continues [`AMENDMENTS-2.md`](AMENDMENTS-2.md), which closed at 493 lines against this repository's 500-line
> ceiling. 🔴 **The next amendment goes at the bottom of this file**, and a new `AMENDMENTS-4.md` starts when this
> one would pass 500 lines. The rule is unchanged: a divergence is written into the dummy first, with its reason
> here, and only then does the app match.

## Amendment - 2026-09-25 (after the releases): History's total steps aside when the view holds no real run (TASK-018)

Found by TASK-013's live verification (the Dry-runs filter, on an account with no dry-runs): History's header read
*"0 B / freed in the last 0 runs"*. True, and clumsy, and the dummy drew it the same way. **No new words.** The
block that carries the figure - the total and its count line - is hidden while the view holds no real run
(`page-history.js`; `data-ws-hist-sum` on `history.html`'s total block), and the empty row below it, whose words
are already approved (*No runs yet*, *No dry-runs yet*, the other-machines states), is what the reader reads. One
run and more keep the block exactly as before, *"freed in the last run"* and *"freed in the last N runs"*.

App: `src/components/history/HistoryHeader.tsx` renders `.hist-total` only when `runs > 0` - the same count the
dummy uses (real runs in the filtered list). Checked by the next desktop release's GATE 4 round, with History's
empty states in its scope.

## Amendment - 2026-09-26 (GATE 4 round 16, D-72): section 22 is not a developer section

`seed.js` flagged section 22 (`globals`, the globally installed packages audit) `dev:true`, while its own header says
every dev flag is transcribed from the engine's catalogue - and `lib/constants.ps1` has `Dev = $false` for it, as it
has since 1.1.0 (`3c4d54e`). The app reads the engine, so its Sections screen showed seven `dev` badges where the
dummy showed eight. **The dummy was wrong and the app was right**: `seed.js` now reads `dev:false`, a transcription
fix with no new words (the round-7 D-37 class). Round 16's other five findings (D-68 to D-71, D-73) are the app
brought to the dummy, which is unchanged for them - the Privacy tab's words, the status bar's mono face, Run's hero
band, Home's schedule column and the URL axis layer are all the dummy's as drawn.
