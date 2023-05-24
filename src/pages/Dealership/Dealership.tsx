import { FindApplication } from 'common/findApplication/findApplications'

import { useStyles } from './Dealership.styles'

export function Dealership() {
  const classes = useStyles()

  return (
    <div className={classes.page} data-testid="dealershipPage">
      <FindApplication />
    </div>
  )
}
