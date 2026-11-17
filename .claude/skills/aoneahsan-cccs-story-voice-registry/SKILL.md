---
name: aoneahsan-cccs-story-voice-registry
description: 'Reads and writes the global voice registry at ~/.claude/story-system/registry/ — one index row and one entry per project voice, plus the owner''s personal voice — and runs the uniqueness check that flags a new voice colliding with an existing project''s. Use at /story-init before GATE 1, when a Bible''s palette or fingerprint changes, when the keeper records an approved surface, when asked which voices exist or whether two products sound alike, or when the registry and a project''s docs/story/ disagree.'
metadata:
  source: global-audit-reports-records/storytelling-content-system/00-source-research.md § Global Voice Registry; the palette registry's parallel-writer rule (aoneahsan-cccs-frontend-design → aoneahsan-cccs-frontend-design/references/palette-registry.md)
---

# Story voice registry

## Overview

One global install would make every product sound the same — the opposite of the point. The registry
records each project's voice fingerprint in one place so a new voice is checked against every existing one
before it is approved. It lives in the notebook (`$CC/story-system/registry/`, reached as
`~/.claude/story-system/registry/`), so it travels to every machine with `git pull`.

**The standard:** every project with a Bible has an entry and an index row; every entry carries a
uniqueness note naming the nearest sibling and why they differ; a collision is shown to the owner at GATE 1,
never resolved silently; nothing is deleted — a voice is retired.

## When to use

- Before GATE 1 in `/story-init`: create the entry, run the check.
- The keeper records an approved surface (bump `updated`, add motifs to the entry's summary).
- A palette ratio or fingerprint changes (re-run the check; re-run GATE 1).
- "Which voices do we have?" / "do these two sound the same?" / "retire the voice for X".

## Where it lives, and the parallel-writer rule

```
~/.claude/story-system/registry/index.md      # the table: slug | project | one-line voice | palette | language | status | updated
~/.claude/story-system/registry/<slug>.md     # one entry per voice
~/.claude/story-system/registry/personal-voice.md   # the owner's own voice (aoneahsan-cccs-story-personal-voice)
```

🔴 The file is written from every machine the owner works on. **Read the remote blob before deciding**
(`git show '@{u}':static/assets/claude-code/story-system/registry/index.md` from the notebook root — a bare
`git fetch` does not change the file on disk) and fetch again before writing. The palette registry
produced a duplicate row and an invented collision from a 72-commit-stale checkout on 2026-08-13; the same
staleness here approves a voice another machine already claimed.

## The slug

Equals the project's slug in `~/.claude/palettes/project-palettes.json` when the project has a palette
entry; otherwise the repo name in kebab-case. One slug, both registries, so a session can join them.

## The uniqueness check

Compare the candidate against every entry whose status is not `retired`, on three tests
(`references/registry-format.md` has the exact procedure):

1. **Palette:** same dominant band, same person, humor share within ten points.
2. **Diction:** the two "reach for" lists share four or more words, or the canonical sentences share three
   or more distinctive words.
3. **Read side by side:** the canonical voice sentences, one under the other — would a reader tell them
   apart?

Collision = test 1 **and** (test 2 or test 3). Verdict goes into the entry's uniqueness note either way:
`distinct from <slug> because …`, or `COLLIDES with <slug>: …` plus two differentiation proposals (shift a
band's share; swap the dominant diction set; change person or contraction policy). The owner picks at
GATE 1.

## Entry statuses

`draft` (before GATE 1) · `approved` · `uncalibrated` (personal voice, or a project fingerprint written
without samples) · `retired` (project shelved; kept so nothing new drifts into it by accident).

## Common mistakes

| Mistake | Instead |
|---|---|
| Writing the row from a stale checkout | Read `@{u}` first, fetch before writing |
| "No collision" because no entry has the same adjectives | Run the three tests on ratios and sentences |
| Deleting a shelved project's entry | Status `retired` |
| A slug that differs from the palette slug | Same slug, both registries |
| Fixing a collision by editing the *other* project's entry | The new voice moves; an approved voice is a recorded decision |

## Going deeper

- `references/registry-format.md` — the index table, the entry template, the three tests step by step,
  status transitions.

## Related skills

`aoneahsan-cccs-story-bible` (creates the entry before GATE 1) · `-story-orchestration` (the keeper's record
step) · `-story-personal-voice` (the `personal-voice` entry) · `-frontend-design` (the palette registry
whose slug and parallel-writer rule this one shares)
