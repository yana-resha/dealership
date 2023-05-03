import React from 'react'

import { Autocomplete, AutocompleteValue, Box, InputLabel, TextField } from '@mui/material'

import useStyles from './AutocompleteInput.styles'

type Props = {
  label: string
  placeholder: string
  options: string[]
  value?: string
  onChange?: (value: string | string[] | null) => void
  isError?: boolean
  errorMessage?: string
  id?: string
  disabled?: boolean
}

export const AutocompleteInput = ({
  label,
  placeholder,
  options,
  value,
  onChange,
  isError,
  errorMessage,
  id,
  disabled,
}: Props) => {
  const classes = useStyles()

  function handleChange(
    event: React.SyntheticEvent<Element, Event>,
    value: AutocompleteValue<string, any, any, any>,
  ) {
    onChange?.(value)
  }

  const autocompleteConfig = {
    value,
    options,
    id,
    disabled,
    autoHighlight: true,
    onChange: handleChange,
  }

  const textFieldConfig = {
    id,
    placeholder: placeholder,
    error: isError,
    helperText: isError ? errorMessage : '',
  }

  return (
    <Box className={classes.inputContainer}>
      <InputLabel htmlFor={id} className={classes.inputLabel}>
        {label}
      </InputLabel>
      <Box>
        <Autocomplete
          {...autocompleteConfig}
          className={classes.autocompleteField}
          renderInput={params => <TextField {...textFieldConfig} {...params} />}
        />
      </Box>
    </Box>
  )
}
