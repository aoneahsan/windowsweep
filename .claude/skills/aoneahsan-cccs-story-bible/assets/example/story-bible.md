# Story Bible — Steady

**Slug:** `example-steady-habits` (an invented example; no palette-registry entry) · **Status:** approved by
construction for the worked example — a real project's GATE 1 is the owner's answer · **Last updated:**
2026-08-27 · **Registry:** none (example fixtures never enter `~/.claude/story-system/registry/`)

> Every answer below is an ASSUMPTION written for the dry run, not an owner decision. The decision log
> names each one.

## 1. Project nature and one-line premise

Steady is a Capacitor + React habit tracker for university students who live with anxiety. It counts the
entries you make and never the days you don't, so a missed day is a gap on the week view and nothing more.
Android first, free tier plus Steady Plus; English only.

## 2. Audience

**Who:** Amina, 20, second year. Forgets to eat in exam weeks. Has installed three productivity apps and
deleted each one by March because the streak screen made her feel worse. · **Awareness level:**
problem-aware (she knows the scoreboard apps hurt; she does not know a quieter kind exists) · **Fears:**
being graded by an app; losing "progress"; being told to push harder · **Wants:** to notice her own patterns
without a score; something that stays quiet until asked.

## 3. Core promise

You will see your weeks honestly, without being scored for them.

## 4. Emotional palette

**Ratio:** 70 % warm-competent, 20 % dry humor, 10 % quiet gravity

| Band | Share | One sentence in this band |
|---|---|---|
| warm-competent | 70 % | Every entry is one line: what you did, how it felt. Six words is plenty. |
| dry humor | 20 % | We are an app. An app is not a person, and it knows it. |
| quiet gravity | 10 % | Some days you won't open Steady. That's fine. It'll be here. |

**Banned tones:** cheerleading ("You've got this!") · sarcasm at the user · cuteness in an error or in the
low-mood flow · urgency of any kind
**Humor off on:** the check-in flow after a low mood is logged · every error · the crisis screen · any
notification

## 5. Voice fingerprint

See `voice-fingerprint.md` (`calibrated: false` — provisional, written from the palette; the owner's
samples would replace it). Summary: second person, contractions yes, mean sentence ~13 words with a wide
spread, fragments sparingly, no exclamation marks, at most one em dash per 150 words. Reach for: notice,
gap, week, quiet, entry, small, plain, later, fine, enough, morning, Tuesday. Never: crush, streak, hustle,
level up, fail, lapse, unlock, journey, wellness, empower.

## 6. Story spine and motifs

**Structure:** Kishōtenketsu — no enemy, no battle; a shift of perspective on the same week. · **Throughline:**
the week is the unit, not the day. · **Recurring motifs:** the Tuesday gap · the morning light on the week
view · the kettle (the pause before the work).

## 7. Glossary and naming

| Term | Use | Never |
|---|---|---|
| Steady | capital S, on its own ("open Steady") | "the Steady app", "STEADY" |
| entry | one logged line | check-in, log, record |
| gap | a day with no entry | missed day, broken streak, lapse |
| week view | the home screen | dashboard, timeline |
| Steady Plus | the paid tier | Premium, Pro |
| quiet hours | the no-notification window | do-not-disturb |
| Today is open | the reminder body, verbatim and alone (decided 2026-08-27, onboarding round 1) | any other reminder text; a second sentence |

**Spelling locale:** en-US · **Numbers:** words up to nine, digits from 10; times as "11 pm".

## 8. Per-surface rules

| Surface | Tone | Length | CTA | Notes |
|---|---|---|---|---|
| onboarding | warm-competent, one gravity line on screen 3 | ≤ 40 words per screen, 3 screens | Start a week | reminders opt-in on screen 3; the CTA is the terminal action on screen 3, never screen 1 |
| store-listing | warm-competent only | title ≤ 30 · short ≤ 80 · full ≤ 350 words | Install | no humor, no outcome claims |
| empty-states | warm-competent, dry humor allowed once | heading ≤ 6 words + 1 sentence | one action | BAB |
| notifications | warm-competent | title ≤ 40 chars, body ≤ 90 | none | never shame a gap; quiet hours honored |
| crisis-screen | quiet gravity only | ≤ 60 words | call/text 988 | verified line; nothing else on the screen |
| blog | warm-competent with dry humor | 900–1,400 words | read the next post | answer-first under question H2s |

## 9. SEO / AEO map

See `content-map.md` § Question map. Schema: `SoftwareApplication` (listing page), `Article` + `FAQPage`
(blog). Named author: Ahsan Mahmood · Updated-date policy: `versioned` for docs, `dated` for the blog.

## 10. Safety constraints

**Profile:** mental-health · **Crisis line(s):** en-US — 988 Suicide & Crisis Lifeline, call or text 988
(named in the craft skill's safety reference; re-verify for every locale before shipping) · **Never claim:**
reduces anxiety, treats, is clinically proven, improves grades · **Complement-not-replace line:** "Steady
works alongside the people who help you. It doesn't replace them." · No streak counter anywhere; entries
are counted, days are not. Reminders opt-in with quiet hours. Nothing the reader wrote is logged or sent to
analytics.

## 11. Decision log and language

`decision-log.md` (append-only). **Language:** English only (en-US).
