import React from 'react'

import { Box, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import useStyles from './SelectInput.styles'

type Props = {
  name: string
  label: string
  placeholder: string
  options: string[]
  gridColumn?: string
}

export const SelectInput = (props: Props) => {
  const classes = useStyles()
  const { name, label, placeholder, options, gridColumn } = props
  const [field, meta] = useField(name)
  const { setFieldValue } = useFormikContext()
  const isError = meta != undefined && meta.touched && meta.error != undefined

  function handleChange(event: SelectChangeEvent) {
    setFieldValue(name, event.target.value)
  }

  const configSelect = {
    value: field.value,
    labelId: name,
    onChange: handleChange,
    error: isError,
  }

  return (
    <Box className={classes.inputContainer} gridColumn={gridColumn}>
      <InputLabel id={name} className={classes.inputLabel}>
        {label}
      </InputLabel>
      <Box>
        <Select displayEmpty className={classes.selectField} {...configSelect}>
          <MenuItem disabled selected value="">
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
            {meta.error}
          </FormHelperText>
        )}
      </Box>
    </Box>
  )
}
