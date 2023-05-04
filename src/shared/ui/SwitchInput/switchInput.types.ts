export type SwitchInputProps = {
  label: string
  value?: boolean
  onChange?: (value: boolean) => void
  isError?: boolean
  errorMessage?: string
  id?: string
  centered?: boolean
  disabled?: boolean
  afterChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}
