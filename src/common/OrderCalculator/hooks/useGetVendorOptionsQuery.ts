import { GetVendorOptionsRequest, GetVendorOptionsResponse } from '@sberauto/dictionarydc-proto/public'
import { UseQueryOptions, useQuery } from 'react-query'

import { getVendorOptions } from 'shared/api/requests/dictionaryDc.api'

export const useGetVendorOptionsQuery = (
  params: GetVendorOptionsRequest,
  options?: UseQueryOptions<GetVendorOptionsResponse, unknown, GetVendorOptionsResponse, string[]>,
) =>
  useQuery(['getVendorOptions'], () => getVendorOptions(params), {
    retry: false,
    cacheTime: Infinity,
    ...options,
    select: res => ({ options: res.options?.filter(o => !!o.type && !!o.optionName) || [] }),
  })
