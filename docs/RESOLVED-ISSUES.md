# Resolved issues — windowsweep

Fixed entries moved from `docs/REPORTED-ISSUES.md`, with the date and the version that fixed them. Ids are never reused.

### ISSUE-001 — README and website claims that the code does not make true
- **Found:** 2026-11-02, while writing the LinkedIn series from the code (version 1.3.2).
- **What:**
  1. (already fixed: `README.md:128` now says 160 checks.)
  2. The long-path test is described as 445 characters (README) or "past 400" (site); the code checks only for more than 260.
  3. The site says the self-test "hashes" a test folder; the code compares a text snapshot.
  4. The records say 3 or 4 report-only sections; the code has 5 that delete nothing.
  5. (withdrawn 2026-11-02: `lib/safety.ps1:118-122` does refuse `..` segments and UNC paths.) The header comment at
     `lib/safety.ps1:3` says every deletion goes through two functions; stale prunes, tree children and the external
     commands (docker, cleanmgr, DISM, wevtutil) delete on their own paths. Make the comment match the code.
- **Fix:** make each statement match the code (or implement 5 with a fixture in the self-test), then re-check the site copy.
- **Priority:** low (copy and comments only; the refusals exist).
- **Picked up by:** P9's docs pass (tracker `P9.docs`, 2026-11-02), where the self-test count changes anyway.
- **Resolved:** 2026-11-06, checked against the 1.4.2 code. `README.md` says *223 checks* (the self-test prints `all 223 checks
  passed`), *a path longer than 260 characters* (the code tests more than 260), and names no count of report-only
  sections (`lib/constants.ps1` has five `report` sections). The `lib/safety.ps1` header now names every deleting
  function and `Invoke-External -Destructive`. `docs/PACKAGES.md` and MANUAL-TASKS row 8 moved from 160 to 223 the same
  day. The website statements ("hashes", "past 400") are carried by ISSUE-002.
- **Fixed in:** the README and comment changes shipped with CLI 1.4.0-1.4.2; the counts in the docs, 2026-11-06.
