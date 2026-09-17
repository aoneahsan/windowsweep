> Round 12 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 12 — 2026-09-17, HEAD `cc3f94d`, desktop 1.2.0 · **CLEAN on the product.** All seven items judged pass, twelve pairs match or carry a declared divergence, and no new app defect was found. 🔴 **Three findings are against the ROUND'S OWN METHOD, and one of them is that the IPC guard this project specifies does not block anything on this build.**

**Build under test:** `main` at `cc3f94d` (`git status --porcelain` empty at the start). 🔴 **HEAD moved during the
round — to `92a75b6`, a tracker-only commit by the main session** (`docs/features/…/00-tracker.json`, one line).
`git diff --name-only cc3f94d..HEAD -- desktop` is **empty**, so the desktop tree judged here is byte-identical at
both commits and the verdict holds at `92a75b6`. Run with
`yarn tauri dev` from `desktop/` — Vite 8.2.2 on 5974, Rust `dev` profile, with
`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333`. WebView2's own title-bar chip read **1.2.0**
and the status bar `engine 1.2.0`. **Dummy:** Chrome for Testing 151.0.7922.77, profile `ahsan-automation`, port
9222 — the profile read back from the OS process table **before the first navigation**, `--user-data-dir` confirmed
under `.local\share\ahsan-automation\profiles\`, owner profile untouched (`logs/12-launch-chrome.txt`).
**Treatment:** lime, light and dark. **Widths:** 1440 and 760 — never 390, because `tauri.conf.json` sets
`minWidth: 760`. **Account:** none — the local Windows user, unelevated, signed out.

**Pairs:** 12 complete pairs, 24 captures in `gate4-evidence\round12\pairs\` — `run-empty` (the D-64 state that is
new to the dummy), `report` (TASK-015) and `history` (TASK-016 item 2), each at 1440 and 760 in light and dark.
**Every driver's stdout is saved** — 29 drivers, **38 files** in `gate4-evidence\round12\logs\`. That is the whole
reason this round exists: round 11 saved none of its output and has no verdict. 🔴 **No plant was written to a
file**: every one was injected into the running page and removed, which is why there is no `plants\` folder.

---

## R12.1 — 🔴 How the round was made safe, and what that cost to establish

Round 11 started a real 1.8 GB deletion because it installed a guard by assigning to
`window.__TAURI_INTERNALS__.invoke`, a **non-writable, non-configurable** property — a silent no-op that reported
itself installed. Round 12 pressed **Reclaim zero times** and never came close to it. Every state this round needed
was reached with *Scan* and *Dry-run first*, both read-only, exactly as the dispatch said they could be.

**Three engine invocations happened this whole round**, each logged by the guard with its full argument vector
(`logs/09-guard-v4.txt`):

| when | vector | verdict |
|---|---|---|
| 14:03:58 | `--scan --developer --days 100 --temp-days 3 --large-file-mb 100` | read-only mode `--scan` |
| 14:05:46 | `--all --yes --dry-run --developer --days 100 --temp-days 3 --large-file-mb 100` | a rehearsal (`--dry-run`) |
| 14:09:27 | `--scan --developer --days 100 --temp-days 3 --large-file-mb 100` | read-only mode `--scan` |

**Nothing was deleted, and that is read from the reports rather than asserted** (`logs/29-runfolder-after.txt`):
all three carry `total_reclaimed_bytes: 0`; the two scans are `mode=scan` and the rehearsal `mode=all dry_run=True`;
no report anywhere under `runs\2026-09-17*` has `dry_run: false`. **Free space on C: was 11 GB before the round and
11 GB after.**

### 🔴 F-1 — THE GUARD THIS PROJECT SPECIFIES BLOCKS NOTHING. A FAILED FETCH IS A RETRY, NOT A REFUSAL

The round's instructions name the fix for round 11: *"install it at the CDP transport — `Fetch.enable` with a
pattern on `http://ipc.localhost/*`, failing any `run_clean` whose body lacks `--dry-run` or `--scan`"*. That guard
was built first (`drivers/00-guard.mjs`), it **did** intercept, and it **did** fail the probe — and the page got
Rust's answer 8 ms later anyway (`logs/00-guard.txt` shows the DENY; `logs/01-guard-probe.txt` shows both probes
returning `Command gate4_r12_probe not found`, identical).

The reason is in this build's own `__TAURI_INTERNALS__.postMessage`, read verbatim off the page
(`logs/03-ipc-source.txt`):

