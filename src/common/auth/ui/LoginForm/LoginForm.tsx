import { useCallback } from 'react'

import { Box, Button, Collapse, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'

import { ReactComponent as MonochromeSberIcon } from 'assets/icons/monochromeSberIcon.svg'
import { appConfig } from 'config'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'
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
  const { isLoading: redirectLoading, isHasCodeAndState } = useCheckAuthRedirect(showError)

  if (isHasCodeAndState || redirectLoading) {
    return <CircularProgressWheel size="extraLarge" />
  }

  return (
    <Box className={classes.pointOfSaleFormContainer} data-testid="loginForm">
      <Typography className={classes.formMessage}>Добро пожаловать!</Typography>

      <Button
        variant="contained"
        className={classes.loginButton}
        href={authLink}
        disabled={authLinkLoading || !!error}
        data-testid="loginButton"
        startIcon={<MonochromeSberIcon />}
      >
        {!authLinkLoading && !!authLink ? 'Войти' : <CircularProgressWheel size="small" />}
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
