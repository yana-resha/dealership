import { useCallback, useState } from 'react'

import { Box, Button, CircularProgress } from '@mui/material'
import { Form, Formik } from 'formik'

import { useSaveDraftApplicationMutation } from 'shared/api/requests/loanapplifecycledc'
import { useAppSelector } from 'shared/hooks/store/useAppSelector'

import { useStyles } from './ClientForm.styles'
import { ClientData } from './ClientForm.types'
import { clientFormValidationSchema } from './config/clientFormValidation'
import { CommunicationArea } from './FormAreas/CommunicationArea/CommunicationArea'
import { FraudDialog } from './FormAreas/FraudDialog/FraudDialog'
import { IncomesArea } from './FormAreas/IncomesArea/IncomesArea'
import { JobArea } from './FormAreas/JobArea/JobArea'
import { PassportArea } from './FormAreas/PassportArea/PassportArea'
import { QuestionnaireUploadArea } from './FormAreas/QuestionnaireUploadArea/QuestionnaireUploadArea'
import { SecondDocArea } from './FormAreas/SecondDocArea/SecondDocArea'
import { useGetDraftApplicationData } from './hooks/useGetDraftApplicationData'
import { makeClientForm } from './utils/makeClienForm'

export function ClientForm() {
  const classes = useStyles()
  const initialValues = useAppSelector(state => makeClientForm(state.order.order))
  const { mutate: saveDraft, isLoading: isDraftLoading } = useSaveDraftApplicationMutation()
  const getDraftApplicationData = useGetDraftApplicationData()
  const disabledButtons = isDraftLoading
  const [submitAction, setSubmitAction] = useState<'draft' | 'save' | undefined>(undefined)

  const onSubmit = useCallback((values: ClientData) => {
    if (values.regAddrIsLivingAddr) {
      values.livingAddress = values.registrationAddress
      values.livingAddressString = values.registrationAddressString
      values.livingNotKladr = values.regNotKladr
    }
    if (!values.hasNameChanged) {
      values.clientFormerName = ''
    }
    if (values.specialMarkReason !== '') {
      values.specialMark = true
    }

    console.log('ClientForm.onSubmit values:', values)
  }, [])

  const saveApplicationDraft = useCallback(
    (values: ClientData) => {
      console.log('ClientForm.saveApplicationDraft values:', values)
      saveDraft(getDraftApplicationData(values))
    },
    [saveDraft, getDraftApplicationData],
  )

  const getSubmitAction = useCallback(
    (values: ClientData) => {
      if (submitAction === 'draft') {
        saveApplicationDraft(values)
      } else {
        onSubmit(values)
      }
    },
    [saveApplicationDraft, onSubmit, submitAction],
  )

  return (
    <Box className={classes.formContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={clientFormValidationSchema}
        onSubmit={getSubmitAction}
      >
        {({ handleSubmit, values }) => (
          <Form className={classes.clientForm}>
            <PassportArea />
            <CommunicationArea />
            <IncomesArea />
            <SecondDocArea />
            <JobArea />
            <QuestionnaireUploadArea />

            <Box className={classes.buttonsArea}>
              <FraudDialog />
              <Box className={classes.buttonsContainer}>
                <Button
                  className={classes.button}
                  variant="outlined"
                  disabled={disabledButtons}
                  onClick={() => {
                    setSubmitAction('draft')
                    handleSubmit()
                  }}
                >
                  Сохранить черновик
                  {isDraftLoading && <CircularProgress color="inherit" size={25} />}
                </Button>
                <Button className={classes.button} variant="outlined" disabled={disabledButtons}>
                  Распечатать
                </Button>
                <Button
                  className={classes.button}
                  variant="contained"
                  disabled={disabledButtons}
                  onClick={() => {
                    setSubmitAction('save')
                    handleSubmit()
                  }}
                >
                  Отправить
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}
