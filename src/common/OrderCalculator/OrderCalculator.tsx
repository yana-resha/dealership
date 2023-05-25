import { useCallback, useState } from 'react'

import { Box } from '@mui/material'
import { CalculateCreditRequest } from '@sberauto/dictionarydc-proto/public'
import { Formik } from 'formik'

import { initialValueMap, OrderCalculatorFields } from 'entities/OrderCalculator'
import { ValidationParams } from 'entities/OrderCalculator/utils/baseFormValidation'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { useGetVendorOptions } from 'shared/api/dictionaryDc/dictionaryDc.api'

import { FormContainer } from './FormContainer/FormContainer'
import { ValidationParamsContext } from './FormContainer/OrderSettingsArea/ValidationParamsContext'
import { useStyles } from './OrderCalculator.styles'
import { mapValuesForCalculateCreditRequest } from './utils/orderFormMapper'
import { orderFormValidationSchema } from './utils/orderFormValidation.utils'

type Props = {
  isOfferLoading: boolean
  onSubmit: (data: CalculateCreditRequest) => void
  onChangeForm: () => void
}

export function OrderCalculator({ isOfferLoading, onSubmit, onChangeForm }: Props) {
  const classes = useStyles()

  const [validationParams, setSchemaParams] = useState({})
  const changeSchemaParams = useCallback((newParams: ValidationParams) => setSchemaParams(newParams), [])

  const { vendorCode } = getPointOfSaleFromCookies()
  const { data: vendorOptions } = useGetVendorOptions({
    vendorCode: vendorCode,
  })

  const handleSubmit = useCallback(
    async (values: OrderCalculatorFields) => {
      onSubmit(mapValuesForCalculateCreditRequest(values, vendorOptions?.options || []))
    },
    [onSubmit, vendorOptions],
  )

  return (
    <Box className={classes.formContainer} data-testid="orderCalculatorForm">
      <Formik
        initialValues={initialValueMap}
        validationSchema={orderFormValidationSchema(validationParams)}
        onSubmit={handleSubmit}
      >
        <ValidationParamsContext changeSchemaParams={changeSchemaParams}>
          <FormContainer isOfferLoading={isOfferLoading} onChangeForm={onChangeForm} />
        </ValidationParamsContext>
      </Formik>
    </Box>
  )
}
