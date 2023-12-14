import { DataGetAddressSuggestions } from '@sberauto/dadata-proto/public'
import { AddressFrontdc } from '@sberauto/loanapplifecycledc-proto/public'

import {
  AREA_TYPES,
  CITY_TYPES,
  DEFAULT_AREA_TYPE,
  DEFAULT_CITY_TYPE,
  DEFAULT_SETTLEMENT_TYPE,
  DEFAULT_STREET_TYPE,
  SETTLEMENT_TYPES,
  STREET_TYPES,
} from '../config/address.config'

function getAreaType(areaTypeFull: string | undefined, area: string | undefined): string {
  // На Бэке есть валидация: if area==""&& areaType !="" {err}
  // Потому нам не нужно, что бы  при пустом area нашелся дефолтный areaType
  return area
    ? AREA_TYPES.find(areaType => areaType.label.toLowerCase() === areaTypeFull?.toLowerCase())?.value ??
        DEFAULT_AREA_TYPE.value
    : ''
}

function getCityType(cityTypeFull: string | undefined, city: string | undefined): string {
  // На Бэке есть валидация: if city==""&& cityType !="" {err}
  // Потому нам не нужно, что бы  при пустом city нашелся дефолтный cityType
  return city
    ? CITY_TYPES.find(cityType => cityType.label.toLowerCase() === cityTypeFull?.toLowerCase())?.value ??
        DEFAULT_CITY_TYPE.value
    : ''
}

function getSettlementType(settlementTypeFull: string | undefined, settlement: string | undefined): string {
  // На Бэке нет подобной валидации, но у нас будет для единообразия
  return settlement
    ? SETTLEMENT_TYPES.find(
        settlementType => settlementType.label.toLowerCase() === settlementTypeFull?.toLowerCase(),
      )?.value ?? DEFAULT_SETTLEMENT_TYPE.value
    : ''
}

function getStreetTypes(streetTypeFull: string | undefined, street: string | undefined): string {
  // На Бэке есть валидация: if street==""&& streetType !="" {err}
  // Потому нам не нужно, что бы  при пустом street нашелся дефолтный streetType
  return street
    ? STREET_TYPES.find(streetType => streetType.label.toLowerCase() === streetTypeFull?.toLowerCase())
        ?.value ?? DEFAULT_STREET_TYPE.value
    : ''
}

export function prepareAddress(
  addressObjectData: DataGetAddressSuggestions | null | undefined,
): AddressFrontdc {
  const address: AddressFrontdc = {
    postalCode: addressObjectData?.postalCode ?? '',
    regCode: addressObjectData?.regionKladrId ? addressObjectData.regionKladrId.slice(0, 2) : '',
    area: addressObjectData?.area ?? '',
    areaType: getAreaType(addressObjectData?.areaTypeFull, addressObjectData?.area),
    city: addressObjectData?.city ?? '',
    cityType: getCityType(addressObjectData?.cityTypeFull, addressObjectData?.city),
    house: addressObjectData?.house ?? '',
    houseExt: addressObjectData?.block ?? '',
    region: addressObjectData?.region ?? '',
    settlement: addressObjectData?.settlement ?? '',
    settlementType: getSettlementType(addressObjectData?.settlementTypeFull, addressObjectData?.settlement),
    street: addressObjectData?.street ?? '',
    streetType: getStreetTypes(addressObjectData?.streetTypeFull, addressObjectData?.street),
    unitNum: addressObjectData?.flat ?? '',
  }

  return address
}