```js
.then(..., (e) => {
  console.warn('IPC custom protocol failed, Tauri will now use the postMessage interface instead', e)
  customProtocolIpcFailed = true
  sendIpcMessage(message)          // <- THE SAME MESSAGE, DOWN THE OTHER WIRE
})
```

So a `Fetch.failRequest` **retries the command over `window.ipc.postMessage`**, and because `customProtocolIpcFailed`
is a module-level latch it also switches the whole document onto that wire permanently — after which the Fetch guard
sees **nothing at all** and goes on reporting itself installed. The app's own console printed the sentence
(`logs/01-tauri-dev.txt`). 🔴 **This is the same false assurance as round 11's, one layer down**, and the project's
existing note — that a refused *preflight* causes it — understates it: **any** rejection does, including the POST's.

**The fix, and it is the correction this project needs recorded: never fail the request, FULFIL it.** A 200 carrying
`Tauri-Response: error` routes to the invoke's error callback, so the command never reaches Rust, the promise
rejects, and nothing throws — so no fallback and no latch.

### 🔴 F-2 — `window.ipc` is frozen; the only guardable seam is `window.chrome.webview.postMessage`

Guard v2 wrapped `window.ipc.postMessage` and **read back `false`** — a third instance of round 11's exact class.
Five mechanisms were measured in turn (`logs/05-postmessage-wire.txt`): `window.ipc` is
`writable:false, configurable:false`, `Object.isFrozen` **true**, `isSealed` **true**, and its `postMessage` is
non-writable and non-configurable; `Object.defineProperty` throws `Cannot redefine property` on both the object and
on `window.ipc` itself. **Mechanism 5 is the one that works:** `window.ipc.postMessage` is literally
`s => window.chrome.webview.postMessage(s)`, and `window.chrome.webview.postMessage` **is** writable and
configurable — read back `true`.

### 🔴 F-3 — the guard's first rule emptied every screen, and it looked exactly like a broken app

The dispatch's rule — allow a `run_clean` only if it carries `--dry-run` or `--scan` — refuses
`run_clean --list --json`, which is how `lib/catalogue.ts` loads the catalogue at boot. With it in force Home drew
no hero, no buttons and no rungs, and Run read **"0 of 11 sections"** → **"0 of 0 sections"** with
*"Nothing in the safe batch to run."* (`logs/08-d64-fresh.txt`, the first run of that driver). Had that reading been
trusted, this round would have reported a catastrophic D-64 regression that does not exist. The rule was rebuilt
from `src-tauri/src/args.rs`, which names every flag and comments the read-only ones:

> ALLOW `--dry-run` (a rehearsal of any mode) or a read-only mode — `--list --list-targets --version --self-test
> --scan`. REFUSE everything else, which is exactly `--all`, `--only`, `--profile` and `--purge-all` without a
> `--dry-run`, plus `--install-task`/`--uninstall-task`. REFUSE `--purge-all` unconditionally. REFUSE a vector that
> cannot be read — fail closed.

**The guard, proved rather than announced** (`logs/09-guard-v4.txt`, `logs/10-guard-proof-v4.txt`,
`logs/31-guard-final.txt`):

| proof | result |
|---|---|
| the predicate over 16 sample vectors, offline, before any browser | 16/16 as expected, including the `--list` row v3 got wrong and the two fail-closed rows |
| wire 1 installed | `Fetch.enable` acknowledged; fulfil-on-refuse, never fail |
| wire 2 installed | assigned to `window.chrome.webview.postMessage`, **read back identical: true**; `window.ipc.postMessage` confirmed still forwarding to it |
| **fail-closed, wire 2** | probe carrying the token → `refused by the GATE 4 round 12 guard (postMessage wire)` |
| **fail-closed, wire 1** | probe carrying the token → `refused by the GATE 4 round 12 guard (fetch wire)` |
| **selective, both wires** | the SAME command without the token reached Rust: `Command gate4_r12_probe not found`. A guard that refused everything would pass a one-sided probe and would also have broken the app |
| no fallback on refusal | wire 2's counters stayed `0` while wire 1 refused — the fulfil did not trigger the retry |
| the matcher on live traffic | the three real vectors above, classified as they happened |
| still installed at the end | `installed: true, stillTheWrapper: true`; the token still refused, the control still passed |
| run folders | **241 before, 270 after**; every one of the 29 accounted for below |

**And the property that started all this, measured on this build rather than retold** (`logs/01-guard-probe.txt`):
`__TAURI_INTERNALS__.invoke` is `{"writable":false,"configurable":false}`, and assigning a wrapper onto it read back
**"THE ASSIGNMENT DID NOTHING - invoke is unchanged"**.

