# Decision log — Steady (worked example)

> Append-only. This is the spec's Phase 5 dry run (2026-08-27): every interview answer is an ASSUMPTION the
> session wrote, not an owner decision, so a reader learns the shape of a log without mistaking it for a
> real project's record.

## run: 2026-08-27 · discover

- **Evidence read:** none — invented project; the inference below is the invention itself.
- **Inference shown:** "A Capacitor + React habit tracker for anxious students, promising honest weeks
  without a score; today's voice would be the generic cheerleading of the category."
- **Assumed answers (would be owner answers):** nature → habit tracker, Android first, free + Steady Plus ·
  audience → Amina, 20, problem-aware · promise → "see your weeks honestly, without being scored" · palette →
  70/20/10 warm-competent / dry / gravity; banned: cheerleading, sarcasm, cuteness in errors, urgency ·
  surfaces → onboarding, store-listing, empty-states, notifications, crisis-screen, one blog post · language
  → en-US only · safety → mental-health profile, 988 for en-US · samples → none supplied.
- **Left provisional:** the fingerprint (`calibrated: false`), with the NEEDS DECISION to calibrate.
- **Registry:** NOT created — example fixtures never enter the real registry. Uniqueness check: the only
  real entry is `personal-voice` (uncalibrated), so the check runs vacuously; recorded as such.
- **GATE 1:** approved by construction for the example (no owner asked).

## run: 2026-08-27 · onboarding · round 0

- **Writer self-check:** palette — warm-competent opens screens 1 and 2 and owns the CTA; dry humor
  deliberately absent (three screens are too short for a minority band to land without stealing the
  opening); gravity lands once, the last three sentences of screen 3 · rhythm — shortest 2 words ("That's
  fine."), longest 41 words (screen 1, sentence 2) · unsure — none; every fact is the Bible's.
- **Lint hook:** PASS (silent) on the write; watched FAIL against a planted version with "delve",
  "seamless" and six uniform 18-word sentences (see the build record).
- **Humanize score:** rows 1–9 pass; row 10 specifics: "Tuesday", "Six words", "Sunday", "the kettle"; row
  11 point of view: "Six words is plenty."; row 12 hedging: "probably" absent — acceptable for microcopy,
  noted; row 13 voice match: checked against the provisional sentences, indistinguishable; row 14 palette:
  delivered as the self-check states.
- **Review panel:** not run — the example stops at the writer's draft so it shows one on-voice sample, not
  a simulated ten-dispatch round.
- **GATE 4:** not reached (example).

## run: 2026-08-27 · onboarding · round 1 (developmental)

- **Reviewer:** `aoneahsan-ccca-story-dev-editor`, dispatched read-only during the confirmation audit later
  the same day — the first real role dispatch the system had (133,188 tokens, 4.5 minutes).
- **Findings applied:** (1) the map row's one CTA, "Start a week", moved from screen 1 to the terminal
  action on screen 3, so the flow no longer exits on "Skip for now" two lines after the gravity line;
  screens 1 and 2 advance with verb + object ("See an entry", "See reminders"). (2) Every screen was over
  the row's 40-word cap (50 / 51 / 46) and the self-check reported no per-screen count: the scoreboard
  negation left screen 1 (now 37 words) and opens screen 2 as the BAB's Before ("No red number waiting for
  you on Wednesday morning"), the After is trimmed to the cap, and the quiet-app idea ("Steady won't say
  what that means") opens screen 3 so the 2→3 seam survives. Screens: 37 / 40 / 40.
- **Line-level, taken with it:** "streak" (a fingerprint Never-word) went with the cut clause · "quiet
  window" → the glossary's "quiet hours" · "colour" → "color" (Bible § 7 is en-US; fingerprint sample 5
  corrected in the same pass) · "Next" → verb + object.
- **NEEDS DECISION → assumed answers (would be owner answers):**
  - The quoted reminder body `"Today is open"` existed nowhere in the Bible or an approved surface, and the
    round-0 self-check said "unsure: none" — the exact miss the NEEDS DECISION rule exists for. Assumed
    (a): recorded as the canonical reminder body — a Bible § 7 glossary row and a note on the notifications
    map row — so the notifications draft inherits it. Rejected: (b) describe without quoting; (c) keep
    "something like" and let notifications differ.
  - The content map's four required internal links do not fit three 40-word screens. Assumed (a):
    onboarding is exempt, recorded under the map's "Internal links" section; the privacy line ("nothing you
    write is sent anywhere") moves to the first-entry empty state, where "how it felt" is actually typed.
- **Contract change this round produced, fleet-wide:** the self-check carries a fourth, `length` line
  (words per section vs the map row's cap) — `aoneahsan-cccs-story-craft` → Self-check, and the writer's
  report.
- **Lint hook:** PASS (silent) on the revised draft, run by hand with the JSON on stdin (exit 0).
- **Round status:** agreed after round 1; the remaining roles were not run — the example still stops short
  of a simulated ten-dispatch round.
