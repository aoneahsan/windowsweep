# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-28 (latest: TASK-023 filed from the 1.3.2 proofs - a development build reports its analytics too; TASK-020 closed as DONE-020 with desktop-v1.3.2, and DONE-021 (the desktop sign-in) and DONE-022 (empty run folders) recorded beside it in docs/DONE-TASKS.md. Earlier 2026-09-26: TASK-020 filed from the `desktop-v1.3.1` updater proof - the desktop window's CSP blocks Clarity - and its fix chosen by the owner the same day, D52: widen the CSP. Earlier the same day: TASK-019 closed as DONE-019 - the three `desktop/scripts/*.mjs` generators became Vite plugins in `desktop/vite/`, and the tag run proved it. Earlier 2026-09-25: TASK-017 closed as DONE-018 - applied on D48 and verified both ways. Earlier: TASK-018 closed to `docs/DONE-TASKS.md` as DONE-017 - no new words were needed. Earlier: TASK-019 filed - the three `desktop/scripts/*.mjs` generators, found while preparing D37's desktop half. Earlier: TASK-013 closed to `docs/DONE-TASKS.md` as DONE-016 after its live verification; TASK-017 filed from RW-116: the admin's browser writes the handled fields; TASK-018 filed from TASK-013's run: the zero-count History header. Earlier 2026-09-17: TASK-014, TASK-015 and TASK-016 closed to `docs/DONE-TASKS.md` as DONE-013, DONE-014 and DONE-015 by the v4 run. TASK-013 is the only one left open, and it is blocked on owner row 15 - Google sign-in was re-probed on 2026-09-17 and still reads false)

### TASK-023 - a development build sends its analytics too, and Clarity records one local path there

**Found while working on:** the 1.3.2 proofs (D53, tracker `P6.release-1.3.2`) - proof B under `tauri dev`
(`../gate4-evidence/task020/`, 2026-09-28). **Priority: low** - development builds only; no installed build is
affected.

**The defect.** `startAnalytics` starts every destination whose key is present, with no development gate
(`desktop/src/lib/analytics.ts`), and the local `desktop/.env` carries the keys - so every `yarn tauri dev` session,
every GATE 4 round included, reports to the production GA4, Amplitude, Clarity and Sentry projects. Under Vite's dev
server the page carries `<style data-vite-dev-id="D:/.../app.css">`, and Clarity records that attribute: a local
path, the developer's, in a replay. A production build has no such attribute, and every text node stays masked in
both.

**What to do.** Decide how a development build reports: (a) skip `startAnalytics` when `import.meta.env.DEV`, and
move the GATE 4 steps that watch analytics (a round's isolation check reads Amplitude's storage keys) onto a
production-protocol build; or (b) keep development reporting and strip the Vite attributes before Clarity starts.
(a) is the fleet's usual shape. Either way a round's evidence must say which build it watched.

**Why it was not fixed there.** Proof B, the replay-mask proof for TASK-020, ran under `tauri dev` precisely because
analytics run there (the window's CSP does not apply in development). Changing that mid-release would have moved the
GATE 4 method for round 18; the data concerned is the developer's own, on the developer's machine.
