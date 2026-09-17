> Round 7 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 7 — 2026-09-13, the current source (HEAD `9735c7a`, desktop 1.2.0) · GATE 4 does NOT close — two must-fix divergences

**Build under test:** not the installed 1.1.0 — the current source, launched with `yarn tauri dev` from `desktop/`
(Vite 8.2.2 on the registered port 5974; Rust `dev` profile; `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=
--remote-debugging-port=9333`). `app_version` over the real IPC answered **1.2.0** and a `--scan` document
reported engine **1.2.0**, so every figure below came from the real bundled engine, never the dev stand-in
(`devEngine()` returns `null` inside a Tauri window, `dev-gate.ts:30`). WebView2 Edg/152.0.4191.66.
**Dummy:** Chrome for Testing 151.0.7922.77, headless `--disable-gpu`, a project-scoped profile
`ahsan-automation-windowsweep-r7` on port 9226 (other agents were running in parallel, so not the shared 9222),
profile read from the OS process table before the first navigation. **Treatment:** lime, light and dark.
**Widths:** 1440 and 760. **Account:** none — the local Windows user, unelevated, signed out (sign-in is not
configured in this build); the product has no admin role, so no flow could run as an admin.

**Scope:** RW-119 (the four RW-105 surfaces never captured) and RW-103's acceptance (round-7 pairs judged
`match`), plus TASK-004 / TASK-009 / TASK-010 and D-8 / D-21. **30 pairs, 60 captures**, plus 7 single-side
state captures.

## R7.1 — How the round was made safe, and how its instruments were proved first

| instrument | what it did | proved by |
|---|---|---|
| **IPC guard, at the transport** | Tauri 2.11.5 defines `__TAURI_INTERNALS__.invoke` with `writable:false, configurable:false` (read live), so a JavaScript wrapper would be a silent no-op. The guard intercepted `http://ipc.localhost/*` over CDP `Fetch` and fulfilled every refusal with Tauri's own error shape (`Tauri-Response: error`) — a *failed* request would have sent Tauri to its `postMessage` fallback, around the guard. Allowed `--list`, `--scan` and read-only commands; refused `--elevate`, `--yes`, `--all`, `--only`, `--install-task`, `--uninstall-task`, `--select-file`, `--i-understand-deep`, `--hiberfil`, `--permanent`, `--dry-run`, `write_select_file`, both `oauth_*`, `opener` / `dialog` / `process` and every updater command but `check` | control `app_version` → `1.2.0`; unknown command → `round-7 guard refused ws_r7_guard_probe - refuse: command not on the allowlist`; `run_clean --list --json --permanent` → `refuse: forbidden flag --permanent`; a later `list_drives` still reached the guard (no fallback) |
| **analytics blocked** | the local `.env` carries the four ids and `analytics.ts` has no DEV guard, so a dev session reports to production. `Network.setBlockedURLs` blocked **316** requests after the guard attached (188 Amplitude, 128 Sentry). The first ~9 minutes after boot preceded the guard and are unobserved | the network log |
| **axis probe (§10)** | defaults parsed from the dummy's own `app.js` `AXES` table: **declared 10 · written 10 · absent 0 · different 0**; the full `<html>` attribute set identical at 1440 and 760 | parse arm (density default mutated in an in-memory copy; real `app.js` hash unchanged) → `density: dummy=spacious app=comfortable`; live arm (`data-radius` removed) → `radius (data-radius) declared but not written`; restored → clean |
| **captures** | viewport grown until `main.content` has nothing left to scroll; the dummy's `demo.js` toolbar hidden (2 nodes per page); each app screen's `<details>` state recorded on arrival and restored before every capture (a first pass had it wrong at 760 and was re-run); the app's theme set through its own Appearance panel; **no reload after the one scan** | open-state counts logged per pair (Home 1/5 open on both sides, Run and Elevation 0/1) |

**Over the session the guard allowed 71 calls and refused 6 — all 6 were my plants. The app never attempted a
forbidden call.**

## R7.2 — The verdict table

