import React, { useCallback, useState } from 'react'

import { Box, Typography } from '@mui/material'
import Cookies from 'js-cookie'
import { Vendor } from '@sberauto/authdc-proto/public'
import useStyles from './Header.styles'
import { ChoosePoint } from 'entities/ChoosePoint/ChoosePoint'
import { PointInfo } from 'entities/PointInfo/PointInfo'

export function Header() {
  const classes = useStyles()
  const [isEdit, setIsEdit] = useState(false)
  const pointOfSale: Vendor = JSON.parse(Cookies.get('pointOfSale') ?? '{}')
  const creditExpert = {
    name: 'Михаил Терентьев',
    phoneNumber: '+7 800 555 3535',
  }

  const setEditing = useCallback(() => {
    setIsEdit(true)
  }, [])

  const removeEditing = useCallback(() => {
    setIsEdit(false)
  }, [])

  return (
    <div className={classes.headerContainer}>
      {!isEdit ? (
        <PointInfo onButtonClick={setEditing} />
      ) : (
        <ChoosePoint value={pointOfSale} isHeader onSuccessEditing={removeEditing} />
      )}

      <Box minWidth={200} textAlign="right">
        <Typography>{creditExpert.name}</Typography>
        <Typography>{creditExpert.phoneNumber}</Typography>
      </Box>
    </div>
  )
}
