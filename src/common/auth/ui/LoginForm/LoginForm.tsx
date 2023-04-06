import { useCallback, useRef } from 'react'

import { Avatar, Box, Button, CircularProgress, Collapse, Typography } from '@mui/material'

import { ReactComponent as AvatarLogo } from 'assets/icons/avatar.svg'
import SberTypography from 'shared/ui/SberTypography'

import { useCheckAuthRedirect, useGetAuthLink } from './LoginForm.hooks'
import useStyles from './LoginForm.styles'
import SnackbarError, { SnackbarErrorRef } from './SnackbarError/SnackbarError'

export function LoginForm() {
  const classes = useStyles()

  const snackbarRef = useRef<SnackbarErrorRef>(null)

  const showError = useCallback((title: string, text: string) => {
    if (snackbarRef.current) {
      snackbarRef.current.show(title, text)
    }
  }, [])

  const { authLink, isLoading: authLinkLoading, error } = useGetAuthLink()
  const { isLoading: redirectLoading } = useCheckAuthRedirect(showError)

  const isLoading = authLinkLoading || redirectLoading

  return (
    <Box className={classes.pointOfSaleFormContainer} data-testid="loginForm">
      <Avatar className={classes.avatarContainer}>
        <AvatarLogo />
      </Avatar>

      <Typography className={classes.formMessage}>Добро пожаловать в СберАвто!</Typography>

      <Button
        variant="contained"
        className={classes.loginButton}
        href={authLink}
        disabled={isLoading || !!error}
        data-testid="loginButton"
      >
        {!isLoading && !!authLink ? 'Войти по Сбер ID' : <CircularProgress color="inherit" size={16} />}
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

      <SnackbarError ref={snackbarRef} />
    </Box>
  )
}
