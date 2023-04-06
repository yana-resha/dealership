import React from 'react'

import { Paper } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Navigate } from 'react-router-dom'

import { useCheckToken } from 'common/auth/CheckToken'
import { PointOfSaleAuth } from 'common/PointOfSaleAuth'
import { appRoutePaths } from 'shared/navigation/routerPath'

const useStyles = makeStyles(theme => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',

    [theme.breakpoints.down('sm')]: {
      alignItems: 'unset',
      padding: 0,
      backgroundColor: theme.palette.background.paper,
    },
  },
}))

export function PointOfSale() {
  const classes = useStyles()

  const isAuth = useCheckToken()

  if (!isAuth) {
    return <Navigate to={appRoutePaths.auth} replace />
  }

  return (
    <Paper className={classes.page} data-testid="authPage">
      <PointOfSaleAuth />
    </Paper>
  )
}
