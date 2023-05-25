import React from 'react'

import { Box, Typography } from '@mui/material'

import { maskCyrillicAndDigits, maskDigitsOnly, maskOnlyCyrillicNoDigits } from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SelectInputFormik } from 'shared/ui/SelectInput/SelectInputFormik'

import useStyles from './SecondDocArea.styles'

export function SecondDocArea() {
  const classes = useStyles()

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Второй документ</Typography>
      </Box>

      <SelectInputFormik
        name="secondDocumentType"
        label="Тип второго документа"
        placeholder="-"
        options={['Водительское удостоверение']}
        gridColumn="span 8"
      />
      <Box gridColumn="span 8" />

      <MaskedInputFormik
        name="secondDocumentNumber"
        label="Серия и номер"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 3"
      />
      <DateInputFormik name="secondDocumentDate" label="Дата выдачи второго документа" gridColumn="span 2" />

      <MaskedInputFormik
        name="secondDocumentIssuedBy"
        label="Кем выдан"
        placeholder="-"
        mask={maskCyrillicAndDigits}
        gridColumn="span 7"
      />
    </Box>
  )
}
