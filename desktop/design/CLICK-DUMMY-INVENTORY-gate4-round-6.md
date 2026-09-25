> Section 15 of the click dummy inventory · part of [`CLICK-DUMMY-INVENTORY.md`](CLICK-DUMMY-INVENTORY.md), the index.

# Click dummy inventory - GATE 4 round six

Last Updated: 2026-09-25 · Moved here verbatim from the index under RW-132.

---

## 15. GATE 4 round six — 2026-09-07, the 22:22 build: 🔴 THE GATE CLOSES ON ALL ELEVEN

D-18's five items are closed and every numbered defect against the app is fixed. Detail:
`desktop/design/gate4/GATE4-REPORT.md` §R6. Round-five captures at `gate4-evidence\round5\`.

**Home, Sections and Run all judged MATCH.** Home carries twelve bands and **five** declarations, all visible
and correctly worded; its hero reads `measured 0 minutes ago across 665 targets in 10 sections · re-scan`; the
Idle window is a real slider (`min 7, max 365, value 100`); Sections reads `26 of 26 shown`; Run reads
`READY TO RUN` with eleven real per-section rows and no `-1`.

**The numbers check found nothing this round**, which is the point of having run it every round: hero, rail
and button all read **59.6 GB** against the engine's 63,949,422,308 bytes, and the ladder alone reads
**39.5 GB** against a safe-batch subset of 42,411,472,381 - both exact at 2^30.

### The copy defect that was not on any list

The developer-mode line was **inverted in the direction that understates destruction**: the app said
*"Off. Toolchain caches are left alone."* while the engine clears those caches completely at exactly that
setting. It now carries the dummy's own two lines, verified by toggling the switch and reading both states:
`On - keeping anything used in the last 100 days` and `Off - every cache is offered in full`.
🔴 **No parity count would have caught this** - the sentence was present, well-formed and on the right screen;
only its MEANING was wrong, and only against the engine's behaviour. **A screen can match the dummy's shape
and still lie about what the product does.**

### 🔴 An amendment written into the dummy that the dummy overwrites at runtime

`run.html:132` was amended to `windowsweep --json --all --yes --developer --days 100`. **`page-run.js:205-206`
then rebuilds the old string and writes it over the slot**, so the dummy RENDERS
`windowsweep --all --yes --json --developer` while the app renders the amended one. The app is correct; the
dummy is not.

This is the third variant of one recurring failure in this ledger - a change that reads as applied and is not.
§9 had a body gated while its module still shipped; §12 had a static edit compared against a stale build;
this one has **a static edit defeated by the page's own script**. 🔴 **After amending a dummy slot, LOAD THE
PAGE AND READ THE SLOT.** A `grep` of the HTML confirms only that the intention was written down. Until this
is fixed, any parity run against the RENDERED dummy will report a divergence that does not exist in the
product - which is worse than no check, because it sends the next session after the wrong artefact.

### Where the gate stands

**All eleven screens close.** Filed and not blocking: D-8 and D-9 (Settings), D-13 (Splash copy), **D-21** (the
dummy defect above) and **D-22** (Run's idle hero omits the dummy's `0 B` figure and its
`0 of N sections · not started` line, substituting the dummy's own idle log line - a slot difference,
undeclared, so filed rather than passed).

🔴 **The bar is stated rather than assumed:** rounds four and five closed Sections and Home while their D-18
minors were open and filed. D-22 is that same class, so Run closes on the same terms. Moving the bar now, in
either direction, would be choosing the answer first.

Across six rounds the app went from being unable to start its own engine to eleven screens matching this
dummy, and everything was found by two instruments: **opening the pair side by side, and reading the numbers
against the engine rather than against the screen.**