---

## R12.2 — The verdict table

| item | verdict | evidence |
|---|---|---|
| **D-63** rehearsal goes stale after a later scan | **pass** | R12.4 · `logs/18`, `logs/19` |
| **D-64** the Run screen before anything is measured | **pass — pair matches** | R12.3 · `logs/11`, `logs/13`, `logs/14` |
| **D-65** the held-back figure follows the same rule | **pass** | R12.4 · `logs/18`, `logs/19` |
| **D-62** the Home map table at 760 | **pass — 0 px at every title length** | R12.5 · `logs/20` |
| **TASK-015** *Export…* pressed for real | **pass — all four claims** | R12.6 · `logs/21`, `logs/28` |
| **TASK-016 (2)** History lists cleanup runs only | **pass** | R12.7 · `logs/22`, `logs/28` |
| **TASK-016 (4)** the route split | **pass — the shell never blanks** | R12.8 · `logs/22`, `logs/25` |
| **§10 axis parity** | **declared 10 · written 10 · unlocatable 0 · different 0** | R12.9 · `logs/24` |

| pair | 1440 · 760 · light · dark | verdict |
|---|---|---|
| **run-empty** (`run.html?empty=1`) | all four | **match** on nine checks; one declared structural divergence (below) |
| **report** (`report.html`) | all four | **match** — the two controls and their words, no note beside them, the `.btn-label` span |
| **history** (`history.html`) | all four | **match on structure and fixed copy**; the rows themselves are this machine's five real runs against the dummy's eight seeded ones, which is `demo-data` and not comparable |

**Declared divergence, run-empty:** the dummy keeps its map band in the DOM and sets `hidden`
(`run.html` → `[data-ws-run-map]`, `page-run.js:255`); the app does not render the band at all when
`drainTargets.length === 0`. **Both render nothing**, and the amendment names the app's behaviour as the intended
one ("its map band renders only while it has tiles"). Recorded rather than counted as a difference.

Standing exemptions unchanged and visible in the run-empty pair: the dummy's `standard user` and
`design dummy · demo data` title-bar badges, its `PROTOTYPE` rail group and `storage: localStorage` status note
(`prototype`); `1.1.0`/`engine 1.1.0` against the app's `1.2.0` (`live-number`).

---

## R12.3 — D-64: the Run screen before anything is measured

🔴 **Captured first, before any scan**, because the state is the reload's gift and the first scan destroys it. The
fresh session was produced by the reload in `drivers/07-guard-proof.mjs` and nothing was pressed between that and
the capture.

| check | app (`#/run`, fresh) | dummy (`run.html?empty=1`) |
|---|---|---|
| basis caption drawn | **no** — the element is not rendered | **no** — `hidden`, text present but not shown |
| rows | **11**, every one `not measured` | **11**, every one `not measured` |
| blank figure cells | **0** | **0** |
| hero | `not measured` | `not measured` |
| hero `up to` | gone | gone (`[data-ws-hero-upto]` hidden) |
| sub-line | `0 of 11 sections · not started` | identical |
| map band shown | no | no |
| visible zone labels | `Per section`, `Log …` | identical |

**Proved against three plants on the dummy**, each applied, read back, and removed clean (`logs/14-d64-pair.txt`):
un-hiding the basis caption → the caption check goes red; blanking one row's figure → two checks go red (which is
exactly the "a blank reads as a zero" rule); showing the map band → two checks go red. After each restore: none red.

---

## R12.4 — D-63 and D-65: the rehearsal goes stale

The four states were walked in order without a single reload after the first one.

| state | Reclaim button | ladder total | ladder caption | Held back right now |
|---|---|---|---|---|
| nothing measured | `Scan first` (disabled) | `not measured` | none drawn | `not measured` |
| after *Scan* | `Reclaim up to 34.2 GB` | `…would free up to` `34.2 GB` | the **bound** sentence | `not measured` |
| after *Dry-run first* | `Reclaim 2.1 GB` | `…would free` `2.1 GB` | `The last dry-run's own figures, for these exact settings.` | **`22.3 GB`** |
| after *Scan again* | **`Reclaim up to 34.2 GB`** | **`…would free up to` `34.2 GB`** | **the bound sentence** | **`not measured`** |

The Run screen followed: hero `up to 34.17 GB` and the bound caption returned, rows back to the new scan's measured
sizes. **D-63 and D-65 both hold.**

