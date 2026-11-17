# Dispatch packets — one per role

Every packet is self-contained: the agent sees nothing of this session. Build it from the parts in
`aoneahsan-cccs-subagent-orchestration/references/dispatch-prompt-template.md`. The `EXCLUSIVE SCOPE`
block is pasted verbatim into every write-capable dispatch; a read-only reviewer gets no scope block and
returns findings as text.

Shared context slice for every role (name the paths, never "read the project"):

```
Bible:        docs/story/story-bible.md            (sections: audience, core promise, palette, glossary, safety)
Fingerprint:  docs/story/voice-fingerprint.md      (the 8–12 sample sentences + do/don't)
Map row:      docs/story/content-map.md § <surface>
Draft:        docs/story/drafts/<surface>.md
Log tail:     docs/story/decision-log.md           (the last run block only)
Craft:        aoneahsan-cccs-story-craft → references/surface-<surface>.md + the framework it names
```

Report contract for every role: outcome first · files touched (must equal the scope) · the role's checklist
verdicts · `NEEDS DECISION: <question>` lines · anything returned for the main session.

## writer — `aoneahsan-ccca-story-writer` (opus)

```
Goal: Write docs/story/drafts/<surface>.md on-voice for the <surface> row of the content map. Done = a draft
that matches the fingerprint and palette ratio, follows the named framework, carries one concrete specific
per section, sits within the map row's length cap per section, contains no banned phrase, and ends with
the 4-line self-check.

EXCLUSIVE SCOPE
May edit:  docs/story/drafts/<surface>.md
May NOT edit:  everything else (default). Named hot files nearby: docs/story/story-bible.md, docs/story/content-map.md, docs/story/decision-log.md, docs/story/run-state.json
Tracker ownership:  no

Read: <the shared slice>. Framework: <name>. Awareness level: <level>. Target length: <n> words. CTA: <one>.
Invent nothing — a fact, number, name or quote you do not have is a NEEDS DECISION line, not a guess.
Report: the draft path, the self-check (palette · rhythm · length per section vs the cap · unsure spots), NEEDS DECISION lines.
```

Round 2 revision: same packet, plus the reviewer findings pasted verbatim under "Apply these".

## dev-editor — `aoneahsan-ccca-story-dev-editor` (fable, read-only)

```
Goal: Review docs/story/drafts/<surface>.md for structure and story only. Does it follow <framework>? Hook in
the first two sentences? Curiosity gap opened and closed? Emotional arc matches the Bible's palette? Core
promise delivered? Every section within the map row's length cap, and the CTA where the row puts it?
Return at most 5 prioritized changes with the reason for each. If it is on-voice and on-structure, say
PASS and return nothing else.
Read: <the shared slice>. Do not edit anything.
```

## line-editor — `aoneahsan-ccca-story-line-editor` (fable)

```
Goal: Sentence-level pass on docs/story/drafts/<surface>.md — rhythm (burstiness), clarity, transitions, flab.
Keep the structure and every fact exactly as they are; keep the voice. Done = the edited draft plus a diff
summary of what changed and why.

EXCLUSIVE SCOPE
May edit:  docs/story/drafts/<surface>.md
May NOT edit:  everything else. Hot files nearby: docs/story/story-bible.md, docs/story/voice-fingerprint.md
Tracker ownership:  no
```

## copy-editor — `aoneahsan-ccca-story-copy-editor` (fable)

Same scope block as the line editor. Goal: grammar, spelling in the Bible's locale, glossary and naming
consistency, links, formatting — mechanical only, no rewrite of voice or rhythm. Runs **after** the line
editor, never beside it.

## fact-checker — `aoneahsan-ccca-story-fact-checker` (fable, read-only + WebSearch/WebFetch)

```
Goal: Verify every checkable claim, number, name and internal reference in the draft against the Bible's
glossary, prior approved surfaces in docs/story/drafts/, and public sources. Return: VERIFIED (claim → how),
UNVERIFIABLE as NEEDS DECISION lines, CONTRADICTS (claim → what it contradicts). Never approve an invented
fact.
```

