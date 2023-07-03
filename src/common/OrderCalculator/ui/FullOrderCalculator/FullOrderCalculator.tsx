import { useCallback, useRef } from 'react'

import Box from '@mui/material/Box'
import { CalculateCreditRequest } from '@sberauto/dictionarydc-proto/public'
import { Formik, FormikProps } from 'formik'

import { fullInitialValueMap } from 'common/OrderCalculator/config'
import { useGetCreditProductListQuery } from 'common/OrderCalculator/hooks/useGetCreditProductListQuery'
import { useGetVendorOptionsQuery } from 'common/OrderCalculator/hooks/useGetVendorOptionsQuery'
import { useInitialValues } from 'common/OrderCalculator/hooks/useInitialValues'
import { FullOrderCalculatorFields } from 'common/OrderCalculator/types'
import { mapValuesForCalculateCreditRequest } from 'common/OrderCalculator/utils/orderFormMapper'
import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { FormContainer } from './FormContainer/FormContainer'
import { useStyles } from './FullOrderCalculator.styles'
import { fullOrderFormValidationSchema } from './fullOrderFormValidation.utils'

type Props = {
  isSubmitLoading: boolean
  onSubmit: (data: CalculateCreditRequest) => void
  onChangeForm: () => void
}
export function FullOrderCalculator({ isSubmitLoading, onSubmit, onChangeForm }: Props) {
  const classes = useStyles()

  const { vendorCode } = getPointOfSaleFromCookies()
  const { data: vendorOptions } = useGetVendorOptionsQuery({
    vendorCode: vendorCode,
  })
  const { remapApplicationValues, initialValues, hasCustomInitialValues } = useInitialValues(
    fullInitialValueMap,
    true,
  )
  const formRef = useRef<FormikProps<FullOrderCalculatorFields>>(null)
  const { data: creditProductListData } = useGetCreditProductListQuery({
    vendorCode,
    values: formRef.current?.values as FullOrderCalculatorFields,
    enabled: false,
  })

  const handleSubmit = useCallback(
    async (values: FullOrderCalculatorFields) => {
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
    <Box className={classes.formContainer} data-testid="fullOrderCalculatorForm">
      <Formik
        initialValues={initialValues as FullOrderCalculatorFields}
        validationSchema={fullOrderFormValidationSchema}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        <FormContainer
          isSubmitLoading={isSubmitLoading}
          onChangeForm={onChangeForm}
          shouldFetchProductsOnStart={hasCustomInitialValues}
        />
      </Formik>
    </Box>
  )
}
