import { useCallback } from 'react'

import { Avatar, Box, Button, CircularProgress, Collapse, Typography } from '@mui/material'

import { ReactComponent as AvatarLogo } from 'assets/icons/avatar.svg'
import SberTypography from 'shared/ui/SberTypography'
import { useSnackbarErrorContext } from 'shared/ui/SnackbarErrorProvider/SnackbarErrorProvider'

import { useCheckAuthRedirect } from './hooks/useCheckAuthRedirect'
import { useGetAuthLink } from './hooks/useGetAuthLink'
import useStyles from './LoginForm.styles'

export function LoginForm() {
  const classes = useStyles()

  const snackbarRef = useSnackbarErrorContext()

  const showError = useCallback(
    (title: string, text: string) => {
      if (snackbarRef) {
        snackbarRef.show(title, text)
      }
    },
    [snackbarRef],
  )

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
    </Box>
  )
}
