---
name: aoneahsan-cccs-react-form-components
description: 'The shared form-field component layer: a consistent wrapper interface for every input type, the mandatory info affordance on upload fields, select and date controls, and card-based choice inputs. Use when creating or reviewing a form field, adding a file upload, or when form markup is repeated per field.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/files/generic-project-rules.md
---

# Form field components

Every project has `src/components/form-fields/` — one wrapper per input type, all sharing one interface.
Forms then read as intent, and label/error/help/ARIA wiring is written once instead of per field.

## The shared interface

```tsx
interface FieldProps {
  name: string;            // required
  label: string;           // required — a placeholder is not a label
  value?: unknown;
  onChange?: (value: unknown) => void;
  error?: string;
  helpText?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}
```

Every field renders: label bound by `htmlFor`, the control, help text, and the error — with `aria-invalid`
and `aria-describedby` pointing at whichever of help/error is present. Required is marked visually **and**
with `aria-required`.

Set: `TextField`, `NumberField`, `SelectField`, `CheckboxField`, `RadioCardGroup`, `SwitchField`,
`DateField`, `FileField`, `RichTextField`.

🔴 **`TextareaField` is deliberately absent.** Every multi-line input is a `RichTextField` — owner directive,
2026-07-29. A field that must stay plain is the same component with no formatting extensions, never a
`<textarea>`; keeping both invites the next form to reach for the wrong one out of habit. The rule, its
accessibility obligations and the MIT-core boundary: `aoneahsan-cccs-tiptap-rich-text`.

**Wrap React Aria, do not wrap a raw `<input>`.** RAC's `TextField` / `Select` / `ComboBox` already emit the
label binding, `aria-invalid`, `aria-describedby` and the error association — so the wrapper's job is
tokens, layout, the info affordance and the shared prop interface, not ARIA plumbing.

```tsx
export function TextField({label, helpText, error, ...props}: FieldProps) {
  return (
    <RACTextField validationBehavior="aria" isInvalid={!!error} className="grid gap-1.5" {...props}>
      <Label className="text-sm font-medium text-text">{label}</Label>
      <Input className="h-10 rounded-md border border-border bg-surface px-3
                        focus-visible:ring-2 focus-visible:ring-accent" />
      {helpText && <Text slot="description" className="text-sm text-text-muted">{helpText}</Text>}
      <FieldError className="text-sm text-danger">{error}</FieldError>
    </RACTextField>
  );
}
```

🔴 **`validationBehavior="aria"` is mandatory** wherever RHF owns validation — see
`aoneahsan-cccs-react-forms`.

## 🔴 Upload fields need an info affordance — always

**Every file, image and document input carries an info icon beside its label** that opens a **Popover**
explaining, *before* the user picks a file:

| Tell them | Example |
|---|---|
| What the upload is for | "Header logo, shown on light backgrounds." |
| Accepted types | PDF · PNG · SVG · JPG · WebP |
| Max / recommended size | "2 MB" |
| Dimensions + aspect ratio | "1200 × 630 px · landscape 1.91:1" |
| A best-practice tip | "SVG stays sharp; use a transparent background." |
| A downloadable example | images → a placeholder at the exact size; documents → describe the ideal file, never fabricate a sample |

**A Popover, not a Tooltip** — a tooltip cannot host an interactive link accessibly. The trigger is a real
focusable button with an `aria-label`.

**The stated limits must match what the field actually enforces.** Showing "2 MB" while accepting 10 MB is
worse than showing nothing. Any picker without an explicit guide **derives one** from its `accept` and size
props, so no upload field is ever left unexplained.

## The field renders the state the validation layer drives

A primitive carries `error`, `required` and `disabled` as inputs and renders each visibly — wired with
`aria-invalid` and `aria-describedby` — so the form layer can drive them without reaching inside. A field that
cannot show an error forces every consumer to invent its own, which is how one form shows messages beside the
input and the next shows a toast.

Where the values it collects end up, and why a blank optional field must not send `null`:
`aoneahsan-cccs-data-contract`.

## Choice inputs are cards

≤8 options → `RadioCardGroup` / `CheckboxCardGroup` (icon + title + description, unmistakable selected state).
>8 → a list or select. See `aoneahsan-cccs-react-components`.

## Select and date

**Select: `react-select` v5.** The owner's brief guessed "react-select2"; the maintained package is
`react-select`, and ztools already ships v5. It is used through `Controller`, and its styling must be themed
to the project's tokens rather than left on its defaults.

**Date: the platform first.** `<input type="date">` covers most cases with a native mobile picker for free.
Reach for a library only for ranges or multi-month views.

For the wrapper implementations and the upload-guide model, read `references/fields.md`.
