import React from 'react'

import { Box } from '@mui/material'

import { DownloadClientDocs } from 'entities/DownloadClientDocs/DownloadClientDocs'

import { useStyles } from './CreateOrderPage.styles'

export function CreateOrderPage() {
  const classes = useStyles()

  return (
    <div className={classes.page} data-testid="dealershipPage">
      <Box width={244}>
        <DownloadClientDocs />
      </Box>
    </div>
  )
}
