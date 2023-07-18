import { useCallback, useEffect, useMemo, useState } from 'react'

import { useFormikContext } from 'formik'
import isEqual from 'lodash/isEqual'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'
import { usePrevious } from 'shared/hooks/usePrevious'

import { CREDIT_PRODUCT_PARAMS_FIELDS } from '../config'
import { CreditProductParams, FullOrderCalculatorFields, OrderCalculatorFields } from '../types'
import { useGetCreditProductListQuery } from './useGetCreditProductListQuery'

interface UseCreditProductParams<T> {
  shouldFetchProductsOnStart: boolean
  formFields: CreditProductParams
  initialValueMap: T
  onChangeForm: () => void
}

export function useCreditProducts<T extends FullOrderCalculatorFields | OrderCalculatorFields>({
  shouldFetchProductsOnStart,
  formFields,
  initialValueMap,
  onChangeForm,
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

  const prevValues = usePrevious({
    ...values,
    initialPaymentPercent: undefined,
    validationParams: {},
    commonError: {},
  })
  useEffect(() => {
    // initialPaymentPercent присвоено значение undefined, чтобы игнорировать это поле при сравнении,
    // т.к. в common/OrderCalculator/hooks/useLimits.ts при монтировании этому полю присваивается значение,
    // что приводит к изменению формы, хотя по факту ее значение никто не менял.
    const newValues = { ...values, initialPaymentPercent: undefined, validationParams: {}, commonError: {} }
    if (!isEqual(newValues, prevValues)) {
      onChangeForm()
    }
  }, [onChangeForm, prevValues, values])

  return {
    isLoading,
    shouldShowOrderSettings,
    changeShouldFetchProducts,
  }
}
