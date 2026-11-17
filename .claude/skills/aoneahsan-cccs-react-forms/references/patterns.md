# Form patterns

## Cross-field validation

```ts
const schema = z.object({
  password: z.string().min(8, 'At least 8 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],          // attach to the field the user should fix
});
```

`path` matters — without it the error lands on the form root and the user sees a message with no field to
correct.

## Async validation (uniqueness)

```ts
const schema = z.object({
  username: z.string().min(3).refine(
    async (v) => !(await usernameTaken(v)),
    { message: 'That username is taken' },
  ),
});

useForm({ resolver: zodResolver(schema), mode: 'onBlur' });   // never onChange for async
```

`mode: 'onBlur'` is required here — an async refinement on every keystroke fires a request per character.

## Field arrays

```tsx
const { fields, append, remove } = useFieldArray({ control, name: 'contacts' });

fields.map((field, i) => (
  <div key={field.id}>          {/* field.id — NOT the array index */}
    <input {...register(`contacts.${i}.email`)} />
    <button type="button" onClick={() => remove(i)}>Remove</button>
  </div>
))
```

`key={field.id}` is not optional: keying by index makes React reuse the wrong DOM node after a removal, so
the user watches values jump between rows.

## Default values and async loading

```tsx
const { reset } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues });

useEffect(() => { if (data) reset(data); }, [data, reset]);   // reset, don't setValue field-by-field
```

`reset` also clears dirty and error state, which is what you want when the loaded record replaces the form.

## Dirty-state guard

```tsx
const { formState: { isDirty } } = useForm(...);
useBeforeUnload(isDirty, 'You have unsaved changes.');
```

Pair with a router-level block for in-app navigation — `beforeunload` only covers leaving the site.

## Controlled third-party inputs

```tsx
<Controller
  name="country"
  control={control}
  render={({ field, fieldState }) => (
    <SelectField {...field} error={fieldState.error?.message} options={countries} />
  )}
/>
```

`register` works for native inputs; anything that does not forward a ref and emit native events — a select
library, a date picker, a rich-text editor — goes through `Controller`.

## Submitting through TanStack Query

🔴 **Shape the payload before it is sent — never pass raw form state through.** An untouched optional text
input yields `''`, and sending that (or `null`) overwrites the stored value on a partial update, so the user
edits one field and silently loses another.

```tsx
const mutation = useMutation({ mutationFn: saveProfile });

/** Drop keys the user left blank. `null` survives — it means "clear this". */
const toPayload = <T extends object>(values: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== undefined && v !== ''),
  ) as Partial<T>;

const onSubmit = handleSubmit(async (values) => {
  try {
    await mutation.mutateAsync(toPayload(values));
  } catch (error) {
    setError('root', { message: toUserMessage(error) });
  }
});
```

Note the comparison is explicit: `filter(([, v]) => v)` is the bug, because it also drops a quantity of `0` and
an unchecked switch. Distinguishing "didn't fill this in" (omit the key) from "clear it" (send `null`), and the
per-backend consequences: `aoneahsan-cccs-data-contract`, its frontend-payload reference.

Use RHF's `isSubmitting` for the button state rather than the mutation's `isPending` — it covers the whole
submit handler, including any client-side work before the request.
