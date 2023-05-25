import { GetCarListRequest, GetCarListResponse } from '@sberauto/dictionarydc-proto/public'
import { UseQueryOptions, useQuery } from 'react-query'

import { fetchGetCarList } from 'shared/api/dictionaryDc/dictionaryDc.api'

import { prepearCars } from '../utils/prepearCars'

type NormalizedCars = {
  cars: Record<string, string[]>
}

export const useGetCarListQuery = (
  params: GetCarListRequest,
  options?: UseQueryOptions<GetCarListResponse, unknown, NormalizedCars, string[]>,
) =>
  useQuery(['getCarList'], () => fetchGetCarList(params), {
    retry: false,
    cacheTime: Infinity,
    select: res => prepearCars(res.cars),
    ...options,
  })
