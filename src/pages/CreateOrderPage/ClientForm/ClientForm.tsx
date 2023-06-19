import { useCallback, useRef, useState } from 'react'

import { Box, CircularProgress } from '@mui/material'
import { Formik, FormikProps } from 'formik'
import { useLocation, useNavigate } from 'react-router-dom'

import { useSaveDraftApplicationMutation } from 'shared/api/requests/loanAppLifeCycleDc'

import { appRoutePaths } from '../../../shared/navigation/routerPath'
import { CreateOrderPageState } from '../CreateOrderPage'
import { useStyles } from './ClientForm.styles'
import { ClientData, SubmitAction } from './ClientForm.types'
import { clientFormValidationSchema } from './config/clientFormValidation'
import { FormContainer } from './FormContainer'
import { useGetDraftApplicationData } from './hooks/useGetDraftApplicationData'
import { useInitialValues } from './useInitialValues'

export function ClientForm() {
  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as CreateOrderPageState
  const applicationId = state ? state.applicationId : undefined
  const saveDraftDisabled = state && state.saveDraftDisabled != undefined ? state.saveDraftDisabled : false
  const { isShouldShowLoading, initialValues } = useInitialValues(applicationId)
  const { mutateAsync: saveDraft, isLoading: isDraftLoading } = useSaveDraftApplicationMutation()
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

    console.log('ClientForm.onSubmit values:', values)
    console.log('Send to score')
  }, [])

  const saveApplicationDraft = useCallback(
    (values: ClientData) => {
      console.log('ClientForm.saveApplicationDraft values:', values)
      saveDraft(getDraftApplicationData(values)).then(() =>
        navigate(appRoutePaths.orderList, { state: { applicationId: applicationId } }),
      )
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
