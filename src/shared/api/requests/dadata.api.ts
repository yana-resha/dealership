import { createDaData, GetAddressSuggestionsRequest } from '@sberauto/dadata-proto/public'
import { useMutation } from 'react-query'

import { appConfig } from '../../../config'
import { Rest } from '../client'

export const DADATA_OPTIONS_LIMIT = 10

const dadataApi = createDaData(() => `${appConfig.apiUrl}/dadata`, Rest.request)

export const getAddressSuggestions = (params: GetAddressSuggestionsRequest) =>
  dadataApi.getAddressSuggestions({ data: params }).then(response => response.data ?? {})

export const useGetAddressSuggestions = () =>
  useMutation(['getAddressSuggestions'], (params: string) => getAddressSuggestions({ query: params }))
