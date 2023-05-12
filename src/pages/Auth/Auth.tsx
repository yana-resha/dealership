import { Paper } from '@mui/material'

import { LoginForm } from 'common/auth'

import { useStyles } from './Auth.styles'

export function Auth() {
  const classes = useStyles()

  return (
    <Paper className={classes.page} data-testid="authPage">
      <LoginForm />
    </Paper>
  )
}
