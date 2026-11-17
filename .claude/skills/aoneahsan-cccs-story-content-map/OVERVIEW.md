# Story content map — overview

## Purpose

The bridge between the approved Bible and the first draft. It records, per surface, the shape a piece will
take before anyone writes it, and the questions an indexed page must answer first — so GATE 2 approves a
plan, not a surprise. It exists because a writer with a Bible and no plan still improvises the surface.

## What this skill does

- Builds `docs/story/content-map.md`: one row per in-scope surface, every field derived from a Bible
  section or a surface reference.
- Builds the SEO/AEO question map from evidence (Search Console, store search terms, support threads),
  with an answer-first sentence per question and no invented volumes.
- Runs GATE 2 and stamps the run state.
- Keeps the status column honest as the keeper flips it through the gates.

## When it gets invoked

- after GATE 1, before the first `/story-write`
- "what content does this project still owe?"
- a new surface enters scope
- `/story-write <surface>` with no matching row

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Every project with an approved Bible |
| Stack override | Stack-independent; the surface references carry stack limits |

## Sources

| Source | Record |
|---|---|
| The storytelling-system spec § Content Map/Plan and § SEO/AEO map | `global-audit-reports-records/storytelling-content-system/00-source-research.md` |

## Related skills

- `aoneahsan-cccs-story-bible` — the Bible the rows derive from, and the template.
- `aoneahsan-cccs-story-orchestration` — GATE 2.
- `aoneahsan-cccs-seo-content-writing` / `-search-indexing` — the page contract and the query evidence.

## Maintenance

- **Living registries this skill points at:** `~/.claude/rules/storytelling-content.md`,
  `~/.claude/rules/seo-aeo-ranking.md`.
- **Last reviewed:** 2026-08-27
