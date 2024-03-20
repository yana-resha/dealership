import { useCallback } from 'react'

import { Box } from '@mui/material'
import { Formik } from 'formik'
import { useSnackbar } from 'notistack'

import { Service, ServiceApi } from 'shared/api/constants'
import { ErrorAlias, ErrorCode, getErrorMessage } from 'shared/api/errors'
import { useTrainingCreateSessionMutation } from 'shared/api/requests/authdc'

import { initialValueMap } from './config'
import { FormContainer } from './FormContainer'
import { useStyles } from './TrainingLoginForm.styles'
import { loginFormValidationSchema } from './trainingLoginFormValidation'
import { LoginFormFields } from './types'

export function TrainingLoginForm() {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const { mutate: trainingCreateSessionMutate, isLoading: isTrainingCreateSessionMutateLoading } =
    useTrainingCreateSessionMutation()

  const createSession = useCallback(
    (values: LoginFormFields) => {
      trainingCreateSessionMutate(values, {
        onError: err => {
          enqueueSnackbar(
            getErrorMessage({
              service: Service.Authdc,
              serviceApi: ServiceApi.CreateSession,
              code: err.code as ErrorCode,
              alias: err.alias as ErrorAlias,
            }),
            { variant: 'error' },
          )
        },
      })
    },
    [enqueueSnackbar, trainingCreateSessionMutate],
  )

  return (
    <Box className={classes.container} data-testid="trainingLoginForm">
      <Formik
        initialValues={initialValueMap}
        validationSchema={loginFormValidationSchema}
        onSubmit={createSession}
      >
        <FormContainer isSubmitLoading={isTrainingCreateSessionMutateLoading} />
      </Formik>
    </Box>
  )
}
