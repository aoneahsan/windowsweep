# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-25 (TASK-017 filed from RW-116: the admin's browser writes the handled fields. TASK-013: the code is done and the task waits only on its live verification - see its status block. Earlier 2026-09-17: TASK-014, TASK-015 and TASK-016 closed to `docs/DONE-TASKS.md` as DONE-013, DONE-014 and DONE-015 by the v4 run. TASK-013 is the only one left open, and it is blocked on owner row 15 - Google sign-in was re-probed on 2026-09-17 and still reads false)

### TASK-013 - the desktop app's cloud sync is written and never called

**Status 2026-09-25 - the code is DONE; the task stays open for its live verification.** Wired dummy first in
`d0977c1` (the Account sync band, the account's run list on `runs_user_id_started_at_idx`, boot restore),
`1edd900` (the failure, pending and replaced states, Undo, Home's line, the threshold setters, a desktop logger)
and the History commit after it (other machines' summaries read by `lib/history-cloud.ts`, the failed-read and
empty states, and a build-start gate, `desktop/vite/catalogue-keys.ts`, after a removed key was found still in
use). The words are story surface `desktop-sync-strings`, GATE 4 by the owner 2026-09-25. **Closes when:** a dev
build with the Supabase keys runs an injected non-admin session through sign-in, a settings round trip, a
dry-run's upload, History's other-machine row and a Remove - dry-runs only - plus the two-user RLS probe; then
`SUPABASE_ENABLED` and the two repository variables are set (O6'), and `desktop-v1.3.0` ships it. The title's
defect no longer holds: every function in `lib/sync.ts` has callers.

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

### TASK-017 - an admin's browser writes `handled_at` and `handled_by` on a contact request

**Found while working on:** RW-116, the site verified as a person (2026-09-25), flow 3 as `t1+admin`.
**Priority: low** - only a platform admin can write these fields, and the audit trail is sound; but the inbox's
record of *when* and *by whom* is whatever the admin's client sent. **Needs the owner:** it is a change to the
production database (D30/D36 pattern), so it is applied only on his yes.

**The defect.** `20260908065528_site_privileges_and_triggers.sql:109` grants
`update (status, handled_at, handled_by)` on `public.contact_requests` to `authenticated`, and the site sends
both handled fields itself. Measured: the stored `handled_at` was `2026-09-25T09:48:18.983Z` while the audit row
for the same write reads `09:48:18.738Z` - the browser's clock, 245 ms apart - and nothing stops an admin
sending any time, or another admin's id as `handled_by`. The audit trigger's `actor` and `at` are server-side,
so `admin_audit` itself is right.

**What to do.** A forward migration from the schema's home (`desktop/src/db/schema/site.ts`, `drizzle-kit
generate --custom`): a `BEFORE UPDATE` trigger on `contact_requests` that sets `handled_at = now()` and
`handled_by = auth.uid()` when `status` becomes `handled`, and nulls both when it goes back to `new`; then the
grant narrowed to `update (status)`, with its rollback beside it in `supabase/rollbacks/`. Regenerate
`windowsweep-web/src/db/types.ts`, drop the two fields from the site's triage write, and re-run RW-116 flow 3's
Mark handled / Undo pair, reading `handled_at` against the audit row's `at` (equal to the millisecond, since
both come from one transaction's `now()`).

**Why it was not fixed there.** RW-116 was verification, run by an agent that writes no repository file; the
fix is a production schema change, which needs the owner's approval first.
