import { DataGetAddressSuggestions } from '@sberauto/dadata-proto/public'
import { AddressFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import { AREA_TYPES, CITY_TYPES, SETTLEMENT_TYPES, STREET_TYPES } from '../config/address.config'

function getAreaType(areaTypeFull: string | undefined): string {
  return (
    AREA_TYPES.find(areaType => areaType.label.toLowerCase() === areaTypeFull?.toLowerCase())?.value ?? ''
  )
}

function getCityType(cityTypeFull: string | undefined): string {
  return (
    CITY_TYPES.find(cityType => cityType.label.toLowerCase() === cityTypeFull?.toLowerCase())?.value ?? ''
  )
}

function getSettlementType(settlementTypeFull: string | undefined): string {
  return (
    SETTLEMENT_TYPES.find(
      settlementType => settlementType.label.toLowerCase() === settlementTypeFull?.toLowerCase(),
    )?.value ?? ''
  )
}

function getStreetTypes(streetTypeFull: string | undefined): string {
  return (
    STREET_TYPES.find(streetType => streetType.label.toLowerCase() === streetTypeFull?.toLowerCase())
      ?.value ?? ''
  )
}

export function prepareAddress(
  addressObjectData: DataGetAddressSuggestions | null | undefined,
): AddressFrontdc {
  const address: AddressFrontdc = {
    postalCode: addressObjectData?.postalCode ?? '',
    regCode: addressObjectData?.regionKladrId ? addressObjectData.regionKladrId.slice(0, 2) : '',
    area: addressObjectData?.area ?? '',
    areaType: getAreaType(addressObjectData?.areaTypeFull),
    city: addressObjectData?.city ?? '',
    cityType: getCityType(addressObjectData?.cityTypeFull),
    house: addressObjectData?.house ?? '',
    houseExt: addressObjectData?.block ?? '',
    region: addressObjectData?.region ?? '',
    settlement: addressObjectData?.settlement ?? '',
    settlementType: getSettlementType(addressObjectData?.settlementTypeFull),
    street: addressObjectData?.street ?? '',
    streetType: getStreetTypes(addressObjectData?.streetTypeFull),
    unitNum: addressObjectData?.flat ?? '',
  }

  return address
}
