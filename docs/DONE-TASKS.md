# Done tasks - windowsweep

Closed agent follow-ups, moved here from the root `PENDING-TASKS.md` with the date and the commit that closed
them. Open work lives there; owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-07

### DONE-001 - Download and set up the desktop toolchain and dependency trees

**Closed 2026-09-05.** The owner lifted the gate in writing - asked whether to lift TASK-001 he answered
**"Lift it fully"**, superseding his 2026-09-03 directive *"for now do not download on this net please"* for
this machine.

What it covered: rustup (stable, `x86_64-pc-windows-msvc`) and Visual Studio 2022 Build Tools with the C++
workload; `yarn install` in `desktop/` and in `D:\work\windowsweep-docs`; `firebase-tools`; committing both
`yarn.lock` files and `Cargo.lock`; the local desktop gates; run-to-verify; the updater keypair; and the first
`desktop-v<version>` release.

Two notes for anyone reading this later:

- 🔴 **`winget install --id Rustlang.Rustup --scope user` exits 0 having installed nothing** - the scope
  filter matches no installer and the message is only `No applicable installer found`. It reads exactly like
  success. rustup went in through its own `rustup-init.exe -y`, which is per-user and needs no UAC.
- The **Build Tools half needs a UAC click and is therefore not an agent action** - it is
  `docs/MANUAL-TASKS.md` row 22. Until it lands, nothing Rust-side links on this machine and the Tauri half is
  CI-verified only.

Plan: `C:\Users\PC\.claude\plans\please-plan-and-get-agile-fairy.md` section 18, Block O.

### DONE-002 - `.gitattributes` covers `*.js` but not `*.mjs`, `*.ts`, `*.tsx`, `*.css` or `*.mts`

`.gitattributes` pins `*.js` to LF and `*.ps1`/`*.cmd`/`*.psd1` to CRLF, and leaves everything else to
`* text=auto`. With `core.autocrlf` true on this machine that means the desktop app's TypeScript, its CSS and
the `.mjs` build scripts get CRLF in the working tree while their `.js` neighbours get LF. Staging
`desktop/scripts/sync-cli.mjs` on 2026-09-07 printed the warning that made this visible.

**Why it is not urgent:** nothing breaks. Vite, `tsc` and node all read either ending, and the repository
content is normalised either way.

**Why it is worth doing:** a file whose ending flips produces a whole-file diff the next time anything
touches it, which buries the real change. The desktop tree is about to see a lot of edits.

**What to do:** add `*.mjs`, `*.mts`, `*.ts`, `*.tsx`, `*.css`, `*.json5` and `*.toml` to the LF group,
then run `git add --renormalize .` in **one** commit that does nothing else, so the churn is isolated and
reviewable. Confirm afterwards with a raw byte count (`tr -dc '\r' < file | wc -c`), **never** with
`grep -c $'\r$'` - that has reported every file as CRLF here, including pure-LF ones.

**Do not** do it in the same commit as feature work, and do not renormalise while another writer has
uncommitted changes in `desktop/`.

A number is never reused: the next task is TASK-003.

**Closed 2026-09-07**, commit `674c8dd`. The eight missing types were added to the LF group -
`*.mjs`, `*.cjs`, `*.ts`, `*.mts`, `*.tsx`, `*.css`, `*.html`, `*.toml` - and
`git add --renormalize .` moved **no content**: the only file in the resulting commit was
`.gitattributes` itself. That is the evidence the repository bytes were already normalised and this
was a working-tree fix, not a rewrite. `git check-attr eol` now answers `lf` for a `.ts`, a `.mjs`
and a `.toml`, and the raw CR-byte count is 0 for each.

It also surfaced a separate divergence that is **not** closed by it and is filed as TASK-003: 36 of
the 37 files pinned to `eol=crlf` are LF in this working tree, invisibly to `git status`.

---

### DONE-003 - 36 of 37 files pinned to CRLF are LF in this working tree

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

**Closed 2026-09-08**, commit `a730bf0` (the `.env*` pin) plus the working-tree refresh, which moved
no repository content and so produced no commit of its own. `.env*` was added to the `eol=lf` group first, because `.env.example` matched no extension rule
at all - `git check-attr eol` now answers `lf` for both `.env.example` files. Then, on a genuinely clean
tree with no sub-agent running, `git rm --cached -r . -q && git reset --hard` re-applied every attribute.

**Measured, guarded against the vacuous-pass this task warned about** (every path tested with `-f` first,
and by raw carriage-return byte count, never `grep -c $'\r$'`):

| file | pinned to | CR bytes before | CR bytes after |
|---|---|---|---|
| `lib/constants.ps1` | crlf | 0 | **93** |
| `windowsweep.ps1` | crlf | 0 | **316** |
| `windowsweep.cmd` | crlf | 6 | 6 (already correct) |
| `README.md` | lf | 0 | 0 |
| `package.json` | lf | - | 0 |
| `desktop/src-tauri/src/engine.rs` | lf | - | 0 |

So the CRLF files gained their carriage returns and the LF files did not, which is the whole point: this
working tree and a fresh `git clone` on the second machine now agree byte for byte, and any cross-machine
hash, `cmp` or extracted-tarball diff disagrees only for reasons that have to do with the change being
examined. `git status --short` is empty afterwards - the repository content never moved, only the working
tree - and the engine still passes `node bin\windowsweep.js --self-test --no-color` at **151/151, exit 0**.
