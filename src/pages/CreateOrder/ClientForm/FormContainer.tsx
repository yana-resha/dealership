import { useCallback, useEffect, useState } from 'react'

import { Box, Button } from '@mui/material'
import { Form, useFormikContext } from 'formik'
import isEqual from 'lodash/isEqual'
import { useSnackbar } from 'notistack'

import { useOrderContext } from 'common/OrderCalculator'
import { ApplicationProvider } from 'entities/applications/ApplicationProvider'
import { FraudDialog } from 'entities/SpecialMark'
import { FieldMessages } from 'shared/constants/fieldMessages'
import { usePrevious } from 'shared/hooks/usePrevious'
import { useScrollToErrorField } from 'shared/hooks/useScrollToErrorField'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'

import { useStyles } from './ClientForm.styles'
import { ClientData, SubmitAction } from './ClientForm.types'
import { QUESTIONNAIRE_FILE_IS_REQUIRED } from './config/clientFormValidation'
import { CommunicationArea } from './FormAreas/CommunicationArea/CommunicationArea'
import { IncomesArea } from './FormAreas/IncomesArea/IncomesArea'
import { JobArea } from './FormAreas/JobArea/JobArea'
import { PassportArea } from './FormAreas/PassportArea/PassportArea'
import { QuestionnaireUploadArea } from './FormAreas/QuestionnaireUploadArea/QuestionnaireUploadArea'
import { SecondDocArea } from './FormAreas/SecondDocArea/SecondDocArea'

interface Props {
  getOrderId: (orderForm: ClientData) => Promise<string | undefined>
  isSaveDraftBtnLoading: boolean
  isNextBtnLoading: boolean
  saveDraftDisabled: boolean
  isDisabledButtons: boolean
  isDifferentVendor: boolean
  isReuploadedQuestionnaire: boolean
  setReuploadedQuestionnaire: React.Dispatch<React.SetStateAction<boolean>>
  isAllowedUploadQuestionnaire: boolean
  onUploadQuestionnaire: (() => void) | undefined
  saveValuesToStore: (values: ClientData) => void
  isFormQuestionnaireBtnLoading: boolean
}