| surface | 1440 light | 1440 dark | 760 light | 760 dark | what matches | what diverges |
|---|---|---|---|---|---|---|
| **Home** | diverge | diverge | diverge | diverge | all twelve bands; the drives band and capacity ring (RW-105) placed and worded as the dummy; the map is ONE tab stop; the table's per-row switches (TASK-009) | **D-24** (blocking), D-25, D-32, D-33, D-36 |
| **Run** | diverge | diverge | diverge | diverge | idle hero `READY TO RUN` · `0 of N sections · not started` (D-22 closed); **Cancel present and disabled at rest (RW-105)**; D-21 closed | D-30, D-31 |
| **Settings** | diverge | diverge | diverge | diverge | the four D-8 preferences, their values and `Maps to …` lines; the schedule row (RW-105) word for word | D-26, D-35; open question (a) |
| **Picker** | diverge | diverge | diverge | diverge | nothing comparable — the app can only show its empty state | **D-23** (blocking), D-37 |
| **Elevation** (default) | diverge | diverge | diverge | diverge | TASK-004: per-section switches, section 15's `Leave it / Reduced / Turn it off`, both buttons, the scan note | D-27, D-29 |
| **Elevation** (deep gate, 16 chosen) | diverge | diverge | diverge | diverge | gate lede, only the chosen section's consequence, confirm switch `I understand what these sections do`, blocked reason `Confirm you understand the deep sections above.` beside the buttons, run button disabled, `--i-understand-deep` added on confirm — **word for word** | D-27, D-29 |
| **Elevation** (measured) | diverge | — | — | — | the result sentence, the figure a live number | D-28 (channel) |
| **Account** | declared + diverge | declared + diverge | declared + diverge | declared + diverge | the h1 and lede words | the not-configured state is declared on screen (`pending-wave`, as in round 1); **D-38** outside the declaration |
| **Sections** | diverge (minor) | — | — | — | TASK-010 measured; 123 of 137 dummy strings exact, 12 live numbers, **47 of 47 accessible names exact** | D-34 |

"Diverge" is strict: any undeclared difference outside `prototype` · `demo-data` · `live-number` ·
`pending-wave`. Exempted throughout, and not listed again: the dummy's static-HTML anchor styling (underlined rail
links, a link-blue `Open the report` — `prototype`, as in rounds 1–6), its title-bar badges, `PROTOTYPE` rail
group and `storage: localStorage` (`prototype`), seeded tiles, rows, paths and runs (`demo-data`), every size,
count, percentage and "Six"/"6" (`live-number`, though a sentence opening with a numeral is worth a style pass).

## R7.3 — The two must-fix divergences

### D-23 · "Remove these" cannot be reached by any user — the Picker never receives a candidate · **app** · BLOCKING

The Picker renders only `useStore.candidates` (`Picker.tsx:151` returns the empty state otherwise). The only
caller of `setCandidates` is `Home.tsx:192`, and Home only ever runs `--scan` (measured: **673 targets, 0
candidates**) or `--all`, which is the safe batch `0,1,2,3,5,6,7,8,9,10,21` (`lib/constants.ps1:75`) — never an
interactive section. The one path that *can* run an interactive section, the Sections screen's Dry-run, discards
the summary (`Sections.tsx:112` calls only `finishRun`, and `finishRun` stores no candidates). Proved at runtime
through the app's own controls:

| step | result |
|---|---|
| Sections → select 18, 19, 23 → **Dry-run** | one call: `--only 18,19,23 --yes --dry-run --not-developer --days 100 --temp-days 3 --large-file-mb 100`; Run screen `Finished · 0 B · 3 of 3 sections` |
| the engine, same args, called independently | `dry_run: true`, **8 candidates** (section 23), `freed_bytes: 0` |
| the Picker afterwards | `Nothing has been offered yet.` · **0 "Remove these" buttons · 0 rows** |

