import React, { useEffect, useState } from 'react'

import { Box, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

import useStyles from './SelectInput.styles'

type Props = {
  label: string
  placeholder: string
  options: string[]
  value?: string
  onChange?: (value: string) => void
  isError?: boolean
  errorMessage?: string
  id?: string
  emptyAvailable?: boolean
  disabled?: boolean
}

export const SelectInput = (props: Props) => {
  const classes = useStyles()
  const {
    label,
    placeholder,
    options,
    value,
    onChange,
    isError,
    errorMessage,
    id,
    emptyAvailable,
    disabled,
  } = props
  const [fieldValue, setFieldValue] = useState(value || '')

  useEffect(() => {
    if (value !== fieldValue) {
      setFieldValue(value || fieldValue)
    }
  }, [value])

  function handleChange(event: SelectChangeEvent) {
    setFieldValue(event.target.value)
    onChange?.(event.target.value)
  }

  const configSelect = {
    value: fieldValue,
    labelId: id,
    onChange: handleChange,
    disabled: disabled,
    error: isError,
  }

  return (
    <Box className={classes.inputContainer}>
      <InputLabel id={id} className={classes.inputLabel}>
        {label}
      </InputLabel>
      <Box>
        <Select displayEmpty className={classes.selectField} {...configSelect}>
          <MenuItem disabled={!emptyAvailable} selected value="">
            <span className={classes.placeholder}>{placeholder}</span>
          </MenuItem>
          {options.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {isError && (
          <FormHelperText className={classes.helperText} error>
            {errorMessage}
          </FormHelperText>
        )}
      </Box>
    </Box>
  )
}
