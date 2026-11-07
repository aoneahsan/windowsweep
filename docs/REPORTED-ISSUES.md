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

### ISSUE-003 — a subscription cancelled in Polar's portal still reads "renewing on"
- **Found:** 2026-11-07, while building the website's `/account` plan block (D94, web dummy amendment 42).
- **What:** `polar-webhook` handles only `order.paid` and `order.refunded`, so a cancellation made in Polar's customer
  portal never reaches the database; `subscriptions.cancelled_at` is written only by `billing_mark_cancelled` during an
  account's deletion, and `my_plan()` does not return it. The desktop Plans screen (`plans.paid.renews`) and the site's
  plan block (`account.plan.renews`) therefore keep saying the plan renews until the paid period ends. Nothing is
  charged (Polar stops billing) and the plan ends on time; only the word is wrong.
- **Fix:** subscribe the production webhook to Polar's subscription cancellation event, record it in `cancelled_at`,
  expose it through `my_plan()`, and draw the approved `account.plan.ends` line (and a desktop counterpart through the
  story gate). **Priority:** medium. Deferred: it changes the webhook contract and adds a production migration.

### ISSUE-004 — "Version {{version}} is ready" shows before the update has finished downloading
- **Found:** 2026-11-07, in the installed 1.4.3 -> 1.4.4 updater proof (root `site-evidence/updater-1.4.4/logs/run1-closed-mid-download.txt`).
- **What:** the splash names the update as ready as soon as the check finds it, while `stageForClose` (`desktop/src/lib/updater.ts`)
  arms the install-on-close hook only once the background download finishes. A window closed in that gap closes without
  installing; the next start downloads again and the next close installs it, so the update is delayed, not lost.
- **Fix:** show the notice (or its "ready" wording) once the download is staged, or hold the close until it is, and keep
  "Install and restart" as it is. **Priority:** low.

### ISSUE-005 — the website runs Clarity session replay on signed-in pages
- **Found:** 2026-11-07, in the 1.4.4 idle proof on `/account` (two `n.clarity.ms/collect` beacons in 120 s while signed in).
- **What:** `windowsweep-web/src/lib/analytics.ts` starts Clarity on every page, text masked by `data-clarity-mask`. The fleet
  law (`~/.claude/rules/legal-notice.md`) says replay tools never run on signed-in or record pages (`/account`, `/admin`,
  `/contact` and the sign-in return). The Privacy Policy describes masked replay and stays true either way.
- **Fix:** keep Clarity off on those routes (do not start it on them, and stop it when a public page leads into one),
  verify with the beacon count on the deployed origin, signed in and out. **Priority:** medium.
