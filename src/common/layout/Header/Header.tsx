import React from 'react'

import { Box, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import { Vendor } from '@sberauto/authdc-proto/public'
import useStyles from './Header.styles'

export function Header() {
  const classes = useStyles()
  const pointOfSale: Vendor = JSON.parse(Cookies.get('pointOfSale') ?? '{}')
  const creditExpert = {
    name: 'Михаил Терентьев',
    phoneNumber: '+7 800 555 3535',
  }

  return (
    <div className={classes.headerContainer}>
      <Box>
        <Typography className={classes.posNumber}>ДЦ {pointOfSale?.vendorCode}</Typography>
        <Typography>
          {pointOfSale?.vendorName}, {pointOfSale?.cityName}, {pointOfSale?.streetName},{' '}
          {pointOfSale?.houseNumber}
        </Typography>
      </Box>
      <Box>
        <Typography>{creditExpert.name}</Typography>
        <Typography>{creditExpert.phoneNumber}</Typography>
      </Box>
    </div>
  )
}
