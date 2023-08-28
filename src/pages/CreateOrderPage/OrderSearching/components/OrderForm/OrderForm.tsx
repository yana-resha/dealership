import { memo, useCallback, useMemo } from 'react'

import { Box, Button, Typography } from '@mui/material'
import cx from 'classnames'
import { Form, Formik } from 'formik'

import { ReactComponent as OrderListLargeIcon } from 'assets/icons/orderListLarge.svg'
import { maskFullName, maskMobilePhoneNumber, maskPassport } from 'shared/masks/InputMasks'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'
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
  isLoading?: boolean
  onSubmit: (data: OrderData) => void
  onChange?: () => void
  initialData?: OrderData
}

function OrderForm({ isNewOrder = false, isLoading, onSubmit, onChange, initialData }: Props) {
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

  const disabledFields = isNewOrder
    ? Object.keys(parsedInitialData).filter(key => !!parsedInitialData[key as keyof typeof parsedInitialData])
    : []
  const btnTitle = isNewOrder ? 'Создать заявку' : 'Найти'

  return (
    <Box
      className={cx(classes.formContainer, { [classes.formContainerWithShadow]: isNewOrder })}
      data-testid={isNewOrder ? 'newOrderForm' : 'orderForm'}
    >
      <Formik
        enableReinitialize
        initialValues={parsedInitialData}
        validationSchema={isNewOrder ? orderFormValidationSchema : searchingOrderFormValidationSchema}
        onSubmit={handleSubmit}
      >
        <Form className={classes.orderForm} onChange={onChange}>
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
            disabled={disabledFields.includes('passport')}
          />
          <MaskedInputFormik
            name="clientName"
            label="ФИО"
            placeholder="-"
            mask={maskFullName}
            gridColumn="span 9"
            disabled={disabledFields.includes('clientName')}
          />
          <DateInputFormik
            name="birthDate"
            label="Дата рождения"
            gridColumn="span 5"
            disabled={disabledFields.includes('birthDate')}
          />
          <MaskedInputFormik
            name="phoneNumber"
            label="Телефон"
            placeholder="-"
            mask={maskMobilePhoneNumber}
            gridColumn="span 6"
            disabled={disabledFields.includes('phoneNumber')}
          />

          <Box className={classes.buttonsContainer} gridColumn="1 / -1">
            <Button type="submit" className={classes.button} variant="contained" disabled={isLoading}>
              {!isLoading ? btnTitle : <CircularProgressWheel size="small" />}
            </Button>
          </Box>
        </Form>
      </Formik>
    </Box>
  )
}

const memoOrderForm = memo(OrderForm)

export { memoOrderForm as OrderForm }
