import { useCallback, useEffect, useState } from 'react'

import { Box, Button } from '@mui/material'
import { Form, useFormikContext } from 'formik'
import isEqual from 'lodash/isEqual'

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
  getOrderId: (application: ClientData) => Promise<string | undefined>
  isSaveDraftBtnLoading: boolean
  isNextBtnLoading: boolean
  saveDraftDisabled: boolean
  disabledButtons: boolean
  isDifferentVendor: boolean
  isReuploadedQuestionnaire: boolean
  setReuploadedQuestionnaire: React.Dispatch<React.SetStateAction<boolean>>
  isAllowedUploadQuestionnaire: boolean
  onUploadQuestionnaire: (() => void) | undefined
  saveValuesToStore: (values: ClientData) => void
}

export function FormContainer({
  getOrderId,
  isSaveDraftBtnLoading,
  isNextBtnLoading,
  disabledButtons,
  saveDraftDisabled,
  isDifferentVendor,
  isReuploadedQuestionnaire,
  setReuploadedQuestionnaire,
  isAllowedUploadQuestionnaire,
  onUploadQuestionnaire,
  saveValuesToStore,
}: Props) {
  const classes = useStyles()
  const { values, handleSubmit, setFieldValue, isValid, validateForm } = useFormikContext<ClientData>()
  useScrollToErrorField()

  const { onChangeForm } = useOrderContext()
  const [isShouldSubmit, setShouldSubmit] = useState(false)
  const [isShouldValidate, setShouldValidate] = useState(false)
  const prevIsShouldValidate = usePrevious(isShouldValidate)
  const prevIsDifferentVendor = usePrevious(isDifferentVendor)

  const handleDraftClick = useCallback(() => {
    setFieldValue('isFormComplete', false)
    setFieldValue('submitAction', SubmitAction.Draft)
    setShouldValidate(true)
  }, [setFieldValue])

  const handleSaveClick = useCallback(() => {
    setFieldValue('isFormComplete', isValid)
    setFieldValue('submitAction', SubmitAction.Save)
    setShouldSubmit(true)
  }, [isValid, setFieldValue])

  const handlePrintClick = useCallback(() => {
    setFieldValue('isFormComplete', false)
    setFieldValue('submitAction', SubmitAction.Print)
    setShouldValidate(true)
  }, [setFieldValue])

  const onGetOrderId = useCallback(() => getOrderId(values), [getOrderId, values])

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
  useEffect(() => {
    if (isShouldValidate && prevIsShouldValidate !== isShouldValidate) {
      setShouldValidate(false)
      // Подменяем submitAction: SubmitAction.Save для валидации обязательных полей
      validateForm({ ...values, submitAction: SubmitAction.Save }).then(error => {
        const isFormComplete = Object.values(error).every(
          v => v !== FieldMessages.required && v !== QUESTIONNAIRE_FILE_IS_REQUIRED,
        )
        isFormComplete && setFieldValue('isFormComplete', true)
        setShouldSubmit(true)
      })
    }
  }, [isShouldValidate, prevIsShouldValidate, setFieldValue, validateForm, values])

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
    <ApplicationProvider onGetOrderId={onGetOrderId}>
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
        />

        <Box className={classes.buttonsArea}>
          <FraudDialog />

          <Box className={classes.buttonsContainer}>
            {!saveDraftDisabled && (
              <Button
                className={classes.button}
                variant="outlined"
                disabled={disabledButtons || isShouldSubmit}
                onClick={handleDraftClick}
              >
                Сохранить черновик
                {isSaveDraftBtnLoading && <CircularProgressWheel size="small" />}
              </Button>
            )}
            {/* <Button
              className={classes.button}
              variant="outlined"
              disabled={disabledButtons || isShouldSubmit}
              onClick={handlePrintClick}
            >
              Распечатать
            </Button> */}
            <Button
              className={classes.button}
              variant="contained"
              disabled={disabledButtons || isShouldSubmit}
              onClick={handleSaveClick}
            >
              {saveDraftDisabled ? 'Отправить на решение' : 'Далее'}
              {isNextBtnLoading && <CircularProgressWheel size="small" />}
            </Button>
          </Box>
        </Box>
      </Form>
    </ApplicationProvider>
  )
}
