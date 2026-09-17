> Round 1 of GATE 4, part a (§1-§4) · continues in [`round-01b.md`](round-01b.md) · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 1 — 2026-09-07, 13:46 build (history; kept because the fixes were made against it)

## 1. The headline — the installed build cannot run its engine

**The engine tree is fine and the resource-bundling fix holds.** 38 files in `bin/`, `lib/`, `modules/` plus
three at the root; run directly it reports **26 sections, version 1.1.0**. The Rust side spawns it correctly
(`exit 0`, run folder created). The break is entirely at the **IPC boundary**, and there are two stacked
defects (§4, D-1 and D-2). The consequence for GATE 4 is that every data-bearing screen renders its
empty or error state, so **Home shows 0 of its 14 specified zones**:

| | dummy | app |
|---|---|---|
| Home, visible text nodes at 1440 | **286** | **19** |
| Home, zones present | 14 of 14 | **0 of 14** |
| Rail readout | `29.7 GB · across 8 sections` | `- · across 0 sections` |
| Home `<h1>` | `RECLAIMABLE NOW / 29.73 GB` | **`The engine did not answer.`** |

The app states the cause on its own Home screen, verbatim:

```
invalid args `request` for command `run_clean`: missing field `run_id`
```

---

## 2. The 44-pair matrix

Verdict classes: **match** · **declared divergence** (one of the four permitted classes — `prototype`,
`demo-data`, `live-number`, `pending-wave` — with a reason) · **defect** (with the owning writer).

🔴 Where a screen's content is produced by the engine, the row records **blocked by D-1/D-2** rather than
inventing a parity judgement about content that never rendered.

### Splash

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **defect** — web layer (D-5, D-6); plus declared `pending-wave` for the update band |

Wordmark, progress bar, step line and the disclosure `<details>` all match. Divergences: the app's Splash
renders **no title bar at all**, so the dummy's version chip and its `Appearance settings` control are both
absent (D-6). The update band and `Checking for a newer build…` are the in-flight update gate — **declared
`pending-wave`, owned by another writer, not counted as a defect here**. The step line freezes at step 0
because the catalogue never arrives, so `/splash` is a dead end in this build (a consequence of D-1, not a
separate defect — and nothing routes to it on boot anyway).

### Consent

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **defect** — web layer (D-3, D-4, D-6) |

The closest screen to parity: structure, the four provider cards, `Turn all on` / `Turn all off`, the
disclosure and the two footer buttons are all in place, and the decline path works (§6, flow 1). Three
divergences, all in the **words and the treatment** the dummy owns — see D-3 and D-4. No title bar, so no
theme control (D-6).

### Home

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **defect** — Tauri shell + web layer, **blocked by D-1/D-2** |

0 of 14 zones. Nothing about the reclaim readout, the Reclaim Map, the drive rails, the safe-run ladder,
developer mode, "these need a person", the chokepoint, the protected-path chips, the sparkline or the
schedule could be compared, because none of it rendered. The rail, the title bar and the status bar are
present and structurally faithful.

### Run

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **defect** — web layer (D-7); content blocked by D-1/D-2 |

The dummy's never-run state reads `Ready to run` with `0 of 0 sections · not started`. The app's reads
**`Finished` / `The run finished.`** while its own log pane on the same screen says **`Nothing has run
yet.`** — a self-contradiction, and approved copy replaced. See D-7.

### Sections

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **blocked by D-1/D-2** |

Headings, the lede, the tier legend and the column headers (`Everything`, `Needs administrator`, `You pick`,
`What it touches`) are present and match. All 26 rows are absent because the catalogue is empty.

### Picker

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **declared divergence — `pending-wave`**; content blocked by D-1/D-2 |

The app shows `Nothing has been offered yet.` and its Remove button is **disabled with the gap stated on the
screen**, because the `--select-file` writer command does not exist in this build. That is §10a's
`pending-wave` exemption used correctly — declared in the app's own UI, not hidden. **Not a defect.**

### History

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **declared divergence — `demo-data`** |

The dummy's rows are seeded demo data. The app's empty state is the honest rendering for a machine on which
the app has never completed a run. Headings, the filter row and the "summary only" cloud label match.

### Report

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **declared divergence — `demo-data`**; a real report blocked by D-1/D-2 |

