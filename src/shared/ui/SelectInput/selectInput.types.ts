export type SelectInputProps = {
  label: string
  placeholder: string
  // DCB-256 заменить на options: { value: string | number; label?: string }[]
  options: string[] | { value: string | number; label: string }[]
  value?: string
  onChange?: (value: string) => void
  isError?: boolean
  errorMessage?: string
  helperMessage?: string
  id?: string
  emptyAvailable?: boolean
  disabled?: boolean
}
