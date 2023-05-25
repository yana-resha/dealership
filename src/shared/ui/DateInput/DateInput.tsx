import React, { useCallback, useEffect, useState } from 'react'

import { Box, InputLabel } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { DateTime } from 'luxon'

import { ReactComponent as CalendarTodayOutlined } from 'assets/icons/calendar.svg'

import useStyles from './DateInput.styles'
import { DateInputProps } from './dateInput.types'

const YEAR_INPUT_COMPLETED = 1000
const DATE_FORMAT = 'dd.MM.yyyy'

export const DateInput = React.memo((props: DateInputProps) => {
  const classes = useStyles()
  const { value, onChange, isError, errorMessage, id, label, disabled } = props
  const [fieldValue, setFieldValue] = useState<DateTime | null>(
    value != null ? DateTime.fromJSDate(value) : null,
  )

  useEffect(() => {
    if (value != null && DateTime.fromJSDate(value) !== fieldValue) {
      setFieldValue(DateTime.fromJSDate(value))
    }
  }, [value])

  const onBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const chosenDate = DateTime.fromFormat(event.target.value, DATE_FORMAT)
      if (!chosenDate.isValid || chosenDate.toJSDate().getFullYear() < YEAR_INPUT_COMPLETED) {
        setFieldValue(null)
        onChange?.(null)
      }
    },
    [fieldValue],
  )

  function handleDateChange(value: DateTime | null) {
    if (value != null && value.isValid) {
      const chosenDate = value.toJSDate()
      chosenDate.setHours(0, 0, 0, 0)
      if (chosenDate.getFullYear() > YEAR_INPUT_COMPLETED) {
        setFieldValue(value)
        onChange?.(chosenDate)
      }
    }
  }

  const configDatePicker = {
    value: fieldValue,
    onChange: handleDateChange,
    format: DATE_FORMAT,
    disabled: disabled,
    localeText: {
      fieldDayPlaceholder: () => 'ДД',
      fieldMonthPlaceholder: () => 'ММ',
      fieldYearPlaceholder: () => 'ГГГГ',
    },
    components: {
      OpenPickerIcon: CalendarTodayOutlined,
    },
    slotProps: {
      textField: {
        id: id,
        placeholder: 'ДД.ММ.ГГГГ',
        error: isError,
        helperText: isError ? errorMessage : '',
        onBlur: onBlur,
      },
    },
  }

  return (
    <Box className={classes.inputContainer} minWidth="min-content">
      <InputLabel htmlFor={id} className={classes.inputLabel}>
        {label}
      </InputLabel>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
        <DatePicker className={classes.dateField} {...configDatePicker} />
      </LocalizationProvider>
    </Box>
  )
})
