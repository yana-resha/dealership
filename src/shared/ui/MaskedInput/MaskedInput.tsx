import { useEffect, useState, memo } from 'react'

import { Box, InputLabel, TextField } from '@mui/material'

import useStyles from './MaskedInput.styles'
import { MaskedInputProps } from './maskedInput.types'

export const MaskedInput = memo(
  ({
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
    autoFocus,
  }: MaskedInputProps) => {
    const classes = useStyles()

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
      autoFocus,
      'data-fieldId': id,
    }

    return (
      <Box className={classes.inputContainer}>
        {!!label && (
          <InputLabel htmlFor={id} className={classes.inputLabel}>
            {label}
          </InputLabel>
        )}
        <TextField className={classes.textField} {...configTextField} />
      </Box>
    )
  },
)
