# windowsweep - remaining work, one page

Last Updated: 2026-09-03 (after the 1.0.1 release: `main` at `edaa5cf`, npm `windowsweep@1.0.1`)

windowsweep 1.0.1 is a complete, published Windows cleanup CLI: 22 sections, walkthrough / menu / batch /
scan modes, one deletion chokepoint, a real dry-run, JSON reports, a 114-check self-test, CI on both
PowerShell hosts, a protected public repo, tagged releases and the npm package. **1.0.1 closed every P0
defect**, including the broken safety promise: `--yes` no longer selects anything in sections 17, 18 and 19.
What remains is self-test coverage of the pure logic, the docs site the two sibling tools already have,
repository and portfolio records, the 1.1 family-parity features, the verification runs only you can do
(admin sections, Windows 11), and the desktop app.

**Overall: about 68% of the agreed scope; the shipped CLI on its own is about 95% production-ready.**

| Area | Done | Missing |
|---|---|---|
| CLI engine 1.0 | 100% | nothing open - RW-002 to RW-011 all shipped in 1.0.1 |
| Release state | 100% | npm 1.0.1 equals `main`; `v1.0.0` and `v1.0.1` tagged with GitHub Releases |
| Verification | 65% | admin sections and `--elevate` never run for real; Windows 11 never tried; Scheduled Task never observed; sections 4/5/7/8/17-19 not yet run for real |
| Self-test coverage | 80% | parser, exports, layout guard, artefact and workspace finders, `--json` shape (the `--yes` asymmetry is now covered) |
| In-repo docs | 100% | the three doc-versus-code mismatches are fixed |
| Docs site | 0% | `windowsweep-docs.aoneahsan.com` (repo name and domain are free) |
| Repository hygiene | 85% | topics, homepage, wiki off (tags and Releases are done) |
| Owner records | 60% | portfolio-info file, master links JSON, ORCID entry |
| 1.1 features | 0% | 4 new sections (22-25), 1 admin section (26), about 10 new target rows, `--notify` |
| Desktop app (excluded) | 0% | own plan later |

## The next actions, in order

1. **RW-030.** About ten new self-test checks for the pure logic (target about 124).
2. **RW-040 / RW-041.** The docs site repo, Pages workflow, content mirror and the AI integration guide;
   you add the DNS CNAME and the Pages custom domain.
3. **RW-050 / RW-051.** Topics and wiki off; portfolio-info file, master links JSON entry, ORCID `.bib`
   (you import it).
4. **RW-020 (you).** First elevated real run: `windowsweep --only 12,13,14,15 --hiberfil off --yes
   --i-understand-deep --elevate`; the agent records the outcome.
5. **RW-021 (you).** A self-test, a dry-run and one real safe batch on a Windows 11 machine.
6. **P5.** The 1.1 sections and target rows plus the two GUI prerequisites (RW-071 `--select`, RW-072
   `--json` additions), then 1.1.0.
7. **P6.** The desktop app: the click dummy for your review, then Firebase, the app, and the toolchain
   install once you give the go-ahead.

**Done since the audit:** RW-002 (the HIGH safety defect), RW-003, RW-004, RW-005, RW-006, RW-007, RW-008,
RW-010, RW-011, RW-053, and the 1.0.1 release with both tags and Releases.

## Owner-only rows (never executed by an agent)

The elevated run, the Windows 11 run, closing Chrome / Slack / Granola and starting Docker for sections
7, 8 and 5, walking sections 17-19, renaming the folder to `windowsweep`, the docs-site DNS record and Pages
domain, the master-JSON review and the ORCID import. All are rows in `docs/MANUAL-TASKS.md`.

## Effort

About **5-6 agent sessions** (3-4 hours each) plus **about 4 hours of your time** for the rest of P1-P5. The desktop
app is 3 sessions (free local GUI) to 8+ (with accounts and plans), decided when that phase opens.

Full detail with evidence, success criteria and acceptance points: `remaining-work.md`. Status of every item:
`docs/features/windowsweep-completion/00-tracker.json`. What exists today: `what-this-project-consists-of.md`.
