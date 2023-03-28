import React from 'react'

import { Paper } from '@mui/material'

import { LoginForm } from 'common/auth/LoginForm'
import { useCheckToken } from 'common/auth/CheckToken'

import { useStyles } from './Auth.styles'
import Cookies from 'js-cookie'
import { COOKIE_USER_TOKEN } from 'entities/constants/auth.constants'

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
