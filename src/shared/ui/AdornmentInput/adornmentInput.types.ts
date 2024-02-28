import { OutlinedInputProps } from '@mui/material/'

export type AdornmentInputProps = Omit<OutlinedInputProps, 'onChange'> & {
  mask: (number: string, unmasked?: boolean) => string
  value?: string
  onChange?: (value: string) => void
  isError?: boolean
  errorMessage?: string
  helperMessage?: string
}
