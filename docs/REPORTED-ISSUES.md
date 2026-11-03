# Reported issues — windowsweep

Open defects found while using or documenting windowsweep, one `### ISSUE-NNN` each. A fixed entry moves to
`docs/RESOLVED-ISSUES.md` with its date and version; ids are never reused.

## ⏳ Open

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

### ISSUE-002 — website copy (windowsweep-web) that the 1.3.2 code does not make true
- **Found:** 2026-11-03, while capturing the LinkedIn cards (live bundle `index-D1dRi3Ia.js`).
- **What:** the chokepoint band says "ONE FUNCTION" and that traversal and UNC paths are "refused outright" (two deletion
  functions; `..` is resolved and refused only where `safety.ps1:118-122` applies); "hashes a fixture tree" (text
  snapshot); "past 400 characters" (code checks > 260); "44 files" (1.3.2 has 46); the developer band shows `[y/N]`
  while the code prints `[Y/n]`; the docs page `developer-mode` repeats its first paragraph.
- **Fix:** correct the copy in `windowsweep-web` and the docs from the code. **Priority:** medium.
