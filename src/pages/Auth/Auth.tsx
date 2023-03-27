import { Paper } from '@mui/material'
import Cookies from 'js-cookie'

import { useCheckToken } from 'common/auth/CheckToken'
import { LoginForm } from 'common/auth/LoginForm'
import { COOKIE_USER_TOKEN } from 'entities/constants/auth.constants'

import { useStyles } from './Auth.styles'

export function Auth() {
  const classes = useStyles()

  const isAuth = useCheckToken()

  if (isAuth) {
    Cookies.remove(COOKIE_USER_TOKEN)
  }

  return (
    <Paper className={classes.page} data-testid="authPage">
      <LoginForm />
    </Paper>
  )
}
