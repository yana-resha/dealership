import React, { useMemo } from 'react'

import { KeyboardArrowDown } from '@mui/icons-material'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Vendor } from '@sberauto/loanapplifecycledc-proto/public'
import Cookies from 'js-cookie'
import { compact } from 'lodash'

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
  const theme = useTheme()
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
