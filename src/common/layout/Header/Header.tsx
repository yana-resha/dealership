import React, { useCallback, useState } from 'react'

import { Vendor } from '@sberauto/authdc-proto/public'
import Cookies from 'js-cookie'

import { PointInfo } from 'entities/pointOfSale'
import { ChoosePoint } from 'entities/pointOfSale'
import { UserInfo } from 'entities/user'

import useStyles from './Header.styles'

export function Header() {
  const classes = useStyles()
  const [isEdit, setIsEdit] = useState(false)
  const pointOfSale: Vendor = JSON.parse(Cookies.get('pointOfSale') ?? '{}')

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

      <UserInfo />
    </div>
  )
}
