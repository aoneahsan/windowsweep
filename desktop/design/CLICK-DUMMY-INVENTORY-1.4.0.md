# 1.4.0 click dummy addendum

Status: updated 2026-11-06 - tours and walkthrough approved 2026-11-03; the legal bar, the destinations without Clarity and the emails approved by D90 (2026-11-06).

| Kind | Count | Source |
|---|---:|---|
| Current product screens | 12 | `page-contents.js`: 12 rows, of which Consent is retired; plus `walkthrough.html` |
| Legacy product reference | 1 | `consent.html`, retained for 1.3.2 parity history |
| Component gallery files | 8 | `page-contents.js` gallery list |
| Contents index | 1 | `pages.html` |
| Flat HTML files | 23 | 12 current + 1 legacy + 8 gallery + 1 index + 1 email review page |
| Email review page | 1 | `emails.html` exists; its separate content and live-send gates remain open |
| Planned review pages | 23 | all flat files are present |

| # | Page | Dummy file | App route | Covers | Status |
|---|---|---|---|---|---|
| 12 | Plans | `plans.html` | `/plans` | plan state, real-run allowance, device and account pools, limit, Pro/Team request, referrals, paid state, loading and read failure | 🔄 in review |
| 12a | Team | `plans.html?tab=team` | `/team` | locked, member, owner, team creation, invite seats and empty fleet report; shares Plans' shell and controls | 🔄 in review |
| shared | Legal bar | decided by `app.js`, drawn by `legal-bar.js` | every non-task page; the first-run surface after Splash | once per PC and per account (either teaches the other), seen when drawn, policy links, analytics sentence, Okay and Escape, 10 seconds held by hover or focus; `index.html?legal=1` previews it (AMENDMENTS-3.md, 2026-11-06) | ✅ approved (D90, 2026-11-06) |
| shared | Destinations without Clarity | `wire.js` (Home) and `page-settings.js` (Settings, Privacy) | `/`, `/settings` | N-016: GA4, Amplitude and Sentry rows; *Never sent* kept in both | ✅ approved (D90, 2026-11-06) |
| shared | Update notice and block | built by `app.js` | every page | normal notice, urgent/next-start block, offline and failed-update states; preview links on Plans | 🔄 in review |
| shared | Page tours | `tours.js` | important desktop routes | titlebar Tour button, step controls, URL state and missing-target skip | ✅ approved (2026-11-03, AMENDMENTS-3) |
| 13 | Walkthrough | `walkthrough.html` | `/walkthrough` | seven fixture-backed steps from scan to report, with step URL state | ✅ approved (2026-11-03, AMENDMENTS-3) |
| 14 | Emails | `emails.html` (+ `page-emails.js`) | none (FilesHub templates `windowsweep-welcome`, `-plan-confirmed`, `-referral-confirmed`, `-payment-returned`, `-plan-granted`, `-plan-request-open`, `-team-invite`, `-release-confirm` (the release list's double opt-in confirmation); release newsletter email 1) | the one layout drawn once (shell, style block, brand hex light and dark, absolute https logo); nine specimens at 600 and 390 px with their plain-text parts, the ninth the newsletter confirmation in D91 S7's words (AMENDMENTS-3.md, 2026-11-06) | ✅ approved (D90, 2026-11-06) |

The 1.4.0 design keeps the approved lime/sky/plum palettes, nine appearance axes and default pointer. The new screen uses the existing shell and panel vocabulary. `plans.css` adds layout rules but no colour or type tokens. Every new state is reachable through the review links at the bottom of Plans. These URL switches are preview controls, not account data.

All 21 flat pages load the local classic bundle built from `strata-storage` 3.1.3 before the shared shell. The physical browser key probe returned `strata:wsdummy:physicalProbe`; the `file://` Plans page displayed `storage: localStorage`. Build and probe details are in `README.md`.

**Review evidence:** `gate4/plans-*-dummy-1.4.0.png` captures the dummy at widths 760 and 1440 and the named limit, legal and update states. Width 760 is the native minimum. A final app pair is still owed after implementation. The `draftKept` line is absent pending the required browser persistence proof.

**Next gate:** the owner must write an approval or changes for the new Plans, Team, legal and update surfaces. The email page needs finalized row 26 copy before its own design review. Existing Gate 1–3 approval remains the record for the older 1.3.2 pages. The app parity gate for 1.4.0 has not run.
