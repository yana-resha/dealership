import React, { useCallback } from 'react'

import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { SwitchInput } from './SwitchInput'

type Props = {
  name: string
  label: string
  gridColumn?: string
  centered?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const SwitchInputFormik = ({ name, label, gridColumn, centered, disabled, onChange }: Props) => {
  const { value, isError, error, handleChange } = useFormikWrapper(name)

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event)
      handleChange?.(event.target.checked)
    },
    [handleChange, onChange],
  )

  return (
    <Box width="auto" minWidth="min-content" gridColumn={gridColumn}>
      <SwitchInput
        label={label}
        centered={centered}
        disabled={disabled}
        onChange={handleInputChange}
        id={name}
        value={value}
        isError={isError}
        errorMessage={error}
      />
    </Box>
  )
}
