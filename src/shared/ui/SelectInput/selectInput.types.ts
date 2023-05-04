export type SelectInputProps = {
  label: string
  placeholder: string
  options: string[]
  value?: string
  onChange?: (value: string) => void
  isError?: boolean
  errorMessage?: string
  id?: string
  emptyAvailable?: boolean
  disabled?: boolean
}
