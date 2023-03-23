import React from 'react'

import { Box, Typography } from '@mui/material'

import { maskDigitsOnly, maskNoRestrictions, maskPhoneNumber } from 'shared/masks/InputMasks'
import { DateInput } from 'shared/ui/DateInput/DateInput'
import { MaskedInput } from 'shared/ui/MaskedInput/MaskedInput'
import { SelectInput } from 'shared/ui/SelectInput/SelectInput'

import useStyles from './JobArea.styles'

export function JobArea() {
  const classes = useStyles()

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Работа</Typography>
      </Box>

      <SelectInput
        name="occupation"
        label="Должность/Вид занятости"
        placeholder="-"
        options={['Аналитик', 'Разработчик']}
        gridColumn="span 8"
      />
      <DateInput name="employmentDate" label="Дата устройства на работу" gridColumn="span 6" />

      <MaskedInput
        name="employerName"
        label="Наименование организации"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 16"
      />

      <MaskedInput
        name="employerPhone"
        label="Телефон работодателя"
        placeholder="-"
        mask={maskPhoneNumber}
        gridColumn="span 8"
      />

      <MaskedInput
        name="employerAddress"
        label="Адрес работодателя"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 16"
      />

      <MaskedInput
        name="employerInn"
        label="ИНН организации"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 8"
      />
      <SelectInput
        name="contractType"
        label="Тип Контракта"
        placeholder="-"
        options={['ГПХ']}
        gridColumn="span 8"
      />
    </Box>
  )
}
