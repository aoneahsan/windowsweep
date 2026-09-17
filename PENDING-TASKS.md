# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-17 (TASK-014, TASK-015 and TASK-016 closed to `docs/DONE-TASKS.md` as DONE-013, DONE-014 and DONE-015 by the v4 run. TASK-013 is the only one left open, and it is blocked on owner row 15 - Google sign-in was re-probed on 2026-09-17 and still reads false)

### TASK-013 - the desktop app's cloud sync is written and never called

**Found while working on:** the v3 run's desktop round-7 fixes (2026-09-13), reading `desktop/src/lib` for the
sign-out scope. **Priority: high, and it blocks one thing** - setting the `SUPABASE_ENABLED` repository
variable (row 15 / RW-116). Until then no build carries the Supabase keys (`desktop-release.yml` injects them
only when that variable is `true`), so nothing a user runs today is wrong.

**The defect.** `desktop/src/lib/sync.ts` exports `fetchSettings`, `pushSettings`, `reconcileSettings`,
`fetchRuns`, `pushRun` and `deleteRun`, and not one of them has a caller anywhere in `desktop/src` (grep each
name outside `lib/sync.ts` -> 0 files). Yet `configuredFeatures()` reports `sync: supabaseReady`, and the Home
screen says *"Signing in is optional. It syncs your settings and a summary of each run, and nothing else."*
(`home.privacySignIn`). The first Supabase-enabled build would sign a person in and sync nothing, under a
sentence saying it does.

**What to do.** Wire the module the schema was written for (`desktop/src/db/schema/sync.ts`): on sign-in,
`fetchSettings` then `reconcileSettings` against the local store, and `pushSettings` on every later settings
change; `pushRun(stripRun(...))` after each finished run; the Account screen's run list from `fetchRuns`
(keyset, `RUNS_PAGE_SIZE` 20); `deleteRun` behind its control. Every read paginated, every write owner-filtered
(`~/.claude/rules/data-fetch-budget.md`), and `stripRun` is the only path a run takes to the network - no path,
drive label or machine name leaves the machine. Dummy first for any visible change (IRON rule 12). Verify as
`aoneahsan.apps.t1+1` once row 15 lands: settings round-trip across a sign-out and sign-in, one run row per
finished run, `deleteRun` leaves 0 rows, and the rows hold no path (read them over the Management API).

**Why it was not fixed there.** It is a feature, not a two-line fix; it needs the live sign-in to verify, which
row 15 gates; and it was outside that dispatch's scope.
