import {
  CalculateCreditRequest,
  GetCarsListRequest,
  GetCreditProductListRequest,
  GetVendorOptionsListRequest,
  createDictionaryDc,
  OptionType,
  GetRequisitesForFinancingRequest,
  CalculateCreditResponse,
} from '@sberauto/dictionarydc-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from 'config'
import { CustomFetchError, Rest } from 'shared/api/client'
import { prepareOptionType } from 'shared/lib/helpers'

import { Service } from '../constants'

const dictionaryDcApi = createDictionaryDc(`${appConfig.apiUrl}/${Service.Dictionarydc}`, Rest.request)

export const getCarsList = (params: GetCarsListRequest) =>
  dictionaryDcApi.getCarsList({ data: params }).then(res => res.data ?? {})

export const getCreditProductList = (params: GetCreditProductListRequest) =>
  dictionaryDcApi.getCreditProductList({ data: params }).then(res => res.data ?? {})

export const getVendorOptionsList = (params: GetVendorOptionsListRequest) =>
  dictionaryDcApi.getVendorOptionsList({ data: params }).then(response => {
    const additionalOptions = response.data.additionalOptions?.map(el => ({
      ...el,
      optionType: prepareOptionType(el.optionType as unknown as keyof typeof OptionType),
      optionId: el.optionId,
    }))

    return { ...(response.data ?? {}), additionalOptions }
  })

export const calculateCredit = (params: CalculateCreditRequest) =>
  dictionaryDcApi.calculateCredit({ data: params }).then(res => res.data ?? {})
export const useCalculateCreditMutation = () =>
  useMutation<CalculateCreditResponse, CustomFetchError, CalculateCreditRequest, unknown>(
    ['calculateCredit'],
    (params: CalculateCreditRequest) => calculateCredit(params),
  )

export const getRequisitesForFinancing = (params: GetRequisitesForFinancingRequest) =>
  dictionaryDcApi.getRequisitesForFinancing({ data: params }).then(res => res.data ?? {})
