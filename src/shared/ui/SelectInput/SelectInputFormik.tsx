import React from 'react'

import { Box } from '@mui/material'

import { useFormikWrapper } from '../hooks/useFormikWrapper'
import { SelectInput } from './SelectInput'
import { SelectInputProps } from './selectInput.types'

interface Props
  extends Pick<SelectInputProps, 'label' | 'placeholder' | 'options' | 'emptyAvailable' | 'disabled'> {
  name: string
  gridColumn?: string
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
