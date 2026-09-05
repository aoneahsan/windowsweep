# windowsweep - remaining work, one page

Last Updated: 2026-09-05 (audit, the click dummy closed, then the story pass opened and the desktop app's foundation built; npm `windowsweep@1.1.0`; the desktop app and the storytelling retrofit now count toward 100%)

The CLI is finished and published: 1.1.0 equals `main`, 26 sections (0-25), the scripted-selection flags and
the `--json` contract a GUI needs, a 151-check self-test green on both PowerShell hosts, tags and Releases for
every version, a protected public repo, an npm package with no dependencies. The documentation site is built
and deployed, with a real Open Graph card and its own lockfile; only its domain still waits on your DNS
record. The desktop app now has a **built foundation**: the whole engine bridge, the Tauri shell, the ten-axis
theme, i18n with a lint gate that fails the build, consent-gated telemetry, and four of the eleven screens -
typecheck, lint and build all green, each gate watched failing on a planted defect. The story system has both
its approval gates cleared and the eleven desktop screens drafted as a numbered slot inventory.

**Whole project: about 74%. The CLI-only scope agreed on 2026-09-03: about 87%. The published CLI on its own:
production-ready, with the verification runs that only you can do still open.**

| Area | Weight | Done | What is missing |
|---|---|---|---|
| CLI engine + releases (1.0, 1.0.1, 1.1.0) | 25 | 100% | nothing |
| 1.1 residue (candidate target rows) | 3 | 40% | Telegram, WhatsApp, Office, Steam shadercache, WebView2, torch, conda, driver leftovers - all wait on your read-only probe (row 20) |
| Verification (P1) | 8 | 15% | elevated sections 12-16/20 and `--elevate`; Windows 11; the Scheduled Task; sections 4/5/7/8/17-19/23 for real; `--notify` on pwsh - all yours |
| Self-test coverage | 4 | 100% | nothing |
| In-repo documentation | 5 | 100% | nothing (the stale lines were fixed in this audit) |
| Docs site | 8 | 95% | DNS + HTTPS (rows 11-12) and the one-commit write-back that follows. The PNG OG card and the local install both closed 2026-09-05 |
| Repository hygiene + owner records | 5 | 85% | homepage fields after DNS; your review of the master-links entry (row 5); the ORCID import (row 13) |
| Desktop design (click dummy) | 8 | **100%** | nothing - closed 2026-09-05 with four defects fixed and every gate proved against a planted defect |
| Desktop app (code, Tauri, Firebase, CI, release) | 24 | 50% | seven of eleven screens; the Firestore rules and the Firebase project (RW-079); Rust compiled locally (row 22 - CI-verified only until then); WebView2 run-to-verify and GATE 4 parity (RW-081); the `desktop-v1.1.0` release (RW-082) |
| Storytelling retrofit (P7) | 10 | 55% | GATE 1 and GATE 2 are cleared and the three desktop surfaces are drafted (375 slots). Still open: your GATE 4 on those, the seven `NEEDS DECISION` answers, then eleven more surfaces - README, tagline, docs pages, `llms.txt`, CLI strings |

Score = sum(weight x done) / 100 = 25 + 1.2 + 1.2 + 4 + 5 + 7.6 + 4.25 + 8 + 12 + 5.5 = **73.75**.
CLI-only scope (2026-09-03 weights: engine 30, 1.1 features 20, verification 10, in-repo docs 10, docs site 10,
self-test 5, release 5, hygiene 5, records 5) = 30 + 18 + 1.5 + 10 + 8.5 + 5 + 5 + 4.5 + 4.25 = **86.75**.

## The next actions, in order

1. ~~RW-073 to RW-075~~ **done 2026-09-05.** The click dummy is finished and verified: four defects fixed,
   including one that had made text invisible in light mode on the home screen. Evidence:
   `desktop/design/CLICK-DUMMY-INVENTORY.md` section 8.
2. ~~RW-090 / RW-091~~ **done 2026-09-05.** The Story Bible and the content map are both approved; the voice is
   registered globally as the eleventh entry.
3. 🔴 **Seven answers from you, and two of them block copy that is already written.** The pricing sentences on
   Home and Account, the installer's signing position, what a release publishes beside an installer, and the
   Amplitude retention claim. Each is stated in full at the end of this session's report and in
   `docs/story/drafts/desktop-*.md`. Nothing else in the project waits on these.
4. **GATE 4 on the three desktop surfaces (you).** 375 numbered slots are drafted; 38 are proposed changes and
   the rest are confirmed as already on voice. Approving them lets RW-093 write the changed words into the
   click dummy, and the app then follows the dummy.
5. **RW-077 residue (agent).** Seven screens remain: Picker, History, Report, Settings, Account, Elevation and
   Splash. Their words come from the approved drafts, so they follow step 4.
6. **RW-079 (agent).** The Firebase project, the Firestore rules and indexes, the vault entries. Sign-in and
   sync are written and compile; they stay dormant until rows 15 and 16.
7. **Rows 15, 16, 22 (you).** The Google OAuth desktop client id, the four telemetry keys, the Build Tools UAC
   click. Rust is CI-verified only until row 22.
8. **RW-081, RW-082 (agent).** The WebView2 run-to-verify pass, GATE 4 parity as screenshot pairs, then the
   `desktop-v1.1.0` release with NSIS, MSI and the updater artefacts.
9. **Rows 11, 12 (you), then RW-040 (agent).** DNS `CNAME windowsweep-docs -> aoneahsan.github.io`, Pages
   custom domain + Enforce HTTPS; the agent then switches every link and homepage field in one commit.
10. **P1 (you).** The elevated run, Windows 11, the Scheduled Task, the interactive sections, `--notify`.
11. **Row 20 (you), then RW-064/065/066 (agent).** Paste the probe output; the verified rows ship in 1.2.0.

## Owner-only rows (never executed by an agent)

Rows 1, 2, 3, 6, 7, 8, 9, 10, 19, 21 (the P1 runs) · 11, 12 (DNS and Pages HTTPS) · 15, 16, 22 (the desktop
credentials and the Build Tools click) · 20 (the candidate-path probe) · 5, 13 (master JSON review, ORCID
import) · the four story gates as they arrive. All are rows in `docs/MANUAL-TASKS.md`; the story gates are asked
in the session that reaches them.

## Effort

About **12-14 agent sessions** (3-4 hours each): 6-7 for the desktop app, 4-5 for the storytelling retrofit
(about ten dispatches and roughly 1.3M tokens per surface, so surfaces are grouped), 0.5 for the docs-site
residue, 0.5 for the candidate rows once the probe arrives, the rest for records and releases. About **8 hours
of your time**: 3 for the P1 runs, 2 for the story gates, 1 for the desktop credentials and the Build Tools
install, and the small rows.

Full detail with evidence, success criteria and acceptance points: `remaining-work.md`. Status of every item:
`docs/features/windowsweep-completion/00-tracker.json`. What exists today: `what-this-project-consists-of.md`.
