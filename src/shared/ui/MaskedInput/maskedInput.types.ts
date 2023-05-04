export type MaskedInputProps = {
  label: string
  placeholder: string
  mask: (number: string, unmasked?: boolean) => string
  value?: string
  onChange?: (value: string) => void
  isError?: boolean
  errorMessage?: string
  id?: string
  readonly?: boolean
  disabled?: boolean
}
