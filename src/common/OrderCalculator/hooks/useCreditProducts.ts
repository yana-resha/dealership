import { useCallback, useEffect, useMemo, useState } from 'react'

import { useFormikContext } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { CREDIT_PRODUCT_PARAMS_FIELDS } from '../config'
import {
  CreditProductParams,
  FullOrderCalculatorFields,
  BriefOrderCalculatorFields,
  FormFieldNameMap,
} from '../types'
import { useGetCreditProductListQuery } from './useGetCreditProductListQuery'

interface UseCreditProductParams<T> {
  shouldFetchProductsOnStart: boolean
  formFields: CreditProductParams
  initialValueMap: T
  creditProductId: string | undefined
  resetCreditProductId: () => void
}

export function useCreditProducts<T extends FullOrderCalculatorFields | BriefOrderCalculatorFields>({
  shouldFetchProductsOnStart,
  formFields,
  initialValueMap,
  creditProductId,
  resetCreditProductId,
}: UseCreditProductParams<T>) {
  const { values, setValues, setFieldValue } = useFormikContext<T>()
  const { vendorCode } = getPointOfSaleFromCookies()

  const [sentParams, setSentParams] = useState<CreditProductParams>({})
  const [shouldShowOrderSettings, setShouldShowOrderSettings] = useState(false)
  const [shouldFetchProducts, setShouldFetchProducts] = useState(shouldFetchProductsOnStart)
  const changeShouldFetchProducts = useCallback(() => setShouldFetchProducts(true), [])

  const isChangedBaseValues = useMemo(
    () =>
      CREDIT_PRODUCT_PARAMS_FIELDS.some(
        f =>
          !!sentParams[f as keyof CreditProductParams] &&
          sentParams[f as keyof CreditProductParams] !== values[f as keyof T],
      ),
    [sentParams, values],
  )

  const { data, isError, isFetching, isLoading } = useGetCreditProductListQuery({
    vendorCode,
    values,
    enabled: shouldFetchProducts,
  })

  useEffect(() => {
    if (isFetching) {
      setShouldFetchProducts(false)
      setSentParams(formFields)
      if (!shouldFetchProductsOnStart || isChangedBaseValues) {
        setValues({ ...initialValueMap, ...formFields })
      }
    }
  }, [formFields, initialValueMap, isChangedBaseValues, isFetching, setValues, shouldFetchProductsOnStart])

  useEffect(() => {
    if (!isError && data && !isChangedBaseValues) {
      setShouldShowOrderSettings(true)
    }
  }, [data, isChangedBaseValues, isError])

  useEffect(() => {
    if (isChangedBaseValues) {
      setShouldShowOrderSettings(false)
    }
  }, [isChangedBaseValues])

  /* если от родителя пришел id кредитного продукта, то переключаемся на него,
  при условии, что кредитный продукт еще не выбран */
  useEffect(() => {
    if (creditProductId && !values.creditProduct) {
      resetCreditProductId()
      setFieldValue(FormFieldNameMap.creditProduct, creditProductId)
    }
  }, [creditProductId, resetCreditProductId, setFieldValue, values.creditProduct])

  return {
    isLoading,
    shouldShowOrderSettings,
    changeShouldFetchProducts,
  }
}
