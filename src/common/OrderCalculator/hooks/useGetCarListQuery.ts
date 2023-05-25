import { GetCarListRequest, GetCarListResponse } from '@sberauto/dictionarydc-proto/public'
import { UseQueryOptions, useQuery } from 'react-query'

import { getCarList } from 'shared/api/requests/dictionaryDc.api'

import { prepareCars } from '../utils/prepareCars'

type NormalizedCars = {
  cars: Record<string, string[]>
}

export const useGetCarListQuery = (
  params: GetCarListRequest,
  options?: UseQueryOptions<GetCarListResponse, unknown, NormalizedCars, string[]>,
) =>
  useQuery(['getCarList'], () => getCarList(params), {
    retry: false,
    cacheTime: Infinity,
    select: res => prepareCars(res.cars),
    ...options,
  })
