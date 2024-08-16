import { useMemo } from 'react'

import { useFormikContext } from 'formik'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { BriefOrderCalculatorFields, NormalizedBrands } from '../types'
import { useGetCarsListQuery } from './useGetCarsListQuery'

const INITIAL_CAR_INFO: NormalizedBrands = {
  brands: [],
  brandMap: {},
}

export function useCarSection() {
  const { vendorCode } = getPointOfSaleFromCookies()
  const result = useGetCarsListQuery({ vendorCode })

  const { values } = useFormikContext<BriefOrderCalculatorFields>()
  const carsInfo = useMemo(
    () => ({
      ...(values.carCondition
        ? result.data?.newCarsInfo || INITIAL_CAR_INFO
        : result.data?.usedCarsInfo || INITIAL_CAR_INFO),
    }),
    [result.data?.newCarsInfo, result.data?.usedCarsInfo, values.carCondition],
  )

  return {
    ...result,
    data: carsInfo,
  }
}
