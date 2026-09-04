# Done tasks - windowsweep

Closed agent follow-ups, moved here from the root `PENDING-TASKS.md` with the date and the commit that closed
them. Open work lives there; owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-05

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
