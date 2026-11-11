# Story Bible — overview

## Purpose

Every project gets one recorded voice, and every writer works from the same contract. The Story Bible is
that contract, built at `docs/story/` from repository evidence and the owner's answers, approved once at
GATE 1, and maintained by the bible-keeper role as surfaces are approved. A project without a Bible gets no
prose — that rule is what stops every product from sounding like the same assistant.

## What this skill does

- Runs Discover: bounded evidence read, a shown inference, then the interview in batches of four.
- Fills the eleven-section Bible and the voice fingerprint (8–12 in-voice sentences) from templates.
- Creates the whole `docs/story/` folder at the fixed path: Bible, fingerprint, content map, decision log,
  run state, `drafts/`.
- Hands the voice to the registry for the uniqueness check before GATE 1.
- Absorbs later motifs, terms and decisions without silently rewriting approved sections.

## When it gets invoked

- "/story-init", "set up the story system for this project", "build the story bible"
- a content request in a project that has no `docs/story/`
- "here are some samples of writing I love for this project" (calibration)
- after GATE 4, when the keeper records what a surface added

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Any project producing content a person reads |
| Stack override | The evidence sources differ by stack (pubspec vs package.json); the Bible does not |

## Sources

| Source | Record |
|---|---|
| The storytelling-system spec § Story Bible template, § Discover, prompts (b) and (c) | `global-audit-reports-records/storytelling-content-system/00-source-research.md` |

## Related skills

- `aoneahsan-cccs-story-orchestration` — GATE 1 and the run state.
- `aoneahsan-cccs-story-voice-registry` — the global index and the uniqueness check.
- `aoneahsan-cccs-story-content-map` — the per-surface plan the Bible links to.
- `aoneahsan-cccs-project-understanding` — the evidence discipline Discover follows.

## Maintenance

- **Living registries this skill points at:** `~/.claude/story-system/registry/index.md`,
  `~/.claude/palettes/project-palettes.json` (the slug), `~/.claude/rules/storytelling-content.md`.
- **Last reviewed:** 2026-08-27
