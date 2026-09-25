> Section 14 of the click dummy inventory · part of [`CLICK-DUMMY-INVENTORY.md`](CLICK-DUMMY-INVENTORY.md), the index.

# Click dummy inventory - GATE 4 round five

Last Updated: 2026-09-25 · Moved here verbatim from the index under RW-132.

---

## 14. GATE 4 round five — 2026-09-07, the 19:09 build: ten of eleven close

D-17 and D-19 are fixed. **Home closes.** **Run does not**, on one new defect. Detail:
`desktop/design/gate4/GATE4-REPORT.md` §R5. Round-four captures at `gate4-evidence\round4\`.

### The 4 GB that was not a discrepancy

Home's hero reads **59.3 GB** where the engine's own `--scan` reports **63,721,958,621 bytes**, and the ladder
reads **39.3 GB** where the safe-batch subset computes to **42,185,474,589**. Neither is wrong:

| | bytes | / 10^9 | **/ 2^30** | shown |
|---|---|---|---|---|
| total | 63,721,958,621 | 63.7 | **59.3** | 59.3 GB |
| safe batch | 42,185,474,589 | 42.2 | **39.3** | 39.3 GB |

Both are exact at 2^30, and 🔴 **it is the ENGINE's own convention** - it rendered 3,935,340,633 bytes as
`"3.7 GB"`. Engine, dummy and app agree; the label reads GB where the divisor is binary. **Before reporting a
number as wrong, divide it both ways.** Confirmed as asked: the ladder is the only surface that differs from
the other five, and it differs by exactly the safe-batch subset - computed from `targets[]`, not trusted.

### 🔴 A fix that reached two of its three call sites

D-17 was one bug computed twice, in `Home.tsx` and `Shell.tsx`, and it was correctly moved into one place.
**The Run screen was the third consumer and was not changed.** The engine reports `section: -1` for the
`--scan` pseudo-step and `sections[]` therefore carries one entry:

```
mode: scan   sections[]: [{"section":-1,"status":"ran","freed_bytes":0}]
```

Run consumes that as a finished cleanup, so after nothing but a **read-only scan** it says **`FINISHED` /
`Reclaimed 0 B.`** and its Per section band renders a row reading **`-1 · -1 · ran · 0 B`** - the sentinel
leaking as both a badge and a section name. The dummy's idle Run says `Ready to run` / `not started` /
`idle - press "Start the safe run"`, and **neither of the app's two idle states uses those words**.
**When a duplicated computation is centralised, enumerate every consumer** - the third one is where the bug
survives, and it survives looking fixed.

### The measurement that replaced a belief

Whether showing the draining band at idle matches the dummy was a judgement nobody had measured. Both sides
were read in their idle state:

| | tiles | labels |
|---|---|---|
| dummy default `run.html` | **73** | 54 |
| app, idle | **189** | 23 |

**Both render the map unconditionally, so the app matches.** The draining semantics are simply invisible at
idle because no section has started.

### Two instrument guards worth keeping

🔴 **A whitespace regex can collapse to a literal `s`** when shell and heredoc layers eat backslashes, and the
symptom is output reading `not mea ured`. Every pattern now lives inside `String.raw` in a written file, and a
**self-check runs first** - `'not   measured'` must normalise to `'not measured'` with its `s` intact, or the
script refuses to run.

🔴 **Compare rendered text case-insensitively.** `.caps` applies `text-transform: uppercase` and `innerText`
reflects what is painted, so `What is going` reads back as `WHAT IS GOING` and a case-sensitive check reports
a present structure as missing.

### Where the gate stands

**Ten of eleven close.** Home joins the closed set - twelve bands, eight built and four declared, the
declarations visible and correctly worded, and the numbers now coherent across five surfaces. Its remaining
D-18 items are undeclared minors, the same standing on which Sections closed. **Run is the last screen**, on
D-20 - one discrimination, in one place, of a class already solved once.
