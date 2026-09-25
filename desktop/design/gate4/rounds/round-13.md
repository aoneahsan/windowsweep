> Round 13 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 13 — 2026-09-25, HEAD `d3475bc`, desktop 1.3.0 · **CLEAN.** Every TASK-013 surface matches the dummy — 11 states, 44 pairs, all 34 sync strings verbatim — D-64 and the Scan/Dry-run states hold, and both version surfaces read 1.3.0. No app defect. Every fault found was in this round's own instruments, and each was caught, corrected and re-run before anything was judged (R13.10).

**Build under test:** `main` at `d3475bc` (`git status --porcelain`: only the owner's untracked
`assets/logo/windowsweep-mark.png`, before and after). 🔴 **HEAD moved during the round — to `d32f2b4`, a docs-only
commit by the main session** ("the run's state for a resumed session"); `git diff --name-only d3475bc..HEAD -- desktop` is
**empty**, so the desktop tree judged here is byte-identical at both commits and the verdict holds at `d32f2b4`
(`logs/26b`). Run with `yarn tauri dev` from `desktop/` — Vite 8.2.2 on 5974, Rust `dev` profile (`windowsweep-desktop
v1.3.0` rebuilt in seconds, no `os error 3`), `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9339` and
`WEBVIEW2_USER_DATA_FOLDER=…\gate4-evidence\round13\webview2-profile` (R13.1d). The bundled engine
(`src-tauri/resources/windowsweep`, 41 files) reads `VERSION 1.3.0` and is byte-identical to the repository's engine.
**Dummy:** Chrome for Testing 151.0.7922.77, profile `ahsan-automation-windowsweep-r13`, port 9593, pid 18192 — profile,
binary and a launch GUID read from the OS process table **before the first navigation** (`logs/07`). **Treatment:** lime,
light and dark. **Widths:** 1440 and 760 — never 390 (`minWidth: 760`). **Accounts:** signed out first; then
**desk1** (`aoneahsan.apps.t1+desk1`, id `5cf92279-…`, **a plain user, never an admin**), its password-grant session
injected under the client's own key `windowsweep:supabase-auth` and the window reloaded — the TASK-013 method. desk2 was
not needed this round.

**Pairs:** 11 states × 1440/760 × light/dark = **44 pairs, 88 captures** in `gate4-evidence\round13\pairs\`
(`<state>-<width>-<mode>-<app|dummy>.png`), each with both sides' visible words in `<state>-words.json`. The app's mode
was flipped at **runtime** (`data-theme` + `data-appearance`, computed background read back, the app's own attributes
restored), never by writing `windowsweep:prefs` and reloading as round 12 did — a reload ends the conflict notice, which
lives in memory by design (D40), and a written axis is a synced setting that would have gone to desk1's account. The
dummy's mode is its own URL override (`?theme=&palette=lime`), which `app.js` shows and never persists. **23 drivers**
(`round13\NN-*-source.txt`, run with `node --input-type=module -`), **every one's stdout in `round13\logs\`**, including
every superseded attempt (R13.10). No plant was written to a file.

---

## R13.1 — Safety: the guard, every engine invocation, the run folders, and whose WebView2 profile this was

### a. The guard — round 12's two-wire guard, its predicate made stricter, never looser

`04-guard-source.txt` is round 12's v4 (`round12/drivers/09-guard-v4.mjs`, R12.1 and F-1..F-3): **wire 1** CDP Fetch on
`http://ipc.localhost/*`, every refusal **fulfilled** (200, `Tauri-Response: error`), never failed; **wire 2** a wrapper
on `window.chrome.webview.postMessage` on every document (`addScriptToEvaluateOnNewDocument`) and read back identical.
The `run_clean` rule is taken from `src-tauri/src/args.rs` (unchanged since round 12): **allow** `--dry-run` or a read-only
mode (`--list --list-targets --version --self-test --scan`); **refuse** everything else; refuse an unreadable vector
(fail closed). **v5's additions, all refusals:** `--elevate`, `--install-task` and `--uninstall-task` join `--purge-all`
as refused unconditionally, dry or not (a UAC prompt and a Scheduled Task are no business of a parity round — IRON rule
10); and four commands are refused whatever they carry, because each acts on the owner's desktop: `export_run_reports`
(opens Explorer), `oauth_listen_start`/`oauth_listen_await` and `plugin:opener|*` (open his own browser), updater
download/install, `plugin:process|*`.

