# Overview — `aoneahsan-cccs-react-forms`

## Purpose

The form standard: react-hook-form with Zod, schema-first, in every React project. It exists to end the mix
of Formik, `useState` forms and ad-hoc validation that made forms the least consistent surface across
projects.

## What this skill does

- Fixes the stack — `react-hook-form` + `zod` + `@hookform/resolvers` — and requires migrating a form when
  you touch the component that owns it.
- Makes the **Zod schema the single source of truth** for shape, validation and type, with `z.infer` deriving
  the type so it cannot drift from the validation.
- Puts user-facing error copy **in the schema**, phrased for a reader.
- States the submit rule: required fields block, optional fields never do; do not disable submit on
  `!isValid`; disable only on `isSubmitting` to prevent double submission.
- Sets error presentation: inline beside the field, `aria-invalid` + `aria-describedby`, validate on blur then
  re-validate on change, and focus the first invalid field on failed submit.
- Requires server errors to be surfaced **in the form** via `setError`, field-level where known, rather than
  as a toast that disappears.
- Requires multi-step forms to keep the step in the URL and validate per step before advancing.

## When it gets invoked

- Building or reviewing any form — login, settings, checkout, multi-step wizard.
- Wiring validation, or deciding where a validation rule belongs.
- Handling submit state, submission errors, or server-side validation failures.
- You find form state held in `useState`, or a form using Formik.

## Where it applies

Every React project. The concern maps by analogy in non-React stacks.

## Sources

`_source-understanding/files/generic-project-rules.md` (R-031) and
`_source-understanding/files/prompt-logs.md` (the standard restated as a critical rule, and the
fix-all-four-concerns-when-you-touch-a-component instruction).

## Related skills

`aoneahsan-cccs-react-form-components` (the field wrappers and inputs this composes) ·
`-url-state-persistence` (multi-step state) · `-react-accessibility` (the ARIA wiring) ·
`-typescript` (why the type is derived) · `-react-api-tanstack-query` (submitting to a server).

## Maintenance

Stable. Re-check on a react-hook-form or Zod major release.
