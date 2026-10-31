import { FieldError, Input, Label, Text, TextField as AriaTextField } from 'react-aria-components';

interface TextFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (() => void) | undefined;
  inputRef?: React.Ref<HTMLInputElement> | undefined;
  error?: string | undefined;
  helpText?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'email';
}

/** RHF and Zod validate; React Aria supplies label and error associations. */
export function TextField({
  name,
  label,
  value,
  onChange,
  onBlur,
  inputRef,
  error,
  helpText,
  placeholder,
  required,
  disabled,
  type = 'text',
}: TextFieldProps) {
  return (
    <AriaTextField
      name={name}
      value={value}
      onChange={onChange}
      isRequired={Boolean(required)}
      isDisabled={Boolean(disabled)}
      isInvalid={Boolean(error)}
      validationBehavior="aria"
      className="fw"
    >
      <Label className="fw-lbl">{label}</Label>
      <Input
        type={type}
        className="field"
        placeholder={placeholder ?? ''}
        onBlur={onBlur}
        ref={inputRef}
      />
      {helpText ? (
        <Text slot="description" className="fw-desc">
          {helpText}
        </Text>
      ) : null}
      <FieldError className="fw-error">{error}</FieldError>
    </AriaTextField>
  );
}