Consequences: RW-105's "Remove these" is dead code for every user; Home's four "These need a person" cards read
`nothing offered yet · 0 items waiting` forever; "Choose items" only navigates to that empty screen.
**Fix:** store candidates wherever a summary lands — in the store's `finishRun`, or `setCandidates(r.summary.
candidates)` in the Sections `.then` — and give "Choose items" a way to populate (a dry-run of that section on
entry). Then recapture the Picker with real candidates, after D-37 is fixed in the dummy.

### D-24 · first-run developer mode is OFF in the app, ON in the dummy and in the engine · **app** · BLOCKING

| source | first-run developer mode |
|---|---|
| dummy `db.js` `DEFAULT_FACTS` | `developer: true` |
| engine `lib/config.ps1` `Resolve-DeveloperMode` | "flag > saved answer > interactive question > conservative default (yes)" → `$ws.Developer = $true` |
| app `store.ts:354` | `readLocal<boolean>(DEVELOPER_KEY, false)` — and the app always passes the flag, so the engine's default never applies |

Every first-run safe run from the app passes `--not-developer`, which offers every toolchain cache in full.
Rounds 1–6 could not see it: the installed app's storage held `developer: true` from round 1's flow 6. This
round's dev origin was genuinely fresh. **Proved both directions, each through the side's own switch:** with the
app turned ON, its Home line, Run command (`windowsweep --json --all --yes --developer --days 100 --temp-days 3
--large-file-mb 100`) and section-20 card equal the dummy's rendered strings exactly; with the dummy turned OFF,
its Run command and section-20 note (`Developer mode is off, so the engine skips this one. Turn it on in Settings
first.`) equal the app's. **Fix:** `readLocal<boolean>(DEVELOPER_KEY, true)`.

**Fix D-25 with it (owner: the dummy, then the app).** `index.html:130`'s caption is static and the app mirrors
it (`home.developerNote`), so the OFF state — rendered in both — reads *"Off – every cache is offered in full"*
directly above *"Caches you have used recently are left alone, so your next build is not a cold one."*, which is
false at that setting: the D-18 class, copy that understates deletion. The dummy's own Settings row already has
the state-dependent pair (`Nothing is being held back – every cache is offered in full.`).

## R7.4 — The other divergences — filed, each with its owner

| id | owner | element | kind | since |
|---|---|---|---|---|
| **D-26** | app | Settings → Developer mode row carries Home's two lines instead of the dummy's `Keeps package, build and test-runner caches that were used inside the idle window, instead of clearing them completely.` + the state-dependent consequence | words | D-8 |
| **D-27** | dummy | Elevation `commandLine()` (`page-elevation.js:47-54`) lacks the `--days --temp-days --large-file-mb` D-8 put on the elevated run; the Run command was amended, this one was not | words | D-8 |
| **D-28** | dummy | "Measure without elevating": a transient toast in the dummy, an inline `note note-info` with `role="status"` at the control in the app. §12 prefers the app's; the decision is recorded only in `design/README.md` (2026-09-13) — §10a wants it in `page-elevation.js` | layout | 2026-09-13 |
| **D-29** | app | Elevation eyebrow `Sections that need administrator rights` vs `Sections 12–16 and 20`; the lede loses `<strong>never elevates itself</strong>`; steps 2 and 4 lose `<code>` on `--reports-dir`, `--logs-dir` and the runs path; the command line sits in the page instead of the status bar (`[data-ws-text="elevateCmd"]`) | words + layout | TASK-004 |
| **D-30** | app | Run log heading `The engine's own log` vs `Log` + `never animates – this is the surface you watch while something irreversible happens` (`run.html:81-82`); per-section rows append `expected` | words | `5f2bc84` / `a75ac9b` — missed by rounds 1–6, see R7.6 |
| **D-31** | app | shipped copy names "the click dummy": `pending.runProgress` under Run's per-section list and `pending.body` on Settings → Scanning and Notifications. Users of 1.1.0 already see it | words | `a75ac9b` |
| **D-32** | app | on the RW-105 surfaces: ring arc titles `C  ·  9.8 GB free of 272.9 GB  ·  53.6 GB reclaimable` vs `C:  21.0 GB free of …` (colon dropped, a separator added — `home.ringArcTitle`); drive-bar titles `… reclaimable on C` vs `… on C:` (`home.driveRailTitle`; `drives.ts:31` promises "the window adds the colon"); the Home schedule switch named `Weekly schedule` vs `Weekly scheduled run` | words (names) | RW-105 |
| **D-33** | app | `1 sections` (`home.lastWhen`) and `Space freed by the last 1 runs, oldest first: 0 B.` (`home.sparkAria`, with a trailing period the dummy lacks) — no plural form, while the catalogue uses `_one`/`_other` elsewhere | words (i18n) | `a75ac9b` |
| **D-34** | app | Sections eyebrow `The catalogue` — the dummy has none | words + layout | `5f2bc84` — missed by rounds 1–6 |
| **D-35** | app | Settings status note `settings sync when you are signed in` never built (no key in `en.json`); tablist named `Settings` vs `Settings sections` | words | D-8 |
| **D-36** | dummy | Home: `Include everything` stays enabled as a no-op when nothing is excluded (the app disables it); the idle-window readout `100 days` exists only in the app. Amend the dummy to the app's behaviour, or declare | layout + words | wave 4b |
| **D-37** | dummy | the Picker labels 18 and 19 swapped — `18 · large files` / `Large personal files` and `19 · downloads` / `Old downloads` (`picker.html:45-46`, `page-picker.js:10-11`) against its own `seed.js:46-47` and the engine catalogue (18 `partials`, 19 `large`). The app names sections from the catalogue (`Picker.tsx:176`), so a populated Picker will differ until the dummy is fixed | words | — |
| **D-38** | app | Account frame beyond the dormancy declaration: eyebrow `Account` vs `Optional`; `wrap-narrow` single column vs the dummy's card + `What is stored, exactly` table; no Sync band; no `What happens when two machines disagree`; the lede loses `<strong>never gated</strong>`. In every state, configured or not (`Account.tsx:90-160`). Not blocking while sign-in is dormant; owed before row 15 | words + layout | `5f2bc84` |