## seo-aeo — `aoneahsan-ccca-story-seo-aeo` (fable, read-only)

```
Goal: Check the draft against aoneahsan-cccs-story-craft → aoneahsan-cccs-story-craft/references/aeo-seo.md and the content map's
question map: answer-first under each question heading, question-based H2s, schema suggestion
matching visible content, named author + cited numbers, the target questions covered. Return a pass/fail
checklist and proposed rewrites — propose, never overwrite; never trade voice for a keyword.
```

## hook-engagement — `aoneahsan-ccca-story-hook-engagement` (fable, read-only)

```
Goal: Score the opening and retention: is line one un-scrollable-past? Where are the curiosity gap, open
loops and pattern breaks? Return the score with reasons and 2–3 stronger hook variants written in the
fingerprint's voice.
```

## humor-emotion — `aoneahsan-ccca-story-humor-emotion` (fable, read-only)

```
Goal: Audit whether the Bible's palette ratio is actually delivered beat by beat, and whether every light
line is appropriate. If the surface is a safety surface (therapy, crisis, legal, medical, financial, error
of consequence), enforce aoneahsan-cccs-story-craft/references/safety.md and flag any violation as a HARD
FAIL. Return: palette delivered (band → where), misfires, hard flags.
```

## bible-keeper — `aoneahsan-ccca-story-bible-keeper` (opus)

```
Goal: Reconcile the reviewer findings against the Bible. Accept what the Bible supports; where a change
would alter the voice or palette, do NOT allow it silently — return NEEDS DECISION. After GATE 4: update
story-bible.md (new motifs, terms), append the run block to decision-log.md, update the registry entry, and
stamp run-state.json recorded.

EXCLUSIVE SCOPE
May edit:  docs/story/story-bible.md, docs/story/decision-log.md, docs/story/run-state.json, ~/.claude/story-system/registry/<slug>.md, ~/.claude/story-system/registry/index.md
May NOT edit:  everything else — never the draft, never voice-fingerprint.md without a recorded decision.
Tracker ownership:  yes
```

Two checks the keeper runs before it reconciles (windowsweep D91, 2026-11-06): grep a row's convention against
that same row's approved strings before applying it to a new string, because the rule may be narrower than the
row; and check a glossary "never" against its approved uses, because an approved surface can already use the word.

## finalizer — `aoneahsan-ccca-story-finalizer` (opus)

```
Goal: Run the humanize pass (aoneahsan-cccs-story-humanize, rewrite mode) on the draft without changing
meaning or facts; confirm the fact-checker and seo-aeo checklists passed; produce the publish-ready file and
a one-paragraph "what changed and why". Never publish — GATE 4 is the main session's.

EXCLUSIVE SCOPE
May edit:  docs/story/drafts/<surface>.md
May NOT edit:  everything else. Hot files nearby: docs/story/story-bible.md, docs/story/decision-log.md
Tracker ownership:  no
```

## story-lead — `aoneahsan-ccca-story-lead` (fable)

Not dispatched. It is the optional main-thread entry point (`claude --agent aoneahsan-ccca-story-lead`),
whose value is the `Agent(...)` allowlist: it can spawn only the ten roles above and does not write prose.
If it is ever dispatched as a sub-agent, it returns `BLOCKED` — gates cannot be run from inside a sub-agent.

## The lean panel — `--lean`, defined here and nowhere else

An explicit per-run override the owner names; never the default (owner decision 2026-08-27). Order, per
surface: `dev-editor` → writer revises → `line-editor` → `copy-editor` (sequential, the same scope block
as above) → `fact-checker`, **plus `humor-emotion` whenever the surface is a safety surface** (those two
run together, both read-only) → `bible-keeper` reconciles. Dropped against the full panel: `seo-aeo` and
`hook-engagement`. The two-round bound and GATE 3 apply unchanged. Every other file that mentions
`--lean` points here; a second definition anywhere is drift.

## Parallelism, stated once

Only the four specialists run together, and only because none of them can write. Every other role runs one
at a time on the single draft file. Post-wave: compare each report's files-touched list to its scope.
