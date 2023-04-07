import React from 'react'

import { Box, InputLabel, TextField } from '@mui/material'
import { useField, useFormikContext } from 'formik'

import useStyles from './MaskedInput.styles'

type Props = {
  name: string
  label: string
  placeholder: string
  mask: (number: string, unmasked?: boolean) => string
  gridColumn?: string
}

export const MaskedInput = (props: Props) => {
  const classes = useStyles()
  const { name, label, placeholder, mask, gridColumn } = props
  const [field, meta] = useField(name)
  const { setFieldValue } = useFormikContext()
  const isError = meta != undefined && meta.touched && meta.error != undefined

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFieldValue(name, mask(event.target.value.trimStart(), true))
  }

  const configTextField = {
    ...field,
    value: mask(field.value),
    id: name,
    onChange: handleChange,
    placeholder: placeholder,
    error: isError,
    helperText: isError ? meta.error : '',
  }

  return (
    <Box className={classes.inputContainer} gridColumn={gridColumn}>
      <InputLabel htmlFor={name} className={classes.inputLabel}>
        {label}
      </InputLabel>
      <TextField className={classes.textField} {...configTextField} />
    </Box>
  )
}
