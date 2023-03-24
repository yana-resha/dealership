import React from 'react'

import { Drawer } from '@mui/material'
import { Link } from 'react-router-dom'

import { ReactComponent as SberAutoLogo } from 'assets/icons/sberAutoLogo.svg'
import { useCheckToken } from 'common/auth/CheckToken'

import { NavigationMenu } from './subcomponents/NavigationMenu'
import { useStyles } from './Drawer.styles'

export function CustomDrawer() {
  const classes = useStyles()

  const isAuth = useCheckToken()

  return (
    <Drawer
      className={classes.navigationMenuDrawer}
      open
      variant="permanent"
      PaperProps={{ elevation: 8 }}
    >
      <Link className={classes.logo} to="/">
        <SberAutoLogo />
      </Link>

      <NavigationMenu authType={isAuth ? 'auth' : 'no_auth'} />
    </Drawer>
  )
}
