import React, { useMemo } from 'react'

import { Box, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import { Vendor } from '@sberauto/authdc-proto/public'
import useStyles from './Header.styles'
import { compact } from 'lodash'

export function Header() {
  const classes = useStyles()
  const pointOfSale: Vendor = JSON.parse(Cookies.get('pointOfSale') ?? '{}')
  const creditExpert = {
    name: 'Михаил Терентьев',
    phoneNumber: '+7 800 555 3535',
  }

  const fullString = useMemo(() => {
    const entities = [
      pointOfSale?.vendorName,
      pointOfSale?.cityName,
      pointOfSale?.streetName,
      pointOfSale?.houseNumber,
    ]

    return compact(entities).join(', ')
  }, [pointOfSale])

  return (
    <div className={classes.headerContainer}>
      <Box>
        {pointOfSale?.vendorCode && (
          <Typography className={classes.posNumber}>ДЦ {pointOfSale?.vendorCode}</Typography>
        )}
        <Typography>{fullString}</Typography>
      </Box>
      <Box>
        <Typography>{creditExpert.name}</Typography>
        <Typography>{creditExpert.phoneNumber}</Typography>
      </Box>
    </div>
  )
}
