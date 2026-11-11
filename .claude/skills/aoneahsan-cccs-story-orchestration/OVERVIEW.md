# Story orchestration — overview

## Purpose

The order of operations for the storytelling content system. The spec it comes from wanted an orchestrator
agent; in this fleet the orchestrator is the main session, because only the main session can ask the owner
anything, and every gate is a question. This skill holds the state machine, the four gates, the review
panel's shape, the `NEEDS DECISION` protocol and the `run-state.json` contract the hooks enforce. Owner
decision 2026-08-27: the review panel is always the full one.

## What this skill does

- Runs Discover → Bible → map → write → review → finalize → record in that order, stopping at GATE 1
  (Bible), GATE 2 (plan), GATE 3 (unresolved after two review rounds) and GATE 4 (publish).
- Dispatches the eleven `aoneahsan-ccca-story-*` roles with bounded packets and exclusive scopes; runs the
  four specialist reviewers in parallel and everything that writes sequentially.
- Bounds review loops at two rounds, then records both positions and asks.
- Surfaces every worker `NEEDS DECISION` line to the owner verbatim, the turn it arrives.
- Writes `docs/story/run-state.json` at every transition so the Stop gate and the SessionStart banner can
  read where a run stands.

## When it gets invoked

- `/story-init`, `/story-write <surface>`, `/story-review <surface>`, `/story-finalize <surface>`
- "write the onboarding / blog / listing" in a project that has `docs/story/`
- a worker returned `NEEDS DECISION`, or two reviewers disagree
- `claude --agent aoneahsan-ccca-story-lead` (the spec's optional entry point — same workflow, main thread)

## Where it applies

| Scope | Applies |
|---|---|
| Project types | Any project producing content a person reads |
| Stack override | Stack-independent; the surfaces carry stack constraints |

## Sources

| Source | Record |
|---|---|
| The storytelling-system spec § 2 (workflow / state machine, confidence + stop rules) and § 3 (roles) | `global-audit-reports-records/storytelling-content-system/00-source-research.md` |
| The fleet's delegation law | `~/.claude/rules/subagent-orchestration.md` · `aoneahsan-cccs-subagent-orchestration` |

## Related skills

- `aoneahsan-cccs-story-craft` — what the writer and reviewers apply.
- `aoneahsan-cccs-story-bible` / `-story-content-map` / `-story-voice-registry` — the artefacts the gates approve.
- `aoneahsan-cccs-story-humanize` — the finalize pass.
- `aoneahsan-cccs-ask-the-owner` — how a gate question is asked and held.

## Maintenance

- **Living registries this skill points at:** `~/.claude/rules/storytelling-content.md`,
  `~/.claude/rules/subagent-orchestration.md`.
- **Last reviewed:** 2026-08-27
