# tagline — one sentence, and every place that has to carry it

Content-map row **2** · awareness **unaware, scanning a list** · structure **one sentence, no context
assumed** · tone band **P only** · length **≤ 110 characters** · CTA **none** · schema **none**.

🔴 **The prompt for this surface said three places. There are five.** That correction comes first, because a
tagline change that reaches three files and misses two is worse than no change at all. It leaves the product
describing itself two ways. The two that get missed are the ones a person sees when they run the tool and
when they land on the documentation.

| # | Place | Current value | ASCII-only? |
|---|---|---|---|
| 1 | `package.json` → `description` | the shared line below | not required |
| 2 | `lib/constants.ps1:10` → `$Script:WS_TAGLINE` | the shared line below | 🔴 **yes, enforced** |
| 3 | `README.md:7` → the header `<p><strong>` | the shared line below | not required |
| 4 | `windowsweep-docs/docusaurus.config.ts:28` → `tagline` | **a different sentence** | not required |
| 5 | `desktop/src-tauri/resources/windowsweep/lib/constants.ps1:10` | the shared line below | 🔴 **yes** |

Places 1, 2, 3 and 5 say:

```
Safe-by-default Windows cleanup CLI - developer-aware, dry-run first, zero install via npx.
```

Place 4 says something else entirely:

```
Safe, developer-aware Windows cleanup CLI - one deletion chokepoint, a real dry-run, and it never phones home.
```

So the three places named in the brief already disagree today, before anything is rewritten. Place 5 is the
engine copy the desktop app bundles. `yarn sync:cli` regenerates it from place 2, so it follows on its own,
but only when that command runs. It has not run since the string last changed.

## What the current line gets wrong

**"Safe-by-default" is an adjective doing a refusal's job.** The Bible's band R is explicit: the reassurance
is always a specific refusal, never an adjective like "safe". A reader who has watched a cleaner delete
something they needed has already been told a tool was safe. The word costs 15 characters and buys nothing
from exactly the audience this product was written for.

**The rest of the line is good and should survive.** "Developer-aware", "dry-run first" and "zero install
via npx" are three checkable claims: `Dev = $true` on eight sections in `WS_SECTIONS` (1, 2, 3, 4, 5, 17, 20
and 22), `--dry-run` short-circuiting every deletion helper, and a zero-dependency Node launcher published
as a 109 kB tarball.
Only the first clause needs replacing.

## The recommendation

```
Developer-aware Windows cleanup CLI: dry-run first, personal folders refused, zero install via npx.
```

**99 characters. ASCII only.** Straight quotes are not needed, the only punctuation is a colon and two
commas, and there is no dash, ellipsis or apostrophe in it — so `WS_TAGLINE` takes it unchanged and self-test
check [4] ("ASCII-only source") stays green.

Why this one. It swaps the adjective for the refusal and keeps everything else in place, so the four
in-agreement files change by one clause rather than being rewritten. "Personal folders refused" is the same
promise "safe-by-default" was gesturing at, except a reader can go and check it: 66 protected subtrees in
`Initialize-Safety`, and self-test check [6] walking all 105 declared targets to prove none sits inside one.
It reads in a list of search results with nothing around it, because the first four words say what it is and
who it is for. The three clauses after the colon are three separate reasons to click. It carries the words a
person actually types (Windows, cleanup, CLI, dry-run) without stuffing them.

**Where it goes:** all five places. Places 1, 2, 3 and 5 take it as a replacement; place 4 takes it as a
replacement for its own different sentence, which is the change that ends the divergence.

## Alternate A — the more concrete refusal

```
Developer-aware Windows cleanup CLI: dry-run first, documents and credentials refused, zero install via npx.
```

**108 characters. ASCII only.** Two under the cap.

Names two of the protected categories instead of the category name. Stronger for a reader who scans for
the specific thing they are afraid of losing, and both nouns are named in the Bible's first supporting
commitment. Against it: 108 leaves two characters of headroom, so any later addition breaks the cap, and
"personal folders" is
the phrase the rest of the product uses. The README's comparison table says "Personal folders", and matching
it keeps one idea to one wording.

