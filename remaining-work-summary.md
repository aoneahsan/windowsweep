# windowsweep - remaining work, one page

Last Updated: 2026-09-05 (audit of `main` at `2721b75`; npm `windowsweep@1.1.0`; the desktop app and the storytelling retrofit now count toward 100%)

The CLI is finished and published: 1.1.0 equals `main`, 26 sections (0-25), the scripted-selection flags and
the `--json` contract a GUI needs, a 151-check self-test green on both PowerShell hosts, tags and Releases for
every version, a protected public repo, an npm package with no dependencies. The documentation site is built
and deployed but its domain still waits on your DNS record. The desktop app has an **approved design** and a
complete click dummy, and no application code yet. Every product-voice surface still has to pass through the
storytelling system, which you chose today to apply to everything.

**Whole project: about 53%. The CLI-only scope agreed on 2026-09-03: about 87%. The published CLI on its own:
production-ready, with the verification runs that only you can do still open.**

| Area | Weight | Done | What is missing |
|---|---|---|---|
| CLI engine + releases (1.0, 1.0.1, 1.1.0) | 25 | 100% | nothing |
| 1.1 residue (candidate target rows) | 3 | 40% | Telegram, WhatsApp, Office, Steam shadercache, WebView2, torch, conda, driver leftovers - all wait on your read-only probe (row 20) |
| Verification (P1) | 8 | 15% | elevated sections 12-16/20 and `--elevate`; Windows 11; the Scheduled Task; sections 4/5/7/8/17-19/23 for real; `--notify` on pwsh - all yours |
| Self-test coverage | 4 | 100% | nothing |
| In-repo documentation | 5 | 100% | nothing (the stale lines were fixed in this audit) |
| Docs site | 8 | 85% | DNS + HTTPS (rows 11-12) and the write-back that follows; a PNG OG image; the local `yarn install` and lockfile |
| Repository hygiene + owner records | 5 | 85% | homepage fields after DNS; your review of the master-links entry (row 5); the ORCID import (row 13) |
| Desktop design (click dummy) | 8 | 70% | the inventory ledger, the wiring batch (six flows through the store), the verification sweep across 19 files |
| Desktop app (code, Tauri, Firebase, CI, release) | 24 | 0% | everything: `desktop/` web layer, `src-tauri/`, Firebase + vault, two CI workflows, local gates + WebView2 run-to-verify + GATE 4 parity, the `desktop-v1.1.0` release, the records |
| Storytelling retrofit (P7) | 10 | 0% | `/story-init` (Bible, GATE 1), the content map (GATE 2), then every surface: README, docs pages, `llms.txt`, CLI strings, the eleven desktop screens |

Score = sum(weight x done) / 100 = 25 + 1.2 + 1.2 + 4 + 5 + 6.8 + 4.25 + 5.6 + 0 + 0 = **53.05**.
CLI-only scope (2026-09-03 weights: engine 30, 1.1 features 20, verification 10, in-repo docs 10, docs site 10,
self-test 5, release 5, hygiene 5, records 5) = 30 + 18 + 1.5 + 10 + 8.5 + 5 + 5 + 4.5 + 4.25 = **86.75**.

## The next actions, in order

1. **RW-073 to RW-075 (agent).** Finish the click dummy: the inventory ledger, the wiring batch, the
   verification sweep with screenshots - the hand-back you already pre-approved.
2. **RW-090 / RW-091 (agent + you).** `/story-init` for windowsweep, then the content map. You approve the
   Bible (GATE 1) and the map (GATE 2).
3. **RW-092 / RW-093 (agent + you).** The desktop screens' copy through the story pipeline first (the dummy is
   amended, then the app matches), then the README, the docs pages and `llms.txt`; you approve each surface
   (GATE 4).
4. **RW-077 to RW-083 (agent).** The desktop app itself: web layer, Tauri shell, Firebase + vault, CI, gates,
   the parity check, the `desktop-v1.1.0` release, the records. Rust links locally only after row 22.
5. **Rows 15, 16, 22 (you).** The Google OAuth desktop client id, the four telemetry keys, the Build Tools UAC
   click. Sign-in and analytics ship compiled and dormant until 15 and 16 land.
6. **Rows 11, 12 (you), then RW-040 (agent).** DNS `CNAME windowsweep-docs -> aoneahsan.github.io`, Pages
   custom domain + Enforce HTTPS; the agent then switches every link and homepage field.
7. **RW-043, RW-045 (agent).** The OG PNG export; the local docs-site install and lockfile.
8. **P1 (you).** The elevated run, Windows 11, the Scheduled Task, the interactive sections, `--notify`.
9. **Row 20 (you), then RW-064/065/066 (agent).** Paste the probe output; the verified rows ship in 1.2.0.
10. **Rows 5 and 13 (you).** Review the master-links entry; import the ORCID work.

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
