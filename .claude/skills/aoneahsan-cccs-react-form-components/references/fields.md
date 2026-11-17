# Field implementations

## Base wrapper

```tsx
export function Field({ name, label, error, helpText, required, children }: FieldShellProps) {
  const helpId = helpText ? `${name}-help` : undefined;
  const errorId = error ? `${name}-error` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span aria-hidden className="text-danger-600"> *</span>}
      </label>

      {cloneElement(children, {
        id: name,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': [errorId, helpId].filter(Boolean).join(' ') || undefined,
        'aria-required': required || undefined,
      })}

      {helpText && <p id={helpId} className="text-sm opacity-70">{helpText}</p>}
      {error && <p id={errorId} role="alert" className="text-sm text-danger-600">{error}</p>}
    </div>
  );
}
```

`role="alert"` on the error makes it announced the moment it appears, rather than only when focus reaches the
field.

## Upload guide model

```ts
export interface UploadGuide {
  purpose: string;
  accept: string[];                 // ['image/svg+xml', 'image/png']
  maxSizeMb: number;
  dimensions?: { width: number; height: number; aspectLabel?: string };
  tips?: string[];
  exampleUrl?: string;              // images: placehold.co at the exact size
}

// Derived when a field has no explicit guide — so nothing is ever unexplained.
export function deriveGuide(accept: string, maxSizeMb: number): UploadGuide {
  return {
    purpose: 'Upload a file for this field.',
    accept: accept.split(',').map(s => s.trim()),
    maxSizeMb,
    tips: ['Keep the file as small as possible while staying legible.'],
  };
}
```

**The guide and the enforcement read from the same object.** That is what keeps them honest — if the validator
takes `guide.maxSizeMb`, the displayed number cannot drift from the enforced one.

## FileField

```tsx
export function FileField({ name, label, guide, error, onChange, required }: FileFieldProps) {
  return (
    <Field name={name} label={label} error={error} required={required}>
      <div>
        <div className="flex items-center gap-1.5">
          <FieldInfo guide={guide} fieldLabel={label} />     {/* the popover trigger */}
        </div>
        <input
          type="file"
          accept={guide.accept.join(',')}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size > guide.maxSizeMb * 1024 * 1024) {
              onChange(null, `File is larger than ${guide.maxSizeMb} MB`);
              return;
            }
            onChange(file ?? null);
          }}
        />
      </div>
    </Field>
  );
}
```

## FieldInfo popover

```tsx
<Popover>
  <PopoverTrigger asChild>
    <button type="button" aria-label={`About the ${fieldLabel} upload`}>
      <InfoIcon aria-hidden />
    </button>
  </PopoverTrigger>
  <PopoverContent>
    <p>{guide.purpose}</p>
    <dl>
      <dt>Accepted</dt><dd>{guide.accept.map(prettyMime).join(' · ')}</dd>
      <dt>Max size</dt><dd>{guide.maxSizeMb} MB</dd>
      {guide.dimensions && (
        <><dt>Dimensions</dt>
          <dd>{guide.dimensions.width} × {guide.dimensions.height} px
            {guide.dimensions.aspectLabel && ` · ${guide.dimensions.aspectLabel}`}</dd></>
      )}
    </dl>
    {guide.tips?.map(t => <p key={t}>{t}</p>)}
    {guide.exampleUrl && <a href={guide.exampleUrl} download>Download an example</a>}
  </PopoverContent>
</Popover>
```

A real `<button>` with an `aria-label`, never a `<div>` with an icon — the trigger must be reachable by
keyboard and announced.

## SelectField with react-select

```tsx
<Controller
  name={name}
  control={control}
  render={({ field, fieldState }) => (
    <Field name={name} label={label} error={fieldState.error?.message}>
      <Select
        {...field}
        options={options}
        classNamePrefix="rs"
        unstyled                       // then style from project tokens
        inputId={name}
        aria-invalid={fieldState.error ? true : undefined}
      />
    </Field>
  )}
/>
```

`unstyled` plus your own classes is what keeps the control on the project's palette instead of react-select's
defaults — otherwise it is the one control on the page that ignores the theme.
