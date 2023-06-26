import { useCallback, useRef } from 'react'

import { Box, CircularProgress } from '@mui/material'
import { CalculateCreditRequest } from '@sberauto/dictionarydc-proto/public'
import { Formik, FormikProps } from 'formik'

import { initialValueMap } from 'common/OrderCalculator/config'
import { useGetCreditProductListQuery } from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import { useGetVendorOptionsQuery } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useInitialValues } from 'common/OrderCalculator/hooks/useInitialValues'
import { OrderCalculatorFields } from 'common/OrderCalculator/types'
import { mapValuesForCalculateCreditRequest } from 'common/OrderCalculator/utils/orderFormMapper'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { FormContainer } from './FormContainer/FormContainer'
import { useStyles } from './OrderCalculator.styles'
import { orderFormValidationSchema } from './utils/orderFormValidation'

type Props = {
  isSubmitLoading: boolean
  onSubmit: (data: CalculateCreditRequest) => void
  onChangeForm: () => void
  applicationId?: string
}

export function OrderCalculator({ isSubmitLoading, onSubmit, onChangeForm, applicationId }: Props) {
  const classes = useStyles()
  const { vendorCode } = getPointOfSaleFromCookies()
  const { data: vendorOptions } = useGetVendorOptionsQuery({
    vendorCode: vendorCode,
  })
  const { isShouldShowLoading, initialValues, hasCustomInitialValues } = useInitialValues(
    initialValueMap,
    applicationId,
    undefined,
  )

  const formRef = useRef<FormikProps<OrderCalculatorFields>>(null)
  const { data: creditProductListData } = useGetCreditProductListQuery({
    vendorCode,
    values: formRef.current?.values as OrderCalculatorFields,
    enabled: false,
  })

  const handleSubmit = useCallback(
    async (values: OrderCalculatorFields) => {
      onSubmit(
        mapValuesForCalculateCreditRequest(
          values,
          vendorOptions?.options || [],
          creditProductListData?.productsMap,
        ),
      )
    },
    [creditProductListData?.productsMap, onSubmit, vendorOptions?.options],
  )

  return (
    <Box className={classes.formContainer} data-testid="orderCalculatorForm">
      {isShouldShowLoading ? (
        <CircularProgress className={classes.circular} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={orderFormValidationSchema}
          onSubmit={handleSubmit}
        >
          <FormContainer
            isSubmitLoading={isSubmitLoading}
            onChangeForm={onChangeForm}
            shouldFetchProductsOnStart={hasCustomInitialValues}
          />
        </Formik>
      )}
    </Box>
  )
}
