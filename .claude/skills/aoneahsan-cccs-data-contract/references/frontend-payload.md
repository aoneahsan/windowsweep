# The client half — validate, then shape

Validation and shaping are two steps, and the second one is the one that gets skipped. A schema that accepts a
blank optional field still hands you `""`, and passing that straight to the server is what destroys data.

## The pattern

```ts
const schema = z.object({
  displayName: z.string().min(1, 'Enter a display name'),
  bio:         z.string().optional(),
  website:     z.string().url('Enter a full URL, including https://').optional(),
});
type FormValues = z.infer<typeof schema>;

/** Strip keys the user left blank. `null` is preserved — it means "clear this". */
function toPayload<T extends object>(values: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== undefined && v !== ''),
  ) as Partial<T>;
}

const onSubmit = (values: FormValues) => mutation.mutateAsync(toPayload(values));
```

🔴 **`mutateAsync(values)` — raw form state, unshaped — is the defect.** It is also the shortest line, which is
why it keeps reappearing.

Three details in `toPayload` that matter:

- **`''` is filtered, `null` is not.** An untouched text input yields `''`, never `undefined`, so filtering only
  `undefined` catches nothing.
- **`0` and `false` must survive.** `filter(([, v]) => v)` is the bug: it drops a quantity of zero and an
  unchecked switch. Compare against `undefined` and `''` explicitly.
- **It is shallow.** A nested object needs the same treatment applied at its own level, not a deep sweep that
  cannot know which level owns which optionality.

## 🔴 Omit versus `null` — the distinction the UI must express

| The user | Payload | On the server |
|---|---|---|
| never touched the field | **key absent** | the stored value is untouched |
| cleared a field that had content | **`null`** | the stored value is erased |

These are different operations. A form that sends `null` for both **erases data on every save** — the user
edits their display name and loses their bio.

**Making it expressible** costs one piece of state: track whether the field was *modified*. In react-hook-form
that is `formState.dirtyFields`, so a field that is both dirty and empty resolves to `null`, while a field that
is untouched and empty resolves to omission:

```ts
const payload = buildPayload(values, formState.dirtyFields);
// dirty + empty -> null (clear it) · untouched + empty -> key omitted
```

If a product genuinely has no "clear" action for a field, say so and omit unconditionally — but say so, rather
than leaving the ambiguity for the next person.

## Why each backend cares

| Backend | What a stray `null` does |
|---|---|
| **PostgREST / Supabase** | a `PATCH` writes every key in the payload, so `null` overwrites the column. An absent key leaves it alone |
| **Firestore** | `hasOnly([...])` in a rule enumerates permitted keys — an unexpected key is refused, while a `null` on a permitted key persists as a real null and breaks readers that expect a string |
| **Laravel** | `$request->validated()` returns the key, so `fill()` writes null. `sometimes` rules only skip **absent** keys — present-and-null is validated and stored |
| **A typed API** | `exactOptionalPropertyTypes` distinguishes `{a?: string}` from `{a: string \| undefined}`; without it the compiler cannot tell you which one you built |

## Where the message goes

- **Beside the field**, wired with `aria-invalid` and `aria-describedby`. A toast that vanishes is not error
  handling for a form the user must now correct.
- **On submit failure, focus the first invalid field** so a keyboard user is not hunting.
- **A server error belongs back in the form** — mapped to its field where the server names one, and to a
  form-level error where it does not.
- **Never disable submit on `!isValid`.** Let the submit run, show the errors, focus the first. A disabled
  button with no explanation is a dead end (`aoneahsan-cccs-react-forms`).

## Optional never blocks

A user must be able to submit with **all required fields plus any subset of the optional ones**. An optional
field that blocks submit is a bug — and it is usually a schema that says `.optional()` while a downstream type
says the key is required.

## Other stacks, same concern

The concern is "send exactly what you mean" and it is framework-independent. In Dart, an absent key is a key
you do not add to the map — `if (bio != null && bio.isNotEmpty) map['bio'] = bio;` — never
`map['bio'] = bio ?? null`. In a Worker or an extension, the payload is hand-built, so the discipline is the
same and there is no library to blame.

**Last updated:** 2026-07-30