**Observations, not judged as divergences (owner decisions):**
- **The Reclaim button and the Run hero carry the scan total, not what the run does.** `Reclaim 53.6 GB` and
  `READY TO RUN 53.6 GB`, while the safe run is expected to free **11.5 GB** (the ladder; the per-section rows sum
  to the same). 4.6× on this machine with developer OFF. The dummy's seed makes the two equal, so it never
  specified which number the button carries; round 6 accepted the same shape (59.6 vs 39.5).
- **Real paths push the table's Size and Idle off-screen.** The engine gives only absolute `path` (median 81
  characters), so Home's table is 1453 px wide inside its `.xscroll` band at 1440; the dummy's short
  `%LOCALAPPDATA%\…` seed paths (`demo-data`) never exercised it.
- **The dummy's own Settings consequence renders `Right now that holds back -.`** — a dash for the figure — at
  its seed state.
- **Two counts under one noun.** Home's map `aria-label` says 243 targets; the hero says 673 (zero-byte targets are
  not drawn).
- **RW-105's five dummy questions are still unanswered**, and two surface here: (a) the schedule switch shows a
  state word `Off` beside it in the app only; (c) held back reads `not measured` with no count line.

## R7.5 — Measurements

**Home's table switches (TASK-009)** — every hit area sampled pixel by pixel with `elementFromPoint`, which
attributes a `::before` hit to its switch and shows which neighbour owns an overlapping pixel:

| | dummy 1440 | app 1440 | dummy 760 | app 760 |
|---|---|---|---|---|
| visible switch box | 30.4 × 17 | 30.4 × 17 | 30.4 × 17 | 30.4 × 17 |
| `::before` | min 44 × 44 | min 44 × 44 | min 44 × 44 | min 44 × 44 |
| row height | **39.5** (every row) | 39.5 – 129.5 (median 62) | 39.5 – 84.5 (median 62) | 39.5 – 129.5 (median 62) |
| effective hit height × width | **33 – 39** × 44 (median 39) | 39 – 44 × 44 (median 44) | 38 – 44 × 44 | 39 – 44 × 44 |
| edges owned by a neighbour | 13 | 2 | 0 | 2 |
| sampled (visible in the 20 rem scroller) | 7 of 28 | 5 of 243 | 5 of 28 | 5 of 243 |
| plant `.switch::before{display:none}` | **18**, box unchanged | 18 | 18 | 18 |

**A single-line row is 39.5 px, under 44, so neighbouring 44 px hit areas overlap by 4.5 px.** The lower switch
owns the strip (it paints later), leaving each upper switch an effective **39 × 44** target — above WCAG 2.2's
24 px minimum (2.5.8), below the 44 px goal. The app's rows are mostly taller (wrapped target names), so it
overlaps only where two single-line rows meet. The 33 px reading is the first visible row, clipped by the table
header, not by a neighbour.

