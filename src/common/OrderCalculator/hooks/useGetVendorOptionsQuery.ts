import {
  GetVendorOptionsListRequest,
  AdditionalOption,
  OptionType,
  Tariff,
} from '@sberauto/dictionarydc-proto/public'
import keyBy from 'lodash/keyBy'
import { UseQueryOptions, useQuery } from 'react-query'

import { getVendorOptionsList } from 'shared/api/requests/dictionaryDc.api'
import { compareStrings } from 'shared/utils/compareStrings'

export interface NonNullableTariff extends Tariff {
  tariffId: string
  tariff: string
  minClientAge: number
  maxClientAge: number
  minTerm: number
  maxTerm: number
  price: string
}

export interface NonNullableAdditionalOption extends AdditionalOption {
  optionType: OptionType
  optionName: string
  optionId: string
  tariffs?: NonNullableTariff[] | null
}

export interface BankAdditionalOption extends NonNullableAdditionalOption {
  optionType: OptionType.BANK
  tariffs: NonNullableTariff[]
}

export type NonNullableGetVendorOptionsListResponse = {
  additionalOptions: NonNullableAdditionalOption[]
}

const prepareAdditionalOptions = (options: AdditionalOption[]) =>
  options
    .reduce((acc, cur) => {
      if (typeof cur.optionType === undefined || !cur.optionName || typeof cur.optionId === undefined) {
        return acc
      }

      if (cur.optionType === OptionType.EQUIPMENT || cur.optionType === OptionType.DEALER) {
        acc.push(cur as NonNullableAdditionalOption)
      }

      if (cur.optionType === OptionType.BANK) {
        const tariffs = (cur.tariffs || []).filter(
          tariff =>
            tariff.tariffId !== undefined &&
            !!tariff.tariff &&
            tariff.minClientAge !== undefined &&
            tariff.maxClientAge !== undefined &&
            tariff.minTerm !== undefined &&
            tariff.maxTerm !== undefined &&
            !!tariff.price,
        ) as NonNullableTariff[]
        if (!tariffs?.length) {
          return acc
        }

        const bankOption = { ...cur, tariffs } as BankAdditionalOption
        acc.push(bankOption)
      }

      return acc
    }, [] as NonNullableAdditionalOption[])
    .sort((a, b) => compareStrings(a.optionName, b.optionName))

export const useGetVendorOptionsQuery = (
  params: GetVendorOptionsListRequest,
  options?: UseQueryOptions<
    Awaited<ReturnType<typeof getVendorOptionsList>>,
    unknown,
    NonNullableGetVendorOptionsListResponse,
    (string | GetVendorOptionsListRequest)[]
  >,
) =>
  useQuery(['getVendorOptionsList', params], () => getVendorOptionsList(params), {
    retry: false,
    cacheTime: Infinity,
    ...options,
    select: res => {
      const additionalOptions = prepareAdditionalOptions(res.additionalOptions || [])
      const additionalOptionsMap: Record<string, NonNullableAdditionalOption> = keyBy(
        additionalOptions,
        'optionId',
      )

      return {
        additionalOptions,
        additionalOptionsMap,
      }
    },
  })
