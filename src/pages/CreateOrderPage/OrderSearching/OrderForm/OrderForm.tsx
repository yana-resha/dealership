import { useCallback, useMemo } from 'react'

import { Box, Button, Typography } from '@mui/material'
import cx from 'classnames'
import { Form, Formik } from 'formik'

import { ReactComponent as OrderListLargeIcon } from 'assets/icons/orderListLarge.svg'
import { maskFullName, maskPassport, maskPhoneNumber } from 'shared/masks/InputMasks'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'

import { orderFormValuesInitialValues } from './OrderForm.config'
import { useStyles } from './OrderForm.styles'
import { OrderData, OrderFormData } from './OrderForm.types'
import {
  orderFormValidationSchema,
  searchingOrderFormValidationSchema,
  prepareData,
  parseData,
} from './utils'

type Props = {
  isNewOrder?: boolean
  onSubmit: (data: OrderData) => void
  initialData?: OrderData
}

export function OrderForm({ isNewOrder = false, onSubmit, initialData }: Props) {
  const classes = useStyles()

  const parsedInitialData = useMemo(
    () => (initialData ? parseData(initialData) : orderFormValuesInitialValues),
    [initialData],
  )

  const handleSubmit = useCallback(
    (values: OrderFormData) => {
      const preparedData = prepareData(values)
      onSubmit(preparedData)
    },
    [onSubmit],
  )

  return (
    <Box
      className={cx(classes.formContainer, { [classes.formContainerWithShadow]: isNewOrder })}
      data-testid={isNewOrder ? 'newOrderForm' : 'orderForm'}
    >
      <Formik
        initialValues={parsedInitialData}
        validationSchema={isNewOrder ? orderFormValidationSchema : searchingOrderFormValidationSchema}
        onSubmit={handleSubmit}
      >
        <Form className={classes.orderForm}>
          <Box className={classes.formTitleContainer} gridColumn="1 / -1" minWidth="min-content">
            {isNewOrder && <OrderListLargeIcon className={classes.formTitleIcon} />}
            <Typography className={cx(classes.formTitle, { [classes.formTitleSmall]: isNewOrder })}>
              {isNewOrder ? 'Заявки нет в системе' : 'Поиск заявки'}
            </Typography>
          </Box>

          <MaskedInputFormik
            name="passport"
            label="Серия и номер паспорта"
            placeholder="-"
            mask={maskPassport}
            gridColumn="span 5"
          />
          <MaskedInputFormik
            name="clientName"
            label="ФИО"
            placeholder="-"
            mask={maskFullName}
            gridColumn="span 9"
          />
          <DateInputFormik name="birthDate" label="День рождения" gridColumn="span 5" />
          <MaskedInputFormik
            name="phoneNumber"
            label="Телефон"
            placeholder="-"
            mask={maskPhoneNumber}
            gridColumn="span 6"
          />

          <Box className={classes.buttonsContainer} gridColumn="1 / -1">
            <Button type="submit" className={classes.button} variant="contained">
              {isNewOrder ? 'Создать заявку' : 'Отправить'}
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  )
}
