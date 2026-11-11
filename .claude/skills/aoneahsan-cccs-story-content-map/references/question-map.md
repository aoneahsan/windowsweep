# The question map — evidence, the answer-first recipe, schema, links

## Where questions come from (in order of trust)

| Source | How | Label |
|---|---|---|
| Google Search Console queries for the property | `aoneahsan-cccs-search-indexing`: the Performance report, queries with impressions and no clicks first | `gsc` |
| Store search terms (Play Console, Chrome Web Store) | the acquisition report's search terms | `store` |
| Support and feedback threads | the questions people actually asked, verbatim | `support` |
| Competitor and category FAQ headings | what the field already answers; find the gap | `field` |
| The audience interview (Bible § 2: fears and wants) | rephrase each fear as the question they would type | `bible` |

Every question carries its label. A search volume, a difficulty score or a ranking is recorded only when
a named tool reported it; otherwise the field is blank. An invented number here becomes a false priority
for months.

## Writing the question

- As typed, not as a marketer would phrase it: "does a habit app work if I have anxiety" beats "Habit
  tracking for anxious users".
- One question per row; a question with "and" is two rows.
- Match the awareness level: unaware audiences ask about the symptom, product-aware audiences ask about
  the product by name.

## The answer-first sentence

Keep it concise enough to answer the question before the supporting paragraph. Put the direct answer in
the first clause, the qualifier second, and a specific verified detail where it helps. It must be true
standing alone. Write it flat, then once more with the detail that only this product knows; keep the second.

Example: "Yes — Steady counts entries, not consecutive days, so a missed Tuesday does not reset anything;
it shows the gap and the next morning." (25 words: answer, mechanism, specific.)

## Mapping questions to surfaces

| Surface | Questions it should answer | Schema |
|---|---|---|
| Landing page | Problem-aware questions needed to understand the promise, evidence and decision | `SoftwareApplication` when the visible product and required properties support it; `FAQPage` only for a visible eligible FAQ |
| Blog post | The primary question and the supporting questions needed to answer it completely | `Article`; `FAQPage` only for a visible eligible FAQ |
| Docs page | Task questions ("how do I …") in headings where that matches reader intent | `HowTo` only for visible step-by-step instructions; otherwise an applicable visible-content type or none |
| Portfolio | "who built X", "can you build Y" | `Person` / `CreativeWork` |
| Store listing | none indexed by engines; the store's own search terms decide the first paragraph | — |

## Freshness policy per row

`static` (evergreen; updated when facts change) · `versioned` (docs; updated when the documented behavior
changes) · `dated` (a page whose date is part of its claim; rechecked before that claim becomes stale).
The visible updated date must be true.

## Purpose-led internal links

Record internal links that help the reader continue the task or verify a relevant claim. A pricing,
privacy, funnel or hub link belongs only when the page purpose calls for it. The SEO/AEO reviewer checks
that each planned link has a reader-facing reason and that rendered links match the map. External-link
behavior follows the project's current frontend and trust policy.
