import React, { useEffect, useState } from 'react'

import { Box, FormHelperText, InputLabel, Switch, useTheme } from '@mui/material'

import useStyles from './SwitchInput.styles'
import { SwitchInputProps } from './switchInput.types'

export const SwitchInput = ({
  label,
  value,
  isError,
  errorMessage,
  id,
  centered,
  disabled,
  onChange,
}: SwitchInputProps) => {
  const classes = useStyles()
  const theme = useTheme()

  const [fieldValue, setFieldValue] = useState(value || false)

  useEffect(() => {
    if (value != undefined && value !== fieldValue) {
      setFieldValue(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  function handleSwitch(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue(event.target.checked)
    onChange?.(event)
  }

  const configureSwitch = {
    id: id,
    checked: fieldValue,
    disabled: disabled,
    onChange: handleSwitch,
    'data-fieldid': id,
  }

  return (
    <Box minWidth="min-content" marginTop={centered ? theme.spacing(4) : '0'}>
      <Box className={classes.switchContainer}>
        <Switch disableRipple className={classes.switch} {...configureSwitch} />
        <InputLabel htmlFor={id} className={classes.switchLabel}>
          {label}
        </InputLabel>
      </Box>
      {isError && (
        <FormHelperText className={classes.helperText} error>
          {errorMessage}
        </FormHelperText>
      )}
    </Box>
  )
}
