import { useCallback, useEffect, useRef, useState } from 'react'

import { Box } from '@mui/material'
import {
  SendApplicationToScoringRequest,
  GetFullApplicationResponse,
  SaveLoanApplicationDraftResponse,
} from '@sberauto/loanapplifecycledc-proto/public'
import { Formik, FormikProps } from 'formik'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { DcConfirmationModal } from 'entities/application/DossierAreas/ui/EditConfirmationModal/DcConfirmationModal'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { clearOrder, setAppId } from 'entities/reduxStore/orderSlice'
import {
  useSaveDraftApplicationMutation,
  useSendApplicationToScore,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { appRoutePaths, appRoutes } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'

import { CreateOrderPageState } from '../CreateOrderPage'
import { useStyles } from './ClientForm.styles'
import { ClientData, SubmitAction } from './ClientForm.types'
import { clientFormValidationSchema } from './config/clientFormValidation'
import { FormContainer } from './FormContainer'
import { useGetDraftApplicationData } from './hooks/useGetDraftApplicationData'
import { useInitialValues } from './hooks/useInitialValues'

type Props = {
  formRef: React.RefObject<FormikProps<ClientData>>
  onMount: () => void
}

export function ClientForm({ formRef, onMount }: Props) {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const location = useLocation()
  const { vendorCode } = getPointOfSaleFromCookies()
  const state = location.state as CreateOrderPageState
  const saveDraftDisabled = state && state.saveDraftDisabled != undefined ? state.saveDraftDisabled : false

  const [actionText, setActionText] = useState('')
  const [isConfirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const confirmedAction = useRef<() => void>()
  const { remapApplicationValues, isShouldShowLoading, applicationVendorCode, initialValues, dcAppId } =
    useInitialValues()
  const { mutateAsync: saveDraft, isLoading: isDraftLoading } = useSaveDraftApplicationMutation(
    (dcAppId: string) => dcAppId && dispatch(setAppId({ dcAppId })),
  )

  const { mutate: sendToScore } = useSendApplicationToScore({
    onSuccess: () => {
      dispatch(clearOrder())
      navigate(appRoutePaths.orderList)
    },
  })
  const getDraftApplicationData = useGetDraftApplicationData()
  const disabledButtons = isDraftLoading
  const { unit } = getPointOfSaleFromCookies()

  const closeConfirmationDialog = useCallback(() => {
    setConfirmationModalVisible(false)
  }, [])

  const showConfirmationModalDialog = useCallback((actionForConfirmation: () => void, actionText: string) => {
    confirmedAction.current = actionForConfirmation
    setActionText(actionText)
    setConfirmationModalVisible(true)
  }, [])

  const prepareApplicationForScoring = useCallback(
    (application: GetFullApplicationResponse) => {
      const draftApplication = getDraftApplicationData(application, true)
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
      if (vendorCode !== applicationVendorCode) {
        showConfirmationModalDialog(
          () => sendToScore(applicationForScoring),
          'Заявка будет отправлена на скоринг под ДЦ:',
        )
      } else {
        sendToScore(applicationForScoring)
      }
    },
    [
      applicationVendorCode,
      prepareApplicationForScoring,
      sendToScore,
      showConfirmationModalDialog,
      vendorCode,
    ],
  )

  const goToOrderPage = useCallback(
    (order: SaveLoanApplicationDraftResponse) => {
      if (order?.dcAppId) {
        navigate(appRoutes.order(order.dcAppId))
      } else {
        dispatch(clearOrder())
        navigate(appRoutes.orderList())
      }
    },
    [dispatch, navigate],
  )

  const saveApplicationDraft = useCallback(
    (application: GetFullApplicationResponse) => {
      console.log('ClientForm.saveApplicationDraft values:', application)
      if (vendorCode !== applicationVendorCode) {
        showConfirmationModalDialog(
          () =>
            saveDraft(
              getDraftApplicationData(application, formRef.current?.values?.isFormComplete ?? false),
            ).then(goToOrderPage),
          'Заявка будет сохранена под ДЦ:',
        )
      } else {
        saveDraft(
          getDraftApplicationData(application, formRef.current?.values?.isFormComplete ?? false),
        ).then(goToOrderPage)
      }
    },
    [
      vendorCode,
      applicationVendorCode,
      showConfirmationModalDialog,
      saveDraft,
      getDraftApplicationData,
      formRef,
      goToOrderPage,
    ],
  )

  const saveDraftAndPrint = useCallback(
    (application: GetFullApplicationResponse) => {
      // TODO Доделать когда появится ручка формирования печатной заявки
      if (dcAppId) {
        console.log('Print application')
      } else {
        if (vendorCode !== applicationVendorCode) {
          showConfirmationModalDialog(
            () =>
              saveDraft(
                getDraftApplicationData(application, formRef.current?.values?.isFormComplete ?? false),
              ).then(() => {
                console.log('application saved')
                console.log('Print application')
              }),
            'Заявка будет сохранена под ДЦ:',
          )
        } else {
          saveDraft(
            getDraftApplicationData(application, formRef.current?.values?.isFormComplete ?? false),
          ).then(() => {
            console.log('application saved')
            console.log('Print application')
          })
        }
      }
    },
    [
      applicationVendorCode,
      dcAppId,
      getDraftApplicationData,
      saveDraft,
      showConfirmationModalDialog,
      vendorCode,
      formRef,
    ],
  )

  /** Сохраняем заявку чтобы сформировать ID заявки */
  const getOrderId = useCallback(
    async (orderForm: ClientData) => {
      if (dcAppId) {
        return dcAppId
      }

      const application = remapApplicationValues(orderForm)
      if (!application) {
        return
      }

      return (
        await saveDraft(
          getDraftApplicationData(application, formRef.current?.values?.isFormComplete ?? false),
        )
      ).dcAppId
    },
    [dcAppId, remapApplicationValues, saveDraft, getDraftApplicationData, formRef],
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
        <Box className={classes.circular}>
          <CircularProgressWheel size="large" />
        </Box>
      ) : (
        <>
          <Formik
            initialValues={initialValues}
            validationSchema={clientFormValidationSchema}
            onSubmit={getSubmitAction}
            innerRef={formRef}
          >
            <FormContainer
              getOrderId={getOrderId}
              isDraftLoading={isDraftLoading}
              disabledButtons={disabledButtons}
              saveDraftDisabled={saveDraftDisabled}
            />
          </Formik>
          <DcConfirmationModal
            actionText={actionText}
            isVisible={isConfirmationModalVisible}
            onClose={closeConfirmationDialog}
            confirmedAction={confirmedAction.current}
          />
        </>
      )}
    </Box>
  )
}
