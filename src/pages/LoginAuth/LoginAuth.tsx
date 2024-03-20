import { useCallback, useMemo, useState } from 'react'

import { Box } from '@mui/material'
import cx from 'classnames'

import { ReactComponent as SberIcon } from 'assets/icons/sberIcon.svg'
import { ReactComponent as SberLogoTitle } from 'assets/icons/sberLogoTitle.svg'
import { LoginWrapper } from 'entities/LoginWrapper/LoginWrapper'
import { CustomFetchError } from 'shared/api/client'
import { useAuthorizeUserMutation } from 'shared/api/requests/authdc'

import { useStyles } from './LoginAuth.styles'
import { LoginForm } from './LoginForm/LoginForm'
import { SMSCode } from './SMSCode/SMSCode'
import { LoginFormFields } from './types'

export function LoginAuth() {
  const classes = useStyles()

  const [isShowSMSField, setShowSMSField] = useState(false)
  const [loginData, setLoginData] = useState<LoginFormFields | null>(null)

  const { mutate: authorizeUserMutate, isLoading: isAuthorizeUserLoading } = useAuthorizeUserMutation()

  const handleSubmit = useCallback(
    (values: LoginFormFields, onError: (err: CustomFetchError) => void) => {
      authorizeUserMutate(values, {
        onSuccess: () => {
          setShowSMSField(true)
          setLoginData(values)
        },
        onError,
      })
    },
    [authorizeUserMutate],
  )

  const resendLogin = useCallback(
    (onSuccess: () => void, onError: (err: CustomFetchError) => void) => {
      if (loginData) {
        authorizeUserMutate(loginData, {
          onSuccess,
          onError,
        })
      }
    },
    [authorizeUserMutate, loginData],
  )

  const handleBack = useCallback(() => {
    setShowSMSField(false)
  }, [])

  const logo = useMemo(
    () => (
      <Box className={classes.logo}>
        <SberIcon />
        <SberLogoTitle />
      </Box>
    ),
    [classes.logo],
  )

  return (
    <LoginWrapper title="Ваш аккаунт" logo={logo}>
      <Box className={classes.wrapper}>
        <Box
          className={cx(classes.animatingContainer, classes.openingAnimation, {
            [classes.closingAnimation]: isShowSMSField,
            [classes.closedAnimatingContainer]: isShowSMSField,
          })}
        >
          <LoginForm onSubmit={handleSubmit} isLoading={isAuthorizeUserLoading} />

          {isShowSMSField && (
            <SMSCode
              login={loginData?.login || ''}
              isLoading={isAuthorizeUserLoading}
              requireCode={resendLogin}
              onBack={handleBack}
            />
          )}
        </Box>
      </Box>
    </LoginWrapper>
  )
}
