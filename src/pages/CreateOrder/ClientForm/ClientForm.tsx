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
  useGetClientQuestionnaireFormMutation,
  useSaveDraftApplicationMutation,
  useSendApplicationToScore,
} from 'shared/api/requests/loanAppLifeCycleDc'
import { downloadBlob } from 'shared/lib/helpers'
import { appRoutePaths, appRoutes } from 'shared/navigation/routerPath'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'

import { CreateOrderPageState } from '../CreateOrder'
import { useStyles } from './ClientForm.styles'
import { ClientData, SubmitAction } from './ClientForm.types'
import { clientFormValidationSchema, enrichedClientFormValidationSchema } from './config/clientFormValidation'
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

  const { mutateAsync: getClientQuestionnaireFormMutate, isLoading: isFormQuestionnaireLoading } =
    useGetClientQuestionnaireFormMutation()

  const sendToScore = useCallback(
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

  const saveDraftAndFormQuestionnaire = useCallback(
    (application: ApplicationFrontdc) => {
      const newApplication = setAnketaType(application, formRef.current?.values?.isFormComplete ?? false)

      confirmActionWrapper(async () => {
        updateOrderData(newApplication)
        const saveDraftRes = await saveDraftMutate(newApplication)
        if (saveDraftRes.dcAppId) {
          const blob = await getClientQuestionnaireFormMutate({ dcAppId: saveDraftRes.dcAppId })
          downloadBlob(blob, `${saveDraftRes.dcAppId}_Анкета клиента`)
        }
      }, 'Заявка будет сохранена под ДЦ:')
    },
    [confirmActionWrapper, getClientQuestionnaireFormMutate, saveDraftMutate, setAnketaType, updateOrderData],
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

  const handleSubmit = useCallback(
    (values: ClientData) => {
      if (!formRef.current) {
        return
      }
      const application = remapApplicationValues(values)
      if (!application) {
        return
      }

      switch (formRef.current.values.submitAction) {
        case SubmitAction.DRAFT:
          saveApplicationDraft(application)
          break
        case SubmitAction.SAVE:
          if (saveDraftDisabled) {
            sendToScore(application)
          } else {
            saveApplicationDraft(application)
          }
          break
        case SubmitAction.FORM_QUESTIONNAIRE:
          saveDraftAndFormQuestionnaire(application)
          break
      }
    },
    [
      formRef,
      sendToScore,
      remapApplicationValues,
      saveApplicationDraft,
      saveDraftAndFormQuestionnaire,
      saveDraftDisabled,
    ],
  )

  const isDisabledButtons = isDraftLoading || isSendToScoreLoading || isFormQuestionnaireLoading
  const isSaveDraftBtnLoading =
    formRef.current?.values.submitAction === SubmitAction.DRAFT ? isDraftLoading : false
  const isNextBtnLoading =
    formRef.current?.values.submitAction === SubmitAction.SAVE
      ? saveDraftDisabled
        ? isSendToScoreLoading
        : isDraftLoading
      : false
  const isFormQuestionnaireBtnLoading =
    formRef.current?.values.submitAction === SubmitAction.FORM_QUESTIONNAIRE
      ? isDraftLoading || isFormQuestionnaireLoading
      : false

  const validationSchema = isFullCalculator ? enrichedClientFormValidationSchema : clientFormValidationSchema

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
            onSubmit={handleSubmit}
            innerRef={formRef}
          >
            <FormContainer
              getOrderId={getOrderId}
              isSaveDraftBtnLoading={isSaveDraftBtnLoading}
              isNextBtnLoading={isNextBtnLoading}
              isDisabledButtons={isDisabledButtons}
              saveDraftDisabled={saveDraftDisabled}
              isDifferentVendor={isDifferentVendor}
              isReuploadedQuestionnaire={isReuploadedQuestionnaire}
              setReuploadedQuestionnaire={setReuploadedQuestionnaire}
              isAllowedUploadQuestionnaire={isAllowedUploadQuestionnaire}
              onUploadQuestionnaire={handleQuestionnaireUploadRef.current}
              saveValuesToStore={saveValuesToStore}
              isFormQuestionnaireBtnLoading={isFormQuestionnaireBtnLoading}
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
