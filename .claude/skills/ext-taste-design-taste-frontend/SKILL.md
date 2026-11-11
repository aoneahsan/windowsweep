---
name: ext-taste-design-taste-frontend
description: Brief inference and design dials for WindowSweep landing pages, the approved click dummies, and redesigns. Use before visual design to avoid a generic or wrongly pitched direction.
metadata:
  source: taste-skill/design-taste-frontend
  sourceCommit: e988add
  adaptation: Brief and design judgement only; project skills own stack and implementation.
---

# Design taste for WindowSweep

This is a focused fork of the upstream taste skill. Its useful contribution here is the design read and three dials: variance, motion and density. WindowSweep's approved desktop and web dummies, brand kit, story Bible, tokens and component rules own the actual design. Do not use this skill to select a component library, font service, icon package, image source, host or animation dependency.

## When to use

Use it at the start of a landing page, marketing section, click dummy or redesign. For a maintenance edit, use the approved neighbouring screen instead. It does not apply to backend logic, data tables or a multistep product workflow.

## Read the brief before drawing

Record one sentence for each signal from project evidence:

1. **Audience and job:** who is arriving, and what they are trying to do on this page.
2. **Promise and proof:** what WindowSweep actually does, with the specific source for each visible claim.
3. **Visual material:** the current mark, type, colours, UI captures and motifs from the approved dummy and brand kit.
4. **Page role:** home, download, pricing, compare, account or another named route, and the action it must make obvious.

Then write a one-line design read: “For [audience] doing [job], this page should feel [specific qualities] and make [action] easy.” A generic read that still fits another product fails. Check the read against the owner vision and the current page before producing markup.

## Set the three dials

Use values from 1 to 10, with a one-line reason tied to the page role.

| Dial | 1 | 10 | WindowSweep check |
|---|---|---|---|
| Variance | Repeated, quiet structure | Strong changes in scale and composition | Keep the approved product hierarchy; vary only where the page's job changes. |
| Motion | Static | Many purposeful transitions | Motion must explain an interaction or reinforce the sweep metaphor; reduced motion keeps the task clear. |
| Density | Spacious, few facts | Compact, many facts | The home page earns breathing room; comparison and account pages may carry more facts. |

Use the dials to test a direction, not to generate arbitrary decoration. A page can be restrained without being interchangeable. A comparison page can be dense without burying its decisive information.

## Review the result

- Compare it with the approved dummy and adjacent screens at the actual target widths. The existing layout and words win until the dummy itself is amended.
- Look for repeated eyebrow labels, generic gradients, ornamental cards, fake product screenshots, unearned testimonials and filler claims. Remove each instance that has no WindowSweep purpose.
- Check that the main action, destructive-operation safety language, keyboard path and reduced-motion version remain clear.
- Apply the house `aoneahsan-cccs-design-process`, `-frontend-design`, `-click-dummy`, `-custom-made` and story skills for their respective decisions. The browser keeps its default pointer.
