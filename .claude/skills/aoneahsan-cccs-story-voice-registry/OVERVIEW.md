# Story voice registry — overview

## Purpose

The global index of project voices, and the check that keeps them distinct. The system is installed
globally so every project gets it; the registry is what stops "every project gets it" from becoming "every
project sounds the same". It is tracked in the notebook and symlinked to `~/.claude/story-system/`, the
same shape as the palette registry, and it carries the same parallel-writer discipline.

## What this skill does

- Creates and updates `~/.claude/story-system/registry/index.md` and one `<slug>.md` entry per voice.
- Runs the three-test uniqueness check (palette ratio, diction overlap, side-by-side reading) against
  every non-retired entry and writes the verdict into the entry.
- Shows a collision at GATE 1 with two concrete differentiation proposals.
- Keeps the slug equal to the palette registry's slug so both registries join on one key.
- Retires voices instead of deleting them.

## When it gets invoked

- `/story-init` (before GATE 1)
- "which voices do we have?", "does this sound like another product?", "retire the voice for X"
- the keeper's record step after GATE 4
- a palette or fingerprint change in an approved Bible

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Every project with a Story Bible, plus the owner's personal voice |
| Stack override | Stack-independent |

## Sources

| Source | Record |
|---|---|
| The storytelling-system spec § Global Voice Registry format | `global-audit-reports-records/storytelling-content-system/00-source-research.md` |
| The palette registry's parallel-writer incident (2026-08-13) | `aoneahsan-cccs-frontend-design/references/palette-registry.md` |

## Related skills

- `aoneahsan-cccs-story-bible` — produces the fingerprint the entry summarises.
- `aoneahsan-cccs-story-personal-voice` — owns the `personal-voice` entry.
- `aoneahsan-cccs-frontend-design` — the sibling registry (palettes).

## Maintenance

- **Living registries this skill points at:** `~/.claude/story-system/registry/index.md`,
  `~/.claude/palettes/project-palettes.json`.
- **Last reviewed:** 2026-08-27
