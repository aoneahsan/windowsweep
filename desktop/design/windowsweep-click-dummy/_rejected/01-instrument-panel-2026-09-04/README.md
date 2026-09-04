# Rejected: 01 - "instrument panel" - 2026-09-04

| | |
|---|---|
| Built | 2026-09-04, commit `07c6f37` |
| Rejected | 2026-09-04, same day, at GATE 1 |
| Files | `home.html` - byte-identical to the committed original (44,126 bytes) |
| Replaced by | direction 02 "Reclaim", `../../index.html` |

## His words, verbatim

> *"about the desktop app the UI UX is very basic and not attractive at all, please plan and create a great
> UI UX for the desktop app, use click-dummy custom skill, create a new version, this one is rejected, i do
> not likeit at all"*

## What was actually wrong

Not taste. Five diagnosable process failures, in the order they happened.

### 1. The design read was wrong at the first step

The page was read as a **dashboard / trust-first regulated surface** and the anti-slop dials were set to
VARIANCE 3-5 · MOTION 2-4 · DENSITY 7-8. Those are the dials for an internal tool someone stares at for eight
hours. They cannot produce an attractive page, and no amount of execution quality recovers from them.

windowsweep-desktop is not that. It is a **premium consumer utility opened for two minutes a month**, where
being impressive *is* the product - which is the entire reason people pay for CleanMyMac instead of using the
free alternatives. The correct dials are 7 / 6 / 3 on the moment screens, and cockpit density belongs only in
the section catalogue and the picker.

### 2. The two skills whose omission is a recorded cause of exactly this rejection were both skipped

`aoneahsan-cccs-click-dummy/references/craft-loadout.md` says it in as many words:

> *"The HabitForge rejection proved `-design-process` + `-cloned-skills-library` are not ceremony: those were
> the two omitted bodies, and the otherwise complete page came back generic."*

Neither was in the loadout for this build. The external craft set (six skills, mandatory before any design
phase) was never copied into the project either.

### 3. Pitfall 14 - every section the same shape

Eight consecutive `rounded-panel border border-line bg-panel` cards, in one column, at one width, with
`space-y-5` between them (`home.html:279-497`). Plus a three-equal-cards drive row - item 3 on the
anti-default list. The rhythm rule requires consecutive sections to differ in at least two of {background
band, content width, internal layout}; these differed in none.

### 4. No signature element

`home-page.md` requires one thing on the page that exists nowhere else in the product and is what a reviewer
would describe if asked what it looked like. What shipped was a decorative arc at 10% opacity behind the
number (`home.html:280-283`). That is ornament, not a signature.

### 5. The design argument talked itself into it

`desktop/design/README.md` sections 2 and 7 argued:

> *"restraint reads as competence here… A cleanup tool that feels playful while asking to delete 40 GB feels
> untrustworthy… No decorative SVG on cards, no animated background, no magnetic hover, no custom cursor."*

That reasoning is what produced the page. `~/.claude/rules/frontend-ui-standards.md` §12a is explicit that
restraint governs **ornament** and has never governed **response** - and reading the ceiling as if it were
also the floor is named there as the exact way a product ends up inert.

## What is worth keeping

Little of the visual layer, but three decisions survived into direction 02 and are not re-litigated:

- **The colour claim.** Hue 128 lime was registered correctly and sits in the widest usable gap in the
  registry. The hue was never the problem.
- **The safety information architecture.** Tier and batch policy belong on screen as badges rather than in
  prose. Direction 02 keeps that and draws the chokepoint as well.
- **The honest framing of elevation and SmartScreen** - admitting an unsigned binary's first launch rather
  than hiding it.

Kept as evidence, per `aoneahsan-cccs-click-dummy/references/process.md`: a rejected direction is archived,
never overwritten, because git history is a real record and a useless archive.
