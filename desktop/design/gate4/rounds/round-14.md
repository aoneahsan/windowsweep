> Round 14 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 14 — 2026-09-25, HEAD `8f3a03f`, desktop 1.3.0 · **2 DEFECTS (D-66, D-67) — both on the Settings screen and both older than the change under review.** The team-voice change itself (`8f3a03f`) is clean: the heading and note are the dummy's word for word, the roster renders the same fourteen products in the dummy's order, and the self-exclusion audit passes on both sides, the control included. Home and Account signed out still match round 13, and the version surfaces read 1.3.0.

**Scope** (owner decision D44: this round gates the `desktop-v1.3.0` tag): the Settings screen with the house-promotion
block in view, plus a Home / Account-signed-out / version regression. `git diff --stat d3475bc 8f3a03f -- desktop` lists
seven files: the product change is `account.json` (`settings.promoTitle`, `settings.promoNote`) and `ecosystem.ts`
(`OFF_ROSTER`), the dummy moved first in `page-settings.js`, and the rest are records (`AMENDMENTS-2.md`, the inventory
ledger, and round 13's own `round-13.md` + `GATE4-REPORT.md` row). **HEAD moved during the round** to `bd1b7cd`, a docs
commit ("the product speaks as the windowsweep team"); `git diff --name-only 8f3a03f..HEAD -- desktop` is **empty**
(`logs/27`), so the verdict holds at `bd1b7cd`. `git status --porcelain` at the end: only the owner's untracked
`assets/logo/windowsweep-mark.png` (the main session's uncommitted README/docs edits at the start were committed in
`bd1b7cd`, not by this round).

**Build and method — exactly round 13's:** `yarn tauri dev` from `desktop/` (Vite 8.2.2 on 5974, `windowsweep-desktop
v1.3.0`, dev profile) with `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9339` and
`WEBVIEW2_USER_DATA_FOLDER=…\gate4-evidence\round14\webview2-profile`. **Dummy:** Chrome for Testing 151.0.7922.77,
profile `ahsan-automation-windowsweep-r14`, port 9594, pid 23476, proved from the OS process table before the first
navigation (`logs/07`). **Signed out throughout; no identity created, none injected** (`logs/21`: no session key ever in
the profile). **Pairs:** Settings About, Home, Account signed out — each at 1440/760 × light/dark, lime: **12 pairs, 24
captures** in `gate4-evidence\round14\pairs\`, words diffed per pair. The app's mode is flipped at runtime and restored;
the dummy's is its own URL override. **12 drivers** (`round14\NN-*-source.txt`, round 13's with path, port and token
substitutions), every one's stdout in `round14\logs\`, the two superseded attempts kept under `attempt1-…` names.

---

## R14.1 — Safety

| check | result |
|---|---|
| **profile isolation**, before anything else (`logs/05`) | all 6 `msedgewebview2.exe` of this round's app on `…\round14\webview2-profile\EBWebView`; the folder populated (340 files); the owner's `EBWebView` **1,315 files, newest write 2026-09-17T17:51:13.737Z** — identical at preflight, after launch and at the end (`logs/26b`); the window started on `#/consent` with no `windowsweep:*` key |
| **the two-wire guard** (`logs/04`, `logs/06`), round 12's R12.1 method via round 13's v5 | predicate 25/25 before any browser; attached to the window while it was still `about:blank`, so even the first catalogue load passed through it; **wire 2** token refused by the wrapper, control reached Rust; **wire 1** token refused by the fulfil, control reached Rust (`Command gate4_r14_probe not found`); no postMessage retry after a fulfil; still installed and still refusing at the end (`logs/20`). `__TAURI_INTERNALS__.invoke` read, never assigned |
| **the first press** | Consent's *Continue* at 13:16:02.697Z, after the proof (13:15:4x) |
| **every engine invocation** | **8, every one `--list --json`** — two per boot × four boots (launch, the proof's reload, and the two Splash boots of `logs/10`). **Reclaim pressed 0 times; neither Scan nor Dry-run first was pressed.** Refusals: 2, both probe tokens |
| **run folders** | 290 before, 298 after: **8 new — one per invocation, all empty — 0 gone, 0 reports** |
| **C: free** | 85.58 GB before, 85.57 GB after (−13.3 MB; this round's own writes 8.2 MB, the dummy Chrome's profile) |

## R14.2 — The verdict table

| item | verdict | evidence |
|---|---|---|
| **the house-promotion heading and note** | **match, word for word** — "More from the same team" / "These are the team’s own tools, not an advertising network – nothing here is sold, tracked or third-party, and windowsweep never appears in its own list." | `settings-about-*`, `logs/09-pair-settings-about` |
| **the roster** | **match** — **14 cards** on each side, the same names **in the same order** with the same taglines: Video Controls Plus · ZTools · ClearHire · LifeWell · LabFlow · PregnancyPal · SMS App · Native Update · FilesHub · HabitForge · TrizLink · linux-cleanup · macleanup · Strata Storage. **No "Meet the Developer", no windowsweep.** | `logs/10` |
| **the vendored sixteen and `OFF_ROSTER`** | **match** — 16 rows, every id and name in order, in the app's shipped module and the dummy's source; `OFF_ROSTER = ["aoneahsan-portfolio"]` on both, its row still in `ROSTER_SOURCE`; the rendered order is `ROSTER_SOURCE` minus windowsweep and the portfolio entry | `logs/10`, `logs/10b` |
| **the self-exclusion audit — both layers, the control** | **pass, identical on both sides** — the app's own `promoAudit()` (run from the module the window imports) and the dummy's `window.wsPromoAudit()`: both layers 14 · layer 1 only 14 · layer 2 only 15 · **neither layer 16 and self-promoted — the control comes back present**. The comparator went red on two plants (a swapped pair, a planted "Meet the Developer") | `logs/10` |
| **the rest of the About tab** | **D-67** (R14.4) | `settings-about-*` |
| **the Settings status bar** | **D-66** (R14.3) | `logs/11`, `settings-about-1440-*` |
| **Home, signed out** | **match — round 13's verdict holds**: 149 shared units; residue only `live-number` (drives, the engine's own protected paths) and the two carried-forward items ("Six"/"6", the *Never sent* sentence) | `home-signed-out-*` |
| **Account, signed out** | **match — 43 / 43 word units identical** | `account-signed-out-*` |
| **version surfaces** | **`1.3.0` / `engine 1.3.0`** on the title-bar chip and status bar; About's line reads `Desktop 1.3.0 · engine 1.3.0 · MIT` (the dummy's `0.1.0-design` / `1.1.0` is its standing `live-number` exemption) | `logs/08`, `settings-about-*` |
| D-64, re-read on the fresh session | holds — 11 rows "not measured", sub-line `0 of 11 sections · not started` | `logs/08` |

