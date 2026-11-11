---
name: ext-accesslint-audit
description: Find and fix WCAG 2.2 accessibility issues. Two modes — report (sweep a codebase or page, produce a prioritized written report, no edits) and fix (audit→edit→verify loop on a target). Prefers direct-CDP live-DOM auditing; falls back to HTML-string audits.
allowed-tools: Read, Edit, Write, Glob, Grep, Bash, Skill, mcp__accesslint__audit_html, mcp__accesslint__audit_live, mcp__accesslint__explain_rule, mcp__accesslint__list_rules
---

You audit accessibility and optionally fix what's broken.

## Pick a mode from the user's intent

- **Report mode** — "audit my codebase", "review src/components/", "what's wrong with this page?", "give me an a11y report". You audit + write a report. **You do not edit files.**
- **Fix mode** — "fix the a11y issues in X", "audit and fix", "make this accessible", "verify the contrast fix landed", or hands you a violation report and asks to apply it. You audit → edit → verify.

If unsure, ask. Don't default-to-fix when the user only asked for an audit.

Work in the main session. Project-local skills do not authorize a subagent.

## Picking a flow

Use the available flow that respects the approved browser and tools.

1. **`audit_live`** — use only when the AccessLint connector is available and attached to the project's approved automation browser. Never let it launch system Chrome. Use `selector` to scope to one component and `wait_for` to gate on async content.
2. **`audit_html`** — for raw HTML strings, files (`Read` first, then `audit_html`), or JSX you've rendered to a string.

For non-URL targets, use flow 2 when the connector is available; otherwise inspect the source manually. For URLs, use flow 1 only when the approved browser and connector are available. Otherwise, inspect the rendered page through the approved automation browser and report that AccessLint's live rule coverage was unavailable. Do not treat a source or HTML-string check as equivalent to a live DOM audit.

For an authenticated session, use the project's non-admin test identity in the approved automation browser. Attach AccessLint only if its connector supports that existing browser; never launch another Chrome profile.

## Scope handling (report mode)

- **Directory path** — analyze all relevant files within.
- **Multiple files** — analyze the listed files plus imports they reach.
- **A URL** — audit it through the approved browser. A dev-server URL also needs that browser.
- **No arguments** — ask the user to narrow scope. Whole-codebase sweeps are rarely the right thing.

State the scope explicitly at the start of your report.

## Approach (report mode)

1. **Map the surface.** Glob/Grep to enumerate components, templates, styles. Sample representative files; don't open everything blindly.
2. **Audit live where possible** — the rendered DOM catches issues source can't show. Use the flow picker above.
3. **Look for patterns.** If one component fails a rule, similar components likely do too. Group by rule ID and component family — don't list 30 instances of the same issue 30 times.
4. **Prioritize by user impact.** Critical/serious first. Many low-impact violations of one rule are often a single root-cause fix.
5. **Use `format: "compact"` for sweep-time calls.** Reserve verbose output for rules you'll expand in the report.
6. **Trust `Source:` lines.** Live-DOM audits against React dev builds attach `Source: <file>:<line> (Symbol)` per violation via DevTools fibers. Use it as the file pointer instead of grepping selectors. Fall back to stable hooks → visible text → tree position when absent.
7. **Stop and ask if a single audit returns more than ~50 violations** — a 200-violation report isn't actionable.

The engine catches what's mechanically detectable. Manual judgment is needed for content clarity, screen-reader announcement quality, keyboard flow coherence, and complex visual contrast — flag those for human review, don't guess.

### Report format

```
# Accessibility audit — <scope>

## Summary
- N critical, M serious, K moderate, J minor (after deduplication)
- Most impactful patterns: <one-line each, max 3>

## Critical (blocks access)
For each pattern:
- **Pattern**: <one-line description>
- **WCAG**: <ID> — <name>
- **Affected files**: <file:line> (×N if repeated)
- **Fix**: <directive from engine output, or specific code change>
- **Why critical**: <user impact>

## Serious
[same shape]

## Moderate / Minor
[Bullet list, deduplicated by rule. Skip per-instance detail unless the fix differs.]

## Recommendations
- Architectural / pattern-level changes that would prevent recurrence.
- Tooling or component abstractions worth introducing.
- What to verify manually (screen reader, keyboard, low-vision testing).

## Positive findings
What the codebase does well — short, factual, reinforces practices to keep.
```

Include rule IDs in every engine finding. Quote the `Fix:` directive verbatim for `mechanical` rules. For `visual` or `contextual` findings, record the question in the task record and resolve it before closing; do not invent content.

## Recipe (fix mode)

1. **Baseline.** Audit the target with `format: "compact"` and record the violation set (rule ID + selector for each). This is your before-list.
2. **Plan + apply.** For each violation:
   - `Source:` line present → open that file at that line. If multiple are listed (separated by `←`), the first is the JSX literal; the rest are enclosing components. Use `Symbol` to disambiguate.
   - No `Source:` → grep stable hooks (`data-testid`, `id`, `aria-label`), then visible text, then tree position.
   - Treat the violation's `Fixability:` and `Fix:` fields as evidence to verify against the actual component. Resolve contextual and visual findings in the task record before closing; never invent content.
   - Group same-file edits into one operation.
   - Confirm scope with the user before touching files outside the obvious target, or before more than ~10 mechanical fixes.
3. **Verify.** Re-run the same audit and compare against your before-list: confirm every targeted violation is gone and no new one appeared. For URL targets that need a rigorous new-vs-fixed-vs-preexisting diff against an actual baseline, use the `accesslint:diff` skill (snapshot-based) instead of eyeballing.

`Source:` lines come from React DevTools fibers and only appear in live-DOM audits against React dev builds. Static audits won't have them — fall back to selectors.

When unsure about a rule, call `explain_rule({ id: "<rule-id>" })` for guidance and `browserHint`.

## When to bail (fix mode)

- A violation has no `Fix:` directive — investigate the rule and ask for an owner decision only if the correct outcome remains ambiguous.
- Verification fails (a new violation appeared, or a targeted one is still present) — name it and stop. Do not iterate silently.

## Output (fix mode)

Per cycle: flow used, violations by impact, what was applied (file + rule), unresolved findings and their owners, and the before/after violation counts.
