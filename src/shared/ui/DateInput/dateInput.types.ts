export type DateInputProps = {
  label: string
  value?: Date | null
  onChange?: (value: Date | null) => void
  isError?: boolean
  errorMessage?: string
  id?: string
  disabled?: boolean
}
