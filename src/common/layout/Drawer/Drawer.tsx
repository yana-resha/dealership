import { Drawer } from '@mui/material'
import { Link } from 'react-router-dom'

import { ReactComponent as SberIcon } from 'assets/icons/sberIcon.svg'
import { ReactComponent as SberLogoTitle } from 'assets/icons/sberLogoTitle.svg'

import { useStyles } from './Drawer.styles'
import { NavigationMenu } from './subcomponents/NavigationMenu'

export function CustomDrawer() {
  const classes = useStyles()

  return (
    <Drawer className={classes.navigationMenuDrawer} open variant="permanent" PaperProps={{ elevation: 8 }}>
      <Link className={classes.logo} to="/">
        <SberIcon />
        <SberLogoTitle className={classes.logoTitle} />
      </Link>

      <NavigationMenu />
    </Drawer>
  )
}
