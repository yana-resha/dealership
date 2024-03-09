import {
  CalculateCreditRequest,
  GetCarsListRequest,
  GetCreditProductListRequest,
  GetVendorOptionsListRequest,
  createDictionaryDc,
  OptionType,
  OptionID,
  GetRequisitesForFinancingRequest,
} from '@sberauto/dictionarydc-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client'
import { prepareOptionId, prepareOptionType } from 'shared/lib/helpers'

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
      optionId: prepareOptionId(el.optionId as unknown as keyof typeof OptionID),
    }))

    return { ...(response.data ?? {}), additionalOptions }
  })

export const calculateCredit = (params: CalculateCreditRequest) =>
  dictionaryDcApi.calculateCredit({ data: params }).then(res => res.data ?? {})

export const useCalculateCreditMutation = () =>
  useMutation(['calculateCredit'], (params: CalculateCreditRequest) => calculateCredit(params))

export const getRequisitesForFinancing = (params: GetRequisitesForFinancingRequest) =>
  dictionaryDcApi.getRequisitesForFinancing({ data: params }).then(res => res.data ?? {})
