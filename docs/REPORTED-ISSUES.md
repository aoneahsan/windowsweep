# Reported issues — windowsweep

Open defects found while using or documenting windowsweep, one `### ISSUE-NNN` each. A fixed entry moves to
`docs/RESOLVED-ISSUES.md` with its date and version; ids are never reused.

## ⏳ Open

### ISSUE-002 — website copy (windowsweep-web) that the 1.3.2 code does not make true
- **Found:** 2026-11-03, while capturing the LinkedIn cards (live bundle `index-D1dRi3Ia.js`).
- **What:** the chokepoint band says "ONE FUNCTION" and that traversal and UNC paths are "refused outright" (two deletion
  functions; `..` is resolved and refused only where `safety.ps1:118-122` applies); "hashes a fixture tree" (text
  snapshot); "past 400 characters" (code checks > 260); "44 files" (1.3.2 has 46); the developer band shows `[y/N]`
  while the code prints `[Y/n]`; the docs page `developer-mode` repeats its first paragraph.
- **Fix:** correct the copy in `windowsweep-web` and the docs from the code. **Priority:** medium.
