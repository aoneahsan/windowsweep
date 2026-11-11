# Registry format — the index, the entry, the three tests

## `index.md`

```markdown
# Voice registry

| slug | project | one-line voice | palette | language | status | updated |
|---|---|---|---|---|---|---|
| personal-voice | Ahsan Mahmood (himself) | — | — | en | uncalibrated | 2026-08-27 |
| steady-habits | Steady Habits (mobile) | Calm, plain, a little dry; a friend who studied psychology | 70 warm-competent · 20 dry · 10 gravity | en-US | approved | 2026-08-27 |
```

One row per voice. `palette` is the ratio in shorthand (share and band, dominant first). `status` is one
of `draft` · `approved` · `uncalibrated` · `retired`. `updated` is bumped by whoever last wrote the entry.
Rows are never removed; a retired voice keeps its row with status `retired`.

## `<slug>.md` — the entry

```markdown
# Voice — <Project name> (`<slug>`)

**Status:** draft | approved | uncalibrated | retired · **Updated:** YYYY-MM-DD · **Bible:**
`<repo>/docs/story/story-bible.md` · **Palette registry:** `<slug>` (primaryHue <n>)

## Canonical voice sentence
<One sentence that could only come from this product. The uniqueness check reads this line.>

## Palette
<ratio, e.g. 70 % warm-competent · 20 % dry humor · 10 % quiet gravity> · **Person:** second ·
**Contractions:** yes · **Humor:** 20 %

## Banned tones
<…>

## Diction — reach for
<the ten words>

## Diction — never
<the ten words>

## Motifs
<added by the keeper as surfaces are approved>

## Uniqueness note
Nearest sibling: `<slug>`. Distinct because <ratio / person / diction / sentence differ in these ways>.
— or —
COLLIDES with `<slug>`: <which tests fired>. Proposals: (1) <shift a band share>; (2) <swap the dominant
diction set or change person>. Chosen at GATE 1: <…>.

## History
- YYYY-MM-DD created (draft) · YYYY-MM-DD approved (GATE 1) · YYYY-MM-DD <surface> recorded
```

## The three tests, step by step

Run against every entry whose status is not `retired`, including `personal-voice` when it is calibrated.

**Test 1 — palette.** Fires when all three hold: the dominant band is the same word (normalise
"warm-competent" / "warm competent"); the person is the same; the humor share differs by ten points or
fewer. Two products with different dominant bands cannot collide, whatever their diction.

**Test 2 — diction.** Take each entry's "reach for" list (ten words). Fires when four or more words are
shared. Or: take the canonical sentences, drop stopwords, and fire when three or more distinctive words are
shared.

**Test 3 — side by side.** Print the two canonical sentences and the two first sample sentences from each
fingerprint one under the other. Fires when the session, reading them cold, cannot say which product each
belongs to. This is a judgment; record the reason in the note either way.

**Verdict.** Collision = test 1 and (test 2 or test 3). Otherwise distinct — and the note still names the
nearest sibling (the entry where the most tests came closest) and says why they differ.

## Differentiation proposals — two, concrete

Pick from: move ten or more points between bands so the dominant/minority relationship changes; change the
person (first ↔ second) or the contraction policy; replace the dominant diction set (the ten "reach for"
words) with a set drawn from the product's own domain; change the humor type (dry ↔ warm ↔ none); give the
product a motif the sibling lacks and let it carry the canonical sentence. The new voice moves; an approved
sibling never does.

## Status transitions

`draft` → `approved` at GATE 1 · `draft` → `uncalibrated` when the fingerprint was written without samples
and GATE 1 accepted it provisionally · `uncalibrated` → `approved` after calibration re-runs GATE 1 ·
any → `retired` when the owner shelves the project (the row and file stay).

## Writing discipline

Read `git show '@{u}':static/assets/claude-code/story-system/registry/index.md` before deciding; `git
fetch o` again immediately before writing; write the entry and the row in the same edit; the notebook
commits both under the standing auto-commit authorization.
