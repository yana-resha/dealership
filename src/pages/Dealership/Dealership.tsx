import React from 'react'

import { useStyles } from './Dealership.styles'

export function Dealership() {
  const classes = useStyles()

  return (
    <div className={classes.page} data-testid="dealershipPage">
      <span>DealershipPage</span>
    </div>
  )
}
