import React from 'react'

import { Box, Typography } from '@mui/material'

import { maskDigitsOnly, maskNoRestrictions, maskOnlyCyrillicNoDigits } from 'shared/masks/InputMasks'
import { DateInput } from 'shared/ui/DateInput/DateInput'
import { MaskedInput } from 'shared/ui/MaskedInput/MaskedInput'
import { SelectInput } from 'shared/ui/SelectInput/SelectInput'

import useStyles from './SecondDocArea.styles'

export function SecondDocArea() {
  const classes = useStyles()

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Второй документ</Typography>
      </Box>

      <SelectInput
        name="secondDocumentType"
        label="Тип второго документа"
        placeholder="-"
        options={['Водительское удостоверение']}
        gridColumn="span 12"
      />
      <Box gridColumn="span 4" />

      <MaskedInput
        name="secondDocumentNumber"
        label="Серия и номер"
        placeholder="-"
        mask={maskDigitsOnly}
        gridColumn="span 6"
      />
      <DateInput name="secondDocumentDate" label="Дата выдачи второго документа" gridColumn="span 6" />

      <MaskedInput
        name="secondDocumentIssuedBy"
        label="Кем выдан"
        placeholder="-"
        mask={maskOnlyCyrillicNoDigits}
        gridColumn="span 16"
      />
    </Box>
  )
}
