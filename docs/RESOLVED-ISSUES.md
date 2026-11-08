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

### ISSUE-002 — website copy (windowsweep-web) that the 1.3.2 code does not make true
- **Found:** 2026-11-03, while capturing the LinkedIn cards (live bundle `index-D1dRi3Ia.js`).
- **What:** the chokepoint band says "ONE FUNCTION" and that traversal and UNC paths are "refused outright" (two deletion
  functions; `..` is resolved and refused only where `safety.ps1:118-122` applies); "hashes a fixture tree" (text
  snapshot); "past 400 characters" (code checks > 260); "44 files" (1.3.2 has 46); the developer band shows `[y/N]`
  while the code prints `[Y/n]`; the docs page `developer-mode` repeats its first paragraph.
- **Fix:** correct the copy in `windowsweep-web` and the docs from the code. **Priority:** medium.
- **Resolved:** 2026-11-08. The website's copy was already corrected from the code by the D91 words of 2026-11-06 (web `eaa01c5`): *Two file helpers* with `Remove-PathSafe` and `Send-ToRecycleBin`, the 260-character test, the dry-run snapshot, `[Y/n]`, and the traversal line, which is true because both helpers resolve each path before `Get-ProtectionReason` reads it. The docs' chokepoint paragraph still said *one function* and that paths with `..` segments are refused; it now says what `lib/safety.ps1` does (product `fab450b`, docs `3818091`, live). The developer-mode page no longer repeats a paragraph (checked paragraph by paragraph).
- **Fixed in:** docs live on 2026-11-08 (gh-pages `886aa7b`); the site copy since web `eaa01c5`.

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
- **Resolved:** 2026-11-08. `polar-webhook` v8 records `subscription.canceled`, `.uncanceled` and `.revoked` as each Polar subscription's newest state (ordered by Polar's `modified_at`), migrations `20261107193543` and `20261107193640` add the state table and `my_plan()`'s `renews`, and both Polar endpoints send the three events (D97). The site draws `account.plan.ends` and the desktop `plans.paid.ends` when `renews` is false. Proved live: signed events to the deployed webhook turned `renews` false and back, refused a forged signature and ignored a stale retry (root `site-evidence/subscription-cancel-v145/`); on the deployed site the open `/account` page read *until* 1.8 s after a signed cancellation and *renewing* 1.1 s after its withdrawal, with no reload (`site-evidence/site-1.4.5/live/account-ends-proof.txt`). Test rows removed.
- **Fixed in:** backend 2026-11-08 (webhook v8, migrations above); web `c51b464`; desktop 1.4.5.

### ISSUE-004 — "Version {{version}} is ready" shows before the update has finished downloading
- **Found:** 2026-11-07, in the installed 1.4.3 -> 1.4.4 updater proof (root `site-evidence/updater-1.4.4/logs/run1-closed-mid-download.txt`).
- **What:** the splash names the update as ready as soon as the check finds it, while `stageForClose` (`desktop/src/lib/updater.ts`)
  arms the install-on-close hook only once the background download finishes. A window closed in that gap closes without
  installing; the next start downloads again and the next close installs it, so the update is delayed, not lost.
- **Fix:** show the notice (or its "ready" wording) once the download is staged, or hold the close until it is, and keep
  "Install and restart" as it is. **Priority:** low.
- **Resolved:** 2026-11-08. The install-on-close hook is armed when the update is found; a close during the download hides the window, waits up to a minute for the download, then installs (`desktop/src/lib/updater.ts`, `fab450b`). Proved on a local test channel serving the real signed 1.4.5 installer at ~150 KB/s: Close 0.4 s into a 27.7 s download, the hidden app stayed until the download ended (28.3 s), then ran the installer (`site-evidence/updater-1.4.5/logs/early-close.txt`, `test-channel.txt`).
- **Fixed in:** desktop 1.4.5.

### ISSUE-005 — the website runs Clarity session replay on signed-in pages
- **Found:** 2026-11-07, in the 1.4.4 idle proof on `/account` (two `n.clarity.ms/collect` beacons in 120 s while signed in).
- **What:** `windowsweep-web/src/lib/analytics.ts` starts Clarity on every page, text masked by `data-clarity-mask`. The fleet
  law (`~/.claude/rules/legal-notice.md`) says replay tools never run on signed-in or record pages (`/account`, `/admin`,
  `/contact` and the sign-in return). The Privacy Policy describes masked replay and stays true either way.
- **Fix:** keep Clarity off on those routes (do not start it on them, and stop it when a public page leads into one),
  verify with the beacon count on the deployed origin, signed in and out. **Priority:** medium.
- **Resolved:** 2026-11-08. Clarity is never loaded on a visit that starts on `/account`, `/admin`, `/contact` or an OAuth or checkout return, is stopped on the router's `onBeforeNavigate` before the new URL is written (Clarity's own pushState wrapper restarts it after a URL change), restarts on `onResolved` on a public page, and sends nothing while stopped (web `3de6b82`, `88c05b6`). Beacon counts on the deployed origin, signed out and signed in as t1+1: 0 tags and 0 beacons in 30 s from a visit starting on `/account`; beacons on `/`; 0 in 45 s after an in-app move to `/contact` and 0 in 30 s after one to `/account`; beacons again back on `/` (`site-evidence/site-1.4.5/live/replay-proof-*.txt`).
- **Fixed in:** website, Cloudflare Pages `d16a8762` (web `4caa72a` and the sitemap commit after it).
