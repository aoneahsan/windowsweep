# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-07

### TASK-003 - 36 of 37 files pinned to CRLF are LF in this working tree

`.gitattributes` pins `*.ps1`, `*.psd1` and `*.cmd` to `eol=crlf`, and `git check-attr eol` confirms it.
But measured by raw carriage-return byte count on 2026-09-07, **36 of those 37 files have zero CR bytes** -
only `windowsweep.cmd` is actually CRLF. Git does not report them as modified, because `eol=crlf` stores LF
in the repository and a working-tree LF file normalises to the same LF on the way in. The divergence is
therefore invisible to `git status`, to every gate, and to review.

**Why it is not urgent:** nothing breaks. PowerShell 5.1 reads LF without complaint - the self-test ran
151/151 and a real run freed 3.6 GiB from exactly these files.

**Why it is worth doing:** a fresh `git clone` on another machine *does* get CRLF, so this working tree and
that one differ byte-for-byte in every engine script. Any comparison between machines - a hash, a `cmp`, a
diff of an extracted tarball against a checkout - disagrees for a reason that has nothing to do with the
change being examined. The second-machine handoff is exactly that comparison.

**What to do:** with a genuinely clean tree, refresh the working tree from the index so the attributes are
applied - `git rm --cached -r . -q` then `git reset --hard`. Untracked files (`node_modules`, `target/`,
`temp/`, built installers) are not touched by this. Then re-measure with `tr -dc '\r' < file | wc -c`,
**never** with `grep -c $'\r$'`, which reports every file here as CRLF including pure-LF ones. Confirm the
engine still passes: `node bin\windowsweep.js --self-test --no-color`.

🔴 **Do not run it while any sub-agent holds an uncommitted tracked file.** `git reset --hard` discards
uncommitted tracked work, and a story writer or editor mid-dispatch is holding a draft under
`docs/story/drafts/`. Check `git status --short` is empty *and* that no agent is running.
🔴 **Guard the measurement against a missing path.** `tr -dc '\r' < nosuchfile | wc -c` prints `0`, which
reads identically to a correct LF result - a vacuous pass. Test `-f` first.

Two more patterns are missing from the same group and produced the same warning while this was being
written: `*.rs` (added in `8f0008e` after git warned that `engine.rs` would flip) and **`.env.example`**,
which matches no extension rule at all. Add `.env*` when working this task.

A number is never reused: the next task is TASK-008.

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
