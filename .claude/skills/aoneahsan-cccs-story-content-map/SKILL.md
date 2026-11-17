---
name: aoneahsan-cccs-story-content-map
description: 'Turns an approved Story Bible into the per-surface content plan at docs/story/content-map.md — one row per surface with awareness level, structure, tone band, length, CTA, schema and status — plus the SEO/AEO question map with answer-first sentences. Use after GATE 1 and before any surface is written, when a new surface enters scope, when asked what content a project still owes, or when a draft has no map row to write against.'
metadata:
  source: global-audit-reports-records/storytelling-content-system/00-source-research.md § Content Map/Plan, § SEO/AEO map
---

# Story content map

## Overview

The map is the plan the owner approves at GATE 2: which surfaces get written, in what shape, answering
which questions. A surface with no row is not written — that single rule is what keeps a writer from
improvising a store listing in the blog's voice. Every field in a row is derived from the Bible, so the
map is the Bible applied, never a second opinion.

**The standard:** one row per in-scope surface; every row's structure, tone band, length and CTA trace to
a Bible section or a surface reference; every indexed surface covers the sourced audience questions its
purpose calls for, with concise answer-first sentences; status flips at each gate, by the keeper.

## When to use

- After GATE 1 (`bibleApproved: true`) and before the first `/story-write`.
- A new surface enters scope, or the owner asks "what is left to write?".
- `/story-write <surface>` finds no row — build the row, stop at GATE 2, then write.

**Not for:** the words themselves (`aoneahsan-cccs-story-craft`) or the page-level SEO content contract
(`aoneahsan-cccs-seo-content-writing`, which the blog rows point at).

## The row, field by field

| Field | Derived from |
|---|---|
| Surface | Bible § 8 (in-scope list); the id matches `aoneahsan-cccs-story-craft` → `references/surface-<id>.md` |
| Awareness | Bible § 2, adjusted per surface (a store listing is problem-aware even when the blog audience is unaware) |
| Structure | the awareness → framework table in `aoneahsan-cccs-story-craft/references/copywriting-frameworks.md`, or the story structure the surface reference names |
| Tone band | Bible § 4 — the dominant band, and which minority band may appear; "no humor" on safety surfaces |
| Length | the surface reference's limits |
| CTA | one, from Bible § 3 (the promise) — the same CTA on every surface of one funnel stage |
| Schema | `aoneahsan-cccs-story-craft/references/aeo-seo.md`: Article, FAQPage, SoftwareApplication, HowTo — only what the page renders |
| Status | planned → drafted → in-review → finalized → published |
| Draft | `docs/story/drafts/<surface>.md` |

Template: `aoneahsan-cccs-story-bible` → `assets/content-map.template.md`.

## The question map

For each indexed surface (blog, docs, landing, portfolio), record the questions its audience evidence and
page purpose support. Give each a concise answer-first sentence, relevant query language and a truthful
freshness policy. Questions come from evidence — Search Console queries, store search terms, support
threads, the competitors' FAQ headings — and are labelled with their source; a search volume is never
invented. Method:
`references/question-map.md`.

## GATE 2

Show the map (rows + question map + the out-of-scope list with reasons), ask "approve / change rows /
add a surface", stamp `run-state.json` (`gate: 2`, then `idle / approved`), append the decision-log entry.
A map changed after approval re-runs GATE 2 for the changed rows only.

## Common mistakes

| Mistake | Instead |
|---|---|
| A row whose tone is "friendly" | The Bible's band name and its share |
| Every surface at the same awareness level | Per surface; the listing and the blog differ |
| Questions the writer would like to answer | Questions the audience types, with a source |
| Schema for a FAQ the page does not show | Only rendered content gets schema |
| Writing a surface "quickly" without a row | Row first, GATE 2, then write |

## Going deeper

- `references/question-map.md` — evidence sources, the answer-first recipe, applicable schema and
  purpose-led internal links.

## Related skills

`aoneahsan-cccs-story-bible` (the template lives there) · `-story-orchestration` (GATE 2) · `-story-craft`
· `-seo-content-writing` · `-react-aeo` · `-search-indexing` (where the query evidence comes from)
