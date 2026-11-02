# Reported issues — windowsweep

Open defects found while using or documenting windowsweep, one `### ISSUE-NNN` each. A fixed entry moves to
`docs/RESOLVED-ISSUES.md` with its date and version; ids are never reused.

## ⏳ Open

### ISSUE-001 — README and website claims that the code does not make true
- **Found:** 2026-11-02, while writing the LinkedIn series from the code (version 1.3.2).
- **What:**
  1. "Self-test: 156 checks" in the README; the 1.3.2 release record (`docs/runs-and-releases.md:272-273`) says 160.
  2. The long-path test is described as 445 characters (README) or "past 400" (site); the code checks only for more than 260.
  3. The site says the self-test "hashes" a test folder; the code compares a text snapshot.
  4. The records say 3 or 4 report-only sections; the code has 5 that delete nothing.
  5. A comment in `lib/safety.ps1` says network paths and `..` segments are refused; no refusal for either was found in the code.
- **Fix:** make each statement match the code (or implement 5 with a fixture in the self-test), then re-check the site copy.
- **Priority:** medium (item 5 is a safety claim: high if the refusal really is missing).
