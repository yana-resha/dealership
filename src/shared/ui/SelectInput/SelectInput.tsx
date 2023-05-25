import React, { useEffect, useState } from 'react'

import { Box, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

import useStyles from './SelectInput.styles'
import { SelectInputProps } from './selectInput.types'

export function SelectInputWithoutMemo<T extends string | number>(props: SelectInputProps<T>) {
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
    if (
      value !== undefined &&
      value !== null &&
      (typeof value === 'string' || !isNaN(value)) &&
      value !== fieldValue
    ) {
      setFieldValue(value)
    }
  }, [value])

  function handleChange(event: SelectChangeEvent<string | T>) {
    setFieldValue(event.target.value)
    onChange?.(event.target.value)
  }

  const configSelect = {
    value: fieldValue,
    labelId: id,
    onChange: handleChange,
    disabled: disabled,
    error: isError,
    'data-testid': id,
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
          {options.map(option =>
            typeof option === 'string' || typeof option === 'number' ? (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ) : (
              <MenuItem key={option.label} value={option.value}>
                {option.label}
              </MenuItem>
            ),
          )}
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
export const SelectInput = React.memo(SelectInputWithoutMemo) as typeof SelectInputWithoutMemo
