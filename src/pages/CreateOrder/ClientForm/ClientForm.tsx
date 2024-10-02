import { useCallback, useRef } from 'react'

import { Box } from '@mui/material'
import {
  SaveLoanApplicationDraftResponse,
  ApplicationFrontdc,
} from '@sberauto/loanapplifecycledc-proto/public'
import { Formik, FormikProps } from 'formik'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { ApplicationSource } from 'entities/applications/application.utils'
import { clearOrder, setAppId } from 'entities/order'
import { DcConfirmationModal } from 'pages/ClientDetailedDossier/EditConfirmationModal/DcConfirmationModal'
import {
  useSaveDraftApplicationMutation,
  useSendApplicationToScore,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { appRoutePaths, appRoutes } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'

import { CreateOrderPageState } from '../CreateOrder'
import { useStyles } from './ClientForm.styles'
import { ClientData, SubmitAction } from './ClientForm.types'
import { clientFormValidationSchema, enrichedclientFormValidationSchema } from './config/clientFormValidation'
import { FormContainer } from './FormContainer'
import { useConfirmationForm } from './hooks/useConfirmationForm'
import { useInitialValues } from './hooks/useInitialValues'

export function ClientForm() {
  const classes = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const location = useLocation()
  const state = location.state as CreateOrderPageState
  const { isFullCalculator = false } = state || {}
  const saveDraftDisabled = state && state.saveDraftDisabled !== undefined ? state.saveDraftDisabled : false
  const formRef = useRef<FormikProps<ClientData>>(null)

  const {
    remapApplicationValues,
    setAnketaType,
    updateOrderData,
    saveValuesToStore,
    isShouldShowLoading,
    initialValues,
    dcAppId,
  } = useInitialValues()

  const {
    isDifferentVendor,
    actionText,
    handleQuestionnaireUploadRef,
    confirmedActionRef,
    isConfirmationModalVisible,
    isAllowedUploadQuestionnaire,
    isReuploadedQuestionnaire,
    setReuploadedQuestionnaire,
    confirmActionWrapper,
    closeConfirmationModal,
  } = useConfirmationForm(formRef)

  const { mutateAsync: saveDraftMutate, isLoading: isDraftLoading } = useSaveDraftApplicationMutation(
    (dcAppId: string) => dcAppId && dispatch(setAppId({ dcAppId })),
  )

  const { mutate: sendToScoreMutate, isLoading: isSendToScoreLoading } = useSendApplicationToScore({
    onSuccess: () => {
      dispatch(clearOrder())
      navigate(appRoutePaths.orderList)
    },
  })

  const handleSubmit = useCallback(
    (application: ApplicationFrontdc) => {
      const newApplication = setAnketaType(application, true)

      const applicationForScoring = {
        application: {
          ...newApplication,
          appType: ApplicationSource.CAR_LOAN_APPLICATION_DC,
        },
      }

      confirmActionWrapper(() => {
        updateOrderData(newApplication)
        sendToScoreMutate(applicationForScoring)
      }, 'Заявка будет отправлена на скоринг под ДЦ:')
    },
    [sendToScoreMutate, setAnketaType, confirmActionWrapper, updateOrderData],
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
    (application: ApplicationFrontdc) => {
      const newApplication = setAnketaType(application, formRef.current?.values?.isFormComplete ?? false)

      confirmActionWrapper(() => {
        updateOrderData(newApplication)
        saveDraftMutate(newApplication).then(goToOrderPage)
      }, 'Заявка будет сохранена под ДЦ:')
    },
    [formRef, goToOrderPage, saveDraftMutate, setAnketaType, confirmActionWrapper, updateOrderData],
  )

  const saveDraftAndPrint = useCallback(
    (application: ApplicationFrontdc) => {
      // TODO Доделать когда появится ручка формирования печатной заявки
      if (dcAppId) {
        console.log('Print application')
      } else {
        const newApplication = setAnketaType(application, formRef.current?.values?.isFormComplete ?? false)
        if (!application) {
          return
        }
        confirmActionWrapper(() => {
          updateOrderData(newApplication)
          saveDraftMutate(newApplication).then(() => {
            console.log('application saved')
            console.log('Print application')
          })
        }, 'Заявка будет сохранена под ДЦ:')
      }
    },
    [dcAppId, formRef, saveDraftMutate, setAnketaType, confirmActionWrapper, updateOrderData],
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
      const newApplication = setAnketaType(application, formRef.current?.values?.isFormComplete ?? false)
      updateOrderData(newApplication)

      return (await saveDraftMutate(newApplication)).dcAppId
    },
    [dcAppId, formRef, remapApplicationValues, saveDraftMutate, setAnketaType, updateOrderData],
  )

  const getSubmitAction = useCallback(
    (values: ClientData) => {
      if (!formRef.current) {
        return
      }
      const application = remapApplicationValues(values)
      if (!application) {
        return
      }

      switch (formRef.current.values.submitAction) {
        case SubmitAction.Draft:
          saveApplicationDraft(application)
          break
        case SubmitAction.Save:
          if (saveDraftDisabled) {
            handleSubmit(application)
          } else {
            saveApplicationDraft(application)
          }
          break
        case SubmitAction.Print:
          saveDraftAndPrint(application)
          break
      }
    },
    [
      formRef,
      handleSubmit,
      remapApplicationValues,
      saveApplicationDraft,
      saveDraftAndPrint,
      saveDraftDisabled,
    ],
  )

  const isDisabledButtons = isDraftLoading || isSendToScoreLoading
  const isSaveDraftBtnLoading =
    formRef.current?.values.submitAction === SubmitAction.Draft ? isDraftLoading : false
  const isNextBtnLoading =
    formRef.current?.values.submitAction === SubmitAction.Save
      ? saveDraftDisabled
        ? isSendToScoreLoading
        : isDraftLoading
      : false

  const validationSchema = isFullCalculator ? enrichedclientFormValidationSchema : clientFormValidationSchema

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
            validationSchema={validationSchema}
            onSubmit={getSubmitAction}
            innerRef={formRef}
          >
            <FormContainer
              getOrderId={getOrderId}
              isSaveDraftBtnLoading={isSaveDraftBtnLoading}
              isNextBtnLoading={isNextBtnLoading}
              disabledButtons={isDisabledButtons}
              saveDraftDisabled={saveDraftDisabled}
              isDifferentVendor={isDifferentVendor}
              isReuploadedQuestionnaire={isReuploadedQuestionnaire}
              setReuploadedQuestionnaire={setReuploadedQuestionnaire}
              isAllowedUploadQuestionnaire={isAllowedUploadQuestionnaire}
              onUploadQuestionnaire={handleQuestionnaireUploadRef.current}
              saveValuesToStore={saveValuesToStore}
            />
          </Formik>
          <DcConfirmationModal
            actionText={actionText}
            isVisible={isConfirmationModalVisible}
            onClose={closeConfirmationModal}
            confirmedAction={confirmedActionRef.current}
          />
        </>
      )}
    </Box>
  )
}
