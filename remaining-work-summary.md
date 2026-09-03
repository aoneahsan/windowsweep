# windowsweep - remaining work, one page

Last Updated: 2026-09-03 (audit of `main` at `84c732f`; npm `windowsweep@1.0.0`)

windowsweep 1.0.0 is a complete, published Windows cleanup CLI: 22 sections, walkthrough / menu / batch /
scan modes, one deletion chokepoint, a real dry-run, JSON reports, a 108-check self-test, CI on both
PowerShell hosts, a protected public repo and the npm package. What remains is one patch release to bring
npm level with `main`, a handful of found defects (one of them a broken safety promise), the verification
runs nobody has done yet (admin sections, Windows 11), self-test coverage of the pure logic, the docs site
the two sibling tools already have, repository and portfolio records, and the 1.1 family-parity features
you scoped in on 2026-09-03. The desktop app is a later, separate phase.

**Overall: about 60% of the agreed scope; the shipped 1.0 CLI on its own is about 90% production-ready.**

| Area | Done | Missing |
|---|---|---|
| CLI engine 1.0 | 97% | 8 defects and inconsistencies (P0) |
| Release state | 85% | 1.0.1 (main is ahead of npm by an internal rename), tag, release |
| Verification | 65% | admin sections and `--elevate` never run for real; Windows 11 never tried; Scheduled Task never observed; sections 4/5/7/8/17-19 not yet run for real |
| Self-test coverage | 75% | parser, exports, layout guard, artefact and workspace finders, `--json` shape |
| In-repo docs | 95% | 3 doc-versus-code mismatches |
| Docs site | 0% | `windowsweep-docs.aoneahsan.com` (repo name and domain are free) |
| Repository hygiene | 70% | topics, homepage, wiki off, `v1.0.0` tag + release |
| Owner records | 60% | portfolio-info file, master links JSON, ORCID entry |
| 1.1 features | 0% | 4 new sections (22-25), 1 admin section (26), about 10 new target rows, `--notify` |
| Desktop app (excluded) | 0% | own plan later |

## The ten next actions, in order

1. **RW-002 (HIGH).** Section 17 deletes every listed artefact with no selection when `--yes` is on in the
   walkthrough or the menu; fix `Read-MultiSelect` with `-NoAutoYes` for 17/18/19, add the self-test check.
2. **RW-003 / 004 / 005 / 006 / 007 / 008 / 010 / 011.** The small consistency fixes (section 19 title,
   the Recycle Bin tier, `--purge-all` wording, the VSIX cache under a running editor, the npx-cache task
   path, exit code 130, `--uninstall-data --yes`, 13 keywords).
3. **RW-001.** Publish 1.0.1 through the gate; tag and release it.
4. **RW-020 (you).** First elevated real run: `windowsweep --only 12,13,14,15 --hiberfil off --yes
   --i-understand-deep --elevate`; the agent records the outcome.
5. **RW-021 (you).** A self-test, a dry-run and one real safe batch on a Windows 11 machine.
6. **RW-030.** About ten new self-test checks for the pure logic (target about 120).
7. **RW-040.** The docs site repo, Pages workflow, content mirror; you add the DNS CNAME and Pages domain.
8. **RW-050.** Topics, wiki off, `v1.0.0` tag on `70c6738` and its Release.
9. **RW-051.** Portfolio-info file, master links JSON entry, ORCID `.bib` (you import it).
10. **P5.** The 1.1 sections and target rows, then 1.1.0.

## Owner-only rows (never executed by an agent)

The elevated run, the Windows 11 run, closing Chrome / Slack / Granola and starting Docker for sections
7, 8 and 5, walking sections 17-19, renaming the folder to `windowsweep`, the docs-site DNS record and Pages
domain, the master-JSON review and the ORCID import. All are rows in `docs/MANUAL-TASKS.md`.

## Effort

About **6.5-7.5 agent sessions** (3-4 hours each) plus **about 4 hours of your time** for P0-P5. The desktop
app is 3 sessions (free local GUI) to 8+ (with accounts and plans), decided when that phase opens.

Full detail with evidence, success criteria and acceptance points: `remaining-work.md`. Status of every item:
`docs/features/windowsweep-completion/00-tracker.json`. What exists today: `what-this-project-consists-of.md`.
