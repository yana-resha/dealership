import { useCallback, useEffect, useMemo, useState } from 'react'

import { useFormikContext } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { stringToNumber } from 'shared/utils/stringToNumber'

import { CREDIT_PRODUCT_PARAMS_FIELDS } from '../config'
import { CreditProductParams, FullOrderCalculatorFields, BriefOrderCalculatorFields } from '../types'
import { useGetCreditProductListQuery } from './useGetCreditProductListQuery'

interface UseCreditProductParams<T> {
  shouldFetchProductsOnStart: boolean
  formFields: CreditProductParams
  initialValueMap: T
}

export function useCreditProducts<T extends FullOrderCalculatorFields | BriefOrderCalculatorFields>({
  shouldFetchProductsOnStart,
  formFields,
  initialValueMap,
}: UseCreditProductParams<T>) {
  const { values, setValues } = useFormikContext<T>()
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
    vendorCode: stringToNumber(vendorCode),
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

  return {
    isLoading,
    shouldShowOrderSettings,
    changeShouldFetchProducts,
  }
}
