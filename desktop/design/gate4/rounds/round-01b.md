> Round 1 of GATE 4, part b (§5-§10) · continued from [`round-01a.md`](round-01a.md) · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

## 5. The dummy-parity probe (§10) — 10 of 10 axes match, and the gate was watched failing

The dummy's defaults are **parsed out of `app.js`'s own `AXES` table** at run time — nothing is restated,
because a restated copy is what drifts.

| axis | attribute | dummy default (parsed) | app live `<html>` | verdict |
|---|---|---|---|---|
| theme | `data-theme` | dark | dark | match |
| palette | `data-palette` | lime | lime | match |
| radius | `data-radius` | medium | medium | match |
| density | `data-density` | comfortable | comfortable | match |
| typeScale | `data-type-scale` | medium | medium | match |
| font | `data-font` | grotesque | grotesque | match |
| surfaceStyle | `data-surface-style` | solid | solid | match |
| cursor | `data-cursor` | custom | custom | match |
| motion | `data-motion` | system | system | match |
| sound | `data-sound` | off | off | match |

**declared 10 · written to `<html>` 10 · absent 0 · present-but-different 0.** The full attribute set is
**byte-identical at 1440, 760 and 390**, so the axis probe is genuinely width-independent rather than assumed
to be. `data-appearance=dark` and `style="color-scheme: dark"` are both written pre-paint.

**Two plants, on the two different arms, each verified applied before its result was read:**

| plant | applied? | result |
|---|---|---|
| **parse arm** — a mutated **copy** of `app.js` with `density` default `comfortable`→`spacious` (the real dummy untouched, byte-identical after) | yes: needle matched, copy differs, `def: 'spacious'` present | **CAUGHT** — `density: dummy=spacious app=comfortable` |
| **live arm** — `data-radius` removed from the running `<html>` | yes: `had=true was=medium nowHas=false` | **CAUGHT** — `radius (data-radius)` reported declared-but-not-written |

Restored by reload: `data-radius=medium`, 14 attributes.

⚠️ One noted divergence, **not** a defect: the dummy's prefs key parses as `prefs` under its own
`windowsweep.dummy.v1` namespace; the app's is `windowsweep:prefs`. Prototype-class, by design.

---

## 6. The seven flows

Every flow ran as the **local Windows user `PC`, unelevated, with no account signed in** — there is no admin
role in this product and sign-in is dormant, so no flow could have been run as an admin.

