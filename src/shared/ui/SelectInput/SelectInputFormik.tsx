import React from 'react'

import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { SelectInput } from './SelectInput'

type Props = {
  name: string
  label: string
  placeholder: string
  options: string[]
  gridColumn?: string
  emptyAvailable?: boolean
  disabled?: boolean
}

export const SelectInputFormik = (props: Props) => {
  const { name, label, placeholder, options, gridColumn, emptyAvailable, disabled } = props
  const { value, isError, error, onChange } = useFormikWrapper(name)

  return (
    <Box width="auto" gridColumn={gridColumn}>
      <SelectInput
        label={label}
        placeholder={placeholder}
        options={options}
        emptyAvailable={emptyAvailable}
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
