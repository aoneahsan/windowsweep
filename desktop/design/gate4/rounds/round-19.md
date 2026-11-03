# Round 19 — section 19 data scanner, 1.4.0

**Date:** 2026-11-03. **Source:** `de34a35` plus the three working-tree corrections recorded in this round. **Scope:** the new section 19 picker surface, at 1440 and the desktop's 760-pixel minimum width. The app was served by Vite with its explicit DEV engine fixture; no personal file operation was performed.

## Visual pairs

| Width | Approved dummy | Rendered app after Scan |
|---|---|---|
| 1440 | [`picker-19-1440-dummy-1.4.0.png`](../picker-19-1440-dummy-1.4.0.png) | [`picker-19-1440-app-1.4.0.png`](../picker-19-1440-app-1.4.0.png) |
| 760 | [`picker-19-760-dummy-1.4.0.png`](../picker-19-760-dummy-1.4.0.png) | [`picker-19-760-app-1.4.0.png`](../picker-19-760-app-1.4.0.png) |

The page hierarchy, title, lead, scanner heading, two instructional paragraphs, folder controls, reason controls, sort label, caution note, and table structure match. The dummy deliberately carries sample rows and sidebar counts; the DEV fixture has one reviewable and one refused row, while the product counts derive from its catalogue and scan. The two saved browser snapshots contain **8 matching shared headings/body paragraphs; 2 declared exclusions (sample data and live counts); 0 unresolved differences** in those shared text units. The reviewed app renders `engine 1.4.0`.

At 760 pixels, `document.documentElement.scrollWidth` was 760. The refused fixture row had no `input` or switch. Playwright reported zero app console errors. The scan did not select or remove anything. The 1.4.0 desktop gate command (`yarn gates`) then passed: typecheck, lint, build, and 30 tests.

This round proves browser parity of this surface. It does not prove installed WebView2 behavior, signed installer trust, production account integration, an updater installation, or a real section 19 file removal. Those checks must be reported separately before calling the full release complete.
