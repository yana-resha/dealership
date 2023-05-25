import React from 'react'

import { Box, Typography } from '@mui/material'

import { maskEmail, maskPhoneNumber } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'

import useStyles from './CommunicationArea.styles'

export function CommunicationArea() {
  const classes = useStyles()

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Связь с клиентом</Typography>
      </Box>

      <MaskedInputFormik
        name="mobileNumber"
        label="Мобильный телефон"
        placeholder="-"
        mask={maskPhoneNumber}
        gridColumn="span 5"
        disabled
      />
      <MaskedInputFormik
        name="additionalNumber"
        label="Дополнительный телефон"
        placeholder="-"
        mask={maskPhoneNumber}
        gridColumn="span 5"
      />

      <MaskedInputFormik name="email" label="Email" placeholder="-" mask={maskEmail} gridColumn="span 12" />
    </Box>
  )
}
