export type SelectInputProps<T> = {
  label: string
  placeholder: string
  // DCB-256 заменить на options: { value: string | number; label?: string }[]
  options: T[] | { value: T; label: string }[]
  value?: string | T
  onChange?: (value: string | T) => void
  isError?: boolean
  errorMessage?: string
  helperMessage?: string
  id?: string
  emptyAvailable?: boolean
  disabled?: boolean
}
