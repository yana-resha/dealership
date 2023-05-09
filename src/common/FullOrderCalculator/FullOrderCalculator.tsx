import { useCallback } from 'react'

import { Box } from '@mui/material'
import { Formik } from 'formik'

import { fullInitialValueMap } from 'entities/orderCalculator'
import { OrderData } from 'pages/CreateOrderPage/OrderSearching/OrderForm'

import { FormContainer } from './FormContainer/FormContainer'
import { useStyles } from './FullOrderCalculator.styles'
import { fullOrderFormValidationSchema } from './fullOrderFormValidation.utils'

type Props = {
  onSubmit: (data: OrderData) => void
  onChangeForm: () => void
}

export function FullOrderCalculator({ onSubmit, onChangeForm }: Props) {
  const classes = useStyles()

  const handleSubmit = useCallback(
    (values: any) => {
      onSubmit(values)
    },
    [onSubmit],
  )

  return (
    <Box className={classes.formContainer} data-testid="fullOrderСalculatorForm">
      <Formik
        initialValues={fullInitialValueMap}
        validationSchema={fullOrderFormValidationSchema}
        onSubmit={handleSubmit}
      >
        <FormContainer onChangeForm={onChangeForm} />
      </Formik>
    </Box>
  )
}
