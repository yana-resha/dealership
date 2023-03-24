import React from 'react'

import { Paper } from '@mui/material'
import { Navigate } from 'react-router-dom'

import { LoginForm } from 'common/auth/LoginForm'
import { useCheckToken } from 'common/auth/CheckToken'

import { useStyles } from './Auth.styles'

export function Auth() {
  const classes = useStyles()

  const isAuth = useCheckToken()

  if(isAuth) {
    return <Navigate to="/" replace /> 
  }
  
  return (
    <Paper className={classes.page} data-testid="authPage">
      <LoginForm />
    </Paper>
  )
}
