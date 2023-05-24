import {
  GetCreditProductListRequest,
  GetCreditProductListResponse,
  createDictionaryDc,
} from '@sberauto/dictionarydc-proto/public'
import { UseQueryOptions, useQuery } from 'react-query'

import { appConfig } from 'config'

import { Rest } from './client'

const dictionaryDcApi = createDictionaryDc(`${appConfig.apiUrl}`, Rest.request)

export const creditProductListRsDataMock = {
  fullDownpaymentMin: 100,
  fullDownpaymentMax: 300,
  fullDurationMin: 24,
  fullDurationMax: 60,
}

export const getCreditProductList = (params: any) =>
  dictionaryDcApi
    .getCreditProductList({ data: params })
    .then(res => {
      console.log('response', res)

      return res
    })
    .catch(err => ({
      ...creditProductListRsDataMock,
    }))

export const useGetCreditProductListQuery = (
  params: GetCreditProductListRequest,
  options?: UseQueryOptions<unknown, unknown, GetCreditProductListResponse, string[]>,
) =>
  useQuery(['getCreditProductList'], () => getCreditProductList(params), {
    retry: false,
    cacheTime: Infinity,
    refetchOnWindowFocus: false,
    ...options,
  })
