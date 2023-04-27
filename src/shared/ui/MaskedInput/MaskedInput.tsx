import React, { useEffect, useState } from 'react'

import { Box, InputLabel, TextField } from '@mui/material'

import useStyles from './MaskedInput.styles'

type Props = {
  label: string
  placeholder: string
  mask: (number: string, unmasked?: boolean) => string
  value?: string
  onChange?: (value: string) => void
  isError?: boolean
  errorMessage?: string
  id?: string
  readonly?: boolean
  disabled?: boolean
}

export const MaskedInput = (props: Props) => {
  const classes = useStyles()
  const { label, placeholder, mask, value, onChange, isError, errorMessage, id, readonly, disabled } = props
  const [fieldValue, setFieldValue] = useState(value || '')

  useEffect(() => {
    if (value !== fieldValue) {
      setFieldValue(value || fieldValue)
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
    inputProps: {
      readOnly: readonly,
    },
    error: isError,
    helperText: isError ? errorMessage : '',
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