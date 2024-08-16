import React from 'react'

import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { SwitchInput } from './SwitchInput'

type Props = {
  name: string
  label: string
  gridColumn?: string
  centered?: boolean
  disabled?: boolean
  afterChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const SwitchInputFormik = (props: Props) => {
  const { name, label, gridColumn, centered, disabled, afterChange } = props
  const { value, isError, error, handleChange } = useFormikWrapper(name)

  return (
    <Box width="auto" minWidth="min-content" gridColumn={gridColumn}>
      <SwitchInput
        label={label}
        centered={centered}
        disabled={disabled}
        afterChange={afterChange}
        id={name}
        value={value}
        onChange={handleChange}
        isError={isError}
        errorMessage={error}
      />
    </Box>
  )
}
