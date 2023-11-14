import { useCallback, useRef, useState } from 'react'

import { CalculateCreditRequest } from '@sberauto/dictionarydc-proto/public'
import { FormikProps } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { FullOrderCalculatorFields, BriefOrderCalculatorFields } from '../types'
import { mapValuesForCalculateCreditRequest } from '../utils/orderFormMapper'
import { useGetCreditProductListQuery } from './useGetCreditProductListQuery'
import { useGetVendorOptionsQuery } from './useGetVendorOptionsQuery'

type OrderCalculatorFields = BriefOrderCalculatorFields | FullOrderCalculatorFields

export function useOrderCalculator(
  remapApplicationValue: (values: OrderCalculatorFields) => void,
  onSubmit: (data: CalculateCreditRequest, onSuccess: () => void) => void,
) {
  const { vendorCode } = getPointOfSaleFromCookies()
  const { data: vendorOptions } = useGetVendorOptionsQuery({
    vendorCode,
  })

  const formRef = useRef<FormikProps<OrderCalculatorFields>>(null)
  const { data: creditProductListData } = useGetCreditProductListQuery({
    vendorCode,
    values: formRef.current?.values as OrderCalculatorFields,
    enabled: false,
  })

  const [isDisabled, setDisabled] = useState(false)
  const disabledFormSubmit = useCallback(() => setDisabled(true), [])
  const enableFormSubmit = useCallback(() => setDisabled(false), [])

  const handleSubmit = useCallback(
    async (values: OrderCalculatorFields) => {
      remapApplicationValue(values)
      onSubmit(
        mapValuesForCalculateCreditRequest(
          values,
          vendorOptions?.additionalOptionsMap || {},
          creditProductListData?.productsMap,
        ),
        disabledFormSubmit,
      )
    },
    [
      creditProductListData?.productsMap,
      disabledFormSubmit,
      onSubmit,
      remapApplicationValue,
      vendorOptions?.additionalOptionsMap,
    ],
  )

  return {
    formRef,
    isDisabled,
    enableFormSubmit,
    handleSubmit,
  }
}
