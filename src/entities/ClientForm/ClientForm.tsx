import { Box, Button } from '@mui/material'
import { Form, Formik } from 'formik'

import { SwitchInput } from 'shared/ui/SwitchInput/SwitchInput'

import { DownloadClientDocs } from '../DownloadClientDocs'
import { useStyles } from './ClientForm.styles'
import { CommunicationArea } from './FormAreas/CommunicationArea/CommunicationArea'
import { IncomesArea } from './FormAreas/IncomesArea/IncomesArea'
import { JobArea } from './FormAreas/JobArea/JobArea'
import { PassportArea } from './FormAreas/PassportArea/PassportArea'
import { SecondDocArea } from './FormAreas/SecondDocArea/SecondDocArea'
import { ClientData, configInitialValues } from './utils/clientFormInitialValues'
import { clientFormValidationSchema } from './utils/clientFormValidation'

export function ClientForm() {
  const classes = useStyles()

  function onSubmit(values: ClientData) {
    if (values.regAddrIsLivingAddr == 1) {
      values.livingAddress = values.registrationAddress
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
          <Box className={classes.clientDocuments}>
            <DownloadClientDocs />
          </Box>

          <PassportArea />
          <CommunicationArea />
          <IncomesArea />
          <SecondDocArea />
          <JobArea />

          <Box className={classes.buttonsContainer} gridColumn="span 2" gridRow="7">
            <SwitchInput name="anketaSigned" label="Анкета подписана" gridColumn="span 15" />
            <Button className={classes.button} variant="outlined">
              Распечатать
            </Button>
            <Button type="submit" className={classes.button} variant="contained">
              Отправить
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  )
}
