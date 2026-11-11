# Discover — the evidence table, the batched interview, the folder checklist

## Evidence, bounded

| Source | What it answers | Where |
|---|---|---|
| `package.json` / `pubspec.yaml` name + description | nature, product name spelling | repo root |
| `README.md` headings only | what the project says it is | repo root |
| Existing UI strings | the current voice, as shipped | the i18n catalogue (`src/i18n/**`, `locales/**`) or a grep for `t('` |
| `docs/PROJECT-CONTEXT.md` | identity, audience, non-goals, recorded decisions | if present |
| `~/.claude/palettes/project-palettes.json` | the project slug (the story slug must equal it) and the visual mood already chosen | global registry |
| Store listing / landing page copy | the public promise as currently stated | `docs/play-store/`, `src/pages/` |
| `docs/story/` of a sibling product | a voice this one must differ from | registry |

Read headings and the specific files named; never the whole tree.

## The inference paragraph

One paragraph, shown before any question: "This reads as a <nature> for <audience>, promising <promise>.
The copy today sounds <voice as it reads>. Nearest sibling voice in the registry: <slug>." Every clause
the owner can correct in one line.

## The interview — four questions per batch, in this order

**Batch 1 — nature and audience**
1. One line: what is this, and what is it for? (premise)
2. Who is it for — one person, described the way they would describe themselves?
3. What do they fear, and what do they want? (two short answers)
4. Awareness level: unaware · problem-aware · solution-aware · product-aware · most aware?

**Batch 2 — promise and palette**
5. The single transformation the content delivers, in one sentence.
6. Which of humor · depth · life · death · dark · light · hope · grief apply, and in what ratio?
   (answer shape: "70 % warm-competent, 20 % dry humor, 10 % quiet gravity")
7. Banned tones — what must this never sound like?
8. Person and contractions: first or second person? contractions yes/no?

**Batch 3 — surfaces and language**
9. Which surfaces are in scope now? (webapp-ui · mobile-app + listing · browser-extension · blog ·
   cv-resume · portfolio · readme-docs · social · email-sequence · therapy-mental-health)
10. Language: English only, or Urdu / Roman Urdu on named surfaces?
11. Spelling locale (en-US / en-GB) and any naming rules (product name capitalisation, terms).
12. Story spine preference, if any, and recurring motifs the product already carries.

**Batch 4 — safety and calibration**
13. Is this a therapy / mental-health / legal / medical / financial context? (locks the safety profile)
14. Crisis line(s) for the locale, if 13 is mental health — verified, never invented.
15. Calibration: paste 1–3 samples of writing you love for this project's voice (or name files).
16. Anything the content must never claim?

Ask a batch only after the previous one is answered. A skipped question leaves its section marked
`(inferred — confirm at GATE 1)`.

## The folder checklist

```
docs/story/
├── story-bible.md          from assets/story-bible.template.md, eleven sections
├── voice-fingerprint.md    from assets/voice-fingerprint.template.md, calibrated: true|false
├── content-map.md          from assets/content-map.template.md, one row per in-scope surface (status: planned)
├── decision-log.md         from assets/decision-log.template.md, first entry = the Discover run
├── run-state.json          from assets/run-state.template.json, phase bible / awaiting-approval / gate 1
└── drafts/                 empty; one <surface>.md per surface later
```

Registry: `~/.claude/story-system/registry/<slug>.md` + a row in `index.md`
(`aoneahsan-cccs-story-voice-registry`). Every user-visible string in the project still goes through the
i18n mechanism (`~/.claude/rules/i18n.md`) — the Bible governs what the strings say, not where they live.
