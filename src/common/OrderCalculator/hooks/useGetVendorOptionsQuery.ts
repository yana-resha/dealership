import {
  GetVendorOptionsRequest,
  GetVendorOptionsResponse as GetVendorOptionsResponseProto,
  VendorOption as VendorOptionProto,
} from '@sberauto/dictionarydc-proto/public'
import { UseQueryOptions, useQuery } from 'react-query'

import { getVendorOptions } from 'shared/api/requests/dictionaryDc.api'

/* TODO DCB-389 | Прослойка добалена, потому что сейчас в протосах ручки getVendorOptions type: string,
а должен быть number */
export type VendorOption = Omit<VendorOptionProto, 'type'> & {
  type?: number
}
/* TODO DCB-389 | Прослойка добалена, потому что сейчас в протосах ручки getVendorOptions type: string,
а должен быть number */
type GetVendorOptionsResponse = Omit<GetVendorOptionsResponseProto, 'options'> & {
  options?: VendorOption[] | null
}

type RequiredVendorOptions = Required<VendorOption>
type NormalizedVendorOptions = {
  options: RequiredVendorOptions[]
}

export const useGetVendorOptionsQuery = (
  params: GetVendorOptionsRequest,
  options?: UseQueryOptions<GetVendorOptionsResponse, unknown, NormalizedVendorOptions, string[]>,
) =>
  useQuery(['getVendorOptions'], () => getVendorOptions(params), {
    retry: false,
    cacheTime: Infinity,
    ...options,
    select: res =>
      ({ options: res.options?.filter(o => !!o.type && !!o.optionName) || [] } as NormalizedVendorOptions),
  })
