import { useMemo } from 'react'

import { Box, Button, useTheme } from '@mui/material'
import { Form, Formik, FormikErrors } from 'formik'

import { useAppSelector } from 'shared/hooks/store/useAppSelector'
import { maskDigitsOrName } from 'shared/masks/InputMasks'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import { SwitchInputFormik } from 'shared/ui/SwitchInput/SwitchInputFormik'

import { FormApplicationFiltersValues, FindApplicationsReq } from './ApplicationSearch.types'
import { validateFiltersFields } from './ApplicationSearch.utils'

type Props = {
  onSubmitClick: (req: FindApplicationsReq) => void
}

export const ApplicationSearch = ({ onSubmitClick }: Props) => {
  const theme = useTheme()
  const employeeId = useAppSelector(state => state.user.user?.employeeId)

  const initialValues = useMemo(
    () => ({
      findApplication: '',
      isMyApplication: false,
    }),
    [],
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

    if (values.findApplication.length) {
      validateFiltersFields(
        {
          findApplication: values.findApplication,
          onlyUserApplications,
        },
        onSubmitClick,
        setErrors,
      )
    } else {
      onSubmitClick({
        ...onlyUserApplications,
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
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <Box display="grid" gap={3} gridTemplateColumns="repeat(7, 1fr)">
            <MaskedInputFormik
              name="findApplication"
              label="Найти заявку"
              placeholder="Серия и номер паспорта, или Номер заявки, или Фамилия"
              mask={maskDigitsOrName}
              gridColumn="span 5"
            />

            <SwitchInputFormik gridColumn="span 1" name="isMyApplication" label="Мои заявки" centered />

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
