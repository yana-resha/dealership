export type SelectInputProps<T> = {
  label: string
  placeholder: string
  options: { value: T; label?: string; subLabel?: string }[]
  value?: string | T
  onChange?: (value: string | T) => void
  isError?: boolean
  errorMessage?: string
  helperMessage?: string
  id?: string
  emptyAvailable?: boolean
  disabled?: boolean
}
