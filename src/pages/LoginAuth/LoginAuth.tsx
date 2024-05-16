import { useCallback, useMemo, useState } from 'react'

import { Box } from '@mui/material'
import cx from 'classnames'
import { useSnackbar } from 'notistack'

import { ReactComponent as SberIcon } from 'assets/icons/sberIcon.svg'
import { ReactComponent as SberLogoTitle } from 'assets/icons/sberLogoTitle.svg'
import { LoginWrapper } from 'entities/LoginWrapper/LoginWrapper'
import { CustomFetchError } from 'shared/api/client'
import {
  useAuthorizeUserMutation,
  useChangePasswordMutation,
  useCheckUserByLoginMutation,
} from 'shared/api/requests/authdc'

import { useStyles } from './LoginAuth.styles'
import { LoginForm } from './LoginForm/LoginForm'
import { PasswordForm } from './PasswordForm/PasswordForm'
import { RecoveryLoginForm } from './RecoveryLoginForm/RecoveryLoginForm'
import { SMSCode } from './SMSCode/SMSCode'
import { LoginFormFields, PasswordFormFields, RecoveryLoginFormFields } from './types'

export function LoginAuth() {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [loginData, setLoginData] = useState<LoginFormFields | null>(null)
  const [isShowSMSCodeField, setShowSMSCodeField] = useState(false)
  const [recoveryLoginData, setRecoveryLoginData] = useState<RecoveryLoginFormFields | null>(null)
  const [isShowEmailCodeField, setShowEmailCodeField] = useState(false)

  const [isShowRecoverForm, setShowRecoverForm] = useState(false)

  const { mutate: authorizeUserMutate, isLoading: isAuthorizeUserLoading } = useAuthorizeUserMutation()
  const { mutate: checkUserByLoginMutate, isLoading: isCheckUserByLoginLoading } =
    useCheckUserByLoginMutation()
  const { mutate: changePasswordMutate, isLoading: isChangePasswordLoading } = useChangePasswordMutation()

  const authorizeUser = useCallback(
    (values: LoginFormFields, onError: (err: CustomFetchError) => void) => {
      authorizeUserMutate(values, {
        onSuccess: () => {
          setShowSMSCodeField(true)
          setLoginData(values)
        },
        onError,
      })
    },
    [authorizeUserMutate],
  )
  const handleRecover = useCallback(() => {
    setShowRecoverForm(true)
  }, [])

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
    setShowSMSCodeField(false)
  }, [])
  const handleBackToLogin = useCallback(() => {
    setShowRecoverForm(false)
    setShowEmailCodeField(false)
  }, [])

  const checkUserByLogin = useCallback(
    (values: RecoveryLoginFormFields, onError: (err: CustomFetchError) => void) => {
      checkUserByLoginMutate(values, {
        onSuccess: () => {
          setShowEmailCodeField(true)
          setRecoveryLoginData(values)
          enqueueSnackbar('Если пользователь существует, то пароль будет выслан ему на почту', {
            variant: 'success',
          })
        },
        onError,
      })
    },
    [checkUserByLoginMutate, enqueueSnackbar],
  )

  const changePassword = useCallback(
    (values: PasswordFormFields, onError: (err: CustomFetchError) => void) => {
      changePasswordMutate(
        {
          login: recoveryLoginData?.login,
          code: values.code,
          password: values.password,
        },
        {
          onSuccess: () => {
            setShowRecoverForm(false)
            setShowEmailCodeField(false)
            enqueueSnackbar('Пароль успешно изменен', { variant: 'success' })
          },
          onError,
        },
      )
    },
    [changePasswordMutate, enqueueSnackbar, recoveryLoginData?.login],
  )

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
    <LoginWrapper
      title="Ваш аккаунт"
      logo={logo}
      subtitle={isShowRecoverForm ? 'Востановление пароля' : undefined}
      onBack={isShowRecoverForm ? handleBackToLogin : undefined}
    >
      <Box className={classes.wrapper}>
        {isShowRecoverForm ? (
          <Box
            className={cx(classes.animatingContainer, classes.openingAnimation, {
              [classes.closingAnimation]: isShowEmailCodeField,
              [classes.closedAnimatingContainer]: isShowEmailCodeField,
            })}
          >
            <RecoveryLoginForm onSubmit={checkUserByLogin} isLoading={isCheckUserByLoginLoading} />

            {isShowEmailCodeField && (
              <PasswordForm onSubmit={changePassword} isLoading={isChangePasswordLoading} />
            )}
          </Box>
        ) : (
          <Box
            className={cx(classes.animatingContainer, classes.openingAnimation, {
              [classes.closingAnimation]: isShowSMSCodeField,
              [classes.closedAnimatingContainer]: isShowSMSCodeField,
            })}
          >
            <LoginForm
              onSubmit={authorizeUser}
              onRecover={handleRecover}
              isLoading={isAuthorizeUserLoading}
            />

            {isShowSMSCodeField && (
              <SMSCode
                login={loginData?.login || ''}
                isLoading={isAuthorizeUserLoading}
                requireCode={resendLogin}
                onBack={handleBack}
              />
            )}
          </Box>
        )}
      </Box>
    </LoginWrapper>
  )
}
