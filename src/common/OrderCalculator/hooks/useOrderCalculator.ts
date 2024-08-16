import { useCallback, useRef, useState } from 'react'

import { CalculateCreditRequest } from '@sberauto/dictionarydc-proto/public'
import { FormikProps } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { FullOrderCalculatorFields, BriefOrderCalculatorFields } from '../types'
import { mapValuesForCalculateCreditRequest } from '../utils/orderFormMapper'
import { useGetCreditProductListQuery } from './useGetCreditProductListQuery'
import { useGetVendorOptionsQuery } from './useGetVendorOptionsQuery'

export type OrderCalculatorFields = BriefOrderCalculatorFields | FullOrderCalculatorFields
type Params = {
  onSubmit: (data: CalculateCreditRequest, onSuccess: () => void) => void
  remapApplicationValues?: (values: BriefOrderCalculatorFields) => void
  remapApplicationFullValues?: (values: FullOrderCalculatorFields) => void
}
export function useOrderCalculator({ onSubmit, remapApplicationValues, remapApplicationFullValues }: Params) {
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
      remapApplicationValues?.(values)
      remapApplicationFullValues?.(values as FullOrderCalculatorFields)
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
      remapApplicationFullValues,
      remapApplicationValues,
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
