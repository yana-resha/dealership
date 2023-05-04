import React, { useEffect, useState } from 'react'

import { Box, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

import useStyles from './SelectInput.styles'
import { SelectInputProps } from './selectInput.types'

export const SelectInput = (props: SelectInputProps) => {
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
    if (value && value !== fieldValue) {
      setFieldValue(value)
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
