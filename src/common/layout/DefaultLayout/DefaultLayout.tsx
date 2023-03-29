import React from 'react'

import { AppBar, Box, Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'

import { Drawer } from '../Drawer'
import { Header } from '../Header'
import { useStyles } from './DefaultLayout.styles'

type Props = {
  isHeader?: boolean
}

export function DefaultLayout(props: Props) {
  const { isHeader = true } = props

  const classes = useStyles()

  return (
    <Box className={classes.globalContainer}>
      {isHeader && (
        <AppBar className={classes.appBar} position="fixed">
          <Toolbar>
            <Header />
          </Toolbar>
        </AppBar>
      )}

      <Drawer />

      <Box className={classes.main} component="main">
        <Outlet />
      </Box>
    </Box>
  )
}
