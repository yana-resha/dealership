import React from 'react'

import { Box, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'

import { CreateOrderPageState } from 'pages/CreateOrder/CreateOrder'
import { maskEmail, maskMobilePhoneNumber, maskCommonPhoneNumber } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'

import useStyles from './CommunicationArea.styles'

export function CommunicationArea() {
  const classes = useStyles()
  const location = useLocation()
  const state = location.state as CreateOrderPageState
  const { isFullCalculator = false } = state || {}

  return (
    <Box className={classes.gridContainer}>
      <Box gridColumn="1 / -1" minWidth="min-content">
        <Typography className={classes.areaLabel}>Связь с клиентом</Typography>
      </Box>

      <MaskedInputFormik
        name="mobileNumber"
        label="Мобильный телефон"
        placeholder="-"
        mask={maskMobilePhoneNumber}
        gridColumn="span 5"
        disabled
      />
      <MaskedInputFormik
        name="additionalNumber"
        label="Дополнительный телефон"
        placeholder="-"
        mask={maskCommonPhoneNumber}
        gridColumn="span 5"
      />

      {isFullCalculator && (
        <MaskedInputFormik name="email" label="Email" placeholder="-" mask={maskEmail} gridColumn="span 12" />
      )}
    </Box>
  )
}
