import { Paper } from '@mui/material'

import { LoginForm, useCheckToken } from 'common/auth'
import { authToken } from 'shared/api/token'

import { useStyles } from './Auth.styles'

export function Auth() {
  const classes = useStyles()

  const isAuth = useCheckToken()

  if (isAuth) {
    authToken.jwt.delete()
  }

  return (
    <Paper className={classes.page} data-testid="authPage">
      <LoginForm />
    </Paper>
  )
}
