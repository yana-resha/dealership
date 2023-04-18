import React, { useCallback } from 'react'

import { Avatar, Box, IconButton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { ChoosePoint } from 'entities/pointOfSale'
import { appRoutePaths } from 'shared/navigation/routerPath'

import useStyles from './PointOfSaleAuth.styles'

export function PointOfSaleAuth() {
  const classes = useStyles()
  const navigate = useNavigate()

  const onBackClick = useCallback(() => {
    navigate(appRoutePaths.auth)
  }, [navigate])

  return (
    <Box className={classes.pointOfSaleFormContainer}>
      <IconButton className={classes.backArrow} onClick={onBackClick} data-testid="backButton">
        <KeyboardArrowLeft />
      </IconButton>

      <Avatar className={classes.avatarContainer} data-testid="avatar">
        {' '}
      </Avatar>

      <Typography className={classes.formMessage}>Выберите автосалон</Typography>

      <ChoosePoint />
    </Box>
  )
}
