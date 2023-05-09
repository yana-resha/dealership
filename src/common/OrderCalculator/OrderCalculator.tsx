import { useCallback } from 'react'

import { Box } from '@mui/material'
import { Formik } from 'formik'

import { OrderData } from 'pages/CreateOrderPage/OrderSearching/OrderForm'

import { initialValueMap } from '../../entities/orderCalculator/config'
import { FormContainer } from './FormContainer/FormContainer'
import { useStyles } from './OrderCalculator.styles'
import { orderСalculatorFormValidationSchema } from './utils/orderFormValidation'

type Props = {
  onSubmit: (data: OrderData) => void
  onChangeForm: () => void
}

export function OrderCalculator({ onSubmit, onChangeForm }: Props) {
  const classes = useStyles()

  const handleSubmit = useCallback(
    (values: any) => {
      onSubmit(values)
    },
    [onSubmit],
  )

  return (
    <Box className={classes.formContainer} data-testid="orderСalculatorForm">
      <Formik
        initialValues={initialValueMap}
        validationSchema={orderСalculatorFormValidationSchema}
        onSubmit={handleSubmit}
      >
        <FormContainer onChangeForm={onChangeForm} />
      </Formik>
    </Box>
  )
}
