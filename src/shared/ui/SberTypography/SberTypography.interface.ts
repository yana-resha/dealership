import { TypographyProps } from '@mui/material'

export type SberautoVariant =
  | 'h0'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'body3'
  | 'body4'
  | 'body5'
  | 'body6'
export interface SberTypographyProps extends TypographyProps {
  sberautoVariant?: SberautoVariant
  sberautoMobileVariant?: SberautoVariant
  component: React.ElementType
}
