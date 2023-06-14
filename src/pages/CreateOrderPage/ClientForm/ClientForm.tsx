import { useCallback, useRef } from 'react'

import { Box, CircularProgress } from '@mui/material'
import { Formik, FormikProps } from 'formik'

import { useSaveDraftApplicationMutation } from 'shared/api/requests/loanAppLifeCycleDc'

import { useStyles } from './ClientForm.styles'
import { ClientData, SubmitAction } from './ClientForm.types'
import { clientFormValidationSchema } from './config/clientFormValidation'
import { FormContainer } from './FormContainer'
import { useGetDraftApplicationData } from './hooks/useGetDraftApplicationData'
import { useInitialValues } from './useInitialValues'

type Props = {
  applicationId?: string
}

export function ClientForm({ applicationId }: Props) {
  const classes = useStyles()
  const { isShouldShowLoading, initialValues } = useInitialValues(applicationId)
  const { mutate: saveDraft, isLoading: isDraftLoading } = useSaveDraftApplicationMutation()
  const getDraftApplicationData = useGetDraftApplicationData()
  const disabledButtons = isDraftLoading

  const onSubmit = useCallback((values: ClientData) => {
    if (values.regAddrIsLivingAddr) {
      values.livingAddress = values.registrationAddress
      values.livingAddressString = values.registrationAddressString
      values.livingNotKladr = values.regNotKladr
    }
    if (!values.hasNameChanged) {
      values.clientFormerName = ''
    }
  }, [])

  const saveApplicationDraft = useCallback(
    (values: ClientData) => {
      saveDraft(getDraftApplicationData(values))
    },
    [saveDraft, getDraftApplicationData],
  )

  const formRef = useRef<FormikProps<ClientData> | null>(null)

  const getSubmitAction = useCallback(
    (values: ClientData) => {
      if (!formRef.current) {
        return
      }

      if (formRef.current.values.submitAction === SubmitAction.Draft) {
        saveApplicationDraft(values)
      } else {
        onSubmit(values)
      }
    },
    [saveApplicationDraft, onSubmit],
  )

  return (
    <Box className={classes.formContainer}>
      {isShouldShowLoading ? (
        <CircularProgress className={classes.circular} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={clientFormValidationSchema}
          onSubmit={getSubmitAction}
          innerRef={formRef}
        >
          <FormContainer isDraftLoading={isDraftLoading} disabledButtons={disabledButtons} />
        </Formik>
      )}
    </Box>
  )
}
