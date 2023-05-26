import { useCallback, useEffect } from 'react'

import { Avatar, Box, Button, CircularProgress, Collapse, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

import { ReactComponent as AvatarLogo } from 'assets/icons/avatar.svg'
import { appConfig } from 'config'
import SberTypography from 'shared/ui/SberTypography'

import { useCheckAuthRedirect } from './hooks/useCheckAuthRedirect'
import { useGetAuthLink } from './hooks/useGetAuthLink'
import useStyles from './LoginForm.styles'

export function LoginForm() {
  const classes = useStyles()
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('authCode')

  const { enqueueSnackbar } = useSnackbar()

  const showError = useCallback(
    (text: string) => enqueueSnackbar(text, { variant: 'error' }),
    [enqueueSnackbar],
  )

  const { authLink, isLoading: authLinkLoading, error } = useGetAuthLink(code)
  const { isLoading: redirectLoading } = useCheckAuthRedirect(showError)

  const isLoading = authLinkLoading || redirectLoading

  return (
    <Box className={classes.pointOfSaleFormContainer} data-testid="loginForm">
      <Avatar className={classes.avatarContainer}>
        <AvatarLogo />
      </Avatar>

      <Typography className={classes.formMessage}>Добро пожаловать в Сбербанк!</Typography>

      <Button
        variant="contained"
        className={classes.loginButton}
        href={authLink}
        disabled={isLoading || !!error}
        data-testid="loginButton"
      >
        {!isLoading && !!authLink ? 'Войти' : <CircularProgress color="inherit" size={16} />}
      </Button>

      <Collapse in={!!error} timeout="auto" unmountOnExit>
        <SberTypography
          className={classes.errorMessage}
          component="div"
          sberautoVariant="body5"
          data-testid="loginErrorMessage"
        >
          Произошла неизвестная ошибка! Перезагрузите страницу и попробуйте снова
        </SberTypography>
      </Collapse>

      {appConfig.sberTeamAuthEnv === 'dev' && (
        <Box fontSize={10} color="lightgray">
          authCode пользователей: 11111, 22222, 33333
        </Box>
      )}
    </Box>
  )
}
