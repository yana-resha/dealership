import React from 'react'

import { Box } from '@mui/material'

import { theme } from '../../app/theme'
import { ClientForm } from '../../entities/ClientForm'
import { useStyles } from './CreateOrderPage.styles'

export function CreateOrderPage() {
  const classes = useStyles()

  return (
    <div className={classes.page} data-testid="dealershipPage">
      <Box className={classes.loaderContainer}>
        <ClientForm />
      </Box>
    </div>
  )
}