`No run to report yet.` The schema-1 rendering could not be compared. A real report **was** produced by the
same engine outside the app (§6, flows 3 and 4) and is schema-correct.

### Settings

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **defect** — web layer (D-8, D-9); parts correctly declared |

All five tabs exist and are reachable on both sides. Measured per tab (the whole-page comparison was
inconclusive because only the selected tab is visible — resolved in `logs/41-parity-settings-tabs.txt`):

| tab | dummy texts | app texts | verdict |
|---|---|---|---|
| General | 48 | 54 | **defect** — four preferences silently missing, ten theme axes added (D-8) |
| Scanning | 54 | 23 | **declared `pending-wave`** — the app says so on the tab |
| Notifications | 40 | 23 | **declared `pending-wave`** — the app says so on the tab |
| Privacy | 44 | 38 | **defect** — provider descriptions reworded (D-3) |
| About | 47 | 25 | **defect** — the whole ecosystem roster is absent, undeclared (D-9) |

### Account

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **declared divergence — owner decision** |

Sign-in and sync are compiled and dormant: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are
deliberately empty until the Google provider is enabled, and `configuredFeatures()` makes the screen say so.
Correct behaviour, verified — not a defect.

### Elevation

| pair | verdict |
|---|---|
| 1440 light · 1440 dark · 760 light · 760 dark | **match on the words** — but see D-10, a false claim in BOTH artefacts; count blocked by D-1/D-2 |

The app carries the dummy's copy faithfully, including the step list and the SmartScreen note. The heading
reads `0 sections need Windows to ask your permission.` against the dummy's `Six sections…` — a `live-number`
derived from the empty catalogue. **D-10 is the more serious finding: the sentence both artefacts share names
a folder that does not exist.**

---

## 3. Summary of verdicts

| verdict | pairs |
|---|---|
| match (structure and words, within a blocked screen) | 4 (Elevation) |
| declared divergence — permitted class, stated with a reason | 16 (Picker, History, Report, Account) |
| blocked by D-1/D-2 — no honest parity judgement possible | 4 (Sections) |
| **defect** | **20** (Splash, Consent, Home, Run, Settings) |

---

## 4. Defects — each with its owner. NOT fixed here; reported for the owning writer

### D-1 · `RunRequest` field naming — every engine call fails · **Tauri shell** · 🔴 blocking

`src-tauri/src/engine.rs:59-64` declares the payload with `#[derive(Debug, Deserialize)]` and a field
`pub run_id: String`, with **no `#[serde(rename_all = "camelCase")]`**. The web layer sends `runId`
(`src/lib/engine.ts:74` and `:118`). Serde deserialises struct fields by their literal Rust names, so every
`run_clean` invocation is refused before the engine is reached:

```
invalid args `request` for command `run_clean`: missing field `run_id`
```

**Why nothing caught it:** Tauri's `#[tauri::command]` macro *does* convert camelCase → snake_case for bare
command **parameters**, which is why `read_run_report(run_id, file_name)` works when called with
`{ runId, fileName }`, and why `app_version` returns `1.1.0` correctly. The conversion does **not** reach
inside a serde struct. Typecheck, clippy, `cargo test` and `tauri build` are all blind to it.

