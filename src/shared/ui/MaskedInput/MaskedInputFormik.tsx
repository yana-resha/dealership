import React from 'react'

import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { MaskedInput } from './MaskedInput'

type Props = {
  name: string
  label: string
  placeholder: string
  mask: (number: string, unmasked?: boolean) => string
  gridColumn?: string
  readonly?: boolean
  disabled?: boolean
}

export const MaskedInputFormik = (props: Props) => {
  const { name, label, placeholder, mask, gridColumn, readonly, disabled } = props
  const { value, isError, error, onChange } = useFormikWrapper(name)

  return (
    <Box width="auto" gridColumn={gridColumn}>
      <MaskedInput
        label={label}
        placeholder={placeholder}
        mask={mask}
        readonly={readonly}
        disabled={disabled}
        id={name}
        value={value}
        onChange={onChange}
        isError={isError}
        errorMessage={error}
      />
    </Box>
  )
}
