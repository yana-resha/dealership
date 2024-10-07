import { useCallback } from 'react'

import { Box, Button, Tab, Tabs } from '@mui/material'
import cx from 'classnames'
import { useNavigate, useLocation, matchPath } from 'react-router-dom'

import { CustomTooltip } from 'shared/ui/CustomTooltip'

import { MenuItem } from './hooks/types'
import { useGetItems } from './hooks/useGetItems'
import { useGetLogoutBtn } from './hooks/useGetLogoutBtn'
import useStyles from './NavigationMenu.styles'

type Props = {
  isCollapsed: boolean
}
export function NavigationMenu({ isCollapsed }: Props) {
  const classes = useStyles({ isCollapsed })
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = useGetItems()
  const logoutItems = useGetLogoutBtn()

  const handleTabClick = useCallback(
    (item: MenuItem) => {
      item.onCallback?.()
      navigate(item.path)
    },
    [navigate],
  )

  const renderLogout = useCallback(
    (item: MenuItem) => (
      <CustomTooltip
        arrow
        placement="right"
        title={item.label}
        disableHoverListener={!isCollapsed}
        disableFocusListener={!isCollapsed}
      >
        <Button onClick={() => handleTabClick(item)} className={classes.logoutBtn}>
          {!!item.icon && item.icon({ isSelected: false })}
          <span className={classes.hiddenLabelContainer}>
            <span
              className={cx(classes.label, {
                [classes.visibleLabel]: !isCollapsed,
              })}
            >
              {item.label}
            </span>
          </span>
        </Button>
      </CustomTooltip>
    ),
    [
      classes.hiddenLabelContainer,
      classes.label,
      classes.logoutBtn,
      classes.visibleLabel,
      handleTabClick,
      isCollapsed,
    ],
  )

  const renderItem = useCallback(
    (item: MenuItem, index: number) => {
      const isSelected = !!matchPath(item.path, location.pathname)
      const id = `${item.label}_${item.path}`
      const tabProps = { id, 'aria-controls': `vertical-tabpanel-${index}` }
      const icon = item?.icon?.({ isSelected })

      return (
        <CustomTooltip
          key={id}
          arrow
          placement="right"
          title={item.label}
          disableHoverListener={!isCollapsed}
          disableFocusListener={!isCollapsed}
        >
          <Tab
            {...tabProps}
            label={
              <span className={classes.hiddenLabelContainer}>
                <span
                  className={cx({
                    [classes.visibleLabel]: !isCollapsed,
                  })}
                >
                  {item.label}
                </span>
              </span>
            }
            icon={icon}
            className={cx(classes.tab, {
              [classes.largeTab]: !isCollapsed,
            })}
            onClick={() => handleTabClick(menuItems[index])}
          />
        </CustomTooltip>
      )
    },
    [
      location.pathname,
      isCollapsed,
      classes.hiddenLabelContainer,
      classes.visibleLabel,
      classes.tab,
      classes.largeTab,
      handleTabClick,
      menuItems,
    ],
  )

  const value = Math.max(
    menuItems.findIndex(item => matchPath(`${item.path}/*`, location.pathname)),
    0,
  )

  return (
    <>
      {!!menuItems.length && (
        <Tabs orientation="vertical" variant="scrollable" value={value} className={classes.tabs}>
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
