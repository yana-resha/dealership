import React, { useMemo } from 'react'

import { Box, Button, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import { Vendor } from '@sberauto/authdc-proto/public'
import { compact } from 'lodash'
import { KeyboardArrowDown } from '@mui/icons-material'
import { makeStyles } from '@mui/styles'
import { theme } from 'app/theme'

const useStyles = makeStyles(theme => ({
  posNumber: {
    color: theme.palette.grey[600],
  },

  button: {
    backgroundColor: theme.palette.background.paper + '!important',
  },
}))

type Props = {
  onButtonClick: () => void
}

export const PointInfo = ({ onButtonClick }: Props) => {
  const classes = useStyles()
  const pointOfSale: Vendor = JSON.parse(Cookies.get('pointOfSale') ?? '{}')

  const fullPointInfo = useMemo(() => {
    const entities = [
      pointOfSale?.vendorName,
      pointOfSale?.cityName,
      pointOfSale?.streetName,
      pointOfSale?.houseNumber,
    ]

    return compact(entities).join(', ')
  }, [pointOfSale])

  return (
    <Box display="flex" gap={2} alignItems="center">
      <Box>
        {pointOfSale?.vendorCode && (
          <Typography className={classes.posNumber}>ДЦ {pointOfSale?.vendorCode}</Typography>
        )}
        <Typography>{fullPointInfo}</Typography>
      </Box>

      <Button size="small" variant="contained" className={classes.button} onClick={onButtonClick}>
        <KeyboardArrowDown htmlColor={theme.palette.text.primary} />
      </Button>
    </Box>
  )
}
