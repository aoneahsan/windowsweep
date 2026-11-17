---
name: aoneahsan-cccs-react-forms
description: 'Forms in React with react-hook-form and Zod: schema-first validation, the required-vs-optional submit rule, error display, async and multi-step forms, and URL-persisted steps. Use when building or reviewing any form, wiring validation, handling submit state, or when form state is being held in useState.'
metadata:
  author: aoneahsan
  source: custom-skills/_source-understanding/files/generic-project-rules.md
---

# Forms

**`react-hook-form` + `zod` + `@hookform/resolvers`. Always.** No Formik, no hand-rolled `useState` forms.
When you touch a component with a form in it, migrate it — leaving a mixed codebase is worse than either
choice alone.

```bash
yarn add react-hook-form zod @hookform/resolvers
```

## Schema first, type derived

```tsx
const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'At least 8 characters'),
  referral: z.string().optional(),
});

type FormData = z.infer<typeof schema>;   // never hand-write this — it will drift

const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

The schema is the single source of truth for shape, validation **and** type. Writing the interface separately
guarantees the two disagree eventually.

**Error messages live in the schema**, phrased for the person reading them — "Enter a valid email address",
not "Invalid email". They are UI copy that happens to live next to the validation.

## 🔴 React Aria fields need `validationBehavior="aria"`

RAC runs **native HTML constraint validation** by default. With RHF also validating, two validators fight:
browser-native bubbles appear beside styled errors, and a submit is blocked by a rule no schema contains.

**RHF + Zod stays the single validation authority.** Drive every RAC field through `Controller` and turn
RAC's own validation off:

```tsx
<Controller control={control} name="email"
  render={({field, fieldState: {invalid, error}}) => (
    <TextField {...field}
      validationBehavior="aria"          // ← without this, RAC validates too
      isInvalid={invalid}
      errorMessage={error?.message}
    />
  )} />
```

RAC keeps supplying the ARIA wiring (`aria-invalid`, `aria-describedby`, the error association); Zod keeps
owning what counts as valid. See `aoneahsan-cccs-react-aria`.

## 🔴 Validate, then SHAPE — they are two steps

A valid form is not a ready payload. **An optional field the user left blank has its key removed** — never sent
as `null`, `undefined` or `''`, because on a partial update a present key overwrites the stored value and the
user loses data they never touched.

Omission and `null` mean different things and both must stay expressible: absent = "I didn't fill this in",
explicit `null` = "clear what's there". The `toPayload` helper, the `dirtyFields` trick that tells them apart,
and what each backend does with a stray `null`: `aoneahsan-cccs-data-contract`.

## Required blocks, optional never does

A user must be able to submit with **all required fields plus any subset of the optional ones**. An optional
field that blocks submit is a bug. Do not disable the submit button on `!isValid` — let the submit run, show
the errors, and focus the first one. A disabled button with no explanation is a dead end.

Disable on **`isSubmitting`** only, and use it to prevent double submission.

## Errors where the user is looking

Show the message **next to the field**, wired with `aria-invalid` and `aria-describedby` so it is announced,
not just seen. Validate on blur and re-validate on change once a field has errored — validating every
keystroke from the start punishes people mid-typing.

On submit failure, focus the first invalid field. On a form longer than one screen, scroll it into view.

## Server errors belong in the form

```tsx
catch (error) {
  setError('email', { message: 'That email is already registered' });   // field-level when you know
  setError('root', { message: 'Could not save. Please try again.' });   // form-level otherwise
}
```

A toast that vanishes is not error handling for a form the user must now correct.

## Multi-step forms live in the URL

The step is a query param, not `useState` — refreshing must not restart the flow. Validate per step with
`trigger(['field1', 'field2'])` before advancing. See `aoneahsan-cccs-url-state-persistence`.

🔴 **No form here contains a `<textarea>`.** Every multi-line input is a `RichTextField` — the rule, and the
accessibility obligations that come with it, live in `aoneahsan-cccs-tiptap-rich-text`. Drive it through
`Controller`, as above: tiptap forwards no ref and emits no native change event, so `register` cannot see it.

For field-component wrappers, upload fields and select controls, see `aoneahsan-cccs-react-form-components`.
For async validation, arrays and complex patterns, read `references/patterns.md`.
