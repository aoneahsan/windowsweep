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

A number is never reused: the next task is TASK-008.

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

A number is never reused: the next task is TASK-008.

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

A number is never reused: the next task is TASK-008.

### TASK-007 - `selbar-note` is styled nowhere, and `Picker.tsx` uses it

The class `selbar-note` appears in neither the app's CSS nor the dummy's, and `desktop/src/screens/Picker.tsx`
renders a note with it - so that note has no styling today. Found 2026-09-07 while building the Sections
selection bar, which is why the new `SectionSelbar.tsx` deliberately does **not** use it.

This is the same family as the `logpane` defect: a class name that reads as intentional, resolves to nothing,
and is invisible to every gate because unknown CSS classes are not an error anywhere.

**What to do:** decide whether the note wants the dummy's existing note treatment or its own rule, add it to
the dummy first, then the app. And sweep for siblings - `grep` every `className` string in `desktop/src`
against the selectors that actually exist in the app's CSS. That sweep is the valuable half of this task.

A number is never reused: the next task is TASK-008.
