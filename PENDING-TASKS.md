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

A number is never reused: the next task is TASK-004.
