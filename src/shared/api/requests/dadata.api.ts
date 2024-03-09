import {
  createDaData,
  GetAddressMapRequest,
  GetAddressSuggestionsRequest,
  GetFmsUnitSuggestionsRequest,
} from '@sberauto/dadata-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from '../../../config'
import { Rest } from '../client'
import { Service } from '../constants'

export const DADATA_OPTIONS_LIMIT = 10

const dadataApi = createDaData(() => `${appConfig.apiUrl}/${Service.Dadata}`, Rest.request)

export const getAddressSuggestions = (params: GetAddressSuggestionsRequest) =>
  dadataApi.getAddressSuggestions({ data: params }).then(response => response.data ?? {})

export const getOrganizationSuggestions = (params: GetAddressSuggestionsRequest) =>
  dadataApi.getOrganizationSuggestions({ data: params }).then(response => response.data ?? {})

export const getFmsUnitSuggestions = (params: GetFmsUnitSuggestionsRequest) =>
  dadataApi.getFmsUnitSuggestions({ data: params }).then(response => response.data ?? {})

export const getAddressMap = (params: GetAddressMapRequest) =>
  dadataApi.getAddressMap({ data: params }).then(response => response.data ?? {})

export const useGetAddressSuggestions = () =>
  useMutation(['getAddressSuggestions'], (params: string) => getAddressSuggestions({ query: params }))

export const useGetOrganizationSuggestions = () =>
  useMutation(['getOrganizationSuggestions'], (params: string) =>
    getOrganizationSuggestions({ query: params }),
  )

export const useGetFmsUnitSuggestions = () =>
  useMutation(['getFmsUnitSuggestions'], (params: string) => getFmsUnitSuggestions({ query: params }))
