import React from 'react'

import { Box, FormHelperText, InputLabel, Switch, useTheme } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import useStyles from './SwitchInput.styles'

type Props = {
  name: string
  label: string
  gridColumn?: string
  centered?: boolean
}

export const SwitchInput = (props: Props) => {
  const { name, label, gridColumn, centered } = props

  const classes = useStyles()
  const theme = useTheme()

  const [field, meta] = useField(name)
  const { setFieldValue } = useFormikContext()

  const isError = meta != undefined && meta.touched && meta.error != undefined

  function handleSwitch(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      setFieldValue(name, 1)
    } else {
      setFieldValue(name, 0)
    }
  }

  const configureSwitch = {
    id: name,
    onChange: handleSwitch,
  }

  return (
    <Box gridColumn={gridColumn} minWidth="min-content" marginTop={centered ? theme.spacing(4) : '0'}>
      <Box className={classes.switchContainer}>
        <Switch disableRipple className={classes.switch} {...configureSwitch} />
        <InputLabel htmlFor={name} className={classes.switchLabel}>
          {label}
        </InputLabel>
      </Box>
      {isError && (
        <FormHelperText className={classes.helperText} error>
          {meta.error}
        </FormHelperText>
      )}
    </Box>
  )
}
