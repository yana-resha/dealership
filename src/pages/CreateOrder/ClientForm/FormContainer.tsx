import { useCallback, useEffect, useState } from 'react'

import { Box, Button } from '@mui/material'
import { Form, useFormikContext } from 'formik'
import isEqual from 'lodash/isEqual'

import { useOrderContext } from 'common/OrderCalculator'
import { ApplicationProvider } from 'entities/application/ApplicationProvider'
import { FraudDialog } from 'entities/SpecialMark'
import { usePrevious } from 'shared/hooks/usePrevious'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'

import { useStyles } from './ClientForm.styles'
import { ClientData, SubmitAction } from './ClientForm.types'
import { CommunicationArea } from './FormAreas/CommunicationArea/CommunicationArea'
import { IncomesArea } from './FormAreas/IncomesArea/IncomesArea'
import { JobArea } from './FormAreas/JobArea/JobArea'
import { PassportArea } from './FormAreas/PassportArea/PassportArea'
import { QuestionnaireUploadArea } from './FormAreas/QuestionnaireUploadArea/QuestionnaireUploadArea'
import { SecondDocArea } from './FormAreas/SecondDocArea/SecondDocArea'

interface Props {
  getOrderId: (application: ClientData) => Promise<string | undefined>
  isDraftLoading: boolean
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
  isDraftLoading,
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
  const { values, handleSubmit, setFieldValue, isValid } = useFormikContext<ClientData>()
  const { onChangeForm } = useOrderContext()
  const [isShouldSubmit, setShouldSubmit] = useState(false)

  const handleDraftClick = useCallback(() => {
    setFieldValue('isFormComplete', isValid)
    setFieldValue('submitAction', SubmitAction.Draft)
    setShouldSubmit(true)
  }, [isValid, setFieldValue])

  const handleSaveClick = useCallback(() => {
    setFieldValue('isFormComplete', isValid)
    setFieldValue('submitAction', SubmitAction.Save)
    setShouldSubmit(true)
  }, [isValid, setFieldValue])

  const handlePrintClick = useCallback(() => {
    setFieldValue('isFormComplete', isValid)
    setFieldValue('submitAction', SubmitAction.Print)
    setShouldSubmit(true)
  }, [isValid, setFieldValue])

  const onGetOrderId = useCallback(() => getOrderId(values), [getOrderId, values])

  // Передаем информацию о совпадении ДЦ для валидации
  useEffect(() => {
    setFieldValue('isDifferentVendor', isDifferentVendor)
    // setFieldValue удален из зависимостей, чтобы избежать ререндера
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDifferentVendor])

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
                disabled={disabledButtons}
                onClick={handleDraftClick}
              >
                Сохранить черновик
                {isDraftLoading && <CircularProgressWheel size="small" />}
              </Button>
            )}
            {/* <Button
              className={classes.button}
              variant="outlined"
              disabled={disabledButtons}
              onClick={handlePrintClick}
            >
              Распечатать
            </Button> */}
            <Button
              className={classes.button}
              variant="contained"
              disabled={disabledButtons}
              onClick={handleSaveClick}
            >
              {saveDraftDisabled ? 'Отправить на решение' : 'Далее'}
            </Button>
          </Box>
        </Box>
      </Form>
    </ApplicationProvider>
  )
}
