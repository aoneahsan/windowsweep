# Overview — `aoneahsan-cccs-react-form-components`

## Purpose

The shared field layer that sits between `aoneahsan-cccs-react-forms` and the raw inputs. It exists so label,
help, error and ARIA wiring is written once per project rather than once per field, and so every form in the
fleet behaves the same way for keyboard and screen-reader users.

## What this skill does

- Defines the **single wrapper interface** every field component implements (name, label, value, onChange,
  error, helpText, placeholder, required, disabled) and the markup contract each one renders, including
  `aria-invalid`, `aria-describedby` and `aria-required`.
- Names the standard field set from `TextField` through `RichTextField`.
- Mandates the **upload info affordance**: an info icon beside every file/image/document field opening a
  Popover that states purpose, accepted types, size limit, dimensions, a tip and a downloadable example —
  *before* the user picks a file. Requires a Popover rather than a Tooltip, and requires the stated limits to
  match the enforced ones. Fields without an explicit guide derive one from their `accept` and size props.
- Routes choice inputs to card-based groups at ≤8 options.
- **Settles the select decision: `react-select` v5**, used through `Controller` and themed to project tokens.
- Prefers the native date input, with a library only for ranges and multi-month views.

## When it gets invoked

- Creating or reviewing any form field component.
- Adding a file, image or document upload anywhere.
- Choosing a select, date or rich-text control.
- Form markup — label, error, help — is being repeated per field.
- Auditing forms for accessibility.

## Where it applies

Every React project with forms.

## Sources

`_source-understanding/files/generic-project-rules.md` (R-031 field architecture, R-044 card UI) and
`_source-understanding/files/prompt-logs.md` (the upload-info rule, and the select question the owner
delegated). The `react-select` v5 answer is corroborated by
`_source-understanding/projects/ztools-capacitor-android.md`, which shows it already in the dependency tree.

## Related skills

`aoneahsan-cccs-react-forms` (validation and submit) · `-react-components` (the card pattern) ·
`-react-accessibility` · `-tiptap-rich-text` (what `RichTextField` wraps) · `-fileshub` (where uploads go).

## Maintenance

The select decision was an open question the owner delegated ("you can decide on this"); it is now recorded
here. Flag it in review if the owner prefers otherwise.
