import {
  CalculateCreditRequest,
  GetCarsListRequest,
  GetCreditProductListRequest,
  GetVendorOptionsListRequest,
  createDictionaryDc,
  OptionType,
  OptionID,
} from '@sberauto/dictionarydc-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client'

import { mockCalculateCreditResponse } from './dictionaryDc.mock'

/** С прото проблема, бэк отправляет число, но в прото преобразуется в строку,
 * поэтому приводим к изначальному виду */
function prepareOptionType(type: keyof typeof OptionType): OptionType | undefined {
  return OptionType[type] ?? undefined
}

/** С прото проблема, бэк отправляет число, но в прото преобразуется в строку,
 * поэтому приводим к изначальному виду */
function prepareOptionId(type: keyof typeof OptionID): OptionID | undefined {
  return OptionID[type] ?? undefined
}

const dictionaryDcApi = createDictionaryDc(`${appConfig.apiUrl}/dictionarydc`, Rest.request)

export const getCarsList = (params: GetCarsListRequest) =>
  dictionaryDcApi.getCarsList({ data: params }).then(res => res.data ?? {})

export const getCreditProductList = (params: GetCreditProductListRequest) =>
  dictionaryDcApi.getCreditProductList({ data: params }).then(res => res.data ?? {})

export const getVendorOptionsList = (params: GetVendorOptionsListRequest) =>
  dictionaryDcApi.getVendorOptionsList({ data: params }).then(response => {
    const additionalOptions = response.data.additionalOptions?.map(el => ({
      ...el,
      optionType: prepareOptionType(el.optionType as unknown as keyof typeof OptionType),
      optionId: prepareOptionId(el.optionId as unknown as keyof typeof OptionID),
    }))

    return { ...(response.data ?? {}), additionalOptions }
  })

export const calculateCredit = (params: CalculateCreditRequest) =>
  dictionaryDcApi.calculateCredit({ data: params }).then(res => res.data ?? {})
// .catch(() => mockCalculateCreditResponse)

export const useCalculateCreditMutation = () =>
  useMutation(['calculateCredit'], (params: CalculateCreditRequest) => calculateCredit(params))
