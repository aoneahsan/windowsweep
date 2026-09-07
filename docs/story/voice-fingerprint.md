# Voice fingerprint - windowsweep

`calibrated: false` — derived from copy already in the repository on 2026-09-05, not from samples the owner
chose. 🔴 **NEEDS DECISION: paste one to three pieces of writing this product should sound like** and this
file is rewritten before any surface is drafted.

Slug: `windowsweep` · Language: en-GB · Palette: 60 precision-before-an-irreversible-act · 25
refusal-as-reassurance · 15 workshop dryness

---

## Twelve sentences in voice

These are the target. A writer imitates the rhythm and the stance, not the subject matter.

1. This was a dry-run. Run the same command without `--dry-run` to reclaim the space.
2. Every deletion passes through one function, with the folder it is allowed to touch declared up front.
3. Your documents, photos, keys and saved passwords are never touched — not by a flag, not by a profile, not
   by accident.
4. Caches that rebuild themselves next time you need them.
5. Six sections need Windows to ask your permission first.
6. It cannot promise a number. Your disk decides that, and `--scan` measures it.
7. Chrome was open, so its cache was left alone; close it and run `windowsweep --only 7 --yes`.
8. A safe run never touches these — you pick, item by item.
9. Never a file path, never your user name, never the contents of anything.
10. The idle gate keeps anything you have used in the last hundred days, which is the point: the next
    install should still be fast.
11. Emptying the Recycle Bin is permanent. That section is behind its own flag for exactly that reason.
12. Twenty-six sections, and the numbers never change meaning — a section number is a promise.

## Rhythm

Short declaratives carrying the load, with one longer sentence every third or fourth to stop the prose
sounding like a manual. **Burstiness target ≥ 0.45.** The longest sentence in a paragraph explains; the
shortest states a fact or a refusal. A paragraph often ends on its shortest sentence.

Sentence length: median 12–16 words, range 4–34. Paragraphs of two to four sentences.

## Diction

**Use:** reclaim · refuse · touch · declared · rehearsal · idle · protected · leave alone · name the path ·
rebuild · exact · measure · behind a flag · you pick

**Never:** blast · nuke · obliterate · crush · wipe out · supercharge · effortless · seamless · robust ·
powerful · blazing · simply · just · easily · unleash · game-changing · revolutionary · sweep away ·
one-click · magic · smart (as a boast) · optimise (as a euphemism for delete)

## Stance and person

Second person for anything the reader does or decides. **Third person for what the tool does** — "windowsweep
refuses", not "we refuse" — because the guarantee belongs to the program, which the reader can inspect, and
not to a company making a promise. First person plural is banned; there is no "we" in a local utility.

Never anthropomorphise the tool beyond plain verbs. It refuses, keeps, lists, measures. It does not "care",
"want", "love" or "think".

## Openers and closers

**Openers.** Start on the fact or the refusal, never on a throat-clearing frame. Banned openings: "In
today's world", "Let's face it", "We all know", "Whether you're a…", "Imagine".

**Closers.** End on the concrete next action or the plain limit. Never end on a rallying summary of what was
just said, and never on an exclamation.

## Punctuation budget

- **Em-dashes: at most one per 150 words.** Prefer a full stop.
- **"not X but Y": at most one per 300 words.**
- **Rule-of-three lists: at most two per 500 words.**
- **Exclamation marks: zero.**
- Semicolons are allowed and used — this voice is comfortable with a semicolon joining two related facts.
- 🔴 **In CLI console strings: ASCII only.** Straight quotes, hyphens rather than dashes, no ellipsis
  character. The engine's self-test fails the build on a non-ASCII byte.

## Tells to avoid

The machine-written tells this voice must not exhibit: every sentence the same length; a triplet in every
paragraph; "not just X, but Y" as a rhythm; opening two consecutive paragraphs with the same word; a summary
sentence that restates the paragraph it ends; hedging stacked two deep ("may potentially"); and adjectives
standing in for numbers ("significant space" instead of the measured figure).

**Restored hedging is correct** where the honest answer is uncertain: "usually", "on most volumes", "in the
runs measured so far" are all in voice, because the product's whole claim is that it does not overstate.

## Do / don't, side by side

| Don't | Do |
|---|---|
| "Safely and effortlessly clean your PC!" | "It names every path before it touches it." |
| "Frees up tons of space" | "22.08 GB on the machine it was built on. Yours will differ; `--scan` measures it." |
| "We never touch your personal files" | "Documents, Desktop and Pictures are refused by the chokepoint." |
| "Smart cleaning technology" | "The idle gate keeps anything used in the last hundred days." |
| "Simply run the command and you're done!" | "Run `npx windowsweep --scan` first. It deletes nothing." |

---

## Correction, 2026-09-07 - specimen 9

Specimen 9 read **"Nothing leaves this machine unless you turn it on."** It was true when this fingerprint
was calibrated and it is no longer true of the desktop window: the owner removed the analytics opt-out on
2026-09-07, so there is nothing to turn on, and the update gate reaches the network on every start. It
remains exactly true of the command-line engine, whose self-test fails the build on an HTTP or socket call.

A false specimen is worse than a missing one, because a specimen is what every future writer matches against
- it teaches the wrong sentence rather than merely failing to teach a right one. So it is replaced rather
than annotated.

Two shapes were considered. Narrowing it to the engine (*"Nothing leaves this machine when you run the
command-line tool"*) is true but weaker as a specimen: the qualifier is the interesting half and it turns a
flat statement into a hedge. The replacement above is the refusal that survived the change unaltered, and it
demonstrates band R the way the Bible defines it - reassurance delivered as a **specific refusal** rather
than as an adjective. It is also the sentence the product actually ships, in `consent.neverSent` and on
Home's ledger.

The Bible's §3 commitments 2 and 3 were corrected in the same pass, for the same reason and with the
measurements beside them.