🔴 **The six assertions were watched going red, and the control is not synthetic** (`logs/19-d63-d65-controls.mjs`).
**Control A is the app's own rehearsed reading, parsed out of `logs/16-rehearse.txt` rather than retyped** — that
reading *is* the defect D-63 and D-65 exist to remove, and **6 of 6** checks go red against it. Control B, a DOM
plant on the live page applied and read back, turned **5 of 6** red; the sixth (the ladder total's wording) was not
covered because the plant did not touch that node — a gap in the plant, not in the check, and control A covers it.
After the plant was removed: 0 red.

**One thing that looks like a divergence and is not.** Immediately after the rehearsal the Run band draws **no**
caption while Home draws the estimate one. The Run screen is in its **Finished** state there — eyebrow `Finished`,
`11 of 11 sections · 119s elapsed`, every row's status `dry-run`, and the lines *"A dry-run would reclaim 2.1 GB."*
and *"This was a dry-run. Run the same thing without it to reclaim the space."* (`logs/17-run-after-rehearsal.txt`).
`perSectionBasis` returns `null` there by its own definition — the rows are the engine's report of a run that
happened, not a forecast — so no caption is owed. Judged, not assumed.

---

## R12.5 — D-62: the Home map table at 760

Measured with the **pre-D-62 rule planted back** (`max-width:none; white-space:nowrap` on the Target cell, verified
applied each time) so the "after" is read against a verified "before" (`logs/20-d62-table.txt`):

| title | planted old rule, overflow at 760 | **as shipped** |
|---|---|---|
| as found on this machine | 0 px | **0 px** |
| this machine's longest engine title (40 ch) | 191 px | **0 px** |
| the engine's longest safe-batch title (52 ch) | 275 px | **0 px** |
| half again longer (78 ch) | 441 px | **0 px** |

At 1440 neither overflows. **D-62 is fixed and stays fixed past the length that produced it.**

---

## R12.6 — TASK-015: *Export…*, pressed for real

Reached the way a person reaches it — History → the newest run's link, clicked. All four claims hold
(`logs/21-export.txt`):

1. **The files.** `report-2026-09-17_190547-15288.md` (1,945 B) and `.html` (6,436 B) appeared beside
   `report-…json`, both carrying the report's own stem, both inside the run folder and nowhere else.
2. **Explorer.** One new window, at
   `file:///C:/Users/PC/AppData/Local/com.aoneahsan.windowsweep/runs/2026-09-17-14-05-46-od2k64` — read from
   `Shell.Application.Windows()` before and after, so it is the window that opened rather than one that was there.
3. **The words.** 🔴 **The dummy's sentence was PARSED out of `page-report.js:294`, never retyped**, and the app's
   `role="status"` line is identical to it. The old *"Export is not built into this window yet"* note is gone, and
   the app's head band now matches `report.html`'s: the same two controls with the same words, and no note beside
   them on either side — proved by renaming the dummy's control, watching the words check go red, and restoring.
4. **The acknowledgement.** **2.8 ms** to the first mutation at the control (`data-state=pending`, `disabled=true`),
   then `done`. §12's floor is 100 ms.

---

## R12.7 — TASK-016 item 2: a scan is not a History row

Arithmetic on a real sequence rather than a fixture. This round ran **two scans and one dry-run**, in that order,
all three in the guard's log. History gained **exactly one** row (`logs/22-task016.txt`):

- stored rows dated today: **1** (`2026-09-17-14-05-46-od2k64`, the rehearsal);
- stored rows with `mode: "scan"`: **0**; the only mode present in the whole store is `all`;
- on screen, five rows, every one reading `dry-run`; none reads `scan`.

**And the premise is checked against the dummy rather than restated:** `seed.js` → `RUNS` was parsed — 8 seeded
runs, modes `safe batch`, `profile: dev`, `profile: minimal`, `sections …`; the string `scan` appears **0** times
in the block (`logs/28-report-history-pairs.txt`). So the app filtering scans out matches its specification.

---

## R12.8 — TASK-016 item 4: the route split

**All eleven screens reach and render** (`logs/22-task016.txt`) — Home 8 children/29,607 chars, Run, Sections,
Picker, History, Report, Account, Settings, Elevation, Splash, Consent, each with a non-empty content area and the
shell present. Splash and Consent draw no rail, which is their own design.

**The shell across a navigation, sampled every animation frame.** Driver 22 sampled five navigations at ~60 fps and
found the shell never missing — but **every chunk was already warm, so the `Suspense` fallback never rendered and
that measurement answered a narrower question than the one that matters.** So it was redone cold: reload with
`ignoreCache`, then `Network.emulateNetworkConditions` at 300 ms latency / 50 KB/s, sampling the first navigation to
five never-visited screens (`logs/25-cold-chunks.txt`):

| navigation | frames | content area empty | title bar · rail · status bar missing |
|---|---|---|---|
| `#/settings` | 241 | **68 frames, 123→1,211 ms** | **0** |
| `#/picker` | 241 | 47 frames, 121→861 ms | **0** |
| `#/elevation` | 242 | 41 frames, 112→750 ms | **0** |
| `#/account` | 241 | 43 frames, 123→794 ms | **0** |
| `#/sections` | 241 | 46 frames, 112→860 ms | **0** |

The wordless fallback genuinely renders for 0.6–1.1 s, so the instrument had something to catch — and across
**1,206 sampled frames the shell is never missing**, the rail keeps all 9 items, and a rail item is marked
`aria-current` throughout. The navigation is acknowledged where the person is looking while only the content waits,
which is exactly what `App.tsx` claims.

---

## R12.9 — §10 axis parity, and two reader bugs worth recording

**Declared 10 · written 10 · unlocatable 0 · different 0**, identical at 1440 and 760
(`logs/24-axis-parity-defaults.txt`). The dummy's defaults are **parsed out of its own `app.js` registry**, never
restated. Three plants: removing `data-radius` → unlocatable 0→1; `data-density: spacious` → different 0→1; breaking
the parser → 0 axes parsed, which the driver exits on. Restore compared **order-insensitively**, because removing
and re-adding an attribute moves it to the end of the list and a `JSON.stringify` comparison called that a
difference (`logs/23`).

🔴 **The first axis run read `data-theme: light` against the dummy's `dark`, and that difference was mine** — the
D-64 capture had written `windowsweep:prefs` to light. The pref was cleared, the page reloaded so pre-paint ran from
nothing, and the app's real default read `dark`. **A difference the instrument created costs exactly as much as one
it invented.**

**Two reader bugs, both found and both fixed before anything was judged** (`drivers/lib-r12.mjs`):

1. `textContent` concatenates **hidden** descendants, so the dummy's hero read `"up tonot measured"` when
   `applyBeforeScan()` had correctly hidden the `up to` span, and the dummy's post-run bands (`[data-ws-finish]
   hidden`) appeared in the zone-label list. Every reader now walks text nodes and skips any ancestor that is
   `hidden`, `display:none` or `visibility:hidden`.
2. Counting the band's **children** read **1** row on the dummy against **11** on the app — the dummy nests all
   eleven inside `[data-ws-runlist]`. A row is now the **parent of its progress bar**, which is true on both sides.

---

## R12.10 — What could not be tested, and why

- **A real cleanup run, and therefore every state that only a real run produces** — the drained map, a section's
  `ran` status, Home after spending, `spendScanTargets` dropping the rehearsal. 🔴 **Deliberate and not a gap in the
  product:** the round's first rule is that *Reclaim* is never pressed, and every state the seven judged items need
  is reachable without it. It is a **blocked** check, not a failing one.
- **The packaged build.** This round drove `tauri dev` on `localhost:5974`, so the doubled catalogue load below is a
  dev-only artefact and the `Suspense` timings are Vite's, not a local file's.
- **Sweeps** (contrast, hit area, overflow, small type) beyond D-62's table. Round 10 ran them across all eleven
  screens and nothing in `cbdc32e`/`cc3f94d` touches type, colour or spacing; this round's budget went to the seven
  items and to establishing a guard that works.

## R12.11 — One observation, not a defect and not new

**Every catalogue load leaves an empty run folder behind.** 29 folders appeared this round; 26 are empty and are the
`--list` calls, 3 hold the two scans and the rehearsal. It is **pre-existing** — **149 of the 241 folders from
before today are already empty** — and the amendment's `existing_run_dir` change was about a *read* not creating a
folder, which is a different path. The **doubling** (two `--list` per boot) is React `StrictMode` in development and
would not happen in a packaged build. Recorded for the main session to judge; it blocks nothing.

---

## R12.12 — Cleanup

The `tauri dev` build, the guard process and the Chrome for Testing launched on 9222 (pid recorded in
`round12/logs/chrome-9222.pid`) were all killed at the end of the round. No browser this round did not launch was
touched. `grep -r "__xxTestAuth" dist/` → **0**, and the hook does not exist anywhere in `src/` — this desktop
window has no such surface.
