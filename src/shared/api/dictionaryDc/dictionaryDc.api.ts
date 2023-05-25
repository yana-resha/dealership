import {
  GetCarListRequest,
  GetCreditProductListRequest,
  GetVendorOptionsRequest,
  GetVendorOptionsResponse,
  createDictionaryDc,
} from '@sberauto/dictionarydc-proto/public'
import { UseQueryOptions, useQuery } from 'react-query'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client'

import { carBrands, creditProductListRsData, mockGetVendorOptionsResponse } from './dictionaryDc.mock'

const { getCarList, getCreditProductList, getVendorOptions } = createDictionaryDc(
  `${appConfig.apiUrl}`,
  Rest.request,
)

export const fetchGetCarList = (params: GetCarListRequest) =>
  getCarList({ data: params })
    .then(res => res.data ?? {})
    .catch(() => ({ cars: carBrands }))

export const fetchGetCreditProductList = (params: GetCreditProductListRequest) =>
  getCreditProductList({ data: params })
    .then(res => res.data ?? {})
    .catch(err => creditProductListRsData)

export const fetchGetVendorOptions = (params: GetVendorOptionsRequest) =>
  getVendorOptions({ data: params })
    .then(response => response.data ?? {})
    .catch(() => mockGetVendorOptionsResponse)

export const useGetVendorOptions = (
  params: GetVendorOptionsRequest,
  options?: UseQueryOptions<unknown, unknown, GetVendorOptionsResponse, string[]>,
) =>
  useQuery(['getVendorOptions'], () => fetchGetVendorOptions(params), {
    retry: false,
    cacheTime: Infinity,
    ...options,
  })
