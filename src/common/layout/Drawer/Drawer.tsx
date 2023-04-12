import React from 'react'

import { Drawer } from '@mui/material'
import { Link } from 'react-router-dom'

import { ReactComponent as SberAutoLogo } from 'assets/icons/sberAutoLogo.svg'
import { useCheckToken, useCheckPointOfSale } from 'common/auth'

import { useStyles } from './Drawer.styles'
import { NavigationMenu } from './subcomponents/NavigationMenu'

export function CustomDrawer() {
  const classes = useStyles()

  const isAuth = useCheckToken()
  const isSelectedPoint = useCheckPointOfSale()

  return (
    <Drawer className={classes.navigationMenuDrawer} open variant="permanent" PaperProps={{ elevation: 8 }}>
      <Link className={classes.logo} to="/">
        <SberAutoLogo />
      </Link>

      <NavigationMenu authType={isAuth && isSelectedPoint ? 'auth' : 'no_auth'} />
    </Drawer>
  )
}
