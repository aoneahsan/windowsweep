---
name: aoneahsan-cccs-story-bible
description: 'Builds and maintains a project''s Story Bible at docs/story/ — the Discover interview in small batches, the eleven-section Bible, the voice fingerprint from supplied samples, the decision log and the run state. Use for /story-init, when a project has no docs/story/ or an unapproved Bible, when the owner pastes writing samples to calibrate a project''s voice, or when an approved surface adds a motif, term or decision the Bible must absorb.'
metadata:
  source: global-audit-reports-records/storytelling-content-system/00-source-research.md § Story Bible template, § Discover; prompts (b) and (c)
---

# Story Bible

## Overview

The Bible is the contract every writer and reviewer works from: what the project is, who it is for, the one
promise, the emotional ratio, the voice in sample sentences, the structure, the glossary, the surfaces, the
questions to answer, the safety lines. It is built **from evidence first, then from the owner's answers,
which outrank the evidence**, and it is not used until the owner approves it at GATE 1.

**The standard:** `docs/story/` exists at the same path in every project; the Bible has all eleven sections
filled or marked `NEEDS DECISION`; the fingerprint has 8–12 sample sentences; the registry entry exists with
a uniqueness note; nothing is written against the Bible before GATE 1.

## When to use

- `/story-init [slug]`, or a content request in a project with no `docs/story/story-bible.md`.
- The Bible exists but `run-state.json` says `bibleApproved: false`.
- The owner supplies 1–3 samples of writing he loves for this project — the calibration step.
- The keeper must absorb a new motif, term or recorded decision after a surface is approved.

**Not for:** the owner's own voice for emails and CV — `aoneahsan-cccs-story-personal-voice`.

## Discover — evidence, then the interview

1. Read the evidence, bounded: `package.json` name and description, `README.md` headings, existing UI
   strings (a grep for the i18n catalogue or `t('…')` calls), `docs/PROJECT-CONTEXT.md`, the palette
   registry entry (`~/.claude/palettes/project-palettes.json` — its slug becomes the story slug), the
   store listing if one exists.
2. Write a one-paragraph inference: nature, audience, current voice as it reads today. Show it.
3. Interview in batches of at most four questions, in this order: nature + one-line premise · audience +
   awareness level · core promise · emotional palette ratio + banned tones · surfaces in scope · language ·
   safety context · calibration samples. Exact questions and answer shapes:
   `references/discover-interview.md`.
4. The owner's answers replace the inference. Where he does not answer, the section carries the inference
   marked `(inferred — confirm at GATE 1)`.

## The eleven sections

1 Project nature and one-line premise · 2 Audience and awareness level · 3 Core promise · 4 Emotional
palette (ratio, banded description, banned tones, one sentence per band) · 5 Voice fingerprint (link to
`voice-fingerprint.md`) · 6 Story spine and recurring motifs · 7 Glossary and naming (spelling locale,
capitalisation) · 8 Per-surface rules · 9 SEO/AEO map (link to `content-map.md`) · 10 Safety constraints ·
11 Decision-log pointer and language. Template with one-line guidance per section:
`assets/story-bible.template.md`.

## The fingerprint

With samples: apply the method in `aoneahsan-cccs-story-craft/references/humanize.md` (rhythm, diction,
punctuation, stance, openers/closers, tells) and write 8–12 sentences in-voice plus do/don't lists. Without
samples: write a provisional fingerprint from the palette, mark it `calibrated: false`, and add
`NEEDS DECISION: paste 1–3 samples to calibrate` to the GATE 1 question. Template:
`assets/voice-fingerprint.template.md`.

## Before GATE 1

Register the voice and run the uniqueness check (`aoneahsan-cccs-story-voice-registry`). A collision is
shown at the gate with the differentiation proposal — never silently accepted. Create the whole folder from
the templates: `story-bible.md`, `voice-fingerprint.md`, `content-map.md` (empty rows), `decision-log.md`,
`run-state.json`, `drafts/`. Then ask: the Bible, the fingerprint, the registry entry, in one question with
"approve / change these sections / calibrate first" as options.

## Maintenance after approvals

The keeper adds motifs and glossary terms, bumps the Bible's `Last updated`, and appends the run block to
`decision-log.md`. An approved section is never rewritten silently: the change is a decision-log entry with
the reason, and a palette or fingerprint change re-runs GATE 1.

## Common mistakes

| Mistake | Instead |
|---|---|
| Interviewing before reading the repo | Evidence first; ask only what the repo cannot answer |
| Ten questions in one message | Four at most per batch |
| A fingerprint of adjectives ("warm, witty") | 8–12 sentences the writer can imitate |
| Skipping the uniqueness check | Run it; a shared voice is the failure this system exists to prevent |
| Filling a blank with a plausible guess | `NEEDS DECISION` or `(inferred — confirm)` |

## Going deeper

- `references/discover-interview.md` — the evidence table, the batched questions with answer shapes, the folder checklist.
- `assets/` — the five templates and `example/` (a complete worked Bible for an invented habit app).

## Related skills

`aoneahsan-cccs-story-orchestration` (GATE 1 lives there) · `-story-voice-registry` · `-story-content-map`
· `-story-craft` · `-project-understanding` (the evidence gate) · `-ask-the-owner`
