# windowsweep completion - overview

Last Updated: 2026-09-03

## What

Everything between the published 1.0.0 and a project the owner can close: the 1.0.1 release that brings npm
level with `main`, the defects the 2026-09-03 audit found, the verification runs that have never happened
(elevated admin sections, Windows 11, the Scheduled Task, the personal sections), self-test coverage of the
pure logic, the docs site at `windowsweep-docs.aoneahsan.com`, repository hygiene and the owner's portfolio
and ORCID records, and the 1.1 family-parity features (sections 22-26, new target rows, `--notify`). The
Windows desktop app is a later phase with its own plan.

## Why

The 1.0.0 build session shipped a complete engine and its records in one day; the audit that followed found
one broken safety promise (section 17 under `--yes` in the interactive modes), several doc-versus-code
mismatches, code on `main` that is not on npm, and the two things both sibling tools have that this one
lacks: a docs site and the portfolio/ORCID records. The owner also decided that "feature-complete" includes
the sibling features that make sense on Windows.

## Acceptance criteria

- npm version equals `VERSION` on `main`; every release from 1.0.1 has a tag and a GitHub Release.
- Every documented promise is true in the code; `--yes` never selects items in sections 17-19 and 23.
- The elevated run, the Windows 11 run, the Scheduled Task run and the sections 4/5/7/8/17-19 runs are
  recorded in `docs/PROJECT-CONTEXT.md` with numbers.
- The self-test carries about 120 checks, green on both hosts in CI, each new check proved red on a plant.
- `windowsweep-docs.aoneahsan.com` answers 200 with HTTPS and is linked from the README and `package.json`.
- Topics, wiki off, tags and releases in place; portfolio-info file, master links JSON and ORCID work exist.
- Sections 22-26 and the new target rows ship as 1.1.0 with docs, README table and CHANGELOG in step.

## Phases

`00-tracker.json` holds the status; `remaining-work.md` at the repository root holds the specification
of every `RW-` item (evidence, success criteria, acceptance points, what not to do).
