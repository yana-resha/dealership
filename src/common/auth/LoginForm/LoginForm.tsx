import React from 'react'

import { Avatar, Box, Button, CircularProgress, Typography } from '@mui/material'

import { ReactComponent as AvatarLogo } from 'assets/icons/avatar.svg'

import { useAuthSberId } from './LoginForm.hooks'
import useStyles from './LoginForm.styles'

export function LoginForm() {
  const classes = useStyles()

  const { onGoToSberAuth, isFetch } = useAuthSberId()

  return (
    <Box className={classes.pointOfSaleFormContainer} data-testid="loginForm">
      <Avatar className={classes.avatarContainer}>
        <AvatarLogo />
      </Avatar>

      <Typography className={classes.formMessage}>Добро пожаловать в СберАвто!</Typography>

      <Button
        variant="contained"
        className={classes.loginButton}
        onClick={onGoToSberAuth}
        disabled={isFetch}
        data-testid="loginButton"
      >
        {!isFetch ? 'Войти по Сбер ID' : <CircularProgress color="inherit" size={16} />}
      </Button>
    </Box>
  )
}
