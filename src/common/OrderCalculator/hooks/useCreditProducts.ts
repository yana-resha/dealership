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

const checkIsValueChanged = (prevValue: any, currentValue: any) =>
  prevValue !== undefined && prevValue !== currentValue

const isFullOrderCalculatorFieldsType = (
  obj: FullOrderCalculatorFields | BriefOrderCalculatorFields,
): obj is FullOrderCalculatorFields => obj && 'carPassportCreationDate' in obj

interface UseCreditProductParams<T extends FullOrderCalculatorFields | BriefOrderCalculatorFields> {
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

  const isBaseValuesChanged = useMemo(
    () =>
      CREDIT_PRODUCT_PARAMS_FIELDS.some(field => {
        if (isFullOrderCalculatorFieldsType(values)) {
          return checkIsValueChanged(sentParams[field], values[field])
        } else {
          return (
            field !== FormFieldNameMap.carPassportCreationDate &&
            checkIsValueChanged(sentParams[field], values[field])
          )
        }
      }),
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
    }
  }, [formFields, initialValueMap, isBaseValuesChanged, isFetching, setValues, shouldFetchProductsOnStart])

  useEffect(() => {
    if (!isError && data && !isBaseValuesChanged) {
      setShouldShowOrderSettings(true)
    }
  }, [data, isBaseValuesChanged, isError])

  useEffect(() => {
    if (isBaseValuesChanged) {
      setShouldShowOrderSettings(false)
    }
  }, [isBaseValuesChanged])

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
