import { Box, Button, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Form, Formik, FormikErrors } from 'formik'
import { DateTime } from 'luxon'

import { maskCyrillicAndDigits } from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { applicationFiltersValues, FindApplicationsReq } from './ApplicationFilters.types'
import { validateFiltersFields } from './ApplicationFilters.utils'

const useStyles = makeStyles(() => ({
  buttonWrapper: {
    float: 'right',
  },
}))

type Props = { onSubmitClick: (req: FindApplicationsReq) => void }

export const ApplicationFilters = ({ onSubmitClick }: Props) => {
  const styles = useStyles()
  const theme = useTheme()
  const initialValues = {
    findApplication: '',
    applicationUpdateDate: '',
    isMyApplication: false,
    statusCodes: [],
  }

  const onSubmit = (
    values: applicationFiltersValues,
    { setErrors }: { setErrors: (errors: FormikErrors<applicationFiltersValues>) => void },
  ) => {
    if (values.findApplication.length) {
      validateFiltersFields(values, onSubmitClick, setErrors)
    } else {
      onSubmitClick({
        onlyUserApplicationsFlag: values.isMyApplication,
        applicationUpdateDate: DateTime.fromJSDate(new Date(values.applicationUpdateDate)).toISODate(),
      })
    }
  }

  return (
    <Box
      p={3}
      bgcolor={theme.palette.background.paper}
      width="100%"
      borderRadius={4}
      boxSizing="border-box"
      overflow="hidden"
    >
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Box display="flex" gap={3}>
            <Box flex={4}>
              <MaskedInputFormik
                name="findApplication"
                label="Найти заявку"
                placeholder="Серия и номер паспорта, ФИО, Номер заявки"
                mask={maskCyrillicAndDigits}
              />
            </Box>
            <Box flex={2}>
              <DateInputFormik name="applicationUpdateDate" label="Дата создания заявки" />
            </Box>
            <SwitchInputFormik name="isMyApplication" label="Мои заявки" centered />
          </Box>
          <Box width={155} mt={4} className={styles.buttonWrapper}>
            <Button type="submit" fullWidth variant="contained">
              Найти
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  )
}