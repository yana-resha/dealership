import { memo, useCallback, useMemo } from 'react'

import { Box, Button, Typography } from '@mui/material'
import cx from 'classnames'
import { Form, Formik } from 'formik'

import { ReactComponent as OrderListLargeIcon } from 'assets/icons/orderListLarge.svg'
import { ReactComponent as WarningIcon } from 'assets/icons/warning.svg'
import { maskMobilePhoneNumber, maskName, maskPassport } from 'shared/masks/InputMasks'
import { CircularProgressWheel } from 'shared/ui/CircularProgressWheel/CircularProgressWheel'
import { DateInputFormik } from 'shared/ui/DateInput/DateInputFormik'
import { MaskedInputFormik } from 'shared/ui/MaskedInput/MaskedInputFormik'
import SberTypography from 'shared/ui/SberTypography'

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
  isShowWarning?: boolean
  isNewOrder?: boolean
  isLoading?: boolean
  onSubmit: (data: OrderData) => void
  onChange?: () => void
  initialData?: OrderData
  isDisabledSubmit?: boolean
}

function OrderForm({
  isShowWarning = false,
  isNewOrder = false,
  isLoading,
  onSubmit,
  onChange,
  initialData,
  isDisabledSubmit = false,
}: Props) {
  const classes = useStyles()

  const parsedInitialData = useMemo(
    () => (initialData ? parseData(initialData) : orderFormValuesInitialValues),
    [initialData],
  )

  const handleSubmit = useCallback(
    (values: OrderFormData) => {
      if (isDisabledSubmit) {
        return
      }
      const preparedData = prepareData(values)
      onSubmit(preparedData)
    },
    [onSubmit, isDisabledSubmit],
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
              {isNewOrder ? 'Создание новой заявки' : 'Поиск заявки'}
            </Typography>
          </Box>

          <MaskedInputFormik
            name="clientLastName"
            mask={maskName}
            placeholder="Фамилия"
            label="Фамилия"
            disabled={disabledFields.includes('clientLastName')}
          />
          <MaskedInputFormik
            name="clientFirstName"
            mask={maskName}
            placeholder="Имя"
            label="Имя"
            disabled={disabledFields.includes('clientFirstName')}
          />
          <MaskedInputFormik
            name="clientMiddleName"
            mask={maskName}
            placeholder="Отчество"
            label="Отчество"
            disabled={disabledFields.includes('clientMiddleName')}
          />
          <MaskedInputFormik
            name="passport"
            label="Серия и номер паспорта"
            placeholder="-"
            mask={maskPassport}
            disabled={disabledFields.includes('passport')}
          />
          <DateInputFormik
            name="birthDate"
            label="Дата рождения"
            disabled={disabledFields.includes('birthDate')}
          />
          <MaskedInputFormik
            name="phoneNumber"
            label="Телефон"
            placeholder="-"
            mask={maskMobilePhoneNumber}
            disabled={disabledFields.includes('phoneNumber')}
          />

          <Box className={classes.headerContainer} gridColumn="1 / -1">
            {isShowWarning && (
              <Box className={classes.warningContainer}>
                <WarningIcon />
                <SberTypography sberautoVariant="body3" component="p">
                  Заявки нет в системе. Вы можете создать новую
                </SberTypography>
              </Box>
            )}

            <Button
              type="submit"
              className={classes.button}
              variant="contained"
              disabled={isLoading || isDisabledSubmit}
            >
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
