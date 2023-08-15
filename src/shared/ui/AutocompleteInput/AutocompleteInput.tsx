import React, { useCallback } from 'react'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Autocomplete,
  AutocompleteChangeReason,
  AutocompleteValue,
  Box,
  InputLabel,
  TextField,
} from '@mui/material'

import { Masked, maskNoRestrictions } from '../../masks/InputMasks'
import useStyles from './AutocompleteInput.styles'

type Props = {
  label: string
  placeholder: string
  options: string[]
  value?: string
  onChange?: (value: string | string[] | null) => void
  getOptionLabel?: (value: string) => string
  isError?: boolean
  errorMessage?: string
  id?: string
  isCustomValueAllowed?: boolean
  mask?: Masked
  disabled?: boolean
  onSelectOption?: (val: AutocompleteValue<string, any, any, any>) => void
}

export const AutocompleteInput = React.memo(
  ({
    label,
    placeholder,
    options,
    value,
    onChange,
    getOptionLabel,
    isCustomValueAllowed,
    isError,
    errorMessage,
    mask = maskNoRestrictions,
    id,
    disabled,
    onSelectOption,
  }: Props) => {
    const classes = useStyles()

    const getMaskedValue = useCallback(
      (value: string | string[] | null) => {
        if (typeof value === 'string') {
          return mask(value)
        }

        return undefined
      },
      [mask],
    )

    const handleChange = useCallback(
      (
        event: React.SyntheticEvent<Element, Event>,
        value: AutocompleteValue<string, any, any, any>,
        reason?: AutocompleteChangeReason,
      ) => {
        onChange?.(typeof value === 'string' ? mask(value, true) : value)
        if (reason === 'selectOption') {
          onSelectOption?.(value)
        }
      },
      [mask, onChange, onSelectOption],
    )

    const updateValueOnInputChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(event, event.target.value)
      },
      [handleChange],
    )

    const autocompleteConfig = {
      value,
      inputValue: isCustomValueAllowed ? getMaskedValue(value ?? '') : undefined,
      options,
      getOptionLabel,
      disabled,
      freeSolo: isCustomValueAllowed,
      autoHighlight: true,
      onChange: handleChange,
      id,
    }

    const textFieldConfig = {
      placeholder: placeholder,
      error: isError,
      helperText: isError ? errorMessage : '',
      onChange: isCustomValueAllowed ? updateValueOnInputChange : undefined,
    }

    return (
      <Box className={classes.inputContainer}>
        <InputLabel htmlFor={id} className={classes.inputLabel}>
          {label}
        </InputLabel>
        <Box>
          <Autocomplete
            {...autocompleteConfig}
            data-testid={id}
            noOptionsText="Ничего не найдено"
            popupIcon={<KeyboardArrowDownIcon />}
            className={classes.autocompleteField}
            renderInput={params => <TextField {...textFieldConfig} {...params} />}
            blurOnSelect
          />
        </Box>
      </Box>
    )
  },
)
