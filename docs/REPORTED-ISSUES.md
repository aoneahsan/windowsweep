# Reported issues — windowsweep

Open defects found while using or documenting windowsweep, one `### ISSUE-NNN` each. A fixed entry moves to
`docs/RESOLVED-ISSUES.md` with its date and version; ids are never reused.

## ⏳ Open

### ISSUE-006 — background update checks are held to the splash's 4-second deadline
- **Found:** 2026-11-08, in the installed 1.4.4 -> 1.4.5 proof (root `site-evidence/updater-1.4.5/logs/installed.txt`).
- **What:** GitHub's release-download endpoint answered in 4-12 s, often with a 504, for over an hour while its API
  answered in a second. Every check, the splash's and the ones `watchForUpdates` runs on focus, resume and reconnect,
  uses `UPDATE_CHECK_TIMEOUT_MS` (4000) plus a 1 s deadline (`desktop/src/lib/updater.ts`), so the installed apps skipped
  check after check; the update staged only when one answer happened to come in under 4 s. Nothing waits on a
  background check, so the splash's deadline does not need to bind it.
- **Fix:** give the focus, resume and reconnect checks their own, longer deadline (about 20 s) and keep 4 s for the
  splash; prove it on the local test channel with a delayed manifest. Ships with the next desktop release.
- **Priority:** low (the update is delayed while GitHub is slow, never lost).