| proof | result |
|---|---|
| the predicate over 25 sample vectors, before any browser | **25/25** as expected (round 12's 16 + the v5 rows) — `logs/04` |
| wire 1 installed | `Fetch.enable` acknowledged at 10:40:27.867Z; the guard attached **before the app's first catalogue load** (10:40:29.777Z) |
| wire 2 installed | assigned to `window.chrome.webview.postMessage`, **read back identical: true**; `window.ipc.postMessage` forwards to it |
| wire 2, **fail-closed** | token probe → `refused by the GATE 4 round 13 guard (postMessage wire): probe token` |
| wire 2, **selective** | the same command without the token reached Rust: `Command gate4_r13_probe not found` |
| wire 1, **fail-closed** | token probe → `refused by the GATE 4 round 13 guard (fetch wire): probe token - the fail-closed proof` |
| wire 1, **selective** | the control reached Rust: `Command gate4_r13_probe not found` |
| no postMessage retry after a fulfil | wire 2's counters stayed at 0 through the wire-1 probes |
| wire 2 reached on a live document | one probe fetch **failed on purpose** (the LATCH token, never a `run_clean`), so Tauri resent it over postMessage and latched the document — round 12's driver-07 method; a reload cleared the latch |
| `__TAURI_INTERNALS__.invoke` | read only: `{"writable":false,"configurable":false}` — **never assigned** (invariant 5) |
| still installed at the end | `installed: true, stillTheWrapper: true`; the token still refused, the control still passed (`logs/20`) |

The proof ran at 10:41:28–32Z (`logs/06`). **The round's first press — Consent's *Continue* — was at 10:44:15.678Z.**

### b. Every engine invocation — 14, each with its full vector (`logs/04-guard.txt`, `logs/20`)

| when (UTC) | vector | verdict |
|---|---|---|
| 10:40:29.777 · .778 | `--list --json` ×2 (boot, StrictMode's double load) | read-only `--list` |
| 10:41:29.441 ×2 | `--list --json` ×2 (the guard proof's reload) | read-only `--list` |
| **10:49:25.453** | **`--scan --developer --days 100 --temp-days 3 --large-file-mb 100`** | read-only `--scan` |
| **10:50:07.422** | **`--all --yes --dry-run --developer --days 100 --temp-days 3 --large-file-mb 100`** | a rehearsal (`--dry-run`) |
| 10:52:51.290 · .291 | `--list --json` ×2 (the sign-in reload) | read-only `--list` |
| 10:56:46.719 · .729 | `--list --json` ×2 (the conflict reload) | read-only `--list` |
| 11:00:55.392 · .457 | `--list --json` ×2 (the failure reload) | read-only `--list` |
| 11:06:56.927 · .929 | `--list --json` ×2 (the conflict re-created, R13.10) | read-only `--list` |

**Invocations that could delete: 0. Refusals: 3, all probe tokens. RECLAIM WAS PRESSED ZERO TIMES** — the hero's buttons
were taken by position *and* exact label (`[0]` "Scan", `[1]` "Dry-run first"; `[2]` is Reclaim, whose unmeasured label
"Scan first" is one word from `[0]`), and the guard refuses such a run on both wires regardless.

### c. Run folders and C:, read rather than asserted (`logs/02`, `logs/20`, `logs/26b`)

- **276 folders before, 290 after: 14 new, 0 gone — one per logged invocation**, by timestamp. Twelve are the empty
  folders every catalogue load leaves (R12.11, still pre-existing). Two hold reports:
  `2026-09-25-10-49-25-gu25n6` → `meta.mode=scan, meta.dry_run=false, totals.total_reclaimed_bytes=0`;
  `2026-09-25-10-50-07-wdeo0j` → `meta.mode=all, meta.dry_run=true, totals.total_reclaimed_bytes=0`.
  **No report anywhere this round reclaimed a byte.**
- **C: free 87.23 GB before, 86.16 GB after** — it *fell*, the one direction a deletion cannot produce. This round's own
  writes to C: were measured at **9.1 MB** (the dummy Chrome's profile) + 111 KB (the run folders); the WebView2 profile,
  the build and Vite's cache are on D:. Two other sessions were running on the machine (9333, 9590), and C: kept falling
  while it was being read, so the drive is not an instrument that can attribute this delta — the reports are.

### d. The WebView2 profile — ISOLATED (the env var took effect; no save/restore of the owner's keys was needed)

The dev and installed builds share `%LOCALAPPDATA%\com.aoneahsan.windowsweep\EBWebView` — the owner's own settings.
Proved four ways **before any injection** (`logs/05`), and the owner's side re-read at the end (`logs/26b`):

| proof | result |
|---|---|
| the OS process table | all **6** `msedgewebview2.exe` under this round's `windowsweep-desktop.exe` run `--user-data-dir=…\round13\webview2-profile\EBWebView`; none on the owner's |
| the round's folder | absent at preflight; **340 files** after launch |
| the owner's `EBWebView` | **1,315 files, newest write 2026-09-17T17:51:13.737Z, Local Storage newest 2026-09-17T14:43:09.450Z** — identical at preflight, after launch, and after the whole round |
| the window's own storage | started with no `windowsweep:*` key at all (only Amplitude's) and on `#/consent` — a first run, not his |

---

## R13.2 — The verdict table

| item | verdict | evidence |
|---|---|---|
| **TASK-013 · Account** — signed out, signed in (synced + desk1's two summaries), the conflict notice with Undo, the list read failing | **pass — 4 pairs match** | R13.3 · `logs/09-pair-account-*`, `11`, `11b`, `13`, `16` |
| **TASK-013 · History** — the signed-out empty, All / Other machines / Dry-runs with account rows, the failed read | **pass — 5 pairs match** | R13.4 · `logs/09-pair-history-*`, `16` |
| **TASK-013 · Home's settings-replaced line**, its placement, its link, and the Undo | **pass — pair matches** | R13.5 · `logs/09-pair-home-replaced`, `15`, `19` |
| **every sync string** (34 catalogue keys, pair-drawn or not) | **34 / 34 verbatim in the dummy** | R13.6 · `logs/28` |
| **D-64** the Run screen before anything is measured | **pass — pair matches** | R13.7 · `logs/08`, `09-pair-run-empty` |
| **one Scan, one Dry-run first** (R12.4's first three states) | **pass** | R13.7 · `logs/10` |
| **version surfaces** | **pass — `1.3.0` / `engine 1.3.0`** | R13.8 · `logs/08` |
| **§10 axis parity** | **declared 10 · written 10 · unlocatable 0 · different 0** | R13.9 · `logs/18` |

| pair (dummy state → app state) | words app / dummy / shared | residue, every unit classified |
|---|---|---|
| **run-empty** · `run.html?empty=1` → `#/run`, fresh session | 58 / 60 / **56** | text-node split of the same sentence (`0 of 11 sections · not started`) |
| **account-signed-out** · `account.html` → `#/account` | 43 / 43 / **43** | **none** |
| **history-signed-out-other** · Other machines chip, signed out | 28 / 27 / **27** | `demo-data`: the app's chart line "No real run has finished in this window yet." (no local run yet); the dummy draws its seeded spark |
| **account-signed-in** · after the dummy's own *Sign in with Google* → desk1 | 76 / 97 / **63** | `demo-data` (`AM` / `you@example.com`, five seeded rows) and `live-number` ("3 of 8" / "0 of 1 runs uploaded", "Synced 2 minutes ago" / "Synced 1 minute ago", "showing 5 of 5" / "2 of 2") |
| **history-all-signed-in** | 50 / 187 / **37** | `demo-data`: 25 seeded local + 2 laptop rows / this window's rehearsal + `otherone` + `othertwo` |
| **history-other-signed-in** | 42 / 43 / **31** | `demo-data` rows, `live-number` header |
| **history-dry-signed-in** | 43 / 57 / **29** | `demo-data`; the app's cloud dry-run row (`othertwo`) carries "summary only" / "another machine" / "—", which the dummy's seed has no dry cloud row to draw — the same words are **shared** on the Other machines pair |
| **account-conflict** · `account.html?replaced=1` → desk1's own newer PATCH + reload | 78 / 99 / **65** | as account-signed-in; the notice and Undo are shared |
| **home-replaced** · `index.html?empty=1`, notice standing → `#/` | 223 / 178 / **151** | `live-number`: drives, the engine's own protected paths, this window's rehearsal on the last-runs band; **carried forward**: "Six"/"6" (R4, §10's countable carve-out) and the *Never sent* sentence (R3, "consistent copy") |
| **account-list-failed** · `account.html?fail=list` → CDP Fetch failing `/rest/v1/runs` | 53 / 53 / **49** | `live-number` only (initials, email, sync time, upload count) |
| **history-failed** · `history.html?fail=list` → the same interception, `#/history` | 36 / 187 / **28** | `demo-data` rows; the header's "freed in the last 0 runs" is **TASK-018, declared** |

**Declared divergences carried forward (R12.2):** the dummy's `standard user`, `design dummy · demo data` and
`app 0.1.0-design` badges, its `PROTOTYPE` rail group and `storage: localStorage` note (`prototype`); `1.1.0` /
`engine 1.1.0` against the app's `1.3.0` (`live-number`); run-empty's map band hidden in the dummy and not rendered in the
app. **`data-drawer`** is on the app's `<html>` only — the narrow-width navigation drawer's state, not an axis.
**TASK-018** — note the dummy's own `page-history.js:225-230` prints "freed in the last 0 runs" for zero real runs too, so
parity holds while the wording question stays filed.

---

## R13.3 — Account

- **Signed out** — 43 of 43 word units identical; the pair is pixel-level alike but for the declared prototype chrome
  (`account-signed-out-1440-dark-*`).
- **Signed in** (`logs/11`, `11b`) — "Signed in" and desk1's address, the avatar initial `aria-hidden`; the Settings row
  **"Synced now"** with the `syncing` badge 1,335 ms after the reload; the Run summaries row **"0 of 1 runs uploaded –
  date, bytes, section count"** — this window's one rehearsal was made signed out, and runs made signed out are never
  sent; the list **`othertwo`, `otherone`**, "showing 2 of 2". Server read as desk1: one settings row, still exactly the
  two seeded runs — nothing uploaded. The pair matches band for band: card, *What is stored, exactly*, the Sync band's
  three rows, *Run summaries* with its Remove sentence above the table, the pager, the disagreement disclosure, the delete
  band (`account-signed-in-1440-light-*`).
- **The conflict** (`logs/13`) — Developer mode pressed off in Settings, synced (POST 409 → PATCH 204, row at this
  machine's stamp); **desk1's own PATCH** on the granted columns (`developer`, `settings_updated_at`) made the account newer
  and opposite (1 row); the reload drew **"Your account held newer settings, so they replaced this machine’s."** with
  *Undo* described by it, 679 ms after the reload. Matches the dummy's `?replaced=1` at 1440 and 760, light and dark
  (`account-conflict-760-dark-*`: the notice and Undo on the Settings row's second line, the same place).
- **One failure line** (`logs/16`) — `/rest/v1/runs` **failed, never fulfilled**, in the driver's own CDP session (the
  guard's is separate): the list's place holds **"The run summaries in your account could not be read. Nothing on this
  machine changed, and windowsweep tries again the next time you open this screen."**, `role=status`, glyph
  `aria-hidden`, no table — 7.8 s after load, the SDK's three GET retries (1 s / 2 s / 4 s). Interception released the
  moment the line stood. 49 shared units with `account.html?fail=list`.

## R13.4 — History

- **The signed-out empty** — Other machines, signed out: **"No run summaries from other machines"** / **"Sign in and your
  other machines’ run summaries appear here. Nothing syncs while you are signed out."**, identical on both sides.
- **All / Other machines / Dry-runs, signed in** — the six columns, the chips (`aria-pressed`, the filter in the URL),
  the cloud row's **"summary only"**, **"another machine"** and **"—"**, the pager and the budget sentence all match; the
  status bar's "local runs are complete - cloud rows are summaries" matches (`history-other-signed-in-1440-light-*`). The
  rows are this window's rehearsal plus desk1's two summaries against the dummy's seed — `demo-data`.
- **The failed read** — the same interception on `#/history`: the unread row heads the list (`role=status`) and this
  window's own rehearsal row sits under it, as the dummy's `?fail=list` draws its seeded rows under it
  (`history-failed-760-dark-*`).

## R13.5 — Home's settings-replaced line, and the Undo

The line is **word-identical** on both sides — three text nodes, the link's words "the Account screen" — and
**placed as `index.html`'s comment specifies** (`logs/15`): after the sub-line, before *Scan*, *Dry-run first* and the
Reclaim button in document order, and its link is the **first** focusable ahead of *Scan* in tab order. Following the
link lands on Account with the notice standing; **Undo** ended the notice, moved focus to the **Sync heading** (`H2`,
`tabIndex -1`), and the account's row read back `developer=false`, re-dated to this machine's Undo
(`2026-09-25T11:00:19.880Z`); Home's line ended with it. The pair is against the dummy's **unmeasured** Home
(`index.html?empty=1`), because every reload this round (sign-in, conflict, failure) returned the app to a fresh,
unmeasured session — like against like (`home-replaced-1440-light-*`).

## R13.6 — Every sync string against the dummy's source (`logs/28`)

The pairs render the states the dispatch named; the approved strings also cover states no pair drew. So all **34**
catalogue keys of the sync surfaces (`account.sync.*`, `account.syncTitle`, `account.runs.*`, `account.disagree.*`,
`history.cloud*`, `history.whereOtherMachine`, `home.settingsReplaced`) were matched against the dummy's own source —
`page-account.js`, `page-history.js`, `account.html`, `history.html`, `index.html` — adjacent JS literals joined,
placeholders as wildcards. **34 of 34 verbatim**, including `failed.settingsRead`, `failed.settingsWrite`,
`failed.upload_one/_other`, `failed.listMore`, `failed.remove` and `runs.empty`. Two controls: a planted wrong string
is **not** found; a string the dummy carries (`page-history.js:111`) **is**. The short labels ("syncing", "Remove",
"another machine") are backed by the rendered pairs, where they are shared units; the sentences by this check.

## R13.7 — Home and Run: D-64, one Scan, one Dry-run first

**D-64** (`logs/08`, read with round 12's own `lib-r12.mjs` RUN reader): the basis caption not drawn; **11 rows, every
one "not measured"**, no blank cell; hero "not measured" with no "up to"; sub-line **"0 of 11 sections · not started"**;
no map band. The pair against `run.html?empty=1` matches (`run-empty-1440-light-*`) — 56 shared units, the residue a
text-node split of the same sentence.

**The regression pass** (`logs/10`, signed out — so the rehearsal never went to the account):

| state | hero buttons | ladder | caption | held back |
|---|---|---|---|---|
| nothing measured | `Scan` · `Dry-run first` · `Scan first` (disabled) | `not measured` | none | `not measured` |
| after *Scan* (39.8 s) | `Scan again` · `Dry-run first` · **`Reclaim up to 19.1 GB`** | "…would free **up to**" 19.1 GB | the **bound** sentence | `not measured` |
| after *Dry-run first* (111.7 s) | `Scan again` · `Dry-run first` · **`Reclaim 1.3 GB`** | "…would free" 1.3 GB | "The last dry-run’s own figures, for these exact settings." | **13.9 GB** |

The Run screen followed: after the scan, hero "up to 19.11 GB", the bound caption, every row measured; after the
rehearsal, **Finished**, "11 of 11 sections · 110s elapsed", every row `dry-run`. **D-63 and D-65 still hold.**

## R13.8 — The version surfaces

The title-bar chip reads **`1.3.0`** and the status bar **`engine 1.3.0`** (`logs/08`), in every capture of the round;
the dummy's `1.1.0` / `engine 1.1.0` is its standing `live-number` exemption.

## R13.9 — §10 axis parity (`logs/18`)

The dummy's ten defaults **parsed from its own `app.js` registry**, never restated; the app read live with
`windowsweep:prefs` **absent** in this profile (pre-paint ran from nothing): **declared 10 · written 10 · unlocatable 0 ·
different 0** at 1440 and 760. Watched failing: a live plant (`data-radius=none`, `data-density` removed) turned it
**different 1, unlocatable 1**; the restore read clean, compared order-insensitively. Every pair's `<html>` attributes at
1440 light also match axis for axis (`<state>-words.json`).

## R13.10 — The round's own instrument faults — each caught, corrected and re-run before judging

Seven faults, every one in this round's instruments and none in the product. Every superseded log is kept under an
`attemptN-…` name; nothing below touched the product.

1. **run-empty, attempt 1** — Git Bash rewrote the env value `#/run` into a Windows path, so the app side captured
   TanStack's "Not Found" (`logs/09-pair-run-empty.attempt1-msys-path.txt`). Routes are now passed without `#/`.
2. 🔴 **The capture freeze hid every `.rise` entrance.** `animation:none` pinned `shared.css:548`'s `.rise` (opacity 0,
   animated *forwards* to 1) at opacity 0, so **Home and Run captured blank on both sides** while the word reads — which
   test display and visibility, not opacity — passed. Caught by *looking* at the pair. The 24 blank captures are set
   aside in `pairs\invalid-freeze-attempt1\`; the freeze now ends animations on their final frame (0 s duration keeps
   the fill); run-empty and home-replaced were re-captured, the conflict re-created for the latter (`logs/19`).
3. **account-list-failed, attempt 1** — the dummy's notice from the conflict step still stood (its store keeps it until
   Undo), so the pair carried a state the app no longer had. The dummy's own Undo (`logs/17`), then re-captured.
4. **11-signin's one FAIL** — its reader took the card's `textContent`, which begins with the `aria-hidden` avatar
   initial; `11b` reads by element and passes.
5. **11b, attempt 1** — written through a shell heredoc that ate a backslash, so the page-side `\s+` became `s+` and
   every "s" was stripped from the email. Rewritten with the editor, the page code in a `String.raw`.
6. **20-guard-final, attempt 1** — read `mode` and `dry_run` at the report's top level, where they are not, and so
   counted "0 real runs" **vacuously**. Now `meta.mode`, `meta.dry_run`, `totals.total_reclaimed_bytes`, and a report
   whose fields cannot be read fails the check.
7. **28-sync-strings, attempt 1** — HTML tag-stripping applied to JS source deleted every `a < b … =>` span with the
   literals inside it: nine true strings read as missing. Tags are stripped from HTML only; a must-find control joined
   the must-not-find one.

One inline closing check (`logs/26`) also broke on shell escaping after its git and port reads had printed; the rest of
it was moved into a driver (`26b`).

## R13.11 — One observation, not a defect

**Home's *The last eight runs* band draws a dry-run as the newest run as `0 B`, in the accent** (`LastRuns.tsx:139`
takes the last run's `freedBytes`) — visible in `home-replaced-1440-*-app.png` ("0 B · 17 minutes ago · 11 sections ·
safe batch"). The dummy draws the same field the same way (`wire.js:472`, `lastFreed`), but its seed has no dry-run as
the newest run, so the state is **unspecified rather than divergent**. History draws a dry-run's estimate without the
accent (`HistoryTable.tsx:59`). For the main session to judge; nothing here gates.

## R13.12 — What could not be tested, and why

- **A real cleanup run** — Reclaim pressed zero times, deliberately; every state judged is reachable without it.
  **Blocked, not failing.**
- **Google sign-in itself** — the system-browser PKCE flow (`oauth_listen_*`, the opener) would open the owner's own
  browser, so the guard refused those commands outright and the session was injected. **Blocked, not failing.**
- **The packaged build** — `tauri dev` on `localhost:5974` only; the doubled catalogue load is StrictMode's.
- **The dummy's other sync states as pairs** — `?fail=settingsRead|settingsWrite|listMore|remove`, `?pending=1|3` and
  the empty list: their words are covered by R13.6 (34/34), and TASK-013's live run rendered the settings-read and Remove
  lines against the catalogue (`site-evidence\task013-live\logs\08-failures-check-6.txt`).
- **Sweeps** (contrast, hit area, overflow) — round 10 ran them across all eleven screens; nothing since `0eb2b68`
  touches type, colour or spacing.

## R13.13 — Cleanup, each read back

- **The injected session** left through the product's own **Sign out** (`/auth/v1/logout` 204); storage read back with
  no `windowsweep:supabase-auth`, `sb-*`, `windowsweep:sync-runs` or `windowsweep:history-cloud` (`logs/21`). 🔴 The
  logical removal was not enough: LevelDB's `000003.log` in **this round's** profile still held the session's bytes, so
  that profile's `Local Storage` store was deleted — re-scan **0** hits, with a control that finds the same values in
  `sessions.json` (`logs/24`). **`round13\webview2-profile` stays: 527 files, 85.1 MB.** The owner's profile was never
  touched (R13.1d).
- **`tauri dev`**: the whole tree killed from `yarn tauri dev` (pid 18288, `/T`, 16 processes); no
  `windowsweep-desktop.exe`, no WebView2 on the round's profile; **9339 and 5974 free** (`logs/22`, `logs/23`).
- **The guard**: pid 19980 killed (`logs/23`). **The dummy's Chrome**: pid 18192, GUID matched, closed gracefully;
  **9593 free** (`logs/25`). **Other sessions untouched**: 9333 (pid 13568) and 9590 (pid 10408) still listening.
- **The repository**: `git status --porcelain` shows only the owner's PNG; `desktop/public/prepaint.js`, rewritten by
  `yarn dev`, is byte-identical (`cceabd20…`); no plant in any repository file (`logs/26`).
- **Leak scan**: 0 hits for any session token, the publishable key, or a JWT/key shape across the 200 files this round
  wrote, with a control that finds all four session values in `sessions.json` (`logs/27`). **Teardown was not run** —
  the main session runs `teardown-source.txt` after this report.
