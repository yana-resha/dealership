import React from 'react'

import { CalendarTodayOutlined } from '@mui/icons-material'
import { Box, InputLabel } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { useField, useFormikContext } from 'formik'
import { DateTime } from 'luxon'

import useStyles from './DateInput.styles'

type Props = {
  name: string
  label: string
  gridColumn?: string
}
export const DateInput = (props: Props) => {
  const classes = useStyles()
  const { name, label, gridColumn } = props
  const [field, meta] = useField(name)
  const { setFieldValue } = useFormikContext()
  const isError = meta != undefined && meta.touched && meta.error != undefined

  function handleDateChange(value: DateTime | null) {
    if (value != null && value.isValid) {
      const chosenDate = value.toJSDate()
      chosenDate.setHours(0, 0, 0, 0)
      setFieldValue(field.name, chosenDate)
    } else {
      setFieldValue(field.name, '')
    }
  }

  const configDatePicker = {
    onChange: handleDateChange,
    format: 'dd.MM.yyyy',
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
        id: name,
        placeholder: 'ДД.ММ.ГГГГ',
        error: isError,
        helperText: isError ? meta.error : '',
      },
    },
  }

  return (
    <Box className={classes.inputContainer} gridColumn={gridColumn} minWidth="min-content">
      <InputLabel htmlFor={name} className={classes.inputLabel}>
        {label}
      </InputLabel>
      <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="ru">
        <DatePicker className={classes.dateField} {...configDatePicker} />
      </LocalizationProvider>
    </Box>
  )
}
