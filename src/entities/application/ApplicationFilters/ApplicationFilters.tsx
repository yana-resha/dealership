import { useMemo } from 'react'

import { Box, Button, useTheme } from '@mui/material'
import { Form, Formik, FormikErrors } from 'formik'
import { DateTime } from 'luxon'
import * as Yup from 'yup'

import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { maskDigitsOnly, maskName } from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { FormApplicationFiltersValues, FindApplicationsReq } from './ApplicationFilters.types'
import { validateFiltersFields } from './ApplicationFilters.utils'

type Props = {
  onSubmitClick: (req: FindApplicationsReq) => void
}

export const ApplicationFilters = ({ onSubmitClick }: Props) => {
  const theme = useTheme()
  const employeeId = useAppSelector(state => state.user.user?.employeeId)

  const initialValues = useMemo(
    () => ({
      findApplication: '',
      lastName: '',
      firstName: '',
      middleName: '',
      applicationUpdateDate: null,
      isMyApplication: false,
      statusCodes: [],
    }),
    [],
  )

  const validationSchema = Yup.object().shape(
    {
      firstName: Yup.string().when('lastName', {
        is: (val: string) => val && val.trim() != '',
        then: schema => schema.required('Поле обязательно для заполнения'),
      }),
      lastName: Yup.string().when('firstName', {
        is: (val: string) => val && val.trim() != '',
        then: schema => schema.required('Поле обязательно для заполнения'),
      }),
    },
    [['firstName', 'lastName']],
  )

  const onSubmit = (
    values: FormApplicationFiltersValues,
    { setErrors }: { setErrors: (errors: FormikErrors<FormApplicationFiltersValues>) => void },
  ) => {
    const onlyUserApplications: { employeeId?: string; onlyUserApplicationsFlag?: boolean } = {}
    if (values.isMyApplication) {
      onlyUserApplications.employeeId = employeeId
      onlyUserApplications.onlyUserApplicationsFlag = true
    }

    if (values.findApplication.length || values.lastName.length) {
      validateFiltersFields(
        {
          findApplication: values.findApplication,
          lastName: values.lastName,
          firstName: values.firstName,
          middleName: values.middleName,
          applicationUpdateDate: values.applicationUpdateDate,
          onlyUserApplications,
        },
        onSubmitClick,
        setErrors,
      )
    } else {
      onSubmitClick({
        ...onlyUserApplications,
        applicationUpdateDate: values.applicationUpdateDate
          ? DateTime.fromJSDate(values.applicationUpdateDate).toISODate()
          : undefined,
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
      flexShrink={0}
    >
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        <Form>
          <Box display="grid" gap={3} gridTemplateColumns="repeat(7, 1fr)">
            <MaskedInputFormik
              name="findApplication"
              label="Найти заявку"
              placeholder="Серия и номер паспорта, Номер заявки"
              mask={maskDigitsOnly}
              gridColumn="span 4"
            />
            <DateInputFormik
              name="applicationUpdateDate"
              label="Дата обновления заявки"
              gridColumn="span 2"
            />
            <SwitchInputFormik gridColumn="span 1" name="isMyApplication" label="Мои заявки" centered />

            <MaskedInputFormik
              name="lastName"
              label="Фамилия"
              placeholder="Фамилия"
              mask={maskName}
              gridColumn="span 2"
            />
            <MaskedInputFormik
              name="firstName"
              label="Имя"
              placeholder="Имя"
              mask={maskName}
              gridColumn="span 2"
            />
            <MaskedInputFormik
              name="middleName"
              label="Отчество"
              placeholder="Отчество"
              mask={maskName}
              gridColumn="span 2"
            />
            <Box flex={1} gridColumn="span 1">
              <Box width="auto" maxWidth={200} mt={3}>
                <Button type="submit" fullWidth variant="contained">
                  Найти
                </Button>
              </Box>
            </Box>
          </Box>
        </Form>
      </Formik>
    </Box>
  )
}
