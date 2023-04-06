import { Paper } from '@mui/material'
import Cookies from 'js-cookie'

import { useCheckToken } from 'common/auth/CheckToken'
import { COOKIE_JWT_TOKEN } from 'common/auth/constants'
import { LoginForm } from 'common/auth/LoginForm'

import { useStyles } from './Auth.styles'

export function Auth() {
  const classes = useStyles()

  const isAuth = useCheckToken()

  if (isAuth) {
    Cookies.remove(COOKIE_JWT_TOKEN)
  }

  return (
    <Paper className={classes.page} data-testid="authPage">
      <LoginForm />
    </Paper>
  )
}