| # | flow | result |
|---|---|---|
| 1 | First run → consent → **decline** → Home; relaunch keeps the answer | **PASS with a finding.** State was genuinely fresh (`%LOCALAPPDATA%\com.aoneahsan.windowsweep` did not exist; `localStorage` empty — nothing was cleared to fake it). 🔴 The consent screen is **not** shown on a fresh boot (D-5); reached at `#/consent` it works. Decline (`Continue with everything off`) → `#/` with `{"ga4":false,"amplitude":false,"clarity":false,"sentry":false,"answered":true,…}`. After a real quit and relaunch the record is still there, read from the physical key. Both buttons measured equal weight (D-4). |
| 2 | Consent proven by the **network**, not a flag | **PASS.** `Network` was enabled before the page was allowed to run (`Target.setAutoAttach` + `waitForDebuggerOnStart`), so boot requests could not be missed. Session 1: 31 events. Session 2: 89 events. Hosts observed, in total: `tauri.localhost` (80), `ipc.localhost` (34), one `data:` URI ×6. **Zero requests to any analytics, telemetry, Sentry or Supabase host at any point**, and zero WebSockets. |
| 3 | Dry run of the safe batch → Report; report records `dry_run: true` | **PART FAIL (D-1/D-2), engine half PASS.** Through the app: 214 error lines, no summary, no report file, **`exit_code 0`** (see the note below). Re-run through the app's exact spawn with a non-verbatim path: `dry_run:true`, `elevated:false`, `developer:true`, `estimated_bytes: 3,935,340,633`, sections `[0,1,2,3,5,6,7,8,9,10,21]` all `dry-run`, `refusals: []`, **22 `##windowsweep` progress lines**. Report file `meta.dry_run = True`, `meta.elevated = False`, `meta.launcher = desktop`. |
| 4 | 🔴 **ONE REAL RUN**, owner-authorised | **PASS (engine path).** `--all --yes --developer`, unelevated, no interactive section, no admin section, `--elevate` never passed. `freed_bytes` **3,924,712,402** (3.655 GiB) in **156 s**; 11 sections all `ran`; **`refusals: []`**; **no new crash bundle** under `~\.windowsweep\feedback` (only the pre-existing `debug-bundle-2026-09-03_015000.zip`). C: free **before 5,843,419,136** (5.442 GiB) → **after 9,849,925,632** (9.173 GiB), **delta +4,006,506,496** (+3.731 GiB); the report's own disk block agrees (5,840,351,232 → 9,848,250,368). The delta exceeds `freed_bytes` by 81.8 MB, which is other processes writing to C: across a 2m37s window. |
| 5 | The picker, against a created fixture | **UI blocked by design; engine half PASS.** `gate4-fixture\oldproj\` with `package.json` + `node_modules\left-pad\index.js`, all mtimes 2026-01-01. Discovery offered exactly one candidate: `…\oldproj\node_modules`, 209 B, **idle 249d**. `--select-file matched 1 of 1 candidate(s)` → `[scripted selection] … - yes` → `removed 209 B`. **Gone** (4 dirs → 2, 5 files → 3) and **nothing else touched**: `keep-me.txt`, `package.json`, `src\index.js` all byte-identical by SHA-256. The **picker UI** cannot do this: its Remove button is deliberately disabled and the gap is stated on screen, because no Rust command writes the select file. |
| 6 | Settings round-trip across a quit | **PASS.** Three axes changed through the real controls and one preference toggled, then a real quit and relaunch. Read back from the **physical** keys: `windowsweep:prefs = {"v":{"radius":"large","density":"compact","typeScale":"large"}}` and `windowsweep:developer = {"v":true}`; the live `<html>` shows `data-radius=large data-density=compact data-type-scale=large` (written pre-paint), and the switch renders `aria-checked=true` with its own caption `On. Toolchain caches are offered.` |
| 7 | Keyboard and motion | **PASS on both, with D-11 corroborated.** 159 tab stops across 11 screens using real `Input.dispatchKeyEvent` (only a genuine key press makes `:focus-visible` match): **0 stops without a visible indicator**; **36 stops landing on something invisible — all of them the four 0×0 title-bar buttons on the 9 shell routes**. Motion, six cells, all correct: axis `system` + OS no-pref → `--mo 1`; `system` + OS reduce → `.001`; `reduced` + either → `.001`; **`full` + OS reduce → `1`**, so the explicit axis correctly overrides the OS. |

🔴 **A note on flow 3's `exit_code 0`.** When the engine fails to load its own libraries, `run_clean` still
returns **exit 0** with an empty stdout, so the app would read it as "the run happened, only its summary was
unreadable" — which is what `engine.ts:120-125` is written to assume. Worth a look alongside D-1/D-2:
a run that produced no report should not present as a successful one.

🔴 **What flows 3-5 do and do not prove.** The app's own button path cannot start a run in this build, so the
three lines of TypeScript that assemble the IPC payload were bypassed and **everything after them was
exercised for real** — the allowlist, the spawn, the bundled engine, the `clean:log` and `clean:progress`
channels, the report file on disk. The UI's progress and report rendering is **not** verified, because it
cannot be reached.

---

## 7. The measurable sweeps

44 combinations (11 screens × 2 widths × light and dark), **1,188 text nodes**.

| check | result |
|---|---|
| horizontal overflow on the body | **0** combinations |
| user-visible text below 12px | **0** |
| contrast, WCAG AA, size- and weight-aware | **0 failures** |
| focusable controls inside a hidden container | **0** |
| `vite-error-overlay` (asked for by name, shadow root) | **0** |
| runtime exceptions | **0** |

🔴 **This clean result answers a much narrower question than it looks like.** The previous recorded pass
measured **10,684** text nodes; this one measured **1,188**, and **0 of them are SVG text**. Because of
D-1/D-2 the treemap, the section table, the report table, the candidate list and the capacity ring never
painted — and those dense, colour-heavy surfaces are exactly where every previously recorded contrast and
type defect lived. **The SVG count of 0 is itself the proof that the signature element never rendered.**
Re-run this sweep once D-1/D-2 are fixed; today it clears only the empty-state chrome.

**Both gates watched failing, on two different plants, each verified applied first:**

| plant | verification that it applied | result |
|---|---|---|
| **A — contrast:** inline `#c9cfc2` on the Sections lede (light / lime / 1440) | computed colour changed `oklch(0.462 0.015 128)` → `rgb(201, 207, 194)` | 0 → 1 failure: **`1.48:1 (needs 4.5) at 17.1px "The catalogue is a frozen public contract - "`** |
| **B — type floor:** a 9px paragraph appended on Settings (light / lime / 1440) | computed `font-size: 9px` with a real `1203x14` box | 0 → 1: **`9px "planted nine pixel paragraph"`** |

Restored by reload and re-measured: Sections contrast failures back to 0, Settings tiny-text back to 0, the
planted node gone.

**Traps the instrument is built against**, all four previously recorded on this codebase: colours normalised
through a canvas and compared as **pixels** (Chrome returns `oklch()`, so an `rgba()` regex counts zero and
passes vacuously) · SVG text read from **`fill`**, not `color` · `vite-error-overlay` requested **by name**
because a text walk cannot enter a shadow root · the probe canvas cleared to **transparent** between
measurements.

---

## 8. Build gates on `dist/`

Measured against `dist/` as rebuilt at **14:33** — ⚠️ it is a moving target while another writer works; two
JS chunks appeared between two consecutive listings.

