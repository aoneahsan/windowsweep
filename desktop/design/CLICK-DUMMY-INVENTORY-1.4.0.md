# 1.4.0 click dummy addendum

Status: **in review**, 2026-10-31. This adds to the approved 1.3.2 Reclaim design; it does not record a new owner approval.

| Kind | Count | Source |
|---|---:|---|
| Current product screens | 11 | `page-contents.js`: 12 rows, of which Consent is marked retired |
| Legacy product reference | 1 | `consent.html`, retained for 1.3.2 parity history |
| Component gallery files | 8 | `page-contents.js` gallery list |
| Contents index | 1 | `pages.html` |
| Flat HTML files | 21 | 11 current + 1 legacy + 8 gallery + 1 index |
| Pending 1.4 email review page | 1 | Story map row 26 is open; its final copy has not been supplied |
| Planned review pages | 22 | 21 flat files + the pending email page |

| # | Page | Dummy file | App route | Covers | Status |
|---|---|---|---|---|---|
| 12 | Plans | `plans.html` | `/plans` | plan state, real-run allowance, device and account pools, limit, Pro/Team request, referrals, paid state, loading and read failure | 🔄 in review |
| 12a | Team | `plans.html?tab=team` | `/team` | locked, member, owner, team creation, invite seats and empty fleet report; shares Plans' shell and controls | 🔄 in review |
| shared | Legal bar | built by `app.js` | every non-task page | one time per browser preview, policy links, analytics sentence, Okay, 10-second expiry | 🔄 in review |
| shared | Update notice and block | built by `app.js` | every page | normal notice, urgent/next-start block, offline and failed-update states; preview links on Plans | 🔄 in review |
| pending | Emails | `emails.html` | none | welcome, plan confirmation and release-news messages after row 26 is finalized | waiting for copy |

The 1.4.0 design keeps the approved lime/sky/plum palettes, nine appearance axes and default pointer. The new screen uses the existing shell and panel vocabulary. `plans.css` adds layout rules but no colour or type tokens. Every new state is reachable through the review links at the bottom of Plans. These URL switches are preview controls, not account data.

All 21 flat pages load the local classic bundle built from `strata-storage` 3.1.3 before the shared shell. The physical browser key probe returned `strata:wsdummy:physicalProbe`; the `file://` Plans page displayed `storage: localStorage`. Build and probe details are in `README.md`.

**Review evidence:** `gate4/plans-*-dummy-1.4.0.png` captures the dummy at widths 760 and 1440 and the named limit, legal and update states. Width 760 is the native minimum. A final app pair is still owed after implementation. The `draftKept` line is absent pending the required browser persistence proof.

**Next gate:** the owner must write an approval or changes for the new Plans, Team, legal and update surfaces. The email page needs finalized row 26 copy before its own design review. Existing Gate 1–3 approval remains the record for the older 1.3.2 pages. The app parity gate for 1.4.0 has not run.
