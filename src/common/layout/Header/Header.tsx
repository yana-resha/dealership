import React, { useCallback, useState } from 'react'

import { ClickAwayListener } from '@mui/material'
import { Vendor } from '@sberauto/loanapplifecycledc-proto/public'
import Cookies from 'js-cookie'

import { PointInfo } from 'entities/pointOfSale'
import { ChoosePoint } from 'entities/pointOfSale'
import { UserInfo, useUserRoles } from 'entities/user'

import useStyles from './Header.styles'

export function Header() {
  const classes = useStyles()
  const [isEdit, setIsEdit] = useState(false)
  const pointOfSale: Vendor = JSON.parse(Cookies.get('pointOfSale') ?? '{}')
  const { isCreditExpert } = useUserRoles()

  const setEditing = useCallback(() => {
    setIsEdit(true)
  }, [])

  const removeEditing = useCallback(() => {
    if (isEdit) {
      setIsEdit(false)
    }
  }, [isEdit])

  return (
    <ClickAwayListener onClickAway={removeEditing}>
      <div className={classes.headerContainer}>
        {isCreditExpert &&
          (!isEdit ? (
            <PointInfo onButtonClick={setEditing} />
          ) : (
            <ChoosePoint value={pointOfSale} isHeader onSuccessEditing={removeEditing} />
          ))}

        <UserInfo />
      </div>
    </ClickAwayListener>
  )
}
