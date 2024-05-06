import { useCallback, useState } from 'react'

import { Box } from '@mui/material'
import { Formik } from 'formik'

import { CustomFetchError } from 'shared/api/client'
import { Service, ServiceApi } from 'shared/api/constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from 'shared/api/errors'

import { RecoveryLoginFormFields } from '../types'
import { initialValueMap } from './config'
import { FormContainer } from './FormContainer'
import { useStyles } from './RecoveryLoginForm.styles'
import { recoveryLoginFormValidation } from './recoveryLoginFormValidation'

type Props = {
  isLoading: boolean
  onSubmit: (values: RecoveryLoginFormFields, onError: (err: CustomFetchError) => void) => void
}

export function RecoveryLoginForm({ isLoading, onSubmit }: Props) {
  const classes = useStyles()

  const [errorMessage, setErrorMessage] = useState<string>()

  const handleError = useCallback((err: CustomFetchError) => {
    const errorMessage = getErrorMessage({
      service: Service.Authdc,
      serviceApi: ServiceApi.CHECK_USER_BY_LOGIN,
      code: err.code as ErrorCode,
      alias: err.alias as ErrorAlias,
    })

    if (err.alias === ErrorAlias.CheckUserByLogin_EarlyResetPasswordCode || err.code === ErrorCode.NotFound) {
      return
    }

    setErrorMessage(errorMessage)
  }, [])

  const handleSubmit = useCallback(
    (values: RecoveryLoginFormFields) => {
      onSubmit(values, handleError)
    },
    [handleError, onSubmit],
  )

  const handleFormChange = useCallback(() => {
    setErrorMessage(undefined)
  }, [])

  return (
    <Box className={classes.container} data-testid="loginForm">
      <Formik
        initialValues={initialValueMap}
        validationSchema={recoveryLoginFormValidation}
        onSubmit={handleSubmit}
      >
        <FormContainer
          isSubmitLoading={isLoading}
          errorMessage={errorMessage}
          onChangeForm={handleFormChange}
        />
      </Formik>
    </Box>
  )
}
