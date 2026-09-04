# External skills copied into this project

Copied from the machine-local cloned-skills library (`D:/work/git-cloned-skills/_reviewed`, machine
`windows-p52`). Full catalog + vetting rules: `aoneahsan-cccs-cloned-skills-library`.
**These are FORKS - they do not auto-update.**

Copied 2026-09-04, at the start of the desktop click dummy's second direction. This is the
**mandatory core UI/UX set plus the click-dummy addition** - `recipes.md` requires it before any
design phase begins, and its absence is a recorded cause of the rejection that made this rework
necessary: *"the HabitForge rejection proved `-design-process` + `-cloned-skills-library` are not
ceremony: those were the two omitted bodies, and the otherwise complete page came back generic."*

| Skill folder | Source repo | Why | Fixups applied |
|---|---|---|---|
| `ext-uiuxpm-ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | 192 palettes, 84 styles, 74 font pairings, 98 UX guidelines, queryable per stack | folder renamed, `name:` rewritten, `CLAUDE_PLUGIN_ROOT` -> relative, `python` -> `python3`; **query verified to return real data** |
| `ext-bencium-ui-typography` | bencium-marketplace | Butterick's rules in enforcement mode | folder renamed, `name:` rewritten |
| `ext-accesslint-audit` | accesslint-skills | checks the built result; React Aria only guarantees behaviour | folder renamed, `name:` rewritten |
| `ext-anthropic-theme-factory` | anthropics/skills | coherent palette generation, pairs with the house palette registry | folder renamed, `name:` rewritten |
| `ext-taste-design-taste-frontend` | taste-skill | brief inference + the variance/motion/density dials - the skill that catches a wrong design read | folder renamed, 🔴 `name:` was **`design-taste-frontend`**, not the folder name - the exact silent-discovery-failure the procedure warns about |
| `ext-cds-motion-framer` | claudedesignskills | the desktop app is React; the dummy's motion spec translates into it | folder renamed, `name:` rewritten. ⚠️ that repo is stale - verify version claims independently |

**Verified**, not assumed: every `name:` equals its folder, `grep -rn CLAUDE_PLUGIN_ROOT` returns
nothing in any of the six, no `.env`/`.pem`/`.key` came along, and `search.py "desktop utility app
dark" --design-system` returns a full design system rather than an error.

**Re-sync:** `git -C D:/work/git-cloned-skills/_reviewed/<repo> pull`, re-vet per `security.md`,
re-copy, re-apply the fixups above.
