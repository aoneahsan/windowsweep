# windowsweep completion - overview

Last Updated: 2026-09-05 (audit; the desktop app and the storytelling retrofit are now part of "100%")

## What

Everything between the published CLI and a project the owner can close. The CLI half shipped: 1.0.1 (the
audit-day defects) and 1.1.0 (sections 22-25, `--select` / `--select-file`, `--notify`, the `--json`
contract, 151 self-test checks), each tagged and released, with the documentation site deployed on GitHub
Pages and the portfolio, master-links and ORCID records written. What remains is in `remaining-work.md`:

- **P1** - the verification runs only the owner can do (elevated sections, Windows 11, the Scheduled Task,
  sections 4/5/7/8/17-19, `--notify` on both hosts).
- **P3 / P4 residue** - the docs domain (owner DNS) and the write-back that follows it, the OG image export,
  the local `yarn install` of the docs site, the owner's review of the master-links entry and the ORCID import.
- **P5 residue** - the candidate target rows that wait on the owner's read-only probe (RW-064, RW-065,
  RW-066); section 26 is still free.
- **P6** - the Windows desktop app: a Tauri 2 wrapper in `desktop/` that runs the bundled script with `--json`
  and reimplements no cleanup logic. Design direction 02 "Reclaim" is approved (gates 1-3 recorded
  2026-09-05); the eleven screens and the component library exist as a click dummy; the wiring batch, the
  verification sweep, the app itself, its CI, its Firebase project and its first release do not.
- **P7** - the storytelling retrofit (owner, 2026-09-05: "Retrofit everything"): a Story Bible and content
  map for windowsweep, then the README, the docs-site pages and the desktop copy through the story pipeline.

## Why

The 1.0.0 build session shipped a complete engine in one day; the audit that followed found one broken safety
promise and several doc-versus-code mismatches, all fixed in 1.0.1. The owner then decided that
"feature-complete" includes the sibling features that make sense on Windows (shipped as 1.1.0), a docs site
like the two siblings have, and - on 2026-09-05 - that the desktop app counts toward 100% and that every
product-voice surface passes through the fleet's storytelling system.

## Acceptance criteria

- npm version equals `VERSION` on `main`; every release has an annotated tag and a GitHub Release (true today:
  1.1.0 = `3c4d54e`, tags `v1.0.0`, `v1.0.1`, `v1.1.0`).
- Every documented promise is true in the code; `--yes` never selects items in sections 17, 18, 19 and 23.
- The self-test is green on both hosts in CI and every new check was proved red on a plant (151 today).
- The elevated run, the Windows 11 run, the Scheduled Task run and the sections 4/5/7/8/17-19 runs are recorded
  in `docs/PROJECT-CONTEXT.md` with numbers.
- `windowsweep-docs.aoneahsan.com` answers 200 with HTTPS and is the `homepage` in `package.json`, the `Docs`
  link in the README and `WS_DOCS` in `lib/constants.ps1`; the docs site carries a PNG OG image.
- The master-links entry is owner-reviewed and the ORCID work is imported.
- The desktop app is released as `desktop-v<version>` with NSIS and MSI installers and the updater manifest,
  verified page by page against the click dummy at 1440 and 390 (GATE 4), with CI green on both workflows.
- `docs/story/` holds an approved Story Bible and content map, and every in-scope surface has passed GATE 4 of
  the story pipeline.

## Phases

`00-tracker.json` holds the status of every phase and sub-task; `remaining-work.md` at the repository root
holds the specification of every `RW-` item (evidence, success criteria, acceptance points, what not to do).
