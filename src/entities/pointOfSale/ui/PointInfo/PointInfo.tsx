import React, { useMemo } from 'react'

import { Box, Button, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Vendor } from '@sberauto/loanapplifecycledc-proto/public'
import Cookies from 'js-cookie'
import compact from 'lodash/compact'

import { ReactComponent as KeyboardArrowDown } from 'assets/icons/keyboardArrowDown.svg'
import { COOKIE_POINT_OF_SALE } from 'entities/pointOfSale'

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
  const pointOfSale: Vendor = JSON.parse(Cookies.get(COOKIE_POINT_OF_SALE) ?? '{}')

  const fullPointInfo = useMemo(() => {
    const entities = [pointOfSale?.vendorName, pointOfSale?.address]

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
        <KeyboardArrowDown />
      </Button>
    </Box>
  )
}
