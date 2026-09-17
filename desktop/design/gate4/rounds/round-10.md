> Round 10 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 10 — 2026-09-14, the current source (HEAD `7ae4546`, desktop 1.2.0) · NOT CLEAN — D-55 and round 9's four small findings are fixed and D-60 holds on the button and the hero; the same two screens still print a bigger figure as a promise (D-61)

**Build under test:** `main` at `7ae4546` (pushed; `git status --short -- desktop` empty at the start and after the
build gate; HEAD unmoved to the end), `yarn tauri dev` from `desktop/` — Vite 8.2.2 on 5974, the Rust `dev` profile
already built, `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333 --host-resolver-rules="MAP <the
analytics and error hosts> ~NOTFOUND"`. `app_version` over the real IPC answered **1.2.0**; all eleven report files
this round produced say `tool_version 1.2.0`. WebView2 Edg/152.0.4191.66. **Dummy:** Chrome for Testing
151.0.7922.77, headless, profile `ahsan-automation-windowsweep-r10` on 9287 — the port proved free on both address
families before the launch, the profile read back from the OS process table and the listener table. The site's own
parity round was running in parallel on its own ports and was not touched. **Treatment:** lime, light and dark.
**Widths:** 1440 and 760. **Account:** none — the local Windows user, unelevated, signed out. **A genuine first
run:** the dev origin held no `windowsweep:*` key when the round began, so D-55 was judged on a fresh session and the
consent notice was answered through its own Continue.

