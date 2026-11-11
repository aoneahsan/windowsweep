# External skills in the WindowSweep product repo

Last Updated: 2026-11-11

These are vetted forks of the reviewed library at `D:/work/git-cloned-skills/_reviewed` on this machine. They do not update automatically. Project guidance and the globally installed `aoneahsan-cccs-*` skills own stack and workflow decisions. Re-vet a source before refreshing any copy.

| Skill folder | Source repo and commit | Why it is here | Project fixups |
|---|---|---|---|
| `ext-uiuxpm-ui-ux-pro-max` | `ui-ux-pro-max-skill` `3b5df75` | Searchable design data for desktop and web | Name and plugin paths fixed earlier; Python search verified; the painted custom cursor style was removed from its data; seventeen cross-stack React rows removed. |
| `ext-bencium-ui-typography` | `bencium-marketplace` `0e3ba07` | Text setting and readability | Name fixed earlier; reference paths corrected; approved type and copy take precedence. |
| `ext-accesslint-audit` | `accesslint-skills` `ceb3fa8` | Structured accessibility checks | Name fixed earlier; system Chrome launch, default subagent and placeholder directions removed. Its optional connector is unavailable in this Codex session, so live rule coverage cannot be claimed here. |
| `ext-anthropic-theme-factory` | `skills` `b29e7cf` | Palette coherence reference | Name fixed earlier; presets are references only, with the approved WindowSweep palette authoritative. |
| `ext-taste-design-taste-frontend` | `taste-skill` `e988add` | Design read and variance, motion and density dials | Name fixed; narrowed to its craft contribution; upstream stack, package and placeholder directions removed. |
| `ext-vercel-vercel-react-best-practices` | `vercel-labs-agent-skills` `7c180d9` | React rendering and bundle craft | Selected fourteen Vite-compatible rules; Next.js, SWR and direct storage guidance excluded. |
| `ext-devkit-zod-validation-utilities` | `developer-kit` `306f428` | Zod v4 boundary examples | Name fixed; boolean parsing and error-tree examples corrected; project validation and i18n rules take precedence. |

The desktop app has no Motion dependency, so its old `ext-cds-motion-framer` copy was removed. Use the globally installed `aoneahsan-cccs-motion` guidance for desktop CSS motion.

To verify a refreshed copy, match every `name:` to its folder, scan instructions and retained files against `aoneahsan-cccs-cloned-skills-library/references/security.md`, run any retained executable, and confirm the project-local Codex link resolves to the same folder. The UI design search is `python3 .claude/skills/ext-uiuxpm-ui-ux-pro-max/scripts/search.py "Windows cleanup desktop utility" --design-system`.
