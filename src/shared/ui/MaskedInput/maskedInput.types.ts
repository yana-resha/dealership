import { TextFieldProps } from '@mui/material'

export type MaskedInputProps = Omit<TextFieldProps, 'onChange'> & {
  mask: (number: string, unmasked?: boolean) => string
  value?: string
  onChange?: (value: string) => void
  isError?: boolean
  errorMessage?: string
}