**The map is ONE tab stop, on both sides and at both widths.** `svg` `tabindex="0" role="img"`; every tile — 28 in
the dummy, 125 in the app — `tabindex="-1"`, no role, no label; nothing focusable inside. Real Tab presses from
`Reclaim …`: one stop in the map, then out (the app's walk skips `Include everything`, disabled — D-36).

**Sections (TASK-010) — verified.** 19 switches on both sides, each 30.4 × 17 visible in a 59 px row, each with an
empirical **44 × 44** hit area and no overlap, at 1440 and 760. With the rule disabled the height falls to 18 and
the visible box does not move; restored, 44.

## R7.6 — "Measure without elevating": read-only, and no UAC

| | |
|---|---|
| pressed | once, 22:10:04 UTC; the guard logged exactly one call: `run_clean ["--scan","--not-developer","--days","100","--temp-days","3","--large-file-mb","100"]` — **no `--elevate`** (which it would have refused) |
| result, ~24 s | `<p class="note note-info" role="status">` **"Measured 29.8 MB across the sections you chose. Nothing was deleted, and no permission was needed to look."** |
| UAC | the process table sampled every 500 ms from 03:09:57 to 03:12:27 local — **292 samples, `consent.exe` 0** |
| the dummy | toasts `Measured 15.9 GB across the sections you chose. Nothing was deleted, and no permission was needed to look.` — the same sentence (live number), a different channel (D-28) |

"Ask for permission and run" was never pressed (IRON rule 10); confirming the deep gate only changed the command
line. **The 2026-09-13 fix holds.**

## R7.7 — The word check, its plants, and three gaps it closed

**Method.** Raw text-node values (textContent, never `innerText`) after opening every `<details>`; invisible
elements excluded; only whitespace runs that contain a line break folded (self-check first: `"not   measured"`
kept, `"A  ·  B"` kept, source indentation folded). Tiers: exact · live number (digits masked, spacing, case and
punctuation kept) · lenient (reported) · lenient live number (reported) · absent. A **whole** string — the entire
text of its box — must equal a string on the other side; only a fragment may match by containment.

| plant (in a COPY of an app snapshot; originals hash-checked) | applied? | what the check said |
|---|---|---|
| **one word** — Settings, `A shorter window for` → `A smaller window for` | original 1 → copy 0, new phrase 1, 6 entries | **`ABSENT FROM APP: "A shorter window for %TEMP% and the Windows temp folders, which turn over much faster."`** and `APP ONLY: "A smaller window for …"`; exact 23 → 22. Restored: gone |
| **the separator** — Home, every `  ·  ` → ` · ` | 15 → 0 | 13 strings per side moved out of live number into `LENIENT LIVE-NUMBER`, named (`pkg · 13.7 GB` vs `pkg  ·  7.2 GB`). Restored: 81 / 168 live, 0 lenient |

**Gaps in the rounds-1–6 checker (`tools/parity-words.mjs`), found and closed here:**
1. `isQuantity` treats any string of three characters or fewer as a number, so the dummy's heading `Log` could never
   be reported — D-30 has hidden since round 1.
2. Containment lets a short app-only string pass inside a longer dummy sentence (`The catalogue` inside `The
   catalogue is a frozen public contract…`), and a dummy heading pass inside engine output (`Log` inside `Log:  C:\…`)
   — D-34 has hidden since round 1. Fixed by the whole-string rule.
3. My own first live-number tier masked after a whitespace-collapsing fold, so a single-spaced separator would have
   passed as a live number — the exact trap RW-119 names. Fixed before plant 2.

And one in the build gate: the spaced needle `not the real engine` can never match — the marker is
`windowsweep-dev-fallback-not-the-real-engine`. Measured with it: **1 file in `src/`, 0 in `dist/`.**

## R7.8 — What could not be captured, and why

| item | why |
|---|---|
| the app's Picker with candidates and `Remove these` | unreachable — D-23. The dummy's ticked state is captured as the reference (`picker-selected-*`, `Remove these` visible and enabled beside Recycle Bin / Permanent) |
| Run's Cancel enabled mid-run | needs a real cleanup run (MANUAL-TASKS row 28 is the owner's); captured at rest, disabled, on both sides |
| Account's configured signed-out state and the deletion band | sign-in is not configured in this build and will not be in 1.2.0 unless row 15 lands; the dummy also hides the band until sign-in; not faked |
| the schedule switch toggled | it registers a real Scheduled Task (row 26 is the owner's); captured at rest |
| held back with a figure | needs a safe-batch dry-run; left `not measured` |
| 390 px | below `minWidth: 760` |

## R7.9 — Can GATE 4 close? Can `desktop-v1.2.0` publish?

**No — not until D-23 and D-24 (with D-25) are fixed.**

| must fix before publishing | why it blocks |
|---|---|
| **D-23** — the Picker never receives a candidate | RW-105's "Remove these" ships as a built, advertised surface no user can reach, and four Home cards read `nothing offered yet` forever |
| **D-24** + **D-25** — first-run developer mode OFF, and the OFF caption | every first-run safe run offers every toolchain cache in full, against the dummy and the engine's own conservative default, under a caption saying recent caches are left alone |

Everything else is filed, named and owned; by round 6's own principle a filed, named divergence does not hold a
screen. D-31 (the "click dummy" wording in shipped copy) is cheap and worth the same pass. **D-21 is closed** and
**D-8 is confirmed** in the rendered pair. **RW-119 cannot flip** — its Picker pair shows no Remove control —
and **RW-103's acceptance ("pairs judged `match`") is not met.** After the two fixes, a round 8 limited to Home
(the developer band), Picker (with candidates via a Sections dry-run of section 23), Run (the command line) and
Elevation (card 20) is short with these drivers.

## R7.10 — Reproducing this · side effects · cleanup

- **Drivers:** `gate4-evidence\round7\drivers\` — 15 files, the exact text each step fed to `node
  --input-type=module` on stdin, with `tools\cdp.mjs` reused unchanged. Note: `tools\capture-dummy.mjs`,
  `parity-words.mjs`, `parity-axes.mjs` and `r6-verify.mjs` still hardcode the pre-rename root and fail as
  written; `launch-app.mjs` launches the installed 1.1.0.
- **Captures and logs:** `gate4-evidence\round7\pairs\` (67 files, 15 MB) and `…\logs\` (58 files: the IPC guard
  log, the network log, the word snapshots and reports, the measurements, the UAC watch, the storage record).
- **Not beside this file, by decision (main session, 2026-09-13):** the 13 downscaled `*-round7.png` pairs are kept in `gate4-evidence/round7/committed-candidates/` and NOT committed. Their app halves show this machine's user-folder paths and, in the Run log pane, its OS edition, RAM and drive sizes, and IRON rule 8 names only `PROJECT-CONTEXT.md` and `MANUAL-TASKS.md` for machine-specific paths in this public repository. Round 6's committed pairs carry the same kind of detail; they are reported here, not rewritten out of history.
- **Side effects:** eight run folders under `%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\` (two empty from the
  boot catalogue reads, the Home scan, the Measure scan, the Sections dry-run, three `r7-*` from direct engine
  calls; about 206 KB) — the installed app's History reads the same folder; left as evidence, safe to delete.
  Only read-only engine modes ran: `--list`, `--scan`, and one dry-run of interactive sections 18 / 19 / 23,
  permitted by a second guard that required `--dry-run` and was first shown refusing `--permanent`, section 17
  and a missing `--dry-run`. The dev origin's storage was restored to the as-found key set.
- **Incidents, stated:** a `chrome.exe --version` probe launched one Chrome for Testing window on its default
  profile for about two minutes (Windows Chrome does not print a version) — never navigated, killed by PID. The
  round's automation Chrome ended mid-session with Chrome's own `exit_type: Crashed` and no crash dump,
  consistent with an external kill; it was relaunched on the same profile after re-asserting it.
  `C:\Windows\system32\convert.exe` is the FAT-to-NTFS converter, not ImageMagick — never run.
- **Cleanup, verified:** nothing listening on 5974, 9333, 9226 or 9222; no `windowsweep-desktop.exe`, no session
  node process, no windowsweep WebView2; the owner's own Chrome was never touched. Build gate on `desktop/dist/`
  (built 01:26, the 1.2.0 cascade): test-auth hooks 0, dev-engine marker 0, `*.map` 0, `sourceMappingURL` 0;
  the control `run_clean` found.

---

