---
name: aoneahsan-cccs-story-orchestration
description: 'The storytelling workflow: Discover → Story Bible → content map → write → bounded review panel → finalize → record, with four human-approval gates run in the main session and the story roles dispatched under exclusive scopes. Use when a content request arrives in a project that has docs/story/ or needs one, when running /story-init, /story-write, /story-review or /story-finalize, when a worker returns NEEDS DECISION, when reviewers disagree, or when deciding how many roles a surface gets.'
metadata:
  source: global-audit-reports-records/storytelling-content-system/00-source-research.md § workflow / state machine; owner decision 2026-08-27 (always the full panel)
---

# Story orchestration

## Overview

The **main session is the orchestrator**. Only it can ask the owner a question (`AskUserQuestion` is
filtered out of every sub-agent), so every gate lives here; workers return structured results and
`NEEDS DECISION` lines, never a guess. The craft lives in `aoneahsan-cccs-story-craft`; this skill is the
order of operations, the gates, the panel, and the file that records where a run stands.

**The standard:** no prose before an approved Bible · every gate asked, never assumed · at most two review
rounds per surface, then the owner decides · nothing published without GATE 4 · every run leaves
`docs/story/run-state.json` and a decision-log entry behind.

## The state machine

| Phase | Who | Output | Then |
|---|---|---|---|
| Discover | main session (`-story-bible`) | inference + interview answers | — |
| Bible | main session | `docs/story/story-bible.md`, `voice-fingerprint.md`, registry entry + uniqueness note | **GATE 1** approve the Bible |
| Map | main session (`-story-content-map`) | `content-map.md` rows + question map | **GATE 2** approve the plan |
| Write | `aoneahsan-ccca-story-writer` (opus) | `docs/story/drafts/<surface>.md` + self-check | review |
| Review | the panel, ≤ 2 rounds | findings, edits on the draft, keeper reconciliation | **GATE 3** only if still disputed |
| Finalize | `aoneahsan-ccca-story-finalizer` (opus) | publish-ready draft + "what changed and why" | **GATE 4** approve publish |
| Record | `aoneahsan-ccca-story-bible-keeper` (opus) | Bible, decision log, registry updated | run-state `recorded` |

## The panel — full by default (owner decision 2026-08-27)

Order, per surface: writer → `dev-editor` (structure) → writer revises → `line-editor` → `copy-editor`
(sequential, each scoped to the one draft) → `fact-checker` · `seo-aeo` · `hook-engagement` ·
`humor-emotion` **in parallel, read-only** → `bible-keeper` reconciles against the Bible. Reviewers are
`fable`; writers `opus`. Round 2 repeats only the roles that requested changes. After round 2, no third
round: the keeper writes both positions to `decision-log.md`, run-state becomes `disputed`, and the main
session asks the owner (GATE 3) with 2–3 options.

`--lean` is an explicit override the owner names per run, never the default; its one definition is
`references/dispatch-packets.md` → "The lean panel". Cost, stated so it is chosen with eyes open: every
dispatch pays the whole fixed payload (`~/.claude/rules/subagent-orchestration.md` mandate 11) — measured
at ~133k tokens for one read-only reviewer (2026-08-27) — and the full panel is about ten dispatches per
surface.

Dispatch packets per role, verbatim `EXCLUSIVE SCOPE` blocks included: `references/dispatch-packets.md`.

## The four gates

Each gate shows the artefact, asks with `AskUserQuestion` (options, recommendation first), records the
answer in `decision-log.md` and stamps `run-state.json`. "Continue" is not an approval; the question is
re-asked verbatim (`aoneahsan-cccs-ask-the-owner`).

## Confidence and stop rules

Proceed without asking only when all four hold: (a) the Bible exists and is approved, (b) the surface has a
content-map row, (c) no safety flag (therapy, crisis, legal, medical, financial claim), (d) the writer's
self-check reports voice-match confidence at or above its bar. Otherwise stop and ask. **Never refuse the
task, never lower quality to finish**; when blocked, present the specific question with 2–3 options.

## NEEDS DECISION

A worker line `NEEDS DECISION: <question>` is surfaced to the owner **verbatim**, in the same turn it
arrives, with options; the answer is recorded once (decision log; the Bible if durable) and the worker is
continued with it. Batching decisions to the end of a run is the failure this rule prevents.

## `run-state.json`

The main session (or the keeper, when it holds `Tracker ownership: yes`) writes
`docs/story/run-state.json` at every transition. Three hooks read it: the SessionStart banner, and the Stop
gate that refuses to end a turn while a run is `disputed` past round 2, holds an unsurfaced decision, or is
approved but unrecorded. Schema and transitions: `references/run-state.md`.

## Common mistakes

| Mistake | Instead |
|---|---|
| Drafting because the request was "small" | GATE 1 exists for every surface; a small draft off-voice costs more than the gate |
| A third review round | Both positions to the log, ask the owner |
| Two editors dispatched in parallel on one draft | Sequential; one writer per file |
| Asking the owner five decisions at the end | Each one the turn it appears |
| Treating "looks good, continue" as GATE 4 | Re-ask; publish only on an explicit yes |

## Going deeper

- `references/dispatch-packets.md` — the eleven role packets: goal, scope block, context slice, loadout, report.
- `references/run-state.md` — the JSON contract the hooks read, with every transition.

## Related skills

`aoneahsan-cccs-story-craft` · `-story-bible` · `-story-content-map` · `-story-humanize` ·
`-story-voice-registry` · `-subagent-orchestration` (the scope law) · `-ask-the-owner`

<!-- Living law (link, never copy): ~/.claude/rules/storytelling-content.md · ~/.claude/rules/subagent-orchestration.md -->
