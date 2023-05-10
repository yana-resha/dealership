import { createDictionaryDc, GetVendorOptionsRequest } from '@sberauto/dictionarydc-proto/public'

import { appConfig } from 'config'
import { Rest } from 'shared/api/client/client'

import { mockGetVendorOptionsResponse } from '../__mocks__/apiMocks'

const dictionaryDcApi = createDictionaryDc(`${appConfig.apiUrl}`, Rest.request)

export const getVendorOptions = (params: GetVendorOptionsRequest) =>
  dictionaryDcApi
    .getVendorOptions({ data: params })
    .then(response => response.data ?? {})
    .catch(() => mockGetVendorOptionsResponse())
