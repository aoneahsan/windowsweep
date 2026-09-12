# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-13 (TASK-004, 006, 007, 009 and 010 closed to `docs/DONE-TASKS.md` by the v3 run; two
new entries filed from what that run found; the next id is TASK-013)

### TASK-011 - `is_platform_admin()` still grants EXECUTE to `service_role`

- **What:** `pg_proc.proacl` for `public.is_platform_admin()` reads
  `{postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres}`. Its migration
  (`20260908065314_platform_admin_function.sql`) revoked only `from public, anon`, and Supabase's default ACL
  names `service_role` explicitly, so revoking PUBLIC never removed it. `authenticated` MUST keep EXECUTE -
  every admin RLS policy calls this function, and a policy is evaluated as the querying user.
- **Do:** one forward migration through `yarn db:custom`:
  `revoke execute on function public.is_platform_admin() from service_role;` then prove it from `proacl`,
  never from the file. `service_role` holds `rolbypassrls`, so no policy ever evaluates it for that role,
  which is why nothing depends on the grant.
- **Found while:** the v3 run's W1 (the `delete_my_account()` migration), 2026-09-12, by the four-role
  census of every `public` function.
- **Why not fixed there:** that migration's scope was one new function; migrations are forward-only, and a
  privilege change to a policy helper deserves its own reviewable file. **Impact today is nil** - with a
  secret key `auth.uid()` is null, so it returns false. It is a consistency gap with the four-role standard
  the newer migration follows, not a hole.
- **Priority:** low.

### TASK-012 - the desktop click dummy disagrees with itself in two small places

- **What:** (1) the gallery (`desktop/design/windowsweep-click-dummy/g-tables.js:111`) writes "Report only –
  ..." with an en dash while the Sections page (`page-sections.js:82`) writes it with a hyphen; the app
  follows the Sections page. (2) `t-base` (five dummy files, including the card code in `page-elevation.js`)
  and `t-2xl` (`splash.html`) are used in the dummy and styled by no rule in its CSS.
- **Do:** make the gallery match the Sections page; either style the two classes or remove them. Dummy-only -
  the app is already consistent (TASK-007 found zero orphan classes across 333 selectors).
- **Found while:** TASK-006 and TASK-007, 2026-09-13 (A-DESK).
- **Why not fixed there:** outside those tasks' stated scope, and neither changes what a user sees.
- **Priority:** low.
