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