**Pairs:** 112 complete pairs, 224 captures (38 MB) in `gate4-evidence\round10\pairs\` — the eleven screens with
data in both themes at both widths, History (All, Dry-runs, Other machines), Report (the newest run, the rehearsal,
its JSON, gone, missing, unreadable), Home before a scan and after a Picker ask, Splash's skipped frame, and
**D-60's two states** (Home's readout and Run's hero, before a rehearsal and after one, 1440 and 760, light and
dark). Two app-only captures record states the dummy does not draw (Run at rest after a rehearsal, the refusal at
the control).

## R10.1 — The instruments, and how each was proved first

| instrument | proved by |
|---|---|
| **IPC guard** (round 9's, unchanged: the engine's last-mode-wins argv parsing, refusals as 403 with `Tauri-Response: error`, preflights continued, a dry-run of the safe batch or of interactive ids allowed) | **offline**, the parser sliced from the guard file: **35 of 35** cases; two plants in copies — *any dry-run allowed* → 6 red, *the first mode wins* → 4 red. **Live:** `app_version` → `1.2.0`, eight harmless plants refused, `list_drives` still allowed. **Totals:** 298 IPC lines; the only refusals are those eight plants, the Splash policy and the single `write_select_file` of the D-59 proof. The app never attempted a forbidden call; **17 run folders, every one matched to an allowed call within 3 s** |
| **the postMessage fallback** | **0** lines of "IPC custom protocol failed" in the whole session; 0 page exceptions |
| **analytics** | 804 attempts, every one failed at the resolver or answered locally; none delivered |
| **axis probe (§10)** | declared 10 · written 10 · absent 0 · different 0, identical at 1440 and 760; the parse plant and the live plant each turned it red, restored clean |
| **word check** | 22 surfaces × 2 widths = **44 pairs**, round 9's method; three plants in copies of this round's snapshots each caught (a changed word, the separator's double spaces, a sentence marked 1 % visible); originals hash-checked unchanged |
| **sweeps** | round 9's probe on both sides, plus the bar-and-dialog driver; a low-contrast, an 11 px and a 560 px plant each found and gone when removed; the `::before` plant takes a switch's hit area from 44 to 18 |

## R10.2 — The verdict table

| surface | 1440 · 760 · light · dark | what matches | what diverges |
|---|---|---|---|
| **Home** | **diverge — blocker** | D-55 closed; the D-60 button in both states, word for word the dummy's; the hero, rail foot, drives, ring, cards, map, held-back figure; D-58's path cell | **D-61** (the ladder total) |
| **Run** | **diverge — blocker** | at rest: `READY TO RUN`, the D-60 hero in both states (`up to` and the estimate), the idle line, the command; after a rehearsal: the finished dry-run | **D-61** (the per-section rows) |
| **Sections** | match | 123 of 137 dummy strings exact, 12 live numbers, 47 of 47 names; the bar slides | — |
| **Picker** | **match** | D-47, D-48, D-49 re-proved; D-59 closed | — |
| **History** | match + declared | with data: frame, chart state, chips, columns, pager words; the empty state on a fresh session | *Other machines*, `pending-wave` (TASK-013) |
| **Report** | match + declared | with data: every band; gone, missing and unreadable; **D-56 closed** | *Export…*, `pending-wave` (TASK-015) |
| **Settings** | match + declared | the held-back sentence with its figure | the sync note (A-1) |
| **Account · Elevation · Consent · Splash** | match | as round 9; D-43 and D-51 still closed | dormant sign-in, declared |

Standing exemptions unchanged (`prototype` for the dummy's static-HTML styling, its title-bar badges, the
`PROTOTYPE` rail group, `storage: localStorage`, `app 0.1.0-design`; `demo-data` for seeded rows, paths, runs and
notes; `live-number` for sizes, counts, dates, durations and "Six"/"6").

## R10.3 — D-55: closed

A fresh session, the consent notice answered, no scan. The Picker asked the engine about section 23 through its own
*Dry-run* (`--only 23 --yes --dry-run`, allowed; 8 rows). Home, before and after that ask, reads the same:

| band | Home after the ask | the dummy's `index.html?empty=1` |
|---|---|---|
| hero | `not measured` · *Nothing has been measured yet. A scan reads sizes and deletes nothing.* | the same, word for word |
| buttons | *Scan* · *Dry-run first* · *Scan first* (disabled) | the same |
| map, drives, ladder, held back | *not measured* (22 of them) | *not measured* |
| rail foot | `-` · *across 0 sections* | the same |
| the 23 card | `120.0 MB` · *8 items waiting* — the ask's own offer, where it belongs | *nothing offered yet* (nothing asked in the dummy) |

The word check confirms it: the three strings that were ABSENT in round 9 — *Nothing has been measured yet…*,
*Scan*, *nothing offered yet* — are all present now, and nothing was added.

## R10.4 — D-60: the button and the hero, in every state

Measured on the running app after a scan (`54.27 GB` reclaimable, ladder total `34.2 GB`, held back `22.0 GB` once a
rehearsal had measured it). Every line below is one reading of Home and of Run:

| state | Home's primary button | Run's hero |
|---|---|---|
| before a rehearsal | **Reclaim up to 34.2 GB** | **up to 34.21 GB** |
| after *Dry-run first* (131 s, `--all --yes --dry-run` with the current arguments) | **Reclaim 1.9 GB** | the finished dry-run: `1.92 GB`, *"A dry-run would reclaim 1.9 GB."* |
| — the button against the rehearsal's own sentence | `Reclaim 1.9 GB` **equals** *A dry-run would reclaim 1.9 GB* | — |
| `--days` 100 → 90 | Reclaim **up to** 34.2 GB (held back back to *not measured*) | at rest after a re-scan: **up to 34.22 GB** |
| `--days` back to 100 | **Reclaim 1.9 GB** | at rest: `1.92 GB` |
| `--temp-days` 3 → 4 | Reclaim **up to 12.2 GB** (34.2 less the 22.0 held back, which survives this one) | — |
| `--temp-days` back to 3 | **Reclaim 1.9 GB** | — |
| `--large-file-mb` 100 → 101, and back | Reclaim **up to 12.2 GB**, then **Reclaim 1.9 GB** | — |
| developer mode off, then on | Reclaim **up to 34.2 GB** (held back `0 B` by definition), then **Reclaim 1.9 GB** | — |
| one target excluded, then included again | Reclaim **up to 32.5 GB** (the ladder moves with it), then **Reclaim 1.9 GB** | — |

Every figure and every transition is the README's amendment, and the Home hero keeps the measured total throughout.
The pairs (`d60-before-*`, `d60-after-*`, 1440 and 760, light and dark) put the app's two states beside the dummy's:
*Reclaim up to 34.2 GB* / *Reclaim up to 29.7 GB*, then *Reclaim 1.9 GB* / *Reclaim 29.7 GB*; Run's `up to` sits in
its own `.unit` span before the figure on both sides, and disappears on both after the rehearsal.

## R10.5 — Can any figure on Home or Run still promise more than the engine's estimate? Yes — D-61

**D-61 · dummy first, then app · blocking.** After the rehearsal, with the button reading *Reclaim 1.9 GB*:

| where | what it prints | the engine's own estimate for that run |
|---|---|---|
| Home, zone 5 | **Total a safe run would free 34.2 GB** | 1.9 GB |
| Run at rest, per section | `pkg queued 13.7 GB`, `browsers 8.1 GB`, `build 5.1 GB`, … — **34.3 GB** across the eleven rows | 1.9 GB, whose own rows are `pkg 0 B`, `browsers 245.0 MB`, `build 42.6 MB`, … |

The ladder's sentence is a promise in words — *would free* — and it is eighteen times the engine's figure for the
same arguments, two bands below the button that now carries that figure. `SafeRunLadder.tsx`'s own header states the
invariant D-60 has just broken: *"THE TOTAL IS HANDED IN … the same number the Reclaim button carries, so 'Total a
safe run would free' and the button that starts that run cannot print two different figures."* The Run screen's rows
were built to the same rule in round 7 (the hero was their sum). The dummy cannot show the difference — its seed has
no gate but the idle window, so bound, estimate and ladder total are one number there (its own amendment says so) —
which is why the words have to be decided in the dummy first, as D-60's were: either the ladder and the rows carry
the offer (*up to* included), or they are re-worded so that they describe what was measured rather than what a run
would free. **Blocking:** D-60 was decided because a gigabyte figure must never be stated as a promise, and this is
the same figure, in plainer words, on the same screen.

## R10.6 — Round 9's four small findings

| # | round 9 | round 10 | evidence |
|---|---|---|---|
| **D-56** | a dry-run's report ticked a drive that gained space | **closed** | this round's rehearsal gained 14.8 MB on C: while it ran; its report reads `8.1 GB free` over `was 8.0 GB` with **no tick** — `.state-ok` count 0 on all three drives |
| **D-57** | the last-runs line did not age before a scan | **closed** | Home left open on a fresh session: *4 seconds ago · 1 section · section 23* → *2 minutes ago …* 130 s later |
| **D-58** | a 128-character path pushed Size and Idle out of the band | **closed at 1440** | with the same 128-character path: overflow **0 px** on both sides, Size ends 119 px inside the scroller, Idle 15 px; the cell ellipsises, its `title` and its **accessible name** are the whole path (128 characters, read from the browser's own accessibility tree). At 760 the table still overflows 53 px — see D-62 |
| **D-59** | a refused `write_select_file` was recorded as a stopped run | **closed** | *Remove permanently* pressed once: exactly one `write_select_file`, refused; no `run_clean`; the refusal at the control (`role="alert"`, the guard's words); History unchanged at 9 records; Home still *Scan again · Dry-run first · Reclaim 1.9 GB*; Run still *Ready to run · 1.92 GB*, nothing "stopped"; both chosen folders still on disk; no new run folder; 0 fallback lines |

**D-62 · dummy first, then app · not blocking.** At 760 Home's target table still overflows its own scroller by
53 px and `Idle (days)` ends 38 px past its right edge — not the path, which now ellipsises, but the **Target**
cell, which the same amendment set to one line: this machine's longest target title (*Windows Error Reporting
archive (system)*) holds a 304 px column. Setting that title into the dummy's row reproduces it there **exactly**
(53 px, the same six column widths), so it is the dummy's rule, not the app's. Not blocking: the table is collapsed
by default, every value is reachable in the band's own scroller, and the map above carries each size.

## R10.7 — Regression: nothing round 9 closed has reopened

- **Words.** 26 keys are common to both rounds; **22 have byte-identical ABSENT lists**, and all four differences
  are strings that were missing in round 9 and are present now (D-55's three, and *Held back right now: 17.3 GB.*
  matching as a live number since the figure exists). The clip report is empty on all 44 pairs.
- **Picker.** D-47 re-measured: 16 readings, minimum **4.87 : 1**, app equal to dummy in both states and both
  themes. D-48 re-proved at 1440 and 760, light and dark: the dialog is visible **21.9–36.9 ms** after the press,
  *Cancel* focused first, Tab contained, Cancel and Escape both close it with **no IPC call** and focus back on
  *Remove these*; 0 fallback lines across the phase. D-49's three lines exact on both sides. Recycle Bin's single
  press is still read from the code (`Picker.tsx:348`) and never pressed.
- **History and Report with data**, nine records made through the app's own controls — six runs (four Picker asks,
  a Sections dry-run, the rehearsal) and three scans, which are correctly not rows: every band, chip, column and
  pager word as in round 9; the gone, missing and unreadable states exact, the last two produced through two
  records planted in this window's own storage and removed again (the saved string restored byte-identical).
- **Sweeps.** Ten screens × two widths × two themes, both sides: horizontal overflow **0 px**, contrast failures
  **0**, focusable-but-invisible **0**, no error overlay; the bar with rows ticked and the dialog open (24 states):
  **0** contrast failures. Focus: 15 of 15 Tab stops visible on Home, Picker and Settings, both sides. Hit areas:
  Sections and Elevation 44 × 44, Home's dense rows 33–44 where switches share an edge — the dummy now reads the
  same; the bar's and the dialog's own controls stay at the dummy's 28–42 px (O-1, unchanged). **The 100 ms floor:**
  row switch **14.7 ms**, Sections chip **20.5 ms**, Picker chip **14.2 ms**, the D-48 dialog **21.9 ms** — four
  actions, all inside the floor. The selection bar slides on both screens (110 % → 9.6 % over 121 ms).
- **RW-105's surfaces** — the Picker's Remove path, Run's Cancel (disabled at rest), the drives band and the
  capacity ring, the schedule switch (drawn, never pressed) and the held-back figure — are all in this round's
  captures and none has changed.

## R10.8 — What could not be tested

| item | why |
|---|---|
| any real removal, the safe run, the elevated run, Recycle Bin's *Remove these*, the schedule switch, sign-in | forbidden by the dispatch; D-48's Recycle Bin press is judged from the code |
| History and Report for a REAL run; what a real run does to the rehearsal (`store.ts` clears it when a section it estimated runs) | only dry-runs could be made |
| History's second page | six run records were made; a second page needs twenty-one |
| *Other machines* with rows; *Export…* | not built (TASK-013, TASK-015) |
| a genuinely unreadable report file | would need a file written into the app's runs folder, outside this round's scope; the state was produced through a run id the Rust side refuses |

## R10.9 — Reproducing · side effects · cleanup · build gate

- **Drivers:** `gate4-evidence\round10\drivers\` — round 9's tools copied with their paths moved (no earlier
  round's tool was edited, nothing added under `tools\`), plus new drivers for the fresh-session D-55 run, D-60's
  ten states, D-60's pairs and D-58's measurement; two round-10 copies were extended in place (the capture pass
  gained two Report surfaces; the removal driver gained D-59's readings), each noted in its own header.
- **Side effects:** 17 run folders in the app's local `runs\` — 8 boot catalogue reads, 3 scans and 6 dry-runs,
  each matched to an allowed guard call. Two History records planted for the missing and unreadable states and
  removed again. At the end the dev origin's storage was restored to its as-found keys (two Amplitude keys, exact
  values, unchanged 15 s later): the tester's storage leaves no records. `desktop/dist` rebuilt once, after every
  runtime proof.
- **Cleanup, verified:** the `yarn tauri dev` tree killed by its root PID; the guard exited when its socket closed;
  my Chrome killed by PID after its profile was read back; nothing listening on 5974, 9333 or 9287; the owner's
  Chrome and the site round's processes untouched.
- **Build gate on the fresh `dist/`:** `yarn build` exit 0, no warning; source maps 0, `sourceMappingURL` 0, the
  dev-engine marker 0 (1 in `src`), `run_clean` and *Reclaim up to* found in the bundle; no DEV test-auth hook
  anywhere (0 in `src`, 0 in `dist`); the tree clean after the build.

## R10.10 — Can GATE 4 close? Can `desktop-v1.2.0` publish?

**No, and one finding stands between them.** D-55 is closed on a fresh session; D-56, D-57, D-58 and D-59 are
closed; D-60 holds exactly as decided — the Reclaim button and the Run hero carry the engine's own estimate after a
rehearsal with the current arguments, an upper bound worded as one otherwise, and every argument that moves takes
them back to the bound and back again. But the answer to the round's own question is yes: **Home's ladder still
says a safe run would free 34.2 GB and Run's rows still queue 34.3 GB beside a 1.9 GB estimate (D-61)**, which is
the promise D-60 exists to stop. It is the dummy's words first, then the app's, and it is small. D-62 is filed and
does not block. Nothing round 9 closed has reopened.

---