| needle | count | reading |
|---|---|---|
| `__wsTestAuth` / `__lwTestAuth` / `__hfTestAuth` | 0 / 0 / 0 | no DEV auth hook exists in this project or its output |
| `dev-engine`, `isDevFallback`, `not the real engine` | 0, 0, 0 | the DEV-only stand-in module is genuinely out of the bundle |
| `devRun` | **2** | 🔴 a **false alarm** — see below |
| controls `run_clean` / `windowsweep` / `tauri` | 2 / 24 / 23 | the grep works; a zero above is not vacuous |
| `*.map` files, `sourceMappingURL` | 0, 0 | source maps off, as required |

🔴 **`devRun` is a name-only false positive, and it is worth recording** because the project's own gate is
written around this string. The shipped gate collapsed exactly as intended —
`async function Rp(){return null}` — so the two `devRun` hits are property accesses on a value that is always
`null`, and the module's four distinctive strings are all absent. **The authoritative check is the module's
own strings plus the collapsed gate, not the identifier.**

---

## 9. What could not be tested, and why

| item | reason |
|---|---|
| Home's 14 zones, the Reclaim Map, the section table, the report table, the candidate list, the capacity ring | **blocked by D-1/D-2** — never rendered |
| The Run screen's live progress, and the Report screen against a real run | same; the channels themselves were verified on the wire (22 progress lines) |
| The picker's UI selection path | **blocked by design** — declared `pending-wave` in the app's own UI |
| Sign-in, sync, account deletion | **dormant by owner decision** — no Supabase keys, Google provider not enabled |
| Telemetry actually reaching a destination | no keys in this build; the correct observation is the **zero** requests recorded in flow 2 |
| The Splash update gate | **owned by another writer, in flight**; landed in `src/` at 14:31, after the 13:46 build |
| Elevated / admin sections (12, 13), and every interactive section other than 17 | outside the authorised scope; `--elevate` never passed |
| 390px | below `minWidth: 760`; the axis-attribute probe was taken there and is width-independent |
| The contrast and type sweep over dense data surfaces | see §7 — re-run after D-1/D-2 |

---

## 10. Reproducing this

Both browsers were driven over the DevTools Protocol from Node 24's built-in `WebSocket`. Headless Chrome is
broken on this machine (GPU crash), so the dummy side ran **headed**.

- Automation Chrome: `$CHROME_WS_BROWSER` (Chrome for Testing 151.0.7922.77) on
  `--user-data-dir=…\ahsan-automation\profiles\ahsan-automation`, port 9222. **Profile asserted before the
  first navigation** and read from the OS process table, because `Browser.getBrowserCommandLine` refuses
  without `--enable-automation` and a check that cannot read anything reads exactly like a check that found
  nothing wrong. The owner's own Chrome (`C:\Program Files\Google\Chrome`) was running throughout and was
  never touched.
- The app: launched with `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS=--remote-debugging-port=9333`.
- Scripts: `D:\work\windowsweep-root\gate4-evidence\tools\` (28 files) · logs: `…\logs\` (68 files).
- 🔴 **A full-page capture of these screens is not the document.** Both the dummy and the app are app-shell
  layouts where `document.scrollHeight === innerHeight` and `main.content` scrolls. A naive full-page
  screenshot silently returns **only the fold** — measured on the dummy Home at 1440, where `main.content`
  held **3205px** inside an **832px** box. The captures here grow the viewport until the shell scroller has
  nothing left, re-measuring each time.
- The dummy's review toolbar (`demo.js`, which says in its own header that it is *"not part of the
  specification"*) is hidden before every capture — 2 nodes per page, declared rather than silent.

### The six pairs beside this file

`home-1440-{light,dark}-{dummy,app}.png` · `consent-1440-{light,dark}-{dummy,app}.png` ·
`settings-1440-{light,dark}-{dummy,app}.png` — all ≤300 KB.

Four needed a **0.52** downscale to fit. ⚠️ Measured, because it is not obvious: re-encoding at 0.88 made the
PNG **larger** than the original (625 KB vs 395 KB) — bicubic resampling introduces colours that defeat PNG
filtering — and 0.76 (515 KB) and 0.64 (417 KB) were also larger. 0.52 (749×1174, 289 KB) is the first scale
that fits. **The full-resolution pair for every one of the 44 is in `gate4-evidence\`.**

---

**Bottom line.** The shell, the bundled engine, the theme system, consent, persistence, keyboard access and
motion are all in good order and independently verified. The product is nevertheless **not usable in this
installed build**: two one-line defects at the IPC boundary (D-1, D-2) stop the engine being reachable at
all, and until they are fixed the majority of GATE 4 cannot be judged. D-11 is already fixed in source and
needs only a rebuild. D-3, D-4, D-8, D-9 and D-10 are parity and copy work; **D-10 is a false statement
shipping in both the dummy and the app.**


---

