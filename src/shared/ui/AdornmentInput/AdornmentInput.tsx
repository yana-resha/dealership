import { useEffect, useState, memo } from 'react'

import { FormHelperText } from '@mui/material'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'

import useStyles from './AdornmentInput.styles'
import { AdornmentInputProps } from './adornmentInput.types'

export const AdornmentInput = memo(
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
    inputProps,
    autoFocus,
    type,
    endAdornment,
  }: AdornmentInputProps) => {
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
      inputProps,
      error: isError,
      autoFocus,
      type,
      endAdornment,
    }

    return (
      <Box className={classes.inputContainer}>
        {!!label && (
          <InputLabel htmlFor={id} className={classes.inputLabel}>
            {label}
          </InputLabel>
        )}
        <Box>
          <OutlinedInput className={classes.textField} {...configTextField} />
          {!!(errorMessage || helperMessage) && (
            <FormHelperText error id="formHelper" className={classes.formHelper}>
              {isError ? errorMessage : helperMessage}
            </FormHelperText>
          )}
        </Box>
      </Box>
    )
  },
)
