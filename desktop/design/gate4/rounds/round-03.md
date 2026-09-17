> Round 3 of GATE 4 · part of [`GATE4-REPORT.md`](../GATE4-REPORT.md), the index of every round.

# ROUND 3 — 2026-09-07, 16:16 build · Home judged for the first time

**Build:** same path, rebuilt **16:16:32**, engine tree 39 files. **D-12 is closed**: `engine.rs` now carries
`strip_verbatim_prefix()` handling both `\\?\` and `\\?\UNC\`, and the catalogue loads.

**The premise, measured before anything was judged:** Sections renders **26 rows, ids 0-25**; Home shows no
engine error; the status bar reads `engine 1.1.0`; the rail reads `Sections 26`.

## R3.1 — the rewritten zone table

Above, in place, with both rounds' numbers and the retired instrument explained. **8 zones missing.**

## R3.2 — D-14 · Home implements 4 of the dummy's 12 bands, and none of the 8 gaps is declared · **web layer**

Corroborated from two independent directions, which is what makes it a defect rather than a data artefact:

1. **Rendered:** the eight bands above are absent from a *measured*, catalogue-loaded Home.
2. **Source:** `src/screens/Home.tsx` calls 19 `t('home.*')` keys, covering only the reclaim readout, the
   safe-run list, developer mode, the scan buttons, the assurance prose, the privacy ledger and the engine
   error. There is **no treemap component anywhere** — `src/components/` holds `Icon.tsx`, `Shell.tsx`,
   `ThemePanel.tsx` and nothing else; `grep` for `treemap|ReclaimMap` hits only `dev-engine.ts` and
   `shell.css`. `Home.tsx` contains **zero** occurrences of `sparkline`, `schedule`, `protected`,
   `needsPerson`, `need a person` or `admin`.

**So these are unimplemented, not empty.** The eight:

| missing band | the dummy line it contradicts | note |
|---|---|---|
| **the Reclaim Map** | inventory §3 zone 3, `[data-ws-map]`, *"the signature element"* | the single largest gap; it is also why `<svg><text>` is 0 |
| the drives band | zone 4, `[data-ws-drives]` | C:/D:/E: rails with free space |
| the capacity ring | zone 4, `[data-ws-ring]`, *"3.1% OF ALL DISKS"* | — |
| these need a person | zone 7, `[data-ws-needs]` — four cards, sections 17/18/19/23 | the picker's own entry point |
| protected-path chips | zone 9, `[data-ws-protected]`, *"How that is enforced"* | — |
| the last eight runs | zone 10, `[data-ws-spark]`, *"THE LAST EIGHT RUNS"* | history exists but is unrendered here |
| schedule | zone 11, beside the sparkline | — |
| sections needing admin | zone 12, *"Six sections need Windows to ask your permission first."* | — |

🔴 **None carries a `pending-wave` note on Home**, unlike the Settings *Scanning* and *Notifications* tabs,
which declare themselves correctly. §10 requires anything the app declines to ship to be declared with a
reason. **Proposed fix:** implement, or declare each on Home in the app's own UI — and amend the dummy first
if any is being dropped for good (§10a).

Two smaller divergences on bands that *are* present:

- The dummy's zone 5 is a **ladder** headed `A SAFE RUN, STEP BY STEP` with per-group totals, bars and
  *"Total a safe run would free"*. The app renders a flat **list** headed `A SAFE RUN TOUCHES THESE`.
  Different heading, different shape. **Part of D-14.**
- At 1440 the app's right-hand column holds only `DEVELOPER MODE`, leaving roughly half the band empty; the
  dummy fills it with the drives rails and the ladder. A consequence of the eight, not a separate finding.

## R3.3 — Home as a parity pair: the four verdicts

Captured in **one measured state** — scan first, then the mode switched by writing the same two attributes
the app's own single apply path writes (`data-theme`, `data-appearance`) **without a reload**. 🔴 Declared,
because `capture-app.mjs` sets the mode by reloading, and a reload discards the zustand store and with it the
scan — those captures read `not measured` and would have been compared against the dummy's measured Home.
The pre-paint path is verified separately by round 1's axis probe.

| pair | app page | verdict |
|---|---|---|
| `home-1440-light` | 1440×1401 | **defect — D-14** (web layer) |
| `home-1440-dark` | 1440×1401 | **defect — D-14** |
| `home-760-light` | 760×1665 | **defect — D-14** |
| `home-760-dark` | 760×1665 | **defect — D-14** |

All four fail for the same reason and no other: the eight missing bands. What is present matches — the title
bar and its version chip, the rail with `Sections 26`, the reclaim readout with its button trio, the
decorative sweep, developer mode with its exact sentences, the bleed assurance band verbatim, the disclosure
row and the status bar. **Words compared as text, not layout:** 296 dummy text nodes against 68 in the app,
182 dummy sentences absent, 23 app-only. Of the 182, the large majority are the eight missing bands' content
and the dummy's demo tile data (`build · 8.8 GB`, `Gradle caches 6.2 GB · 240d`, …), which is `demo-data`;
five are the dummy's own prototype chrome (`standard user`, `design dummy · demo data`, `Prototype`,
`Contents`, `Components`).

Pairs at `desktop/design/gate4/home-{1440,760}-{light,dark}-{dummy,app}.png`; round 2's are kept as
`-round2`.

## R3.4 — Home's consent ledger: **PASS**

The missing third of R2.5, now measurable. Both sides read with every `<details>` opened:

| | dummy | app |
|---|---|---|
| the four destinations named | **4/4** — Google Analytics 4, Amplitude, Microsoft Clarity, Sentry | **4/4** |
| each with an adjacent `on` badge | **4/4** | **4/4** |
| the `Never sent` paragraph | present | present |

The app's line is *"Never sent: a file path, a folder name, a drive label, your user name, your machine name,
or the contents of anything. **A run summary is a count and a number of bytes.**"* — one sentence longer than
the dummy's Home ledger, and that sentence **is** in the dummy on the Consent screen, so it is consistent
copy rather than invention. **Verdict: match.** With R2.5's Consent screen and Settings Privacy tab, all
three notice surfaces are now verified.

## R3.5 — Sections and Run re-judged · and what round 2 actually saw

🔴 **Round 2 judged both against an EMPTY catalogue, and the record says so:** its saved measurement holds
`Sections tbody rows: 0`, `Home rail sections: 0`, `engine-error state: true`. Neither was a parity
judgement.

**Sections — round 3, against real data (26 rows).** Dummy 125 text nodes, app **83**; **28** dummy
sentences absent (round 2: 80), 8 app-only. Five of the 28 are the dummy's prototype chrome. The real gaps:

| absent from the app | what it is |
|---|---|
| `Show`, `All 26`, `Needs a person`, `Deep`, `Select`, `Tier`, `Expand` | the dummy's filter chips and column controls |
| `rebuilds`, `optin`, `deep`, `config`, `interactive` | the raw tier vocabulary — the app substitutes `Everything`, `Needs administrator`, `You pick` |
| `What the four run policies mean` + `Details` + *"runs on its own."* / *"Opt-in only runs if you name it."* / *"needs an extra confirmation on top."* | the four-run-policy disclosure |
| `reclaimable across every section` | the header readout |

**Verdict: defect — D-15** (web layer): the 26-row catalogue, its ids, keys, titles and the column headings
are all correct and match; the **filter/show controls and the four-run-policy disclosure are absent, and the
tier vocabulary is substituted without the dummy being amended.**

**Run — round 3, after a dry run through the UI.** 🔴 The full flow now works end to end in the app:
`Home → Dry-run first` auto-navigates to `#/run`, which reads **`FINISHED` / `A dry-run would reclaim
310.0 MB.` / `This was a dry-run. Run the same thing without it to reclaim the space.`**, with the engine's
own log rendered — **247 lines, 235 monospace nodes**, in `.logview`. The rail updates to `310.0 MB across
11 sections`, and **`#/report` renders 11 rows** with the same heading. That closes round 2's outstanding
"prove the UI flow" item.

