# The phase order, and the two ways he says no

Procedural depth lifted out of `SKILL.md` to keep it inside its word budget. These are rules, not background —
read them before running A0.

## 🔴 The folder carries the project slug — rename a plain one before anything else

`<slug>-click-dummy/`, e.g. `lifewell-click-dummy/`. An editor disambiguates identical `index.html` tabs by
parent folder, so a dozen folders all named `click-dummy` are indistinguishable once several are open.

**A folder still named plain `click-dummy/` predates the convention.** `git mv` it and sweep its referrers
before doing any other work in that project. Two things make that sweep bigger than it looks: the app tree is
usually a **separate git repo**, so a `git ls-files` at the planning root sees only half the referrers; and any
`.gitignore` line naming the folder by prefix must be rewritten **before** the rename, or the next `git add -A`
commits whatever it was ignoring. Never rewrite `aoneahsan-cccs-click-dummy` / `aoneahsan-ccca-click-dummy` —
those are skill identifiers, not paths.

## The order — the depth behind it

The sequence itself is in `SKILL.md`. This is what it costs to get wrong.

**A1 before A3 is deliberate.** Nobody falls in love with a wall of buttons — but the gallery must still precede
the bulk of the pages, or page 9 invents a fourth button size and page 22 a second table style. **From A4 on, a
page needing something the gallery lacks means the gallery is incomplete** — add it there, not inline.

🔴 **A1 delivers one home page, not a menu** (owner, 2026-07-30). The owner is a developer and returns *"not
sure, do your best"* to an aesthetic question (`~/.claude/rules/frontend-ui-standards.md` §8), so directions
built for him to choose between cost several builds and buy nothing. Explore alternatives for **yourself**, at
whatever fidelity settles the question — a sketch is usually enough — then **synthesise** rather than pick, and
build the one strongest page properly. Record the decision and the alternatives you set aside in the decisions
log, so his reaction to A1 has an argument to push against.

**Keep every axis URL-shareable** (`?palette=warm&appearance=dark`), which is what makes redirection cheap when
the direction misses and what lets him send back a link instead of a description.

🔴 **Claim the palette before A1** in `~/.claude/palettes/project-palettes.json`. Prefer 25° clearance;
if unavailable, maximize the feasible minimum circular distance and document it — unclaimed, two products
drift onto the same green. **The registry has parallel writers**, so re-read it immediately before claiming
rather than trusting an hour-old snapshot. The separation rule
governs **`primaryHue` only**; treating accent or warning hues as claims would close the whole warm band. The
three treatments built at A2 are **not** additional claims: `colour-variants.md`.

## 🔴 He has two ways to say no, and they mean different things

Both keep the file. Neither replacement is ever a recolour. **Move the current version before building the
replacement**, never overwrite it — git history is a real record and a useless archive, because nobody browses
it to see what a page used to look like.

| He says | Folder | Status | The next version must be |
|---|---|---|---|
| rejects it | `_rejected/NN-<slug>-<YYYY-MM-DD>/` | dead — kept as evidence | **a genuinely new direction**: new palette treatment, type pairing, layout system, motion character |
| "keep this one, but show me another" | `_kept/NN-<slug>-<YYYY-MM-DD>/` | 🔴 **still a live candidate** | a new direction that **names in writing** what it carries forward from each kept candidate, and is still a new concept |

The live version is always `index.html`. A `_kept/` candidate he later chooses is **promoted back** to
`index.html`, and the one it displaces moves into `_kept/` in turn.

### The keep-and-branch synthesis rule

When he keeps one and asks for another, he is not asking for a variation — he is buying more information. So the
new direction must do both things at once:

1. **Carry the good parts forward, named explicitly.** State in the hand-back which element came from which
   kept candidate — "the banded section rhythm from `01-almanac`, the card elevation from `02-vital`". A vague
   "incorporated feedback" is not a record.
2. **Still be a new concept.** Different layout system, different type pairing, different motion character.

🔴 **The red flag that catches a fake new direction:** diff it against the candidate it followed. If the
difference is mostly token values, it is a recolour wearing a new name — rebuild it. Two builds that differ
only in accent hue answer a question he did not ask.

### Both archives, same requirements

- **Self-contained snapshots** — the page plus the built CSS and JS it needs, so it still opens over `file://`
  a year later. Markup alone is no better than `git show`.
- Each carries a `README.md` with **his words verbatim**, the date, the commit it came from, and what was
  actually wrong (or, for a kept one, what is worth keeping).
- 🔴 **Exclude both from the build's source scan** — `@source not "./_rejected"; @source not "./_kept";` —
  because Tailwind v4 scans the whole tree below its CSS file. Otherwise dead markup keeps injecting classes
  into the shipped stylesheet and the archives cost the live page weight forever.

**Last updated:** 2026-11-06 (palette capacity rule). Earlier 2026-07-30.

---

## Context cost during A4+ — why one continuing agent beats six fresh ones

A4+ is the longest, most dispatch-heavy stretch of the phase: dozens of pages, each a write. **Every agent
pays the whole fixed payload before reading the task** — global `CLAUDE.md`, all of `~/.claude/rules/`, its
preloaded skill bodies, the tool definitions. Measured 2026-08-06: a probe agent calling **zero tools** burned
**195,249 tokens** (`~/.claude/rules/context-budget.md`).

So batch pages into **one continuing agent** and drive it with `SendMessage`; a fresh `Agent` call per batch
repays the floor every time. When a dispatch dies mid-run — which happens on long waves — **resume it rather
than re-dispatching**, both to keep its context and to avoid paying the floor twice for the same work.

**The dummy's own files are read by those agents.** Keep the shared layer's header contract (`wire.js`) and
the page inventory skimmable, and hand each batch the **rows it owns**, never the whole inventory.

**And measure before you blame the model.** When context disappears faster than the work explains, the cause
is almost always a fixed payload nobody has weighed — not the conversation. `wc -c ~/.claude/rules/*.md` and
the per-dispatch token count in the agent's own usage report are the two numbers that settle it.

## What the `ext-` skills actually cost — measured, and it is not what it looks like

A dummy project carries 5–14 `ext-*` skills, 125–180 KB of `SKILL.md`. That number alarms people into
trimming the set. **Do not.** Measured 2026-08-06 across the fleet:

| | Bytes | Loads |
|---|---|---|
| local skill **descriptions** | 37,816 B (all projects) | **at session start** |
| local skill **bodies** | 1,445,759 B | **only when invoked** |

Descriptions are **2%** of bodies. The heaviest dummy project pays ~4.7 KB (~1.2k tokens) at rest for eleven
skills. **Copying the craft loadout in is cheap** — `craft-loadout.md` stands unchanged.

🔴 **The real spend is invoking them**, and that is the cost of doing the work, not waste: four or five
bodies in one design session is 60–90 KB. So the discipline is *phase-scoped invocation*, never a smaller
library — load what A1 needs at A1, and the gallery skills at A3.

**Verify a copy by its frontmatter, not its folder.** A renamed folder whose `name:` was not rewritten fails
discovery silently and costs nothing precisely because it never loads — which is also why nobody notices.

## Context and writer budget (moved from `SKILL.md` on 2026-10-26, verbatim)

Use one continuing heavy writer per page wave. Dispatch only current inventory rows, target pages, shared
foundations, applicable decisions, phase loadout, and gates. Never request every page, kit file, or legacy tree.

Moved with it, from the folder section: 🔴 **Never `<slug>/index.html`.** Only `vendor/`, `assets/` and the two
archives (`_rejected/`, `_kept/`) are subfolders, so every reviewable page is one double-click away.