**Settled, not findings:** the Version row's **"up to date"** badge is live state — the app draws it (the dummy's own
words, `settings.versionUpToDate`) once Splash's update check answers `none` (`Splash.tsx:111-126`). The first capture
lacked it because the guard proof's reload landed on `#/consent`, which never passes Splash; booted through `#/` →
Splash, the live store read `updateOutcome = none` and the badge rendered (`logs/10`), and the pair was re-captured
(first capture kept as `09-pair-settings-about.attempt1-no-splash-no-badge.txt`). **windowsweep's own row** carries the
fleet roster's tagline in the app and a placeholder in the dummy ("This app. It must never appear in its own promotion
list.") — **never rendered on either side**; my first roster check compared that cell and was corrected
(`10-roster-audit.attempt1-self-row-tagline.txt`, `logs/10b`).

## R14.3 — D-66 · the Settings status-bar note is still withheld, and the reason it was withheld has expired

- **Dummy:** *"settings sync when you are signed in"* — `settings.html:64` (`.only-wide`, so it shows at 1440 and hides
  at 760).
- **App:** none. The status bar reads only `engine 1.3.0`; `Shell.tsx:233` `FIXED_NOTES` maps `/history`, `/report`,
  `/picker`, `/account` and `/consent`, and no catalogue key carries the sentence (`logs/11`: at 1440 the dummy reads
  `engine · 1.1.0 · settings sync when you are signed in · storage: localStorage`, the app `engine 1.3.0`; at 760 they
  agree).
