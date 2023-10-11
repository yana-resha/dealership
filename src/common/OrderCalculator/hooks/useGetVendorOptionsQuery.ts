import {
  GetVendorOptionsListRequest,
  AdditionalOption,
  OptionType,
  OptionID,
} from '@sberauto/dictionarydc-proto/public'
import keyBy from 'lodash/keyBy'
import { UseQueryOptions, useQuery } from 'react-query'

import { getVendorOptionsList } from 'shared/api/requests/dictionaryDc.api'
import { compareStrings } from 'shared/utils/compareStrings'

type NonNullableAdditionalOption = Omit<AdditionalOption, 'optionType' | 'optionName' | 'optionId'> & {
  optionType: OptionType
  optionName: string
  optionId: OptionID
}

type NonNullableGetVendorOptionsListResponse = {
  additionalOptions: NonNullableAdditionalOption[]
}

export const useGetVendorOptionsQuery = (
  params: GetVendorOptionsListRequest,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getVendorOptionsList>>,
    unknown,
    NonNullableGetVendorOptionsListResponse,
    string[]
  >,
) =>
  useQuery(['getVendorOptionsList'], () => getVendorOptionsList(params), {
    retry: false,
    cacheTime: Infinity,
    ...options,
    select: res => {
      const additionalOptions = (res.additionalOptions || [])
        .filter(
          (option): option is NonNullableAdditionalOption =>
            typeof option.optionType !== undefined &&
            !!option.optionName &&
            typeof option.optionId !== undefined,
        )
        .sort((a, b) => compareStrings(a.optionName, b.optionName))

      const additionalOptionsMap: Record<number, NonNullableAdditionalOption> = keyBy(
        additionalOptions,
        'optionId',
      )

      return {
        additionalOptions,
        additionalOptionsMap,
      }
    },
  })
