import { useCallback, useEffect } from 'react'

import { Box, CircularProgress } from '@mui/material'
import {
  SendApplicationToScoringRequest,
  GetFullApplicationResponse,
} from '@sberauto/loanapplifecycledc-proto/public'
import { Formik, FormikProps } from 'formik'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
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
  onMount: () => void
}

export function ClientForm({ formRef, onMount }: Props) {
  const classes = useStyles()
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const state = location.state as CreateOrderPageState
  const saveDraftDisabled = state && state.saveDraftDisabled != undefined ? state.saveDraftDisabled : false
  const { remapApplicationValues, isShouldShowLoading, initialValues, dcAppId } = useInitialValues()
  const { mutateAsync: saveDraft, isLoading: isDraftLoading } = useSaveDraftApplicationMutation()
  const { mutate: sendToScore } = useSendApplicationToScore({
    onSuccess: () => {
      dispatch(clearOrder())
      navigate(appRoutePaths.orderList)
    },
  })
  const getDraftApplicationData = useGetDraftApplicationData()
  const disabledButtons = isDraftLoading
  const { unit } = getPointOfSaleFromCookies()

  const prepareApplicationForScoring = useCallback(
    (application: GetFullApplicationResponse) => {
      const draftApplication = getDraftApplicationData(application)
      const applicationForScoring: SendApplicationToScoringRequest = {
        application: {
          ...draftApplication,
          appType: 'CARLOANAPPLICATIONDC',
          unit: unit,
        },
      }

      return applicationForScoring
    },
    [getDraftApplicationData, unit],
  )

  const onSubmit = useCallback(
    (application: GetFullApplicationResponse) => {
      console.log('ClientForm.onSubmit values:', application)
      const applicationForScoring = prepareApplicationForScoring(application)
      sendToScore(applicationForScoring)
    },
    [prepareApplicationForScoring, sendToScore],
  )

  const saveApplicationDraft = useCallback(
    (application: GetFullApplicationResponse) => {
      console.log('ClientForm.saveApplicationDraft values:', application)
      saveDraft(getDraftApplicationData(application)).then(() => {
        dispatch(clearOrder())
        navigate(appRoutePaths.orderList)
      })
    },
    [saveDraft, getDraftApplicationData, dispatch, navigate],
  )

  const saveDraftAndPrint = useCallback(
    (application: GetFullApplicationResponse) => {
      // TODO Доделать когда появится ручка формирования печатной заявки
      if (dcAppId) {
        console.log('Print application')
      } else {
        saveDraft(getDraftApplicationData(application)).then(() => {
          console.log('application saved')
          console.log('Print application')
        })
      }
    },
    [dcAppId, getDraftApplicationData, saveDraft],
  )

  const getSubmitAction = useCallback(
    (values: ClientData) => {
      if (!formRef.current) {
        return
      }
      const updatedApplication = remapApplicationValues(values)
      if (!updatedApplication) {
        return
      }
      switch (formRef.current.values.submitAction) {
        case SubmitAction.Draft:
          saveApplicationDraft(updatedApplication)
          break
        case SubmitAction.Save:
          if (saveDraftDisabled) {
            onSubmit(updatedApplication)
          } else {
            saveApplicationDraft(updatedApplication)
          }
          break
        case SubmitAction.Print:
          saveDraftAndPrint(updatedApplication)
          break
      }
    },
    [formRef, onSubmit, remapApplicationValues, saveApplicationDraft, saveDraftAndPrint, saveDraftDisabled],
  )

  useEffect(() => {
    onMount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
