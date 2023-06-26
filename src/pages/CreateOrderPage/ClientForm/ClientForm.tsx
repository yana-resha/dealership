import { useCallback } from 'react'

import { Box, CircularProgress } from '@mui/material'
import { SendApplicationToScoringRequest } from '@sberauto/loanapplifecycledc-proto/public'
import { Formik, FormikProps } from 'formik'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import {
  useSaveDraftApplicationMutation,
  useSendApplicationToScore,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { appRoutePaths } from 'shared/navigation/routerPath'

import { CreateOrderPageState } from '../CreateOrderPage'
import { clearOrder } from '../model/orderSlice'
import { useStyles } from './ClientForm.styles'
import { ClientData, SubmitAction } from './ClientForm.types'
import { clientFormValidationSchema } from './config/clientFormValidation'
import { FormContainer } from './FormContainer'
import { useGetDraftApplicationData } from './hooks/useGetDraftApplicationData'
import { useInitialValues } from './useInitialValues'

type Props = {
  formRef: React.RefObject<FormikProps<ClientData>>
}

export function ClientForm({ formRef }: Props) {
  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const state = location.state as CreateOrderPageState
  const saveDraftDisabled = state && state.saveDraftDisabled != undefined ? state.saveDraftDisabled : false
  const { remapApplicationValues, isShouldShowLoading, initialValues } = useInitialValues()
  const { mutateAsync: saveDraft, isLoading: isDraftLoading } = useSaveDraftApplicationMutation()
  const { mutate: sendToScore } = useSendApplicationToScore({
    onSuccess: () => {
      dispatch(clearOrder())
      navigate(appRoutePaths.orderList)
    },
  })
  const getDraftApplicationData = useGetDraftApplicationData()
  const disabledButtons = isDraftLoading
  //TODO: Убрать мок после появления поля unit в Vendor
  const unit = 'currentUnit'

  const prepareApplicationForScoring = useCallback(() => {
    const draftApplication = getDraftApplicationData()
    const applicationForScoring: SendApplicationToScoringRequest = {
      application: {
        ...draftApplication,
        appType: 'CARLOANAPPLICATIONDC',
        unit: unit,
      },
    }

    return applicationForScoring
  }, [getDraftApplicationData, unit])

  const onSubmit = useCallback((values: ClientData) => {
    console.log('ClientForm.onSubmit values:', values)
    const application = prepareApplicationForScoring()
    console.log('applicationForScoring', application)
    sendToScore(application)
  }, [])

  const saveApplicationDraft = useCallback(
    (values: ClientData) => {
      console.log('ClientForm.saveApplicationDraft values:', values)
      saveDraft(getDraftApplicationData()).then(() => {
        dispatch(clearOrder())
        navigate(appRoutePaths.orderList)
      })
    },
    [saveDraft, getDraftApplicationData],
  )

  const getSubmitAction = useCallback(
    (values: ClientData) => {
      if (!formRef.current) {
        return
      }
      remapApplicationValues(values)
      if (
        formRef.current.values.submitAction === SubmitAction.Draft ||
        (formRef.current.values.submitAction === SubmitAction.Save && !saveDraftDisabled)
      ) {
        saveApplicationDraft(values)
      } else {
        onSubmit(values)
      }
    },
    [saveApplicationDraft, onSubmit, remapApplicationValues, formRef.current],
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
          <FormContainer
            isDraftLoading={isDraftLoading}
            disabledButtons={disabledButtons}
            saveDraftDisabled={saveDraftDisabled}
          />
        </Formik>
      )}
    </Box>
  )
}
