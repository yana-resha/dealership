import React, { useEffect, useState } from 'react'

import { Box, FormHelperText, InputLabel, Switch, useTheme } from '@mui/material'

import useStyles from './SwitchInput.styles'

type Props = {
  label: string
  value?: boolean
  onChange?: (value: boolean) => void
  isError?: boolean
  errorMessage?: string
  id?: string
  centered?: boolean
  afterChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const SwitchInput = (props: Props) => {
  const { label, value, onChange, isError, errorMessage, id, centered, afterChange } = props

  const classes = useStyles()
  const theme = useTheme()

  const [fieldValue, setFieldValue] = useState(value || false)

  useEffect(() => {
    if (value !== fieldValue) {
      setFieldValue(value || fieldValue)
    }
  }, [value])

  function handleSwitch(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue(event.target.checked)
    onChange?.(event.target.checked)
    afterChange?.(event)
  }

  const configureSwitch = {
    id: id,
    checked: fieldValue,
    onChange: handleSwitch,
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
