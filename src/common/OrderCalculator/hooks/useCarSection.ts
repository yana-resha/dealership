import { useMemo } from 'react'

import { useField } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { FormFieldNameMap } from '../types'
import { useGetCarsListQuery } from './useGetCarsListQuery'

export function useCarSection() {
  const { vendorCode } = getPointOfSaleFromCookies()
  const { data, isLoading, isSuccess, isError } = useGetCarsListQuery({ vendorCode })
  const [carConditionField] = useField<number>(FormFieldNameMap.carCondition)
  const cars = useMemo(
    () => ({ ...(carConditionField.value ? data?.newCars : data?.usedCars) }),
    [carConditionField.value, data?.newCars, data?.usedCars],
  )

  return {
    cars,
    isLoading,
    isSuccess,
    isError,
  }
}
