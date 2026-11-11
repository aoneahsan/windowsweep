---
name: ext-anthropic-theme-factory
description: Palette and typography coherence checks for WindowSweep's approved desktop and web themes. Use when reviewing a new colour treatment or theme axis in a click dummy.
license: Complete terms in LICENSE.txt
metadata:
  source: anthropics/skills/theme-factory
  sourceCommit: b29e7cf
  adaptation: Existing WindowSweep brand and theme registry remain authoritative.
---

# WindowSweep theme coherence

This is a focused fork of Anthropic's Theme Factory. Its ten palettes and showcase are reference material for comparing hue balance, contrast and type roles. They are not themes to install in WindowSweep. The approved click dummy, brand kit and `aoneahsan-cccs-react-theming` registry own the actual palette and appearance axes.

When reviewing a new colour treatment, inspect the existing tokens first. Check that background, surface, border, text and accent roles form a coherent hierarchy in both light and dark mode. Check contrast on the rendered page, including SVG text and interactive states. Record any proposed change in the click dummy before carrying it into app code.

Use `themes/` or `theme-showcase.pdf` only to study a specific palette relationship. Do not present the preset list as choices to the owner, replace the project's hue, introduce a second theme control or generate a new palette from a generic brief. The current WindowSweep screen beside the change is the comparison target.
