import { useCallback } from 'react'

import { Box } from '@mui/material'
import { CalculateCreditRequest } from '@sberauto/dictionarydc-proto/public'
import { Formik } from 'formik'

import { initialValueMap, OrderCalculatorFields } from 'entities/OrderCalculator/config'

import { FormContainer } from './FormContainer/FormContainer'
import { useStyles } from './OrderCalculator.styles'
import { mapValuesForCalculateCreditRequest } from './utils/orderFormMapper'
import { orderСalculatorFormValidationSchema } from './utils/orderFormValidation'

type Props = {
  isOfferLoading: boolean
  onSubmit: (data: CalculateCreditRequest) => void
  onChangeForm: () => void
}

export function OrderCalculator({ isOfferLoading, onSubmit, onChangeForm }: Props) {
  const classes = useStyles()

  const handleSubmit = useCallback(
    (values: OrderCalculatorFields) => {
      onSubmit(mapValuesForCalculateCreditRequest(values))
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
        <FormContainer isOfferLoading={isOfferLoading} onChangeForm={onChangeForm} />
      </Formik>
    </Box>
  )
}
