import React from 'react'

import { Box, Typography } from '@mui/material'

import { maskEmail, maskPhoneNumber } from 'shared/masks/InputMasks'
import { MaskedInput } from 'shared/ui/MaskedInput/MaskedInput'
import { SelectInput } from 'shared/ui/SelectInput/SelectInput'

import useStyles from './CommunicationArea.styles'

export function CommunicationArea() {
  const classes = useStyles()

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Связь с клиентом</Typography>
      </Box>

      <SelectInput
        name="phoneType"
        label="Тип телефона"
        placeholder="-"
        options={['Основной', 'Рабочий', 'Дополнительный']}
        gridColumn="span 8"
      />
      <MaskedInput
        name="phoneNumber"
        label="Телефон"
        placeholder="-"
        mask={maskPhoneNumber}
        gridColumn="span 8"
      />

      <Typography className={classes.textButton} gridColumn="span 6">
        Добавить еще телефон
      </Typography>
      <Box gridColumn="span 10" />

      <MaskedInput name="email" label="Email" placeholder="-" mask={maskEmail} gridColumn="span 16" />
    </Box>
  )
}