- **Why it is open again:** round 7 filed it as D-35; round 8 declared it `pending-wave` under `AMENDMENTS.md:305`, which
  withheld it (with Account's *"What happens when two machines disagree"*) because *"nothing in the window syncs yet …
  They arrive with the sync wiring, or the dummy withdraws them — the main session's call."* TASK-013 shipped the wiring
  (DONE-016, verified live), Account's half arrived with it (round 13, `account-signed-in-*`), and settings do sync when
  signed in — the sentence is now true of this build. This half did not arrive and the dummy did not withdraw it.
- **Shots:** `settings-about-1440-light-app.png` / `-dummy.png` (and `-dark-`), the status bar at the foot.
- **Resolution** is the main session's, as the amendment says: ship the note (a catalogue key + a `FIXED_NOTES` row for
  `/settings`), or withdraw it from the dummy first.

## R14.4 — D-67 · the app's About tab carries a panel the dummy does not have

- **App** (`SettingsAbout.tsx:100-125`; `account.json:36-38`): a panel between the version note and the promotion block —
  *"windowsweep reclaims disk space on Windows. It names every path before it touches one, and refuses your documents,
  credentials and browser state outright. The desktop window drives the same engine the command-line tool runs."* with
  two buttons, **Source** and **Support this work** (each hands a URL to the system browser).
- **Dummy** (`page-settings.js:281` `about()`): the Version row, the version line and its note, then *More from the same
  team* and the cards — **no panel, no paragraph, no buttons**. None of the three strings occurs anywhere under
  `desktop/design/`, so no amendment or ledger row declares it.
- **History:** built with the app's remaining screens (`8593cd3`) and touched in `7e78de7`; no round from 7 to 13 judged
  the About tab's words — round 1a's D-9 (the roster missing) is the last About-tab ruling. **Not introduced by
  `8f3a03f`.**
- **Shots:** `settings-about-1440-light-app.png` / `-dummy.png`, `settings-about-760-dark-app.png` / `-dummy.png`.
- **Resolution:** the dummy owns the words (IRON rule 12) — write the panel into `page-settings.js` first if it stays, or
  remove it from the app; either way the main session's call.

## R14.5 — What could not be tested, and why

- **Pressing Source and Support this work** — each hands a URL to the owner's own browser, so the guard refuses
  `plugin:opener|*` outright; their words are judged, their behaviour is not. **Blocked, not failing.**
- **The other four Settings tabs** — untouched by `8f3a03f`; round 8 judged them *match + declared*. D-66's status bar
  is the same on every tab.
- **Signed-in Settings** — not needed (the block renders signed out); no identity was created.
- **The packaged build** — `tauri dev` only.

## R14.6 — Cleanup, each read back

- **`tauri dev`**: the tree killed from `yarn tauri dev` (pid 20204, `/T`, 16 processes — the 5974 listener 6276 shown to
  descend from it first); no `windowsweep-desktop.exe`, no WebView2 on the round's profile; **9339 and 5974 free**
  (`logs/22`, `logs/23`).
- **The guard**: pid 18748 killed. **The dummy's Chrome**: pid 23476, GUID matched, closed gracefully, **9594 free**
  (`logs/25`). **9333** — another session's Chrome, started during the round (pid 17484) — never touched.
- **The profiles**: no session was ever in this round's profile; `round14\webview2-profile` stays at **509 files,
  83.9 MB**; the owner's profile untouched (R14.1).
- **The repository**: only the owner's PNG untracked; `desktop/public/prepaint.js`, rewritten by `yarn dev`,
  byte-identical (`cceabd20…`); no plant in any file. **Leak scan**: 0 hits across the 69 files this round wrote, with a
  control that finds the publishable key in `desktop/.env` (`logs/28`).
