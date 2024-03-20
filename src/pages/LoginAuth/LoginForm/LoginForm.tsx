import { useCallback, useState } from 'react'

import { Box } from '@mui/material'
import { Formik } from 'formik'

import { CustomFetchError } from 'shared/api/client'
import { Service, ServiceApi } from 'shared/api/constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from 'shared/api/errors'

import { LoginFormFields } from '../types'
import { initialValueMap } from './config'
import { FormContainer } from './FormContainer'
import { useStyles } from './LoginForm.styles'
import { loginFormValidationSchema } from './loginFormValidation'

type Props = {
  isLoading: boolean
  onSubmit: (values: LoginFormFields, onError: (err: CustomFetchError) => void) => void
}

export function LoginForm({ onSubmit, isLoading }: Props) {
  const classes = useStyles()

  const [errorMessage, setErrorMessage] = useState<string>()
  const [isDisabledButton, setDisabledButton] = useState(true)

  const handleError = useCallback((err: CustomFetchError) => {
    const errorMessage = getErrorMessage({
      service: Service.Authdc,
      serviceApi: ServiceApi.AuthorizeUser,
      code: err.code as ErrorCode,
      alias: err.alias as ErrorAlias,
    })
    setErrorMessage(errorMessage)

    switch (err.alias) {
      case ErrorAlias.AuthorizeUser_UserBlocked:
      case ErrorAlias.AuthorizeUser_UserBlockedBySmsCount:
        setDisabledButton(true)
        break
    }
  }, [])

  const handleSubmit = useCallback(
    (values: LoginFormFields) => {
      onSubmit(values, handleError)
    },
    [onSubmit, handleError],
  )

  const handleFormChange = useCallback(() => {
    setErrorMessage(undefined)
    setDisabledButton(false)
  }, [])

  return (
    <Box className={classes.container} data-testid="loginForm">
      <Formik
        initialValues={initialValueMap}
        validationSchema={loginFormValidationSchema}
        onSubmit={handleSubmit}
      >
        <FormContainer
          isSubmitLoading={isLoading}
          isDisabledSubmit={isDisabledButton}
          errorMessage={errorMessage}
          onChangeForm={handleFormChange}
        />
      </Formik>
    </Box>
  )
}
