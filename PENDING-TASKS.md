# Pending tasks - windowsweep

Open follow-ups the agent owes this project (fleet format: `### TASK-NNN`; done entries move to
`docs/DONE-TASKS.md`). Owner-only rows live in `docs/MANUAL-TASKS.md`.

Last updated: 2026-09-13 (TASK-004, 006, 007, 009, 010 and 011 closed to `docs/DONE-TASKS.md` by the v3 run; one open; the next id is TASK-013)

### TASK-012 - the desktop click dummy disagrees with itself in two small places

- **What:** (1) the gallery (`desktop/design/windowsweep-click-dummy/g-tables.js:111`) writes "Report only –
  ..." with an en dash while the Sections page (`page-sections.js:82`) writes it with a hyphen; the app
  follows the Sections page. (2) `t-base` (five dummy files, including the card code in `page-elevation.js`)
  and `t-2xl` (`splash.html`) are used in the dummy and styled by no rule in its CSS.
- **Do:** make the gallery match the Sections page; either style the two classes or remove them. Dummy-only -
  the app is already consistent (TASK-007 found zero orphan classes across 333 selectors).
- **Found while:** TASK-006 and TASK-007, 2026-09-13 (A-DESK).
- **Why not fixed there:** outside those tasks' stated scope, and neither changes what a user sees.
- **Priority:** low.
