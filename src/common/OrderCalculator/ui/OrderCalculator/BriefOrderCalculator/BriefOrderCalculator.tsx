import { useCallback, useRef } from 'react'

import { Box } from '@mui/material'
import { CalculateCreditRequest } from '@sberauto/dictionarydc-proto/public'
import { Formik, FormikProps } from 'formik'

import { initialValueMap } from 'common/OrderCalculator/config'
import { useGetCreditProductListQuery } from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import { useGetVendorOptionsQuery } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useInitialValues } from 'common/OrderCalculator/hooks/useInitialValues'
import { OrderCalculatorFields } from 'common/OrderCalculator/types'
import { mapValuesForCalculateCreditRequest } from 'common/OrderCalculator/utils/orderFormMapper'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { useStyles } from './BriefOrderCalculator.styles'
import { FormContainer } from './FormContainer/FormContainer'
import { briefOrderFormValidationSchema } from './utils/briefOrderFormValidation'

type Props = {
  isSubmitLoading: boolean
  onSubmit: (data: CalculateCreditRequest) => void
  onChangeForm: (saveValuesToStoreCb: () => void) => void
}

export function BriefOrderCalculator({ isSubmitLoading, onSubmit, onChangeForm }: Props) {
  const classes = useStyles()

  const { vendorCode } = getPointOfSaleFromCookies()
  const { data: vendorOptions } = useGetVendorOptionsQuery({
    vendorCode: vendorCode,
  })
  const { remapApplicationValues, initialValues, hasCustomInitialValues } = useInitialValues(
    initialValueMap,
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
      remapApplicationValues(values)
      onSubmit(
        mapValuesForCalculateCreditRequest(
          values,
          vendorOptions?.additionalOptionsMap || {},
          creditProductListData?.productsMap,
        ),
      )
    },
    [
      creditProductListData?.productsMap,
      onSubmit,
      vendorOptions?.additionalOptionsMap,
      remapApplicationValues,
    ],
  )

  return (
    <Box className={classes.formContainer} data-testid="orderCalculatorForm">
      <Formik
        initialValues={initialValues}
        validationSchema={briefOrderFormValidationSchema}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        <FormContainer
          isSubmitLoading={isSubmitLoading}
          shouldFetchProductsOnStart={hasCustomInitialValues}
          onChangeForm={onChangeForm}
          remapApplicationValues={remapApplicationValues}
        />
      </Formik>
    </Box>
  )
}
