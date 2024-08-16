import { useMemo } from 'react'

import { getPointOfSaleFromCookies } from 'entities/pointOfSale'

import { useGetCarsListQuery } from './useGetCarsListQuery'

export function useIsHasCarWithGovProgram() {
  const { vendorCode } = getPointOfSaleFromCookies()
  const result = useGetCarsListQuery({ vendorCode })

  const isHasCarWithGovProgram = useMemo(() => {
    const newCars = Object.values(result.data?.newCarsInfo.brandMap || {})
    const usedCars = Object.values(result.data?.usedCarsInfo.brandMap || {})

    return [...newCars, ...usedCars].some(car =>
      car.models.some(model => car.modelMap[model].govprogramFlag || car.modelMap[model].govprogramDfoFlag),
    )
  }, [result.data?.newCarsInfo.brandMap, result.data?.usedCarsInfo.brandMap])

  return {
    isHasCarWithGovProgram,
  }
}
