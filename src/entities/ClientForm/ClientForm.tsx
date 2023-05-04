import React from 'react'

import { Box, Button } from '@mui/material'
import { Form, Formik } from 'formik'

import { useStyles } from './ClientForm.styles'
import { ClientData, configInitialValues } from './config/clientFormInitialValues'
import { clientFormValidationSchema } from './config/clientFormValidation'
import { CommunicationArea } from './FormAreas/CommunicationArea/CommunicationArea'
import { FraudDialog } from './FormAreas/FraudDialog/FraudDialog'
import { IncomesArea } from './FormAreas/IncomesArea/IncomesArea'
import { JobArea } from './FormAreas/JobArea/JobArea'
import { PassportArea } from './FormAreas/PassportArea/PassportArea'
import { QuestionnaireUploadArea } from './FormAreas/QuestionnaireUploadArea/QuestionnaireUploadArea'
import { SecondDocArea } from './FormAreas/SecondDocArea/SecondDocArea'

export function ClientForm() {
  const classes = useStyles()

  function onSubmit(values: ClientData) {
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
    console.log(values)
  }

  return (
    <Box className={classes.formContainer}>
      <Formik
        initialValues={configInitialValues}
        validationSchema={clientFormValidationSchema}
        onSubmit={onSubmit}
      >
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
              <Button className={classes.button} variant="outlined">
                Сохранить черновик
              </Button>
              <Button className={classes.button} variant="outlined">
                Распечатать
              </Button>
              <Button type="submit" className={classes.button} variant="contained">
                Отправить
              </Button>
            </Box>
          </Box>
        </Form>
      </Formik>
    </Box>
  )
}
