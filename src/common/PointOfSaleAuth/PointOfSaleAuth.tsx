import React, { useCallback } from 'react'

import { Box, IconButton, Typography } from '@mui/material'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { useLogout } from 'common/auth'
import { ChoosePoint } from 'entities/pointOfSale'
import { useGetUser } from 'entities/user'
import SberTypography from 'shared/ui/SberTypography'

import useStyles from './PointOfSaleAuth.styles'

export function PointOfSaleAuth() {
  const classes = useStyles()

  const { onLogout } = useLogout()

  const { data } = useGetUser()
  const onBackClick = useCallback(() => {
    onLogout()
  }, [onLogout])

  return (
    <Box className={classes.pointOfSaleFormContainer}>
      <IconButton className={classes.backArrow} onClick={onBackClick} data-testid="backButton">
        <KeyboardArrowLeft />
      </IconButton>

      <Typography className={classes.formMessage}>
        {data ? `Привет, ${data?.lastName} ${data?.firstName}` : '⁣'}
      </Typography>

      <Box className={classes.autocompleteContainer}>
        <SberTypography sberautoVariant="body5" component="p" className={classes.subtitle} align="left">
          Выберите автосалон
        </SberTypography>
        <ChoosePoint />
      </Box>
    </Box>
  )
}
