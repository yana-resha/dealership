import React from 'react'

import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { SwitchInput } from './SwitchInput'

type Props = {
  name: string
  label: string
  gridColumn?: string
  centered?: boolean
  afterChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const SwitchInputFormik = (props: Props) => {
  const { name, label, gridColumn, centered, afterChange } = props
  const { value, isError, error, onChange } = useFormikWrapper(name)

  return (
    <Box width="auto" minWidth="min-content" gridColumn={gridColumn}>
      <SwitchInput
        label={label}
        centered={centered}
        afterChange={afterChange}
        id={name}
        value={value}
        onChange={onChange}
        isError={isError}
        errorMessage={error}
      />
    </Box>
  )
}