- `##windowsweep` lines in the log pane: **0, and correctly so.** The Rust side routes any line starting
  `##windowsweep ` to the `clean:progress` channel and everything else to `clean:log`, so the progress lines
  drive UI state rather than being printed. The per-section outcomes do appear (`10 temp  dry-run  207.6 MB`).
- 🔴 But the dummy's **`Per section`** band (`run.html:59`) and its live tiles (`What is going`, *"Tiles leave
  as each section finishes"*) are **absent** — the progress arrives and has nowhere to render. Also absent:
  `Start the safe run` / `Cancel`, `not started`, and `Drives after the run`.

**Verdict: defect — D-16** (web layer): the run executes and reports correctly; the dummy's per-section
progress surface and run controls are not implemented.

## R3.6 — What was left closed, and why

Per instruction: the nine screens round 2 closed on their own merits were **not** re-judged — Consent
(match), Elevation (match), Splash (D-13 only), Picker · History · Report · Account (declared divergences),
and the closed defects D-1…D-11. Two notes so nothing is silently carried:

- **Report** is now populated with a real dry run (11 rows) and is therefore *newly judgeable*; it was closed
  in round 2 as a `demo-data` declared divergence and is **left closed** as instructed.
- One thing observed in passing and **not** a defect: boot went to `#/consent` although the stored record read
  `answered: true`. The record shape changed with the notice rewrite — `consent.ts` now exports
  `NOTICE_STORAGE_KEY` with `{ seen, seenAt, collected }`, and `Splash.tsx:141` routes on `readNotice().seen`.
  My record was round 1's old `{ …, answered }` shape, which has no `seen`, so the notice was shown once.
  Dismissing it wrote `{"seen":true,"seenAt":"2026-09-07T12:15:37.602Z","collected":3}` and routed to `/`.
  **A real user upgrading will see the notice once more, which is defensible given the notice is new** — a
  migration note, not a defect.

## R3.7 — Can GATE 4 close?

**No — on three of the eleven screens. It can close on eight.**

| | screens | state |
|---|---|---|
| **can close** | Consent, Elevation, Picker, History, Report, Account, Splash*, Settings* | 6 clean + 2 with a single named open defect each (*Splash: D-13; Settings: D-8, D-9) |
| 🔴 **cannot close** | **Home (D-14), Sections (D-15), Run (D-16)** | the three catalogue-driven screens; each has unimplemented dummy content, none of it declared |

The blocking issue is no longer infrastructural — the engine, the bridge, the catalogue and the dry-run flow
all work. **What remains is content parity: eight Home bands, the Sections filter row and policy disclosure,
and the Run per-section surface.** Every one is web-layer work against an approved dummy, and every one must
either ship or be declared on the screen with a reason.

**Open defects after round 3:** D-8, D-9 (Settings), D-13 (Splash copy), **D-14** (Home), **D-15**
(Sections), **D-16** (Run). Closed: D-1 … D-7, D-10, D-11, D-12.

---

