import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'

import { appRoutes } from 'app/Router/Router.utils'
import { ReactComponent as SberAutoLogo } from 'assets/icons/sberAutoLogo.svg'
import useStyles from './Header.styles'

interface HeaderProps {

}

export function Header(props: HeaderProps) {
  const classes = useStyles()

  const header = useMemo(() => (
      <Link className={classes.logo} to={appRoutes.dealership()}>
        <SberAutoLogo />
      </Link>
    ), [classes])

  return <div className={classes.headerContainer}>{header}</div>
}
