# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-25 (latest: TASK-018 closed to `docs/DONE-TASKS.md` as DONE-017 - no new words were needed. Earlier: TASK-019 filed - the three `desktop/scripts/*.mjs` generators, found while preparing D37's desktop half. Earlier: TASK-013 closed to `docs/DONE-TASKS.md` as DONE-016 after its live verification; TASK-017 filed from RW-116: the admin's browser writes the handled fields; TASK-018 filed from TASK-013's run: the zero-count History header. Earlier 2026-09-17: TASK-014, TASK-015 and TASK-016 closed to `docs/DONE-TASKS.md` as DONE-013, DONE-014 and DONE-015 by the v4 run. TASK-013 is the only one left open, and it is blocked on owner row 15 - Google sign-in was re-probed on 2026-09-17 and still reads false)

### TASK-017 - an admin's browser writes `handled_at` and `handled_by` on a contact request

**Found while working on:** RW-116, the site verified as a person (2026-09-25), flow 3 as `t1+admin`.
**Priority: low** - only a platform admin can write these fields, and the audit trail is sound; but the inbox's
record of *when* and *by whom* is whatever the admin's client sent. **APPROVED by the owner on 2026-09-25 (D48,
"Yes, apply it (Recommended)")**: the migration `20260925154905_stamp_contact_request_handled.sql` and its rollback
are written; the site change deploys first, after site parity round 6, then the migration, then flow 3 again.

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

### TASK-019 - three build-time generators live in `desktop/scripts/*.mjs`, which the house rules forbid

**Found while working on:** D37's desktop half (2026-09-25), measuring `desktop/` for the package baseline.
**Priority: medium** - nothing is broken, but the folder breaks the fleet's zero-tolerance rule against script
files (`~/.claude/rules/00-house-rules.md`, "NO SCRIPTS") and has since 2026-09-05 (`5f2bc84`, `4c031d7`).

**The defect.** `desktop/scripts/sync-cli.mjs` copies the engine into the bundle (`yarn sync:cli`, which
`desktop-release.yml`'s "Bundle the engine" step and every local build call); `gen-prepaint.mjs` writes
`public/prepaint.js` from `axes.json` (`yarn gen:prepaint`, `yarn check:prepaint`, and the `dev` and `build`
scripts); `check-tauri-config.mjs` is the config schema check in `build`. No exception is recorded for any of them.

**What to do.** The web repo's answer to the same class: build-time generators are Vite plugins under `vite/`
(`windowsweep-web` IRON rule 9; the desktop already has `desktop/vite/catalogue-keys.ts`). Move the prepaint
generator and the config check into `desktop/vite/`, and make the engine sync reachable by the workflow and the
local build without a script file (a Vite plugin at build start, or a plain `package.json` command). Every caller
moves in the same change: the `package.json` scripts, both desktop workflows and `docs/PACKAGES.md`. Watch each
generator fail on a plant before trusting it, as `catalogue-keys.ts` was.

**Why it was not fixed there.** It changes the release workflow's "Bundle the engine" step, which only a tag
exercises, and D37 was scoped to packages. It belongs with the next desktop release, whose workflow run proves it.
