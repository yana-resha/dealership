import React, { useCallback, useState } from 'react'

import { ClickAwayListener } from '@mui/material'

import { PointInfo } from 'entities/pointOfSale'
import { ChoosePoint } from 'entities/pointOfSale'
import { UserInfo, useUserRoles } from 'entities/user'

import useStyles from './Header.styles'

export function Header() {
  const classes = useStyles()
  const [isEdit, setIsEdit] = useState(false)
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
            <ChoosePoint isHeader onSuccessEditing={removeEditing} />
          ))}

        <UserInfo />
      </div>
    </ClickAwayListener>
  )
}
