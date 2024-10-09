export type SwitchInputProps = {
  label: string
  value?: boolean
  isError?: boolean
  errorMessage?: string
  id?: string
  centered?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
