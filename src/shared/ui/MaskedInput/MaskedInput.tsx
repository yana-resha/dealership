import React, { useEffect, useState } from 'react'

import { Box, InputLabel, TextField } from '@mui/material'

import useStyles from './MaskedInput.styles'
import { MaskedInputProps } from './maskedInput.types'

export const MaskedInput = (props: MaskedInputProps) => {
  const classes = useStyles()
  const {
    label,
    placeholder,
    mask,
    value,
    onChange,
    isError,
    errorMessage,
    helperMessage,
    id,
    disabled,
    InputProps,
  } = props
  const [fieldValue, setFieldValue] = useState(value || '')

  useEffect(() => {
    if (value && value !== fieldValue) {
      setFieldValue(value)
    }
  }, [value])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue(mask(event.target.value.trimStart(), true))
    onChange?.(mask(event.target.value.trimStart(), true))
  }

  const configTextField = {
    value: mask(fieldValue),
    id: id,
    onChange: handleChange,
    placeholder: placeholder,
    disabled: disabled,
    autoComplete: 'off',
    InputProps: InputProps,
    error: isError,
    helperText: isError ? errorMessage : helperMessage || '',
  }

  return (
    <Box className={classes.inputContainer}>
      <InputLabel htmlFor={id} className={classes.inputLabel}>
        {label}
      </InputLabel>
      <TextField className={classes.textField} {...configTextField} />
    </Box>
  )
}
