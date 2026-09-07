# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-07

### TASK-002 - `.gitattributes` covers `*.js` but not `*.mjs`, `*.ts`, `*.tsx`, `*.css` or `*.mts`

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