**Where it goes:** all five places, same as the recommendation.

## Alternate B — the offline claim instead of the install claim

```
Developer-aware Windows cleanup CLI: dry-run first, personal folders refused, no network calls.
```

**95 characters. ASCII only.**

Trades "zero install via npx" for the strongest single fact about the tool, and question map row 7 ("does
this cleanup tool send my data anywhere") is one of the eight questions the audience types. Against it: the
npx clause is what removes the reader's last objection to trying it at all, and the offline claim is already
made in the README's Features list, in the FAQ, in `llms.txt` and on the consent screen. This line is also
the one most worth reconsidering when the desktop app ships, because the app does make network calls once a
person switches them on, and a tagline shared with a docs site that covers both surfaces would then be
carrying a claim that is true of only one of them.

**Where it goes:** all five places, with the caveat above about place 4, the docs site, which fronts the
desktop page as well as the CLI. That caveat is real.

## Character counts, side by side

| Line | Chars | ASCII | Fits the console banner (≤ 75) |
|---|---|---|---|
| Current, places 1/2/3/5 | 91 | yes | no |
| Current, place 4 | 110 | yes (uses `-`, not an en dash) | no |
| **Recommended** | **99** | **yes** | no |
| Alternate A | 108 | yes | no |
| Alternate B | 95 | yes | no |

**About that last column.** `Write-Box` in `lib/ui.ps1:99` draws a rule of exactly 78 glyphs and prints the
subtitle with three spaces of indent, so a tagline over 75 characters runs past the rule it sits under. Every
candidate here does, and so does the line shipping today at 91. It is cosmetic rather than broken, and no
candidate that fits 75 characters also carries all three claims. The shortest honest attempt,
"Developer-aware Windows cleanup CLI: dry-run first, personal folders refused.", is 77 and still misses one.
So this is a known cosmetic overflow in the walkthrough banner rather than a constraint on the wording.

## Two things that are not decisions

**"Cleanup" stays.** The glossary bans `clean` and `sweep` as **verbs**. "Cleanup CLI" is a noun compound and
it is the product's own category word: three of the twelve npm keywords contain it; `docs/` uses it
throughout; the approved consent screen says "the cleanup engine makes zero network calls". Replacing it
would cost the surface its search terms and buy nothing the glossary asked for. So it stays.

**Nothing about price.** No candidate says "free", and none should — the decision recorded on 2026-09-05
forbids a pricing claim on any surface, and the word is a banned store word besides. A tagline has no room
for it anyway.

---

## Self-check

**Palette.** Band **P** only, as row 2 requires. The recommended line is four descriptive words and three
factual clauses, with no adjective standing in for a number and no tone at all beyond the register of a
label. Band R is present in substance rather than in style: "personal folders refused" is a refusal, which is
the whole reason it replaced "safe-by-default". No W anywhere. A tagline is read once, cold, by someone
deciding whether to keep scrolling, and a dry aside in that position reads as a product that is not sure what
it is.

**Rhythm.** One sentence, so the rhythm rule applies to the clause lengths instead: three words, three words,
four words after a four-word opening. Shortest unit "dry-run first" at two words; longest "zero install via
npx" at four.

**Length.** 99 characters against row 2's cap of 110, with 11 characters of headroom. Alternate A is 108 and
alternate B is 95. Every candidate is ASCII-only, verified by character-code check, which place 2 and place 5
require and which self-test check [4] enforces on the whole engine source.

**Unsure.** No `NEEDS DECISION` on the wording. One finding needs an owner answer of a different kind, and it
is recorded above rather than as a question, because it is a fact rather than a choice: place 4 currently
carries a different sentence, so adopting any candidate here is also a decision to end that divergence.
That is the whole of it. If the docs site's line is deliberate and meant to stay different, then row 2's
premise, that the places must agree, is what needs revisiting, and that is a content-map change rather than a
copy change.
