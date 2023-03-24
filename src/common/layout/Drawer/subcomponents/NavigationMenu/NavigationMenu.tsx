import React, { useCallback } from 'react'

import { Box, Button, ListItemText, Tab, Tabs } from '@mui/material'
import { useNavigate, useLocation, matchPath } from 'react-router-dom'

import { AuthType } from 'common/auth/CheckToken'

import { MenuItem } from './hooks/types'
import { useGetLogoutBtn } from './hooks/useGetLogoutBtn'
import { useGetItems } from './hooks/useGetItems'

import useStyles from './NavigationMenu.styles'

type Props = {
  authType: AuthType
}

export function NavigationMenu(props: Props) {
  const { authType } = props

  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = useGetItems({ authType })
  const logoutItems = useGetLogoutBtn({ authType })

  const onClick = useCallback(
    (item: MenuItem) => {
      item.onCallback?.()
      navigate(item.path)
    },
    [navigate],
  )

  const handleChange = useCallback(
    (event: React.SyntheticEvent, index: number) => {
      onClick(menuItems[index])
    },
    [menuItems, onClick],
  )

  const renderLogout = useCallback(
    (item: MenuItem) => (
      <Button onClick={() => onClick(item)} className={classes.logoutBtn}>
        {!!item.icon && item.icon({ isSelected: false })}
        <ListItemText primary={item.label} className={classes.label} />
      </Button>
    ),
    [classes, onClick],
  )

  const renderItem = useCallback(
    (item: MenuItem, index: number) => {
      const isSelected = !!matchPath(item.path, location.pathname)
      const id = `${item.label}_${item.path}`
      const tabProps = { id, key: id, 'aria-controls': `vertical-tabpanel-${index}` }
      const icon = item?.icon?.({ isSelected })

      return <Tab {...tabProps} label={item.label} icon={icon} className={classes.tab} />
    },
    [classes, location.pathname],
  )

  const value = Math.max(
    menuItems.findIndex(item => matchPath(item.path, location.pathname)),
    0,
  )

  return (
    <>
      {!!menuItems.length && (
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={classes.tabs}
        >
          {menuItems.map(renderItem)}
        </Tabs>
      )}

      {logoutItems && (
        <Box className={classes.logoutItem} data-testid="logoutBtn">
          {renderLogout(logoutItems)}
        </Box>
      )}
    </>
  )
}
