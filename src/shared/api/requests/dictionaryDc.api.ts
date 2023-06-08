import {
  CalculateCreditRequest,
  GetCarListRequest,
  GetCreditProductListRequest,
  GetVendorOptionsRequest,
  createDictionaryDc,
} from '@sberauto/dictionarydc-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client'

import {
  carBrands,
  creditProductListRsData,
  mockCalculateCreditResponse,
  mockGetVendorOptionsResponse,
} from './dictionaryDc.mock'

const dictionaryDcApi = createDictionaryDc(`${appConfig.apiUrl}`, Rest.request)

export const getCarList = (params: GetCarListRequest) =>
  dictionaryDcApi
    .getCarList({ data: params })
    .then(res => res.data ?? {})
    .catch(() => ({ cars: carBrands }))

export const getCreditProductList = (params: GetCreditProductListRequest) =>
  dictionaryDcApi
    .getCreditProductList({ data: params })
    .then(res => res.data ?? {})
    .catch(() => creditProductListRsData)

export const getVendorOptions = (params: GetVendorOptionsRequest) =>
  dictionaryDcApi
    .getVendorOptions({ data: params })
    .then(response => response.data ?? {})
    .catch(async () => mockGetVendorOptionsResponse)

export const calculateCredit = (params: CalculateCreditRequest) =>
  dictionaryDcApi
    .calculateCredit({ data: params })
    .then(res => res.data ?? {})
    .catch(() => mockCalculateCreditResponse)

export const useCalculateCreditMutation = () =>
  useMutation(['calculateCredit'], (params: CalculateCreditRequest) => calculateCredit(params))
