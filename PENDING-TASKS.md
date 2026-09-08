# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-07

### TASK-004 - the elevated run has three gaps, all found by the 2026-09-07 fact-check

The Elevation screen works and is not broken, but three things it implies are not true. Found while
fact-checking the `desktop-readme` surface; the copy was corrected so nothing false shipped, and the code
was left for its own task.

**1. Nothing tails the elevated child's log.** `readReport()` at `desktop/src/lib/engine.ts:179` has **no
caller anywhere** in `desktop/src`. The elevated child runs in its own console window (`lib/safety.ps1`
relaunches with `-Verb RunAs -Wait`), so its output never reaches the parent's stderr. The dummy's
`elevation.html` says the unelevated window "tails the log"; the draft's sentence was cut to "waits
unelevated" instead. **To do:** read the child's own report and log from the run folder
(`%LOCALAPPDATA%\com.aoneahsan.windowsweep\runs\<id>\`) and stream it into the Run screen's log pane -
`readReport` already exists for exactly this and has been dead code since it was written. Then restore the
dummy's wording, dummy first.

**2. Sections 15, 16 and 20 are refused on every elevated run.** `elevatedArgs()` at `engine.ts:172` builds
`['--only', ids, '--elevate', '--yes']` and never passes `--i-understand-deep`, which IS in the Rust
allowlist (`engine.rs:39`). `modules/runner.ps1:89-92` refuses any `Batch = 'deep'` section without it - 11,
15, 16 and 20. So the screen offers six admin sections and can only run three. The refusals do reach the
report, so the user is told; nothing is silent. 🔴 **This is not a straightforward "add the flag" fix** -
`--i-understand-deep` authorises irreversible, system-changing work, and the app adding it on the user's
behalf is a decision, not a default. Needs a dummy amendment naming the gate, and probably an explicit
per-section confirmation.

**3. It runs all six at once.** `elevation.lede` implies choosing ("ask for one"); the screen passes every
admin id. Either the copy or the screen is wrong, and the dummy decides which.

A number is never reused: the next task is TASK-011.

### TASK-005 - the consent notice promises analytics events that do not exist

🔴 **Not a 1.1.0 problem and it must not be treated as one:** no telemetry key is configured in that build,
so nothing is collected at all. It becomes a live inaccuracy the day a GA4 or Amplitude key lands - owner
row 16, three of whose four keys have already arrived.

`consent.provider.ga4.what` promises "Which screens you opened and which buttons you pressed" and
`consent.provider.amplitude.what` promises "The same events, kept longer". The only `track()` callers in the
whole tree are three updater events in `desktop/src/lib/updater.ts`. There is no screen-view event and no
button event, `send_page_view: false`, and Amplitude's `autocapture: false`. So GA4 would receive
`update.check.*` plus gtag's automatic session events, and nothing the sentence describes.

**To do, before any GA4 or Amplitude key reaches a build:** either emit the events the notice describes - a
route-change event and a button event, fanned out inside `track()` and never at the call sites - or amend the
dummy's `consent.html` and Home's ledger to describe what is actually sent, then match `en.json`. The dummy
owns the words, so it changes first either way.

⚠️ A second, separate claim in the same panel is **unverifiable rather than wrong**: Amplitude "kept longer"
is a vendor-retention statement with no source in this repository. `desktop-safety` raised it as a
`NEEDS DECISION` on 2026-09-05 and the decision log records no answer. It needs the owner, not a code change.

A number is never reused: the next task is TASK-011.

### TASK-006 - the catalogue's punctuation drifts from the dummy's, tree-wide

The click dummy uses U+2013 and U+2014 where a dash is meant; the app's catalogue strings mostly use ASCII
hyphens. Found while closing D-14/15/16 on 2026-09-07, and **deliberately not swept then**: only the keys
inside those three defects were corrected, because a half-swept punctuation pass is worse than either end -
it leaves no way to tell a deliberate ASCII hyphen from a missed one.

**Why it is not urgent:** nothing breaks and no claim is false. It is a parity difference a GATE 4 pair can
legitimately flag as a mismatch on a screen nobody has changed.

**What to do:** one sweep across every `en.json` value against the dummy's source characters, in a commit
that does nothing else. 🔴 **Never sed it** - the engine's own console strings are ASCII-only by IRON rule 1,
so a global replace that reaches `lib/` or `modules/` breaks the ASCII self-test check. Scope the sweep to
`desktop/src/i18n/locales/` and prove it with the self-test still green.

A number is never reused: the next task is TASK-011.

### TASK-007 - `selbar-note` is styled nowhere, and `Picker.tsx` uses it

The class `selbar-note` appears in neither the app's CSS nor the dummy's, and `desktop/src/screens/Picker.tsx`
renders a note with it - so that note has no styling today. Found 2026-09-07 while building the Sections
selection bar, which is why the new `SectionSelbar.tsx` deliberately does **not** use it.

This is the same family as the `logpane` defect: a class name that reads as intentional, resolves to nothing,
and is invisible to every gate because unknown CSS classes are not an error anywhere.

**What to do:** decide whether the note wants the dummy's existing note treatment or its own rule, add it to
the dummy first, then the app. And sweep for siblings - `grep` every `className` string in `desktop/src`
against the selectors that actually exist in the app's CSS. That sweep is the valuable half of this task.

### TASK-009 - the reclaim map has 28 unlabelled tab stops, and `role="img"` is why

**Decided 2026-09-08, under the agent's design authority; not an owner question.**

`reclaim-map.js` sets `role="img"` on the `<svg>` **and** `tabindex="0" role="button"` with an `aria-label`
on every tile. `role="img"` makes the subtree **presentational**, so all 28 accessible names are computed and
then discarded while all 28 tab stops remain. Measured on the rendered page: **28 of the 58 focusable stops
on Home, 48% of the page, are inside the map** and announce roughly nothing. That is the cost of both
approaches with the benefit of neither.

**The decision:** the map becomes **one** stop - `role="img"` kept, with its summary `aria-label`, and
`tabindex="-1"` on the tiles - and **exclusion moves to the table rows**. `ReclaimMapTable` already carries
the same data as a real `<table>` with the `Idle (days)` column, and the app's own source calls it *"the
primary accessible representation, not a consolation prize"*. This keeps the drawn encoding for sighted users
and gives everyone else labelled, ordered controls.

🔴 **Dummy first.** `desktop/design/windowsweep-click-dummy/reclaim-map.js:207-215` is amended with the
reason written into `desktop/design/README.md` beside it, and only then does the app follow - the table needs
a per-row toggle it does not have yet, so this is real work and not an attribute change.

**Found while:** closing GATE 4 parity for wave 4b by reading the rendered DOM.

A number is never reused: the next task is TASK-011.

### TASK-010 - the 17px section switches are a pointer problem, and `.btn-sm` is not

**Decided 2026-09-08, under the agent's design authority; not an owner question.**

`.btn-sm` computes to **28px** against the fleet's 44px floor. It is **byte-identical to the dummy's own
rule**, and every other control class was checked and matches too - so the app implements the approved spec
exactly and this is not a parity defect.

**The decision on `.btn-sm`: leave it.** 44px is a **touch** floor. This window is desktop-only
(`minWidth: 760`), mouse and keyboard, with no touch input, and changing it in the app alone would *create* a
divergence from the dummy.

**The decision on the switches: raise them.** `.switch` measures **17px**, and there are 19 on the Sections
screen. That is small for a **pointer** target regardless of touch, which is a different argument from the
one that lets `.btn-sm` stand. Raise the **hit area** rather than the visual size, so the control looks as
approved and is easier to hit - dummy first, then the app.

**Found while:** the same GATE 4 parity pass.

🔴 **This line said TASK-008 in all FOUR places it appears, and `DONE-008` has existed in
`docs/DONE-TASKS.md` since 2026-09-08.** Every copy would have handed the next session a number already
spent - which is the exact precedent the rule cites. All four are corrected. A number is never reused: the
next task is **TASK-011**.
