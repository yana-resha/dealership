import { useCallback, useState } from 'react'

import { Box } from '@mui/material'
import { Formik } from 'formik'

import { CustomFetchError } from 'shared/api/client'
import { Service, ServiceApi } from 'shared/api/constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from 'shared/api/errors'

import { PasswordFormFields } from '../types'
import { initialValueMap } from './config'
import { FormContainer } from './FormContainer'
import { useStyles } from './PasswordForm.styles'
import { passwordFormValidationSchema } from './passwordFormValidation'

type Props = {
  isLoading: boolean
  onSubmit: (values: PasswordFormFields, onError: (err: CustomFetchError) => void) => void
}

export function PasswordForm({ isLoading, onSubmit }: Props) {
  const classes = useStyles()

  const [errorMessage, setErrorMessage] = useState<string>()

  const handleError = useCallback((err: CustomFetchError) => {
    const errorMessage = getErrorMessage({
      service: Service.Authdc,
      serviceApi: ServiceApi.CHANGE_PASSWORD,
      code: err.code as ErrorCode,
      alias: err.alias as ErrorAlias,
    })
    setErrorMessage(errorMessage)
  }, [])

  const handleSubmit = useCallback(
    (values: PasswordFormFields) => {
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
        validationSchema={passwordFormValidationSchema}
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