**Proved decisively:** the identical command with one key renamed —
```
{ request: { runId:  … } }  ->  invalid args … missing field `run_id`
{ request: { run_id: … } }  ->  reaches validate(), then D-2
```
**Proposed fix (one line, and the one consistent with Tauri's own convention for arguments):** add
`#[serde(rename_all = "camelCase")]` above `pub struct RunRequest`. The response structs `RunFinished` and
`LogLine` stay snake_case, which is correct — Tauri does not convert the response direction, and the TS
interfaces already read `run_id` / `exit_code`. *(Alternative: change the two TS call sites to send `run_id`.
One line versus three, and the struct fix leaves the boundary matching Tauri's documented behaviour.)*

### D-2 · `--list` is not in the Rust argument allowlist · **Tauri shell** · 🔴 blocking

`engine.rs:25-41` (`ALLOWED_FLAGS`) and `:44-57` (`ALLOWED_VALUE_FLAGS`) do not contain `--list`.
`loadCatalogue()` sends `['--list', '--json']`, so even with D-1 fixed the boot catalogue read is refused:

```
refusing an argument this window is not allowed to pass: --list
```

**Measured**, not inferred — this is the error the corrected-key probe returned. **Proposed fix:** add
`"--list"` to `ALLOWED_FLAGS`. It is read-only and is the only way the app can honour its own rule that no
section list is hard-coded anywhere.

🔴 **D-1 and D-2 are stacked. Fixing either alone leaves the app non-functional.**

### D-3 · Approved copy silently reworded · **web layer**

The dummy owns the words. Measured live from both rendered pages:

| dummy (authority) | app |
|---|---|
| `…nothing **nags** you again…` | `…nothing **asks** you again…` |
| `The same events, kept longer so trends over months are visible.` | `The same events, sent to a second destination so a funnel can be read across releases.` |
| `Product analytics **would receive** which screens you opened and which buttons you pressed.` | `Which screens you opened and which buttons you pressed.` |
| `…**would receive** a recording of this window with all text masked.` | `A recording of this window with every piece of text masked.` |
| `…**would receive** a stack trace with paths stripped.` | `A stack trace when something breaks, with file paths stripped out.` |

Two typographic divergences are visible in the same pair: the dummy's lede sets **`zero network calls`** in
bold and uses an en-dash, where the app's is plain weight with a hyphen.

The one-word `nags` → `asks` change is exactly the §10 failure mode: *"the app's version reads better"* is
not a reason. **Proposed fix:** decide which wording ships, write it into the dummy first (§10a), then match
the app. The app-only Privacy line *"No destination is configured in this build, so nothing could be sent
even with a switch on."* is good honesty and should be **added to the dummy** rather than dropped.

### D-4 · The two consent buttons diverge from the dummy, and the divergence lives only in a code comment · **web layer**

`consent.html:69-70` gives the decline `class="btn"` and the accept `class="btn btn-primary"`. The app makes
**both** `btn btn-primary` (`Consent.tsx:149-152`), with a source comment explaining why: *"a first-class
decline cannot be the quieter of two buttons."*

Measured in the app — both `oklch(0.82 0.185 128)`, weight 600, 15px, so they genuinely carry equal weight.
The reasoning is sound and it honours the dummy's own prose (*"Declining is a first-class answer"*). But
**§10a requires the decision to be written into the DUMMY, not into a comment**: as things stand the owner
reviewing the dummy sees one primary and one secondary, and the pair does not match. Two equally loud
primaries also leaves the screen with no default action, which is his call to make.
**Proposed fix:** amend `consent.html`, then the log records why the *dummy* changed.

### D-5 · Nothing routes to `/splash` on boot · **web layer** *(adjacent to the in-flight update gate)*

Measured: on a genuinely fresh first run the app opens on `#/` (Home). `Splash.tsx` is the only place that
navigates to `/consent`, so **the consent screen is never presented on first run** — the person is taken
straight to Home with nothing answered. Reported because it changes a first-run guarantee; **the fix belongs
with the Splash/update-gate work already in flight** and is not counted separately.

### D-6 · Consent and Splash render an EMPTY title bar and no status bar · **web layer**

Measured on both sides, and plain in the pair `consent-1440-light-{dummy,app}.png`. The dummy's title bar
carries the `windowsweep` wordmark, the `1.1.0` version chip and an `Appearance settings` control; its status
bar carries `engine 1.1.0 · first run - nothing is on yet` and the storage mode. Consent and Splash in the app
render `<header className="titlebar" data-tauri-drag-region />` **with no children at all** — an empty dark
strip — and **no status bar**.

So the app has the theme control on 9 of 11 routes and **0 on `#/consent` and `#/splash`**, because those
render without the Shell. `rules/frontend-ui-standards.md` §11 and the theming skill both require the header
entry point on **every route at every width**. *(The dummy's `standard user` and `design dummy · demo data`
badges are `prototype` class and correctly omitted.)*
**Proposed fix:** give Consent and Splash the real title bar and status bar; that restores the wordmark, the
version chip and the theme button in one change.

### D-7 · The Run screen's never-run state says the run finished · **web layer**

`run.eyebrowDone` = `Finished` and `run.titleUnknown` = `The run finished.` are rendered whenever
`phase !== 'running'` and there is no summary — i.e. **before anything has ever run** — while
`run.logEmpty` = `Nothing has run yet.` sits on the same screen. The dummy's state is `Ready to run` /
`0 of 0 sections · not started` (`run.html:27,32-34`). **Proposed fix:** add an explicit idle branch using
the dummy's words; keep `titleUnknown` for the genuine "ran but the summary was unreadable" case it was
written for.

### D-8 · Four Settings preferences are missing, undeclared, and the theme axes were put in their place · **web layer**

The dummy's General tab carries developer mode **plus** `Idle window` (`Maps to --days 100.`),
`Temporary files` (`--temp-days 3`), `Large file threshold` (`--large-mb 500`) and `Weekly schedule`
(`--install-task`). The app's General tab carries developer mode **and all ten appearance axes**, and none of
the four preferences. The Scanning and Notifications tabs correctly declare themselves as not yet carried;
**General does not** — the omission is silent, which §10 forbids.

Separately, putting the ten axes on a settings tab creates a **second** theme surface the dummy does not
specify (the dummy has one header panel). §11 asks for one control, one panel.
**Proposed fix:** restore the four preferences or declare them `pending-wave` in the app's own UI, and decide
where the axes live — then write that decision into the dummy.

### D-9 · The ecosystem roster is absent from About, undeclared · **web layer**

`CLICK-DUMMY-INVENTORY.md` §5 specifies **More from the same developer** with a two-layer self-exclusion and
a `wsPromoAudit()` proof harness. The dummy's About tab lists `linux-cleanup`, `macleanup`, `native-update`
and `strata-storage` with their one-line descriptions and the *"not an advertising network"* sentence. The
app's About tab has **none of it**, and no `pending-wave` note. Also absent: the `Version` block
(`What is installed right now.`, `up to date`, `Desktop … · engine 1.1.0 · MIT`).
**Proposed fix:** ship the roster with both filter layers, or declare the omission on the tab.

### D-10 · Both artefacts name a runs folder that does not exist · **web layer + the dummy** 🔴

| source | claim |
|---|---|
| `elevation.html:59` (the dummy) | `%LOCALAPPDATA%\windowsweep-desktop\runs\`, one JSON each. |
| `src/i18n/locales/en.json:223` (the app, faithful to the dummy) | identical |
| **measured, where the shell actually writes** | **`%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\`** |

`run_dir()` uses `app.path().app_local_data_dir()`, which is the bundle **identifier**
(`com.aoneahsan.windowsweep`), not the product name. `%LOCALAPPDATA%\windowsweep-desktop` **does not exist on
this machine**. Parity is a *match* — the app carries the dummy's words correctly — and the shared sentence is
false. This is the "an approved artefact holds its claim until something falsifies it, and nothing re-reads
it" class; the wrong path has already propagated into the session handoff notes.
**Proposed fix:** correct the dummy first, then the catalogue string. Best is to render the path the shell
reports rather than restating it.

### D-11 · Every title-bar button renders 0×0 and cannot be clicked · **web layer** — 🔴 **already fixed in source; present in the installed artefact**

Measured in the running app at 1440: `Appearance`, `Minimise`, `Maximise` and `Close` all have computed
`width: 0px; height: 0px`, and `document.elementFromPoint` at each button's own centre returns
`HEADER.titlebar`, never the button. A programmatic `.click()` *does* open the theme panel, so the handlers
are correct and the fault is purely geometric. On a frameless window (`decorations: false`) that means
**there is no way to close, minimise or maximise the window with the mouse**.

Corroborated from a second direction: the keyboard sweep found **36 tab stops landing on something invisible
— exactly these four buttons on each of the 9 shell routes** (§7).

**The cause and the current state:** the installed build renders `class="tb-btn"` / `tb-btn tb-close`.
`Shell.tsx:70-80` in current source records that this exact bug was found and fixed — those class names do
not exist in `shell.css`, and the real vocabulary is `tb-title`, `wincontrols`, `wc`, `wc-close`. The
rebuilt `dist/` (14:33) contains `wincontrols`, `wc-close`, `tb-title` and **zero** `tb-btn`; the installed
exe was built at **13:46**, before `Shell.tsx` changed at **14:31**.
**Action: none in source — rebuild and reinstall before release.** ⚠️ A raw string grep of the exe is
**not** evidence either way: it returned 0 for all seven needles *including the controls*, because the
frontend is compressed inside the binary. The live DOM is the authoritative instrument.

---

