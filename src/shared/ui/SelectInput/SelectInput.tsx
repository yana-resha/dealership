import React, { useEffect, useState } from 'react'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
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
  const [fieldValue, setFieldValue] = useState(value ?? '')

  useEffect(() => {
    if (
      (typeof value === 'string' || (typeof value === 'number' && !isNaN(value)) || value === undefined) &&
      value !== fieldValue
    ) {
      setFieldValue(value ?? '')
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
        <Select
          displayEmpty
          className={classes.selectField}
          IconComponent={KeyboardArrowDownIcon}
          {...configSelect}
        >
          <MenuItem disabled={!emptyAvailable} selected value="">
            <span className={classes.placeholder}>{placeholder}</span>
          </MenuItem>
          {options.map(option => (
            <MenuItem key={`${option.value}${option.label}`} value={option.value}>
              {option.label || option.value}
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
export const SelectInput = React.memo(SelectInputWithoutMemo) as typeof SelectInputWithoutMemo
