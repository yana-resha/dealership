import { useCallback, useEffect, useState } from 'react'

import { Box, Button, CircularProgress } from '@mui/material'
import { Form, useFormikContext } from 'formik'

import { FraudDialog } from 'entities/SpecialMark'

import { useStyles } from './ClientForm.styles'
import { SubmitAction } from './ClientForm.types'
import { CommunicationArea } from './FormAreas/CommunicationArea/CommunicationArea'
import { IncomesArea } from './FormAreas/IncomesArea/IncomesArea'
import { JobArea } from './FormAreas/JobArea/JobArea'
import { PassportArea } from './FormAreas/PassportArea/PassportArea'
import { QuestionnaireUploadArea } from './FormAreas/QuestionnaireUploadArea/QuestionnaireUploadArea'
import { SecondDocArea } from './FormAreas/SecondDocArea/SecondDocArea'

interface Props {
  isDraftLoading: boolean
  disabledButtons: boolean
}

export function FormContainer({ isDraftLoading, disabledButtons }: Props) {
  const classes = useStyles()
  const { handleSubmit, setFieldValue } = useFormikContext()
  const [isShouldSubmit, setShouldSubmit] = useState(false)

  const handleDraftClick = useCallback(() => {
    setFieldValue('submitAction', SubmitAction.Draft)
    setShouldSubmit(true)
  }, [setFieldValue])

  const handleSaveClick = useCallback(() => {
    setFieldValue('submitAction', SubmitAction.Save)
    setShouldSubmit(true)
  }, [setFieldValue])

  useEffect(() => {
    if (isShouldSubmit) {
      setShouldSubmit(false)
      handleSubmit()
    }
  }, [handleSubmit, isShouldSubmit])

  return (
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
            onClick={handleDraftClick}
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
            onClick={handleSaveClick}
          >
            Отправить
          </Button>
        </Box>
      </Box>
    </Form>
  )
}
