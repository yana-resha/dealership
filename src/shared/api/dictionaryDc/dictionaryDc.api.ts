import {
  GetCarListRequest,
  GetCarListResponse,
  createDictionaryDc,
} from '@sberauto/dictionarydc-proto/public'
import { UseQueryOptions, useQuery } from 'react-query'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client/client'
import { prepearCars } from 'shared/lib/prepearCars'

import { carBrands } from './dictionaryDc.mock'

const { getCarList } = createDictionaryDc(`${appConfig.apiUrl}`, Rest.request)

type NormalizedCars = {
  cars: Record<string, string[]>
}

const fetchGetCarList = (params: GetCarListRequest) =>
  getCarList({ data: params })
    .then(res => res.data ?? {})
    .catch(() => ({ cars: carBrands }))

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
