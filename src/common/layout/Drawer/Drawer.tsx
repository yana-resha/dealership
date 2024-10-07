import { useCallback, useState } from 'react'

import { Button, Drawer } from '@mui/material'
import cx from 'classnames'
import { Link } from 'react-router-dom'

import { ReactComponent as KeyboardArrowLeft } from 'assets/icons/keyboardArrowLeft.svg'
import { ReactComponent as SberIcon } from 'assets/icons/sberIcon.svg'
import { ReactComponent as SberLogoTitle } from 'assets/icons/sberLogoTitle.svg'

import { useStyles } from './Drawer.styles'
import { NavigationMenu } from './subcomponents/NavigationMenu'

export function CustomDrawer() {
  const [isCollapsed, setCollapsed] = useState(false)
  const classes = useStyles({ isCollapsed })

  const handleClick = useCallback(() => {
    setCollapsed(prev => !prev)
  }, [])

  return (
    <Drawer className={classes.navigationMenuDrawer} open variant="permanent" PaperProps={{ elevation: 8 }}>
      <Link className={classes.logo} to="/">
        <SberIcon />
        <span className={classes.logoTitleContainer}>
          <SberLogoTitle
            className={cx({
              [classes.visibleLogoTitle]: !isCollapsed,
            })}
          />
        </span>
      </Link>

      <NavigationMenu isCollapsed={isCollapsed} />
      <Button className={classes.switchMenuBtn} onClick={handleClick} variant="outlined">
        <KeyboardArrowLeft className={classes.switchMenuBtnIcon} />
      </Button>
    </Drawer>
  )
}
