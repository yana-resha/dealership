import { useCallback } from 'react'

import { DataGetAddressSuggestions, DefaultTypeCode } from '@sberauto/dadata-proto/public'
import { AddressFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import { useGetAddressMapQuery } from './useGetAddressMapQuery'

function getAddressType(
  addressTypeMap: Record<string, string>,
  defaultAddressType: DefaultTypeCode | null | undefined,
  addressType: string | undefined,
  address: string | undefined,
) {
  // На Бэке есть валидация: if area =="" && areaType !="" {err}
  // Потому нам не нужно, что бы  при пустом area нашелся дефолтный areaType
  return address ? addressTypeMap[addressType || ''] ?? defaultAddressType?.code ?? '' : ''
}

export function usePrepareAddress() {
  const { data: addressMap = {} } = useGetAddressMapQuery()

  const prepareAddress = useCallback(
    (addressObjectData: DataGetAddressSuggestions | null | undefined) => {
      const address: AddressFrontdc = {
        postalCode: addressObjectData?.postalCode ?? '',
        regCode: addressObjectData?.regionKladrId ? addressObjectData.regionKladrId.slice(0, 2) : '',
        region: addressObjectData?.regionWithType ?? '',
        area: addressObjectData?.area ?? '',
        areaType: getAddressType(
          addressMap.areaTypeCodeMap || {},
          addressMap.defaultAreaTypeCode,
          addressObjectData?.areaTypeFull,
          addressObjectData?.area,
        ),
        city: addressObjectData?.city ?? '',
        cityType: getAddressType(
          addressMap.cityTypeCodeMap || {},
          addressMap.defaultCityTypeCode,
          addressObjectData?.cityTypeFull,
          addressObjectData?.city,
        ),
        house: addressObjectData?.house ?? '',
        houseExt: addressObjectData?.block ?? '',
        settlement: addressObjectData?.settlement ?? '',
        settlementType: getAddressType(
          addressMap.settlementTypeCodeMap || {},
          addressMap.defaultSettlementTypeCode,
          addressObjectData?.settlementTypeFull,
          addressObjectData?.settlement,
        ),
        street: addressObjectData?.street ?? '',
        streetType: getAddressType(
          addressMap.streetTypeCodeMap || {},
          addressMap.defaultStreetTypeCode,
          addressObjectData?.streetTypeFull,
          addressObjectData?.street,
        ),
        unitNum: addressObjectData?.flat ?? '',
      }

      return address
    },
    [
      addressMap.areaTypeCodeMap,
      addressMap.cityTypeCodeMap,
      addressMap.defaultAreaTypeCode,
      addressMap.defaultCityTypeCode,
      addressMap.defaultSettlementTypeCode,
      addressMap.defaultStreetTypeCode,
      addressMap.settlementTypeCodeMap,
      addressMap.streetTypeCodeMap,
    ],
  )

  return { prepareAddress }
}
