import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Autocomplete, AutocompleteValue, Box, InputLabel, TextField } from '@mui/material'
import { SuggestionGetAddressSuggestions } from '@sberauto/dadata-proto/public'
import { Timeout } from 'react-number-format/types/types'

import { ReactComponent as KeyboardArrowDownIcon } from 'assets/icons/keyboardArrowDown.svg'

import { DADATA_OPTIONS_LIMIT, useGetAddressSuggestions } from '../../api/requests/dadata.api'
import useStyles from './AutocompleteInput.styles'

type Props = {
  label: string
  placeholder: string
  value?: SuggestionGetAddressSuggestions
  id?: string
  onChange?: (option: SuggestionGetAddressSuggestions) => void
  onInputChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  gridColumn?: string
  isError?: boolean
  errorMessage?: string
  disabled?: boolean
}

export const AutocompleteDaDataAddress = ({
  value,
  label,
  id,
  placeholder,
  gridColumn,
  onChange,
  onInputChange,
  isError,
  errorMessage,
  disabled,
}: Props) => {
  const classes = useStyles()
  const [fieldValue, setFieldValue] = useState<SuggestionGetAddressSuggestions | undefined>(value)
  const { mutate: getAddressSuggestion, data } = useGetAddressSuggestions()
  const [requestTimeout, setRequestTimeout] = useState(false)
  const timerRef = useRef<Timeout | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    },
    [],
  )

  function handleChange(
    event: React.SyntheticEvent<Element, Event>,
    value: AutocompleteValue<SuggestionGetAddressSuggestions, any, any, any>,
  ) {
    setFieldValue(value as SuggestionGetAddressSuggestions)
    onChange?.(value as SuggestionGetAddressSuggestions)
  }

  const retrieveOptionLabels = useCallback(
    (option: SuggestionGetAddressSuggestions) => option.unrestrictedValue ?? '',
    [],
  )

  const updateListOfSuggestions = useCallback(
    (value: string) => {
      if (!requestTimeout && value.length > 0) {
        getAddressSuggestion(value)
        setRequestTimeout(true)
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
          setRequestTimeout(false)
        }, 1000)
      }
    },
    [getAddressSuggestion, requestTimeout],
  )

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateListOfSuggestions(event.target.value)
      onInputChange?.(event)
    },
    [onInputChange, updateListOfSuggestions],
  )

  const handleOnFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      updateListOfSuggestions(event.target.value)
    },
    [updateListOfSuggestions],
  )

  const textFieldConfig = {
    id,
    placeholder: placeholder,
    error: isError,
    helperText: isError ? errorMessage : '',
    onChange: handleInputChange,
    onFocus: handleOnFocus,
  }

  return (
    <Box gridColumn={gridColumn} className={classes.inputContainer}>
      <InputLabel htmlFor={id} className={classes.inputLabel}>
        {label}
      </InputLabel>
      <Autocomplete
        options={data?.suggestions ?? []}
        getOptionLabel={retrieveOptionLabels}
        disabled={disabled}
        id={id}
        value={fieldValue}
        onChange={handleChange}
        filterOptions={option =>
          option.length > DADATA_OPTIONS_LIMIT ? option.slice(0, DADATA_OPTIONS_LIMIT) : option
        }
        isOptionEqualToValue={() => true}
        noOptionsText="Ничего не найдено"
        popupIcon={<KeyboardArrowDownIcon />}
        className={classes.autocompleteField}
        renderInput={params => <TextField {...textFieldConfig} {...params} />}
      />
    </Box>
  )
}
