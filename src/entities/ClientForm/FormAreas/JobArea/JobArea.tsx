import React from 'react'

import { Box, Typography } from '@mui/material'

import { maskDigitsOnly, maskNoRestrictions, maskPhoneNumber } from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import useStyles from './JobArea.styles'

export function JobArea() {
  const classes = useStyles()

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Работа</Typography>
      </Box>

      <SelectInputFormik
        name="occupation"
        label="Должность/Вид занятости"
        placeholder="-"
        options={['Аналитик', 'Разработчик']}
        gridColumn="span 8"
      />
      <DateInputFormik name="employmentDate" label="Дата устройства на работу" gridColumn="span 6" />

      <MaskedInputFormik
        name="employerName"
        label="Наименование организации"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 16"
      />

      <MaskedInputFormik
        name="employerPhone"
        label="Телефон работодателя"
        placeholder="-"
        mask={maskPhoneNumber}
        gridColumn="span 8"
      />

      <MaskedInputFormik
        name="employerAddress"
        label="Адрес работодателя"
        placeholder="-"
        mask={maskNoRestrictions}
        gridColumn="span 16"
      />

      <MaskedInputFormik
        name="employerInn"
        label="ИНН организации"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 8"
      />
      <SelectInputFormik
        name="contractType"
        label="Тип Контракта"
        placeholder="-"
        options={['ГПХ']}
        gridColumn="span 8"
      />
    </Box>
  )
}