export function FormContainer({
  getOrderId,
  isSaveDraftBtnLoading,
  isNextBtnLoading,
  isDisabledButtons,
  saveDraftDisabled,
  isDifferentVendor,
  isReuploadedQuestionnaire,
  setReuploadedQuestionnaire,
  isAllowedUploadQuestionnaire,
  onUploadQuestionnaire,
  saveValuesToStore,
  isFormQuestionnaireBtnLoading,
}: Props) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const { values, handleSubmit, setFieldValue, isValid, validateForm } = useFormikContext<ClientData>()
  useScrollToErrorField()

  const { onChangeForm } = useOrderContext()
  const [isShouldSubmit, setShouldSubmit] = useState(false)
  const [isShouldValidate, setShouldValidate] = useState(false)
  const prevIsShouldValidate = usePrevious(isShouldValidate)
  const prevIsDifferentVendor = usePrevious(isDifferentVendor)

  const handleDraftClick = useCallback(() => {
    setFieldValue('isFormComplete', false)
    setFieldValue('submitAction', SubmitAction.DRAFT)
    setShouldValidate(true)
  }, [setFieldValue])

  const handleSaveClick = useCallback(() => {
    setFieldValue('isFormComplete', isValid)
    setFieldValue('submitAction', SubmitAction.SAVE)
    setShouldSubmit(true)
  }, [isValid, setFieldValue])

  const handleFormQuestionnaire = useCallback(() => {
    setFieldValue('isFormComplete', false)
    setFieldValue('submitAction', SubmitAction.FORM_QUESTIONNAIRE)
    setShouldValidate(true)
  }, [setFieldValue])

  const getOrderIdWrapped = useCallback(() => getOrderId(values), [getOrderId, values])

  // Передаем информацию о совпадении ДЦ для валидации
  useEffect(() => {
    if (prevIsDifferentVendor !== isDifferentVendor) {
      setFieldValue('isDifferentVendor', isDifferentVendor)
    }
  }, [isDifferentVendor, prevIsDifferentVendor, setFieldValue])

  // Промежуточная валидация перед дальнейшим сохранением черновика.
  // Производится проверка заполнения всех обязательных полей и анкеты,
  // потому подменяем submitAction: SubmitAction.Save на этапе валидации.
  // Если валидация прошла успешно, то присваиваем isFormComplete true
  // Стандартная валидация формы (черновика) не отменяется и будет штатно производиться дальше
  // Необходимо, чтобы заполнить isFormComplete (и из него anketaType)
  useEffect(() => {
    if (isShouldValidate && prevIsShouldValidate !== isShouldValidate) {
      setShouldValidate(false)
      // Подменяем submitAction: SubmitAction.Save для валидации обязательных полей
      validateForm({ ...values, submitAction: SubmitAction.SAVE }).then(error => {
        const isFormComplete = Object.values(error).every(
          v => v !== FieldMessages.required && v !== QUESTIONNAIRE_FILE_IS_REQUIRED,
        )
        const isFieldsComplete = Object.entries(error).every(
          ([k, v]) =>
            v !== FieldMessages.required || k === 'questionnaireFile' || k === 'incomeProofUploadValidator',
        )
        isFormComplete && setFieldValue('isFormComplete', true)
        !isFieldsComplete &&
          enqueueSnackbar('Ошибка. Для формирования анкеты необходимо заполнить все обязательные поля', {
            variant: 'error',
          })

        setShouldSubmit(true)
      })
    }
  }, [enqueueSnackbar, isShouldValidate, prevIsShouldValidate, setFieldValue, validateForm, values])

  useEffect(() => {
    if (isShouldSubmit) {
      setShouldSubmit(false)
      handleSubmit()
    }
  }, [handleSubmit, isShouldSubmit])

  const prevValues = usePrevious(values)
  useEffect(() => {
    if (!isEqual(values, prevValues)) {
      onChangeForm(() => saveValuesToStore(values))
    }
  }, [onChangeForm, prevValues, saveValuesToStore, values])

  return (
    <ApplicationProvider getOrderId={getOrderIdWrapped}>
      <Form className={classes.clientForm}>
        <PassportArea />
        <CommunicationArea />
        <SecondDocArea />
        <JobArea />
        <IncomesArea />
        <QuestionnaireUploadArea
          isDifferentVendor={isDifferentVendor}
          isReuploadedQuestionnaire={isReuploadedQuestionnaire}
          setReuploadedQuestionnaire={setReuploadedQuestionnaire}
          isAllowedUploadQuestionnaire={isAllowedUploadQuestionnaire}
          onUploadDocument={onUploadQuestionnaire}
          isSaveDraftDisabled={saveDraftDisabled}
          onClickFormBtn={handleFormQuestionnaire}
          isDisabledFormBtn={isDisabledButtons || isShouldSubmit}
          isFormLoading={isFormQuestionnaireBtnLoading}
        />

        <Box className={classes.buttonsArea}>
          <FraudDialog />

          <Box className={classes.buttonsContainer}>
            {!saveDraftDisabled && (
              <Button
                className={classes.button}
                variant="outlined"
                disabled={isDisabledButtons || isShouldSubmit}
                onClick={handleDraftClick}
              >
                {isSaveDraftBtnLoading && <CircularProgressWheel size="small" />}
                Сохранить черновик
              </Button>
            )}
            <Button
              className={classes.button}
              variant="contained"
              disabled={isDisabledButtons || isShouldSubmit}
              onClick={handleSaveClick}
            >
              {isNextBtnLoading && <CircularProgressWheel size="small" />}
              {saveDraftDisabled ? 'Отправить на решение' : 'Далее'}
            </Button>
          </Box>
        </Box>
      </Form>
    </ApplicationProvider>
  )
}
