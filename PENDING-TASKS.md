# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

### TASK-001 - Download and set up the desktop toolchain and dependency trees when the owner gives the go-ahead

Gated on MANUAL-TASKS row 14 (owner directive 2026-09-03: no downloads on the current network). When he says
go: install rustup (stable, `x86_64-pc-windows-msvc`) and Visual Studio 2022 Build Tools with the C++
workload via winget (UAC click from the owner); `yarn install` in `desktop/` and in `D:\work\windowsweep-docs`;
commit both `yarn.lock` files and `Cargo.lock`; restore `yarn install --immutable` in the docs deploy
workflow if it was relaxed; run the desktop gates locally (`yarn typecheck`, `yarn lint`, `yarn build`,
`cargo fmt --check`, `cargo clippy -D warnings`, `yarn tauri build`); run-to-verify the app; generate the
updater keypair into `~/.secrets/tauri/` and the repo Actions secrets; cut the first `desktop-v<version>`
release. Plan: `C:\Users\PC\.claude\plans\please-plan-and-get-agile-fairy.md` section 8 (P6-B).
